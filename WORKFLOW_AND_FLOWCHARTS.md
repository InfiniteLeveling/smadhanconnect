# Samadhan.Connect — Full Workflows, Technology Pipelines & Flow Charts

This document provides a comprehensive breakdown of all operational, technical, frontend, and backend technology workflows in **Samadhan.Connect**, with **explicit tech-stack annotations** on every step and Mermaid flow chart.

---

## 1. Master Civic Problem-Solving Workflow (Tech Stack Swimlane)

```mermaid
sequenceDiagram
    autonumber
    actor Citizen as 👨‍🌾 Citizen<br/>[React 19 + Tailwind CSS]
    actor AI as 🤖 Samadhan AI<br/>[@google/genai + Gemini 2.5 Pro]
    actor Nodal as 🛡️ Nodal Officer<br/>[Supabase PostgreSQL + RLS]
    actor Student as 🎓 Student / Innovator<br/>[React Router v7 + Markdown]
    actor Faculty as 🏫 Faculty Mentor<br/>[Supabase Auth + DataService]
    actor Industry as 🏭 Industry / CSR<br/>[Supabase Realtime WebSockets]

    %% Step 1: Consultation & Submission
    Citizen->>AI: 1. Consults AI on category & civic rights [Fetch API /api/chat]
    AI-->>Citizen: 2. Recommends 25-domain guidance & state schemes [JSON Stream]
    Citizen->>Nodal: 3. Submits Problem with GPS & Photos [Supabase Storage + Postgres]
    
    %% Step 2: Verification & Challenge Publication
    critical Verification & Triaging [PostgreSQL RLS Engine]
        Nodal->>Nodal: 4. Inspects ground reality & jurisdiction [Nodal Admin Hub]
        Nodal-->>Citizen: 5. Approves & converts to 'Active Challenge' [Realtime Notification]
    end

    %% Step 3: Solution & Mentorship
    Student->>Faculty: 6. Drafts Technical Blueprint & Prototype Plan [React Router v7]
    Faculty-->>Student: 7. Reviews & provides Academic Endorsement [Supabase DB Trigger]
    Student->>Nodal: 8. Submits Innovation Proposal on Platform [DataService CRUD]

    %% Step 4: CSR Funding
    Industry->>Industry: 9. Evaluates Project Budget & Impact ROI [CSR Analytics Portal]
    Industry->>Nodal: 10. Pledges CSR Grant & Milestone Funding [Postgres Ledger]
    
    %% Step 5: Implementation & Signoff
    Student->>Citizen: 11. Ground Deployment & Prototype Installation [Field Operations]
    Nodal->>Citizen: 12. Field Audit & Verification [Nodal Mobile View]
    Citizen-->>Nodal: 13. Confirms Problem Solved + 5-Star Rating [Canvas Confetti Trigger]
    Nodal->>Student: 14. Releases Milestone Completion Certificate [Digital Certificate PDF]
```

---

## 2. Frontend Technology Flowchart & Component Lifecycle

