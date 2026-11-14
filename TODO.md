# TODO

- [ ] **Project screenshots and recordings**: capture real screens for each project (SalatHub, CureVision, Mailcamp, Beyond Presence). The device frames, the Screens section and the homepage previews are built: drop files in `apps/web/public/work/<slug>/` and list them under the project's `media` in `packages/content/src/data.ts`.
- [x] **Résumé PDF**: built from [sudo-umair/resume](https://github.com/sudo-umair/resume) and synced to `apps/web/public/resume.pdf` automatically (`.github/workflows/sync-resume.yml`).
- [x] **cureVision case study**: architecture and key decisions (from an interview and public sources).
- [x] **Beyond Presence case study**: architecture and key decisions, mapped from the creator frontend, call frontend and design system source and git history.
- [ ] **Custom domain** (optional): add it to Vercel, verify it in Resend for the contact sender, and update `NEXT_PUBLIC_SITE_URL`.
