# SolarHome Planner — MVP (Preview)

This patch creates a minimal Next.js TypeScript MVP for the SolarHome Planner.

## Quick start

1. Apply the patch:

```bash
# save the patch as solarhome-mvp.diff
git apply solarhome-mvp.diff
```

2. Install:

```bash
npm ci
```

3. Run dev server:

```bash
npm run dev
```

4. Open `http://localhost:3000`

## Notes
- API routes use an in-memory preview store via `process.env.solarhome_preview_projects`. This is for local preview only.
- Replace with Supabase server client for production.

