import 'dotenv/config';
import { aegisBrain } from "./src/graph/workflow.js";
import { HumanMessage } from "@langchain/core/messages";

async function testReactLoop() {
  console.log("🚀 Testing ReAct Loop: Analyzer <-> Tools");

  // 1. Setup a unique thread for this test
  const config = { configurable: { thread_id: "test_react_1" } };

  // 2. Initial input: A crash that requires reading a file to fix
  const initialInput = {
    error: "ReferenceError: dbConnection is not defined in tests/broken-app.js",
    messages: [], // Start with empty history
    attempts: 0,
    isFixed: false
  };

  try {
    console.log("--- Starting Graph ---");
    
    // We stream the events so we can see exactly what nodes are firing
    const eventStream = await aegisBrain.stream(initialInput, {
      ...config,
      streamMode: "values"
    });

    for await (const event of eventStream) {
      const lastMsg = event.messages[event.messages.length - 1];
      
      if (lastMsg?.tool_calls?.length > 0) {
        console.log(`\n🛠️  [TOOL CALL]: Gemini wants to use ${lastMsg.tool_calls[0].name}`);
      } else if (lastMsg?._getType() === "ai") {
        console.log(`\n🤖 [AI THOUGHT]: ${lastMsg.content.slice(0, 100)}...`);
      }
    }

    // 3. Check the state after the loop pauses
    const finalState = await aegisBrain.getState(config);
    console.log("\n--- Final Test State ---");
    console.log("Messages in History:", finalState.values.messages.length);
    console.log("Next Node (Paused at):", finalState.next);

    if (finalState.values.messages.length > 2) {
      console.log("\n✅ SUCCESS: The ReAct loop worked! Gemini used tools before deciding.");
    } else {
      console.log("\n⚠️ FAIL: Gemini didn't use any tools. Check the bindTools logic.");
    }

  } catch (error) {
    console.error("❌ Test Crashed:", error);
  }
}

testReactLoop();