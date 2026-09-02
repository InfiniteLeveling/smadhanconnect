import os
import sys
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    """Canvas for adding page numbers and running header/footer."""
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_header_footer(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_header_footer(self, page_count):
        self.saveState()
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.setFont("Helvetica-Bold", 8)
            self.setFillColor(colors.HexColor("#0f766e")) # Teal 700
            self.drawString(54, 11 * inch - 36, "SAMADHAN.CONNECT — FULL WORKFLOWS, FLOWCHARTS & TECH STACKS SPECIFICATION")
            self.setStrokeColor(colors.HexColor("#cbd5e1"))
            self.setLineWidth(0.5)
            self.line(54, 11 * inch - 42, 8.5 * inch - 54, 11 * inch - 42)

        # Footer
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748b")) # Slate 500
        self.drawString(54, 36, "Confidential & Proprietary — Samadhan.Connect (Govt. of Jharkhand Civic Ecosystem)")
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(8.5 * inch - 54, 36, page_text)
        self.setStrokeColor(colors.HexColor("#cbd5e1"))
        self.setLineWidth(0.5)
        self.line(54, 46, 8.5 * inch - 54, 46)
        
        self.restoreState()

def create_flowchart_card(step_num, title, actor, tech_stack, desc, bg_color="#f8fafc", border_color="#cbd5e1", title_color="#0f766e"):
    """Helper to render a styled flowchart node table with explicit tech stack."""
    content = [
        [
            Paragraph(f"<b>STEP {step_num}</b>", ParagraphStyle('Badge', fontName='Helvetica-Bold', fontSize=8, leading=10, textColor=colors.white)),
            Paragraph(f"<b>{title}</b> — <font color='#475569'>[{actor}]</font><br/><font color='#0284c7' size=7.5><b>Tech Stack:</b> {tech_stack}</font>", ParagraphStyle('NodeTitle', fontName='Helvetica-Bold', fontSize=9, leading=12, textColor=colors.HexColor(title_color)))
        ],
        [
            "",
            Paragraph(desc, ParagraphStyle('NodeDesc', fontName='Helvetica', fontSize=8, leading=11, textColor=colors.HexColor("#334155")))
        ]
    ]
    t = Table(content, colWidths=[0.8*inch, 6.2*inch])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,0), colors.HexColor(title_color)),
        ('BACKGROUND', (1,0), (-1,-1), colors.HexColor(bg_color)),
        ('BACKGROUND', (0,1), (0,1), colors.HexColor(bg_color)),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor(border_color)),
        ('ALIGN', (0,0), (0,0), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('PADDING', (0,0), (-1,-1), 4),
        ('SPAN', (0,1), (0,1)),
    ]))
    return t

def create_arrow_indicator(label=""):
    """Render a vertical connecting arrow flowable."""
    content = [[Paragraph(f"<font color='#0f766e'><b>▼  {label}</b></font>", ParagraphStyle('Arr', fontName='Helvetica-Bold', fontSize=7.5, leading=9.5, alignment=1))]]
    t = Table(content, colWidths=[7.0*inch])
    t.setStyle(TableStyle([
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('PADDING', (0,0), (-1,-1), 1),
    ]))
    return t

