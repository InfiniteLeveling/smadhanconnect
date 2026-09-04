# How to Use Google Stitch to Redesign Samadhan Connect

> **Important Clarification on Google Stitch & `.fig` Files:**  
> **Google Stitch does NOT accept or open `.fig` files directly.**  
> Google Stitch is an AI design tool created to generate designs from **`design.md` design rules**, **text prompts**, and **wireframe/screenshot images** — and then **export them into Figma** (not the other way around).

Below is the exact, step-by-step workflow to feed Samadhan Connect into Stitch and get a world-class UI.

---

## 1. What to Feed into Google Stitch

Google Stitch takes three key inputs to understand your project:

1. **Your Design System Document**: [**`design.md`**](file:///d:/samadhanconnect/design.md) (Already created in your workspace)
   - Stitch uses `design.md` to know your brand colors (Emerald `#16A34A`), typography (Outfit & Plus Jakarta Sans), and component styles.
2. **Your Design Tokens**: [**`figma_design_tokens.json`**](file:///d:/samadhanconnect/figma_design_tokens.json)
3. **Structured Stitch Prompts** (Provided in Section 3 below).

---

## 2. Step-by-Step Stitch Workflow

### Step 1: Open Google Stitch
- Go to [stitch.withgoogle.com](https://stitch.withgoogle.com) (or your Google Stitch workspace).
- Create a **New Project** named `Samadhan Connect 2.0`.

### Step 2: Set the Design System in Stitch
In Stitch's project context / design rules window, paste the contents of your [**`design.md`**](file:///d:/samadhanconnect/design.md) file:
- Primary Color: Emerald `#16A34A` / `#22C55E`
- Neutral Base: Slate-50 (Light) / Slate-950 (Dark)
- Heading Font: `Outfit`
- Body Font: `Plus Jakarta Sans`
- Style: Modern GovTech & Civic Innovation Platform with glassmorphic cards and glowing status pills.

### Step 3: Paste the Component Prompts (Section 3)
Paste the ready-to-use prompts below into Stitch to generate each page view.

### Step 4: Export to Figma from Stitch
Once Stitch generates the UI:
1. Click the **"Export to Figma"** button inside Stitch.
2. Paste the generated link or open the file in Figma.
3. In Figma, click **File $\rightarrow$ Save local copy...** to download your native **`.fig`** file!

---

## 3. Ready-to-Paste Stitch Prompts

### Prompt A: Modern Hero Section & Real-Time Marquee
```text
Design a high-end civic-tech hero section for 'Samadhan Connect' (India's GovTech & Innovation platform).
Theme & Design Rules:
- Primary Accent: Brand Emerald (#16A34A) with radiant green glows (#22C55E).
- Dark/Light dual mode support with frosted glass cards (backdrop-blur-md).
- Typography: 'Outfit' for bold display headings, 'Plus Jakarta Sans' for body text.

Layout Elements:
1. Top Announcement Pill: '🇮🇳 National Innovation Challenge 2026 Live — ₹50 Lakhs in Seed Grants →' with animated shimmering border.
2. Bold Headline: 'Where National Challenges Meet Groundbreaking Innovators.'
3. Subtitle: 'Connecting Government Ministries, University R&D Labs, CSR Industry Funds, and Student Innovators to solve India's urgent civic problems.'
4. Dual Action CTAs:
   - Primary: '⚡ Solve Challenges →' (Emerald gradient with glow shadow)
   - Secondary: '🚨 Report an Issue' (Glassmorphic border)
5. Below CTAs: An infinite live Marquee ticker streaming real-time milestones:
   - '⚡ Ministry of Jal Shakti posted Smart Water Metering (₹25L Grant)'
   - '🎓 IIT Madras team submitted prototype for AI Crop Disease Detection'
   - '✅ Problem #412 Solved: Solar Micro-Grid deployed'
6. 4 Metric Counter Cards: '1,240+ Problems Reported', '₹18.5 Cr+ Total Grants', '340+ University Labs', '96.4% Resolution Rate'.
```

---

### Prompt B: 4-Pillar Ecosystem Bento Grid
```text
Design an asymmetrical 4-Card Bento Grid showcasing the 4 pillars of 'Samadhan Connect':
- Card 1 (Large 2x2): 'Government RFPs & Nodal Challenges'
  * Live status pill: '🟢 48 Active National Challenges'
  * Icon: 🏛️ Ministry seal
  * Primary CTA: 'Explore Ministry RFPs →'
- Card 2 (Wide 2x1): 'University & Research Labs'
  * Academic endorsements, student grant applications, patent milestones
  * Icon: 🎓 Academic cap
- Card 3 (Wide 2x1): 'Industry & CSR Grants'
  * Corporate CSR pledge funds, hardware testing facilities, corporate mentorship
  * Icon: 🏭 Industrial factory
- Card 4 (Full Width 4x1): 'Citizen Voice & Geotagging'
  * One-click GPS camera evidence reporting with AI auto-categorization
  * Icon: 👨‍🌾 Citizen voice
  * Button: 'Submit a Civic Issue →'

Include ambient glows, subtle 1px slate-800 borders, and soft shadows.
```

---

### Prompt C: 3-Step Frictionless Citizen Reporting Flow
```text
Design a multi-step progressive problem reporting wizard for citizens:
- Step Progress Bar: [1. The Problem] -> [2. Geo-Location] -> [3. Photo Proof]
- Step 1: Input fields for Problem Title, Category dropdown (Water, Roads, Sanitation, Electricity), and Description. Add an 'AI Suggestion' chip that predicts urgency.
- Step 2: Location selector card with '📍 Auto-Detect My Current GPS Location' button and detected coordinates (28.6139° N, 77.2090° E).
- Step 3: Drag-and-drop photo/video uploader with image preview cards and remove buttons.
- Final Output: A digital 'Citizen Tracking Boarding Pass' with a scannable QR Code, unique Ticket ID (#SAM-2026-8942), and a 4-step vertical resolution progress timeline.
```

---

## 4. Summary: How the Pieces Connect

```
┌───────────────────────────┐
│       design.md           │ ────► Fed as Design Rules into Google Stitch
│  (Colors, Fonts, Rules)   │
└───────────────────────────┘
              │
              ▼
┌───────────────────────────┐
│     Google Stitch         │ ────► Generates high-fidelity AI UI layouts
│  (stitch.withgoogle.com)  │
└───────────────────────────┘
              │
              ▼ Click "Export to Figma" in Stitch
┌───────────────────────────┐
│       Figma App           │ ────► File ➔ Save local copy... ➔ .fig file!
│   (figma.com)             │
└───────────────────────────┘
```
