# Neon Database Backup, Recovery & Disaster Readiness Plan

**Document Version:** 1.0.0  
**Effective Date:** October 2026  
**Target System:** Personal Portfolio CMS (`https://ibnasiam.vercel.app/`)  
**Database Engine:** Neon Serverless PostgreSQL (`neondb`)  
**ORM / Schema Layer:** Drizzle ORM (`src/lib/db/schema.ts`)  
**Host Cloud:** AWS us-east-1 (Washington D.C.)  

---

## 1. Executive Summary & Objective

This plan establishes verified operational procedures for disaster recovery, data corruption mitigation, and business continuity for the database-backed Next.js portfolio application. It covers database snapshots, Neon branching, logical exports, isolated recovery testing, and post-restore integrity audits.

---

## 2. Platform Capabilities vs. Verified Configuration

| Capability | Verified Platform Architecture | Operational Constraints & Plan Nuances |
| :--- | :--- | :--- |
| **Storage Architecture** | Multi-tenant compute separated from serverless Page Server storage nodes | Compute nodes shut down on idle; storage is persistent across compute instances. |
| **Point-in-Time Recovery (PITR)** | Continuous Write-Ahead Log (WAL) streaming | Retention period depends on Neon tier: Free tier retains **24 hours**; Launch / Scale tiers retain up to **7 to 30 days**. |
| **Instant Branching** | Copy-on-Write (CoW) point-in-time branch creation | Instantaneous (< 10 seconds), zero data duplication for unchanged pages, safe for isolated recovery. |
| **Logical Backup Utility** | Standard PostgreSQL `pg_dump` via `DATABASE_URL_UNPOOLED` | Requires direct unpooled TCP connection string; connection pooling endpoints (`-pooler`) are incompatible with long-running dumps. |
| **High Availability** | Serverless automatic failover and page replica quorum | Managed transparently by Neon storage layer across AWS availability zones. |

---

## 3. Recovery Objectives (Proposed Targets)

> [!NOTE]
> The following metrics are proposed operational targets based on architectural benchmarks and require periodic empirical disaster simulation tests to formally certify.

- **Target Recovery Point Objective (RPO):** `< 15 minutes`  
  *In the event of accidental data corruption or catastrophic deletion, no more than 15 minutes of administrative CMS edits are lost. (With Neon continuous WAL streaming within the active retention window, technical RPO is effectively 0 seconds for point-in-time branching).*
- **Target Recovery Time Objective (RTO):** `< 30 minutes`  
  *From incident declaration to restoration of a fully verified, operational database servicing the live Next.js portfolio application.*

---

## 4. Backup Strategy & Procedures

### 4.1 Automated Continuous Snapshots (Neon WAL PITR)
Neon automatically logs all database transactions to persistent storage. No cron job or manual snapshot trigger is required for WAL capture.
- **Active Branch:** `main` (Head branch)
- **Snapshot Granularity:** Transaction-level point-in-time timestamps.
- **Action Required:** None for capture; verify retention window in Neon Console monthly.

### 4.2 Logical Backups (`pg_dump`)
Prior to major schema migrations, framework updates, or substantial bulk content revisions, generate a self-contained SQL dump:

```bash
# Execute using the direct unpooled connection string
pg_dump "$DATABASE_URL_UNPOOLED" \
  --format=custom \
  --no-owner \
  --no-privileges \
  --file="backup_portfolio_$(date +%Y%m%d_%H%M%S).dump"
```

To export as plain text SQL for disaster inspection:
```bash
pg_dump "$DATABASE_URL_UNPOOLED" \
  --schema=public \
  --clean \
  --if-exists \
  --file="backup_portfolio_$(date +%Y%m%d_%H%M%S).sql"
```

---

## 5. Recovery Procedure (Step-by-Step)

```
[INCIDENT DECLARED]
        │
        ▼
[Step 1: Freeze CMS Mutations] (Set maintenance mode or restrict admin access)
        │
        ▼
[Step 2: Create Isolated Recovery Branch in Neon] (Copy-on-Write from timestamp T-1)
        │
        ▼
[Step 3: Point Preview / Staging Environment to Recovery Branch]
        │
        ▼
[Step 4: Execute Automated Integrity Audit (`npm run db:verify`)]
        │
        ▼
[Step 5: Owner Review & Authorization]
        │
        ▼
[Step 6: Promote Recovery Branch to Production in Vercel]
        │
        ▼
[Step 7: Post-Recovery Production Smoke Test]
```

