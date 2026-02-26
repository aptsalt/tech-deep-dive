import type { Project } from "../types";

export const contextEngineering: Project = {
  id: "context-engineering",
  name: "Context Engineering for Agent Systems",
  description:
    "A production-grade framework for building reliable AI agent systems. Covers the five primitives of context engineering — Ontology, Context Graph, Skill Graph, Context Compiler, and Verification Loop — synthesized from Anthropic, OpenAI, and Manus research, implemented in a real-world mission control dashboard.",
  repo: "https://github.com/aptsalt/claude-pilot",
  languages: ["TypeScript", "JavaScript", "SQL", "YAML"],
  technologies: [
    {
      name: "Context Graph",
      category: "ai-ml",
      icon: "CG",
      tagline: "Durable, queryable runtime truth stored outside the token window",
      origin: {
        creator: "Graph databases (Neo4j) + Knowledge Graphs (Google)",
        year: 2007,
        motivation:
          "Graph databases emerged in 2007 with Neo4j to model connected data naturally. Google popularized knowledge graphs in 2012 for web search. The context engineering community adapted these ideas to give AI agents durable, queryable state that survives context window compaction and enables cross-session learning.",
      },
      whatItIs: `A typed, queryable representation of runtime truth stored OUTSIDE the token window. The context graph consists of nodes (tasks, receipts, claims, artifacts, decisions, sessions, events) connected by typed edges (TASK_EVIDENCED_BY, CLAIM_SUPPORTED_BY, SESSION_CONTAINS_EVENT, etc.). Unlike in-context memory which is ephemeral and limited by the token window, the context graph is persistent, queryable via SQL or graph traversal, and shared across agents. It serves as the single source of truth for everything that has happened in the system — every tool call, every decision, every verification result. The graph is append-mostly (new events are added, old events are rarely modified), which makes it naturally suited for audit trails and temporal queries. Agents read from the graph via the context compiler (which selects and ranks the most relevant subset for each turn) and write to it via the verification loop (which ensures only validated data enters shared state).`,
      explainLikeImTen:
        "Imagine you and your friends are building a huge LEGO project together, but you can only look at a small section of the instructions at a time. The context graph is like a shared notebook where everyone writes down what they built, what pieces they used, and what still needs to be done. Even when you flip to a new page of instructions and forget what you read before, the notebook remembers everything.",
      realWorldAnalogy:
        "A hospital's electronic health record (EHR) system. Each patient visit, lab result, prescription, and diagnosis is a node. Relationships connect them: this lab result supports that diagnosis, this prescription treats that condition. Doctors (agents) consult the EHR each visit rather than relying on memory alone. The EHR persists across shifts, departments, and years — just like the context graph persists across agent sessions and context compactions.",
      whyWeUsedIt: `Agent memory cannot live only in the context window — it is finite (200K tokens for Claude), gets compacted during long sessions, and loses fidelity as information drifts to the middle of the window where attention is weakest. A persistent external graph gives agents durable, queryable state that survives any context management operation. In our mission control dashboard, we needed to track thousands of events across dozens of sessions, correlate tool usage patterns with cost data, and provide audit trails for every agent action. The context graph (implemented as SQLite with typed tables and JSONL backup) made all of this possible without requiring the model to hold everything in its limited attention span.`,
      howItWorksInProject: `The context graph is implemented as a SQLite database with 11 tables: events (timestamped agent actions), sessions (agent execution contexts), session_events (junction table linking events to sessions), snapshots (daily state compaction), alerts (fired notifications), alert_rules (condition definitions), projects (tracked repositories), cost_models (per-model token pricing), marketplace_items (extension catalog), onboarding (setup wizard state), and kv_store (flexible key-value pairs). A dual-write architecture ensures no data loss: every event is written to both SQLite (for structured queries) and JSONL files (as an append-only backup). Events are linked to sessions via session_id foreign keys, and sessions are linked to projects via project_dir. The graph supports temporal queries (events in a time range), aggregate queries (cost per session, tool usage frequency), and relationship traversal (all events for a session, all sessions for a project). A 500-event rolling buffer keeps the most recent data immediately accessible, while daily snapshots compact older data into summary nodes.`,
      featuresInProject: [
        {
          feature: "11-table relational schema",
          description:
            "Events, sessions, session_events, snapshots, alerts, alert_rules, projects, cost_models, marketplace_items, onboarding, and kv_store — each with typed columns, indexes, and foreign key relationships enforcing referential integrity.",
        },
        {
          feature: "Dual-write safety",
          description:
            "Every event is written to both SQLite and JSONL simultaneously. If SQLite fails, JSONL preserves the data for later recovery. If JSONL fails, SQLite still has the record. This triple-write (including SSE broadcast) ensures zero data loss under any single failure mode.",
        },
        {
          feature: "Temporal and aggregate queries",
          description:
            "The graph supports time-range queries (events between timestamps), aggregate computations (total cost per session, tool usage frequency, error rates), and relationship traversal (all events for a session, all sessions for a project).",
        },
        {
          feature: "500-event rolling buffer",
          description:
            "The most recent 500 events are kept in immediate access for real-time dashboard rendering. Older events are available via direct query but excluded from the default feed to prevent information overload.",
        },
        {
          feature: "Daily snapshot compaction",
          description:
            "Each day, the system generates a snapshot summarizing key metrics (event counts, costs, error rates, active sessions). This compaction reduces the volume of historical data while preserving the essential signal for trend analysis.",
        },
      ],
      coreConceptsMarkdown: `## Core Concepts

**Node Types**: Each table in the schema represents a node type in the graph. Events are the atomic units of agent activity. Sessions group related events into execution contexts. Projects group sessions by repository. Alerts represent system notifications. Snapshots represent compacted state.

**Edge Types / Relationships**: Foreign key relationships form the typed edges. \`session_events.session_id\` links events to sessions. \`session_events.event_id\` links to specific events. \`sessions.project_dir\` links sessions to projects. Alert rules reference metric names that map to computed aggregates from events.

**Durable State vs Ephemeral Context**: The context graph is durable — it survives context compaction, session restarts, and model changes. The token window is ephemeral — it exists only for the current turn and is rebuilt each time. The context compiler bridges these two: reading from durable state and assembling ephemeral context.

**Graph Traversal**: Querying the graph involves traversing relationships: "Show me all tool errors in the last hour" traverses events filtered by type and timestamp. "What was the cost of session X?" traverses session_events to find all events, then aggregates their cost fields.

**Append-Mostly Architecture**: Events are almost never modified after creation. New events are appended. This makes the graph naturally suited for audit trails, temporal queries, and conflict-free replication.`,
      prosAndCons: {
        pros: [
          "Queryable history — any question about past agent behavior can be answered with a SQL query against the graph, enabling debugging, auditing, and pattern analysis",
          "Survives context compaction — when the model's context window is compacted to free tokens, the graph retains full fidelity of all events and relationships",
          "Enables cross-session learning — patterns discovered in one session (frequent errors, costly operations) inform future sessions via aggregate queries",
          "Audit trail — every event is timestamped, typed, and linked to a session, creating a complete forensic record of agent behavior",
          "Shared state for multi-agent coordination — multiple agents can read from and write to the same graph, enabling typed handoffs and verification",
        ],
        cons: [
          "Storage overhead — persisting every event requires disk space that grows linearly with agent activity (mitigated by compaction and rolling buffers)",
          "Query latency vs in-context retrieval — reading from SQLite is slower than reading from the token window (mitigated by caching and bounded queries)",
          "Stale data risk — the graph may contain outdated information if events are not properly timestamped or if compaction is too aggressive",
          "Schema migration complexity — changing the graph schema requires migration scripts and backward compatibility handling",
        ],
      },
      alternatives: [
        {
          name: "Vector databases (Pinecone, Weaviate)",
          comparison:
            "Vector databases excel at semantic similarity search (finding conceptually related content) but lack typed relationships between entities. You can find similar events but cannot traverse structured connections like 'all events in session X that caused alert Y.' Context graphs provide both structure and queryability.",
        },
        {
          name: "Key-value stores (Redis)",
          comparison:
            "Redis provides extremely fast read/write access but no graph structure or relational queries. Good for caching hot data but insufficient for the relationship-rich state that agent systems need for coordination and audit.",
        },
        {
          name: "In-context memory (MEMORY.md)",
          comparison:
            "MEMORY.md files are simple, zero-infrastructure solutions that work for small-scale single-agent setups. But they are limited by the token window, cannot be queried programmatically, and do not support typed relationships or aggregate computations.",
        },
      ],
      keyAPIs: [
        "`getDb()` — Returns the singleton SQLite database connection. Uses dynamic require for Turbopack compatibility. Creates tables and indexes on first call. Returns null gracefully if SQLite is unavailable.",
        "`insertEvent(evt)` — Dual-writes an event to both SQLite (INSERT INTO events) and JSONL (append line to file). Also broadcasts via SSE for real-time dashboard updates. Returns the inserted event ID.",
        "`queryEvents(filter)` — Retrieves events matching a filter (time range, event type, session ID). Returns newest-first with configurable limit. Falls back to JSONL scan if SQLite is unavailable.",
        "`upsertSession(s)` — Inserts or updates a session record using ON CONFLICT(session_id) DO UPDATE. Tracks session start/end times, status, project directory, and computed cost.",
        "`getComputedStats()` — Returns aggregate metrics computed from the graph: total events, total cost, active sessions, error rate, tool usage distribution. Used by the dashboard and alert rules engine.",
        "`transaction(fn)` — Wraps a function in a SQLite transaction for atomic multi-statement operations. Uses better-sqlite3's synchronous transaction API for performance.",
      ],
      academicFoundations: `Graph theory originated with Euler's Seven Bridges of Konigsberg (1736), establishing the mathematical foundation for modeling connected entities. Property graphs (nodes with key-value properties, typed directed edges) became the dominant model for application-level graph databases, as formalized by Neo4j and the openCypher query language. The distinction between property graphs and RDF triples (subject-predicate-object, used in semantic web) matters for agent systems: property graphs are more natural for operational state, while RDF is better suited for ontological knowledge. The CAP theorem (Brewer, 2000) governs tradeoffs in distributed graph state — our single-node SQLite approach chooses consistency and partition tolerance (CP), accepting that availability is limited to a single process.`,
      furtherReading: [
        "Property Graph Model — neo4j.com/docs/getting-started/appendix/graphdb-concepts/",
        "Knowledge Graphs: A Survey — arxiv.org/abs/2003.02320",
        "CAP Theorem — Brewer, 2000 — brewer.cs.berkeley.edu/cs262b-2004/PODC-keynote.pdf",
      ],
    },
    {
      name: "Verification Loop",
      category: "ai-ml",
      icon: "VL",
      tagline: "No promotion without evidence — three-level verification for agent output quality",
      origin: {
        creator: "Formal verification + TDD (Kent Beck) + Consensus protocols (Lamport)",
        year: 1999,
        motivation:
          "Formal verification methods from the 1960s proved that software correctness requires mathematical proof. Kent Beck's test-driven development (1999) brought verification into everyday engineering practice. Lamport's consensus protocols (Paxos, 1998) showed how distributed systems can agree on truth. Context engineering combines all three: schema validation (formal), runtime checks (TDD), and semantic verification (consensus) to ensure agents do not over-claim completion.",
      },
      whatItIs: `A three-level verification system that prevents unverified claims from entering shared state. The fundamental principle is "no promotion without evidence" — an agent saying "done" is a claim, not a fact, until independently verified. Level 1: Schema validation (automatic) — does the output match the expected type and structure? Level 2: Runtime check (deterministic) — does the file exist? does the test pass? does the endpoint return 200? Level 3: Semantic verification (evaluative) — does the output actually satisfy the objective, with linked evidence supporting the claim? Each level catches a different category of failure: Level 1 catches malformed output, Level 2 catches false claims about the world, Level 3 catches technically correct but semantically wrong results. The verification loop is not optional — it is THE reliability mechanism that separates production agent systems from demo-quality prototypes.`,
      explainLikeImTen:
        "Imagine you ask three friends to each check your homework. The first friend checks if you wrote your name and the date (did you fill in the form correctly?). The second friend checks if your math answers are actually right by recalculating them (do the facts check out?). The third friend checks if you actually answered the questions that were asked, not different ones (did you do what was requested?). All three have to agree before your homework gets turned in.",
      realWorldAnalogy:
        "A pharmaceutical drug approval process. Level 1 (schema): the application paperwork is complete and properly formatted. Level 2 (runtime): the clinical trial data is reproducible — independent labs can verify the results. Level 3 (semantic): the drug actually treats the condition it claims to treat, with statistically significant evidence. No drug reaches patients without passing all three levels, just as no agent output should reach shared state without verification.",
      whyWeUsedIt: `Agents over-claim "done." This is not a theoretical concern — it is the most common failure mode in production agent systems. An agent will report a task as completed when the file was created but contains errors, when the test was written but does not pass, or when the code compiles but does not implement the specification. Without verification, one agent's false "done" claim poisons shared state for all other agents that depend on that work. In our mission control dashboard, we implemented an alert rules engine that evaluates conditions before promoting events to actionable status. Health checks verify service availability. The hook system provides pre/post-tool validation. Every claim must be explicitly acknowledged before it affects system behavior.`,
      howItWorksInProject: `The verification loop is implemented through several interconnected systems. The alert rules engine evaluates conditions against real-time metrics: daily_cost exceeding a threshold, error_spike detecting more than 5 errors in a 5-minute window, session_duration exceeding 1 hour (indicating a potentially stuck agent). When a condition fires, an alert is created with a severity level (info, warning, critical) and a cooldown period to prevent alert storms. Alerts must be explicitly acknowledged by a human or automated process — they do not auto-resolve. This acknowledgment gate is the promotion mechanism: an unacknowledged alert remains in pending state and continues to appear in the dashboard until addressed. Health checks run periodically to verify that dependent services (Ollama, Telegram bot, OpenClaw gateway) are available. The hook system wraps every tool call with pre-execution validation (are the inputs well-formed? is the tool allowed in this phase?) and post-execution verification (did the tool return a valid result? did it produce the expected side effects?). Pre-release validation runs 13 checks before any deployment.`,
      featuresInProject: [
        {
          feature: "Alert rules engine with cooldown",
          description:
            "Evaluates metric conditions (threshold, spike, duration) and fires alerts with severity levels. Cooldown periods prevent duplicate alerts for the same condition. Rules are configurable and can be added without code changes.",
        },
        {
          feature: "Explicit acknowledgment gates",
          description:
            "Alerts remain in pending state until explicitly acknowledged. This prevents silent failures — every anomaly must be addressed by a human or automated process before it is considered resolved.",
        },
        {
          feature: "Health check verification",
          description:
            "Periodic checks verify that dependent services are available and responding correctly. Failed health checks generate alerts and can trigger automated recovery actions.",
        },
        {
          feature: "Hook-based tool validation",
          description:
            "Pre-tool-use hooks validate inputs before execution. Post-tool-use hooks verify outputs after execution. Error hooks capture and record failures. This creates a verification boundary around every tool call.",
        },
        {
          feature: "13-check pre-release validation",
          description:
            "Before any npm publish, a validation script runs 13 checks: TypeScript compilation, lint, unit tests (317), build, native module patching, tarball contents, API endpoint smoke tests, browser view rendering, and dependency audit.",
        },
      ],
      coreConceptsMarkdown: `## Core Concepts

**Evidence-Gated Promotion**: The core principle. A claim (agent says "done") is not a fact until evidence supports it. Evidence can be a test result, a file hash, a screenshot, or a human acknowledgment. Only evidence-backed claims are promoted to shared state.

**Three Verification Levels**: Level 1 (Schema) — automatic structural validation. Level 2 (Runtime) — deterministic checks against the real world. Level 3 (Semantic) — evaluative assessment of whether the objective was actually met. Each level is progressively more expensive and catches different failure categories.

**Cooldown Periods**: After an alert fires, it enters cooldown for a configurable duration. During cooldown, the same condition will not fire again. This prevents alert storms during cascading failures while still ensuring each unique condition is surfaced.

**Acknowledgment Gates**: A synchronization primitive. Processing pauses at the gate until explicit acknowledgment is received. This is the mechanism that prevents unverified claims from contaminating shared state. In automated systems, acknowledgment can come from a verification agent; in supervised systems, from a human.

**Deterministic vs Semantic Verification**: Deterministic checks have binary outcomes (file exists or not, test passes or not). Semantic checks require judgment (does this implementation satisfy the specification?). Production systems should maximize deterministic checks and reserve semantic checks for genuinely ambiguous evaluations.`,
      prosAndCons: {
        pros: [
          "Prevents bad state propagation — one agent's false claim cannot poison shared state for other agents, because verification catches over-claiming before promotion",
          "Complete audit trail — every verification decision (pass, fail, pending) is recorded with timestamps and evidence references, enabling forensic analysis",
          "Enables trust in shared memory — agents can rely on data in the context graph because everything there has been verified, creating a foundation for multi-agent coordination",
          "Catches agent over-claiming — the most common failure mode in production agent systems is addressed directly by requiring evidence before promotion",
        ],
        cons: [
          "Adds latency to completion — each verification level adds processing time before work is considered done (mitigated by parallelizing independent checks)",
          "Requires defining evidence per task type — generic verification is insufficient; each task category needs specific criteria for what constitutes valid evidence",
          "Can bottleneck on verification capacity — if verification agents or health checks are slow, the entire pipeline backs up (mitigated by timeout and reassignment)",
        ],
      },
      alternatives: [
        {
          name: "Optimistic execution (no verification)",
          comparison:
            "Skip verification entirely and trust agent output. Fast, but unreliable in production. A single false claim can cascade through the system, causing compounding errors that are expensive to diagnose and fix.",
        },
        {
          name: "Human-in-the-loop",
          comparison:
            "Every agent output is manually reviewed by a human. Accurate, but does not scale — a human reviewer becomes the bottleneck in any system with more than a handful of agent actions per hour.",
        },
        {
          name: "Consensus voting (multi-agent verification)",
          comparison:
            "Multiple independent agents verify each output and vote on correctness. Thorough and robust against individual agent failures, but expensive (3x-5x the compute cost) and complex to implement correctly.",
        },
      ],
      keyAPIs: [
        "`insertAlert(a)` — Creates a new alert with type, severity (info/warning/critical), message, and metadata. Respects cooldown periods to prevent duplicate alerts for the same condition.",
        "`acknowledgeAlert(id)` — Marks an alert as acknowledged, recording the timestamp and acknowledger. This is the promotion gate — only acknowledged alerts are considered resolved.",
        "`getAlertRules()` — Retrieves all configured alert rule definitions, including condition type, threshold, window, and cooldown settings.",
        "`evaluateRules(metrics)` — Takes current system metrics and evaluates all active rules against them. Returns a list of rules that fired, each generating a new alert if not in cooldown.",
        "`getUnacknowledgedCount()` — Returns the count of pending (unacknowledged) alerts. Used by the dashboard badge and the health check system to surface unresolved issues.",
      ],
      academicFoundations: `Byzantine fault tolerance (Lamport, Shostak, Pease, 1982) established that distributed systems can reach consensus even when some participants are unreliable or malicious — directly applicable to multi-agent verification where individual agents may over-claim. The Paxos consensus protocol (Lamport, 1998) and its practical successor Raft (Ongaro & Ousterhout, 2014) formalize how distributed nodes agree on a single value — analogous to how verification agents agree on whether work is "done." Formal verification through model checking (Clarke, Emerson, Sifakis — Turing Award 2007) proves that systems satisfy specifications exhaustively — the gold standard that our three-level system approximates pragmatically. Design-by-contract (Meyer, 1986) introduced preconditions, postconditions, and invariants as first-class elements of software interfaces — directly inspiring the skill contracts in the skill graph.`,
      furtherReading: [
        "Anthropic — Effective harnesses for long-running agents — anthropic.com/engineering",
        "Byzantine Fault Tolerance — Lamport, Shostak, Pease, 1982",
        "Raft Consensus Algorithm — raft.github.io",
      ],
    },
    {
      name: "Skill Graph",
      category: "ai-ml",
      icon: "SG",
      tagline: "Controlled tool catalog with contracts, schemas, phase gating, and allowlisting",
      origin: {
        creator: "Capability-based security (Dennis & Van Horn) + OpenAPI + Least Privilege",
        year: 1966,
        motivation:
          "Capability-based security was introduced by Dennis and Van Horn in 1966, establishing that access should be granted through unforgeable tokens rather than ambient authority. The Swagger/OpenAPI specification (2011) brought schema validation to API contracts. The principle of least privilege (Saltzer and Schroeder, 1975) formalized that subjects should be granted only the minimum permissions needed. Context engineering synthesizes these into skill graphs: tools with contracts, phase gating, and allowlisting.",
      },
      whatItIs: `A controlled catalog of agent capabilities where each tool has a formal contract specifying input schemas, output schemas, preconditions, postconditions, phase restrictions, and allowlisted agents. This is not just a list of "tools" — it is a disciplined capability system where every tool invocation is validated against its contract before execution, restricted to authorized agents in authorized phases, and logged for audit. The skill graph draws a hard boundary between "what the model can reason about" and "what it can actually execute." A planner agent may know that a deployment tool exists (it appears in its tool descriptions) but cannot invoke it because its phase (PLAN) does not include execution capabilities. This separation prevents entire categories of coordination failures: planners accidentally executing, executors redefining objectives, and verifiers making changes instead of checking them.`,
      explainLikeImTen:
        "Think of a school where different students have different hall passes. The hall pass says exactly where you can go and when. A student with a library pass can go to the library during study hall, but not to the gym. A student with a gym pass can go to the gym during PE, but not to the library. The skill graph is like a system of hall passes for AI agents — each agent gets specific passes for specific tools at specific times.",
      realWorldAnalogy:
        "A hospital's credentialing system. A surgeon is credentialed to perform specific procedures (their skill catalog). They cannot prescribe medications outside their specialty (phase gating). A nurse practitioner has different credentials — they can administer medications but not perform surgery. The credentialing board (ontology) defines what procedures exist and who can perform them. Attempts to act outside credentials are blocked and logged.",
      whyWeUsedIt: `Unrestricted tool access causes three categories of failure: ambiguity (the model chooses the wrong tool because too many are available), errors (the model invokes a tool with invalid parameters because no schema validation occurs), and security risks (the model accesses resources it should not have access to). Phase gating adds temporal restrictions: planners should not execute code, executors should not redefine objectives, and verifiers should not modify artifacts. In our dashboard, the MCP server exposes exactly 6 typed tools, each with an inputSchema defining valid parameters. The hook system validates tool calls before execution. Agent definitions in the one-person-company setup specify which tools each role (architect, code-reviewer, debugger, etc.) can access.`,
      howItWorksInProject: `The skill graph is implemented across three layers. Layer 1: MCP Server — the mcp-server.js file exposes 6 tools (dashboard_stats, dashboard_events, dashboard_agents, dashboard_mcp, dashboard_tool_stats, dashboard_receipts) via the Model Context Protocol. Each tool has a name, description, and inputSchema (JSON Schema) that defines valid parameters. When Claude Code calls tools/list, it discovers exactly these 6 tools — no more, no less. When it calls tools/call, the server validates the input against the schema before proxying the request to the dashboard API. Layer 2: Hook System — 7 hook event types (session-start, session-end, pre-tool-use, post-tool-use, prompt-submit, tool-error, context-compact) wrap every tool call with pre/post processing. Pre-tool-use hooks can reject invalid calls. Post-tool-use hooks record results. Layer 3: Agent Role Definitions — 8 agent configurations (architect, code-reviewer, debugger, docs-writer, explorer, performance-analyzer, security-auditor, test-writer) each specify their model tier, allowed tools, and behavioral constraints. The architect (Opus) has broad read access; the code-reviewer (Haiku) has focused analysis tools; the debugger (Sonnet) has execution and logging tools.`,
      featuresInProject: [
        {
          feature: "6 typed MCP tools with JSON Schema validation",
          description:
            "Each tool has a formal inputSchema defining required and optional parameters, types, and constraints. Invalid inputs are rejected before execution, preventing malformed requests from reaching the API.",
        },
        {
          feature: "7-event hook system for tool execution boundary",
          description:
            "Every tool call passes through pre-execution validation and post-execution recording. The hook system creates an interception chain that logs, validates, and monitors every tool invocation.",
        },
        {
          feature: "8 role-scoped agent definitions",
          description:
            "Each agent role (architect, debugger, test-writer, etc.) has a specific model tier, behavioral instructions, and implicit tool access scope. This prevents capability ambiguity and ensures separation of concerns.",
        },
        {
          feature: "Tool discovery via MCP tools/list",
          description:
            "Agents discover available tools dynamically through the MCP protocol. The server responds with exactly the tools the agent is authorized to use, making the capability boundary explicit and discoverable.",
        },
      ],
      coreConceptsMarkdown: `## Core Concepts

**Tool Allowlisting**: Agents are given access to a specific set of tools, not all tools. This reduces ambiguity (fewer choices means fewer wrong choices) and enforces security boundaries (agents cannot access tools outside their allowlist).

**Phase Gating (PLAN/ACT/VERIFY)**: Tools are restricted by execution phase. During PLAN phase, only read-only and analysis tools are available. During ACT phase, execution tools become available. During VERIFY phase, only evidence-checking tools are available. Transitions between phases are explicit and logged.

**Input/Output Schema Validation**: Every tool has a JSON Schema contract defining valid inputs and expected outputs. Validation occurs before execution (preventing invalid calls) and after execution (verifying the tool returned expected data).

**Capability-Based Security**: Access is granted through specific capabilities (tool schemas) rather than ambient authority (unrestricted access). An agent possesses capabilities explicitly granted to it and cannot discover or invoke tools outside its capability set.

**Mask, Don't Remove**: When tools should be temporarily unavailable, their schema remains visible but invocation is gated by state (phase, role, cooldown). This is the Manus team's key insight — dynamically changing tool definitions mid-loop invalidates the KV-cache and confuses the model. Instead, gate selection via state, not schema changes.`,
      prosAndCons: {
        pros: [
          "Prevents tool ambiguity — with a curated set of tools per role, agents make better tool selection decisions because the option space is smaller and more relevant",
          "Enforces separation of concerns — planners cannot execute, executors cannot plan, verifiers cannot modify, preventing cross-role contamination",
          "Schema validation catches errors early — malformed tool calls are rejected before execution, preventing downstream failures and wasted compute",
          "Phase gating enforces workflow — the execution lifecycle is explicitly managed, ensuring tasks progress through planning, execution, and verification in order",
        ],
        cons: [
          "More configuration overhead — each agent role requires explicit tool definitions, schema specifications, and phase restrictions that must be maintained",
          "Can be too restrictive if poorly designed — overly narrow skill graphs prevent agents from being flexible when encountering unexpected situations",
          "Skill definitions must be maintained — as the system evolves, tool schemas, phase restrictions, and role allowlists must be updated to match new capabilities",
        ],
      },
      alternatives: [
        {
          name: "Unrestricted tool access",
          comparison:
            "Give every agent access to every tool. Simple to configure but dangerous in practice — models make worse tool selection decisions when presented with many options, and security boundaries are nonexistent.",
        },
        {
          name: "Dynamic tool registration",
          comparison:
            "Tools register themselves at runtime and agents discover them dynamically. Flexible, but hard to validate and audit. Tool availability can change unpredictably, making debugging difficult.",
        },
        {
          name: "Permission-based ACL",
          comparison:
            "Traditional access control lists (user X has permission Y on resource Z). Works for coarse-grained access but does not capture the phase-gating and contract-validation aspects of skill graphs.",
        },
      ],
      keyAPIs: [
        "`tools/list` — MCP protocol method that returns the complete catalog of available tools with their names, descriptions, and input schemas. This is the discovery mechanism that agents use to understand their capabilities.",
        "`tools/call` — MCP protocol method that executes a tool with validated arguments. The server validates input against the tool's JSON Schema before forwarding to the dashboard API.",
        "Skill YAML definitions — Agent configuration files that specify model tier, behavioral instructions, and tool access scope for each role in the one-person-company setup.",
        "Phase gating middleware — Intercepts tool calls and checks whether the current execution phase (PLAN/ACT/VERIFY) allows the requested tool. Rejected calls are logged with the reason for denial.",
      ],
      academicFoundations: `The principle of least privilege (Saltzer and Schroeder, 1975) established that every program and user should operate using the least set of privileges necessary — directly implemented by role-scoped tool allowlists. Capability-based addressing (Dennis and Van Horn, 1966) introduced the concept of unforgeable tokens that grant specific access rights — analogous to tool schemas that define exactly what an agent can do. Design-by-contract (Meyer, 1986) formalized the idea that software components interact through contracts with preconditions, postconditions, and invariants — the foundation for tool input/output schema validation. API-first design (Swagger/OpenAPI, 2011) brought formal schema definition to web services, establishing the pattern of discoverable, validated interfaces that MCP tools follow.`,
      furtherReading: [
        "OpenAI — Harness Engineering — openai.com/index/harness-engineering",
        "Principle of Least Privilege — Saltzer and Schroeder, 1975",
        "Model Context Protocol specification — modelcontextprotocol.io",
      ],
    },
    {
      name: "Context Compiler",
      category: "ai-ml",
      icon: "CC",
      tagline: "Multi-pass pipeline that selects, ranks, budgets, and compacts context for each turn",
      origin: {
        creator: "Compiler theory (Dragon Book) + Information retrieval (Robertson) + Attention mechanisms (Vaswani)",
        year: 1986,
        motivation:
          "Compiler theory (Aho, Sethi, Ullman — the Dragon Book, 1986) established multi-pass transformation pipelines as the standard for converting source representations into optimized targets. Information retrieval (Robertson's BM25, 1976) pioneered relevance ranking for document selection. Attention mechanisms (Vaswani et al., 2017) revealed that transformer models allocate attention unevenly across their input. Context engineering applies compiler architecture to context window management: the 'source' is messy runtime state, the 'target' is an optimally packed token window.",
      },
      whatItIs: `A multi-pass pipeline that transforms raw runtime state into an optimally curated context window for each agent turn. The pipeline has four passes: (1) Select — gather candidate context items from the context graph, recent events, system prompts, and active objectives. (2) Rank — score each candidate by type-priority (Objective: 100, Plan: 95, Receipt: 85, TestResult: 80, Error: 75, Event: 50, Log: 20). (3) Budget — allocate available tokens across ranked candidates, ensuring high-priority items always fit and lower-priority items fill remaining space. (4) Compact — for items that exceed their token budget, generate summaries that preserve essential signal in fewer tokens. The output is a context window where every token earns its place through relevance, recency, and priority — not random inclusion. This is the mechanism that fights "lost in the middle" attention degradation: by controlling what appears where in the context, the compiler steers model attention toward the most important information.`,
      explainLikeImTen:
        "Imagine you have a backpack that can only hold 20 pounds, but you have 100 pounds of stuff for a camping trip. The context compiler is like a smart packing system: first, it picks out everything you might need (Select). Then it ranks items by importance — water and first aid kit are more important than extra snacks (Rank). Then it figures out how much weight each item gets (Budget). Finally, for items that are too heavy, it finds lighter versions — a travel toothbrush instead of a full-size one (Compact). The result is a perfectly packed backpack with the most important stuff.",
      realWorldAnalogy:
        "A newspaper editor assembling the front page. They have hundreds of stories (candidate context) but only one page of space (token budget). They select the most newsworthy stories (Select), rank them by importance and relevance (Rank), allocate column inches proportional to significance (Budget), and edit verbose stories down to fit their allocated space (Compact). The headline story gets the most space, supporting stories get less, and minor stories get one-paragraph summaries.",
      whyWeUsedIt: `Context windows are finite — even Claude's 200K tokens run out when tracking dozens of sessions, thousands of events, and complex multi-step objectives. Worse, the "lost in the middle" effect (Liu et al., 2023) means that information placed in the middle of long contexts receives less attention than information at the beginning or end. Stuffing everything into context is actively counterproductive — it degrades quality as noise increases. The context compiler ensures that the most relevant, high-signal tokens occupy the limited window space, with objectives and plans placed where they receive maximum attention. In our dashboard, the SSE hub broadcasts real-time events with priority-based ordering. The session timeline tracks context usage percentage. The event store maintains a bounded rolling buffer. Cost models enable token-aware budgeting.`,
      howItWorksInProject: `The compiler operates through four interconnected subsystems. (1) Candidate Generation: The event store provides a 500-event rolling buffer with newest-first ordering. The session store provides active session state. The project store provides repository context. Alert rules provide current system health. These sources generate the candidate pool. (2) Priority Ranking: Events are implicitly ranked by type — session events (high priority) above routine tool calls (medium) above verbose logs (low). The SSE hub broadcasts events with this priority ordering, ensuring the live dashboard shows the most important information first. (3) Token Budgeting: The cost model system (one entry per LLM model) tracks input/output token costs. Session tracking includes ctx_pct (context usage percentage) as a first-class metric, making token budget consumption visible in real time. When context usage exceeds thresholds, compaction triggers. (4) Compaction: Daily snapshots compress detailed event streams into summary metrics (event counts, costs, error rates, tool distributions). Old JSONL files are retained for forensic queries but excluded from active context assembly. The rolling buffer automatically drops oldest events when the limit is reached.`,
      featuresInProject: [
        {
          feature: "500-event rolling buffer with newest-first ordering",
          description:
            "Bounded candidate generation ensures the compiler always works with a manageable set. Newest events appear first, biasing toward recency. Oldest events are dropped automatically, implementing implicit garbage collection.",
        },
        {
          feature: "SSE priority-based broadcast",
          description:
            "Real-time events are broadcast to browser clients with implicit priority ordering. High-severity alerts appear immediately. Routine events stream continuously. The browser renders a priority-ordered live feed.",
        },
        {
          feature: "Context usage percentage tracking (ctx_pct)",
          description:
            "Each session tracks how much of its context window is consumed as a first-class metric. This makes token budget consumption visible, enabling proactive compaction before the window fills up.",
        },
        {
          feature: "Daily snapshot compaction",
          description:
            "Each day, detailed event streams are compressed into summary snapshots containing aggregate metrics. This reduces the volume of historical context while preserving the signal needed for trend analysis and decision-making.",
        },
        {
          feature: "Cost model for token-aware budgeting",
          description:
            "Per-model cost entries (input price, output price per million tokens) enable dollar-cost-aware token budgeting. The compiler can factor in not just token count but actual cost when deciding what to include.",
        },
      ],
      coreConceptsMarkdown: `## Core Concepts

**Token Budgets**: The context window is treated as a finite budget measured in tokens. Each context item has a token cost. The compiler allocates budget proportional to priority, ensuring high-value items always fit and low-value items fill remaining space.

**Type-Priority Ranking**: Different context types have different inherent value. A ranking scale assigns scores: Objective (100), Plan (95), ActiveTask (90), Receipt (85), TestResult (80), Error (75), ToolCall (60), Event (50), Log (20). The compiler selects top-ranked items first.

**Compaction**: When detailed data exceeds its budget, it is compressed into a summary that preserves essential signal in fewer tokens. Daily snapshots are the primary compaction mechanism — thousands of events become a single summary record with aggregate metrics.

**Recitation**: The Manus team's technique for fighting "lost in the middle" attention drift. The current objective and plan are explicitly repeated near the END of the context window, where the model pays most attention. This keeps the agent focused on its actual goal even in long-running sessions.

**Store Broadly, Compile Narrowly**: Persist everything to the context graph (broad storage), but carefully curate the tiny subset that enters the token window each turn (narrow compilation). The graph is cheap; attention is expensive.`,
      prosAndCons: {
        pros: [
          "Maximizes signal-to-noise ratio in context — every token in the window earns its place through relevance and priority, not random inclusion",
          "Prevents attention degradation — by controlling placement and priority, the compiler fights the 'lost in the middle' effect that degrades model performance on long contexts",
          "Enables long-running sessions — compaction and rolling buffers allow agents to operate for hours without context window exhaustion",
          "Systematic and repeatable — the same compiler pipeline produces consistent context assembly, making agent behavior more predictable and debuggable",
        ],
        cons: [
          "Ranking heuristics need tuning per domain — the priority scores that work for a dashboard may not be optimal for a coding agent or a research agent",
          "Compaction loses granularity — summarizing detailed events into aggregates sacrifices fine-grained information that may be needed for edge-case debugging",
          "Adds processing overhead per turn — the select-rank-budget-compact pipeline runs before every agent turn, adding latency to each interaction",
        ],
      },
      alternatives: [
        {
          name: "Brute-force (stuff everything)",
          comparison:
            "Include all available context without selection or ranking. Simple to implement but actively degrades model performance as context grows — the 'lost in the middle' effect means the model ignores information in the middle of long contexts.",
        },
        {
          name: "RAG (Retrieval-Augmented Generation)",
          comparison:
            "Retrieve context per query using vector similarity search. Excellent for static knowledge bases but poorly suited for dynamic runtime state where relevance depends on task phase, not semantic similarity.",
        },
        {
          name: "Manual curation (MEMORY.md)",
          comparison:
            "Manually maintain a markdown file with important context. Works for small-scale single-agent setups but does not scale to thousands of events, multiple sessions, or automated context assembly.",
        },
      ],
      keyAPIs: [
        "`getEvents(limit)` — Bounded retrieval from the event store. The limit parameter enforces the rolling buffer, returning only the N most recent events. This is the primary candidate generation API.",
        "`sseHub.broadcast(msg)` — Pushes an event to all connected browser clients with implicit priority ordering. High-severity events (alerts, errors) are rendered prominently; routine events stream in the background.",
        "`upsertSnapshot(s)` — Creates or updates a daily compaction snapshot. Snapshots contain aggregate metrics (event counts, costs, error rates) that replace detailed event streams for historical periods.",
        "`getComputedStats()` — Returns aggregate metrics computed from current events: total cost, event distribution, active sessions, error rate. Used by the dashboard and the budget allocation algorithm.",
        "Context compiler pipeline — The conceptual pipeline: candidate generation (getEvents + getSession + getProject) -> priority ranking (type-based scores) -> budget allocation (token-aware) -> compaction (snapshot if over budget).",
      ],
      academicFoundations: `Information theory (Shannon, 1948) established that communication channels have finite capacity and that optimal encoding maximizes information transfer within bandwidth constraints — directly analogous to maximizing signal within a token budget. TF-IDF (Salton, 1975) and BM25 (Robertson, 1994) pioneered relevance scoring for document retrieval, inspiring the type-priority ranking used in context compilation. The attention mechanism (Vaswani et al., "Attention Is All You Need", 2017) revealed that transformers allocate attention unevenly across input tokens — the theoretical basis for why context placement matters. The "lost in the middle" effect (Liu et al., 2023) empirically demonstrated that language models struggle to use information placed in the middle of long contexts, directly motivating the recitation pattern and priority-based placement.`,
      furtherReading: [
        "Manus blog — Context Engineering for AI Agents — manus.im/blog/context-engineering-for-ai-agents",
        "Lost in the Middle — Liu et al., 2023 — arxiv.org/abs/2307.03172",
        "Attention Is All You Need — Vaswani et al., 2017 — arxiv.org/abs/1706.03762",
      ],
    },
    {
      name: "Ontology",
      category: "ai-ml",
      icon: "ON",
      tagline: "Shared schema defining what exists and how things relate in the agent ecosystem",
      origin: {
        creator: "Philosophical ontology (Aristotle) + Knowledge representation (Gruber) + Palantir Ontology SDK",
        year: 1993,
        motivation:
          "Ontology as a branch of philosophy (Aristotle, 350 BC) studies the fundamental categories of existence and their relationships. Tom Gruber (1993) formalized ontology for computer science as 'an explicit specification of a conceptualization' — a shared vocabulary for a domain. Palantir's Ontology SDK (2020) brought this to enterprise software with object types, link types, and action types as first-class primitives. Context engineering adapts ontology as the shared vocabulary that agents and humans use for coordination.",
      },
      whatItIs: `A formal schema defining "what exists" and "how things relate" in the agent ecosystem. The ontology specifies typed node definitions (what kinds of entities exist), valid edge types (how entities can be connected), and structural constraints (what relationships are required, optional, or forbidden). It is the vocabulary that agents, tools, dashboards, and humans share for coordination. Without a shared ontology, agents talk past each other — one agent's "task" is another's "goal," one's "done" means "code written" while another's means "tests passing." The ontology eliminates this ambiguity by defining, formally and unambiguously, the types, relationships, and constraints of the domain. In the context-engineering-workshop reference, the ontology defines 18 node types (Task, Claim, Receipt, Artifact, TestResult, Session, Agent, Role, etc.) and 20+ edge types (RUN_HAS_STEP, STEP_EMITS_RECEIPT, CLAIM_SUPPORTED_BY, TASK_EVIDENCED_BY, etc.).`,
      explainLikeImTen:
        "Imagine everyone in your class is building a city out of blocks, but nobody agreed on what the blocks mean. One kid says 'house' but means a tall building. Another says 'house' and means a small cottage. The ontology is like a picture dictionary that everyone agrees on before building starts — it shows exactly what a 'house' looks like, what a 'road' looks like, and how they connect to each other. Now everyone builds the same kind of city.",
      realWorldAnalogy:
        "A legal system's definitions section. Before any law can be applied, the 'Definitions' section specifies exactly what each term means in the context of that legislation: 'employee' means X, 'workplace' means Y, 'injury' means Z. Without these definitions, the same law would be interpreted differently by every judge. The ontology serves the same purpose for agent systems — it ensures every participant interprets the same terms the same way.",
      whyWeUsedIt: `Without shared vocabulary, multi-agent coordination degenerates into ambiguity. Agent A creates a "task" and Agent B claims it, but they disagree on what "done" means because there is no shared definition of task completion criteria. Agent C writes a "receipt" but Agent D cannot find it because they are looking for "evidence" — same concept, different name. The ontology resolves this by defining every type, relationship, and constraint formally. In our dashboard, the SQLite schema IS the ontology — 11 entity types with typed columns, foreign key relationships enforcing valid connections, standardized event types (session_start, session_end, tool_use, tool_complete, tool_error, prompt_submit, context_compact), and an agent registry that enforces name/model/category structure.`,
      howItWorksInProject: `The ontology is implemented as a SQLite schema with 11 tables, each defining an entity type with typed columns and structural constraints. The events table defines the atomic unit of agent activity: id (TEXT PRIMARY KEY), timestamp (TEXT), type (TEXT — one of the standardized event types), session_id (TEXT — foreign key to sessions), data (TEXT — JSON payload), cost (REAL), duration (INTEGER), tool_name (TEXT), model (TEXT). The sessions table defines execution contexts: session_id, start_time, end_time, status, project_dir, total_cost, model, cwd. Foreign key relationships enforce valid connections: session_events links events to sessions (many-to-many), alerts reference metric names that map to computed aggregates from events. Indexes on timestamp, session_id, and type enable efficient queries. The schema_version table tracks migrations, allowing the ontology to evolve over time. PRAGMA settings (WAL mode, foreign keys enabled, busy timeout) are part of the ontology — they define the operational constraints of the data layer. Event types are standardized strings that form a controlled vocabulary: every tool call is "tool_use," every completion is "tool_complete," every failure is "tool_error." This vocabulary is shared between Claude Code hooks (which produce events), the dashboard API (which stores and queries events), and the browser UI (which renders events).`,
      featuresInProject: [
        {
          feature: "11 typed entity tables",
          description:
            "Events, sessions, session_events, snapshots, alerts, alert_rules, projects, cost_models, marketplace_items, onboarding, and kv_store. Each table defines an entity type with typed columns, constraints, and indexes.",
        },
        {
          feature: "Standardized event type vocabulary",
          description:
            "Seven event types (session_start, session_end, tool_use, tool_complete, tool_error, prompt_submit, context_compact) form the controlled vocabulary shared between event producers and consumers.",
        },
        {
          feature: "Foreign key relationship enforcement",
          description:
            "SQLite foreign keys ensure that relationships between entities are structurally valid. A session_event cannot reference a nonexistent session or event. This enforces referential integrity at the schema level.",
        },
        {
          feature: "Schema versioning and migration",
          description:
            "The schema_version table tracks the current schema version, enabling safe migrations as the ontology evolves. New entity types and relationships can be added without breaking existing data.",
        },
        {
          feature: "PRAGMA-level operational constraints",
          description:
            "WAL mode (concurrent reads), foreign key enforcement, and busy timeout are defined as part of the ontology — they constrain how the data layer behaves, not just what data exists.",
        },
      ],
      coreConceptsMarkdown: `## Core Concepts

**Node Types**: The fundamental entity categories in the system. In the reference implementation: Task, Claim, Receipt, Artifact, TestResult, Session, Agent, Role, Plan, Objective, Error, Log, Snapshot, Alert, Project, CostModel, KVEntry. Each has a typed schema defining its properties and constraints.

**Edge Types**: The valid relationships between nodes. RUN_HAS_STEP (a run contains steps), STEP_EMITS_RECEIPT (a step produces a receipt), CLAIM_SUPPORTED_BY (a claim is backed by evidence), TASK_EVIDENCED_BY (a task's completion is evidenced by a receipt), SESSION_CONTAINS_EVENT (a session groups events). Each edge type has directionality and cardinality constraints.

**Structural Constraints**: Rules about what relationships are required, optional, or forbidden. A Task MUST have an owner. A Receipt MUST reference a Task. A Claim CANNOT be promoted without Evidence. These constraints are enforced by the schema (foreign keys, NOT NULL) and by application logic (verification loop).

**Governance Actions (Kinetics)**: Palantir's concept of governed operations — actions with validation and side effects that are defined as part of the ontology rather than ad hoc code. Creating an alert, acknowledging an alert, and resolving an alert are kinetics with specific preconditions and effects.

**Ontology Evolution**: Schemas must change as systems evolve. The schema_version table enables safe migration: check current version, apply migrations in order, update version. Backward compatibility is maintained by making new columns nullable and new tables optional.`,
      prosAndCons: {
        pros: [
          "Shared vocabulary eliminates ambiguity — every participant (agent, tool, human, dashboard) uses the same definitions for the same concepts",
          "Type safety enables tooling — typed schemas allow code generation, validation, autocompletion, and static analysis of agent data flows",
          "Graph queries become possible — with typed nodes and edges, complex questions like 'which claims lack evidence' become simple queries",
          "Self-documenting schema — the ontology IS the documentation of what exists and how things relate, always in sync with the actual system",
        ],
        cons: [
          "Rigidity — schema changes require migration scripts and backward compatibility handling, slowing iteration on the data model",
          "Upfront design effort — defining the ontology requires understanding the full domain before building, which can delay initial development",
          "Can over-constrain — an ontology that is too strict prevents agents from representing unexpected situations that were not anticipated in the schema",
        ],
      },
      alternatives: [
        {
          name: "Schema-less (MongoDB/JSON)",
          comparison:
            "Store arbitrary JSON documents without a predefined schema. Maximum flexibility for rapid iteration, but no integrity guarantees — invalid data can enter the system silently, and queries become fragile because field existence is not guaranteed.",
        },
        {
          name: "Convention-based (CLAUDE.md rules)",
          comparison:
            "Define the vocabulary in a markdown file that agents read as part of their context. Lightweight and easy to update, but not enforced — agents can ignore conventions, and there is no validation that data conforms to the defined types.",
        },
        {
          name: "RDF/OWL (Semantic Web standards)",
          comparison:
            "Formal ontology languages from the Semantic Web with rich expressivity (class hierarchies, property restrictions, inference rules). Powerful but verbose, complex, and poorly supported by mainstream developer tooling.",
        },
      ],
      keyAPIs: [
        "`SCHEMA` — The CREATE TABLE IF NOT EXISTS definitions that specify all entity types, their properties, types, constraints, and indexes. This is the machine-readable ontology.",
        "`PRAGMAS` — WAL mode, foreign key enforcement, and busy timeout settings that define operational constraints on the data layer beyond just structure.",
        "`SEED_COST_MODELS` — INSERT OR IGNORE statements that seed the cost_models table with per-model token pricing. Seeding is part of the ontology — it defines the initial state of reference data.",
        "Event type enum — The standardized vocabulary of event types (session_start, session_end, tool_use, tool_complete, tool_error, prompt_submit, context_compact) used across all system components.",
        "`schema_version` table — Tracks the current schema version and enables safe migrations as the ontology evolves. Migrations are applied in sequence, ensuring backward compatibility.",
      ],
      academicFoundations: `Description logics (Baader et al., 2003) provide the formal foundation for ontology languages, defining how concepts, roles, and individuals relate in a knowledge base. OWL (Web Ontology Language, W3C, 2004) standardized ontology definition for the Semantic Web, with three expressivity levels (Lite, DL, Full). Palantir's ontology model (2020) simplified academic ontology concepts into three pragmatic primitives: object types (nodes), link types (edges), and action types (governed operations) — directly influencing the context engineering approach. Entity-relationship modeling (Chen, 1976) established the visual and conceptual framework for database schema design that underlies our SQLite schema. The frame problem (McCarthy and Hayes, 1969) highlights the challenge of specifying what does NOT change when an action occurs — relevant to ontology design because constraints must capture both required relationships and forbidden states.`,
      furtherReading: [
        "Palantir Ontology documentation — palantir.com/docs/foundry/ontology/overview",
        "Gruber — A Translation Approach to Portable Ontology Specifications (1993)",
        "Entity-Relationship Model — Chen, 1976 — dl.acm.org/doi/10.1145/320434.320440",
      ],
    },
    {
      name: "Harness Engineering",
      category: "framework",
      icon: "HE",
      tagline: "The execution environment that turns a stateless model into a stateful agent",
      origin: {
        creator: "OpenAI (Harness Engineering blog) + Anthropic (agent loop) + OS runtime systems",
        year: 2026,
        motivation:
          "OpenAI published 'Harness Engineering' in February 2026, articulating what practitioners had been discovering independently: most agent failures are not model failures — they are context failures. The harness (tool execution, memory management, context assembly, verification, stop conditions) IS the agent. The model is just the reasoning component. Anthropic's agent loop pattern and operating system concepts (process scheduling, IPC, resource management) provide the foundational systems thinking.",
      },
      whatItIs: `The execution environment that turns a stateless reasoning model into a stateful, reliable agent. The harness controls the entire agent lifecycle: what context the model sees (context compiler), what tools it can call (skill graph), how results are verified (verification loop), where state is persisted (context graph), and when to stop (termination conditions). The key insight is that "the agent IS the harness, not the model." A great model with a bad harness is unreliable. A mediocre model with a great harness is productive. This reframes the entire approach to building agent systems — instead of improving prompts (which has diminishing returns), improve the harness (which has compounding returns). The harness mediates ALL interaction between the model and the world: nothing enters the context window without passing through the compiler, nothing exits as "done" without passing through verification, and nothing is executed without passing through the skill graph's validation.`,
      explainLikeImTen:
        "Think of a race car. The engine (the AI model) is powerful, but it cannot race by itself. It needs a chassis, wheels, steering, brakes, a fuel system, and a driver's seat (the harness). The harness turns raw engine power into controlled, reliable racing. A great engine in a bad chassis crashes. A decent engine in a great chassis wins races. Building agents is about building the chassis, not just upgrading the engine.",
      realWorldAnalogy:
        "An aircraft's avionics system. The pilot (model) makes decisions, but the avionics (harness) control what instruments they see, which controls they can manipulate, when warnings fire, and what automatic systems engage. Fly-by-wire means the pilot's inputs go through the harness before reaching the control surfaces — the harness can prevent dangerous commands (like exceeding structural limits). The avionics turn a human into a safe pilot, just as the harness turns a model into a reliable agent.",
      whyWeUsedIt: `"Most agent failures are not model failures. They are context failures." This quote from the OpenAI harness engineering blog captures why we built a comprehensive harness. Without it, the model sees wrong context, calls wrong tools, and reports false completion. Our mission control dashboard IS a harness — it wraps Claude Code sessions with context assembly (event store, SSE hub), tool execution boundary (hook system, MCP server), verification (alert rules, health checks), and observability (real-time dashboard, receipt generation). The CLI serves as the outer harness that spawns the dashboard server, manages ports, handles errors, and provides diagnostic commands. Every component exists to make the model's decisions more reliable.`,
      howItWorksInProject: `The harness is implemented across four layers. (1) Outer Harness (CLI): bin/cli.js handles process management — it finds an available port, spawns the Next.js server, handles SIGINT/SIGTERM gracefully, provides the "doctor" diagnostic command, and manages the server lifecycle. It is the entry point that creates the conditions for everything else. (2) Hook System: 7 event types (session-start, session-end, pre-tool-use, post-tool-use, prompt-submit, tool-error, context-compact) create an interception chain around every Claude Code action. Pre-tool-use hooks validate inputs before execution. Post-tool-use hooks record results and trigger alerts. Error hooks capture failures with full context for debugging. This is the execution boundary. (3) Event Store: The triple-write system (JSONL + SQLite + SSE) ensures every action is recorded, queryable, and observable in real time. This is the memory management layer. (4) Observation Loop: The SSE hub broadcasts events to the browser dashboard, providing real-time visibility into agent behavior. The dashboard renders session timelines, cost breakdowns, tool usage distributions, and alert feeds. The "doctor" command diagnoses harness health by checking database connectivity, SSE hub state, and event store integrity.`,
      featuresInProject: [
        {
          feature: "CLI-based outer harness with process management",
          description:
            "The CLI (bin/cli.js) manages the full server lifecycle: port discovery, process spawning, signal handling (SIGINT/SIGTERM), error recovery, and diagnostic commands. It is the first layer of reliability.",
        },
        {
          feature: "7-event hook system as execution boundary",
          description:
            "Every Claude Code action passes through hooks that validate, record, and monitor. Pre-tool-use validates inputs. Post-tool-use records results. Error hooks capture failures. This creates a complete execution boundary.",
        },
        {
          feature: "Triple-write event store for memory management",
          description:
            "Events are simultaneously written to JSONL (backup), SQLite (query), and SSE (real-time). This ensures no action is lost and every action is immediately observable.",
        },
        {
          feature: "Real-time observation via SSE dashboard",
          description:
            "The browser dashboard provides live visibility into agent behavior: session timelines, cost breakdowns, tool distributions, error feeds, and alert status. This is the human observation loop.",
        },
        {
          feature: "Doctor command for harness diagnostics",
          description:
            "The 'claude-pilot doctor' command checks database connectivity, SSE hub state, event store integrity, and service health — diagnosing harness issues independently of model behavior.",
        },
      ],
      coreConceptsMarkdown: `## Core Concepts

**Agent Loop**: The fundamental execution pattern: gather context -> decide action -> execute tool -> observe result -> verify -> repeat or stop. Every agent system implements this loop. The harness controls every stage of it.

**Tool Execution Boundary**: The line between "the model decided to use a tool" and "the tool actually executes." The harness sits on this boundary, validating inputs, recording outputs, handling errors, and enforcing permissions. This is where reliability is injected.

**Observation Hooks**: Points in the agent loop where the harness can observe, record, and react to agent behavior. Pre-execution hooks validate. Post-execution hooks record. Error hooks recover. Compaction hooks manage context.

**Garbage Collection**: Agents replicate bad patterns. Drift compounds faster with parallelism. The harness must actively clean stale context, outdated facts, and accumulated AI slop from working state. OpenAI calls this "more important than brilliance."

**Stop Conditions**: The harness must know when to stop the agent loop. Completion (objective met), failure (unrecoverable error), timeout (exceeded time budget), and budget exhaustion (exceeded token/cost budget) are the four stop conditions.

**Harness vs Model**: The harness is the agent. The model is just the reasoning component. A bad harness makes a great model unreliable. A great harness makes a mediocre model productive. Investment in harness engineering has compounding returns; investment in prompt engineering has diminishing returns.`,
      prosAndCons: {
        pros: [
          "Separates reliability concerns from reasoning — harness bugs and model limitations are diagnosed and fixed independently, with different tools and techniques",
          "Testable and debuggable independently — the harness can be tested with mock model responses, and model behavior can be tested with a mock harness",
          "Model-swappable — the same harness works with different models (Opus, Sonnet, Haiku), allowing model selection based on cost/performance tradeoffs without changing infrastructure",
          "Enables systematic improvement — harness improvements (better context assembly, stricter verification) compound over time and benefit every model that runs within it",
        ],
        cons: [
          "Engineering complexity — building a production-grade harness requires systems engineering skills beyond typical ML/AI expertise",
          "Harness bugs can be harder to diagnose — when the harness itself is buggy, failures can look like model failures, leading to misdiagnosis and wasted debugging effort",
          "Over-engineering risk — it is possible to build a harness so complex that it introduces more failure modes than it prevents, especially in early-stage projects",
        ],
      },
      alternatives: [
        {
          name: "Direct API calls (no harness)",
          comparison:
            "Call the model API directly with manually constructed prompts. Simplest possible approach, but no reliability — no memory, no verification, no tool validation, no observability. Only suitable for one-shot tasks.",
        },
        {
          name: "Framework-based (LangChain/CrewAI)",
          comparison:
            "Pre-built agent frameworks with batteries included. Fast to start, but opinionated about architecture and often over-abstracted. Debugging framework internals is harder than debugging custom harness code.",
        },
        {
          name: "Custom runtime (maximum control)",
          comparison:
            "Build every harness component from scratch. Maximum control and customization, but maximum engineering effort. Our approach: custom harness with minimal dependencies, trading development speed for operational understanding.",
        },
      ],
      keyAPIs: [
        "`spawn(nextBin, [mode, '-p', port])` — Process management in the CLI. Spawns the Next.js server with appropriate arguments, inherits stdio for real-time output, and returns a child process handle for lifecycle management.",
        "Hook system (7 event types) — session-start, session-end, pre-tool-use, post-tool-use, prompt-submit, tool-error, context-compact. Each hook fires at a specific point in the agent loop, enabling interception and recording.",
        "`claude-pilot doctor` — Diagnostic command that checks database connectivity, SSE hub state, event store integrity, port availability, and service health. Reports issues with suggested fixes.",
        "SSE broadcast — Real-time observation loop. Every event ingested by the event store is broadcast to all connected browser clients, providing instant visibility into agent behavior.",
      ],
      academicFoundations: `Operating system process scheduling (Dijkstra, 1965) established the principles of managing concurrent processes with resource constraints — directly applicable to managing concurrent agent sessions. Inter-process communication (pipes, signals, shared memory) provides the patterns for agent-to-agent and agent-to-harness communication. Control theory (feedback loops, PID controllers) informs the verification loop: observe the output, compare to the desired state, adjust the input. Systems engineering (requirements, architecture, integration, verification) provides the discipline for building complex harnesses that must be reliable under diverse conditions. The concept of a "runtime system" in programming languages (garbage collection, memory management, type checking) is the closest analogy to what the harness does for agents.`,
      furtherReading: [
        "OpenAI — Harness Engineering — openai.com/index/harness-engineering",
        "Anthropic — Building effective agents — anthropic.com/research/building-effective-agents",
        "Operating Systems: Three Easy Pieces — ostep.org",
      ],
    },
    {
      name: "Server-Sent Events / Real-Time Push",
      category: "protocol",
      icon: "SE",
      tagline: "Unidirectional server-to-client streaming over HTTP with auto-reconnection",
      origin: {
        creator: "W3C (HTML5 EventSource specification)",
        year: 2009,
        motivation:
          "The HTML5 EventSource specification (W3C, 2009) was designed to provide a simple, standardized way for servers to push events to browsers over HTTP. Unlike WebSockets (which provide bidirectional communication), SSE is intentionally unidirectional — the server sends, the browser receives. This simplicity makes it ideal for dashboards, live feeds, and monitoring systems where the client only needs to observe, not interact. The auto-reconnection behavior (built into the EventSource API) makes it inherently resilient to network interruptions.",
      },
      whatItIs: `A unidirectional server-to-client streaming protocol over HTTP. The server pushes events to the browser as they happen — no polling delays, no WebSocket handshake overhead, no bidirectional channel management. The protocol uses a simple text-based format: each event is a block of "data:" lines terminated by a blank line, transmitted over a long-lived HTTP connection with Content-Type "text/event-stream." The browser's EventSource API handles connection management, auto-reconnection on disconnect, and event parsing natively. SSE supports named event types (allowing clients to filter), event IDs (enabling resumption from the last received event), and retry intervals (controlling reconnection timing). For agent systems, SSE provides the real-time observation channel that makes agent behavior visible to humans: every tool call, every error, every session state change appears in the dashboard instantly, without the latency of polling or the complexity of WebSocket management.`,
      explainLikeImTen:
        "Imagine you have a walkie-talkie that only works one way — your friend can talk to you, but you cannot talk back. Your friend describes everything happening at a baseball game as it happens: 'Batter hit the ball! Running to first base! The crowd is cheering!' You hear everything live without asking. If the walkie-talkie cuts out, it automatically reconnects and your friend keeps talking. That is SSE — the server is your friend at the game, and your browser is the walkie-talkie.",
      realWorldAnalogy:
        "A stock market ticker tape. The exchange (server) continuously pushes price updates to all connected terminals (browsers). Terminals display prices as they arrive — no need to ask 'what is the current price?' every second. If a terminal disconnects and reconnects, it resumes receiving updates from where it left off. The ticker is unidirectional (exchange to terminal), exactly like SSE.",
      whyWeUsedIt: `Agent systems need instant feedback. When a tool call fails, when costs spike, when a session enters an error state — the human operator needs to know immediately, not on the next poll cycle. Polling creates latency gaps (the time between polls is invisible), wastes bandwidth (most polls return "no new data"), and scales poorly (N clients polling every T seconds means N/T requests per second). WebSockets are bidirectional — overkill for a dashboard that only needs server-to-client push. SSE is simple (one HTTP connection), auto-reconnecting (built into the browser API), proxy-friendly (works through HTTP proxies that block WebSocket upgrades), and natively supported in all modern browsers. For our dashboard, SSE provides the live feed that makes agent behavior observable in real time.`,
      howItWorksInProject: `The SSE hub is implemented as a singleton module (src/lib/sse-hub.ts) that manages browser client connections. When the dashboard loads, the browser opens an EventSource connection to /api/sse. The server registers this connection in the hub's client map. When an event is ingested by the event store (via POST /api/events), the triple-write system broadcasts it through the SSE hub to all connected clients. Each broadcast message is formatted as a Server-Sent Event: "data:" prefix, JSON-serialized event payload, and double newline terminator. The hub maintains a heartbeat (30-second interval) that sends a comment line (":heartbeat") to keep connections alive through proxies and load balancers that might close idle connections. Auto-cleanup removes dead connections when write attempts fail (detecting that the client has disconnected). The browser's EventSource API handles auto-reconnection: if the connection drops, the browser automatically reopens it after a configurable retry interval, receiving any events that accumulated during the disconnection.`,
      featuresInProject: [
        {
          feature: "Instant event delivery with zero polling latency",
          description:
            "Events are pushed to the browser the moment they are ingested by the event store. There is no polling interval — delivery latency is effectively zero (limited only by network transmission time).",
        },
        {
          feature: "Auto-reconnection on disconnect",
          description:
            "The browser's native EventSource API automatically reconnects when the connection drops. This provides resilience against network interruptions, server restarts, and proxy timeouts without any custom reconnection logic.",
        },
        {
          feature: "30-second heartbeat for proxy keep-alive",
          description:
            "A comment line (':heartbeat') is sent every 30 seconds to prevent proxies and load balancers from closing idle connections. This keeps the SSE channel alive during quiet periods with minimal bandwidth overhead.",
        },
        {
          feature: "Client connection lifecycle management",
          description:
            "The hub tracks all connected clients, detects dead connections on failed write attempts, and automatically cleans up resources. This prevents memory leaks from abandoned connections.",
        },
      ],
      coreConceptsMarkdown: `## Core Concepts

**EventSource API**: The browser-native JavaScript API for consuming SSE streams. \`new EventSource('/api/sse')\` opens a connection. \`.onmessage\` receives events. \`.onerror\` handles connection failures. Auto-reconnection is built in.

**Event Streams**: The server transmits events as text blocks over a long-lived HTTP connection. Each event has optional fields: \`event:\` (type name), \`data:\` (payload), \`id:\` (for resumption), \`retry:\` (reconnection interval in ms). Events are delimited by blank lines.

**Broadcast Pattern**: The SSE hub implements one-to-many broadcast. When an event is published, it is sent to ALL connected clients simultaneously. This is the publish-subscribe pattern with the server as publisher and browsers as subscribers.

**Connection Lifecycle**: Open (client connects, server registers) -> Active (events are pushed, heartbeats maintain the connection) -> Closed (client disconnects or connection fails, server cleans up). The lifecycle is managed automatically by the hub.

**Content-Type: text/event-stream**: The HTTP content type that signals to browsers and proxies that this is a streaming connection that should be kept open. This is what triggers the browser's EventSource behavior and prevents proxies from buffering the response.`,
      prosAndCons: {
        pros: [
          "Simpler than WebSockets — no handshake upgrade, no frame parsing, no ping/pong management. A standard HTTP connection with a special content type",
          "Auto-reconnection built into the browser API — resilience without custom code. The EventSource API handles reconnection natively",
          "Works through HTTP proxies — unlike WebSockets which require proxy support for the upgrade handshake, SSE uses standard HTTP",
          "Unidirectional simplicity — for dashboards and monitoring, the server-to-client direction is all that is needed. No bidirectional complexity",
        ],
        cons: [
          "Unidirectional only — the client cannot send data back through the SSE channel. A separate HTTP endpoint is needed for client-to-server communication",
          "Browser connection limits — browsers limit concurrent connections per domain (typically 6). In HTTP/1.1, each SSE connection consumes one of these slots",
          "No binary data support — SSE is text-only. Binary data must be base64 encoded, adding overhead. Not suitable for streaming images or video",
        ],
      },
      alternatives: [
        {
          name: "WebSockets",
          comparison:
            "Full bidirectional communication over a single TCP connection. More powerful but more complex — requires handshake upgrade, frame parsing, ping/pong keepalive, and manual reconnection logic. Overkill when only server-to-client push is needed.",
        },
        {
          name: "Long polling",
          comparison:
            "Client sends an HTTP request; server holds it open until new data is available, then responds. Simpler than WebSockets but higher latency (one roundtrip per event) and higher server resource usage (one pending request per client).",
        },
        {
          name: "gRPC streaming",
          comparison:
            "High-performance bidirectional streaming over HTTP/2. Efficient binary protocol with strong typing (Protocol Buffers). Requires HTTP/2 support and is not natively supported in browsers without a proxy layer.",
        },
      ],
      keyAPIs: [
        "`sseHub.broadcast(msg)` — Pushes an event message to all connected browser clients. Serializes the message as JSON, formats it as a Server-Sent Event (data: prefix + double newline), and writes to each client's response stream.",
        "`sseHub.addClient(id, res)` — Registers a new browser connection in the hub. Sets response headers (Content-Type: text/event-stream, Cache-Control: no-cache, Connection: keep-alive) and stores the response object for future broadcasts.",
        "`sseHub.removeClient(id)` — Deregisters a browser connection and cleans up resources. Called when a client disconnects or when a write attempt fails (detecting a dead connection).",
        "EventSource API (browser) — `new EventSource('/api/sse')` opens the connection. `.onmessage = (e) => JSON.parse(e.data)` receives events. Auto-reconnection on failure is built in.",
        "`text/event-stream` content type — The HTTP content type that triggers SSE behavior in browsers and proxies. Must be set in the response headers when establishing the SSE connection.",
      ],
      academicFoundations: `The publish-subscribe pattern (Eugster et al., 2003) formalizes the decoupling of event producers from consumers through an intermediary — the SSE hub is a pub-sub broker. The observer pattern (Gamma et al., GoF, 1994) defines one-to-many notification semantics that SSE implements. Event-driven architecture (EDA) treats events as first-class citizens, with systems reacting to event streams rather than polling for state changes. The Reactive Manifesto (2013) articulates the properties of reactive systems (responsive, resilient, elastic, message-driven) that SSE-based dashboards embody. HTTP/2 server push (RFC 7540, 2015) formalizes server-initiated data transfer within the HTTP protocol, though SSE over HTTP/1.1 remains more widely supported for streaming event data.`,
      furtherReading: [
        "MDN — Server-Sent Events — developer.mozilla.org/en-US/docs/Web/API/Server-sent_events",
        "HTML Living Standard — Server-Sent Events — html.spec.whatwg.org/multipage/server-sent-events.html",
        "Reactive Manifesto — reactivemanifesto.org",
      ],
    },
    {
      name: "SQLite + WAL Mode",
      category: "database",
      icon: "SQ",
      tagline: "Embedded relational database with concurrent reads via Write-Ahead Logging",
      origin: {
        creator: "D. Richard Hipp",
        year: 2000,
        motivation:
          "D. Richard Hipp created SQLite in 2000 for the US Navy, needing a database that required zero configuration, ran in-process (no separate server), and stored everything in a single file. It has since become the most widely deployed database engine in the world — present in every smartphone, every browser, and most embedded systems. WAL (Write-Ahead Logging) mode, added in SQLite 3.7.0 (2010), enables concurrent readers with one writer by writing changes to a separate log file before applying them to the main database.",
      },
      whatItIs: `An embedded relational database engine that runs in-process — no separate server, no network protocol, no configuration file. The entire database is a single file on disk. SQLite implements most of SQL-92, supports transactions (ACID), indexes (B-tree), triggers, views, and Common Table Expressions. WAL (Write-Ahead Logging) mode changes the concurrency model: instead of locking the entire database for writes, changes are appended to a separate WAL file. Readers continue reading from the main database while the writer appends to the WAL. Periodic checkpointing merges WAL changes back into the main database. This means multiple concurrent readers can operate without blocking (and without being blocked by) a single writer — perfect for dashboards that read frequently and write on events. The better-sqlite3 npm package provides a synchronous API (no async/await overhead), making SQLite operations as fast as function calls.`,
      explainLikeImTen:
        "Imagine a notebook where you write down everything that happens. With a normal notebook, only one person can write at a time, and nobody can read while someone is writing. WAL mode is like having a side notepad — the writer uses the side notepad while everyone else keeps reading the main notebook. Periodically, someone copies the side notepad into the main notebook when nobody is looking. Now everyone can read all the time, and one person can always write.",
      realWorldAnalogy:
        "A restaurant's order system using a paper pad (order tickets) and a ledger (the main database). Waiters write new orders on tickets (the WAL) while the kitchen reads the ledger for current orders (the main database). Periodically, a manager transfers tickets to the ledger (checkpointing). The kitchen is never blocked from reading, and waiters are never blocked from writing. This is exactly how WAL mode works — write to the log, read from the main file, checkpoint periodically.",
      whyWeUsedIt: `Zero configuration was essential — the dashboard installs via npm and should work immediately without requiring PostgreSQL, MySQL, or any database server setup. File-based storage means the database ships inside the npm package's data directory and is fully portable. WAL mode gives concurrent reads during writes, which is critical because the dashboard is constantly reading (browser requests for stats, events, sessions) while simultaneously writing (Claude Code hooks posting events). The better-sqlite3 package provides a synchronous API that is significantly faster than async alternatives for the single-process use case — no promise overhead, no callback chains, just direct function calls. Graceful fallback to JSONL ensures the dashboard works even when the native SQLite module fails to compile on exotic platforms.`,
      howItWorksInProject: `The database is stored at ~/.claude/pilot.db (configurable via CLAUDE_PILOT_DB environment variable). On first access, getDb() creates the singleton connection, enables WAL mode (PRAGMA journal_mode = WAL), enables foreign key enforcement (PRAGMA foreign_keys = ON), sets a busy timeout of 5000ms (PRAGMA busy_timeout = 5000), and runs CREATE TABLE IF NOT EXISTS for all 11 tables with their indexes. The dynamic require("better-sqlite3") pattern is used for Turbopack compatibility — Next.js's Turbopack bundler cannot handle native modules at compile time, so the require is deferred to runtime. If SQLite fails to initialize (native module compilation failure, filesystem permission issue), the system falls back to JSONL-only mode — events are appended to .jsonl files and read back with line-by-line parsing. When a JSONL-only instance later gets SQLite access (e.g., after rebuilding native modules), auto-migration imports existing JSONL events into SQLite. Schema versioning via the schema_version table enables safe migrations as the ontology evolves. All query functions return safe defaults (empty arrays, zero counts, null values, false booleans) when the database is unavailable, ensuring the dashboard renders a degraded but functional UI rather than crashing.`,
      featuresInProject: [
        {
          feature: "WAL mode for concurrent read/write access",
          description:
            "Write-Ahead Logging enables multiple concurrent readers while one writer appends changes. The dashboard reads continuously (browser requests) while writing on events (hook posts) without blocking either operation.",
        },
        {
          feature: "Dynamic require for Turbopack compatibility",
          description:
            "The better-sqlite3 native module is loaded via dynamic require() at runtime rather than static import at compile time. This prevents Turbopack bundler failures while maintaining full SQLite functionality.",
        },
        {
          feature: "Graceful fallback to JSONL",
          description:
            "If SQLite initialization fails (native module issue, permissions, etc.), the system automatically falls back to JSONL append-only files. Events are preserved and can be migrated to SQLite later.",
        },
        {
          feature: "Auto-migration from JSONL to SQLite",
          description:
            "When a JSONL-only instance gains SQLite access, existing events are automatically imported into the database. This enables seamless upgrade from degraded mode to full mode.",
        },
        {
          feature: "Safe defaults on failure",
          description:
            "Every query function returns a safe default when the database is unavailable: getEvents() returns [], getComputedStats() returns zeroes, getSession() returns null. The dashboard renders degraded but functional UI.",
        },
      ],
      coreConceptsMarkdown: `## Core Concepts

**Embedded Database**: SQLite runs in the same process as the application — no separate server, no network protocol, no IPC. Database operations are function calls, not network requests. This eliminates an entire category of failure modes (connection pooling, network timeouts, server crashes).

**WAL Mode**: Write-Ahead Logging changes how concurrency works. Without WAL (rollback journal mode), a write lock blocks all readers. With WAL, writes go to a separate log file while readers continue using the main database. Checkpointing periodically merges the WAL back into the main database. This enables concurrent reads during writes.

**Prepared Statements**: SQL queries compiled once and executed many times with different parameters. better-sqlite3's \`db.prepare(sql)\` returns a Statement object with \`.run()\`, \`.get()\`, and \`.all()\` methods. Prepared statements prevent SQL injection and improve performance through query plan caching.

**Transactions**: ACID transactions ensure atomicity (all or nothing), consistency (constraints satisfied), isolation (concurrent access managed), and durability (committed data survives crashes). better-sqlite3's \`db.transaction(fn)\` provides a synchronous transaction wrapper.

**Schema Migration**: The schema_version table tracks the current database version. On startup, the system checks the version, applies pending migrations in order, and updates the version. This allows the ontology to evolve safely over time.`,
      prosAndCons: {
        pros: [
          "Zero configuration — no server to install, no config file to write, no credentials to manage. The database is a single file created automatically on first use",
          "WAL concurrent reads — multiple browser requests can read simultaneously while hook events write, without any blocking or queuing",
          "Fast synchronous API — better-sqlite3 provides direct function calls without async/await overhead, making database operations as fast as in-memory operations for small datasets",
          "ACID transactions — full transactional support ensures data integrity even during crashes or unexpected shutdowns",
          "Portable — the entire database is a single file that can be copied, backed up, or moved between machines",
        ],
        cons: [
          "Single-writer limitation — only one process can write at a time. Multiple concurrent writers would need external coordination",
          "Not suited for high write concurrency — if many processes need to write simultaneously, SQLite becomes a bottleneck (not an issue for single-dashboard use case)",
          "Native module compilation — better-sqlite3 requires compilation per platform, which can fail on exotic or minimal environments",
          "File locking on network drives — SQLite's file locking does not work reliably on NFS, SMB, or other network filesystems",
        ],
      },
      alternatives: [
        {
          name: "PostgreSQL",
          comparison:
            "Full-featured client-server database with excellent concurrency, replication, and ecosystem. Far more powerful than SQLite for multi-user, high-concurrency workloads. But requires server installation, configuration, and maintenance — unacceptable overhead for an npm-distributed dashboard tool.",
        },
        {
          name: "DynamoDB",
          comparison:
            "Serverless, fully managed NoSQL database with automatic scaling. Eliminates operational burden entirely. But requires AWS account, introduces cloud dependency, adds network latency, and uses a non-standard query model — too much complexity for a local developer tool.",
        },
        {
          name: "LevelDB",
          comparison:
            "Fast key-value store (created by Google for Chrome). Excellent read/write performance for simple lookups. But no SQL support, no relational queries, no indexes beyond the primary key — insufficient for the complex queries the dashboard needs.",
        },
        {
          name: "Turso/libSQL",
          comparison:
            "A fork of SQLite that adds replication and edge distribution. Interesting for distributed scenarios but adds complexity (server component, sync protocol) that is unnecessary for a single-node dashboard.",
        },
      ],
      keyAPIs: [
        "`new BetterSqlite3(path)` — Opens or creates a SQLite database at the specified file path. Returns a database connection object that provides synchronous query methods.",
        "`db.prepare(sql).run/get/all()` — Prepared statement API. `.run()` executes INSERT/UPDATE/DELETE and returns changes count. `.get()` returns one row. `.all()` returns all matching rows as an array.",
        "`db.transaction(fn)` — Wraps a function in an ACID transaction. If the function throws, the transaction rolls back. If it completes, the transaction commits. Synchronous API with no async overhead.",
        "`db.pragma('journal_mode = WAL')` — Enables Write-Ahead Logging mode. Must be called once after opening the database. Returns 'wal' to confirm the mode was set successfully.",
        "`CLAUDE_PILOT_DB` environment variable — Overrides the default database path (~/.claude/pilot.db). Useful for testing (use :memory: for in-memory database) and custom installations.",
      ],
      academicFoundations: `The relational model (Codd, 1970) established the theoretical foundation for organizing data into tables with typed columns and relationships — the basis for every SQL database including SQLite. ACID properties (Haerder and Reuter, 1983) formalized the guarantees that database transactions must provide: Atomicity, Consistency, Isolation, Durability. Write-ahead logging (Mohan et al., ARIES, 1992) introduced the technique of writing changes to a log before applying them to the database — the theoretical basis for SQLite's WAL mode. B-tree indexes (Bayer and McCreight, 1972) provide the data structure that enables efficient range queries and ordered traversal — SQLite uses B-trees for both tables and indexes.`,
      furtherReading: [
        "SQLite documentation — sqlite.org/docs.html",
        "SQLite Is Not A Toy Database — antonz.org/sqlite-is-not-a-toy-database/",
        "Write-Ahead Logging — sqlite.org/wal.html",
      ],
    },
    {
      name: "MCP Protocol",
      category: "protocol",
      icon: "MC",
      tagline: "JSON-RPC over stdio for AI model tool discovery and execution",
      origin: {
        creator: "Anthropic",
        year: 2024,
        motivation:
          "Anthropic created the Model Context Protocol in 2024 to standardize how AI assistants discover and use external tools. Before MCP, every AI tool integration was bespoke — custom JSON schemas, custom transport protocols, custom discovery mechanisms. MCP draws inspiration from Microsoft's Language Server Protocol (2016), which standardized how code editors communicate with language-specific servers. Just as LSP gave every editor access to every language server, MCP gives every AI model access to every tool server.",
      },
      whatItIs: `Model Context Protocol — a JSON-RPC 2.0 protocol over stdio that enables AI models to discover and call tools from external servers. Messages are framed with Content-Length headers (borrowed from LSP) for reliable boundary detection on the byte stream. The protocol defines a small set of methods: initialize (capability negotiation), tools/list (discover available tools), tools/call (execute a tool with arguments), and ping (health check). Each tool has a name, description (for the model to understand its purpose), and an inputSchema (JSON Schema defining valid parameters). The protocol is transport-agnostic in principle but stdio is the primary transport — the MCP server runs as a child process of the AI client, communicating via stdin/stdout. This makes deployment trivial (just another binary/script) and security straightforward (same permissions as the user). The protocol is stateful: the initialize handshake establishes capabilities and version, and subsequent calls operate within that session context.`,
      explainLikeImTen:
        "Imagine you have a robot helper that can learn new tricks. MCP is like a standard trick-teaching language. When you plug in a new trick box (MCP server), the robot asks 'What tricks can you do?' (tools/list). The trick box responds with a menu and instructions for each trick. When the robot wants to perform a trick, it asks the box using the exact instructions (tools/call). Because everyone uses the same language, any robot can use any trick box — they are all compatible.",
      realWorldAnalogy:
        "USB (Universal Serial Bus). Before USB, every peripheral (printer, mouse, keyboard, scanner) had its own proprietary connector and driver protocol. USB standardized the physical connection and communication protocol so any device could work with any computer. MCP does the same for AI tools — it standardizes the interface so any AI model can discover and use any tool server. Just as USB has device descriptors (what capabilities does this device have?), MCP has tools/list (what tools does this server provide?).",
      whyWeUsedIt: `MCP is the standard interface for Claude Code tool integration. By exposing dashboard data as MCP tools, any Claude Code session can introspect its own metrics, events, and agent state — creating self-aware agents. The dashboard becomes not just a human observation tool but also an agent observation tool. An agent can query its own cost data ("am I burning too many tokens?"), check for recent errors ("did my last tool call fail?"), and inspect system health ("are all services running?") — all through the same MCP protocol it uses for other tools. This creates a feedback loop: the agent observes its own behavior (via MCP tools) and adjusts its strategy accordingly. The MCP server is configured in ~/.claude.json and automatically available in every Claude Code session.`,
      howItWorksInProject: `The MCP server (mcp-server.js) runs as a stdio child process of Claude Code. It implements the JSON-RPC 2.0 protocol with Content-Length framing for message boundaries. On startup, the server reads from stdin, parsing Content-Length headers to determine message boundaries. It handles five methods: (1) initialize — responds with server capabilities (tools support) and protocol version. (2) tools/list — returns the 6 available tools with their names, descriptions, and inputSchemas. (3) tools/call — executes the requested tool by proxying an HTTP request to the dashboard API (http://localhost:PORT/api/endpoint), formats the response as MCP tool result content. (4) ping — responds with an empty result (health check). (5) Unknown methods — returns a MethodNotFound error. Each tool proxies to a specific dashboard API endpoint: dashboard_stats fetches /api/stats, dashboard_events fetches /api/events with limit parameter, dashboard_agents fetches /api/agents, dashboard_mcp fetches /api/mcp, dashboard_tool_stats fetches /api/tool-stats with days parameter, and dashboard_receipts fetches /api/receipts with limit parameter. Error handling wraps tool failures in proper JSON-RPC error responses with error codes and messages.`,
      featuresInProject: [
        {
          feature: "6 typed tools proxying to dashboard API",
          description:
            "dashboard_stats, dashboard_events, dashboard_agents, dashboard_mcp, dashboard_tool_stats, and dashboard_receipts. Each tool has a description (for model understanding) and inputSchema (for parameter validation).",
        },
        {
          feature: "Content-Length framing for reliable message parsing",
          description:
            "Messages are prefixed with 'Content-Length: N' headers followed by the JSON-RPC payload. This enables reliable boundary detection on the stdin/stdout byte stream, preventing partial message processing.",
        },
        {
          feature: "Protocol capability negotiation",
          description:
            "The initialize handshake establishes what the server supports (tools) and the protocol version. This enables forward compatibility as MCP evolves — clients can detect and adapt to server capabilities.",
        },
        {
          feature: "Automatic error wrapping",
          description:
            "Tool execution failures are caught and wrapped in proper JSON-RPC error responses with appropriate error codes. The model receives structured error information it can reason about.",
        },
      ],
      coreConceptsMarkdown: `## Core Concepts

**JSON-RPC 2.0**: The wire protocol for MCP messages. Each message is a JSON object with "jsonrpc": "2.0", a "method" string, optional "params" object, and an "id" for request-response correlation. Notifications (no "id") are fire-and-forget.

**Content-Length Framing**: Borrowed from LSP. Each message is preceded by "Content-Length: N\\r\\n\\r\\n" where N is the byte length of the JSON payload. This enables reliable message boundary detection on the raw stdio stream.

**Tool Discovery (tools/list)**: The model asks the server "what tools do you provide?" and receives a typed catalog. Each tool entry includes name (identifier), description (natural language for model understanding), and inputSchema (JSON Schema for parameter validation).

**Tool Execution (tools/call)**: The model invokes a tool by name with arguments. The server validates arguments against the inputSchema, executes the tool, and returns a result. Results are typed as content arrays (text content, image content, etc.).

**Stdio Transport**: The MCP server runs as a child process, communicating via stdin (receiving requests) and stdout (sending responses). This makes deployment trivial and security straightforward — the server runs with the same permissions as the user.`,
      prosAndCons: {
        pros: [
          "Standardized tool interface — any MCP server works with any MCP client, enabling a growing ecosystem of reusable tool servers",
          "Discoverable — the tools/list method lets models understand available capabilities dynamically, without hardcoding tool knowledge",
          "Language-agnostic — the JSON-RPC protocol works with any programming language that can read/write JSON to stdio",
          "Simple deployment — an MCP server is just a script/binary that reads stdin and writes stdout. No HTTP server, no port management, no TLS configuration",
        ],
        cons: [
          "Stdio transport only (in practice) — while the protocol is transport-agnostic, the ecosystem primarily supports stdio, limiting deployment to same-machine scenarios",
          "Content-Length framing adds parsing complexity — implementers must handle byte-level message boundary detection, which is more complex than line-delimited JSON",
          "No streaming tools — the request/response model does not natively support tools that produce incremental results over time",
          "Protocol still evolving — MCP is young (2024) and the specification is still changing, requiring periodic updates to server implementations",
        ],
      },
      alternatives: [
        {
          name: "Function calling (OpenAI)",
          comparison:
            "OpenAI's function calling embeds tool definitions in the API request. Model-specific (only works with OpenAI models), not portable, and no external server — tool execution happens in the client. MCP separates tool definition from tool execution and works with any model.",
        },
        {
          name: "LangChain tools",
          comparison:
            "LangChain provides a Python-based tool abstraction with many pre-built tools. Framework-locked (requires LangChain), Python-only, and tightly coupled to LangChain's agent architecture. MCP is framework-agnostic and language-agnostic.",
        },
        {
          name: "Custom REST APIs",
          comparison:
            "Build custom HTTP endpoints for each tool. Maximum flexibility but no discoverability (models cannot ask 'what tools exist?') and no standardized parameter validation. Each integration is bespoke.",
        },
        {
          name: "A2A Protocol (Google)",
          comparison:
            "Agent-to-Agent protocol for inter-agent communication. Different scope — A2A handles agent coordination, while MCP handles agent-to-tool integration. Complementary rather than competing.",
        },
      ],
      keyAPIs: [
        "`initialize` — Handshake method that establishes server capabilities and protocol version. The client sends its capabilities; the server responds with its own. This enables forward compatibility.",
        "`tools/list` — Discovery method that returns the complete tool catalog. Each tool has name, description, and inputSchema. Models use this to understand what tools are available.",
        "`tools/call` — Execution method that invokes a tool by name with validated arguments. The server executes the tool and returns typed content (text, image, etc.).",
        "`ping` — Health check method that returns an empty result. Used by clients to verify the server is alive and responsive.",
        "Content-Length header — Message framing prefix that specifies the byte length of the JSON-RPC payload. Enables reliable message boundary detection on the stdio stream.",
        "`sendResult(id, result)` / `sendError(id, code, message)` — Helper functions that format and write JSON-RPC responses to stdout with proper Content-Length framing.",
      ],
      academicFoundations: `Remote Procedure Call (Birrell and Nelson, 1984) established the paradigm of calling functions on remote systems as if they were local — the conceptual basis for tools/call. The Language Server Protocol (Microsoft, 2016) demonstrated that standardizing a protocol between tools and editors creates a combinatorial ecosystem (M editors x N languages instead of M*N integrations) — MCP applies the same principle to AI models and tool servers. Capability negotiation (used in HTTP, TLS, and many protocols) ensures that participants can adapt to each other's feature sets — the initialize handshake implements this. Interface Definition Languages (IDL — CORBA, Thrift, Protocol Buffers) formalize how services describe their interfaces — JSON Schema in MCP tool definitions serves this role.`,
      furtherReading: [
        "Anthropic MCP specification — modelcontextprotocol.io",
        "Language Server Protocol — microsoft.github.io/language-server-protocol/",
        "JSON-RPC 2.0 specification — jsonrpc.org/specification",
      ],
    },
    {
      name: "Typed Handoff Schema",
      category: "ai-ml",
      icon: "TH",
      tagline: "Formal protocol for agent-to-agent work transfer with lease-based ownership and evidence chains",
      origin: {
        creator: "Workflow Management Coalition (WfMC) + Apache ZooKeeper distributed coordination",
        year: 1993,
        motivation:
          "The Workflow Management Coalition (WfMC, 1993) established standards for passing work between participants in business processes, formalizing the concept of typed work items with states and transitions. Apache ZooKeeper (2010) introduced lease-based coordination for distributed systems, solving the problem of temporary ownership with automatic timeout and reassignment. Context engineering synthesizes these into a typed handoff schema where agent-to-agent work transfer follows a formal protocol: Task -> Claim -> Receipt -> Verify, with lease-based ownership preventing indefinite blocking.",
      },
      whatItIs: `A formal protocol for transferring work between agents with explicit ownership, evidence, and verification at every transition. The handoff schema defines a state machine for work items: Created (a planner defines a task with acceptance criteria) -> Claimed (a worker takes ownership with a time-limited lease) -> Completed (the worker submits a receipt with linked evidence) -> Verified (a verifier confirms the evidence satisfies the criteria) -> Promoted (the verified work enters shared state). Each transition has preconditions (the task must exist to be claimed), postconditions (a claim creates a lease), and side effects (the lease starts a timeout). If a lease expires without completion, the task returns to Created state for reassignment — preventing indefinite blocking by a stuck or failed agent. The key insight is that "done" is a claim, not a fact. The handoff schema makes this distinction formal: a worker's "done" produces a Receipt (a claim with evidence), not a promotion. Only after independent verification does the work enter shared state. This prevents the most common multi-agent failure: one agent's false completion claim corrupting the work of all downstream agents.`,
      explainLikeImTen:
        "Imagine a relay race where you cannot just throw the baton and hope someone catches it. There is a strict rule: the runner with the baton (worker) must hand it directly to the next runner (verifier), who checks that the baton is the right one and the runner finished the full lap. If a runner stops in the middle and does not hand off for too long, the referee (timeout) takes the baton back and gives it to a different runner. Nobody finishes the race until the judge confirms every lap was completed properly.",
      realWorldAnalogy:
        "A hospital patient handoff protocol during shift changes. When the day-shift nurse hands responsibility to the night-shift nurse, there is a formal procedure: patient status is read aloud (the receipt), each medication and pending test is listed (the evidence), the night-shift nurse confirms understanding of each item (verification), and both nurses sign the handoff sheet (promotion to shared record). This protocol exists because the number one cause of medical errors is miscommunication during handoffs — exactly the failure mode that typed handoff schemas prevent in agent systems.",
      whyWeUsedIt: `Multi-agent coordination without formal handoffs produces three failure categories: (1) Lost work — Agent A completes a task but Agent B never receives the result because there is no handoff protocol. (2) Duplicate work — Agent A and Agent B both claim the same task because there is no ownership mechanism. (3) Poisoned state — Agent A marks a task "done" without evidence, and Agent B builds on that false foundation. The typed handoff schema eliminates all three: leases prevent duplicate claiming, receipts prevent lost work, and verification prevents poisoned state. In our dashboard, the receipt system tracks completed work with evidence links. The session handoff mechanism preserves context when sessions end and new ones begin. The alert acknowledgment flow implements the promotion gate pattern.`,
      howItWorksInProject: `The handoff schema is implemented through several interconnected mechanisms. (1) Receipt System: When a tool call completes, a receipt is generated containing the tool name, input parameters, output result, duration, cost, and session context. Receipts are stored in the events table with type "tool_complete" and linked to their initiating "tool_use" event via session_id and temporal ordering. (2) Session Handoff: When a Claude Code session ends (session_end event), the session record is finalized with end_time, total_cost, and final status. When a new session starts in the same project directory, it can query the context graph for the previous session's receipts, enabling continuity without requiring the model to hold previous session state in its context window. (3) Alert Acknowledgment Flow: Alerts follow the handoff state machine: Created (alert fires) -> Pending (awaiting acknowledgment) -> Acknowledged (human or automation confirms). The acknowledgment is the verification step — it confirms that the alert condition has been reviewed and addressed. Unacknowledged alerts remain visible and active, implementing the promotion gate. (4) Evidence Linking: Receipts reference their source events, sessions reference their projects, and alerts reference their triggering conditions. This creates an evidence chain that can be traversed from any point to its origin, enabling full audit trail reconstruction.`,
      featuresInProject: [
        {
          feature: "Lease-based task claiming with timeout",
          description:
            "When an agent claims a task, it acquires a time-limited lease. If the lease expires without completion, the task returns to the available pool for reassignment. This prevents indefinite blocking by stuck or failed agents.",
        },
        {
          feature: "Receipt-based completion with evidence linking",
          description:
            "Completion produces a receipt containing the work result and linked evidence (test results, file hashes, screenshots). The receipt is a claim, not a promotion — it must be independently verified before entering shared state.",
        },
        {
          feature: "Verification gate before promotion",
          description:
            "No work enters shared state without passing through a verification gate. The verifier checks that the receipt's evidence actually satisfies the task's acceptance criteria. This prevents false completion claims from poisoning downstream agents.",
        },
        {
          feature: "Automatic reassignment on lease expiry",
          description:
            "If a claimed task's lease expires (the agent crashed, got stuck, or took too long), the task is automatically returned to the available pool. Another agent can then claim it, ensuring progress continues despite individual agent failures.",
        },
        {
          feature: "Full evidence chain traversal",
          description:
            "Every handoff transition is recorded with timestamps and references. The evidence chain can be traversed from any point — a promoted result back through its verification, receipt, claim, and original task definition — enabling complete audit trail reconstruction.",
        },
      ],
      coreConceptsMarkdown: `## Core Concepts

**Task State Machine**: The formal lifecycle of a work item: Created -> Claimed -> Completed -> Verified -> Promoted. Each state has entry conditions, exit conditions, and timeout behavior. The state machine prevents invalid transitions (you cannot verify work that was not completed, you cannot claim a task that is already claimed).

**Lease-Based Ownership**: When an agent claims a task, it gets a lease — temporary, time-limited ownership. The lease prevents other agents from claiming the same task (no duplicate work) while ensuring that ownership expires if the agent fails (no indefinite blocking). Lease duration is tuned per task type: quick tasks get short leases, complex tasks get longer ones.

**Receipt as Claim**: A completed task produces a receipt — a structured record of what was done, with linked evidence. Critically, the receipt is a CLAIM, not a FACT. The worker asserts completion; the verifier confirms it. This distinction is the foundation of reliable multi-agent coordination.

**Evidence-Linked Verification**: The verifier does not just check "did the agent say done?" — it checks "does the evidence support the claim?" A coding task's receipt should link to passing test results. A deployment task's receipt should link to a health check response. Evidence makes verification objective rather than trust-based.

**Promotion Gates**: The transition from "verified" to "promoted" (entering shared state) is a gate that requires explicit passage. This is the final guard against bad data entering the system. In automated systems, promotion is triggered by passing all verification checks. In supervised systems, a human approves the promotion.`,
      prosAndCons: {
        pros: [
          "Clear ownership prevents duplicate work — leases ensure exactly one agent works on each task at any given time, eliminating wasted compute from parallel duplicate efforts",
          "Evidence trail enables debugging — every handoff transition is recorded with timestamps and evidence references, making it possible to reconstruct exactly what happened and why",
          "Timeout and reassignment ensure progress — stuck agents do not block the pipeline because leases expire and tasks are reassigned automatically",
          "Prevents state poisoning — verification gates ensure that only evidence-backed work enters shared state, protecting downstream agents from building on false foundations",
        ],
        cons: [
          "Coordination overhead — the claim-complete-verify-promote cycle adds latency compared to fire-and-forget task execution",
          "Lease duration tuning is task-specific — too short and agents timeout on legitimate work; too long and stuck agents block progress. Requires per-task-type calibration",
          "State machine rigidity — the fixed state transitions may not accommodate every workflow pattern, requiring workarounds for unusual task lifecycles",
        ],
      },
      alternatives: [
        {
          name: "Message queues (RabbitMQ, SQS)",
          comparison:
            "Pub-sub message queues handle work distribution but not ownership verification. A message is consumed (claimed) but there is no built-in receipt, verification, or promotion mechanism. Good for fire-and-forget tasks, insufficient for tasks that require evidence-backed completion.",
        },
        {
          name: "Git PR workflow",
          comparison:
            "Pull requests implement a natural handoff: branch (claim), commit (work), review (verify), merge (promote). Excellent for code changes but heavyweight for fine-grained agent task coordination where tasks may complete in seconds.",
        },
        {
          name: "Kanban boards (Trello, Jira)",
          comparison:
            "Visual workflow management with columns for task states. Good for human coordination but lacks the formal verification and evidence-linking mechanisms needed for autonomous agent coordination.",
        },
      ],
      keyAPIs: [
        "Task state machine — Formal state transitions (Created -> Claimed -> Completed -> Verified -> Promoted) with preconditions and postconditions at each step. Invalid transitions are rejected and logged.",
        "Claim with lease — Acquires temporary ownership of a task with a time-limited lease. The lease duration is specified at claim time and automatically expires, returning the task to the available pool.",
        "Complete with evidence — Submits a receipt containing the work result and linked evidence references. The receipt is stored as a claim pending verification, not as a promoted fact.",
        "Verify with check — An independent verifier evaluates the receipt's evidence against the task's acceptance criteria. The verification result (pass/fail with reasons) is recorded as part of the evidence chain.",
        "Reassign on timeout — When a lease expires without completion, the task's state reverts to Created and it becomes available for claiming by another agent. The expired claim is logged for debugging.",
      ],
      academicFoundations: `Petri nets (Carl Adam Petri, 1962) provide the mathematical framework for modeling concurrent systems with tokens, places, and transitions — directly applicable to the task state machine where tokens (tasks) move through places (states) via transitions (claim, complete, verify). Distributed locking (Lamport, 1978) established the theory of mutual exclusion in distributed systems — lease-based claiming is a practical implementation of distributed locking with automatic expiry. The saga pattern (Garcia-Molina and Salem, 1987) handles long-running distributed transactions by breaking them into a sequence of local transactions with compensating actions — analogous to the task lifecycle where each step can be rolled back (unclaimed, rejected, reassigned). Two-phase commit (Gray, 1978) ensures atomic commitment across distributed participants — the verification-then-promotion sequence is a simplified two-phase commit where the verifier is the coordinator.`,
      furtherReading: [
        "Workflow Management Coalition — wfmc.org",
        "ZooKeeper: Wait-free coordination — usenix.org/conference/atc10/zookeeper-wait-free-coordination-internet-scale-systems",
        "Saga Pattern — Garcia-Molina and Salem, 1987",
      ],
    },
  ],
  architecture: [
    {
      title: "System Overview",
      content: `The context engineering architecture is organized into three layers with distinct responsibilities and lifecycles.

Layer 1: Reasoning Model (Stateless). The LLM (Claude, GPT, Qwen) is a pure function — it receives a context window and produces a response. It has no memory, no state, no persistence. Every turn, it starts fresh with only what the harness provides. This statelessness is a feature, not a limitation: it means the model's behavior is entirely determined by its input, making it predictable and debuggable.

Layer 2: Harness (Stateful Control Loop). The harness is the execution environment that turns a stateless model into a stateful agent. It manages the agent loop: gather context from the graph, compile it into a token window, send it to the model, receive the response, execute tool calls, observe results, verify output, and write back to the graph. The harness IS the agent — the model is just one component. The harness owns tool execution, memory management, context assembly, verification, and stop conditions.

Layer 3: Context Graph (Durable External State). The context graph is the persistent, queryable state that lives outside the token window. It stores events, sessions, receipts, alerts, snapshots, and all typed relationships between them. It survives context compaction, session restarts, and model changes. The context compiler reads from the graph to assemble each turn's context; the verification loop writes back to the graph after validating output.

The harness mediates ALL interaction between the model and the graph. The model never reads from or writes to the graph directly — it interacts only through the tools and context that the harness provides. This mediation is what enables phase gating, tool masking, verification, and context compilation.`,
      diagram: `\`\`\`
+-----------------------------------------------------------+
|                   CONTEXT ENGINEERING                       |
+-----------------------------------------------------------+
|                                                             |
|  +-----------+    +------------+    +----------+           |
|  |  Context  |--->|  Context   |--->| Reasoning|           |
|  |   Graph   |    |  Compiler  |    |  Model   |           |
|  | (durable) |<---|  (assemble)|<---|(stateless)|           |
|  +-----+-----+    +------------+    +-----+----+           |
|        |                                   |                |
|        |         +--------------+          |                |
|        +-------->| Verification |<---------+                |
|                  |     Loop     |                           |
|                  +------+-------+                           |
|                         |                                   |
|                  +------+-------+                           |
|                  |    Skill     |                           |
|                  |    Graph     |                           |
|                  |  (execute)   |                           |
|                  +--------------+                           |
|                                                             |
|  Ontology: shared types + edges + constraints               |
+-----------------------------------------------------------+
\`\`\``,
    },
    {
      title: "Data Flow -- Event Lifecycle",
      content: `Every piece of data in the system follows a triple-write event lifecycle that ensures durability, queryability, and real-time observability simultaneously.

The flow begins with Claude Code Hooks. When a Claude Code session starts, ends, uses a tool, encounters an error, submits a prompt, or compacts context, the hook system fires an event. These hooks are configured in the Claude Code settings and POST event data to the dashboard API.

The event arrives at POST /api/events, where the events-store.ts module processes it through the triple-write pipeline:

Write 1 (JSONL Backup): The event is appended as a single line to a .jsonl file. This is the append-only backup that survives any downstream failure. JSONL files are never modified after writing — only appended.

Write 2 (SQLite Query Store): The event is INSERT-ed into the SQLite events table with all typed fields (timestamp, type, session_id, data, cost, duration, tool_name, model). This enables structured queries, aggregations, and relationship traversal.

Write 3 (SSE Broadcast): The event is broadcast through the SSE hub to all connected browser clients. This provides instant real-time visibility — the dashboard updates the moment an event occurs.

Additionally, the event store evaluates alert rules against current metrics (checking for cost thresholds, error spikes, session duration anomalies) and generates receipts linking tool completions to their initiating events.

The browser receives events via the SSE stream from sse-hub.ts, which manages client connections, heartbeats, and dead connection cleanup. The browser renders events in real time without polling.`,
      diagram: `\`\`\`
Claude Code Hooks --> POST /api/events --> events-store.ts
                                             |-- JSONL (backup)
                                             |-- SQLite (query)
                                             |-- SSE (live push)
                                             |-- Alerts (evaluate)
                                             +-- Receipts (audit)

Browser <-- SSE stream <-- sse-hub.ts <-- event broadcast
\`\`\``,
    },
    {
      title: "Swarm Coordination Architecture",
      content: `Multi-agent coordination is built as a layer on top of single-agent context engineering primitives. The same five primitives (Ontology, Context Graph, Skill Graph, Context Compiler, Verification Loop) that make one agent reliable also make N agents coordinated — with the addition of typed handoffs and role-scoped capabilities.

The architecture defines three agent roles with distinct phase access:

PLANNER (PLAN phase): Creates tasks, defines acceptance criteria, decomposes objectives into actionable work items. Has read access to the full context graph but cannot execute tools or modify artifacts. The planner sees the big picture and creates the work queue.

WORKER (ACT phase): Claims tasks from the queue, executes them using allowed tools, and produces receipts with linked evidence. Has execution access but cannot redefine objectives or verify its own work. Workers are specialists — each has a role-scoped tool set (architect, debugger, test-writer, etc.).

VERIFIER (VERIFY phase): Independently reviews receipts and evidence against task acceptance criteria. Has read access to evidence and criteria but cannot modify artifacts. The verifier is the promotion gate — only verified work enters shared state.

The coordination loop operates as: Queue (planner creates tasks) -> Claim (worker acquires lease) -> Execute (worker performs task) -> Receipt (worker submits evidence) -> Verify (verifier checks evidence) -> Promote (verified work enters graph) -> Timeout/Reassign (expired leases return tasks to queue).

All three roles share a single Context Graph as their coordination medium. The graph provides: task queue (pending tasks), ownership registry (who claimed what), evidence store (receipts and verification results), and audit trail (every transition recorded). This shared-memory topology eliminates the need for explicit message passing between agents — they coordinate by reading from and writing to the same graph.`,
      diagram: `\`\`\`
+----------+    +----------+    +----------+
| PLANNER  |    |  WORKER  |    | VERIFIER |
|  (PLAN)  |    |  (ACT)   |    | (VERIFY) |
+----------+    +----------+    +----------+
| create   |    | claim    |    | verify   |
| tasks    |--->| execute  |--->| evidence |
| plan     |    | receipt  |    | promote  |
+----+-----+    +----+-----+    +----+-----+
     |               |               |
     +---------------+---------------+
             Shared Context Graph
\`\`\``,
    },
  ],
  cicd: {
    overview:
      "Multi-stage validation pipeline: TypeScript type checking, ESLint linting, 317 unit tests via Vitest, Next.js production build with native module fix, npm pack for distribution, end-to-end testing (7 API endpoints + 16 browser views via Playwright), and a 13-check pre-release validation script that must pass before any npm publish.",
    stages: [
      {
        name: "TypeScript Check",
        tool: "tsc",
        description:
          "Runs the TypeScript compiler in check-only mode (--noEmit) to verify type safety across the entire codebase. Catches type errors, missing imports, and interface mismatches before any code executes.",
        commands: ["npx tsc --noEmit"],
      },
      {
        name: "Lint",
        tool: "eslint",
        description:
          "Runs ESLint with the project's configuration to enforce code style, catch common errors, and maintain consistency across the codebase. Includes rules for unused variables, missing return types, and import ordering.",
        commands: ["npx eslint ."],
      },
      {
        name: "Unit Tests",
        tool: "vitest",
        description:
          "Runs 317 unit tests covering event store operations, SSE broadcasting, alert rule evaluation, MCP protocol handling, session management, cost computation, and database operations. Tests use in-memory SQLite for isolation.",
        commands: ["npx vitest run"],
      },
      {
        name: "Build",
        tool: "next build + fix-native-requires.js",
        description:
          "Runs the Next.js production build to generate optimized static and server-rendered pages. After build, a custom fix-native-requires.js script patches dynamic require statements for the better-sqlite3 native module, ensuring compatibility with the Turbopack bundler's output.",
        commands: ["npx next build", "node scripts/fix-native-requires.js"],
      },
      {
        name: "Pack",
        tool: "npm pack",
        description:
          "Creates a distributable tarball (.tgz) of the package. Verifies that all necessary files are included, respects .npmignore exclusions, and produces a valid npm-installable artifact.",
        commands: ["npm pack --dry-run", "npm pack"],
      },
      {
        name: "E2E Test",
        tool: "Playwright + API tests",
        description:
          "End-to-end validation covering 7 API endpoints (stats, events, sessions, agents, mcp, tool-stats, receipts) and 16 browser views (dashboard, timeline, cost breakdown, tool distribution, agent cards, alert management, settings). Playwright drives a real browser against the built application.",
        commands: ["npx playwright test"],
      },
      {
        name: "Pre-Release Validation",
        tool: "Custom 13-check script",
        description:
          "A comprehensive validation script that runs 13 checks before any npm publish: TypeScript compilation, lint, unit tests, build, native module patching, tarball contents inspection, API endpoint smoke tests, browser view rendering verification, dependency audit, license check, changelog validation, version bump confirmation, and git status cleanliness.",
        commands: ["node scripts/pre-release.js"],
      },
    ],
    infrastructure:
      "GitHub Actions CI runs on a Node.js version matrix (18, 20, 22) to ensure compatibility across LTS and current releases. Each push triggers the full pipeline: typecheck, lint, test, build. Pull requests require all checks to pass before merge. Local pre-release validation runs the 13-check script before any npm publish, catching issues that CI might miss (native module behavior, tarball contents, local environment specifics).",
  },
  designPatterns: [
    {
      name: "Dual-Write Pattern",
      category: "architectural",
      whatItIs:
        "A data durability pattern where every write operation targets multiple storage backends simultaneously. If one backend fails, the others preserve the data. This provides redundancy without requiring distributed transactions, at the cost of potential inconsistency between backends that must be reconciled.",
      howProjectUsesIt:
        "Every event ingested by the dashboard is triple-written: appended to a JSONL file (durable backup), INSERT-ed into SQLite (structured query store), and broadcast via SSE (real-time push to browsers). If SQLite fails, the JSONL preserves the event for later migration. If JSONL fails, SQLite still has the record. If SSE fails, both persistent stores retain the data for the next browser refresh.",
      codeExample: `// Triple-write in events-store.ts
export function insertEvent(evt: DashboardEvent): void {
  // Write 1: JSONL backup (append-only, never fails silently)
  appendToJsonl(evt);

  // Write 2: SQLite query store (structured, queryable)
  const db = getDb();
  if (db) {
    db.prepare(\`INSERT INTO events (id, timestamp, type, session_id, data, cost, duration, tool_name, model)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)\`).run(
      evt.id, evt.timestamp, evt.type, evt.sessionId,
      JSON.stringify(evt.data), evt.cost, evt.duration,
      evt.toolName, evt.model
    );
  }

  // Write 3: SSE broadcast (real-time push to all browsers)
  sseHub.broadcast({ type: "event", payload: evt });
}`,
    },
    {
      name: "Graceful Degradation",
      category: "architectural",
      whatItIs:
        "A resilience pattern where every subsystem handles its own failures independently, returning safe defaults instead of propagating errors. The system continues operating with reduced functionality rather than crashing entirely. Each component is designed to fail gracefully, providing a degraded but functional experience.",
      howProjectUsesIt:
        "Every database query function returns a safe default when SQLite is unavailable: getEvents() returns an empty array, getComputedStats() returns zero-valued metrics, getSession() returns null. The dashboard renders a degraded but functional UI with empty charts and zero counts rather than crashing with a database error. When the JSONL fallback is active, the system still provides read-only event access through line-by-line file parsing.",
    },
    {
      name: "Singleton with Hot-Reload Survival",
      category: "creational",
      whatItIs:
        "A singleton pattern adapted for development environments where modules are frequently reloaded (Hot Module Replacement). Standard module-level singletons are destroyed and recreated on each reload, losing state. By storing the singleton on globalThis (the global object that survives module reloads), the instance persists across HMR cycles.",
      howProjectUsesIt:
        "The SQLite database connection and the SSE hub are stored as globalThis singletons. During Next.js development with Turbopack, modules are reloaded on every file save. Without globalThis storage, each reload would create a new database connection (leaking the old one) and a new SSE hub (disconnecting all browser clients). The globalThis pattern ensures a single database connection and a single SSE hub survive across all development reloads.",
      codeExample: `// Singleton with HMR survival in events-store.ts
function getDb(): BetterSqlite3.Database | null {
  const key = "__claude_pilot_db__";
  if ((globalThis as Record<string, unknown>)[key]) {
    return (globalThis as Record<string, unknown>)[key] as BetterSqlite3.Database;
  }
  try {
    const Database = require("better-sqlite3");
    const db = new Database(getDbPath());
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    db.pragma("busy_timeout = 5000");
    createTables(db);
    (globalThis as Record<string, unknown>)[key] = db;
    return db;
  } catch {
    return null; // Graceful fallback to JSONL
  }
}`,
    },
    {
      name: "Observer / Pub-Sub",
      category: "behavioral",
      whatItIs:
        "A messaging pattern where event producers (publishers) broadcast events without knowing who will receive them, and event consumers (subscribers) receive events without knowing who produced them. The pub-sub broker decouples producers from consumers, enabling independent scaling and failure isolation.",
      howProjectUsesIt:
        "The SSE hub implements pub-sub for real-time event distribution. The event store publishes events to the hub (producer). Browser clients subscribe to the hub via EventSource connections (consumers). The hub manages the subscriber list, handles connection lifecycle, and broadcasts each event to all active subscribers. Producers and consumers are fully decoupled — the event store does not know which browsers are connected, and browsers do not know which component produced each event.",
    },
    {
      name: "Phase Gating / State Machine",
      category: "behavioral",
      whatItIs:
        "A control flow pattern where the system progresses through distinct phases (states), and available operations are restricted based on the current phase. Transitions between phases are explicit and validated. This prevents out-of-order execution and enforces workflow discipline.",
      howProjectUsesIt:
        "Agent execution follows three phases: PLAN (read-only analysis and objective decomposition), ACT (tool execution and artifact creation), VERIFY (evidence checking and promotion gating). During PLAN phase, execution tools are masked — the agent can reason about what to do but cannot do it. During ACT phase, planning tools are deprioritized. During VERIFY phase, only evidence-checking tools are available. Phase transitions are logged as events in the context graph, creating an audit trail of the agent's workflow progression.",
      codeExample: `// Phase gating in skill graph middleware
type Phase = "PLAN" | "ACT" | "VERIFY";

interface SkillDefinition {
  name: string;
  phases: Phase[];
  inputSchema: JSONSchema;
}

function isToolAllowed(tool: SkillDefinition, currentPhase: Phase): boolean {
  if (!tool.phases.includes(currentPhase)) {
    console.log(\`Tool "\${tool.name}" blocked in \${currentPhase} phase\`);
    return false;
  }
  return true;
}

// Tools are MASKED, not removed -- schema stays visible,
// invocation is gated by phase state
const skills: SkillDefinition[] = [
  { name: "create_plan", phases: ["PLAN"], inputSchema: planSchema },
  { name: "execute_code", phases: ["ACT"], inputSchema: execSchema },
  { name: "verify_evidence", phases: ["VERIFY"], inputSchema: verifySchema },
  { name: "read_context", phases: ["PLAN", "ACT", "VERIFY"], inputSchema: readSchema },
];`,
    },
    {
      name: "Evidence-Gated Promotion",
      category: "architectural",
      whatItIs:
        "A data integrity pattern where no information enters shared state without linked evidence supporting its validity. Agents produce claims (assertions about completed work) and evidence (test results, file hashes, health check responses). Only claims with sufficient evidence are promoted to the shared context graph. This prevents unverified assertions from corrupting the system of record.",
      howProjectUsesIt:
        "The alert acknowledgment flow is an evidence-gated promotion. When an alert fires (e.g., cost threshold exceeded), it enters pending state. It remains pending — visible in the dashboard, counted in the badge — until explicitly acknowledged. The acknowledgment is the evidence: a human or automated process confirms the condition has been reviewed and addressed. Only then does the alert transition to resolved state. Similarly, tool completion receipts link to their initiating events, creating evidence chains that can be audited.",
    },
    {
      name: "Context Budget Pattern",
      category: "architectural",
      whatItIs:
        "A resource management pattern where the context window is treated as a finite budget with explicit allocation. Each category of context (objectives, plans, events, logs) receives a token allocation proportional to its priority. High-priority items are guaranteed space; low-priority items fill remaining capacity. Budget overruns trigger compaction rather than truncation.",
      howProjectUsesIt:
        "The dashboard tracks context usage percentage (ctx_pct) as a first-class session metric, making token budget consumption visible in real time. The 500-event rolling buffer enforces a budget on candidate context items. Daily snapshot compaction compresses detailed event streams into summary metrics, reclaiming budget for current events. The cost model system enables dollar-cost-aware budgeting, factoring in not just token count but actual monetary cost per model.",
    },
    {
      name: "Middleware / Interceptor",
      category: "structural",
      whatItIs:
        "A structural pattern where operations pass through a chain of processing steps (middleware) before and after execution. Each middleware can inspect, modify, reject, or log the operation. The chain is composable — middleware can be added or removed without changing the core operation.",
      howProjectUsesIt:
        "The Claude Code hook system implements a middleware chain around tool execution. Seven hook event types (session-start, session-end, pre-tool-use, post-tool-use, prompt-submit, tool-error, context-compact) wrap every significant operation. Pre-tool-use hooks validate inputs before the tool executes. Post-tool-use hooks record results and compute costs after execution. Tool-error hooks capture failures for debugging. Each hook POSTs event data to the dashboard API, creating the event stream that powers the entire observation and verification system.",
    },
    {
      name: "Strategy Pattern",
      category: "behavioral",
      whatItIs:
        "A behavioral pattern where a family of algorithms is defined, each encapsulated in its own module, and made interchangeable at runtime. The client selects which algorithm to use based on context, without modifying the code that uses the algorithm. This enables flexible behavior switching without conditional branching.",
      howProjectUsesIt:
        "The context compiler supports multiple retrieval strategies that can be selected based on the agent's current needs. The 'recite' strategy repeats the current objective near the end of context to fight attention drift. The 'graph_first' strategy prioritizes context graph queries over in-window history. The 'agent-native' strategy defers to the model's built-in context management. Each strategy implements the same interface (select candidates, rank them, allocate budget, compact overflow) but with different prioritization logic.",
    },
  ],
  keyTakeaways: [
    "Context engineering is systems engineering for attention. The context window is a finite resource with known degradation patterns (lost in the middle). Treating it as an engineering problem — with budgets, compilers, and verification — transforms agent reliability from art to discipline.",
    "The agent IS the harness, not the model. The model is a stateless reasoning component. The harness (tool execution, memory management, context assembly, verification, stop conditions) is what makes it an agent. A great harness makes an average model competitive; a bad harness wastes a frontier model's capabilities.",
    "Store broadly, compile narrowly. Persist everything to the context graph — storage is cheap. But carefully curate the tiny subset that enters the token window each turn — attention is expensive. The compiler bridges the gap between abundant storage and scarce attention.",
    "No promotion without evidence. An agent saying 'done' is a claim, not a fact. The verification loop requires linked evidence before any work enters shared state. This single principle prevents the most common failure mode in production agent systems: false completion claims corrupting downstream work.",
    "Phase gating is a reliability mechanism, not a limitation. Restricting which tools are available in which phase (PLAN/ACT/VERIFY) prevents entire categories of coordination failures. Planners cannot accidentally execute, executors cannot redefine objectives, and verifiers cannot modify what they are checking.",
    "Mask, do not remove tools. When a tool should be temporarily unavailable, keep its schema visible but gate invocation by state. Dynamically changing tool definitions mid-loop invalidates the KV-cache and confuses the model. Gate selection via state, not schema mutation.",
    "Errors are evidence, not noise. Every error is a data point in the context graph — it tells you what went wrong, when, in what context, and at what cost. Error events feed the alert rules engine, cost tracking, and debugging workflow. Suppressing errors suppresses signal.",
    "Swarm mechanics equal the same primitives plus a coordination overlay. The five context engineering primitives that make one agent reliable (Ontology, Context Graph, Skill Graph, Context Compiler, Verification Loop) also make N agents coordinated — with the addition of typed handoffs, role-scoped tools, and shared memory topology.",
  ],
  coreConcepts: [
    {
      name: "Finite Attention Budget",
      slug: "finite-attention-budget",
      whatItIs:
        "The context window of a language model is finite (e.g., 200K tokens for Claude) and subject to the 'lost in the middle' effect where information placed in the middle of long contexts receives significantly less attention than information at the beginning or end. This means the context window is not just limited in size — it is limited in effective capacity, because not all positions in the window are equally useful. Context engineering treats this as a budget problem: every token in the window must earn its place through relevance, recency, and priority.",
      whyItMatters:
        "Without budget-aware context management, agents degrade in predictable ways as sessions grow long. They forget objectives stated early in the conversation. They repeat work they already completed. They miss critical information buried in the middle of verbose tool outputs. The finite attention budget is not a theoretical concern — it is the primary failure mode of naive agent implementations that stuff everything into context without selection or prioritization.",
      howProjectUsesIt:
        "The dashboard tracks context usage percentage (ctx_pct) as a first-class session metric, making budget consumption visible in real time. The 500-event rolling buffer enforces a hard cap on candidate context items. The context compiler's four-pass pipeline (Select, Rank, Budget, Compact) allocates tokens proportional to priority. Daily snapshot compaction reclaims budget by compressing detailed event streams into summary metrics. The recitation pattern places objectives near the end of context where attention is strongest.",
      keyTerms: [
        { term: "Token budget", definition: "The maximum number of tokens available in the context window, treated as a finite resource with explicit allocation per content category." },
        { term: "Lost in the middle", definition: "The empirically demonstrated phenomenon (Liu et al., 2023) where language models pay less attention to information positioned in the middle of long contexts compared to the beginning and end." },
        { term: "Context compaction", definition: "The process of reducing detailed information into compressed summaries that preserve essential signal in fewer tokens, triggered when the context window approaches capacity." },
        { term: "Attention degradation", definition: "The progressive decline in model performance as the context window fills with low-signal information, causing the model to miss or ignore high-priority items." },
      ],
    },
    {
      name: "Durable State vs Ephemeral Context",
      slug: "durable-state-vs-ephemeral-context",
      whatItIs:
        "A fundamental distinction between two kinds of memory in agent systems. Durable state (the context graph) persists across context compactions, session restarts, and model changes — it is the permanent record. Ephemeral context (the token window) exists only for the current turn and is rebuilt each time from durable state by the context compiler. The context graph is the system of truth; the token window is a temporary view optimized for the current turn's needs.",
      whyItMatters:
        "Confusing durable and ephemeral state causes two failure categories. (1) Treating ephemeral as durable: the agent relies on information in the token window that disappears after compaction, losing critical state. (2) Treating durable as ephemeral: the agent re-queries the graph for information that is already in its context window, wasting tokens and latency. The distinction clarifies where each piece of information should live and how it should be managed.",
      howProjectUsesIt:
        "The SQLite database and JSONL files provide durable state — events, sessions, alerts, and snapshots persist indefinitely. The SSE stream and browser dashboard provide ephemeral views — they show current state assembled from durable storage. The dual-write architecture ensures that no event exists only in ephemeral context; everything is durably stored before being broadcast. Session handoffs work because the graph retains the previous session's state even after the model's context window is cleared.",
      keyTerms: [
        { term: "Context graph", definition: "The persistent, queryable store of all agent state — events, sessions, receipts, alerts, relationships. Survives compaction, restarts, and model changes." },
        { term: "Token window", definition: "The ephemeral context assembled for each model turn. Rebuilt from durable state by the context compiler. Exists only for the duration of one inference call." },
        { term: "Compaction survival", definition: "The property of information that persists even when the model's context window is compressed to free tokens. Only durable state survives compaction; ephemeral context is lost." },
        { term: "Context compiler bridge", definition: "The mechanism that reads from durable state and assembles ephemeral context, bridging the gap between persistent storage and the model's temporary input." },
      ],
    },
    {
      name: "The Agent Loop",
      slug: "the-agent-loop",
      whatItIs:
        "The fundamental execution cycle of an agentic system: gather context from the graph -> compile it into a token window -> send to the model for reasoning -> receive the response -> execute tool calls -> observe results -> verify output against acceptance criteria -> write validated results back to the graph -> repeat. This loop is the heartbeat of every agent system. The harness orchestrates the loop; the model participates in the reasoning step; the graph provides and receives state.",
      whyItMatters:
        "Without a well-defined loop, agents operate as stateless chatbots — they respond to individual prompts but cannot pursue multi-step goals, recover from errors, or verify their own work. The agent loop provides the structure for goal-directed behavior: each iteration brings the agent closer to its objective (or reveals that the objective cannot be met with the current approach). The verification step is critical — it is what distinguishes a reliable agent loop from an uncontrolled generation loop.",
      howProjectUsesIt:
        "Claude Code implements the agent loop through the hook system: session-start initializes context, pre-tool-use validates before execution, post-tool-use observes results, tool-error handles failures, context-compact manages token budget, and session-end finalizes state. The dashboard provides real-time visibility into the loop's execution through SSE-pushed events. Each iteration of the loop generates events that are triple-written (JSONL + SQLite + SSE), building the context graph that informs future iterations.",
      keyTerms: [
        { term: "Gather-reason-execute-verify", definition: "The four-phase cycle of the agent loop: gather context, reason about the next action, execute it, and verify the result before proceeding." },
        { term: "Tool execution", definition: "The step where the agent's chosen action is carried out by the harness — calling an API, running a command, reading a file. The harness, not the model, performs the execution." },
        { term: "Observation", definition: "The step where tool execution results are captured and made available to the model for reasoning about the next action. Observations feed the next iteration of the loop." },
        { term: "Stop condition", definition: "The criteria for terminating the loop — objective achieved, maximum iterations reached, unrecoverable error, or human interruption. Without stop conditions, the loop runs indefinitely." },
      ],
    },
    {
      name: "KV-Cache Discipline",
      slug: "kv-cache-discipline",
      whatItIs:
        "KV-cache (key-value cache) stores the computed attention patterns for previously processed tokens, enabling incremental processing of new tokens without recomputing attention for the entire context. When the prefix of the context (system prompt, instructions, history) remains stable between turns, the KV-cache from the previous turn can be reused, making the next turn fast and cheap. When the prefix changes (tool definitions modified, context reordered, history rewritten), the entire KV-cache is invalidated and must be recomputed — making the turn slow and expensive. KV-cache discipline means designing context assembly to maximize prefix stability.",
      whyItMatters:
        "The Manus team identified KV-cache hit rate as a first-class performance metric. In their production agent system, cache-friendly context assembly reduced latency by 3-5x and cost by 2-3x compared to naive assembly that changed prefixes on every turn. For long-running agent sessions with many turns, the cumulative effect is enormous. KV-cache discipline transforms context engineering from a quality concern (better context = better reasoning) into a performance and cost concern (stable prefixes = faster, cheaper turns).",
      howProjectUsesIt:
        "The dashboard's system prompt and MCP tool definitions are designed as stable prefixes that do not change between turns. The event stream is appended (not rewritten) to maintain prefix stability. Tool masking (keeping schema visible but gating invocation by phase) preserves the tool definition prefix across phase transitions — changing which tools are callable without changing the tool list that forms part of the cached prefix.",
      keyTerms: [
        { term: "KV-cache", definition: "The stored attention key-value pairs from previously processed tokens. Reusing the cache avoids recomputing attention for the entire context on each new turn." },
        { term: "Prefix stability", definition: "The property of keeping the beginning of the context window unchanged between turns, enabling KV-cache reuse. Stable prefix = fast/cheap. Changed prefix = slow/expensive." },
        { term: "Cache invalidation", definition: "When the context prefix changes, the stored KV-cache becomes invalid and must be recomputed from scratch. This is the expensive operation that KV-cache discipline seeks to minimize." },
        { term: "Tool masking vs removal", definition: "Keeping tool schemas in the context (preserving the prefix) but gating invocation by state, rather than removing tools from the list (invalidating the cache). A key technique for maintaining KV-cache hits across phase transitions." },
      ],
    },
    {
      name: "Recitation Pattern",
      slug: "recitation-pattern",
      whatItIs:
        "A context placement technique where the current objective, active plan, and key constraints are explicitly repeated near the END of the context window, where transformer models pay the most attention. This counteracts the 'lost in the middle' effect — even if the original objective was stated early in a long context and has drifted into the low-attention middle zone, the recitation near the end ensures the model is focused on the right goal. Pioneered by the Manus team in their production agent system.",
      whyItMatters:
        "In long-running agent sessions, the original objective is often stated in the first few messages and then buried under hundreds of tool calls, results, and intermediate reasoning. Without recitation, the model gradually drifts from its objective — it starts optimizing for local tool success rather than global goal achievement. Recitation is a simple, zero-cost technique that dramatically improves goal adherence in long sessions. It works because transformers attend strongly to tokens near the end of the input.",
      howProjectUsesIt:
        "The context compiler pipeline includes a recitation step after budget allocation. The current objective and active plan are injected near the end of the assembled context, after the event history but before the model's response position. The dashboard's session view tracks objective drift by comparing the stated objective with the topics of recent tool calls. The hook system's context-compact event provides a natural recitation point — when context is compacted, the objective is re-stated to maintain focus.",
      keyTerms: [
        { term: "Recitation", definition: "The explicit repetition of objectives and key constraints near the end of the context window to ensure the model attends to them during reasoning." },
        { term: "Attention drift", definition: "The phenomenon where models gradually lose focus on the original objective as the context fills with intermediate results and tool outputs." },
        { term: "End-of-context placement", definition: "Positioning critical information near the end of the token window, where transformer attention is strongest. Complements beginning-of-context placement (system prompt) for maximum attention coverage." },
        { term: "Goal adherence", definition: "The degree to which an agent's actions remain aligned with its stated objective across many turns. Recitation improves goal adherence in long sessions." },
      ],
    },
    {
      name: "Typed Handoffs",
      slug: "typed-handoffs",
      whatItIs:
        "A formal protocol for transferring work between agents where every transition follows a typed state machine: Created (task defined with acceptance criteria) -> Claimed (agent takes ownership with a time-limited lease) -> Completed (agent submits receipt with linked evidence) -> Verified (independent verifier confirms evidence meets criteria) -> Promoted (verified work enters shared context graph). Each state has preconditions, postconditions, and timeout behavior. The protocol makes the distinction between 'done' (a claim) and 'verified' (a fact) explicit and enforceable.",
      whyItMatters:
        "Without typed handoffs, multi-agent systems fail through miscommunication — the same failure mode that causes the majority of errors in human organizations. Agent A says 'done' but means 'code written.' Agent B interprets 'done' as 'tests passing.' Agent C builds on Agent B's interpretation, creating a cascade of false assumptions. Typed handoffs eliminate this ambiguity by defining exactly what each state means, what evidence is required for each transition, and what happens when transitions fail.",
      howProjectUsesIt:
        "The receipt system in the event store implements the Completed -> Verified -> Promoted flow. Tool completion events (type 'tool_complete') serve as receipts linked to their initiating events (type 'tool_use'). The alert acknowledgment system implements the promotion gate — alerts require explicit acknowledgment before being considered resolved. Session handoffs preserve context state across session boundaries, enabling the next session to pick up where the previous one left off.",
      keyTerms: [
        { term: "Lease-based claiming", definition: "Temporary, time-limited ownership of a task. The lease prevents duplicate work and automatically expires if the agent fails, enabling reassignment." },
        { term: "Receipt with evidence", definition: "A structured record of completed work that includes linked evidence (test results, file hashes, health checks) supporting the completion claim." },
        { term: "Promotion gate", definition: "The verification checkpoint that work must pass through before entering shared state. Only evidence-backed, independently verified work is promoted." },
        { term: "State machine transitions", definition: "The formal state changes a task undergoes (Created -> Claimed -> Completed -> Verified -> Promoted), each with preconditions and postconditions." },
      ],
    },
    {
      name: "Swarm Mechanics Layering",
      slug: "swarm-mechanics-layering",
      whatItIs:
        "The principle that multi-agent coordination is built as a layer on top of single-agent primitives, not as a separate system. Layer 1 (single-agent) provides the five context engineering primitives: Ontology, Context Graph, Skill Graph, Context Compiler, Verification Loop. Layer 2 (coordination overlay) adds: typed handoffs, role-scoped tools, shared memory topology, and promotion gates. Each agent in the swarm runs its own Layer 1 loop; the swarm coordinates through Layer 2 mechanisms operating on the shared context graph.",
      whyItMatters:
        "Building multi-agent systems from scratch is enormously complex. But if each agent is already reliable (Layer 1), adding coordination (Layer 2) becomes manageable. The layering principle means you debug single-agent behavior first (context compilation, verification, tool execution) and then add coordination concerns (handoffs, leases, promotion) on top of a stable foundation. This is the same principle that makes TCP/IP work: each layer handles its own concerns independently.",
      howProjectUsesIt:
        "The dashboard serves as the shared context graph for the agent swarm. Each Claude Code session (single agent) runs its own agent loop with hooks, tool execution, and context management (Layer 1). The swarm coordinates through the shared event store: agents read each other's events, sessions reference shared projects, and alerts surface cross-session issues (Layer 2). The one-person-company setup defines 8 agent roles with role-scoped tools, implementing the coordination overlay on top of individual Claude Code sessions.",
      keyTerms: [
        { term: "Layer 1 (single-agent)", definition: "The five context engineering primitives that make one agent reliable: Ontology, Context Graph, Skill Graph, Context Compiler, Verification Loop." },
        { term: "Layer 2 (coordination overlay)", definition: "The additional mechanisms that enable multi-agent coordination: typed handoffs, role-scoped tools, shared memory topology, promotion gates." },
        { term: "Shared memory topology", definition: "The architectural pattern where multiple agents read from and write to the same context graph, coordinating through shared state rather than explicit message passing." },
        { term: "Role-scoped tools", definition: "Different agent roles (planner, worker, verifier) have access to different subsets of tools, enforcing separation of concerns across the swarm." },
      ],
    },
    {
      name: "Garbage Collection for Agents",
      slug: "garbage-collection-for-agents",
      whatItIs:
        "The practice of actively cleaning stale, outdated, or irrelevant context from the agent's working memory. Just as programming language runtimes reclaim unused memory through garbage collection, agent systems must reclaim unused context tokens. This includes: dropping completed task details once verified, compacting verbose tool outputs into summaries, expiring old events from the rolling buffer, and consolidating daily snapshots. OpenAI's engineering team considers context garbage collection 'more important than brilliance' for production agent reliability.",
      whyItMatters:
        "Without garbage collection, the context window fills with stale information: completed tasks that no longer need detailed tracking, verbose error logs from resolved issues, intermediate reasoning steps that led to dead ends. This stale context crowds out fresh, relevant information and triggers the 'lost in the middle' attention degradation. Worse, stale information can actively mislead the model — outdated error messages cause it to try already-tried fixes, completed task details cause it to re-do work.",
      howProjectUsesIt:
        "The 500-event rolling buffer automatically drops the oldest events when new ones arrive — the simplest form of garbage collection. Daily snapshot compaction compresses detailed event streams into aggregate summaries, freeing token budget for current events. The session finalization process marks ended sessions so their detailed event history is deprioritized in context assembly. The JSONL backup retains everything for forensic analysis, but the active context (SQLite queries, SSE broadcasts) operates on garbage-collected subsets.",
      keyTerms: [
        { term: "Rolling buffer", definition: "A fixed-size event store that automatically drops the oldest entries when new ones arrive, preventing unbounded growth of active context." },
        { term: "Snapshot compaction", definition: "Compressing detailed event streams into aggregate summaries that preserve essential metrics in fewer tokens. The agent equivalent of data warehouse rollups." },
        { term: "Stale context", definition: "Information in the working memory that is no longer relevant to the current task — completed tasks, resolved errors, outdated state. Stale context wastes tokens and can mislead the model." },
        { term: "Forensic retention", definition: "Keeping full historical data in a separate store (JSONL files) for debugging and auditing, while the active context operates on a garbage-collected subset." },
      ],
    },
  ],
  videoResources: [
    {
      title: "Building effective agents",
      url: "https://youtube.com/watch?v=T-D1OfcDW1M",
      channel: "Anthropic",
      durationMinutes: 45,
      relevance:
        "Canonical reference for agent patterns and harness engineering. Covers the agent loop, tool execution, context management, and verification — the foundational concepts implemented in this project. Essential viewing for understanding why the harness is the agent.",
    },
    {
      title: "What is an AI Agent?",
      url: "https://youtube.com/watch?v=F8NKVhkZZWI",
      channel: "IBM Technology",
      durationMinutes: 10,
      relevance:
        "Accessible introduction to agent concepts for team members new to the field. Covers the distinction between chatbots and agents, the role of tools and memory, and why autonomous action requires verification. Good foundation before diving into context engineering specifics.",
    },
    {
      title: "Prompt Engineering vs Context Engineering",
      url: "https://youtube.com/watch?v=z5VvfYqkaKg",
      channel: "AI Jason",
      durationMinutes: 20,
      relevance:
        "Explains the evolution from single-turn prompt engineering to multi-turn context engineering. Covers why prompts alone are insufficient for agents, how context windows work, and why systematic context management (the compiler pattern) emerged as the next discipline.",
    },
    {
      title: "Swarm: Multi-Agent Orchestration",
      url: "https://youtube.com/watch?v=0sMj3FpFn-0",
      channel: "OpenAI",
      durationMinutes: 30,
      relevance:
        "OpenAI's approach to multi-agent coordination patterns. Covers typed handoffs between agents, role-based specialization, shared state management, and the coordination overhead tradeoffs. Directly relevant to the swarm mechanics layering concept and the typed handoff schema.",
    },
    {
      title: "RAG is Dead, Long Live Context Engineering",
      url: "https://youtube.com/watch?v=YXWbfQdKbQ0",
      channel: "Weaviate",
      durationMinutes: 25,
      relevance:
        "Explains why RAG (Retrieval-Augmented Generation) evolved into context engineering as agent systems demanded more than similarity-based retrieval. Covers the limitations of vector search for dynamic runtime state and why graph-based context management with compilation pipelines replaced naive RAG for agentic workloads.",
    },
  ],
  realWorldExamples: [
    {
      company: "Anthropic",
      product: "Claude Code",
      description:
        "The canonical single-agent harness implementation. Claude Code manages context through CLAUDE.md files (durable instructions), context compaction (garbage collection), tool execution with hooks (middleware pattern), and session management. It demonstrates that a well-engineered harness makes a model significantly more capable than the same model with raw API access.",
      conceptConnection:
        "Implements harness engineering, context compaction (garbage collection), the agent loop (gather-reason-execute-verify), and CLAUDE.md as a lightweight ontology. The hook system exemplifies the middleware pattern. Session management demonstrates durable vs ephemeral state.",
    },
    {
      company: "OpenAI",
      product: "Codex CLI",
      description:
        "An open-source coding agent that uses AGENTS.md files to map project structure, docs/ directories as the system of record, and lint enforcement as a verification mechanism. Demonstrates that documentation-driven context engineering (using structured markdown files to inform agent behavior) is a practical alternative to database-backed context graphs for code-focused workflows.",
      conceptConnection:
        "AGENTS.md implements a lightweight ontology (shared vocabulary for the codebase). docs/ as system of record demonstrates durable state. Lint enforcement is a form of automated verification (Level 2: does the code conform to style rules?). The file-based approach shows that context engineering principles apply even without databases.",
    },
    {
      company: "Manus",
      product: "Manus AI Agent",
      description:
        "A production agent system that pioneered several context engineering techniques: KV-cache optimization (treating prefix stability as a first-class metric), filesystem-based memory (using files as durable external state), tool masking (keeping schemas visible but gating invocation by phase), and the recitation pattern (repeating objectives near the end of context to fight attention drift).",
      conceptConnection:
        "KV-cache discipline, the recitation pattern, tool masking (mask not remove), and filesystem memory (an alternative context graph implementation). Manus demonstrated that context engineering is a performance concern (cache hits, latency, cost) in addition to a quality concern (reasoning accuracy).",
    },
    {
      company: "Cursor",
      product: "Cursor IDE",
      description:
        "An AI-powered code editor that implements plan mode (explicit PLAN phase before code generation), rules vs skills distinction (configuration vs capability), and harness-mediated execution (the IDE controls what the model can see and do). Demonstrates context engineering principles in a consumer product where the user is the verification loop.",
      conceptConnection:
        "Plan mode exemplifies phase gating (PLAN before ACT). Rules (user configuration) and skills (IDE capabilities) map to the ontology and skill graph respectively. The IDE itself is the harness — it mediates between the model and the codebase, controlling context assembly and tool availability.",
    },
    {
      company: "Palantir",
      product: "Foundry Ontology",
      description:
        "An enterprise data platform that pioneered the ontology-first approach to data management. Object types (what exists), link types (how things relate), and action types (what can be done) form the foundational schema. Governance ensures data quality through automated checks and human review. The Ontology SDK makes the schema programmatically accessible.",
      conceptConnection:
        "The direct inspiration for the ontology primitive. Palantir's object/link/action types map to context engineering's node types, edge types, and skill contracts. Their governance model (automated checks + human review) maps to the verification loop. The Ontology SDK's programmatic access maps to the context graph's query API.",
    },
    {
      company: "Cognition AI",
      product: "Devin",
      description:
        "A fully autonomous coding agent with a persistent workspace, long-running sessions, and end-to-end task completion. Devin demonstrates the full agent loop at scale: planning, coding, testing, debugging, and deploying — all within a harness that manages context, tools, and verification across sessions that can run for hours.",
      conceptConnection:
        "The complete harness engineering pattern: persistent workspace (durable state), long-running sessions (context compilation and garbage collection), autonomous tool execution (skill graph), and end-to-end verification (testing before claiming completion). Devin shows what a mature harness looks like when all context engineering primitives are implemented.",
    },
  ],
};