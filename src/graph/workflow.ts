import { StateGraph, START, END , MemorySaver } from "@langchain/langgraph";
import { AgentState } from "./state.js";
import { analyzerNode } from "../agents/diagnoser.js";
import { programmerNode } from "../agents/programmer.js";

// conditional validation
function shouldContinue(state: typeof AgentState.State) {
  // If it's fixed or we've tried 3 times, stop.
  if (state.isFixed || state.attempts >= 3) {
    return END;
  }
  // Otherwise, try to analyze the NEW state of the app
  return "analyze";
}

// 1. Initialize the Graph with our Memory Schema
const workflow = new StateGraph(AgentState)
  
  // 2. Add the "Workers" (Nodes)
  .addNode("analyze", analyzerNode)
  .addNode("patch", programmerNode)

  // 3. Define the "Path" (Edges)
  // Logic: Start -> Analyze -> Patch -> End
  .addEdge(START, "analyze")
  .addEdge("analyze", "patch")

  // 3. The Conditional Edge (The Loop)
  // After 'patch', call 'shouldContinue' to decide where to go
  .addConditionalEdges("patch", shouldContinue);

// 4. Compile the graph into a runnable "App"
//    The Safety Breakpoint (Human-in-the-loop)
//    checkpointer added 
export const aegisBrain = workflow.compile({
  checkpointer : new MemorySaver(),  // imMemory checkpointing for simplicity;
  interruptBefore: ["patch"],
});