# 🏛️ Samadhan.Connect

> **State-Wide Civic Problem-Solving & Innovation Ecosystem**  
> *Empowering Citizens, Students, Universities, Industries, and Nodal Officers across Jharkhand.*

---

## 📌 Table of Contents
- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Frontend Technology Flowchart](#-frontend-technology-flowchart)
- [Backend Technology Flowchart](#-backend-technology-flowchart)
- [System Architecture & Data Flow](#-system-architecture--data-flow)
- [Samadhan AI (Gemini 2.5 Pro Assistant)](#-samadhan-ai-gemini-25-pro-assistant)
- [Getting Started & Local Setup](#-getting-started--local-setup)
- [Documentation & Architecture PDF](#-documentation--architecture-pdf)

---

## 🌟 Overview

**Samadhan.Connect** is a comprehensive civic innovation and problem-solving platform designed to crowdsource community challenges, match them with university innovators, secure industry CSR funding, and enable verified district-level deployment through government Nodal Officers.

### Supported User Roles:
1. **👨‍🌾 Citizen**: Report local problems (water, electricity, roads, sanitation), track resolution progress, and rate outcomes.
2. **🎓 Student / Innovator**: Browse active challenges, form interdisciplinary teams, and submit technical proposals.
3. **🏫 University / Faculty**: Mentor student innovation cells, review proposal feasibility, and track academic IP.
4. **🏭 Industry / CSR**: Discover verified civic projects, pledge corporate CSR grants, and receive impact reports.
5. **🛡️ Nodal Officer**: Verify problem authenticity, audit site progress, and formally sign off on resolutions.
6. **👑 Super Admin** (`microsoft1gab@gmail.com`): Platform-wide governance, promoting users to Admin, and system metrics.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend SPA** | React 19, Vite 8, React Router v7 | Ultra-fast rendering, client-side routing, optimistic UI updates |
| **Styling & UI** | Tailwind CSS v3, PostCSS, Lucide Icons | Responsive glassmorphism, high-contrast accessible design |
| **Auth & RBAC** | Supabase Auth (OAuth 2.0: Google & GitHub) | Passwordless login, JWT sessions, first-time role modal |
| **Database** | Supabase (PostgreSQL 15), RLS Policies | Relational persistence, automated triggers, real-time WebSocket sync |
| **Backend & API** | Vercel Serverless (`api/chat.js`), Vite Dev Middleware | Zero-secret exposure, CORS, rate limiting, and AI routing |
| **AI Assistant** | Google Gemini API (`@google/genai` SDK) | Model `gemini-2.5-pro` & `gemini-2.5-flash`, 25 strict civic domains |
| **Micro-Interactions**| Canvas Confetti, Real-time status badges | Visual milestone rewards and interactive feedback |

---

## 💻 Frontend Technology Flowchart

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

## ⚙️ Backend Technology Flowchart

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

## 🤖 Samadhan AI (Gemini 2.5 Pro Assistant)

Samadhan AI is the official civic assistant of Samadhan.Connect, configured with **25 strictly allowed public domains**:
1. 🌾 Agriculture & Farming
2. ⚡ Electricity & Power
3. 🏛️ Government Services & Schemes
4. 📋 Citizen Grievances & Municipal Complaints
5. 🎓 Education, Scholarships & Grants
6. 💼 Jobs, Employment & Skills
7. 💰 Finance, Mudra Loans & Subsidies
8. 🏥 Healthcare, Ayushman Bharat & Jan Aushadhi
9. 🚌 Transport & Public Mobility
10. 🏠 Housing & Property Records
11. 🌧️ Weather, Drought & Disaster Alerts
12. 🌱 Environment & Pollution Control
13. 🧑‍⚖️ Legal, Affidavits & RTI Guidance
14. 👩‍💼 Business & MSME Registration
15. 🛒 Marketplace & Tribal SHGs
16. 📱 Digital Services (DigiLocker, UMANG)
17. 🆔 Identity Documents (Aadhaar, Voter ID, Ration Card)
18. 🎯 Technical & Vocational Career Paths
19. 🏦 Banking & PM Jan Dhan Yojana
20. 🏘️ Municipal Civic Services & Waste Collection
21. 🚰 Jal Jeevan Mission & Sanitation
22. 🔐 Cybersecurity, UPI Fraud Defense (Dial 1930)
23. 🧾 Tax Documentation (PAN, ITR)
24. 🚨 Emergency Helplines (112, 108, 1091)
25. 🤖 General AI Assistant (Platform navigation & Problem Reporting)

---

## 🚀 Getting Started & Local Setup

### 1. Prerequisites
- Node.js (v18+)
- Python 3.10+ (for PDF compilation)

### 2. Clone and Install Dependencies
```bash
git clone https://github.com/InfiniteLeveling/smadhanconnect.git
cd smadhanconnect
npm install
```

### 3. Configure Environment (`.env`)
Create a `.env` file in the project root:
```env
# Supabase Configuration (Frontend Client)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Google Gemini API Key (Backend Server only - NEVER prefix with VITE_)
GEMINI_API_KEY=your_gemini_api_key_from_google_ai_studio
```

### 4. Start Local Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Run Automated Chatbot Test Suite
```bash
node scripts/test-chatbot-gemini.js
```

---

## 📖 Documentation & Architecture PDF

- 📑 **Architecture & Tech Specification PDF**: [`Samadhan_Connect_Architecture_And_Tech_Stack.pdf`](./Samadhan_Connect_Architecture_And_Tech_Stack.pdf)
- 📊 **Detailed Workflows & Flow Charts**: [`WORKFLOW_AND_FLOWCHARTS.md`](./WORKFLOW_AND_FLOWCHARTS.md)
- 🤖 **Chatbot Setup Guide**: [`SAMADHAN_AI_CHATBOT_SETUP.txt`](./SAMADHAN_AI_CHATBOT_SETUP.txt)
- 🚀 **Deployment Instructions**: [`DEPLOYMENT.md`](./DEPLOYMENT.md)

---

## 📜 License
Developed for the **Government of Jharkhand Civic Innovation Ecosystem** / Samadhan.Connect platform.
