import os
import sys
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, A4
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
            self.drawString(54, 11 * inch - 36, "SAMADHAN.CONNECT — SYSTEM ARCHITECTURE & TECH STACK SPECIFICATION")
            self.setStrokeColor(colors.HexColor("#cbd5e1"))
            self.setLineWidth(0.5)
            self.line(54, 11 * inch - 42, 8.5 * inch - 54, 11 * inch - 42)

        # Footer
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748b")) # Slate 500
        self.drawString(54, 36, "Confidential & Proprietary — Samadhan.Connect (Govt. of Jharkhand Ecosystem)")
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(8.5 * inch - 54, 36, page_text)
        self.setStrokeColor(colors.HexColor("#cbd5e1"))
        self.setLineWidth(0.5)
        self.line(54, 46, 8.5 * inch - 54, 46)
        
        self.restoreState()

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
    accent_emerald = colors.HexColor("#059669")   # Emerald 600
    border_color = colors.HexColor("#e2e8f0")

    # Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=primary_color,
        spaceAfter=6
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#475569"),
        spaceAfter=14
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=19,
        textColor=primary_color,
        spaceBefore=12,
        spaceAfter=8,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=secondary_color,
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=body_text,
        spaceAfter=6
    )

    body_bold = ParagraphStyle(
        'Body_Bold',
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=13.5,
        textColor=dark_text,
        spaceAfter=6
    )

    diagram_style = ParagraphStyle(
        'Diagram_Code',
        fontName='Courier',
        fontSize=7.5,
        leading=9.5,
        textColor=colors.HexColor("#0f172a"),
        spaceBefore=4,
        spaceAfter=4
    )

    callout_style = ParagraphStyle(
        'Callout_Text',
        fontName='Helvetica-Oblique',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#0f766e")
    )

    table_header_style = ParagraphStyle(
        'TH_Style',
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=11,
        textColor=colors.white
    )

    table_cell_style = ParagraphStyle(
        'TC_Style',
        fontName='Helvetica',
        fontSize=8.5,
        leading=11,
        textColor=dark_text
    )

    table_cell_bold = ParagraphStyle(
        'TC_Bold',
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=primary_color
    )

    story = []

    # =========================================================================
    # COVER / HEADER BANNER
    # =========================================================================
    banner_data = [
        [
            Paragraph("<b>SAMADHAN.CONNECT</b><br/><font size=10 color='#0f766e'>Govt. of Jharkhand Civic Innovation & Problem-Solving Ecosystem</font>", ParagraphStyle('BTitle', fontName='Helvetica-Bold', fontSize=16, leading=18, textColor=colors.HexColor("#0f172a"))),
            Paragraph("<b>TECHNICAL SPECIFICATION & ARCHITECTURE DOCUMENT</b><br/><font size=8 color='#64748b'>Version 2.5 • Full-Stack Blueprint & Backend Deep Dive</font>", ParagraphStyle('BSub', fontName='Helvetica', fontSize=9, leading=11, textColor=colors.HexColor("#334155"), alignment=2))
        ]
    ]
    banner_table = Table(banner_data, colWidths=[3.5*inch, 3.5*inch])
    banner_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f0fdf4")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#86efac")),
        ('PADDING', (0,0), (-1,-1), 10),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(banner_table)
    story.append(Spacer(1, 14))

    # =========================================================================
    # 1. EXECUTIVE SUMMARY & PLATFORM OVERVIEW
    # =========================================================================
    story.append(Paragraph("1. Executive Summary & Platform Overview", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=primary_color, spaceAfter=8))
    
    story.append(Paragraph(
        "<b>Samadhan.Connect</b> is a state-wide collaborative platform engineered to crowdsource, triage, fund, and solve real-world civic challenges across Jharkhand. The platform connects five core user roles: <b>Citizens</b> (reporting issues), <b>Students & Innovators</b> (submitting technical solutions), <b>Universities & Faculty</b> (mentoring projects), <b>Industries & CSR Partners</b> (funding initiatives), and <b>Nodal Officers</b> (verifying and implementing solutions at the municipal/district level).",
        body_style
    ))
    story.append(Paragraph(
        "To deliver seamless performance, high security, and real-time civic intelligence, the platform combines a modern <b>React 19 Single Page Application (SPA)</b> frontend with a <b>Supabase PostgreSQL</b> relational database, <b>Vercel Serverless / Node.js API Gateway</b>, and an advanced <b>Google Gemini AI Assistant</b> restricted to 25 strict civic domains.",
        body_style
    ))

    # =========================================================================
    # 2. COMPLETE TECHNOLOGY STACK
    # =========================================================================
    story.append(Spacer(1, 10))
    story.append(Paragraph("2. Complete Technology Stack", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=primary_color, spaceAfter=8))

    tech_table_data = [
        [
            Paragraph("Layer", table_header_style),
            Paragraph("Technologies Used", table_header_style),
            Paragraph("Key Purpose & Architectural Role", table_header_style)
        ],
        [
            Paragraph("<b>Frontend Framework</b>", table_cell_bold),
            Paragraph("React 19, Vite 8, React Router v7", table_cell_style),
            Paragraph("Ultra-fast SPA rendering, component modularity, client-side routing, optimistic state updates.", table_cell_style)
        ],
        [
            Paragraph("<b>Styling & Design System</b>", table_cell_bold),
            Paragraph("Tailwind CSS v3, PostCSS, Lucide Icons", table_cell_style),
            Paragraph("Modern glassmorphism, responsive grid layouts, cohesive typography, high-contrast accessible UI.", table_cell_style)
        ],
        [
            Paragraph("<b>Authentication & Authorization</b>", table_cell_bold),
            Paragraph("Supabase Auth, OAuth 2.0 (Google, GitHub)", table_cell_style),
            Paragraph("Passwordless secure OAuth login, JWT session management, first-time role onboarding modal, RBAC.", table_cell_style)
        ],
        [
            Paragraph("<b>Database & Persistence</b>", table_cell_bold),
            Paragraph("Supabase (PostgreSQL 15), Row Level Security (RLS)", table_cell_style),
            Paragraph("Relational schema (profiles, problems, solutions, projects, messages), auto-triggers, real-time sync.", table_cell_style)
        ],
        [
            Paragraph("<b>Backend & API Gateway</b>", table_cell_bold),
            Paragraph("Vercel Serverless Functions (/api/chat.js), Vite Dev Middleware, Node.js Express", table_cell_style),
            Paragraph("Zero-exposure environment secrets handling, request validation, CORS, rate limiting, and AI routing.", table_cell_style)
        ],
        [
            Paragraph("<b>Artificial Intelligence Engine</b>", table_cell_bold),
            Paragraph("Google Gemini API (@google/genai SDK, gemini-2.5-pro, gemini-2.5-flash)", table_cell_style),
            Paragraph("25 strict civic domain guidance, out-of-domain rejection, step-by-step problem-solving advice.", table_cell_style)
        ],
        [
            Paragraph("<b>Micro-Interactions</b>", table_cell_bold),
            Paragraph("Canvas Confetti, Real-time status badges", table_cell_style),
            Paragraph("Delightful user feedback for milestone achievements, problem approvals, and solution submissions.", table_cell_style)
        ]
    ]

    tech_table = Table(tech_table_data, colWidths=[1.5*inch, 2.2*inch, 3.3*inch])
    tech_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), primary_color),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, bg_light]),
        ('PADDING', (0,0), (-1,-1), 5),
    ]))
    story.append(tech_table)

    story.append(PageBreak())

    # =========================================================================
    # 3. HOW THE BACKEND WORKS (IN SIMPLE LANGUAGE)
    # =========================================================================
    story.append(Paragraph("3. How the Backend Works (Simple Plain Language)", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=primary_color, spaceAfter=8))

    story.append(Paragraph(
        "Think of the <b>Samadhan.Connect Backend</b> as an invisible, highly secure coordinating bridge between the citizen's browser, the central database, and the Google Gemini AI brain. Here is how it functions in 4 simple concepts:",
        body_style
    ))

    story.append(Paragraph("A. Secure Gatekeeper (Serverless API Gateway)", h2_style))
    story.append(Paragraph(
        "When a user performs an action—such as asking a question to <b>Samadhan AI</b> or submitting a project update—the request does <i>not</i> talk directly to third-party services. Instead, it sends an encrypted HTTP request to <code>/api/chat</code>. The backend acts as a security guard: it inspects the request, confirms the user is not sending malicious data, injects secret server-only credentials (like <code>GEMINI_API_KEY</code>), and protects confidential keys from ever reaching the browser.",
        body_style
    ))

    story.append(Paragraph("B. Smart Dual-Engine Router (Live Gemini + Offline Knowledge Base)", h2_style))
    story.append(Paragraph(
        "The backend is built with <b>zero-downtime resilience</b>. When a chat message arrives, it first checks if live Google Gemini models (like <code>gemini-2.5-pro</code> or <code>gemini-2.5-flash</code>) are accessible. If the API key is active, it runs Gemini with the strict 25-domain civic prompt. If the API is offline or quota-limited, the backend automatically switches to its <b>Intelligent Civic Knowledge Engine</b>, instantly returning accurate, verified answers for Jharkhand schemes, electricity complaints, or farming subsidies without failing.",
        body_style
    ))

    story.append(Paragraph("C. Relational Database & Real-Time Sync (Supabase PostgreSQL)", h2_style))
    story.append(Paragraph(
        "All data (user profiles, reported civic issues, innovation proposals, funding pledges, and peer chat messages) is stored inside a PostgreSQL database. Database Triggers automatically create profile rows when users log in via Google/GitHub OAuth, while Row Level Security (RLS) ensures citizens only edit their own problems and Nodal Officers only verify issues in their jurisdictions.",
        body_style
    ))

    story.append(Paragraph("D. Role-Based Access Control (RBAC)", h2_style))
    story.append(Paragraph(
        "The backend guarantees strict authorization. The super-admin (<code>microsoft1gab@gmail.com</code>) has full privileges to promote any user to an Admin, while role filters dynamically tailor the dashboard views for Students, Universities, Industries, and Government Officers.",
        body_style
    ))

    # =========================================================================
    # 4. SYSTEM ARCHITECTURE FLOW DIAGRAM
    # =========================================================================
    story.append(Spacer(1, 10))
    story.append(Paragraph("4. End-to-End System Architecture Diagram", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=primary_color, spaceAfter=8))

    arch_diagram_text = """
+---------------------------------------------------------------------------------------------------+
|                                 CLIENT TIER (React 19 / Vite SPA)                                 |
|  [Citizen Dashboard]  [Student Lab]  [University Desk]  [Industry CSR Portal]  [Nodal Admin Hub]   |
|  • OAuth Sign-In (Google/GitHub)    • Problem Reporting Form    • Samadhan AI Chatbot UI          |
+---------------------------------------------------------------------------------------------------+
                                         │                                    │
                               REST / Supabase JS API                  POST /api/chat
                                         │                                    │
                                         ▼                                    ▼
+-----------------------------------------------------+  +------------------------------------------+
|          DATABASE & AUTH TIER (Supabase)            |  |         BACKEND / API GATEWAY TIER       |
|  • PostgreSQL 15 Relational DB                     |  |  • Vercel Serverless (api/chat.js)       |
|  • Supabase Auth (JWT & OAuth Handlers)            |  |  • Vite Dev Server Custom Middleware     |
|  • Row Level Security (RLS) Policies               |  |  • Server Config (chatbotPrompt.js)      |
|  • Database Triggers & Auto-Profile Sync           |  |  • Secure process.env (GEMINI_API_KEY)   |
|  • Tables: profiles, problems, solutions, projects |  |  • Multi-Model Retry & Timeout Controller|
+-----------------------------------------------------+  +------------------------------------------+
                                                                              │
                                                                 @google/genai SDK Call
                                                                              │
                                                                              ▼
                                                         +------------------------------------------+
                                                         |           EXTERNAL AI CLOUD TIER         |
                                                         |  • Google Gemini 2.5 Pro / Flash Engine  |
                                                         |  • Strict 25 Civic Domain Guardrail      |
                                                         |  • Step-by-Step Problem Solving Logic    |
                                                         +------------------------------------------+
"""

    diag_table_data = [[Paragraph(f"<pre>{arch_diagram_text.strip()}</pre>", diagram_style)]]
    diag_table = Table(diag_table_data, colWidths=[7.0*inch])
    diag_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f8fafc")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#94a3b8")),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(diag_table)

    story.append(PageBreak())

    # =========================================================================
    # 5. USER AUTHENTICATION & ROLE ONBOARDING LIFECYCLE
    # =========================================================================
    story.append(Paragraph("5. Authentication & Role Onboarding Lifecycle", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=primary_color, spaceAfter=8))

    auth_diagram_text = """
  [ User clicks 'Sign in with Google' or 'Sign in with GitHub' ]
                                │
                                ▼
  [ Supabase OAuth handles 3rd-Party Authentication & returns JWT ]
                                │
                                ▼
  [ PostgreSQL Auth Trigger checks if profile exists in 'profiles' table ]
        ├── Existing User ──> [ Load Profile & Redirect to Role Workspace ]
        └── New User ───────> [ Insert Basic Profile & Flag 'needs_role_selection' ]
                                │
                                ▼
  [ Frontend detects missing role and triggers 'RoleSelectionModal' ]
  [ User selects 1 of 5 Roles: Citizen | Student | University | Industry | Nodal Officer ]
                                │
                                ▼
  [ DataService updates profile in Supabase DB with selected Role ]
                                │
                                ▼
  [ Special Condition Check: Is email == 'microsoft1gab@gmail.com'? ]
        ├── YES ──> [ Grant SUPER_ADMIN role with full /admin panel privileges ]
        └── NO  ──> [ Grant Standard Verified Role Dashboard Access ]
"""
    auth_table = Table([[Paragraph(f"<pre>{auth_diagram_text.strip()}</pre>", diagram_style)]], colWidths=[7.0*inch])
    auth_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f0fdfa")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#5eead4")),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(auth_table)

    # =========================================================================
    # 6. SAMADHAN AI REQUEST-RESPONSE LIFECYCLE
    # =========================================================================
    story.append(Spacer(1, 10))
    story.append(Paragraph("6. Samadhan AI Chatbot Request-Response Lifecycle", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=primary_color, spaceAfter=8))

    ai_flow_text = """
  [ User types message or clicks Suggested Domain Chip (e.g. '🌾 Agriculture') ]
                                │
                                ▼
  [ Frontend Appends Message to State + Truncates History to last 10 messages ]
                                │
                                ▼
  [ POST /api/chat payload: { message: "...", history: [...] } ]
                                │
                                ▼
  [ Backend Gateway reads process.env.GEMINI_API_KEY ]
        ├── API Key Present ──> [ Initialize @google/genai with SAMADHAN_SYSTEM_PROMPT ]
        │                             │
        │                             ▼
        │                       [ Send to Gemini 2.5 Pro / Flash Engine ]
        │                             ├── Success ──> [ Return JSON reply & status: success ]
        │                             └── Rate Limit/Error ──> [ Fallback to Local Knowledge ]
        │
        └── No API Key ────────> [ Run Local Knowledge Engine for 25 Civic Domains ]
                                      ├── Is In-Domain? ────> [ Return Structured Civic Steps ]
                                      └── Is Out-of-Domain? ─> [ Return Official Refusal Text ]
                                │
                                ▼
  [ Frontend receives JSON response & renders via MarkdownMessage component ]
  [ Formats Bold text, Bullet lists, Numbered steps, and Verification disclaimers ]
"""
    ai_table = Table([[Paragraph(f"<pre>{ai_flow_text.strip()}</pre>", diagram_style)]], colWidths=[7.0*inch])
    ai_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#fefce8")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#fde047")),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(ai_table)

    story.append(PageBreak())

    # =========================================================================
    # 7. PROBLEM-SOLVING & CIVIC COLLABORATION PIPELINE
    # =========================================================================
    story.append(Paragraph("7. Civic Problem-Solving & Collaboration Pipeline", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=primary_color, spaceAfter=8))

    pipeline_text = """
  1. REPORT PHASE
     • Citizen logs in and submits a localized problem (e.g. "Water contamination in Palamu ward 4").
     • Uploads photos, location coordinates, category, and urgency level.
     • System assigns unique Tracking ID & notifies District Nodal Officer.

  2. TRIAGE & VALIDATION PHASE
     • Nodal Officer verifies authenticity, inspects feasibility, and approves as an "Active Challenge".
     • Problem is published on the Public Challenge Feed for academic & startup incubation.

  3. SOLUTION & PROPOSAL PHASE
     • Students & University Innovation Cells form multidisciplinary teams.
     • Submit technical proposals (design blueprints, budget estimate, timeline, prototype demo).
     • Faculty Mentors review and endorse the academic rigour of the solution.

  4. CSR FUNDING & MATCHING PHASE
     • Industry & CSR Partners browse validated project proposals.
     • Pledge corporate grants, CSR funding, or technical mentorship.

  5. DEPLOYMENT & VERIFICATION PHASE
     • Solution is implemented on the ground.
     • Nodal Officer confirms operational completion; Citizen receives resolution SMS/notification.
"""
    story.append(Paragraph(pipeline_text.strip().replace('\n', '<br/>'), body_style))

    # =========================================================================
    # 8. SECURITY, DATA INTEGRITY & DEPLOYMENT GUARANTEES
    # =========================================================================
    story.append(Spacer(1, 10))
    story.append(Paragraph("8. Security, Data Integrity & Deployment Guarantees", h1_style))
    story.append(HRFlowable(width="100%", thickness=1, color=primary_color, spaceAfter=8))

    security_data = [
        [
            Paragraph("Security Dimension", table_header_style),
            Paragraph("Implementation in Samadhan.Connect", table_header_style)
        ],
        [
            Paragraph("<b>API Key Isolation</b>", table_cell_bold),
            Paragraph("GEMINI_API_KEY is restricted to server-side Node.js / Vercel Serverless execution. It is never bundled into client JS or exposed in browser storage.", table_cell_style)
        ],
        [
            Paragraph("<b>Row Level Security (RLS)</b>", table_cell_bold),
            Paragraph("PostgreSQL database tables enforce RLS policies preventing unauthorized access across user tenants and role boundaries.", table_cell_style)
        ],
        [
            Paragraph("<b>Out-of-Domain Guardrails</b>", table_cell_bold),
            Paragraph("System prompt strictly confines AI answers to the 25 authorized civic domains, rejecting entertainment, gaming, jokes, and irrelevant queries.", table_cell_style)
        ],
        [
            Paragraph("<b>Factual AI Disclaimers</b>", table_cell_bold),
            Paragraph("AI assistant explicitly adds disclaimers for healthcare, legal, and banking advice, directing citizens to official portals like jharsewa.jharkhand.gov.in.", table_cell_style)
        ],
        [
            Paragraph("<b>Super Admin Safeguards</b>", table_cell_bold),
            Paragraph("Elevated privileges to promote users to Admin are restricted strictly to verified master administrative accounts (microsoft1gab@gmail.com).", table_cell_style)
        ]
    ]

    sec_table = Table(security_data, colWidths=[2.2*inch, 4.8*inch])
    sec_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0f172a")),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, border_color),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, bg_light]),
        ('PADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(sec_table)

    story.append(Spacer(1, 14))

    # Concluding Box
    conclude_data = [[
        Paragraph(
            "<b>Document Summary:</b> This technical specification details the complete frontend, backend, database, and AI architecture powering Samadhan.Connect. Designed for scalability, high availability, and rapid citizen problem resolution.",
            callout_style
        )
    ]]
    conclude_table = Table(conclude_data, colWidths=[7.0*inch])
    conclude_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f0fdf4")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#86efac")),
        ('PADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(conclude_table)

    # Build PDF with Numbered Canvas
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"[SUCCESS] PDF generated: {filename}")


if __name__ == "__main__":
    build_pdf()
