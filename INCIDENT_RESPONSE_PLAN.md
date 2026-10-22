# Portfolio CMS Incident Response & Resilience Plan

**Document Version:** 1.0.0  
**Effective Date:** October 2026  
**System Name:** Personal Portfolio & CMS (`https://ibnasiam.vercel.app/`)  
**Scope:** Production application, database infrastructure, administrative CMS, media assets  

---

## 1. Incident Severity Classification Matrix

| Severity Level | Definition & Criteria | Target Containment | Target Resolution | Examples |
| :--- | :--- | :---: | :---: | :--- |
| **SEV-1 (Critical)** | Total outage of public portfolio, active security breach, leaked credentials/secrets, or unauthorized public content tampering. | `< 15 minutes` | `< 1 hour` | Homepage returning HTTP 500, admin role bypass, public exposure of private phone or connection strings. |
| **SEV-2 (High)** | Degradation of critical business function: case study detail pages failing, CMS admin lockout, Cloudinary asset failure across published pages. | `< 30 minutes` | `< 4 hours` | `/case-studies/[slug]` throwing runtime errors, admin unable to save edits, database read timeouts. |
| **SEV-3 (Medium)** | Partial degradation of non-critical features: Formspree contact form submission failure, draft preview banner glitch, isolated image 404. | `< 2 hours` | `< 24 hours` | Contact form submission error banner, minor style glitch on mobile table, SpeedInsights telemetry drop. |
| **SEV-4 (Low)** | Minor cosmetic or non-customer-impacting issue: internal typo in admin form, benign console warning, stale documentation. | Next sprint | Next release cycle | Admin badge color nuance, non-blocking TypeScript warning in test scripts. |

---

## 2. Incident Response Phases (Lifecycle)

```
[1. DETECT & REPORT] ──> [2. TRIAGE & CLASSIFY] ──> [3. CONTAIN & MITIGATE]
                                                               │
[6. POST-INCIDENT REVIEW] <── [5. RESOLVE & VERIFY] <── [4. ERADICATE ROOT CAUSE]
```

### Phase 1: Detection & Reporting
Incidents are surfaced via:
- Vercel error monitoring / runtime log alerts.
- Owner or visitor observation on `https://ibnasiam.vercel.app/`.
- Automated smoke test failure (`npm run db:verify` or `test-public-pipeline.ts`).

### Phase 2: Triage & Classification
1. Confirm reproduction on `https://ibnasiam.vercel.app/`.
2. Check Vercel Deployment status (is it an error in the latest commit?).
3. Assign severity level (SEV-1 through SEV-4).
4. Notify the project owner via direct message/email.

### Phase 3: Containment Protocols

#### Containment Protocol A: Emergency Production Rollback (For SEV-1 Outages)
If a recent deployment broke the site:
1. Immediately execute Vercel rollback in Vercel Dashboard:
   - Navigate to Project `portfolio` -> Deployments -> Select last stable deployment (`dpl_DoHEBSb7yVmwwPy4AfddNWvP8HpN` or legacy Vite `dpl_2UwvAmE1Ppays2vLJEnWnvoVKEMc`).
   - Click **Promote to Production**.
2. Recovery occurs at edge in < 10 seconds.

#### Containment Protocol B: Credential Revocation (For Accidental Secret Leakage)
If `AUTH_SECRET`, `DATABASE_URL`, or `CLOUDINARY_API_SECRET` is suspected of being exposed:
1. Immediately rotate the affected secret in the provider dashboard (Neon / Cloudinary / Auth.js).
2. Update the environment variable in Vercel Project Settings.
3. Trigger a fresh production deployment.
4. Review access logs in Neon and Vercel for suspicious IPs.

#### Containment Protocol C: Database Read-Only / Maintenance Mode (For Data Corruption)
If unexpected CMS updates or corruption occur:
1. In Neon Console, review `activity_logs` and `content_revisions` to identify the timestamp of the corrupt mutation.
2. Spin up a point-in-time branch at timestamp `T-1` (refer to [BACKUP_AND_RECOVERY_PLAN.md](file:///d:/Project/portfolio%20siam/BACKUP_AND_RECOVERY_PLAN.md)).
3. Re-point Vercel to the restored branch.

### Phase 4: Root-Cause Investigation & Eradication
1. **Preserve Forensic Evidence:**
   - Download Vercel runtime logs for the incident window.
   - Query Neon `activity_logs` table:
     ```sql
     SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT 50;
     ```
   - Export commit history and recent PR diffs.
2. **Develop Minimal Targeted Fix:**
   - Reproduce the failure locally on branch `main` or a hotfix branch.
   - Run `npm run type-check`, `npm run lint`, and relevant test suites.
   - Verify that financial disclosures (VAL-07 through VAL-11) remain unaffected.

### Phase 5: Verification & Normalization
1. Deploy hotfix to Vercel Preview first.
2. Run automated remote smoke tests:
   ```bash
   npm run db:verify
   npm run test:auth
   npm run test:public
   ```
3. Request owner authorization.
4. Promote hotfix to production.
5. Monitor Vercel runtime logs for 30 minutes to confirm zero residual 5xx errors.

### Phase 6: Post-Incident Review (PIR)
Within 48 hours of resolving a SEV-1 or SEV-2 incident, complete a blameless Post-Incident Review covering:
1. **Summary & Timeline:** Timestamp of detection, containment, and resolution.
2. **Root Cause Analysis (5 Whys):** Technical and procedural factors.
3. **What Went Well:** Swift rollback, accurate error boundaries, zero data loss.
4. **Where We Got Lucky:** Edge cache served static fallback, rapid owner notification.
5. **Action Items:** Preventive automated tests, schema constraints, or monitoring alerts added.

---

## 3. Communication Templates

### 3.1 Initial Incident Notification (To Project Owner)
```markdown
**INCIDENT ALERT — SEV-[1/2/3]**
- **System Affected:** Portfolio Production (ibnasiam.vercel.app)
- **Status:** Investigating / Containing
- **Observed Behavior:** [Brief description of 5xx, broken route, or failure]
- **Immediate Action Taken:** [e.g., Initiated rollback / Investigating runtime logs]
- **Next Update In:** [15 / 30 minutes]
```

### 3.2 Resolution Notification
```markdown
**INCIDENT RESOLVED — SEV-[1/2/3]**
- **System Affected:** Portfolio Production (ibnasiam.vercel.app)
- **Status:** Fully Restored & Verified
- **Resolution Summary:** [e.g., Hotfix deployed / Restored from point-in-time branch]
- **Verification:** All 52 remote checks passing; 0 5xx errors in last 30 minutes.
- **Follow-up:** PIR will be prepared within 48 hours.
```
