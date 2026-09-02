# Implementation Plan: Backend Authentication & Database Integration

This implementation plan outlines the architecture, database schema, security policies, and frontend integration required to connect and operate the live backend authentication and PostgreSQL database for **Samadhan.Connect (Govt. of Jharkhand)**.

---

## 1. Overview & Architecture

Samadhan.Connect is engineered with a **Dual-Mode Backend Architecture**:
1. **Live Cloud Mode (Supabase / PostgreSQL)**: Activated automatically when `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are provided in `.env`. Provides full JWT authentication, encrypted credentials, Row Level Security (RLS), atomic upvotes, and real-time database subscriptions.
2. **Resilient Local Mode (Zero-Config Fallback)**: Activated when environment variables are omitted or in offline evaluation environments. Provides instant persona switching, local state persistence, and mock data across all 5 workspace phases.

```mermaid
flowchart TD
    A[Citizen / Officer / Innovator] -->|Enters Credentials / Selects Persona| B[LoginPage.jsx]
    B -->|Calls login/register| C[AuthContext.jsx]
    C -->|Checks isConfiguredSupabase| D{Supabase Configured?}
    
    D -->|YES| E[Supabase Auth Gateway]
    E -->|Verifies Password / Issues JWT| F[PostgreSQL profiles table]
    F -->|Fetches Role: CITIZEN / GOV / etc.| G[Role-Based Dashboard Redirect]
    
    D -->|NO (Offline Demo)| H[Local Mock Database Engine]
    H -->|Simulates Persona Session| G
```

---

## 2. Proposed Changes & Implementation Steps

### Component 1: Database Migration & Schema Setup

Ensure all database tables, extensions, enums, triggers, and RPC functions are executed on the Supabase PostgreSQL instance.

#### [NEW / VERIFIED] [20260902000001_samadhan_schema.sql](file:///d:/samadhanconnect/supabase/migrations/20260902000001_samadhan_schema.sql)
- Defines the core custom types: `user_role`, `challenge_status`, `urgency_level`, `solution_status`, `project_phase`, `task_status`.
- Creates 12 relational tables: `profiles`, `districts`, `categories`, `challenges`, `challenge_evidence`, `solutions`, `projects`, `project_members`, `project_tasks`, `sponsorships`, `conversations`, `messages`, `notifications`, `telemetry_readings`.
- Configures `handle_new_user()` trigger on `auth.users` to automatically synchronize new signups into `public.profiles`.
- Implements `increment_upvotes(row_id)` concurrency-safe RPC function.

#### [NEW / VERIFIED] [20260902000002_rls_policies.sql](file:///d:/samadhanconnect/supabase/migrations/20260902000002_rls_policies.sql)
- Enables Row Level Security (RLS) across all tables.
- Restricts challenge grading and solution approval to `GOVERNMENT` and `ADMIN` roles.
- Restricts conversation messages and notifications to authorized participants.

#### [NEW / VERIFIED] [seed.sql](file:///d:/samadhanconnect/supabase/seed.sql)
- Seeds all 24 Jharkhand Districts (`Ranchi`, `Dhanbad`, `Palamu`, `Bokaro`, `East Singhbhum`, etc.).
- Seeds 8 Civic Categories (`Water Supply`, `Healthcare`, `Environment`, etc.).
- Seeds sample verified challenges and 5-phase prototype projects for instant testing.

---

### Component 2: Environment Configuration

#### [MODIFY] [.env.example](file:///d:/samadhanconnect/.env.example) & [.env](file:///d:/samadhanconnect/.env)
- Standardize environment variables required for the Supabase JavaScript Client.

```env
# Supabase Backend Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### Component 3: Authentication Context & Service Layer

#### [VERIFY] [src/services/supabase.js](file:///d:/samadhanconnect/src/services/supabase.js)
- Initializes `@supabase/supabase-js` client.
- Exports `isConfiguredSupabase()` utility to seamlessly detect cloud vs. local mode.

#### [VERIFY] [src/context/AuthContext.jsx](file:///d:/samadhanconnect/src/context/AuthContext.jsx)
- Handles `login(email, password, roleHint)`:
  1. Calls `supabase.auth.signInWithPassword({ email, password })`.
  2. Subscribes to `onAuthStateChange` events for session persistence.
  3. Queries `public.profiles` to resolve the user's role and departmental credentials.
- Handles `register(email, password, fullName, role)`:
  1. Calls `supabase.auth.signUp({ email, password, options: { data: { full_name, role } } })`.
- Handles `logout()`: Clears active sessions and local authentication caches.

---

### Component 4: Authentication UI & Routing

#### [VERIFY] [src/pages/LoginPage.jsx](file:///d:/samadhanconnect/src/pages/LoginPage.jsx)
- Plain-language persona selector with 5 dedicated profile cards (*Citizen*, *Government / Department*, *University*, *Industry / CSR*, *Innovator*).
- Live validation for email formats and 10-digit mobile numbers.
- Accessible password visibility toggle.
- Dynamic CTA (*"Sign in as Citizen →"*, *"Sign in as Government →"*).
- Automatic redirection to the target role route upon successful authentication:
  - `CITIZEN` $\longrightarrow$ `/challenges`
  - `GOVERNMENT` $\longrightarrow$ `/dashboard/government`
  - `UNIVERSITY` $\longrightarrow$ `/universities`
  - `INDUSTRY` $\longrightarrow$ `/industries`
  - `STUDENT` $\longrightarrow$ `/projects/proj-001`

---

## 3. User Review Required

> [!IMPORTANT]
> **Supabase Project Execution**: To use the live backend, you must run the SQL scripts in [`supabase/migrations/`](file:///d:/samadhanconnect/supabase/migrations/) inside your Supabase SQL Editor and populate your credentials in `.env`. If `.env` is omitted, the platform will automatically run in local simulated mode with no setup required.

> [!NOTE]
> **Email Confirmation Setting**: In development/testing environments, it is recommended to disable "Confirm email" under **Supabase Dashboard $\rightarrow$ Authentication $\rightarrow$ Providers $\rightarrow$ Email** so newly registered accounts can log in immediately.

---

## 4. Verification Plan

### Automated Build Verification
- Run `npm run build` to confirm zero compilation errors or broken imports.

### Manual Authentication Testing Matrix

| Test Scenario | Action | Expected Result |
| :--- | :--- | :--- |
| **Persona Switching** | Click "Government / Department" chip | Input fills default email and updates CTA to "Sign in as Government / Department →" |
| **Form Validation** | Submit empty fields or invalid email | Displays clear, human-readable alert: *"Please enter your email or mobile number."* |
| **Password Toggle** | Click the eye icon | Toggles password field input type between `password` and `text`. |
| **Offline Demo Login** | Click "Sign In" with default credentials (no `.env`) | Authenticates instantly and routes to the role dashboard. |
| **Live Supabase Login** | Populate `.env` with Supabase keys and log in | Generates live JWT session and synchronizes profile from PostgreSQL. |
| **Government Triage Queue** | Log in as Government and navigate to `/dashboard/government` | Shows protected Nodal Officer review queue with SLA counters. |
