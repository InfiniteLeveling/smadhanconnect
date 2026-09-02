# Samadhan.Connect — Full Workflows & Flow Charts Specification

This document provides a comprehensive breakdown of all operational, technical, and algorithmic workflows in **Samadhan.Connect**, accompanied by Mermaid flow charts.

---

## 1. Master Civic Problem-Solving Workflow (5-Stakeholder Swimlane)

```mermaid
sequenceDiagram
    autonumber
    actor Citizen
    actor Nodal as Nodal Officer
    actor Student as Student / Innovator
    actor Faculty as University / Faculty
    actor Industry as Industry / CSR
    actor AI as Samadhan AI

    %% Step 1: Problem Submission
    Citizen->>AI: Consults AI on category & civic rights
    AI-->>Citizen: Recommends domain, schemes & guidelines
    Citizen->>Nodal: Submits Problem (Location, Photos, Urgency)
    
    %% Step 2: Verification
    critical Verification & Triaging
        Nodal->>Nodal: Inspects ground reality & jurisdiction
        Nodal-->>Citizen: Approves & converts to "Active Challenge"
    end

    %% Step 3: Solution & Mentorship
    Student->>Faculty: Drafts Technical Proposal & Prototype Plan
    Faculty-->>Student: Reviews & Academic Endorsement
    Student->>Nodal: Submits Innovation Solution on Platform

    %% Step 4: CSR Funding
    Industry->>Industry: Evaluates Project Budget & Impact ROI
    Industry->>Nodal: Pledges CSR Grant / Milestone Funding
    
    %% Step 5: Implementation & Signoff
    Student->>Citizen: Ground Deployment & Prototype Installation
    Nodal->>Citizen: Field Audit & Verification
    Citizen-->>Nodal: Confirms Problem Solved (Satisfaction Rating)
    Nodal->>Student: Releases Milestone Completion Certificate
```

---

## 2. End-to-End System Architecture Data Flow

```mermaid
flowchart TD
    subgraph ClientTier["1. CLIENT TIER (React 19 + Vite SPA)"]
        UI_Home["Landing Page / Hero Card"]
        UI_Problems["Problem Explorer & Reporting"]
        UI_Chat["Messaging & Samadhan AI Interface"]
        UI_Admin["Admin & Super Admin Panel"]
        UI_Workspaces["Role-Specific Dashboards"]
    end

    subgraph APITier["2. API GATEWAY & SECURITY TIER"]
        VercelAPI["Vercel Serverless (/api/chat.js)"]
        ViteDev["Vite Dev Middleware (Localhost)"]
        SecCheck{"Server Secret<br/>Isolation Check"}
        RateLimiter["Rate Limiting & Input Validation"]
    end

    subgraph DataTier["3. DATABASE & PERSISTENCE TIER (Supabase)"]
        AuthService["Supabase Auth (JWT & OAuth)"]
        PG_DB[("PostgreSQL Database")]
        RLS["Row Level Security (RLS) Engine"]
        Triggers["Database Triggers (Auto-Profiles)"]
    end

    subgraph AITier["4. ARTIFICIAL INTELLIGENCE TIER"]
        GeminiPro["Google Gemini 2.5 Pro"]
        GeminiFlash["Google Gemini 2.5 Flash"]
        LocalEngine["Intelligent Civic Knowledge Engine"]
        PromptConfig["25-Domain Strict System Prompt"]
    end

    %% Connections
    UI_Home -->|OAuth Login| AuthService
    UI_Problems -->|CRUD via dataService| RLS
    UI_Chat -->|POST /api/chat| VercelAPI
    UI_Chat -.->|Dev Mode| ViteDev

    VercelAPI --> SecCheck
    ViteDev --> SecCheck
    SecCheck --> RateLimiter

    RateLimiter -->|Live API Key| PromptConfig
    PromptConfig --> GeminiPro
    GeminiPro -.->|Failover| GeminiFlash
    RateLimiter -->|No API Key / Offline| LocalEngine

    AuthService --> Triggers
    Triggers --> PG_DB
    RLS --> PG_DB
```

---

## 3. User Authentication & Role Onboarding Flow