```mermaid
flowchart TD
    subgraph Boot["1. Initial App Boot & Build Engine (Vite 8 + React 19)"]
        Vite["⚙️ Vite 8 Bundler<br/>[Hot Module Replacement HMR]"] --> HTML["📄 index.html<br/>[Mount Point #root]"]
        HTML --> MainJSX["🚀 src/main.jsx<br/>[React 19 createRoot]"]
        MainJSX --> Tailwind["🎨 Tailwind CSS v3 + PostCSS<br/>[Design Tokens & Glassmorphism]"]
        MainJSX --> AppJSX["📦 src/App.jsx<br/>[Root Router & Modal Layer]"]
    end

    subgraph StateAndAuth["2. Global Context & Auth Layer (Supabase Auth + JWT)"]
        AppJSX --> AuthProvider["🔐 src/context/AuthContext.jsx<br/>[React Context API + Hooks]"]
        AuthProvider --> SupaAuthClient["⚡ @supabase/supabase-js<br/>[OAuth 2.0 Google & GitHub Client]"]
        SupaAuthClient -->|Session Event Listener| UserProfile["👤 syncUserProfile()<br/>[Local Storage + Memory State]"]
        UserProfile --> RoleCheck{Role Assigned?}
        RoleCheck -- No --> RoleModal["🪟 RoleSelectionModal.jsx<br/>[5-Role Onboarding Modal]"]
        RoleCheck -- Yes --> RouterLayer["🧭 React Router v7<br/>[BrowserRouter & Route Guards]"]
    end

    subgraph RoutingAndPages["3. Pages & Dynamic Route Guards"]
        RouterLayer --> Page_Home["🏠 / -> HomePage.jsx<br/>[HeroLoginCard + Stats Grid]"]
        RouterLayer --> Page_Workspace["💼 /workspace -> WorkspacePage.jsx<br/>[Citizen / Student / Nodal Dashboards]"]
        RouterLayer --> Page_Messages["💬 /messages -> MessagingPage.jsx<br/>[Pinned Samadhan AI + Peer Chat]"]
        RouterLayer --> Page_Admin["👑 /admin -> AdminDashboardPage.jsx<br/>[Super Admin RBAC Guard]"]
        RouterLayer --> Page_Challenges["🎯 /challenges -> ChallengeExplorerPage.jsx<br/>[Filterable Public Challenge Feed]"]
    end

    subgraph UIComponents["4. Specialized UI Subsystems & Micro-Interactions"]
        Page_Messages --> ConvSidebar["📋 Conversation Sidebar<br/>[Sparkle Bot Avatar + Status Badges]"]
        Page_Messages --> SuggestedBar["🏷️ SuggestedDomainsBar.jsx<br/>[24+ Topic Prompt Chips]"]
        Page_Messages --> MD_Renderer["📝 MarkdownMessage.jsx<br/>[RegExp Parser: Bold, Lists, Code, Links]"]
        Page_Workspace --> Confetti["🎉 Canvas Confetti (canvas-confetti)<br/>[Milestone Completion Particles]"]
        Page_Workspace --> DataService["🗄️ src/services/dataService.js<br/>[Supabase CRUD + Mock Fallback]"]
        Page_Home --> Lucide["✨ lucide-react<br/>[Accessible SVG Vector Icons]"]
    end

    subgraph UserFeedback["5. Virtual DOM Reconciliation"]
        MD_Renderer --> DOMUpdate["⚡ React 19 Virtual DOM<br/>[Concurrent Renderer]"]
        Confetti --> DOMUpdate
        DataService --> DOMUpdate
        Lucide --> DOMUpdate
        DOMUpdate --> UserScreen([🖥️ Interactive Citizen / Innovator UI])
    end
```

---

## 3. Backend Technology Flowchart & Request Execution Pipeline

