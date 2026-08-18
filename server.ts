import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with server-side API key
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// API Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API: AI Process & Architecture Advisor
app.post("/api/gemini/advisor", async (req, res) => {
  try {
    const { prompt, context } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const ai = getAiClient();
    if (!ai) {
      // Graceful fallback response when API key is not configured
      return res.json({
        response: `[Architecture Advisor Insight - Offline Mode]\n\nBased on your query: "${prompt}"\n\n1. **Integration Optimization**: Ensure OneID SCIM 2.0 provisioning is asynchronously decoupled via Kafka event bus from the Onboarding App to avoid Day-1 login bottlenecks.\n2. **Skills Framework**: Synchronize LearnHUB course completions directly into Competence Management (CptM) to dynamically update talent heatmaps.\n3. **Analytics Pipeline**: Feed HRcore and HR Services transaction telemetry into the Power BI HR Reporting gateway using incremental daily delta refreshes.\n\n*Note: To unlock live dynamic Gemini AI reasoning, configure GEMINI_API_KEY in the Secrets panel.*`
      });
    }

    const systemInstruction = `You are the Chief Enterprise HR Systems Architect and Process Optimization Consultant specializing in global enterprise HR ecosystems (such as Bosch HR Architecture).
The architecture comprises:
- Employee Persona / End Users
- Central Entry: MyHR Portal / HRcore (Employee Central, self-service, lifecycle spine)
- Stream 1: Onboarding App -> Identity & Access (OneID / OneIDM, ITSP hardware rollout)
- Stream 2: Learning & Growth: LearnHUB / TrainM -> Competence Management (CptM) & HR Academy (leadership & talent)
- Stream 3: HR Services Administration (Payroll, Benefits, Leaves, Contracts, Operations)
- Intelligence Layer: HR Reporting Platform (Power BI Workforce Analytics & Metrics)
- Lifecycle: Hire → Onboard → Develop → Retain → Transition

Provide clear, professional, structured, and actionable architectural guidance, SLA benchmarks, data flow explanations, or process optimization strategies. Format using markdown with clear headings, bullet points, and practical recommendations.`;

    const fullPrompt = context 
      ? `System Context: ${JSON.stringify(context)}\n\nUser Question: ${prompt}` 
      : prompt;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: fullPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const text = response.text || "No response generated.";
    return res.json({ response: text });
  } catch (error: any) {
    console.error("Gemini Advisor Error:", error);
    return res.status(500).json({ 
      error: "Failed to generate AI advice",
      details: error?.message || "Unknown error"
    });
  }
});

// Setup Vite or Static File Serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`HR Architecture & Process Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
