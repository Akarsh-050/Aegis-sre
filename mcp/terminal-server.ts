import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { exec } from "child_process";
import { promisify } from "util";


const execAsync = promisify(exec);

// 1. Initialize the Server
const server = new McpServer({
  name: "aegis-terminal-server",
  version: "1.0.0",
});

// 2. Define the "run_command" Tool
server.tool(
  "run_command",
  "Executes a terminal command on the local system safely.",
  {
    command: z.string().describe("The shell command to run (e.g., 'ls', 'npm test')"),
  },
  async ({ command }) => {
    try {
      console.error(`[Aegis] Executing: ${command}`); // Log to stderr so we don't break the MCP pipe
      const { stdout, stderr } = await execAsync(command);
      
      return {
        content: [{ 
          type: "text", 
          text: stdout || stderr || "Command executed with no output." 
        }],
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `Error: ${error.message}` }],
        isError: true,
      };
    }
  }
);

// 3. Connect via Standard Input/Output
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Fatal error in MCP server:", error);
  process.exit(1);
});