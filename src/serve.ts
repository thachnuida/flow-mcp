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
// Exit codes: 1 = port held by another program (or never confirmed), 2 = another flow-mcp already owns the port. Never 0
// here, so a launcher cannot mistake an existing (possibly older) owner for the one it started.
if (role === "client") {
  console.error(`Another flow-mcp (or an unconfirmed holder) already owns port ${PORT}; this process did not start an API.`);
  process.exit(2);
}
console.log(`flow-mcp owner API listening on http://127.0.0.1:${PORT} (token: ${TOKEN_FILE}). Ctrl+C to stop.`);
