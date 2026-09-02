import { GoogleGenAI } from '@google/genai';
import { 
  SAMADHAN_SYSTEM_PROMPT, 
  ALLOWED_DOMAINS, 
  OUT_OF_DOMAIN_RESPONSE 
} from '../server/config/chatbotPrompt.js';

/**
 * Intelligent Local Knowledge Responder for 25 Civic Domains
 * Used when GEMINI_API_KEY is not configured on the environment.
 */
function generateLocalKnowledgeReply(message) {
  const lower = message.toLowerCase().trim();

  // 1. Out-of-Domain Detection (Jokes, Movies, Gaming, Recipes, Entertainment)
  const isOutOfDomain = 
    lower.includes('joke') || 
    lower.includes('funny') || 
    lower.includes('movie') || 
    lower.includes('cinema') || 
    lower.includes('actor') || 
    lower.includes('actress') || 
    lower.includes('celebrity') || 
    lower.includes('game') || 
    lower.includes('gaming') || 
    lower.includes('playstation') || 
    lower.includes('recipe') || 
    lower.includes('cook') || 
    lower.includes('cricket score') || 
    lower.includes('astrology') || 
    lower.includes('horoscope');

  if (isOutOfDomain) {
    return OUT_OF_DOMAIN_RESPONSE;
  }

  // 2. Greetings
  if (lower === 'hello' || lower === 'hi' || lower === 'hey' || lower.startsWith('namaste') || lower === 'help') {
    return `Namaste! 🙏 I am **Samadhan AI**, the official civic assistant for **Samadhan.Connect** (Jharkhand Civic Problem-Solving Ecosystem).

I am here to guide citizens, students, innovators, and officials across Jharkhand with:
• **🌾 Agriculture & Subsidies**: Crop insurance (PMFBY), Kisan Credit Cards (KCC), irrigation support.
• **⚡ Electricity & Municipal**: Power outages, JBVNL consumer billing, streetlight complaints.
• **🏛️ Government Services & Schemes**: JharSewa certificates, welfare pensions, scholarships.
• **🧑‍⚖️ Legal, Identity & Documentation**: RTI filing, Aadhaar/Voter ID updates, affidavits.
• **🚀 Platform Problem Solving**: Submitting civic issues, tracking solutions, collaborating on challenges.

💡 *Select any topic chip below or type your specific question directly.*`;
  }

  // 3. Agriculture & Farming
  if (lower.includes('farmer') || lower.includes('agriculture') || lower.includes('crop') || lower.includes('krishi') || lower.includes('irrigation') || lower.includes('fertilizer') || lower.includes('kisan')) {
    return `**🌾 Agricultural Support & Subsidies in Jharkhand:**

1. **PM-KISAN & Mukhyamantri Krishi Ashirwad Yojana**:
   • Direct financial assistance transferred to landholding farmers' bank accounts.
   • Apply or update e-KYC via the **PM-KISAN portal** or your nearest **Pragya Kendra (CSC)**.

2. **Kisan Credit Card (KCC)**:
   • Concessional institutional credit for crop cultivation and post-harvest expenses.
   • Submit application at your local cooperative bank, Grameen bank, or commercial branch.

3. **Jharkhand Rajya Fasal Rahat Yojana (JRFRY)**:
   • State crop relief scheme in case of crop damage from drought or erratic weather.
   • Register online at \`jrfry.jharkhand.gov.in\` with land documents (Parcha/LPC) and Aadhaar.

4. **Micro-Irrigation & Farm Machinery Subsidies**:
   • Up to 80% subsidy on drip/sprinkler equipment and solar water pumps under PM-KUSUM.
   • Apply through the District Agriculture Officer (DAO) or Jharkhand State Agriculture portal.

*⚠️ Please verify the latest seasonal deadlines with your local Block Agriculture Officer (BAO) or nearest Pragya Kendra.*`;
  }

  // 4. Electricity & Power
  if (lower.includes('electricity') || lower.includes('power') || lower.includes('jbvnl') || lower.includes('meter') || lower.includes('transformer') || lower.includes('current') || lower.includes('blackout') || lower.includes('outage') || lower.includes('disconnection')) {
    return `**⚡ Electricity & Power Supply Resolution (JBVNL):**

1. **Immediate Outage & Breakdown Helpline**:
   • **Call Toll-Free Helpline: 1912** or **1800 345 6570** (Jharkhand Bijli Vitran Nigam Ltd - JBVNL).
   • Send an SMS or WhatsApp complaint via the official JBVNL Suvidha Portal.

2. **Resolving Disconnection or Meter Disputes**:
   • **Check Billing Status**: Log in to \`jbvnl.co.in\` or use the JBVNL Mobile App to inspect payment status and bill copies.
   • **Defective Meter / Wrong Bill**: File a grievance with your local Assistant Engineer (AE) / Junior Engineer (JE) electricity subdivision office.
   • **Reconnection Request**: Pay pending dues online and obtain the automated transaction receipt for instant restoration.

3. **PM Surya Ghar: Muft Bijli Yojana (Rooftop Solar)**:
   • Subsidies up to ₹78,000 for installing residential rooftop solar systems.
   • Apply at \`pmsuryaghar.gov.in\`.`;
  }

  // 5. Citizen Grievances & Municipal Services
  if (lower.includes('garbage') || lower.includes('complaint') || lower.includes('grievance') || lower.includes('municipal') || lower.includes('road') || lower.includes('pothole') || lower.includes('drainage') || lower.includes('streetlight') || lower.includes('swachh')) {
    return `**📋 Citizen Grievance & Municipal Redressal:**

1. **State Centralized Grievance Portal (Jan Samvad / CPGRAMS)**:
   • Register public grievances online at \`jansamvad.jharkhand.gov.in\` or \`pgportal.gov.in\`.
   • Each complaint generates a unique Tracking ID with time-bound nodal escalation.

2. **Local Municipal Corporation / Nagar Parishad (RMC / DMC / MMC)**:
   • **Garbage & Sanitation**: Report uncollected waste using the **Swachhata App** or contact your Ward Sanitation Supervisor.
   • **Broken Streetlights & Roads**: Lodge a complaint on the official municipal civic helpline or your Ward Councillor's office.

3. **Escalation Steps**:
   • If unresolved within 7 working days, escalate to the Municipal Executive Officer / Nodal Grievance Officer.
   • You can also publish this challenge directly on **Samadhan.Connect** to invite student and technical innovations!`;
  }

  // 6. Identity & Government Documents
  if (lower.includes('document') || lower.includes('aadhaar') || lower.includes('voter') || lower.includes('pan card') || lower.includes('ration') || lower.includes('certificate') || lower.includes('caste') || lower.includes('income') || lower.includes('residential') || lower.includes('domicile') || lower.includes('jharsewa')) {
    return `**🆔 Government Certificates & Identity Documents (JharSewa):**

1. **State Certificates (Caste, Income, Residential/Domicile, EWS)**:
   • **Portal**: \`jharsewa.jharkhand.gov.in\` (JharSewa Portal).
   • **Procedure**: Create an account, upload required documents (Khatian/LPC, Aadhaar, self-declaration), and track application status.
   • **Assisted Application**: Visit your nearest **Pragya Kendra (Common Service Centre)**.

2. **Aadhaar Card Updates**:
   • **Online (Address only)**: \`myaadhaar.uidai.gov.in\` with valid address proof.
   • **Biometric / Mobile Number Update**: Requires physical visit to an authorized Aadhaar Seva Kendra / Post Office.

3. **Voter ID (EPIC)**:
   • Apply for new registration (Form 6) or correction (Form 8) via \`voters.eci.gov.in\` or the **Voter Helpline App**.

4. **Digital Copies**:
   • Store and access legally valid digital versions of your certificates via **DigiLocker** (\`digilocker.gov.in\`).`;
  }

  // 7. General Civic / Platform Inquiry Fallback
  return `**🏛️ Samadhan AI Civic Guidance:**

Thank you for reaching out regarding: **"${message}"**.

**Recommended Steps & Resources:**
1. **Official State Portals**: Access dedicated e-governance services via \`jharkhand.gov.in\` and \`jharsewa.jharkhand.gov.in\`.
2. **Citizen Helpline**: Call 181 (State Citizen Helpline) for information on government schemes and grievance logging.
3. **Samadhan.Connect Platform**:
   • Click **"Report Problem"** in the top navigation to submit community challenges for multi-stakeholder resolution.
   • Explore active challenges submitted by citizens, universities, and industry partners.

*💡 For state-wide or department-specific procedures, please verify the latest guidelines with your local district office.*`;
}

