import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { AgentState } from "../graph/state.js";
import { getMCPTools } from "../mcp-client.js";

import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
  throw new Error("GOOGLE_API_KEY is not set in environment variables");
}

const tools = await getMCPTools();

// 1. Initialize Gemini
const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash", 
  apiKey,
}).bindTools(tools);

// 2. The Node Function
export async function analyzerNode(state: typeof AgentState.State) {
  console.log("🧠 Analyzer Node: Investigating the crash...");

  const prompt = `
    You are an expert SRE. The application crashed with this error: 
    "${state.error}"
    
    Your task:
    1. Identify which file likely caused this.
    2. Explain why it happened.
    
    Return your response as JSON: { "filename": "path/to/file", "reason": "..." }
  `;

 // console.log("Sending prompt to Gemini...");

  const response = await model.invoke(prompt);
  
 // console.log("Gemini's Raw Response:", response);

  // We parse the AI response (in a real app, we'd use structured output)
  const result = JSON.parse(response.content as string);

  // 3. Return the updates to the State
  return {
    targetFile: result.filename,
    attempts: state.attempts + 1,
  };
}