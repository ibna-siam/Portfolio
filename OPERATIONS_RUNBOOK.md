# Portfolio Operations Runbook & System Maintenance Guide

**Document Version:** 1.0.0  
**Effective Date:** October 2026  
**System Name:** Personal Portfolio & CMS  
**Production Domain:** [https://ibnasiam.vercel.app/](https://ibnasiam.vercel.app/)  
**Preview Domain:** [https://portfolio-cms-preview.vercel.app/](https://portfolio-cms-preview.vercel.app/)  
**Hosting Provider:** Vercel (Edge Network + Serverless Functions)  
**Database Provider:** Neon Serverless PostgreSQL (`neondb`)  
**Media Provider:** Cloudinary (`res.cloudinary.com`)  

---

## 1. Quick Reference: System Observability & Dashboards

| Subsystem | Dashboard / Tool | What to Check | Normal State |
| :--- | :--- | :--- | :--- |
| **Vercel Production** | [Vercel Dashboard](https://vercel.com/) -> Project `portfolio` | Deployments tab, Status, Domain aliases | Status: `Ready`, Alias points to `ibnasiam.vercel.app` |
| **Runtime Logs** | Vercel -> Observability -> Logs | HTTP response codes, stderr exceptions | 200/307 codes, zero uncaught 500s |
| **Real User Metrics** | Vercel -> Speed Insights | Core Web Vitals (LCP, INP, CLS) | "Good" thresholds across desktop/mobile |
| **Neon PostgreSQL** | [Neon Console](https://console.neon.tech/) -> `neondb` | Compute Status, Connection Count, Storage | Compute: `Active` / `Idle`, 0 connection exhaustion |
| **Cloudinary Media** | [Cloudinary Console](https://cloudinary.com/console) | Media Library -> `portfolio/media` | Storage quota < 80%, signed transformations active |
| **Contact Form** | [Formspree Dashboard](https://formspree.io/) | Forms -> Portfolio Contact Form | Submissions delivered, spam filter active |

---

## 2. Daily & Post-Deployment Health Inspection

### 2.1 One-Minute Remote Smoke Test
To verify the health of the live production system from any terminal:

```bash
# 1. Verify Homepage HTTPS & HTTP 200
curl -s -o /dev/null -w "%{http_code}\n" https://ibnasiam.vercel.app/
# Expected: 200

# 2. Verify Case Studies Catalog
curl -s -o /dev/null -w "%{http_code}\n" https://ibnasiam.vercel.app/case-studies
# Expected: 200

# 3. Verify Administrative Boundary Protection (Must redirect unauthenticated)
curl -s -o /dev/null -w "%{http_code}\n" https://ibnasiam.vercel.app/admin
# Expected: 307 (Redirects to /admin/login)

# 4. Verify Custom 404 Route
curl -s -o /dev/null -w "%{http_code}\n" https://ibnasiam.vercel.app/case-studies/nonexistent-case-study
# Expected: 404
```

### 2.2 Deep Automated Test Suite
From the repository root, run the comprehensive verification scripts:

```bash
# Verify database consistency and entity record counts
npm run db:verify

# Verify authentication, rate limiting, and open-redirect boundary
npm run test:auth

# Verify media upload signature and registration pipeline
npm run test:media

# Verify CMS audit logging and revision snapshotting
npm run test:cms

# Verify public data access layer and privacy invariants
npm run test:public
```

---

## 3. Investigating Runtime Incidents & 5xx Errors

If users report issues or an alert is triggered in Vercel:

### Step 1: Filter Runtime Logs in Vercel
1. Open **Vercel Dashboard** -> Project `portfolio` -> **Logs**.
2. Set query filter: `status:500..599` or `level:error`.
3. Inspect the error prefix:
   - `[AUTH]`: Auth.js credential validation or session token parsing failure.
   - `[DATABASE]`: Neon connection drop, query timeout, or pooler exhaustion.
   - `[MEDIA_SECURITY]` / `[MEDIA_ACTION]`: Invalid Cloudinary signature or upload size limit exceeded.
   - `[CMS-Audit]`: Revision snapshotting or activity logging failure.
   - `[APP_ERROR]` / `[GLOBAL_ERROR]`: Client-side Next.js render error caught by error boundary.

### Step 2: Database Connectivity Diagnostic
If errors indicate `DATABASE_URL` connectivity issues:
1. Verify Neon compute status in the Neon console. If compute is sleeping, send a probe query to wake it up.
2. Verify that `DATABASE_URL` in Vercel uses connection pooling (`-pooler` endpoint) to avoid exhaustion during traffic spikes.
3. Verify that SSL mode is enforced (`?sslmode=require`).

---

## 4. Emergency Fast Rollback Procedure (< 60 Seconds)

If a new production deployment introduces a critical regression, the deployment can be instantly rolled back using Vercel without building or pushing new code:

### 4.1 Rollback via Vercel Web Dashboard (Recommended)
1. Open **Vercel Dashboard** -> Project `portfolio` -> **Deployments**.
2. Locate the previous known-stable deployment:
   - **For Next.js stable release:** Look for commit `9387aca` (Deployment ID: `dpl_DoHEBSb7yVmwwPy4AfddNWvP8HpN`).
   - **For Legacy Vite fallback:** Look for Deployment ID: `dpl_2UwvAmE1Ppays2vLJEnWnvoVKEMc`.
3. Click the three-dots menu (`...`) next to the target deployment and select **Promote to Production** (or **Rollback to this Deployment**).
4. Confirm the promotion.
5. In **< 10 seconds**, Vercel edge routers re-route `https://ibnasiam.vercel.app/` to the selected deployment.
6. Refresh `https://ibnasiam.vercel.app/` to verify immediate recovery.

### 4.2 Rollback via Vercel CLI
```bash
# Roll back to the previous deployment immediately
vercel rollback --yes
```

---

## 5. Media Pipeline & Cloudinary Operations

### 5.1 Upload Troubleshooting
- **File formats allowed:** `.jpg`, `.jpeg`, `.png`, `.webp`.
- **Maximum file size:** 5 MB.
- **Upload signature validity:** 15 minutes.
- If uploads fail with `Invalid Signature`, ensure system clocks are synchronized and that `CLOUDINARY_API_SECRET` in Vercel matches the Cloudinary console.

### 5.2 Replacing Published Hero / Portrait Images
To update the author's portrait securely:
1. Upload the optimized portrait image to Cloudinary via the CMS Media Library or CLI script:
   ```bash
   npm run db:media:portrait
   ```
2. In the Admin CMS at `/admin/settings`, select the new image from the Media Picker.
3. Save changes. Next.js cache revalidation updates `/` immediately.

---

## 6. Administrator Access & Credential Rotation

### 6.1 Creating or Updating Administrator Credentials
Administrator credentials are never stored in plain text. Use the dedicated provisioning tool:

```bash
# Safe, idempotent creation or credential rotation
npx tsx scripts/create-admin.ts \
  --email "admin@example.com" \
  --password "YourSecurePassphraseHere123!" \
  --name "Md Ibna Siam" \
  --update
```

### 6.2 Rate Limit Unlocking
If the administrator is accidentally locked out due to repeated incorrect password entries:
- The rate limiter unlocks automatically after **15 minutes**.
- For immediate emergency unlock during development/testing, restart the serverless function or execute `resetLoginAttempts(email)` via script.
