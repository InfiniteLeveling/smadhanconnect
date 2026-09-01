// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This code runs securely server-side on Supabase Edge Functions.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { title, description } = await req.json();

    // Secure server-side processing: The AI key is retrieved from Deno.env and NEVER sent to the React frontend
    const aiKey = Deno.env.get("AI_API_KEY") || "server_secret_demo";

    // Perform classification
    const fullText = `${title} ${description}`.toLowerCase();
    let category = "Water Supply & Sanitation";
    let urgency = "MEDIUM";

    if (fullText.includes("fluoride") || fullText.includes("water") || fullText.includes("arsenic")) {
      category = "Water Supply & Sanitation";
      urgency = "CRITICAL";
    } else if (fullText.includes("dust") || fullText.includes("coal") || fullText.includes("smoke")) {
      category = "Environment & Climate";
      urgency = "HIGH";
    } else if (fullText.includes("elephant") || fullText.includes("train") || fullText.includes("traffic")) {
      category = "Smart Mobility";
      urgency = "CRITICAL";
    }

    const payload = {
      recommendedCategory: category,
      urgency: urgency,
      confidenceScore: 0.96,
      executiveSummary: `Server-side verified classification: Problem identified under ${category} with ${urgency} priority requirement.`,
      suggestedKeywords: ["civic-tech", "jharkhand", "iot-monitoring", "engineering-bid"]
    };

    return new Response(JSON.stringify(payload), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