```mermaid
flowchart TD
    Start([User Arrives at Platform]) --> ClickOAuth[User clicks 'Sign in with Google' or 'Sign in with GitHub']
    ClickOAuth --> SupaOAuth[Supabase OAuth 2.0 Provider Handlers]
    SupaOAuth --> TokenGen[JWT Session Created & Stored in LocalStorage]
    
    TokenGen --> DBTrigger{Does profile exist<br/>in PostgreSQL 'profiles'?}
    DBTrigger -- No --> CreateProfile[Trigger creates basic profile with name & email]
    DBTrigger -- Yes --> CheckRole{Does profile have<br/>a valid role assigned?}
    
    CreateProfile --> CheckRole
    
    CheckRole -- No --> ShowModal[Display RoleSelectionModal popup]
    ShowModal --> UserPicks[User selects 1 of 5 Roles:<br/>Citizen | Student | University | Industry | Nodal Officer]
    UserPicks --> SaveRole[DataService updates profile.role in DB]
    SaveRole --> CheckAdmin
    
    CheckRole -- Yes --> CheckAdmin{Is email == 'microsoft1gab@gmail.com'<br/>OR role == 'SUPER_ADMIN'?}
    
    CheckAdmin -- YES --> GrantSuperAdmin[Grant SUPER ADMIN Privileges<br/>Access to /admin Portal to promote any user]
    CheckAdmin -- NO --> RedirectDashboard[Redirect to Role Workspace Dashboard]

    GrantSuperAdmin --> Done([User Ready])
    RedirectDashboard --> Done
```

---

## 4. Samadhan AI 25-Domain Decision Engine

```mermaid
flowchart TD
    UserQuery[/User Enters Prompt or Clicks Domain Chip/] --> Trim[Sanitize Input & Append to Context History]
    Trim --> SendReq[POST /api/chat]
    
    SendReq --> CheckEnv{GEMINI_API_KEY<br/>Configured?}
    
    %% Online Gemini Flow
    CheckEnv -- YES --> InitSDK[Initialize @google/genai SDK]
    InitSDK --> ApplySysPrompt[Apply SAMADHAN_SYSTEM_PROMPT with 25 Strict Domains]
    ApplySysPrompt --> CallGemini[Call Gemini 2.5 Pro / Flash]
    
    CallGemini --> GeminiSuccess{API Call Successful?}
    GeminiSuccess -- YES --> ReturnJSON[Return JSON Response with Markdown Reply]
    GeminiSuccess -- NO / RateLimit --> FallbackLocal[Trigger Local Knowledge Engine]

    %% Offline / Fallback Flow
    CheckEnv -- NO --> FallbackLocal
    
    FallbackLocal --> CheckOutDomain{Is Question Out-of-Domain?<br/>Jokes, Movies, Gaming, Recipes, Trivia}
    
    CheckOutDomain -- YES --> RefuseOut[Return Official Canned Refusal:<br/>'I am Samadhan AI, focused on Samadhan.Connect...']
    CheckOutDomain -- NO --> MatchDomain[Match In-Domain Knowledge:<br/>Agriculture, Electricity, Grievances, Schemes, Legal]
    
    MatchDomain --> BuildStepGuide[Generate Step-by-Step Actionable Civic Guidance]
    
    RefuseOut --> ReturnJSON
    BuildStepGuide --> ReturnJSON
    
    ReturnJSON --> RenderMD[Frontend MarkdownMessage Component<br/>Renders Bold, Bullets, Numbers & Safety Alerts]
```

---

## 5. Problem Reporting to CSR Funding Pipeline

```mermaid
flowchart LR
    subgraph Step1["1. Citizen Submission"]
        P1[Citizen Reports Problem]
        P2[Uploads Photo/GPS]
        P1 --> P2
    end

    subgraph Step2["2. Official Review"]
        P3[Nodal Officer Audits]
        P4[Approved as Active Challenge]
        P3 --> P4
    end

    subgraph Step3["3. Innovation Lab"]
        P5[Students Form Team]
        P6[Faculty Review & Submit Proposal]
        P5 --> P6
    end

    subgraph Step4["4. CSR Sponsorship"]
        P7[Industry Evaluates ROI]
        P8[Grant Pledged & Disbursed]
        P7 --> P8
    end

    subgraph Step5["5. Resolution"]
        P9[Ground Deployment]
        P10[Citizen Verification & Signoff]
        P9 --> P10
    end

    Step1 --> Step2 --> Step3 --> Step4 --> Step5
```
