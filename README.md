# RCMS — Reading Community Management System

> **Milestone 1** · Organizer Dashboard + Member Management  
> React · Vite · TypeScript · Tailwind CSS · Google Sheets

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server (uses mock data by default)
npm run dev

# 3. Open http://localhost:5173
```

The app ships with 15 realistic seed members in demo mode. No setup needed.

---

## Connecting to Google Sheets

### Step 1 — Prepare your Google Sheet

Create a Google Sheet with **two tabs**:

| Tab name | Purpose |
|---|---|
| `Members_Raw` | Google Form responses auto-fill here |
| `Members` | Canonical member records (managed by the app) |

Link your Google Form to this Sheet (Form → Responses → Link to Sheets).

### Step 2 — Deploy the Apps Script

1. In your Google Sheet: **Extensions → Apps Script**
2. Delete any existing code and paste the contents of `scripts/apps-script/Code.gs`
3. Click **Deploy → New Deployment**
   - Type: **Web App**
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy** → copy the **Web App URL**
5. In Apps Script editor: **Project Settings (gear) → Script Properties**
   - Add: `API_TOKEN` = `your-secret-token` (any string you choose)

### Step 3 — Configure RCMS

Open the app → **Settings** and paste:
- **Apps Script URL** — from Step 2
- **API Token** — the token you set in Script Properties

Click **Save & Connect**. Then click **Sync from Google Forms**.

---

## Google Form Field Mapping

Your Google Form should have these questions **in this order**:

| # | Question | Notes |
|---|---|---|
| 1 | Full Name | Short answer |
| 2 | Email Address | Short answer |
| 3 | Phone Number | Short answer |
| 4 | City | Short answer |
| 5 | Reading Interests | Checkboxes (multi-select) |

> If your Form fields are in a different order, update the column indices in `Code.gs` inside the `syncMembersFromForms()` function.

---

## Project Structure

```
src/
├── types/          # TypeScript interfaces (Member, SyncState, etc.)
├── constants/      # Config values, enums
├── adapters/       # Data source adapters (Mock + Google Sheets)
├── services/       # Business logic + caching
├── stores/         # Zustand state management
├── hooks/          # useMembers, useSync, etc.
├── components/
│   ├── layout/     # AppShell, Sidebar, TopBar
│   ├── ui/         # Button, Badge, Toast, etc.
│   ├── stats/      # StatCard
│   └── members/    # MemberTable, MemberForm, MemberStatusBadge
└── pages/
    ├── Dashboard/  # Overview with stats and recent members
    ├── Members/    # List, Detail, Add
    └── Settings/   # Data source configuration
```

---

## Architecture: The Adapter Pattern

All data access goes through a **service layer** → **adapter interface**. This means switching from Google Sheets to Supabase in Phase 2 requires changing **one file** (`adapter.factory.ts`), not your components.

```
Pages → Hooks → Services → Adapter → Data Source
                              ↑
                    Mock (dev) | Sheets (v1) | Supabase (v2)
```

---

## Feature Checklist

### Milestone 1 ✅
- [x] Google Forms → Google Sheets → App sync
- [x] Auto-generated Community IDs (RC-001, RC-002…)
- [x] Members list with search, filter by status/city/interest, sortable columns
- [x] Member detail page with editable status and notes
- [x] Add member manually
- [x] Delete member (with confirmation)
- [x] Export filtered members to CSV
- [x] Dashboard: total, active, new this month, pending members
- [x] Dashboard: recent members, top interests, city distribution
- [x] Dashboard: status breakdown with visual bar
- [x] 5-minute localStorage cache (reduces API calls)
- [x] Toast notifications for all actions
- [x] Mobile-responsive design with slide-out sidebar
- [x] Settings page for data source configuration
- [x] Adapter pattern (Mock → Sheets → Supabase without rewrite)

### Milestone 2 (Phase 2 — Planned)
- [ ] Supabase database migration
- [ ] Authentication (organizer login)
- [ ] Library management (books)
- [ ] Borrowing system
- [ ] Event management
- [ ] Attendance tracking

---

## Deployment (Vercel)

```bash
npm run build        # builds to /dist
```

Push to GitHub, connect to Vercel, and set environment variables:
- `VITE_APPS_SCRIPT_URL`
- `VITE_API_TOKEN`

---

## License

MIT — Free to use for your reading community.
