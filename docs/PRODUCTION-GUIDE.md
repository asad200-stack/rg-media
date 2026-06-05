# RG Media Platform — Production Guide

## Quick start

1. Open **Docker Desktop**
2. Double-click **`START.bat`**
3. Open **http://localhost:3000/login**
4. Sign in (see accounts below)

## Login accounts

| Email | Password | Role |
|-------|----------|------|
| admin@rgmedia.local | ChangeMe123! | Super Admin |
| manager@rgmedia.local | ChangeMe123! | Admin |
| leader@rgmedia.local | ChangeMe123! | Team Leader |
| employee@rgmedia.local | ChangeMe123! | Employee |
| client@fishbite.local | ChangeMe123! | Client Portal |

## Modules

| Page | Feature |
|------|---------|
| Dashboard | Shot/Posted counters, CSV import |
| Calendar | Google Sheet layout, May/June tabs |
| Tasks | Auto-generated workflow tasks |
| More → Kanban | Full workflow board |
| More → Shoots | Shooting schedule |
| More → Publish | Publishing calendar |
| More → Portal | Client approve/reject |
| More → Audit | Action history (Admin) |
| More → Export | CSV report download |
| More → Arabic | RTL toggle |

## API (all require JWT except login/health)

- `POST /api/v1/auth/login`
- `GET /api/v1/content`, `/tasks`, `/shoots`, `/notifications`
- `POST /api/v1/admin/import/calendar` (Admin)
- `GET /api/v1/reports/content.csv` (Admin/Leader)

## Still for native mobile (Phase 4)

- Flutter iOS/Android app → see `mobile/README.md`
- Full offline sync engine
- Push notifications (FCM)
- MFA / TOTP

The **PWA web app** covers 100% of daily operations on phone browser today.
