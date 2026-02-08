import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

export async function getMCPTools() {
  // 1. Connect to your local MCP server
  const transport = new StdioClientTransport({
    command: "npx",
    args: ["tsx", "mcp/terminal-server.ts"],
  });

  const client = new Client(
    { name: "aegis-agent-client", version: "1.0.0" },
    { capabilities: { tools: {} } }
  );

  await client.connect(transport);

  // 2. Fetch the tools from the server
  const { tools } = await client.listTools();

  // 3. Convert MCP tools to LangChain/Gemini format
  return tools.map((tool) => ({
    name: tool.name,
    description: tool.description,
    schema: tool.inputSchema,
  }));
}