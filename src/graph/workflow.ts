import { StateGraph, START, END } from "@langchain/langgraph";
import { AgentState } from "./state.js";
import { analyzerNode } from "../agents/diagnoser.js";
import { programmerNode } from "../agents/programmer.js";

// 1. Initialize the Graph with our Memory Schema
const workflow = new StateGraph(AgentState)
  
  // 2. Add the "Workers" (Nodes)
  .addNode("analyze", analyzerNode)
  .addNode("patch", programmerNode)

  // 3. Define the "Path" (Edges)
  // Logic: Start -> Analyze -> Patch -> End
  .addEdge(START, "analyze")
  .addEdge("analyze", "patch")
  .addEdge("patch", END);

// 4. Compile the graph into a runnable "App"
export const aegisBrain = workflow.compile();