# SAMADHAN CONNECT — SECURITY ARCHITECTURE & AUDIT GUIDE

This document details the security posture, Row Level Security (RLS) enforcement, authentication guardrails, and key management practices implemented for **Samadhan Connect**.

---

## 1. Zero Frontend Privilege Trust Principle

In Samadhan Connect, **the database is the ultimate authority**. The frontend never makes security decisions that cannot be verified by PostgreSQL.

```text
Attacker Tries Manipulated Request in Browser
                   ↓
    Supabase API (HTTPS / GraphQL)
                   ↓
      PostgreSQL RLS Engine
                   ↓
   auth.uid() Checked Against Row Owner & Role
                   ↓
          [ 403 FORBIDDEN ]
```

---

## 2. Row Level Security (RLS) Policies Breakdown

| Table | Operation | Policy Rule |
| :--- | :--- | :--- |
| `profiles` | `SELECT` | Public fields are viewable; private fields (phone/email) are viewable by owner, `GOVERNMENT`, or `ADMIN`. |
| `profiles` | `UPDATE` | `auth.uid() = id` (Users can only modify their own profile). |
| `challenges` | `SELECT` | `status != 'DRAFT' OR created_by = auth.uid()` |
| `challenges` | `INSERT` | Authenticated users with valid profile (`auth.uid() = created_by`). |
| `challenges` | `UPDATE` | Drafts by owner; verification/status transitions restricted to `GOVERNMENT` and `ADMIN`. |
| `solutions` | `INSERT` | Authenticated `STUDENT`, `UNIVERSITY`, or `RESEARCHER`. |
| `solutions` | `UPDATE` | Proposer while in `SUBMITTED` state; evaluation restricted to `GOVERNMENT` and `ADMIN`. |
| `projects` | `UPDATE` | Project lead, assigned team members, faculty mentor, or `ADMIN`. |
| `messages` | `SELECT / INSERT` | Restricted strictly to members present in `conversation_members`. |
| `notifications` | `SELECT / UPDATE` | `auth.uid() = user_id` (No user can view another user's notifications). |

---

## 3. Secret & Key Management

1. **`VITE_SUPABASE_ANON_KEY`**:
   - Safe for client distribution in the React application.
   - Operates with the `anon` / `authenticated` PostgreSQL role subject to all RLS policies.
2. **`SUPABASE_SERVICE_ROLE_KEY`**:
   - **MUST NEVER BE EXPOSED IN CLIENT-SIDE CODE OR `.env` ACCESSIBLE BY VITE.**
   - Kept exclusively in Supabase Cloud Dashboard $\rightarrow$ Settings $\rightarrow$ API, or inside serverless Edge Functions.
3. **AI Secrets (e.g. Gemini / OpenAI)**:
   - Kept server-side inside Supabase Edge Functions (`supabase/functions/ai-problem-classifier`).
   - Client invokes the edge function via authenticated session tokens; secret keys are never transferred over the wire to the browser.
