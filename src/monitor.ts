import {spawn} from 'child_process';
import { aegisBrain } from './graph/workflow.js';

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

        if (finalState.isFixed) {
        console.log("🏁 Aegis-SRE has successfully healed the app!");
        }
     
    });

    // Monitor for process exit with error codes
    child.on("close",(code)=>{
        if (code !== 0) {
            console.log(`[Monitor] App exited with error code ${code}. Initiating healing...`);
        }
    });
    
}

startMonitoring("node", ["./tests/broken.js"]);