```mermaid
flowchart TD
    subgraph RequestIntake["1. HTTP Request Gateway (Vercel Serverless / Express)"]
        ClientReq["🌐 Frontend POST /api/chat Request<br/>[Fetch API with JSON Payload]"] --> GatewaySelect{Environment Gateway}
        GatewaySelect -- Production (Vercel) --> VercelFunc["⚡ api/chat.js<br/>[Vercel Serverless Node.js Runtime]"]
        GatewaySelect -- Local Dev (Vite) --> ViteMiddleware["🛠️ vite.config.js<br/>[Custom Dev Server Middleware Plugin]"]
        GatewaySelect -- Standalone Server --> ExpressApp["🚀 server/index.js<br/>[Node.js Express + cors + dotenv]"]
    end

    subgraph SecurityChecks["2. Security & Request Validation (Zero Secret Exposure)"]
        VercelFunc --> CORS["🛡️ CORS Headers & Method Guard<br/>[Allow: POST, OPTIONS | Deny: GET/PUT]"]
        ViteMiddleware --> CORS
        ExpressApp --> CORS
        CORS --> InputSanitizer["🧹 Input Sanitizer & History Truncator<br/>[Validates message string & limits history to last 10]"]
        InputSanitizer --> SecretReader["🔑 Server Environment Loader<br/>[process.env.GEMINI_API_KEY (Server Only)]"]
    end

    subgraph ExecutionRouter["3. AI & Knowledge Execution Router (@google/genai)"]
        SecretReader --> KeyCheck{GEMINI_API_KEY<br/>Configured & Valid?}
        
        KeyCheck -- YES --> GoogleSDK["🤖 GoogleGenAI Client<br/>[SDK: @google/genai v2.20.0]"]
        KeyCheck -- NO / Empty / Quota Limit --> LocalKnowledge["📚 Intelligent Civic Knowledge Engine<br/>[25-Domain Heuristic Database]"]
        
        GoogleSDK --> PromptLoader["📜 chatbotPrompt.js<br/>[SAMADHAN_SYSTEM_PROMPT with 25 Domains]"]
        PromptLoader --> ModelCascade["🔄 Multi-Model Failover Cascade<br/>[Promise.race with 30s Abort Timeout]"]
    end

    subgraph ModelCascadeChain["4. Multi-Model Cascade & Resilience"]
        ModelCascade --> Model1["1️⃣ models/gemini-2.5-pro<br/>[Deep Reasoning Model]"]
        Model1 -- 404/429/Timeout --> Model2["2️⃣ models/gemini-2.5-flash<br/>[High-Speed Fallback Model]"]
        Model2 -- 404/429/Timeout --> Model3["3️⃣ models/gemini-3.1-pro-preview<br/>[Next-Gen Preview Fallback]"]
        Model3 -- Quota Exhausted --> LocalKnowledge
        
        Model1 -- Success (HTTP 200) --> CleanResponse["✨ Candidate Extraction & Trimming<br/>[response.text]"]
        Model2 -- Success (HTTP 200) --> CleanResponse
        Model3 -- Success (HTTP 200) --> CleanResponse
        
        LocalKnowledge --> DomainFilter{Domain Filter Check}
        DomainFilter -- In-Domain (Agriculture, Power, ID) --> GenSteps["📋 Generate Structured Civic Guidance<br/>[Verified Schemes & Steps]"]
        DomainFilter -- Out-of-Domain (Jokes, Movies, Games) --> OutOfDomain["🚫 Canned Refusal String<br/>[OUT_OF_DOMAIN_RESPONSE]"]
        
        GenSteps --> CleanResponse
        OutOfDomain --> CleanResponse
    end

    subgraph ResponseDispatch["5. Response Serialization & Delivery"]
        CleanResponse --> JSONPayload["📦 JSON Serializer<br/>[{ reply: '...', status: 'success' }]"]
        JSONPayload --> HTTP200["📤 HTTP 200 OK<br/>[Content-Type: application/json]"]
    end
```

---

## 4. End-to-End System Architecture Data Flow (With Tech Stacks)

```mermaid
flowchart TD
    subgraph ClientTier["1. CLIENT TIER (React 19 + Vite 8 SPA + Tailwind CSS v3)"]
        UI_Home["🏠 Landing Page<br/>[HeroLoginCard + Stats]"]
        UI_Problems["📋 Problem Explorer<br/>[Categorized Feed]"]
        UI_Chat["💬 Live Messaging<br/>[MessagingPage.jsx]"]
        UI_AI["🤖 Samadhan AI UI<br/>[MarkdownMessage + Chips]"]
        UI_Admin["👑 Admin Panel<br/>[AdminDashboardPage.jsx]"]
        UI_Workspaces["💼 Role Dashboards<br/>[Citizen / Student / Nodal]"]
    end

    subgraph APITier["2. BACKEND & API GATEWAY TIER (Node.js / Vercel Serverless)"]
        VercelAPI["⚡ Vercel Serverless Function<br/>[/api/chat.js]"]
        ViteDev["🛠️ Vite Dev Middleware<br/>[vite.config.js]"]
        SecCheck{"🔑 Server Secret Isolation<br/>[process.env.GEMINI_API_KEY]"}
        RateLimiter["⏱️ Rate Limiting & Input Validation<br/>[Payload sanitizer]"]
    end

    subgraph DataTier["3. DATABASE & PERSISTENCE TIER (Supabase PostgreSQL 15)"]
        AuthService["🔐 Supabase Auth<br/>[OAuth 2.0 Google & GitHub + JWT]"]
        PG_DB[("🗄️ PostgreSQL 15 Relational DB<br/>[profiles, problems, solutions, messages]")]
        RLS["🛡️ Row Level Security (RLS)<br/>[Tenant isolation policies]"]
        Triggers["⚡ PostgreSQL DB Triggers<br/>[handle_new_user() function]"]
    end

    subgraph AITier["4. ARTIFICIAL INTELLIGENCE CLOUD TIER (@google/genai)"]
        GeminiPro["🧠 Google Gemini 2.5 Pro<br/>[Model: gemini-2.5-pro]"]
        GeminiFlash["⚡ Google Gemini 2.5 Flash<br/>[Model: gemini-2.5-flash]"]
        LocalEngine["📚 Intelligent Civic Knowledge Engine<br/>[25-Domain Heuristic Fallback]"]
        PromptConfig["📜 Configurable System Prompt<br/>[server/config/chatbotPrompt.js]"]
    end

    %% Connections
    UI_Home -->|OAuth Sign In| AuthService
    UI_Problems -->|CRUD via dataService.js| RLS
    UI_Workspaces -->|Realtime sync| PG_DB
    UI_Chat -->|POST /api/chat| VercelAPI
    UI_AI -.->|Local Dev Proxy| ViteDev

    VercelAPI --> SecCheck
    ViteDev --> SecCheck
    SecCheck --> RateLimiter

    RateLimiter -->|Active API Key| PromptConfig
    PromptConfig --> GeminiPro
    GeminiPro -.->|Failover on 404/429| GeminiFlash
    RateLimiter -->|No Key / Quota Exhausted| LocalEngine

    AuthService --> Triggers
    Triggers --> PG_DB
    RLS --> PG_DB
```

