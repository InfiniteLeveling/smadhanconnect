# Figma Setup & `.fig` File Generation Guide for Samadhan Connect

This guide explains how to import the design system, vector artboards, and design tokens into Figma, and how to export your native `.fig` file.

---

## 1. Assets Created for You in the Project Root

1. [**`samadhan_connect_design_system.svg`**](file:///d:/samadhanconnect/samadhan_connect_design_system.svg)
   - A multi-artboard canvas containing:
     * **Frame 1**: Color Tokens (Brand Emerald, Semantic Roles) & Typography Hierarchy
     * **Frame 2**: Master Desktop Landing Page Hero & Glassmorphic Navigation
     * **Frame 3**: 4-Pillar Ecosystem Bento Grid (Govt, Universities, CSR, Citizens)
     * **Frame 4**: Production Challenge Card Component Specs (Idle vs. Hover Lift)
     * **Frame 5**: Citizen 3-Step Reporting Wizard & Digital Verification Boarding Pass
2. [**`figma_design_tokens.json`**](file:///d:/samadhanconnect/figma_design_tokens.json)
   - W3C standard tokens file containing all color scales (`brand-50` to `brand-950`), typography families, font sizes, border radii, and shadows for Figma Variables / Tokens Studio.

---

## 2. How to Open in Figma (Takes 10 Seconds)

### Method A: Direct Drag & Drop into Figma (Instant Editable Layers)
1. Open [Figma](https://www.figma.com) (in your browser or Figma Desktop App).
2. Create a new design file (**New design file**).
3. Drag and drop [**`samadhan_connect_design_system.svg`**](file:///d:/samadhanconnect/samadhan_connect_design_system.svg) directly onto the Figma canvas.
4. **Result:** Figma will instantly parse the vector file into individual editable groups, vectors, frames, and text layers!

---

### Method B: Convert Running Web App into Native Figma with Auto-Layout (html.to.design)
This produces pixel-perfect Auto-Layout frames from your actual React code:
1. In your terminal, start the app:
   ```bash
   npm run dev
   ```
2. Open Figma, go to **Plugins** $\rightarrow$ Search for **html.to.design** (Free Figma community plugin).
3. Open the plugin, select **Import from URL**, and enter `http://localhost:5173` (or paste the HTML).
4. Click **Import**.
5. It automatically converts the entire live website into native Figma frames with responsive Auto-Layout!

---

### Method C: Import Design Tokens
1. In Figma, open the **Tokens Studio for Figma** plugin (or Figma's built-in Variables manager).
2. Click **Load from file / Tools** $\rightarrow$ select [**`figma_design_tokens.json`**](file:///d:/samadhanconnect/figma_design_tokens.json).
3. All brand colors (`brand-50` to `brand-950`), font styles, and elevation drop-shadows will be added to your Figma file as reusable design variables.

---

## 3. How to Save as a Native `.fig` File

Since `.fig` is Figma's internal proprietary binary archive format, you export it from Figma once your file is open:
1. In Figma desktop or web, click the **Figma Menu** icon (top-left).
2. Navigate to:
   **File** $\rightarrow$ **Save local copy...**
3. Save the file as `samadhan_connect.fig`.