def build_pdf(filename="Samadhan_Connect_Architecture_And_Tech_Stack.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Custom Color Palette
    primary_color = colors.HexColor("#0f766e")    # Deep Teal
    secondary_color = colors.HexColor("#0284c7")  # Sky Blue
    dark_text = colors.HexColor("#0f172a")        # Slate 900
    body_text = colors.HexColor("#334155")        # Slate 700
    bg_light = colors.HexColor("#f8fafc")         # Slate 50
    border_color = colors.HexColor("#e2e8f0")

    # Typography Styles
    h1_style = ParagraphStyle(
        'Heading1_Custom',
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=16,
        textColor=primary_color,
        spaceBefore=8,
        spaceAfter=5,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=13,
        textColor=secondary_color,
        spaceBefore=6,
        spaceAfter=3,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=body_text,
        spaceAfter=4
    )

    diagram_style = ParagraphStyle(
        'Diagram_Code',
        fontName='Courier',
        fontSize=6.5,
        leading=8,
        textColor=colors.HexColor("#0f172a"),
        spaceBefore=2,
        spaceAfter=2
    )

    table_header_style = ParagraphStyle(
        'TH_Style',
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.white
    )

    table_cell_style = ParagraphStyle(
        'TC_Style',
        fontName='Helvetica',
        fontSize=7.5,
        leading=10,
        textColor=dark_text
    )

    table_cell_bold = ParagraphStyle(
        'TC_Bold',
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=10,
        textColor=primary_color
    )

    story = []

    # =========================================================================
    # 1. HEADER BANNER
    # =========================================================================
    banner_data = [
        [
            Paragraph("<b>SAMADHAN.CONNECT</b><br/><font size=8.5 color='#0f766e'>Govt. of Jharkhand Civic Innovation & Problem-Solving Ecosystem</font>", ParagraphStyle('BTitle', fontName='Helvetica-Bold', fontSize=14, leading=16, textColor=colors.HexColor("#0f172a"))),
            Paragraph("<b>SYSTEM ARCHITECTURE, TECH STACKS & FULL WORKFLOWS</b><br/><font size=7.5 color='#64748b'>Detailed Operational & Technical Flowchart Blueprint</font>", ParagraphStyle('BSub', fontName='Helvetica', fontSize=8, leading=10, textColor=colors.HexColor("#334155"), alignment=2))
        ]
    ]
    banner_table = Table(banner_data, colWidths=[3.5*inch, 3.5*inch])
    banner_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f0fdf4")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#86efac")),
        ('PADDING', (0,0), (-1,-1), 6),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(banner_table)
    story.append(Spacer(1, 8))

    # =========================================================================
    # 2. COMPLETE TECH STACK MATRIX
    # =========================================================================
    story.append(Paragraph("1. Complete Technology Stack Matrix", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=primary_color, spaceAfter=5))

    tech_table_data = [
        [
            Paragraph("Layer", table_header_style),
            Paragraph("Technologies & Frameworks Used", table_header_style),
            Paragraph("Architectural Role & Functionality", table_header_style)
        ],
        [
            Paragraph("<b>Frontend Framework</b>", table_cell_bold),
            Paragraph("React 19, Vite 8, React Router v7", table_cell_style),
            Paragraph("Ultra-fast SPA rendering, component modularity, client-side routing, optimistic state updates.", table_cell_style)
        ],
        [
            Paragraph("<b>Styling & UI</b>", table_cell_bold),
            Paragraph("Tailwind CSS v3, PostCSS, Lucide Icons", table_cell_style),
            Paragraph("Modern glassmorphism, responsive grid layouts, high-contrast accessible civic design tokens.", table_cell_style)
        ],
        [
            Paragraph("<b>Auth & RBAC</b>", table_cell_bold),
            Paragraph("Supabase Auth, OAuth 2.0 (Google, GitHub)", table_cell_style),
            Paragraph("Passwordless secure OAuth login, JWT sessions, first-time role onboarding modal, RBAC.", table_cell_style)
        ],
        [
            Paragraph("<b>Database & Persistence</b>", table_cell_bold),
            Paragraph("Supabase (PostgreSQL 15), Row Level Security", table_cell_style),
            Paragraph("Relational schema (profiles, problems, solutions, projects, messages), real-time sync.", table_cell_style)
        ],
        [
            Paragraph("<b>Backend Gateway</b>", table_cell_bold),
            Paragraph("Vercel Serverless (/api/chat.js), Vite Middleware", table_cell_style),
            Paragraph("Zero-exposure environment secrets handling, CORS, rate limiting, and multi-model AI routing.", table_cell_style)
        ],
        [
            Paragraph("<b>AI Engine</b>", table_cell_bold),
            Paragraph("Google Gemini API (@google/genai, gemini-2.5-pro/flash)", table_cell_style),
            Paragraph("25 strict civic domains, out-of-domain rejection, step-by-step problem-solving guidance.", table_cell_style)
        ],
        [
            Paragraph("<b>Micro-Animations</b>", table_cell_bold),
            Paragraph("Canvas Confetti (canvas-confetti), Status Badges", table_cell_style),
            Paragraph("Visual milestone rewards and interactive feedback upon problem approval and resolution.", table_cell_style)
        ]
    ]

    tech_table = Table(tech_table_data, colWidths=[1.3*inch, 2.3*inch, 3.4*inch])
    tech_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), primary_color),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, bg_light]),
        ('PADDING', (0,0), (-1,-1), 3.5),
    ]))
    story.append(tech_table)

    # =========================================================================
    # 3. HOW THE BACKEND WORKS
    # =========================================================================
    story.append(Spacer(1, 6))
    story.append(Paragraph("2. How the Backend Works (In Simple Language)", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=primary_color, spaceAfter=5))

    story.append(Paragraph(
        "<b>1. Secure Gateway & Key Isolation (Vercel Serverless / Node.js):</b> When a user asks a question or submits a challenge, the frontend calls <code>POST /api/chat</code>. The backend decrypts server environment variables (<code>process.env.GEMINI_API_KEY</code>), guaranteeing that secret credentials never reach the browser.<br/>"
        "<b>2. Dual-Engine Resilience (@google/genai + Local Knowledge Base):</b> The backend attempts live reasoning via Google Gemini 2.5 Pro / Flash. If quota or network limits occur, it seamlessly falls back to the <b>Intelligent Civic Knowledge Engine</b>, returning verified step-by-step answers without failing.<br/>"
        "<b>3. Role-Based Data Security (Supabase PostgreSQL 15 + RLS):</b> Row Level Security policies and database triggers guarantee that citizens only edit their own problems, students collaborate securely, and Nodal Officers sign off on genuine civic projects.",
        body_style
    ))

    story.append(PageBreak())

    # =========================================================================
    # 4. FLOWCHART 1: MASTER CIVIC WORKFLOW WITH TECH STACKS
    # =========================================================================
    story.append(Paragraph("3. Flow Chart 1: Master Civic Problem-Solving Lifecycle (With Tech Stacks)", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=primary_color, spaceAfter=5))

    story.append(create_flowchart_card(
        "1", "Citizen Reports Civic Problem", "Citizen", "React 19 + HTML5 Geolocation + Supabase Storage CDN",
        "Citizen encounters a localized community problem (e.g. broken transformer, water contamination) and submits photos, GPS coordinates, category, and description.",
        "#f0fdf4", "#86efac", "#15803d"
    ))
    story.append(create_arrow_indicator("Problem submitted to District Nodal Queue [Postgres DB Trigger]"))

    story.append(create_flowchart_card(
        "2", "Triage & Jurisdiction Verification", "Nodal Officer", "Supabase PostgreSQL 15 + Row Level Security (RLS)",
        "Nodal Officer reviews the authenticity and jurisdiction of the problem. If verified, the issue is formally approved and published as an 'Active Innovation Challenge'.",
        "#eff6ff", "#93c5fd", "#1d4ed8"
    ))
    story.append(create_arrow_indicator("Challenge published on Academic Innovation Feed [React Router v7]"))

    story.append(create_flowchart_card(
        "3", "Solution Proposal & Faculty Mentorship", "Students & Universities", "React 19 + Markdown Editor + dataService.js",
        "Student teams form cross-disciplinary groups, draft technical blueprints (budget, timeline, prototype design), and obtain Faculty Mentor review before platform submission.",
        "#faf5ff", "#d8b4fe", "#7e22ce"
    ))
    story.append(create_arrow_indicator("Solution validated & matched with CSR sponsors [Realtime WebSockets]"))

    story.append(create_flowchart_card(
        "4", "CSR Sponsorship & Milestone Funding", "Industry & CSR Partners", "PostgreSQL Ledger Schema + Analytics Dashboard",
        "Corporate partners evaluate project feasibility and community impact ROI. Pledges CSR funding, grants, or equipment disbursed on milestone completion.",
        "#fffbeb", "#fde68a", "#b45309"
    ))
    story.append(create_arrow_indicator("Funds disbursed for ground prototype deployment"))

    story.append(create_flowchart_card(
        "5", "Ground Deployment, Field Audit & Sign-off", "Nodal Officer & Citizen", "Canvas Confetti + Verified Badge + Notification Trigger",
        "Students deploy the prototype on-site. The Nodal Officer conducts a physical inspection, and the reporting Citizen confirms resolution with a 5-star satisfaction rating.",
        "#f0fdfa", "#5eead4", "#0f766e"
    ))

    # =========================================================================
    # 5. FLOWCHART 2: SYSTEM ARCHITECTURE WITH TECH STACKS
    # =========================================================================
    story.append(Spacer(1, 8))
    story.append(Paragraph("4. Flow Chart 2: System Architecture Data Pipeline (With Tech Stacks)", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=primary_color, spaceAfter=5))

    arch_diagram_text = """
+---------------------------------------------------------------------------------------------------+
|                        1. CLIENT TIER (React 19 / Vite 8 SPA / Tailwind CSS v3)                   |
|  [Citizen Portal]    [Student Lab]    [University Hub]    [Industry CSR]    [Nodal Admin Desk]     |
|  • Tech: React Router v7, Lucide Icons, Canvas Confetti, MarkdownMessage, SuggestedDomainsBar     |
+---------------------------------------------------------------------------------------------------+
                                         │                                    │
                        REST / Supabase JS API (Auth/CRUD)             POST /api/chat (AI Stream)
                                         │                                    │
                                         ▼                                    ▼
+-----------------------------------------------------+  +------------------------------------------+
|          2. DATABASE & AUTH TIER (Supabase)         |  |      3. BACKEND / API GATEWAY TIER       |
|  • PostgreSQL 15 Relational DB (RLS Policies)       |  |  • Vercel Serverless (Node.js api/chat.js)
|  • Supabase Auth (JWT & OAuth Google/GitHub)        |  |  • Vite Dev Server Custom Middleware     |
|  • Database Triggers & Auto-Profile Sync            |  |  • Server Config (chatbotPrompt.js)      |
|  • Tables: profiles, problems, solutions, messages  |  |  • Server Secret (process.env.GEMINI_KEY)|
+-----------------------------------------------------+  +------------------------------------------+
                                                                              │
                                                               @google/genai SDK Call (gemini-2.5-pro)
                                                                              │
                                                                              ▼
                                                         +------------------------------------------+
                                                         |         4. EXTERNAL AI CLOUD TIER        |
                                                         |  • Google Gemini 2.5 Pro / Flash Models  |
                                                         |  • 25 Strict Civic Domain Guardrails     |
                                                         |  • Step-by-Step Problem Solving Logic    |
                                                         +------------------------------------------+
"""
    diag_table = Table([[Paragraph(f"<pre>{arch_diagram_text.strip()}</pre>", diagram_style)]], colWidths=[7.0*inch])
    diag_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f8fafc")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#94a3b8")),
        ('PADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(diag_table)

    story.append(PageBreak())

    # =========================================================================
    # 6. FLOWCHART 3: AUTHENTICATION WITH TECH STACKS
    # =========================================================================
    story.append(Paragraph("5. Flow Chart 3: Authentication & Role Onboarding (With Tech Stacks)", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=primary_color, spaceAfter=5))

    auth_diagram_text = """
  [ User clicks 'Sign in with Google' or 'GitHub' ]  <─── [ Tech: HeroLoginCard.jsx / Navbar.jsx ]
                                │
                                ▼
  [ Supabase OAuth handles Authentication & generates JWT Token ]  <─── [ Tech: supabase.auth.signInWithOAuth() ]
                                │
                                ▼
  [ PostgreSQL Database Trigger checks 'profiles' table ]  <─── [ Tech: on_auth_user_created trigger function ]
        ├── Existing Profile ──> [ Load Profile & Redirect to Role Workspace ]
        └── New Profile ────────> [ Insert Basic Profile with Email & Name ]
                                │
                                ▼
  [ Frontend detects missing role & opens Modal ]  <─── [ Tech: RoleSelectionModal.jsx (React 19 Portal) ]
  [ User selects 1 of 5 Roles: Citizen | Student | University | Industry | Nodal Officer ]
                                │
                                ▼
  [ DataService updates profile.role in DB ]  <─── [ Tech: dataService.updateProfile() ]
                                │
                                ▼
  [ Special Condition: Is email == 'microsoft1gab@gmail.com'? ]  <─── [ Tech: Super Admin Privilege Check ]
        ├── YES ──> [ Grant SUPER_ADMIN role with full /admin panel access to promote users ]
        └── NO  ──> [ Grant Standard Verified Role Workspace Dashboard ]
"""
    auth_table = Table([[Paragraph(f"<pre>{auth_diagram_text.strip()}</pre>", diagram_style)]], colWidths=[7.0*inch])
    auth_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f0fdfa")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#5eead4")),
        ('PADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(auth_table)

    # =========================================================================
    # 7. FLOWCHART 4: SAMADHAN AI DECISION ENGINE WITH TECH STACKS
    # =========================================================================
    story.append(Spacer(1, 8))
    story.append(Paragraph("6. Flow Chart 4: Samadhan AI 25-Domain Decision Engine (With Tech Stacks)", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=primary_color, spaceAfter=5))

    ai_flow_text = """
  [ User sends message or clicks Chip ]  <─── [ Tech: MessagingPage.jsx + SuggestedDomainsBar.jsx ]
                                │
                                ▼
  [ Frontend sanitizes input & slices history to last 10 messages ]  <─── [ Tech: aiChatService.js ]
                                │
                                ▼
  [ POST /api/chat JSON Payload ]  <─── [ Tech: Fetch API HTTP Stream ]
                                │
                                ▼
  [ Backend Gateway checks process.env.GEMINI_API_KEY ]  <─── [ Tech: Vercel Serverless / Node.js Runtime ]
        ├── API Key Present ──> [ Initialize Google Gen AI SDK ]  <─── [ Tech: @google/genai SDK v2.20.0 ]
        │                             │
        │                             ▼
        │                       [ Call Gemini 2.5 Pro / Flash ]  <─── [ Tech: ai.models.generateContent() ]
        │                             ├── Success ──> [ Return JSON reply & status: success ]
        │                             └── 404/429/Timeout ──> [ Failover to Local Knowledge Engine ]
        │
        └── No API Key ────────> [ Run Intelligent Local Knowledge Engine ]  <─── [ Tech: 25-Domain Heuristic Engine ]
                                      ├── Is In-Domain? ────> [ Return Step-by-Step Civic Steps ]
                                      └── Is Out-of-Domain? ─> [ Return Official Canned Refusal ]
                                │
                                ▼
  [ Frontend receives JSON reply & renders UI ]  <─── [ Tech: MarkdownMessage.jsx (RegExp Tokenizer) ]
"""
    ai_table = Table([[Paragraph(f"<pre>{ai_flow_text.strip()}</pre>", diagram_style)]], colWidths=[7.0*inch])
    ai_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#fefce8")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#fde047")),
        ('PADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(ai_table)

    story.append(Spacer(1, 6))

    # Concluding Box
    conclude_data = [[
        Paragraph(
            "<b>Specification Summary:</b> This document provides the complete frontend, backend, database, and AI technology stack flowcharts for Samadhan.Connect. Engineered for state-wide citizen empowerment, robust security, and seamless civic collaboration.",
            ParagraphStyle('CStyle', fontName='Helvetica-Oblique', fontSize=8, leading=10.5, textColor=colors.HexColor("#0f766e"))
        )
    ]]
    conclude_table = Table(conclude_data, colWidths=[7.0*inch])
    conclude_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f0fdf4")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#86efac")),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(conclude_table)

    # Build PDF with Numbered Canvas
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"[SUCCESS] PDF generated: {filename}")

if __name__ == "__main__":
    build_pdf()
