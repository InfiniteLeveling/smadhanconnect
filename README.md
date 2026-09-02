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
    subgraph Boot["1. Initial App Boot & Build Engine"]
        Vite["Vite 8 Build & Dev Server (HMR)"] --> HTML["index.html (Entry Root #root)"]
        HTML --> MainJSX["src/main.jsx"]
        MainJSX --> Tailwind["Tailwind CSS v3 + PostCSS Styling"]
        MainJSX --> AppJSX["src/App.jsx (Root Router Provider)"]
    end

    subgraph StateAndAuth["2. Global Context & Auth Layer"]
        AppJSX --> AuthProvider["src/context/AuthContext.jsx"]
        AuthProvider --> SupaAuthClient["@supabase/supabase-js Client"]
        SupaAuthClient -->|Session Listener| UserProfile["Sync User Profile & Role"]
        UserProfile --> RoleCheck{Role Assigned?}
        RoleCheck -- No --> RoleModal["src/components/modals/RoleSelectionModal.jsx"]
        RoleCheck -- Yes --> RouterLayer["React Router v7 Navigation Engine"]
    end

    subgraph RoutingAndPages["3. Pages & Dynamic Route Guards"]
        RouterLayer --> Page_Home["/ -> HomePage (HeroLoginCard, Stats)"]
        RouterLayer --> Page_Workspace["/workspace -> Role Workspace"]
        RouterLayer --> Page_Messages["/messages -> MessagingPage (Chat + Samadhan AI)"]
        RouterLayer --> Page_Admin["/admin -> AdminDashboardPage (Super Admin Guard)"]
        RouterLayer --> Page_Challenges["/challenges -> ChallengeExplorerPage"]
    end

    subgraph UIComponents["4. Specialized UI Subsystems"]
        Page_Messages --> ConvSidebar["Sidebar: Pinned Samadhan AI + Peer Channels"]
        Page_Messages --> SuggestedBar["SuggestedDomainsBar (24+ Domain Prompt Chips)"]
        Page_Messages --> MD_Renderer["MarkdownMessage (Bold, Lists, Code, Links)"]
        Page_Workspace --> Confetti["Canvas Confetti (Milestone Feedback)"]
        Page_Workspace --> DataService["src/services/dataService.js (CRUD + Fallback)"]
    end

    subgraph UserFeedback["5. User Interaction & Micro-Animations"]
        MD_Renderer --> DOMUpdate["Virtual DOM React 19 Reconciliation"]
        Confetti --> DOMUpdate
        DataService --> DOMUpdate
        DOMUpdate --> UserScreen([Interactive Citizen / Innovator UI])
    end
```

---

## ⚙️ Backend Technology Flowchart

```mermaid
flowchart TD
    subgraph RequestIntake["1. HTTP Request Gateway"]
        ClientReq["Frontend POST /api/chat Request"] --> GatewaySelect{Environment Mode}
        GatewaySelect -- Production --> VercelFunc["api/chat.js (Vercel Serverless Function)"]
        GatewaySelect -- Local Dev --> ViteMiddleware["vite.config.js (Dev Server Middleware)"]
        GatewaySelect -- Standalone --> ExpressApp["server/index.js (Express Server)"]
    end

    subgraph SecurityChecks["2. Security & Request Validation"]
        VercelFunc --> CORS["CORS & Method Validator (POST only)"]
        ViteMiddleware --> CORS
        ExpressApp --> CORS
        CORS --> InputSanitizer["Validate Body & Truncate History to last 10 messages"]
        InputSanitizer --> SecretReader["Read process.env.GEMINI_API_KEY (Server-Side Only)"]
    end

    subgraph ExecutionRouter["3. AI & Knowledge Execution Router"]
        SecretReader --> KeyCheck{API Key Present?}
        
        KeyCheck -- YES --> GoogleSDK["Initialize @google/genai GoogleGenAI SDK"]
        KeyCheck -- NO / Empty --> LocalKnowledge["Intelligent Civic Knowledge Engine"]
        
        GoogleSDK --> PromptLoader["Load System Instructions from server/config/chatbotPrompt.js"]
        PromptLoader --> ModelCascade["Multi-Model Failover Cascade"]
    end

    subgraph ModelCascadeChain["4. Multi-Model Cascade & Resilience"]
        ModelCascade --> Model1["Try 1: models/gemini-2.5-pro"]
        Model1 -- 404/429/Timeout --> Model2["Try 2: models/gemini-2.5-flash"]
        Model2 -- 404/429/Timeout --> Model3["Try 3: models/gemini-3.1-pro-preview"]
        Model3 -- Quota Exhausted --> LocalKnowledge
        
        Model1 -- Success --> CleanResponse["Extract Candidates & Clean Output"]
        Model2 -- Success --> CleanResponse
        Model3 -- Success --> CleanResponse
        
        LocalKnowledge --> DomainFilter{Is In-Domain?}
        DomainFilter -- YES --> GenSteps["Generate Step-by-Step Civic Steps"]
        DomainFilter -- NO --> OutOfDomain["Return Canned Refusal: 'I am Samadhan AI...'"]
        
        GenSteps --> CleanResponse
        OutOfDomain --> CleanResponse
    end

    subgraph ResponseDispatch["5. Response Serialization"]
        CleanResponse --> JSONPayload["Serialize JSON: { reply: '...', status: 'success' }"]
        JSONPayload --> HTTP200["Send HTTP 200 to Client"]
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
