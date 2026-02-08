import {spawn} from 'child_process';
import { aegisBrain } from './graph/workflow.js';
import *as readLine from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

async function askPermission(question: string): Promise<boolean> {
  const rl = readLine.createInterface({ input, output });
  const answer = await rl.question(`${question} (y/n): `);
  rl.close();
  return answer.toLowerCase() === 'y';
}


function startMonitoring(command: string , args: string[]){
    console.log(`[Monitor] Starting target: ${command} ${args.join(" ")}`);

    const child = spawn (command, args);

    // Log stdout - Not critical, just for visibility (normal app logs)
    child.stdout.on("data", (data)=>{
        console.log(`[App Log] : ${data.toString().trim()}`);
    });

    // Monitor stderr for crashes or critical errors
    child.stderr.on("data", async (data)=>{

        const errorMsg = data.toString().trim();
        console.log(`\x1b[31m[CRASH DETECTED]: ${errorMsg}\x1b[0m`);

        
        console.log("[Monitor] Alerting Aegis-SRE Brain...");  

        // Trigger the Brain!
        const finalState = await aegisBrain.invoke({
            error: errorMsg,
            attempts: 0,
            isFixed: false,
            targetFile: "",
            fileContent: ""
        });

        // need change the hardcoded thread_id
        const config = { configurable: { thread_id: "1" } };

        // Start the graph
        let result = await aegisBrain.invoke({ 
            error: errorMsg, 
            attempts: 0, 
            isFixed: false 
        }, config);

        // 2. The graph is now paused. Let's get the current state to show the user.
        const currentState = await aegisBrain.getState(config);
        console.log("\n--- 🛡️ AEGIS-SRE DIAGNOSIS ---");
        console.log(`Target File: ${currentState.values.targetFile}`);
        console.log(`Issue: ${currentState.values.error}`);
        
        // Ask for permission to apply the fix
        const approved = await askPermission("Do you want Aegis to apply the fix?");
        


        if (approved) {
            console.log("🚀 Applying patch...");
            // 4. Resume the graph by passing 'null'
            const finalResult = await aegisBrain.invoke(null, config);
            
            if (finalResult.isFixed) {
                console.log("✅ Code healed successfully.");
            }
            }
        else {
            console.log("🛑 Patch rejected by user. Standing down.");
        }

        // if (finalResult.isFixed) {
        // console.log("🏁 Aegis-SRE has successfully healed the app!");
        // }
     
    });

    // Monitor for process exit with error codes
    child.on("close",(code)=>{
        if (code !== 0) {
            console.log(`[Monitor] App exited with error code ${code}. Initiating healing...`);
        }
    });
    
}

startMonitoring("node", ["./tests/broken.js"]);