---

## 5. User Authentication & Role Onboarding Flow (With Tech Stacks)

```mermaid
flowchart TD
    Start([🌐 User visits Samadhan.Connect]) --> ClickOAuth[User clicks 'Sign in with Google' or 'GitHub'<br/><b>Technology:</b> <i>HeroLoginCard.jsx + Navbar.jsx</i>]
    ClickOAuth --> SupaOAuth[Supabase OAuth 2.0 Provider Handlers<br/><b>Technology:</b> <i>supabase.auth.signInWithOAuth()</i>]
    SupaOAuth --> TokenGen[JWT Session Token Created & Saved<br/><b>Technology:</b> <i>Browser LocalStorage + JWT Bearer</i>]
    
    TokenGen --> DBTrigger{Does profile exist in PostgreSQL 'profiles' table?<br/><b>Technology:</b> <i>SQL Trigger: on_auth_user_created</i>}
    DBTrigger -- No --> CreateProfile[Trigger creates basic profile with email & full_name<br/><b>Technology:</b> <i>PL/pgSQL Trigger Function</i>]
    DBTrigger -- Yes --> CheckRole{Does profile have a valid role assigned?<br/><b>Technology:</b> <i>AuthContext.jsx check</i>}
    
    CreateProfile --> CheckRole
    
    CheckRole -- No (Role Missing) --> ShowModal[Display Role Selection Modal<br/><b>Technology:</b> <i>RoleSelectionModal.jsx (React 19 Portal)</i>]
    ShowModal --> UserPicks[User picks 1 of 5 Roles:<br/>Citizen | Student | University | Industry | Nodal Officer]
    UserPicks --> SaveRole[Update profile.role in Supabase DB<br/><b>Technology:</b> <i>dataService.updateProfile()</i>]
    SaveRole --> CheckAdmin
    
    CheckRole -- Yes (Role Present) --> CheckAdmin{Is email == 'microsoft1gab@gmail.com'<br/>OR role == 'SUPER_ADMIN'?}
    
    CheckAdmin -- YES --> GrantSuperAdmin[Grant SUPER ADMIN Privileges<br/><b>Technology:</b> <i>AdminDashboardPage.jsx (/admin)</i>]
    CheckAdmin -- NO --> RedirectDashboard[Redirect to Role Workspace<br/><b>Technology:</b> <i>React Router v7 Navigate to /workspace</i>]

    GrantSuperAdmin --> Done([🚀 User Ready on Platform])
    RedirectDashboard --> Done
```

---

## 6. Samadhan AI 25-Domain Decision Engine (With Tech Stacks)