### Step 1: Freeze CMS Mutations
1. Inform the project owner that an incident is underway.
2. In Vercel Project Settings, disable the Preview/CMS administrative access or revoke active admin sessions to ensure no conflicting mutations occur while evaluating recovery state.

### Step 2: Create Isolated Recovery Branch in Neon
Never attempt in-place destructive repairs on the live production database branch without an isolated dry-run:
1. Open the [Neon Console](https://console.neon.tech/).
2. Navigate to **Branches** -> **Create Branch**.
3. Select **Parent Branch:** `main`.
4. Choose **Create from a point in time** -> Specify timestamp prior to corruption event (e.g., `2026-10-22 14:30:00 UTC`).
5. Set **Branch Name:** `recovery-validation-yyyy-mm-dd`.
6. Copy the connection string for this new branch (`DATABASE_URL_RECOVERY`).

### Step 3: Run Automated Read-Only Verification Audit
In your isolated staging environment, verify the recovery branch before touching production:

```bash
# Set environment variable to the recovery branch connection string
export DATABASE_URL="postgres://...@ep-...-recovery.us-east-1.aws.neon.tech/neondb?sslmode=require"

# Run automated integrity audit
npm run db:verify
```

### Step 4: Verification Checklist of Restored Entities
The restore must confirm the exact presence of all portfolio invariants:

- [ ] **Site Settings (`site_settings`):** Exactly 1 record. Verify `owner_name = "Md Ibna Siam"`, education at Daffodil International University, and confirmed privacy guardrail (`phone_privacy_status = 'hidden'`).
- [ ] **Case Studies (`case_studies`):** Exactly 8 published case studies:
  1. `square-pharmaceuticals-financial-analysis`
  2. `agrofab-master-budget-simulation`
  3. `individual-income-tax-return-ay2023-24`
  4. `styletex-rmg-costing-cvp-analysis`
  5. `dhakashop-retail-internal-audit`
  6. `fifa-world-cup-macroeconomic-impact`
  7. `digital-economy-bangladesh-analysis`
  8. `macroeconomics-inflation-business-cycle`
- [ ] **Financial Schedules (`financial_schedules`):** Exactly 9 heterogeneous tabular schedules with headers, rows, and `.tabular-nums` formatting.
- [ ] **Integrity & Discrepancy Disclosures (`case_study_discrepancies`):**
  - **VAL-08:** Square Pharma 8% overhead proposal disclosure.
  - **VAL-09:** Individual income tax arithmetic discrepancy disclosure.
  - **VAL-10:** StyleTex contribution margin divergence disclosure.
  - **VAL-11:** FIFA World Cup research framing disclosure.
- [ ] **Competencies Matrix (`competencies`):** Exactly 16 published accounting and finance competencies.
- [ ] **Academic Milestones (`academic_milestones`):** Exactly 3 chronological milestones.
- [ ] **Tech Solutions (`tech_solutions`):** Exactly 3 business software solutions.
- [ ] **Media Assets (`media_assets`):** All Cloudinary asset references intact.
- [ ] **Admin Users (`users`):** Authenticated administrator credentials intact.

### Step 5: Cutover to Restored Database
Once the owner reviews and authorizes the verified state:
1. In Neon Console, either:
   - Rename the verified recovery branch to `main` (or set as default branch), OR
   - Update `DATABASE_URL`, `DATABASE_URL_POOLED`, and `DATABASE_URL_UNPOOLED` in Vercel Production Environment Variables.
2. Trigger an immediate redeployment in Vercel to invalidate edge caches:
   ```bash
   vercel redeploy --prod
   ```
3. Run the live production smoke test script against `https://ibnasiam.vercel.app/`.

---

## 6. Testing & Maintenance Cadence

1. **Quarterly Recovery Drill:** Create an isolated point-in-time branch and run `npm run db:verify` in staging to confirm that WAL replay and branch spin-up operate within the 30-minute RTO.
2. **Pre-Migration Export:** Run a logical `pg_dump` prior to applying any new Drizzle migration.
3. **Retention Verification:** Check Neon tier billing and retention metrics every 6 months to ensure retention matches organizational requirements.
