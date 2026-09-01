# SAMADHAN CONNECT — PRODUCTION DEPLOYMENT GUIDE

This guide walks through deploying **Samadhan Connect** to **Vercel / Netlify** with a managed **Supabase PostgreSQL Cloud Backend**.

---

## 1. Supabase Cloud Backend Setup

1. Go to [supabase.com](https://supabase.com) and create a new project (e.g. `samadhan-connect-jharkhand`).
2. Open the **SQL Editor** tab in the Supabase Dashboard.
3. Paste and run the entire contents of [`supabase/migrations/20260902000001_samadhan_schema.sql`](file:///d:/samadhanconnect/supabase/migrations/20260902000001_samadhan_schema.sql).
4. Paste and run the RLS policies in [`supabase/migrations/20260902000002_rls_policies.sql`](file:///d:/samadhanconnect/supabase/migrations/20260902000002_rls_policies.sql).
5. Paste and run [`supabase/seed.sql`](file:///d:/samadhanconnect/supabase/seed.sql) to seed the 24 districts of Jharkhand and civic problem categories.
6. In **Storage**, verify that the following buckets exist or create them with public/authenticated read:
   - `challenge-evidence`
   - `solution-documents`
   - `project-assets`
   - `avatars`
7. Go to **Project Settings $\rightarrow$ API** and copy:
   - `Project URL`
   - `anon public key`

---

## 2. Deploying Frontend to Vercel

1. Push your code to GitHub / GitLab.
2. Log in to [Vercel](https://vercel.com) $\rightarrow$ Click **"Add New Project"**.
3. Import the `samadhanconnect` repository.
4. Set the **Framework Preset** to `Vite`.
5. Under **Environment Variables**, add:
   - `VITE_SUPABASE_URL` = `https://your-project.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `your-actual-anon-key`
6. Click **Deploy**. Vercel will build and publish your application in under 60 seconds!

---

## 3. Local Development Command Summary

| Command | Purpose |
| :--- | :--- |
| `npm run dev` | Starts local development server at `http://localhost:5173/` |
| `npm run build` | Builds production-optimized bundle in `dist/` |
| `npm run preview` | Previews production build locally |
