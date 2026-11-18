#!/usr/bin/env node
// Headless owner: the HTTP API and the queue, with no stdio MCP transport and no Studio panel opened. Stays alive until
// killed. For a desktop client (Film Studio) that talks to the owner API on FLOW_MCP_PORT; the token is written to
// <FLOW_MCP_HOME>/token. Chrome is only launched when a job actually needs Flow.
import { LocalCore } from "./core.js";
import { PORT, TOKEN_FILE, startServer } from "./server.js";

const role = await startServer(new LocalCore());
if (role === "none") {
  console.error(`Port ${PORT} is used by another program. Set FLOW_MCP_PORT to a free port.`);
  process.exit(1);
}
if (role === "client") {
  console.error(`flow-mcp is already serving on http://127.0.0.1:${PORT}; nothing to start.`);
  process.exit(0);
}
console.log(`flow-mcp owner API listening on http://127.0.0.1:${PORT} (token: ${TOKEN_FILE}). Ctrl+C to stop.`);
