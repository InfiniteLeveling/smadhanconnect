import { SUGGESTED_DOMAIN_PROMPTS, ALLOWED_DOMAINS } from '../../server/config/chatbotPrompt.js';

export { SUGGESTED_DOMAIN_PROMPTS, ALLOWED_DOMAINS };

export const INITIAL_AI_MESSAGE = {
  id: 'msg-ai-welcome',
  sender_id: 'samadhan-ai',
  sender_name: 'Samadhan AI',
  sender_role: 'CIVIC AI',
  is_ai: true,
  content: `Namaste! 🙏 I am **Samadhan AI**, the official civic assistant for **Samadhan.Connect**.

I can assist you with:
• **🌾 Agriculture & Subsidies**: Crop insurance, Kisan credit, irrigation.
• **⚡ Electricity & Municipal**: Power cuts, water supply, grievance redressal.
• **🏛️ Government Services**: Certificates, scholarships, welfare schemes.
• **🧑‍⚖️ Legal & Documentation**: RTI, affidavits, consumer rights, identity documents.
• **🚀 Platform Navigation**: Reporting problems, finding innovation challenges, submitting solutions.

💡 *Select a suggested domain chip below or type your question directly:*`,
  created_at: new Date().toISOString()
};

/**
 * Send message to backend Gemini API endpoint (/api/chat)
 * @param {string} message - User's current message
 * @param {Array} history - Previous messages array [{ sender: 'user'|'assistant', text: string }]
 * @returns {Promise<{ success: boolean, reply: string, error?: string }>}
 */
export const sendChatMessage = async (message, history = []) => {
  if (!message || !message.trim()) {
    return { success: false, error: 'Message cannot be empty.' };
  }

  try {
    const formattedHistory = history.map(m => ({
      sender: m.is_ai || m.sender_id === 'samadhan-ai' ? 'assistant' : 'user',
      text: m.content || m.text || ''
    }));

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message.trim(),
        history: formattedHistory
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        reply: data.reply || data.error || 'Failed to get a response from Samadhan AI.',
        error: data.error || `Server responded with status ${response.status}`,
        isConfigError: data.isConfigError
      };
    }

    return {
      success: true,
      reply: data.reply,
      domain: data.domain
    };

  } catch (err) {
    console.error('[aiChatService] Connection error:', err);
    return {
      success: false,
      reply: '⚠️ Network connection issue: Unable to reach the Samadhan AI engine. Please verify your connection or backend server and retry.',
      error: err.message
    };
  }
};