```mermaid
flowchart TD
    UserQuery[/User Enters Prompt or Clicks Domain Chip/<br/><b>Tech:</b> <i>MessagingPage.jsx + SuggestedDomainsBar.jsx</i>] --> Trim[Sanitize Input & Slice Last 10 Messages<br/><b>Tech:</b> <i>aiChatService.js</i>]
    Trim --> SendReq[POST /api/chat<br/><b>Tech:</b> <i>Fetch API + JSON Body</i>]
    
    SendReq --> CheckEnv{GEMINI_API_KEY Configured?<br/><b>Tech:</b> <i>Node.js process.env</i>}
    
    %% Online Gemini Flow
    CheckEnv -- YES --> InitSDK[Initialize Google Gen AI Client<br/><b>Tech:</b> <i>@google/genai SDK v2.20.0</i>]
    InitSDK --> ApplySysPrompt[Apply System Prompt & 25 Allowed Domains<br/><b>Tech:</b> <i>server/config/chatbotPrompt.js</i>]
    ApplySysPrompt --> CallGemini[Execute Model Cascade: gemini-2.5-pro / flash<br/><b>Tech:</b> <i>ai.models.generateContent()</i>]
    
    CallGemini --> GeminiSuccess{API Response Received?<br/><b>Tech:</b> <i>Promise.race with 30s Timeout</i>}
    GeminiSuccess -- YES --> ReturnJSON[Return Clean JSON Response<br/><b>Tech:</b> <i>res.status(200).json({ reply, status: 'success' })</i>]
    GeminiSuccess -- NO / Rate Limit 429 --> FallbackLocal[Trigger Local Knowledge Fallback<br/><b>Tech:</b> <i>generateLocalKnowledgeReply()</i>]

    %% Offline / Fallback Flow
    CheckEnv -- NO --> FallbackLocal
    
    FallbackLocal --> CheckOutDomain{Is Question Out-of-Domain?<br/>Jokes, Movies, Gaming, Recipes, Gossip}
    
    CheckOutDomain -- YES --> RefuseOut[Return Canned Refusal Text<br/><b>Tech:</b> <i>OUT_OF_DOMAIN_RESPONSE constant</i>]
    CheckOutDomain -- NO --> MatchDomain[Match In-Domain Heuristic Database<br/><b>Tech:</b> <i>Agriculture, Electricity, Grievances, ID, Legal</i>]
    
    MatchDomain --> BuildStepGuide[Generate Step-by-Step Actionable Civic Guidance<br/><b>Tech:</b> <i>Verified State Portal Links & Helplines</i>]
    
    RefuseOut --> ReturnJSON
    BuildStepGuide --> ReturnJSON
    
    ReturnJSON --> RenderMD[Frontend Markdown Rendering<br/><b>Tech:</b> <i>MarkdownMessage.jsx (Bold, Bullets, Numbers, Links)</i>]
```

---

## 7. Problem Reporting to CSR Funding Pipeline (With Tech Stacks)

```mermaid
flowchart LR
    subgraph Step1["1. Citizen Submission<br/>[React 19 + HTML5 GPS + Supabase Storage]"]
        P1[Citizen Reports Problem]
        P2[Uploads Photos & Coordinates]
        P1 --> P2
    end

    subgraph Step2["2. Official Review<br/>[PostgreSQL RLS + Nodal Dashboard]"]
        P3[Nodal Officer Audits]
        P4[Approved as Active Challenge]
        P3 --> P4
    end

    subgraph Step3["3. Innovation Lab<br/>[React Router v7 + Proposal Editor]"]
        P5[Students Form Team]
        P6[Faculty Endorsement & Proposal Submission]
        P5 --> P6
    end

    subgraph Step4["4. CSR Sponsorship<br/>[Supabase Realtime WebSockets + Ledger]"]
        P7[Industry Evaluates Impact ROI]
        P8[Milestone Grant Pledged & Released]
        P7 --> P8
    end

    subgraph Step5["5. Ground Deployment<br/>[Canvas Confetti + Verified Sign-off]"]
        P9[Prototype Ground Deployment]
        P10[Citizen Audit & 5-Star Resolution]
        P9 --> P10
    end

    Step1 --> Step2 --> Step3 --> Step4 --> Step5
```
