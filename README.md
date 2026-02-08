# 🧭 Aegis-SRE: Self-Healing Autonomous Agent
**Production-grade SRE agent that monitors, diagnoses, and auto-patches application crashes.**

[![Observability: LangSmith](https://img.shields.io/badge/Observability-LangSmith-orange)](https://smith.langchain.com/)
[![Protocol: MCP](https://img.shields.io/badge/Protocol-MCP-blue)](https://modelcontextprotocol.io/)
[![Engine: Gemini 3 Flash](https://img.shields.io/badge/Engine-Gemini_3_Flash-green)](https://ai.google.dev/)

---

## 🚀 The Vision
Aegis-SRE is a local-first autonomous agent designed to reduce Mean Time to Repair (MTTR). It acts as a "Junior SRE" that watches application logs in real-time, reasons through stack traces using LLMs, and executes code-level repairs via a secure Model Context Protocol (MCP) bridge.

## 🏗️ Architecture
The system is built on a **Stateful Cyclic Graph** architecture:

1.  **Sensors (Monitor):** Wraps Node.js processes to intercept `stderr` and `stdout`.
2.  **Brain (LangGraph):** Orchestrates a "Diagnose → Patch → Verify" loop.
3.  **Hands (MCP Server):** A secure JSON-RPC interface that grants the agent restricted terminal and filesystem access.
4.  **Safety (Human-in-the-Loop):** A mandatory breakpoint system requiring manual approval before filesystem writes.



## 🛠️ Tech Stack (2026 Industry Standard)
* **Language:** TypeScript (Strict Mode)
* **Orchestration:** LangGraph.js
* **Intelligence:** Gemini 3 Flash (1M Context Window)
* **Protocol:** Model Context Protocol (MCP) SDK
* **Observability:** LangSmith (for trace analysis and debugging)

## 📋 Key Features
* **Iterative Healing:** If a patch fails, the agent re-analyzes the new error and converges on a solution.
* **Contextual Awareness:** Uses MCP `read_file` tools to ingest local codebase context dynamically.
* **Deterministic State:** Built with Zod-validated state schemas to prevent agent "hallucination" loops.
* **Human-Centric Safety:** Implements LangGraph `interrupts` to ensure zero unauthorized code changes.

## 🚦 Getting Started

### 1. Prerequisites
- Node.js v20+ 
- Google AI Studio API Key
- LangSmith API Key (Optional but recommended)

### 2. Running the Monitor
 - npx tsx src/monitor.ts