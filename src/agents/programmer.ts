import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { AgentState } from "../graph/state.js";
import { writeFile } from "fs/promises";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  apiKey: process.env.GOOGLE_API_KEY!,
});

export async function programmerNode(state: typeof AgentState.State) {
  console.log(`🛠️ Programmer Node: Fixing ${state.targetFile}...`);

  // 1. The Request to Gemini
  const prompt = `
    You are an AI SRE Agent. Your goal is to fix the following error:
    "${state.error}"

    The content of the file "${state.targetFile}" is:
    """
    ${state.fileContent}
    """

    Please provide the corrected code for the ENTIRE file. 
    Wrap your code in \`\`\`javascript or \`\`\`typescript blocks.
  `;

  const response = await model.invoke(prompt);
  const content = response.content as string;

  // 2. Extract the code from the Markdown (simple regex)
  const codeBlockRegex = /```(?:javascript|typescript)?\n([\s\S]*?)```/;
  const match = content.match(codeBlockRegex);
  const fixedCode = match ? match[1]!.trim() : content;

// extra ! used to assert that match[1] is not undefined, since we check if match exists before accessing it.

  // 3. APPLY THE FIX (The "Hands" part)
  // In Phase 4, we will add a Human-in-the-loop pause here.
  // For now, let's write it to disk.
  try {
    await writeFile(state.targetFile, fixedCode);
    console.log(`✅ Successfully patched ${state.targetFile}`);
    return { isFixed: true };
  } catch (err: any) {
    console.error(`❌ Failed to write fix: ${err.message}`);
    return { isFixed: false };
  }
}