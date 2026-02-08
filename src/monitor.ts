import { spawn } from "child_process";
import { aegisBrain } from "./graph/workflow.js";
import * as readLine from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

async function askPermission(question: string): Promise<boolean> {
  const rl = readLine.createInterface({ input, output });
  const answer = await rl.question(`${question} (y/n): `);
  rl.close();
  return answer.trim().toLowerCase() === "y";
}

function generateThreadId() {
  return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

async function handleCrash(errorMsg: string, thread_id: string) {
  console.log("[Monitor] Alerting Aegis-SRE Brain...");

  const config = { configurable: { thread_id } };

  // 🚀 First invocation — pass the error and start the graph
  const result = await aegisBrain.invoke(
    {
      error: errorMsg,
      attempts: 0,
      isFixed: false,
      targetFile: "",
      fileContent: "",
    },
    config
  );

  // 🧠 Get the current state
  const currentState = await aegisBrain.getState(config);
  console.log("\n--- 🛡️ AEGIS-SRE DIAGNOSIS ---");
  console.log(`Target File: ${currentState.values.targetFile}`);
  console.log(`Detected Issue: ${currentState.values.error}`);

  // ❓ Ask for permission
  const approved = await askPermission("Do you want Aegis to apply the fix?");
  if (!approved) {
    console.log("🛑 Patch rejected by user. Ending monitoring for this crash.");
    return;
  }

  console.log("🚀 Applying patch...");

  // 🔁 Continuing from the last checkpoint
  const resumeResult = await aegisBrain.invoke(null, config);

  if (resumeResult.isFixed) {
    console.log("✅ Code healed successfully.");
  } else {
    console.log("⚠️ Aegis attempted to fix, but the issue is still unresolved.");
  }
}

function startMonitoring(command: string, args: string[]) {
  console.log(`[Monitor] Starting target: ${command} ${args.join(" ")}`);

  const child = spawn(command, args);

  child.stdout.on("data", (data) =>
    console.log(`[App Log]: ${data.toString().trim()}`)
  );

  child.stderr.on("data", async (data) => {
    const errorMsg = data.toString().trim();
    console.log(`\x1b[31m[CRASH DETECTED]: ${errorMsg}\x1b[0m`);

    const thread_id = generateThreadId();
    await handleCrash(errorMsg, thread_id);
  });

  child.on("close", (code) => {
    if (code !== 0) {
      console.log(
        `[Monitor] App exited with code ${code}. (No stderr triggered? Crash may be uncaught.)`
      );
    }
  });
}

startMonitoring("node", ["./tests/broken.js"]);