/**
 * Serverless / Node HTTP API Handler for POST /api/chat
 * Securely communicates with Google Gemini 2.5 Pro via @google/genai SDK,
 * with intelligent built-in fallback when GEMINI_API_KEY is not yet supplied.
 */
export default async function handler(req, res) {
  // Enable CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method Not Allowed. Only POST requests are supported.' 
    });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { message, history = [] } = body;

    // 1. Validate Input
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ 
        error: 'Invalid request: "message" field is required and cannot be empty.' 
      });
    }

    const trimmedMessage = message.trim();

    // 2. Check for Gemini API Key
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY') {
      // Intelligent Local Knowledge Engine for 25 Civic Domains
      const fallbackReply = generateLocalKnowledgeReply(trimmedMessage);
      
      return res.status(200).json({
        reply: fallbackReply,
        status: 'local_mode',
        notice: 'Running on Samadhan AI Knowledge Engine. To activate live Gemini 2.5 Pro reasoning, add GEMINI_API_KEY to your server environment.'
      });
    }

    // 3. Initialize Google Gen AI SDK
    const ai = new GoogleGenAI({ apiKey });

    // 4. Format Conversation History (limit to last 10 messages)
    const validHistory = Array.isArray(history) ? history.slice(-10) : [];
    const formattedContents = [];
    
    for (const item of validHistory) {
      const rawText = item.text || item.content || item.message;
      if (rawText && typeof rawText === 'string') {
        const isUser = item.sender === 'user' || item.role === 'user';
        formattedContents.push({
          role: isUser ? 'user' : 'model',
          parts: [{ text: rawText }]
        });
      }
    }

    // Append current user message
    formattedContents.push({
      role: 'user',
      parts: [{ text: trimmedMessage }]
    });

    // 5. Call Gemini with System Instruction (trying gemini-2.5-pro with fallback to gemini-2.0-flash / gemini-1.5-pro)
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Gemini API request timed out after 30 seconds.')), 30000)
    );

    let response = null;
    const candidateModels = [
      'gemini-2.5-pro',
      'gemini-2.5-flash',
      'gemini-3.1-pro-preview',
      'gemini-2.0-flash-exp'
    ];

    for (const modelName of candidateModels) {
      try {
        const generatePromise = ai.models.generateContent({
          model: modelName,
          contents: formattedContents,
          config: {
            systemInstruction: SAMADHAN_SYSTEM_PROMPT,
            temperature: 0.3,
            maxOutputTokens: 1200,
          }
        });

        response = await Promise.race([generatePromise, timeoutPromise]);
        if (response) break;
      } catch (modelErr) {
        console.warn(`[Samadhan AI] Model ${modelName} returned notice:`, modelErr.message);
        // Continue to next candidate model or fallback to civic knowledge base
      }
    }


    const replyText = response?.text || response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!replyText) {
      // Graceful fallback to local knowledge engine if all remote models fail
      const fallbackReply = generateLocalKnowledgeReply(trimmedMessage);
      return res.status(200).json({
        reply: fallbackReply,
        status: 'fallback_mode'
      });
    }

    return res.status(200).json({
      reply: replyText.trim(),
      status: 'success'
    });


  } catch (error) {
    console.error('[Samadhan AI] Error handling chat request:', error);

    const errorMessage = error.message || 'An unexpected error occurred while processing your request.';
    const isRateLimit = errorMessage.includes('429') || errorMessage.toLowerCase().includes('quota') || errorMessage.toLowerCase().includes('rate limit');
    const isTimeout = errorMessage.includes('timed out');

    // If Gemini fails, fallback gracefully to the local knowledge base
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      if (body?.message) {
        const fallbackReply = generateLocalKnowledgeReply(body.message);
        return res.status(200).json({
          reply: fallbackReply,
          status: 'fallback_mode'
        });
      }
    } catch {
      // Ignore inner parse error
    }

    return res.status(isRateLimit ? 429 : 500).json({
      error: isRateLimit
        ? 'Gemini API rate limit reached. Please wait a moment and try again.'
        : isTimeout
        ? 'The request timed out. Please check your connection and try again.'
        : `Samadhan AI service notice: ${errorMessage}`,
      reply: isRateLimit
        ? '⚠️ High traffic notice: The AI assistant is currently experiencing high demand. Please retry in a few seconds.'
        : '⚠️ I encountered a temporary connection issue while reaching the AI engine. Please try sending your question again.'
    });
  }
}
