import { StateGraph, START, END } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { analyzerNode } from "../agents/diagnoser.js";
import { programmerNode } from "../agents/programmer.js";
import { getMCPTools } from "../mcp-client.js";


const workflow = 
 
  // .addNode("analyze", analyzerNode)
  // .addNode("tools", toolNode) 
  // .addNode("patch", programmerNode)

  // .addEdge(START, "analyze")
  // .addConditionalEdges("analyze", route)
  // .addEdge("tools", "analyze") 
  // .addEdge("patch", "validate");
  // .addConditionalEdges("validate", check_route)
  

export const aegisBrain = workflow.compile();