import type { Project } from "../types";

export const agenthire: Project = {
  id: "agenthire",
  name: "AgentHire",
  description:
    "Multi-agent AI platform automating the job search lifecycle — 5 specialized agents, MCP servers, real-time SSE streaming, 100% local LLM inference with Ollama. Zero cloud API costs.",
  repo: "https://github.com/aptsalt/agenthire",
  languages: ["TypeScript", "SQL"],
  designPatterns: [
    {
      name: "Multi-Agent Orchestration Pattern",
      category: "architectural",
      whatItIs: "A coordination pattern where a central orchestrator dispatches tasks to multiple specialized agents and chains their outputs into a unified pipeline.",
      howProjectUsesIt: "AgentHire's orchestrator sequences 5 agents (Research, Resume, Cover Letter, Interview Prep, Application Tracker), feeding each agent's output as context to the next.",
    },
    {
      name: "Model Context Protocol (MCP) — tool-use abstraction",
      category: "architectural",
      whatItIs: "An open standard for connecting LLMs to external tools via a unified protocol, decoupling agent logic from tool implementation.",
      howProjectUsesIt: "MCP servers expose web scraping, file generation, and database tools that agents discover at startup and invoke during task execution without custom integration code.",
    },
    {
      name: "Event-Driven Architecture (SSE streaming)",
      category: "architectural",
      whatItIs: "An architecture where components communicate through asynchronous events rather than direct calls, enabling real-time data flow from producers to consumers.",
      howProjectUsesIt: "Agent-generated tokens are emitted as SSE events, streaming through the orchestrator and Next.js API routes to the browser for real-time output display.",
    },
    {
      name: "Monorepo Pattern (Turborepo workspaces)",
      category: "architectural",
      whatItIs: "A repository structure where multiple related packages coexist in a single repo with shared tooling, dependency management, and build orchestration.",
      howProjectUsesIt: "Turborepo manages @agenthire/shared, @agenthire/orchestrator, @agenthire/mcp-servers, and @agenthire/web as linked packages with cached incremental builds.",
    },
    {
      name: "Repository Pattern (Supabase data layer)",
      category: "architectural",
      whatItIs: "An abstraction layer that separates data access logic from business logic, providing a collection-like interface for querying and persisting domain objects.",
      howProjectUsesIt: "Supabase client calls are encapsulated behind repository functions, so agents and the frontend query applications and jobs through a clean data access interface.",
    },
    {
      name: "Pub/Sub Pattern (agent-to-agent communication)",
      category: "behavioral",
      whatItIs: "A messaging pattern where publishers emit events without knowing who consumes them, and subscribers receive events without knowing who produced them.",
      howProjectUsesIt: "Agents publish completion events that the orchestrator subscribes to, triggering the next agent in the pipeline without direct agent-to-agent coupling.",
    },
    {
      name: "Strategy Pattern (agent specialization)",
      category: "behavioral",
      whatItIs: "A behavioral pattern that defines a family of interchangeable algorithms, encapsulating each one so they can be selected at runtime.",
      howProjectUsesIt: "Each of the 5 agents implements the same AgentInterface but with a different strategy (system prompt, model, tools), and the orchestrator selects which agent to run based on the pipeline stage.",
    },
  ],
  keyTakeaways: [
    "Multi-agent systems work best when each agent has a clear, narrow specialization.",
    "MCP provides a standardized interface for LLM tool use — agents don't need custom integrations.",
    "SSE (Server-Sent Events) is simpler than WebSockets for one-way streaming (LLM tokens).",
    "Turborepo enables code sharing between frontend, backend, and agent packages without npm publishing.",
    "Supabase provides PostgreSQL + Auth + Real-time for rapid development.",
    "Local LLM inference with Ollama eliminates API costs entirely for development and personal use.",
  ],
  coreConcepts: [
    {
      name: "Multi-Agent Orchestration",
      slug: "multi-agent-orchestration",
      whatItIs: "A system where multiple specialized AI agents collaborate on complex tasks. Instead of one monolithic AI, the work is divided among agents with distinct roles (research, writing, analysis), coordinated by an orchestrator.",
      whyItMatters: "Single LLM calls struggle with complex multi-step tasks. Breaking work into specialized agents improves quality, allows different models per task, and makes the system more maintainable and testable.",
      howProjectUsesIt: "AgentHire uses 5 specialized agents (Research, Resume, Cover Letter, Interview Prep, Application Tracker) coordinated by an orchestrator that chains their outputs in sequence.",
      keyTerms: [
        { term: "Orchestrator", definition: "The coordinator that dispatches tasks to agents and chains their outputs" },
        { term: "Agent Pipeline", definition: "Sequential chain where each agent's output feeds the next agent's input" },
        { term: "Agent Specialization", definition: "Each agent has a narrow, well-defined role with specific prompts and tools" },
      ],
    },
    {
      name: "Model Context Protocol (MCP)",
      slug: "mcp",
      whatItIs: "An open standard created by Anthropic for connecting LLMs to external tools and data sources. MCP servers expose tools (functions) that LLM agents can discover and invoke, providing a standardized interface for tool use.",
      whyItMatters: "Without MCP, every agent-tool integration requires custom code. MCP standardizes tool discovery, invocation, and response handling so agents can use any MCP-compatible tool without custom integrations.",
      howProjectUsesIt: "AgentHire MCP servers provide web scraping, file generation, and job board access as standardized tools. Each agent discovers available tools at startup and decides when to use them during task execution.",
      keyTerms: [
        { term: "MCP Server", definition: "A process that exposes tools (functions) the LLM can call via the MCP protocol" },
        { term: "MCP Client", definition: "The agent-side component that discovers and invokes tools from MCP servers" },
        { term: "Tool Schema", definition: "JSON Schema definition of a tool's parameters and return types" },
      ],
    },
    {
      name: "SSE Streaming",
      slug: "sse-streaming",
      whatItIs: "Server-Sent Events (SSE) is a web standard for one-way server-to-client streaming over HTTP. Unlike WebSockets, SSE is unidirectional, simpler, and works through proxies and firewalls without special configuration.",
      whyItMatters: "LLM responses generate tokens one at a time. Without streaming, users stare at a blank screen until the entire response is ready. SSE delivers tokens as they're generated for real-time feedback.",
      howProjectUsesIt: "Agent outputs stream to the frontend via SSE as tokens are generated. Users see real-time progress as each agent works — research findings appear incrementally, resumes build paragraph by paragraph.",
      keyTerms: [
        { term: "SSE", definition: "Server-Sent Events — one-way streaming protocol from server to client" },
        { term: "EventSource", definition: "Browser API for consuming SSE streams" },
        { term: "Token Streaming", definition: "Sending individual LLM tokens as they're generated rather than waiting for completion" },
      ],
    },
    {
      name: "Agent Specialization",
      slug: "agent-specialization",
      whatItIs: "Designing AI agents with narrow, well-defined roles rather than general-purpose capabilities. Each agent has specific system prompts, tools, and output formats optimized for its particular task.",
      whyItMatters: "Specialized agents outperform general-purpose agents because focused prompts produce better results, smaller models can handle narrow tasks, and the system is easier to debug, test, and improve incrementally.",
      howProjectUsesIt: "Each of the 5 agents has a custom system prompt, specific MCP tools, and structured output format. The Research Agent uses web scraping tools, the Resume Agent uses document templates, etc.",
      keyTerms: [
        { term: "System Prompt", definition: "Instructions that define an agent's role, capabilities, and output format" },
        { term: "Tool Binding", definition: "Assigning specific tools to specific agents based on their role" },
        { term: "Output Schema", definition: "Structured format defining what each agent produces" },
      ],
    },
    {
      name: "Local LLM Inference",
      slug: "local-llm",
      whatItIs: "Running language models directly on local hardware (CPU/GPU) instead of calling cloud APIs. Tools like Ollama make it easy to download and run open-source models locally with an OpenAI-compatible API.",
      whyItMatters: "Cloud LLM APIs have per-token costs that add up quickly. Local inference eliminates API costs entirely, provides complete data privacy, and allows unlimited experimentation during development.",
      howProjectUsesIt: "All 5 agents run against Ollama-hosted models locally. Zero API costs for development and personal use. The Ollama API is OpenAI-compatible, so switching to cloud providers requires only changing the base URL.",
      keyTerms: [
        { term: "Ollama", definition: "Tool for running open-source LLMs locally with an OpenAI-compatible API" },
        { term: "Quantization", definition: "Reducing model precision (e.g., 4-bit) to fit larger models in limited VRAM" },
        { term: "GGUF", definition: "File format for quantized LLM models optimized for CPU/GPU inference" },
      ],
    },
  ],
  videoResources: [
    {
      title: "Building AI Agents",
      url: "https://www.youtube.com/watch?v=sal78ACtGTc",
      channel: "Anthropic",
      durationMinutes: 35,
      relevance: "Official Anthropic guide to building multi-agent systems with tool use",
    },
    {
      title: "MCP Explained",
      url: "https://www.youtube.com/watch?v=kQmXtrmQ5Zg",
      channel: "Anthropic",
      durationMinutes: 15,
      relevance: "Model Context Protocol overview — the tool integration standard used in AgentHire",
    },
    {
      title: "Server-Sent Events Crash Course",
      url: "https://www.youtube.com/watch?v=4HlNv1qpZFY",
      channel: "Fireship",
      durationMinutes: 5,
      relevance: "Quick overview of SSE streaming used for real-time agent output",
    },
    {
      title: "Ollama - Run LLMs Locally",
      url: "https://www.youtube.com/watch?v=jGTnBR2HQQA",
      channel: "NetworkChuck",
      durationMinutes: 20,
      relevance: "Setting up local LLM inference with Ollama",
    },
  ],
  realWorldExamples: [
    {
      company: "Anthropic",
      product: "Claude Computer Use",
      description: "Claude can use computer tools (browser, terminal, file system) via MCP-style tool interfaces to complete complex multi-step tasks autonomously.",
      conceptConnection: "Same MCP-based tool use pattern with agent orchestration",
    },
    {
      company: "Microsoft",
      product: "AutoGen",
      description: "Microsoft's framework for building multi-agent systems where specialized agents collaborate through conversation to solve complex tasks.",
      conceptConnection: "Multi-agent orchestration with specialized roles",
    },
    {
      company: "LinkedIn",
      product: "LinkedIn Jobs",
      description: "LinkedIn's job matching system uses AI to analyze job descriptions and match candidates — the same research and matching pipeline AgentHire automates.",
      conceptConnection: "AI-powered job analysis and matching at scale",
    },
    {
      company: "Jasper",
      product: "Jasper AI",
      description: "Jasper uses specialized AI agents for different content types (blog posts, social media, emails) — similar agent specialization pattern.",
      conceptConnection: "Specialized AI agents for different content generation tasks",
    },
  ],
  cicd: {
    overview: "Turborepo monorepo with npm workspaces, TypeScript strict mode, and Supabase for database management.",
    stages: [
      {
        name: "Monorepo Build",
        tool: "Turborepo",
        description: "Manages build graph, only rebuilds changed packages",
        commands: ["turbo run build"],
      },
      {
        name: "Type Checking",
        tool: "TypeScript",
        description: "Strict mode across all packages with shared tsconfig",
        commands: ["turbo run typecheck"],
      },
      {
        name: "Testing",
        tool: "Vitest",
        description: "Unit tests + custom eval harness for agent quality",
        commands: ["turbo run test"],
      },
      {
        name: "Database",
        tool: "Supabase",
        description: "Schema migrations and database changes",
        commands: ["supabase db push"],
      },
    ],
    infrastructure: "npm workspaces link packages: @agenthire/shared, @agenthire/orchestrator, @agenthire/mcp-servers",
    diagram: `turbo run build
     |
     |-->  @agenthire/shared       (types, utils)
     |-->  @agenthire/orchestrator  (agent coordination)
     |-->  @agenthire/mcp-servers   (tool providers)
     +-->  @agenthire/web          (Next.js frontend)
            |
            v
       Supabase (PostgreSQL + Auth + Realtime)`,
  },
  architecture: [
    {
      title: "System Overview",
      content: `AgentHire is a multi-agent system where 5 specialized AI agents collaborate to automate job searching:

1. **Research Agent** — Analyzes job descriptions, identifies key requirements
2. **Resume Agent** — Tailors resumes to match job requirements
3. **Cover Letter Agent** — Generates personalized cover letters
4. **Interview Prep Agent** — Prepares interview questions and talking points
5. **Application Tracker Agent** — Manages application status and follow-ups

**Architecture:**
- Next.js web app (frontend)
- Orchestrator package (agent coordination)
- MCP servers (tool providers)
- Supabase (database, auth, real-time)
- Ollama (local LLM inference)`,
      diagram: `User --> [Next.js Web App] --> [Orchestrator]
                                |
                    +-----------+-----------+
                    v           v           v
              [Research]  [Resume]    [Cover Letter]
              [Agent]     [Agent]     [Agent]
                    |           |           |
                    +-------+---+-----------+
                            v
                    [MCP Servers]
                    |-- Web Scraper
                    |-- File Generator
                    +-- Job Board API
                            |
                            v
                    [Supabase]
                    +-- PostgreSQL + Auth + Realtime`,
    },
    {
      title: "Agent Orchestration",
      content: `The orchestrator coordinates agent interactions:

1. User submits a job URL or description
2. Orchestrator parses the request and dispatches to Research Agent
3. Research Agent analyzes the job, outputs structured requirements
4. Orchestrator chains to Resume Agent with research output
5. Each agent uses MCP servers for tool access (web scraping, file generation, etc.)
6. Results stream back to the UI via SSE

**Key Design Decisions:**
- Sequential pipeline (not parallel) — each agent needs the previous agent's output
- Streaming — tokens appear in real-time as agents generate
- Retry logic — if an agent fails, the orchestrator retries with adjusted parameters`,
    },
    {
      title: "MCP (Model Context Protocol)",
      content: `MCP is a standard protocol for LLM tool use, created by Anthropic:

1. **MCP Server** exposes "tools" — functions the LLM can call
2. **MCP Client** (the agent) discovers available tools and decides when to use them
3. **Transport:** stdio or HTTP/SSE

In AgentHire, MCP servers provide:
- Web scraping tools (fetch job descriptions)
- File generation tools (create PDF resumes)
- Database tools (save/retrieve applications)
- Calendar tools (schedule interview prep)

This decouples agent logic from tool implementation — agents don't know how tools work internally.`,
    },
  ],
  technologies: [
    {
      name: "Turborepo",
      category: "tool",
      icon: "TR",
      tagline: "High-performance monorepo build system",
      origin: {
        creator: "Jared Palmer (acquired by Vercel)",
        year: 2021,
        motivation:
          "Managing multiple related packages (frontend, backend, shared libraries) in separate repos creates dependency hell. Monorepos solve this but need smart build systems to avoid rebuilding everything on every change.",
      },
      whatItIs: `Turborepo is a build system for JavaScript/TypeScript monorepos. It provides:
- **Task graph** — understands dependencies between packages
- **Caching** — local and remote build caching (never rebuild unchanged code)
- **Parallel execution** — runs independent tasks simultaneously
- **Watch mode** — incremental rebuilds during development`,
      explainLikeImTen: `Imagine you have a giant LEGO project with multiple sections — a castle, a bridge, and a village. If you change just the bridge, you don't want to take apart and rebuild the entire castle and village too. Turborepo is like a smart helper who remembers what each section looks like. If nothing changed, it skips it. If you only changed the bridge, it only rebuilds the bridge. This saves a ton of time.`,
      realWorldAnalogy: `Turborepo is like a restaurant kitchen with multiple stations (grill, salad, dessert). A head chef (Turborepo) coordinates all the stations so they work in parallel and don't repeat work. If the salad recipe hasn't changed since the last order, the chef uses the already-prepped ingredients from the fridge (cache) instead of chopping everything from scratch.`,
      whyWeUsedIt: `AgentHire has multiple packages that share code:
- \`apps/web\` — Next.js frontend
- \`packages/orchestrator\` — agent coordination logic
- \`packages/mcp-servers\` — tool providers
- \`packages/shared\` — shared types and utilities
- \`packages/evals\` — agent quality evaluation
- \`packages/observability\` — logging and tracing

Turborepo ensures:
- Changes to \`shared\` trigger rebuilds of all dependents
- Changes to \`web\` only rebuild the web app
- Build cache means CI runs are fast after initial build`,
      howItWorksInProject: `- \`turbo.json\` defines the task pipeline (build → test → lint)
- \`package.json\` workspaces link all packages
- \`tsconfig.base.json\` shared TypeScript configuration
- \`turbo dev\` runs all packages in development mode
- \`turbo build\` builds in dependency order with caching`,
      featuresInProject: [
        {
          feature: "Monorepo workspace linking",
          description: "All packages (web, orchestrator, mcp-servers, shared, evals, observability) are linked via npm workspaces so they can import from each other without publishing to npm.",
        },
        {
          feature: "Incremental builds with caching",
          description: "When developing agents, changes to the orchestrator only rebuild downstream dependents. Unchanged packages like mcp-servers use cached outputs, cutting build time significantly.",
        },
        {
          feature: "Parallel dev mode",
          description: "Running `turbo dev` starts the Next.js frontend, orchestrator watcher, and MCP server dev processes simultaneously in one terminal command.",
        },
        {
          feature: "Shared TypeScript configuration",
          description: "A single tsconfig.base.json at the root provides strict TypeScript settings inherited by all packages, ensuring consistent type checking across the entire codebase.",
        },
        {
          feature: "Dependency-aware task pipeline",
          description: "turbo.json defines that `build` depends on `^build` (upstream packages), so shared types compile before the orchestrator, and the orchestrator compiles before the web app.",
        },
      ],
      coreConceptsMarkdown: `### Monorepo Structure

\`\`\`
agenthire/
  turbo.json          # pipeline definition
  package.json        # workspace root
  tsconfig.base.json  # shared TS config
  apps/
    web/              # Next.js frontend
  packages/
    shared/           # shared types, utils
    orchestrator/     # agent orchestration
    mcp-servers/      # MCP tool servers
    evals/            # evaluation harness
    observability/    # logging/tracing
\`\`\`

### turbo.json Pipeline

\`\`\`json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "test": {
      "dependsOn": ["build"]
    },
    "lint": {},
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
\`\`\`

\`"dependsOn": ["^build"]\` means: before building this package, build all packages it depends on.

### Caching

Turborepo hashes inputs (source files, environment variables, dependencies) to create a cache key. If the hash matches a previous build, the cached output is used instead of rebuilding.

Cache hits can be:
- **Local** — on the developer's machine
- **Remote** — shared across team members and CI (Vercel Remote Cache)`,
      prosAndCons: {
        pros: [
          "Dramatic build time reduction with caching",
          "Understands package dependency graph",
          "Parallel task execution",
          "Zero config for basic setups",
          "Remote caching for team/CI builds",
          "Works with npm, yarn, pnpm workspaces",
        ],
        cons: [
          "Learning curve for pipeline configuration",
          "Remote caching requires Vercel account (or self-hosted)",
          "Debugging cache misses can be frustrating",
          "Less flexible than Nx for non-JS tasks",
          "Workspace setup adds complexity to package.json",
        ],
      },
      alternatives: [
        {
          name: "Nx",
          comparison: "More feature-rich monorepo tool with code generators, dependency graph visualization, and plugins. More complex but more powerful. Works with non-JS projects too.",
        },
        {
          name: "Lerna",
          comparison: "Original JavaScript monorepo tool. Now maintained by Nx team. Good for package publishing but Turborepo/Nx are better for build orchestration.",
        },
        {
          name: "pnpm workspaces",
          comparison: "Package manager with built-in workspace support. Faster installs (hard links) but no build caching or task orchestration.",
        },
      ],
      keyAPIs: [
        "turbo.json — pipeline configuration",
        "turbo run <task> — run tasks across packages",
        "turbo dev — development mode",
        "turbo build — production build",
        "--filter=<package> — run for specific packages",
        "TURBO_TEAM / TURBO_TOKEN — remote caching",
      ],
      academicFoundations: `**Build System Theory:** Turborepo implements incremental build computation — only recompute outputs whose inputs have changed. This is the same principle behind Make (1976), but applied to JavaScript/TypeScript monorepos.

**DAG (Directed Acyclic Graph):** Package dependencies form a DAG. Turborepo performs topological sorting to determine build order and identifies independent tasks for parallel execution.

**Content-Addressable Storage:** Build caching uses content hashing (similar to Git's object model). Outputs are stored by the hash of their inputs, enabling cache sharing across different machines.`,
      furtherReading: [
        "Turborepo documentation — turbo.build/repo/docs",
        "Monorepos: A Beginner's Guide — monorepo.tools",
        "Why Google Stores Billions of Lines of Code in a Single Repository (2016)",
      ],
    },
    {
      name: "Supabase",
      category: "infrastructure",
      icon: "SB",
      tagline: "Open-source Firebase alternative",
      origin: {
        creator: "Paul Copplestone & Ant Wilson",
        year: 2020,
        motivation:
          "Firebase provided a great developer experience but was proprietary and locked users into Google's ecosystem. Supabase set out to replicate Firebase's DX using open-source tools (PostgreSQL, PostgREST, GoTrue).",
      },
      whatItIs: `Supabase is an open-source backend-as-a-service built on PostgreSQL:
- **Database** — PostgreSQL with a dashboard
- **Auth** — email, OAuth, magic links, SSO
- **Storage** — file storage with CDN
- **Real-time** — live database change subscriptions
- **Edge Functions** — Deno-based serverless functions
- **Vector** — pgvector for AI embeddings`,
      explainLikeImTen: `Imagine you're building an app and you need a place to store all your users' information, let them log in, and save their files. Instead of building all of that yourself (which would take months), Supabase gives you a ready-made toolbox. It's like getting a pre-built clubhouse with lockers (storage), a sign-in sheet (authentication), and a bulletin board that updates in real-time. You just plug it in and start using it.`,
      realWorldAnalogy: `Supabase is like renting a fully furnished office instead of building one from scratch. You get desks (database tables), a reception desk with ID badges (authentication), file cabinets (storage), and an intercom system that announces updates instantly (real-time subscriptions). You didn't build any of it, but you control everything inside.`,
      whyWeUsedIt: `AgentHire needs:
- User accounts for personalized agent workflows → Supabase Auth
- Store job applications, resumes, generated content → PostgreSQL
- Real-time updates when agents complete tasks → Supabase Realtime
- File storage for resume PDFs → Supabase Storage

Supabase provides all of this with a single SDK and excellent TypeScript support.`,
      howItWorksInProject: `- \`supabase/\` directory contains SQL migrations
- Auth handles user registration and login
- PostgreSQL stores applications, jobs, agent outputs
- Row Level Security (RLS) ensures users only see their own data
- Real-time subscriptions notify the UI when agents complete work
- Supabase client SDK used in Next.js for auth and data queries`,
      featuresInProject: [
        {
          feature: "User authentication and sessions",
          description: "Supabase Auth handles user sign-up, login, and session management. The Next.js frontend uses Supabase's auth helpers for server-side and client-side session checks.",
        },
        {
          feature: "Job application data storage",
          description: "PostgreSQL tables store job listings, user applications, generated resumes, cover letters, and interview prep materials. Complex queries join jobs with their application history.",
        },
        {
          feature: "Row Level Security (RLS)",
          description: "RLS policies ensure users can only read and write their own applications and generated content. This security is enforced at the database level, not in application code.",
        },
        {
          feature: "Real-time agent completion notifications",
          description: "When an agent finishes processing (e.g., resume generation complete), a database update triggers a real-time subscription that notifies the frontend instantly.",
        },
        {
          feature: "Resume PDF storage",
          description: "Generated resume PDFs are uploaded to Supabase Storage buckets. Users can download, share, or re-generate their resumes from the dashboard.",
        },
      ],
      coreConceptsMarkdown: `### Architecture

Supabase wraps several open-source tools:
- **PostgreSQL** — database
- **PostgREST** — auto-generates REST API from database schema
- **GoTrue** — JWT-based authentication
- **Realtime** — WebSocket server for live database changes
- **Kong** — API gateway
- **Storage** — S3-compatible object storage

### Row Level Security (RLS)

\`\`\`sql
-- Enable RLS on the table
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Users can only see their own applications
CREATE POLICY "Users can view own applications"
  ON applications FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only insert their own applications
CREATE POLICY "Users can insert own applications"
  ON applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);
\`\`\`

### TypeScript Client

\`\`\`typescript
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Auth
const { data, error } = await supabase.auth.signUp({
  email: "user@example.com",
  password: "password",
});

// Query
const { data: apps } = await supabase
  .from("applications")
  .select("*, job:jobs(*)")
  .eq("status", "applied")
  .order("created_at", { ascending: false });

// Real-time
supabase
  .channel("applications")
  .on("postgres_changes", { event: "UPDATE", schema: "public", table: "applications" }, (payload) => {
    console.log("Application updated:", payload.new);
  })
  .subscribe();
\`\`\``,
      prosAndCons: {
        pros: [
          "Full backend in minutes — auth, database, storage, real-time",
          "PostgreSQL under the hood — full SQL power, not a toy database",
          "Row Level Security — security at the database level",
          "Excellent TypeScript SDK with type generation",
          "Self-hostable — no vendor lock-in",
          "Generous free tier for development",
        ],
        cons: [
          "PostgREST API can be limiting for complex queries",
          "Real-time has scalability limits on the free tier",
          "Edge Functions use Deno (not Node.js)",
          "Dashboard can be slow for large databases",
          "Self-hosting requires managing multiple services",
          "RLS policies can become complex and hard to audit",
        ],
      },
      alternatives: [
        {
          name: "Firebase",
          comparison: "Google's BaaS. Better real-time capabilities and mobile SDKs. But NoSQL (Firestore), proprietary, and vendor-locked to Google Cloud.",
        },
        {
          name: "Appwrite",
          comparison: "Open-source BaaS with Docker-based self-hosting. Good developer experience but uses MariaDB internally (not PostgreSQL).",
        },
        {
          name: "Neon",
          comparison: "Serverless PostgreSQL. Better for pure database workloads (branching, auto-scaling). No auth, storage, or real-time built-in.",
        },
        {
          name: "PocketBase",
          comparison: "Single-binary BaaS in Go. Extremely simple to deploy but limited scalability and features compared to Supabase.",
        },
      ],
      keyAPIs: [
        "createClient() — initialize Supabase client",
        "supabase.auth.signUp/signIn — authentication",
        "supabase.from(table).select/insert/update — database CRUD",
        "supabase.channel().on() — real-time subscriptions",
        "supabase.storage.from(bucket) — file operations",
        "supabase gen types — TypeScript type generation",
      ],
      academicFoundations: `**Backend-as-a-Service (BaaS):** The BaaS model abstracts backend infrastructure into API calls. This is a continuation of the Platform-as-a-Service (PaaS) evolution in cloud computing (from IaaS → PaaS → BaaS → serverless).

**Row Level Security:** RLS implements the access control matrix model (Lampson, 1971). Each cell in the matrix defines whether a subject (user) can perform an action (read/write/delete) on an object (row). PostgreSQL RLS policies encode this matrix in SQL.

**Real-time Database:** Supabase Realtime uses PostgreSQL's logical replication (WAL decoding) to capture changes and broadcast them over WebSockets. This is based on the Change Data Capture (CDC) pattern — treating the database transaction log as an event stream.`,
      furtherReading: [
        "Supabase documentation — supabase.com/docs",
        "PostgreSQL Row Level Security — postgresql.org/docs/current/ddl-rowsecurity.html",
        "Supabase Architecture Blog",
      ],
    },
    {
      name: "SSE (Server-Sent Events)",
      category: "protocol",
      icon: "SE",
      tagline: "One-way real-time streaming over HTTP",
      origin: {
        creator: "Ian Hickson (WHATWG)",
        year: 2004,
        motivation:
          "Web applications needed real-time server-to-client updates. Before SSE, developers used polling or long-polling hacks. SSE provides a standardized, efficient protocol for server-to-client streaming over plain HTTP.",
      },
      whatItIs: `Server-Sent Events is a web standard for pushing updates from server to client over a single HTTP connection:
- **Unidirectional** — server to client only
- **Auto-reconnection** — browser automatically reconnects on disconnect
- **Event types** — named events for different data streams
- **Text-based** — simple text/event-stream format
- **Built on HTTP** — works through proxies, load balancers, CDNs`,
      explainLikeImTen: `Imagine you're watching a live sports scoreboard on a big screen. You don't have to keep asking "what's the score now?" every few seconds — the scoreboard just updates itself whenever something happens. SSE works the same way for websites. The server keeps a phone line open and sends new information to your browser whenever it has something to say. You just sit and watch the updates come in, like watching a live ticker tape.`,
      realWorldAnalogy: `SSE is like a radio broadcast. The radio station (server) transmits continuously, and your radio (browser) receives the signal. You can't talk back to the station through your radio — it's one-way communication. If your radio loses signal, it automatically tunes back in. This is different from a phone call (WebSocket), where both sides can talk, but a phone call is more complex to set up and maintain.`,
      whyWeUsedIt: `LLM token streaming is inherently server-to-client. SSE is simpler than WebSockets for this use case:
- Agents generate text tokens one at a time
- Tokens need to stream to the UI in real-time
- No client-to-server communication needed during generation
- SSE works through all HTTP infrastructure (proxies, CDNs)
- Built-in browser reconnection if the connection drops`,
      howItWorksInProject: `- Agent orchestrator emits tokens as SSE events
- Next.js API routes proxy SSE from the orchestrator to the browser
- EventSource API in the browser receives tokens
- Different event types for different agents (research, resume, cover-letter)
- Final event signals completion with structured output`,
      featuresInProject: [
        {
          feature: "Real-time LLM token streaming",
          description: "As each agent generates text token-by-token via Ollama, each token is emitted as an SSE event so users see text appearing in real-time, character by character.",
        },
        {
          feature: "Multi-agent event multiplexing",
          description: "Different SSE event types (agent-token, agent-complete, agent-error) distinguish which agent is producing output, allowing the UI to route tokens to the correct panel.",
        },
        {
          feature: "Agent completion signals",
          description: "A special `agent-complete` SSE event carries the final structured output from each agent, triggering the orchestrator to chain to the next agent in the pipeline.",
        },
        {
          feature: "API route SSE proxy",
          description: "Next.js API routes act as an SSE proxy between the orchestrator backend and the browser, handling authentication and connection management.",
        },
        {
          feature: "Auto-reconnection on network drops",
          description: "The browser's built-in EventSource API automatically reconnects if the SSE connection drops, ensuring users don't lose the stream during long agent processing runs.",
        },
      ],
      coreConceptsMarkdown: `### Protocol Format

\`\`\`
HTTP/1.1 200 OK
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive

data: First message

event: agent-token
data: {"agent": "research", "token": "The"}

event: agent-token
data: {"agent": "research", "token": " job"}

event: agent-complete
data: {"agent": "research", "output": {...}}
\`\`\`

### Client (Browser)

\`\`\`typescript
const source = new EventSource("/api/stream?jobId=123");

source.addEventListener("agent-token", (event) => {
  const { agent, token } = JSON.parse(event.data);
  appendToken(agent, token);
});

source.addEventListener("agent-complete", (event) => {
  const { agent, output } = JSON.parse(event.data);
  handleAgentComplete(agent, output);
});

source.onerror = () => {
  // Browser automatically reconnects
};
\`\`\`

### Server (Node.js)

\`\`\`typescript
app.get("/stream", (c) => {
  return streamSSE(c, async (stream) => {
    for await (const token of agent.generate(prompt)) {
      await stream.writeSSE({
        event: "agent-token",
        data: JSON.stringify({ token }),
      });
    }
    await stream.writeSSE({
      event: "done",
      data: JSON.stringify({ result: "complete" }),
    });
  });
});
\`\`\`

### SSE vs WebSocket vs Polling

| Feature | SSE | WebSocket | Polling |
|---------|-----|-----------|---------|
| Direction | Server → Client | Bidirectional | Client → Server |
| Protocol | HTTP | WS (upgrade from HTTP) | HTTP |
| Auto-reconnect | Yes (built-in) | No (manual) | N/A |
| Binary data | No (text only) | Yes | Yes |
| Proxy-friendly | Yes | Sometimes problematic | Yes |
| Complexity | Simple | Medium | Simple |
| Use case | Streaming, notifications | Chat, games, collaboration | Legacy systems |`,
      prosAndCons: {
        pros: [
          "Simple — just HTTP with a specific content type",
          "Auto-reconnection built into the browser API",
          "Works through proxies, CDNs, and load balancers",
          "No library needed — EventSource is a browser API",
          "Efficient for server-to-client streaming",
          "Named events for multiplexing different data types",
        ],
        cons: [
          "Unidirectional only — can't send data from client to server",
          "Text-only — no binary data (use WebSocket for that)",
          "Maximum 6 connections per domain in HTTP/1.1 (solved by HTTP/2)",
          "No built-in acknowledgment mechanism",
          "EventSource API is basic — no headers, no POST (need polyfill)",
        ],
      },
      alternatives: [
        {
          name: "WebSocket",
          comparison: "Bidirectional communication. More powerful but more complex — requires upgrade handshake, manual reconnection, and can have proxy issues.",
        },
        {
          name: "HTTP Long Polling",
          comparison: "Client makes a request, server holds it until data is available. Simple but inefficient — each response requires a new request.",
        },
        {
          name: "gRPC Streaming",
          comparison: "Binary streaming over HTTP/2. Excellent performance and type safety but requires protobuf schema and doesn't work in browsers without a proxy.",
        },
      ],
      keyAPIs: [
        "new EventSource(url) — open SSE connection",
        "source.onmessage — handle unnamed events",
        "source.addEventListener(type) — handle named events",
        "source.close() — close connection",
        "event.data — event payload",
        "event.lastEventId — for resuming after reconnect",
      ],
      academicFoundations: `**Push vs Pull Communication:** SSE implements the push model — the server decides when to send data. This contrasts with the pull model (polling) where the client requests data. Push is more efficient when the server has data at unpredictable intervals.

**HTTP Streaming:** SSE uses HTTP chunked transfer encoding (or HTTP/2 data frames) to send multiple messages over a single connection. This is based on the HTTP/1.1 persistent connection mechanism (RFC 2616).

**Event-Driven Architecture:** SSE implements the publish-subscribe pattern at the network level. The server publishes events, and the client subscribes to event types. This is the Observer pattern (GoF) applied to network communication.`,
      furtherReading: [
        "SSE specification — html.spec.whatwg.org/multipage/server-sent-events.html",
        "MDN EventSource documentation",
        "HTTP/2 and SSE — how HTTP/2 multiplexing improves SSE",
      ],
    },
    {
      name: "MCP (Model Context Protocol)",
      category: "protocol",
      icon: "MC",
      tagline: "Standardized LLM tool-use protocol",
      origin: {
        creator: "Anthropic",
        year: 2024,
        motivation:
          "Every AI application was building custom tool integrations. MCP standardizes how LLMs interact with external tools, similar to how HTTP standardized web communication.",
      },
      whatItIs: `MCP (Model Context Protocol) is an open protocol that standardizes how AI models interact with external tools and data sources:

- **MCP Server:** Exposes tools, resources, and prompts that LLMs can use
- **MCP Client:** Connects to MCP servers and makes tools available to the LLM
- **Transport:** stdio (local) or HTTP+SSE (remote)
- **Discovery:** Clients discover available tools by querying the server`,
      explainLikeImTen: `Imagine you have a super smart robot helper, but it can only talk — it can't use its hands. MCP is like giving the robot a universal remote control. The remote has buttons for different tools: one button scrapes a website, another creates a PDF, another saves things to a database. The robot just presses the right button and describes what it wants, and the tool does the work. The best part is that you can add new buttons anytime without reprogramming the robot.`,
      realWorldAnalogy: `MCP is like a universal power adapter for international travel. Without it, every country (tool/API) has a different plug shape, and you'd need a specific adapter for each one. MCP is the universal adapter — any AI model can plug into any tool using the same standard interface. Just like you don't need to rewire your laptop for each country, your AI agent doesn't need custom code for each tool.`,
      whyWeUsedIt: `AgentHire's agents need to interact with external systems:
- Scrape job postings from websites
- Generate PDF resumes
- Store data in the database
- Send emails
- Access calendar

MCP provides a standardized way to expose these capabilities:
- Agents don't need custom code for each tool
- New tools can be added without modifying agent logic
- Tools are self-describing (name, description, parameters)
- Same protocol works for local and remote tools`,
      howItWorksInProject: `- \`packages/mcp-servers/\` contains tool server implementations
- Each server exposes tools via the MCP protocol
- Orchestrator connects to MCP servers and provides tools to agents
- Agents use tool-calling (function calling) to invoke MCP tools
- Tool results are fed back into the agent's context`,
      featuresInProject: [
        {
          feature: "Job posting scraper tool",
          description: "An MCP server exposes a `scrape_job_posting` tool that fetches and parses job listings from URLs. The Research Agent calls this tool to extract structured job requirements.",
        },
        {
          feature: "PDF resume generation tool",
          description: "An MCP server provides a `generate_pdf` tool that the Resume Agent uses to convert tailored resume content into downloadable PDF files.",
        },
        {
          feature: "Database CRUD tools",
          description: "MCP tools expose save/retrieve operations for applications, letting agents store their outputs and read previous results without direct database access.",
        },
        {
          feature: "Dynamic tool discovery",
          description: "The orchestrator queries MCP servers at startup via `tools/list` to discover available tools, then provides them to agents as callable functions. New tools appear automatically.",
        },
        {
          feature: "Stdio transport for local execution",
          description: "MCP servers run as child processes communicating over stdio, keeping all tool execution local with zero network latency — matching the local-first philosophy of using Ollama.",
        },
      ],
      coreConceptsMarkdown: `### Protocol Flow

1. Client connects to MCP server (stdio or HTTP)
2. Client sends \`initialize\` — negotiates capabilities
3. Client sends \`tools/list\` — discovers available tools
4. Client receives tool definitions (name, description, input schema)
5. LLM decides to call a tool based on the conversation
6. Client sends \`tools/call\` with arguments
7. Server executes the tool and returns results
8. Results are added to the LLM's context

### Tool Definition

\`\`\`typescript
{
  name: "scrape_job_posting",
  description: "Fetch and parse a job posting from a URL",
  inputSchema: {
    type: "object",
    properties: {
      url: { type: "string", description: "URL of the job posting" },
    },
    required: ["url"],
  },
}
\`\`\`

### MCP Server Implementation

\`\`\`typescript
import { Server } from "@modelcontextprotocol/sdk/server";

const server = new Server({ name: "job-tools", version: "1.0.0" }, {
  capabilities: { tools: {} },
});

server.setRequestHandler("tools/list", async () => ({
  tools: [
    {
      name: "scrape_job",
      description: "Scrape a job posting",
      inputSchema: { type: "object", properties: { url: { type: "string" } } },
    },
  ],
}));

server.setRequestHandler("tools/call", async (request) => {
  if (request.params.name === "scrape_job") {
    const { url } = request.params.arguments;
    const jobData = await scrapeJobPosting(url);
    return { content: [{ type: "text", text: JSON.stringify(jobData) }] };
  }
});
\`\`\``,
      prosAndCons: {
        pros: [
          "Standardized protocol — no custom tool integrations",
          "Self-describing tools — LLMs understand what tools do",
          "Transport-agnostic — local (stdio) or remote (HTTP)",
          "Growing ecosystem — many pre-built MCP servers",
          "Composable — combine multiple MCP servers",
          "Open specification — not locked to one vendor",
        ],
        cons: [
          "New protocol — still evolving rapidly",
          "Limited adoption outside Anthropic's ecosystem",
          "Debugging MCP connections can be challenging",
          "Performance overhead for simple tool calls",
          "Security model is still being defined",
        ],
      },
      alternatives: [
        {
          name: "OpenAI Function Calling",
          comparison: "OpenAI's proprietary tool-use API. Well-supported but locked to OpenAI. MCP is model-agnostic.",
        },
        {
          name: "LangChain Tools",
          comparison: "Python-specific tool framework. Large library of pre-built tools but tightly coupled to LangChain's abstractions.",
        },
        {
          name: "Custom REST APIs",
          comparison: "Build your own tool APIs. Full control but no standardization — each tool needs custom integration code.",
        },
      ],
      keyAPIs: [
        "Server — create an MCP server",
        "Client — connect to MCP servers",
        "tools/list — discover available tools",
        "tools/call — invoke a tool",
        "resources/list — discover data sources",
        "prompts/list — discover prompt templates",
      ],
      academicFoundations: `**Tool-Augmented Language Models:** ReAct (Yao et al., 2022) and Toolformer (Schick et al., 2023) showed that LLMs can learn to use external tools by generating tool-call tokens. MCP standardizes the protocol for this tool use.

**Remote Procedure Call (RPC):** MCP is essentially an RPC protocol specialized for LLM tool use. It inherits concepts from Sun RPC (1984), CORBA (1991), and gRPC (2015) — interface definition, serialization, and transport abstraction.

**Service-Oriented Architecture (SOA):** MCP servers are microservices that expose capabilities via a standardized interface. This follows the SOA principle of loose coupling through well-defined interfaces.`,
      furtherReading: [
        "MCP specification — modelcontextprotocol.io",
        "Anthropic MCP documentation",
        "ReAct: Synergizing Reasoning and Acting in Language Models (Yao et al., 2022)",
      ],
    },
    {
      name: "Next.js",
      category: "framework",
      icon: "NX",
      tagline: "The React framework for production",
      origin: {
        creator: "Guillermo Rauch & Vercel",
        year: 2016,
        motivation:
          "React is a UI library, not a framework — it doesn't provide routing, server-side rendering, or build tooling out of the box. Next.js was created to give React developers a batteries-included framework with SSR, file-based routing, and optimized production builds.",
      },
      whatItIs: `Next.js is a full-stack React framework that provides:
- **App Router** — file-system based routing with layouts and nested routes
- **Server Components** — React components that render on the server (zero client JS)
- **Client Components** — interactive components that hydrate in the browser
- **API Routes** — backend endpoints colocated with frontend code
- **Server Actions** — RPC-style mutations from client to server
- **Static & Dynamic Rendering** — choose per-page or per-component
- **Image/Font/Script Optimization** — automatic performance optimizations
- **Middleware** — edge-level request interception`,
      explainLikeImTen: `Imagine you're building a website, and React gives you all the LEGO bricks to build cool interactive pages. But React doesn't tell you how to organize your rooms, how to move between pages, or how to make things load fast. Next.js is like the instruction manual and the building frame combined. It tells you "put the kitchen here, the bedroom there" (routing), makes some rooms load super fast because they're pre-built (server rendering), and handles the plumbing and electricity (API routes, optimization) so you can focus on decorating.`,
      realWorldAnalogy: `If React is a pile of high-quality building materials (lumber, nails, paint), Next.js is the general contractor who organizes everything. The contractor decides the floor plan (routing), builds the structural frame (server-side rendering), installs the wiring and plumbing (API routes), and makes sure the house passes inspection (performance optimization). You still choose the furniture and paint colors (your components), but the hard structural work is handled.`,
      whyWeUsedIt: `AgentHire needs a web frontend that:
- Renders the dashboard with application tracking UI
- Streams LLM tokens in real-time from agents
- Handles user authentication with Supabase
- Provides API endpoints to proxy requests to the orchestrator
- Optimizes performance for a data-heavy dashboard

Next.js App Router provides all of this:
- Server Components for fast initial page loads (dashboard, application lists)
- Client Components for interactive elements (streaming agent output, forms)
- API Routes to proxy SSE streams and handle auth callbacks
- Middleware for authentication checks on protected routes
- Built-in TypeScript support matching the monorepo's strict mode`,
      howItWorksInProject: `- \`apps/web/\` contains the Next.js application
- App Router organizes pages under \`app/\` directory
- Server Components render the dashboard layout and static content
- Client Components handle real-time streaming UI and form interactions
- API routes in \`app/api/\` proxy requests to the orchestrator and MCP servers
- Middleware checks authentication state before serving protected pages
- Supabase SSR helpers handle auth cookies and session management`,
      featuresInProject: [
        {
          feature: "Dashboard with server-rendered application list",
          description: "The main dashboard uses Server Components to fetch and render the user's job applications from Supabase on the server, sending fully rendered HTML for fast initial load.",
        },
        {
          feature: "Real-time agent streaming page",
          description: "A Client Component page uses EventSource to connect to an SSE API route, displaying live token-by-token output from the 5 specialized agents as they process a job.",
        },
        {
          feature: "SSE proxy API routes",
          description: "Next.js API routes in `app/api/stream/` proxy SSE connections from the browser to the orchestrator backend, adding authentication headers and handling connection lifecycle.",
        },
        {
          feature: "Authentication middleware",
          description: "Next.js middleware intercepts requests to protected routes (/dashboard, /applications) and redirects unauthenticated users to the login page using Supabase session checks.",
        },
        {
          feature: "File-based routing for multi-page app",
          description: "Routes like /dashboard, /applications/[id], /settings, and /auth/callback are all organized as directories under app/, with layouts providing shared navigation and structure.",
        },
      ],
      coreConceptsMarkdown: `### App Router Structure

\`\`\`
apps/web/
  app/
    layout.tsx              # Root layout (nav, providers)
    page.tsx                # Home page (Server Component)
    dashboard/
      layout.tsx            # Dashboard layout
      page.tsx              # Application list
    applications/
      [id]/
        page.tsx            # Application detail
    api/
      stream/
        route.ts            # SSE proxy endpoint
      auth/
        callback/
          route.ts          # Supabase auth callback
    auth/
      login/
        page.tsx            # Login page
  middleware.ts             # Auth middleware
\`\`\`

### Server vs Client Components

\`\`\`typescript
// Server Component (default) — runs on the server, zero client JS
// app/dashboard/page.tsx
export default async function DashboardPage() {
  const supabase = createServerClient();
  const { data: applications } = await supabase
    .from("applications")
    .select("*, job:jobs(*)");

  return (
    <div>
      <h1>Your Applications</h1>
      {applications?.map((app) => (
        <ApplicationCard key={app.id} application={app} />
      ))}
    </div>
  );
}
\`\`\`

\`\`\`typescript
// Client Component — interactive, runs in the browser
// components/agent-stream.tsx
"use client";

import { useState, useEffect } from "react";

export function AgentStream({ jobId }: { jobId: string }) {
  const [tokens, setTokens] = useState<string>("");

  useEffect(() => {
    const source = new EventSource(\`/api/stream?jobId=\${jobId}\`);
    source.addEventListener("agent-token", (e) => {
      const { token } = JSON.parse(e.data);
      setTokens((prev) => prev + token);
    });
    return () => source.close();
  }, [jobId]);

  return <div className="whitespace-pre-wrap">{tokens}</div>;
}
\`\`\`

### API Routes

\`\`\`typescript
// app/api/stream/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get("jobId");

  // Proxy SSE from orchestrator to browser
  const orchestratorStream = await fetch(
    \`\${ORCHESTRATOR_URL}/stream?jobId=\${jobId}\`,
    { headers: { Authorization: \`Bearer \${session.access_token}\` } }
  );

  return new Response(orchestratorStream.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
\`\`\`

### Middleware

\`\`\`typescript
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const supabase = createMiddlewareClient({ request });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}
\`\`\``,
      prosAndCons: {
        pros: [
          "Server Components reduce client-side JavaScript significantly",
          "File-based routing eliminates manual route configuration",
          "Built-in API routes — no separate backend server needed for proxying",
          "Excellent TypeScript support out of the box",
          "Automatic code splitting and lazy loading",
          "Vercel deployment is zero-config",
          "Middleware for edge-level logic (auth, redirects)",
        ],
        cons: [
          "App Router has a steep learning curve (Server vs Client Components)",
          "Server Component mental model is different from traditional React",
          "Vendor affinity toward Vercel for deployment and hosting",
          "Build times can be slow for large applications",
          "Frequent breaking changes between major versions",
          "Debugging server/client boundaries can be confusing",
        ],
      },
      alternatives: [
        {
          name: "Remix",
          comparison: "Full-stack React framework with a focus on web standards (loaders, actions, forms). Better progressive enhancement but smaller ecosystem. Less optimized for static content.",
        },
        {
          name: "Vite + React Router",
          comparison: "Lightweight alternative for SPAs. Faster dev server (Vite) but no SSR, no server components, no API routes out of the box. Good for simple apps.",
        },
        {
          name: "Astro",
          comparison: "Content-focused framework with island architecture. Ships zero JS by default. Better for content sites but lacks the full-stack capabilities needed for interactive agent dashboards.",
        },
        {
          name: "SvelteKit",
          comparison: "Svelte's full-stack framework. Simpler mental model (no virtual DOM), excellent performance. But different component syntax and smaller ecosystem than React/Next.js.",
        },
      ],
      keyAPIs: [
        "app/ directory — file-based routing",
        "'use client' directive — opt into Client Components",
        "generateMetadata() — dynamic page metadata",
        "loading.tsx / error.tsx — suspense and error boundaries",
        "route.ts — API route handlers (GET, POST, etc.)",
        "middleware.ts — request interception",
        "next/image — optimized image component",
        "next/link — client-side navigation",
        "cookies() / headers() — server-side request data",
      ],
      academicFoundations: `**Server-Side Rendering (SSR):** Next.js revived SSR for React — rendering HTML on the server before sending it to the client. This combines the interactivity of SPAs with the fast initial load and SEO benefits of server-rendered pages. The concept dates back to traditional web frameworks (PHP, Rails) but is applied to component-based UI.

**Hybrid Rendering:** Next.js's rendering model (static, dynamic, streaming) is based on the idea that different parts of a page have different freshness requirements. Static content can be pre-rendered at build time, while dynamic content must be rendered per-request. This is a practical application of caching theory — cache what you can, compute what you must.

**Islands Architecture (Partial Hydration):** Server Components implement a form of partial hydration — only interactive parts of the page ship JavaScript to the client. This reduces the total JS payload and improves Time to Interactive (TTI). The concept was formalized by Jason Miller (Preact creator) in 2020.`,
      furtherReading: [
        "Next.js documentation — nextjs.org/docs",
        "React Server Components RFC — github.com/reactjs/rfcs",
        "Patterns.dev — Server Components and rendering patterns",
        "Vercel Blog — Next.js App Router architecture",
      ],
    },
    {
      name: "React",
      category: "library",
      icon: "RE",
      tagline: "The library for building user interfaces",
      origin: {
        creator: "Jordan Walke at Facebook (Meta)",
        year: 2013,
        motivation:
          "Facebook needed a way to build complex, interactive UIs that could update efficiently when data changed. jQuery-style DOM manipulation didn't scale. React introduced a component model with a virtual DOM that made UI updates predictable and performant.",
      },
      whatItIs: `React is a JavaScript library for building user interfaces through composable components:
- **Components** — reusable, self-contained UI building blocks
- **JSX** — HTML-like syntax in JavaScript for describing UI
- **Virtual DOM** — efficient diffing algorithm for minimal DOM updates
- **Hooks** — functions for state, effects, context, and more in functional components
- **Unidirectional Data Flow** — data flows from parent to child via props
- **Declarative** — describe what the UI should look like, React handles how to update it`,
      explainLikeImTen: `Imagine building a web page is like building with LEGO blocks. Each block is a "component" — a button is one block, a navigation bar is another, a card showing a job application is another. You can reuse the same block design in different places. When something changes (like a new job application comes in), React is smart enough to only rebuild the blocks that actually changed, instead of tearing down the whole page and starting over. It's like having a magical LEGO table that rearranges only the pieces that need to move.`,
      realWorldAnalogy: `React is like a well-organized kitchen with labeled containers (components). Each container holds one recipe (a button, a form, a card). When you need a button somewhere, you grab the button container — you don't re-cook it from scratch each time. If the ingredients change (new data), the container automatically updates just that dish, not the entire menu. The head chef (React) keeps a checklist (virtual DOM) of what's on each table and only sends waiters to update the tables where something changed.`,
      whyWeUsedIt: `AgentHire's frontend needs:
- Complex interactive UI — streaming agent output, forms, dashboards
- Reusable components — application cards, agent panels, navigation
- Efficient updates — real-time token streaming means frequent DOM updates
- Rich ecosystem — Supabase SDK, UI libraries (shadcn/ui), state management
- TypeScript support — excellent type inference for props and hooks

React is the industry standard for building this type of application, and Next.js is built on top of it.`,
      howItWorksInProject: `- All UI in \`apps/web/\` is built with React functional components
- Hooks manage local state (useState), side effects (useEffect), and context
- Custom hooks abstract Supabase queries and SSE connections
- shadcn/ui provides pre-built accessible component primitives
- Props pass data from parent to child; context shares global state (auth, theme)
- Suspense boundaries handle loading states for async data`,
      featuresInProject: [
        {
          feature: "Agent streaming output panel",
          description: "A React component uses useState to accumulate streaming tokens and useEffect to manage the EventSource lifecycle, re-rendering efficiently as each new token arrives.",
        },
        {
          feature: "Application card components",
          description: "Reusable ApplicationCard components display job application status, company info, and agent outputs. They accept props for data and render consistently across dashboard views.",
        },
        {
          feature: "Custom hooks for Supabase data",
          description: "Custom React hooks like useApplications() and useJobDetails() encapsulate Supabase queries with loading/error states, providing clean data access patterns across components.",
        },
        {
          feature: "Auth context provider",
          description: "A React Context provider wraps the app to share authentication state (user session, login/logout functions) across all components without prop drilling.",
        },
        {
          feature: "Form components with controlled inputs",
          description: "Job submission forms use React controlled components (useState for input values, onChange handlers) with validation before dispatching to the agent orchestrator.",
        },
      ],
      coreConceptsMarkdown: `### Component Model

\`\`\`typescript
// Functional component with props
interface ApplicationCardProps {
  application: Application;
  onSelect: (id: string) => void;
}

export function ApplicationCard({ application, onSelect }: ApplicationCardProps) {
  return (
    <div
      className="rounded-lg border p-4 cursor-pointer hover:bg-accent"
      onClick={() => onSelect(application.id)}
    >
      <h3 className="font-semibold">{application.job.title}</h3>
      <p className="text-sm text-muted-foreground">{application.job.company}</p>
      <StatusBadge status={application.status} />
    </div>
  );
}
\`\`\`

### Hooks

\`\`\`typescript
// useState — local component state
const [tokens, setTokens] = useState<string>("");

// useEffect — side effects (SSE connection, subscriptions)
useEffect(() => {
  const source = new EventSource(url);
  source.onmessage = (e) => setTokens((prev) => prev + e.data);
  return () => source.close(); // cleanup on unmount
}, [url]);

// useContext — access shared state
const { user, signOut } = useAuth();

// Custom hook — reusable logic
function useApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      const { data } = await supabase.from("applications").select("*");
      setApplications(data ?? []);
      setLoading(false);
    };
    fetchApps();
  }, []);

  return { applications, loading };
}
\`\`\`

### Unidirectional Data Flow

\`\`\`
Parent Component
  |-- passes data via props -->  Child Component
  |                                |
  |<-- calls callback props --     |
  |                                |
  setState() triggers re-render    re-renders with new props
\`\`\`

Data flows down (props), events flow up (callbacks). This makes state changes predictable and debuggable.

### React + TypeScript

\`\`\`typescript
// Type-safe props
interface Props {
  title: string;
  count: number;
  onAction: (id: string) => Promise<void>;
  children: React.ReactNode;
}

// Type-safe hooks
const [user, setUser] = useState<User | null>(null);
const inputRef = useRef<HTMLInputElement>(null);
\`\`\``,
      prosAndCons: {
        pros: [
          "Massive ecosystem — libraries, tools, and community support",
          "Component model scales from small widgets to complex apps",
          "Hooks provide clean, composable state and effect management",
          "Excellent TypeScript integration with type inference",
          "Virtual DOM ensures efficient updates even with frequent re-renders",
          "One-way data flow makes state changes predictable",
        ],
        cons: [
          "JSX is a departure from standard HTML/JS separation",
          "useEffect can be tricky — dependency arrays, cleanup, stale closures",
          "No built-in state management for complex global state",
          "Re-render performance requires careful memoization (memo, useMemo, useCallback)",
          "Ecosystem fragmentation — too many ways to do the same thing",
          "React alone is not enough — needs a framework (Next.js) or build tool (Vite) for production",
        ],
      },
      alternatives: [
        {
          name: "Vue.js",
          comparison: "Similar component model but with a template syntax and built-in reactivity. Easier learning curve, smaller ecosystem. Composition API is similar to React Hooks.",
        },
        {
          name: "Svelte",
          comparison: "Compiles components to vanilla JS at build time — no virtual DOM, no runtime. Simpler syntax, better performance. Smaller ecosystem and community.",
        },
        {
          name: "Angular",
          comparison: "Full opinionated framework with dependency injection, RxJS, and TypeScript by default. More structure but more complex. Better for large enterprise teams.",
        },
        {
          name: "Solid.js",
          comparison: "Fine-grained reactivity without virtual DOM. React-like JSX syntax but fundamentally different rendering model. Excellent performance, tiny bundle size. Small but growing ecosystem.",
        },
      ],
      keyAPIs: [
        "useState — local state management",
        "useEffect — side effects and lifecycle",
        "useContext — access context values",
        "useRef — mutable refs and DOM access",
        "useMemo / useCallback — memoization for performance",
        "React.memo() — skip re-renders for unchanged props",
        "Suspense — declarative loading states",
        "createContext / Provider — dependency injection",
        "forwardRef — pass refs through components",
      ],
      academicFoundations: `**Declarative UI Programming:** React's declarative model is rooted in functional programming — the UI is a pure function of state: \`UI = f(state)\`. This is a shift from imperative DOM manipulation (jQuery) to describing what the UI should look like for a given state. This concept comes from functional reactive programming (FRP), formalized by Conal Elliott and Paul Hudak in 1997.

**Virtual DOM and Reconciliation:** React's virtual DOM implements a tree diffing algorithm. The general tree diff problem is O(n^3), but React's heuristic algorithm (same type = same tree, keys for lists) reduces it to O(n). This is based on edit distance algorithms (Levenshtein, 1966) adapted for tree structures.

**Component-Based Architecture:** React's component model follows the principles of modular programming (Parnas, 1972) — each component has a well-defined interface (props), encapsulated state, and can be composed with other components. This is the UI equivalent of structured programming.`,
      furtherReading: [
        "React documentation — react.dev",
        "Thinking in React — react.dev/learn/thinking-in-react",
        "A Complete Guide to useEffect — overreacted.io",
        "React as a UI Runtime — overreacted.io (Dan Abramov)",
      ],
    },
    {
      name: "Ollama",
      category: "ai-ml",
      icon: "OL",
      tagline: "Run large language models locally",
      origin: {
        creator: "Jeffrey Morgan & Ollama team",
        year: 2023,
        motivation:
          "Running LLMs required complex setup — downloading model weights, configuring GPU acceleration, managing dependencies. Ollama simplifies this to a single command, making local LLM inference as easy as running Docker containers.",
      },
      whatItIs: `Ollama is a tool for running large language models locally on your own hardware:
- **Model management** — pull, run, and manage models with simple CLI commands
- **REST API** — OpenAI-compatible HTTP API for chat completions and embeddings
- **GPU acceleration** — automatic CUDA/Metal/ROCm detection and optimization
- **Model library** — access to hundreds of open-source models (Llama, Mistral, Qwen, etc.)
- **Modelfile** — Dockerfile-like format for customizing models (system prompts, parameters)
- **Streaming** — token-by-token streaming via the API`,
      explainLikeImTen: `You know how ChatGPT runs on big computers in data centers far away, and you have to pay to use it? Ollama is like downloading a mini version of that brain right onto your own computer. It's like having your own private robot helper that lives on your desk instead of in a faraway building. It's not as big or powerful as the one in the data center, but it's yours, it's free, and it doesn't need the internet. You just tell it "use this brain" and it downloads it and starts talking.`,
      realWorldAnalogy: `Ollama is like a home espresso machine versus going to Starbucks. Starbucks (cloud AI APIs) makes great coffee and has every variety, but you pay per cup and have to go there. A home machine (Ollama) makes coffee right in your kitchen. You buy the beans once (download the model), and then every cup is free. The quality might be slightly different from Starbucks, but it's always available, there's no line, and nobody is logging what you order.`,
      whyWeUsedIt: `AgentHire's key differentiator is zero cloud API costs:
- 5 agents generating text means high token volume — cloud API costs add up fast
- Local inference with Ollama means unlimited generations at zero marginal cost
- Privacy — job applications and resumes contain sensitive personal data that stays local
- No rate limits — agents can generate as fast as the local GPU allows
- Model flexibility — swap models without changing API keys or vendor contracts
- Development speed — no waiting for API quota resets or dealing with outages`,
      howItWorksInProject: `- Ollama runs as a local server (default port 11434)
- The orchestrator calls Ollama's REST API for each agent's generation
- Each agent can use a different model optimized for its task
- Streaming responses feed into the SSE pipeline for real-time UI updates
- Modelfiles customize system prompts and temperature per agent
- RTX 4090 with 16GB VRAM handles the models used by all 5 agents`,
      featuresInProject: [
        {
          feature: "Multi-agent LLM inference",
          description: "All 5 agents (Research, Resume, Cover Letter, Interview Prep, Application Tracker) run their prompts through Ollama's local API, generating responses without any cloud API calls.",
        },
        {
          feature: "Streaming token generation",
          description: "Ollama's streaming API returns tokens one at a time. The orchestrator pipes these tokens into the SSE pipeline, enabling real-time text appearance in the browser.",
        },
        {
          feature: "Per-agent model configuration",
          description: "Each agent can use a different model via Ollama. The Research Agent might use a reasoning-focused model while the Resume Agent uses a writing-optimized model, all managed through Modelfiles.",
        },
        {
          feature: "Tool-calling / function-calling support",
          description: "Ollama supports tool-calling with compatible models, enabling agents to invoke MCP tools by generating structured tool-call JSON that the orchestrator executes.",
        },
        {
          feature: "Zero-cost development workflow",
          description: "Developers can iterate on agent prompts and logic without worrying about API costs. Unlimited local inference means rapid experimentation with different system prompts and model parameters.",
        },
      ],
      coreConceptsMarkdown: `### Running Models

\`\`\`bash
# Pull a model
ollama pull qwen2.5-coder:7b

# Run interactively
ollama run qwen2.5-coder:7b

# List installed models
ollama list
\`\`\`

### REST API (OpenAI-compatible)

\`\`\`typescript
// Chat completion
const response = await fetch("http://localhost:11434/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "qwen2.5-coder:7b",
    messages: [
      { role: "system", content: "You are a job research analyst." },
      { role: "user", content: "Analyze this job posting: ..." },
    ],
    stream: true,
  }),
});

// Stream tokens
const reader = response.body?.getReader();
const decoder = new TextDecoder();
while (true) {
  const { done, value } = await reader!.read();
  if (done) break;
  const chunk = JSON.parse(decoder.decode(value));
  process.stdout.write(chunk.message.content);
}
\`\`\`

### Modelfile (Custom Agent Configuration)

\`\`\`dockerfile
FROM qwen2.5-coder:7b

SYSTEM """
You are a Resume Agent for AgentHire. Your job is to tailor resumes
to match specific job requirements. You output structured JSON with
sections: summary, experience, skills, education.
"""

PARAMETER temperature 0.7
PARAMETER top_p 0.9
PARAMETER num_ctx 8192
\`\`\`

### Tool Calling

\`\`\`typescript
const response = await fetch("http://localhost:11434/api/chat", {
  method: "POST",
  body: JSON.stringify({
    model: "qwen2.5-coder:7b",
    messages: [{ role: "user", content: "Find jobs at Google" }],
    tools: [
      {
        type: "function",
        function: {
          name: "scrape_job_posting",
          description: "Fetch a job posting from a URL",
          parameters: {
            type: "object",
            properties: {
              url: { type: "string", description: "Job posting URL" },
            },
            required: ["url"],
          },
        },
      },
    ],
  }),
});
// Model responds with tool_calls if it decides to use a tool
\`\`\`

### Hardware Considerations

| Model Size | VRAM Required | Speed (tokens/sec) | Quality |
|-----------|---------------|---------------------|---------|
| 3B params | ~4 GB | 60-80 t/s | Basic tasks |
| 7B params | ~6 GB | 30-50 t/s | Good for most tasks |
| 14B params | ~10 GB | 15-25 t/s | High quality |
| 32B params | ~20 GB | 8-12 t/s | Near cloud quality |

AgentHire uses an RTX 4090 (16GB VRAM) — comfortably runs 7B-14B parameter models.`,
      prosAndCons: {
        pros: [
          "Zero API costs — unlimited inference after model download",
          "Privacy — data never leaves your machine",
          "No rate limits — generate as fast as your GPU allows",
          "OpenAI-compatible API — easy migration from cloud to local",
          "Simple CLI — pull and run models in seconds",
          "Model flexibility — swap models without code changes",
          "Offline capable — works without internet after initial download",
        ],
        cons: [
          "Requires capable hardware — GPU with sufficient VRAM",
          "Model quality gap — local models are generally behind frontier cloud models (GPT-4, Claude)",
          "Initial model download can be large (4-20 GB per model)",
          "Concurrent requests limited by hardware capacity",
          "No fine-tuning support — inference only",
          "Model updates require manual pulls",
        ],
      },
      alternatives: [
        {
          name: "OpenAI API",
          comparison: "State-of-the-art models (GPT-4) via cloud API. Higher quality but costs money per token, requires internet, and sends data to OpenAI's servers.",
        },
        {
          name: "llama.cpp",
          comparison: "The C++ inference engine that Ollama is built on. More control and performance tuning options but requires manual setup and compilation.",
        },
        {
          name: "vLLM",
          comparison: "High-throughput LLM serving engine. Better for multi-user serving scenarios with advanced batching. More complex setup, targeted at production deployments.",
        },
        {
          name: "LM Studio",
          comparison: "Desktop GUI for running local models. More user-friendly with a chat interface but less suited for programmatic access and automation compared to Ollama's API.",
        },
      ],
      keyAPIs: [
        "/api/chat — chat completion (streaming and non-streaming)",
        "/api/generate — text generation",
        "/api/embeddings — text embeddings for vector search",
        "/api/pull — download a model",
        "/api/list — list installed models",
        "/api/show — model information and parameters",
        "Modelfile — custom model configuration",
        "ollama run <model> — interactive CLI chat",
      ],
      academicFoundations: `**Large Language Models (LLMs):** Ollama runs transformer-based language models (Vaswani et al., "Attention Is All You Need", 2017). These models learn statistical patterns in text through self-supervised pre-training on massive datasets, enabling text generation, reasoning, and instruction following.

**Quantization:** Local inference relies on model quantization — reducing model weights from 16-bit floats to 4-bit or 8-bit integers. This trades minimal quality for dramatically reduced memory usage and faster inference. Techniques include GPTQ (Frantar et al., 2022) and GGUF quantization used by llama.cpp.

**KV-Cache and Attention Optimization:** During autoregressive generation, Ollama uses key-value caching to avoid recomputing attention for previous tokens. Flash Attention (Dao et al., 2022) further optimizes this by reducing memory I/O, enabling longer context windows on consumer GPUs.

**Inference vs Training:** Ollama is inference-only. Inference (forward pass) requires far less memory and compute than training (forward + backward pass + optimizer state). A model that requires 8 A100 GPUs to train can run inference on a single consumer GPU with quantization.`,
      furtherReading: [
        "Ollama documentation — ollama.com",
        "Ollama GitHub — github.com/ollama/ollama",
        "llama.cpp — the inference engine behind Ollama",
        "Attention Is All You Need (Vaswani et al., 2017)",
        "GGUF format specification — github.com/ggerganov/ggml",
      ],
    },
    {
      name: "TypeScript",
      category: "language",
      icon: "TS",
      tagline: "JavaScript with static types",
      origin: {
        creator: "Anders Hejlsberg at Microsoft",
        year: 2012,
        motivation:
          "JavaScript was designed for small browser scripts but was being used to build large applications. The lack of a type system made refactoring dangerous, bugs hard to catch, and IDE support limited. TypeScript adds optional static types that compile to plain JavaScript.",
      },
      whatItIs: `TypeScript is a typed superset of JavaScript that compiles to plain JavaScript:
- **Static Type System** — catch type errors at compile time, not runtime
- **Type Inference** — automatically infers types so you don't annotate everything
- **Interfaces & Type Aliases** — define shapes for objects, function signatures, and unions
- **Generics** — type-safe reusable functions and data structures
- **Enums & Literal Types** — constrain values to specific options
- **Strict Mode** — maximum type safety with \`"strict": true\`
- **Declaration Files (.d.ts)** — type definitions for JavaScript libraries`,
      explainLikeImTen: `Imagine you're writing a recipe, and you write "add 2 cups of flour." In regular JavaScript, nothing stops you from accidentally writing "add 2 cups of elephants" — the recipe looks fine until you try to cook it and everything goes wrong. TypeScript is like a spell checker for your recipe. Before you even start cooking (running the code), it reads your recipe and says "hey, elephants aren't an ingredient — did you mean flour?" It catches your mistakes early so your code works correctly when it actually runs.`,
      realWorldAnalogy: `TypeScript is like building with labeled LEGO bricks versus plain ones. With plain bricks (JavaScript), you can connect anything to anything — even pieces that don't fit well. You won't know there's a problem until the structure collapses. With labeled bricks (TypeScript), each brick says what it connects to: "I'm a 2x4 that connects to another 2x4." If you try to attach the wrong piece, the labels warn you immediately. Building takes slightly longer because you're reading labels, but the final structure is rock-solid.`,
      whyWeUsedIt: `AgentHire is a complex multi-package monorepo where type safety is critical:
- **Shared types across packages** — Agent interfaces, MCP tool schemas, Supabase types all need to be consistent across web, orchestrator, and mcp-servers packages
- **Refactoring safety** — changing an agent's output schema is caught everywhere it's used
- **IDE experience** — autocomplete, go-to-definition, and inline documentation across the entire monorepo
- **Runtime validation bridge** — TypeScript types + Zod schemas ensure data is correct at both compile time and runtime
- **API contracts** — function signatures serve as documentation for how packages communicate
- **Strict mode** — catches null/undefined errors that would otherwise crash agents mid-generation`,
      howItWorksInProject: `- \`tsconfig.base.json\` at the monorepo root defines strict shared settings
- Each package extends the base config with package-specific paths
- Shared types in \`packages/shared/\` define agent interfaces, tool schemas, and database types
- Supabase CLI generates database types from the schema
- All packages compile with \`"strict": true\` — no \`any\`, no implicit nulls
- Type-only imports keep compiled output clean`,
      featuresInProject: [
        {
          feature: "Shared agent interface types",
          description: "The `packages/shared` package exports TypeScript interfaces for agent inputs, outputs, and configuration. All 5 agents implement the same AgentInterface type, ensuring consistent behavior.",
        },
        {
          feature: "MCP tool schema types",
          description: "Tool definitions in mcp-servers are fully typed — input schemas, output types, and error types are defined in TypeScript and validated at compile time across the orchestrator and tool implementations.",
        },
        {
          feature: "Supabase type generation",
          description: "The Supabase CLI generates TypeScript types from the database schema. Queries in the frontend and backend are type-checked against actual database column types.",
        },
        {
          feature: "Strict null checking across agents",
          description: "With `strictNullChecks` enabled, every possible null/undefined value must be handled explicitly. This prevents agents from crashing due to missing data during multi-step processing pipelines.",
        },
        {
          feature: "Cross-package type safety",
          description: "When the orchestrator sends data to an agent, TypeScript verifies the data matches the expected input type. If the Research Agent's output shape changes, every consumer is flagged at compile time.",
        },
      ],
      coreConceptsMarkdown: `### Strict Mode Configuration

\`\`\`json
// tsconfig.base.json (monorepo root)
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
\`\`\`

\`"strict": true\` enables all strict checks:
- \`strictNullChecks\` — null and undefined are distinct types
- \`noImplicitAny\` — no implicit any types
- \`strictFunctionTypes\` — stricter function type checking
- \`strictPropertyInitialization\` — class properties must be initialized

### Shared Types (packages/shared)

\`\`\`typescript
// Agent interface — all 5 agents implement this
export interface AgentConfig {
  name: string;
  model: string;
  systemPrompt: string;
  temperature: number;
  tools: ToolDefinition[];
}

export interface AgentInput {
  jobDescription: string;
  userProfile: UserProfile;
  previousAgentOutputs: Record<string, AgentOutput>;
}

export interface AgentOutput {
  agentName: string;
  content: string;
  structuredData: Record<string, unknown>;
  tokensUsed: number;
  durationMs: number;
}

// MCP tool types
export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: JSONSchema;
}

export interface ToolResult {
  content: Array<{
    type: "text" | "image" | "resource";
    text?: string;
    data?: string;
  }>;
  isError?: boolean;
}

// Database types (generated by Supabase CLI)
export type Database = {
  public: {
    Tables: {
      applications: {
        Row: {
          id: string;
          user_id: string;
          job_id: string;
          status: ApplicationStatus;
          created_at: string;
        };
        Insert: Omit<Application, "id" | "created_at">;
        Update: Partial<Application>;
      };
      // ...
    };
  };
};
\`\`\`

### Generics in Practice

\`\`\`typescript
// Generic agent runner — works with any agent type
async function runAgent<TInput extends AgentInput, TOutput extends AgentOutput>(
  config: AgentConfig,
  input: TInput,
  onToken: (token: string) => void
): Promise<TOutput> {
  const stream = await ollama.chat({
    model: config.model,
    messages: buildMessages(config, input),
    stream: true,
  });

  let fullResponse = "";
  for await (const chunk of stream) {
    onToken(chunk.message.content);
    fullResponse += chunk.message.content;
  }

  return parseAgentOutput<TOutput>(fullResponse);
}
\`\`\`

### Discriminated Unions for Events

\`\`\`typescript
// SSE event types — each event has a different shape
type AgentEvent =
  | { type: "agent-token"; agent: string; token: string }
  | { type: "agent-complete"; agent: string; output: AgentOutput }
  | { type: "agent-error"; agent: string; error: string }
  | { type: "pipeline-complete"; results: Record<string, AgentOutput> };

// TypeScript narrows the type based on the discriminant
function handleEvent(event: AgentEvent) {
  switch (event.type) {
    case "agent-token":
      // TypeScript knows: event.token exists here
      appendToken(event.agent, event.token);
      break;
    case "agent-complete":
      // TypeScript knows: event.output exists here
      storeOutput(event.agent, event.output);
      break;
    case "agent-error":
      // TypeScript knows: event.error exists here
      logError(event.agent, event.error);
      break;
  }
}
\`\`\``,
      prosAndCons: {
        pros: [
          "Catches type errors at compile time — before code runs",
          "Excellent IDE support — autocomplete, refactoring, go-to-definition",
          "Type inference reduces annotation burden",
          "Makes refactoring large codebases safe",
          "Self-documenting — types serve as inline documentation",
          "Gradual adoption — can be added to existing JavaScript projects incrementally",
          "Industry standard for serious JavaScript/Node.js projects",
        ],
        cons: [
          "Compilation step adds to build time",
          "Learning curve for advanced types (generics, conditional types, mapped types)",
          "Type definitions for third-party libraries can be incomplete or incorrect",
          "Strict mode can feel verbose for simple scripts",
          "Build tooling complexity — tsconfig, declaration files, source maps",
          "Types are erased at runtime — no runtime type checking without additional tools (Zod)",
        ],
      },
      alternatives: [
        {
          name: "JavaScript (plain)",
          comparison: "No compilation step, simpler setup. But no type safety, worse IDE support, and refactoring is risky in large codebases.",
        },
        {
          name: "Flow",
          comparison: "Facebook's type checker for JavaScript. Similar concept but much smaller community and worse tooling. Largely abandoned in favor of TypeScript.",
        },
        {
          name: "JSDoc Types",
          comparison: "Type annotations in comments — no compilation step needed. Supported by TypeScript's language server. Good for libraries but awkward for large applications.",
        },
        {
          name: "ReScript",
          comparison: "ML-family language that compiles to JavaScript. Sound type system (no any escape hatch). Different syntax from JavaScript, smaller ecosystem.",
        },
      ],
      keyAPIs: [
        "interface / type — define object shapes and type aliases",
        "generics <T> — type-safe reusable abstractions",
        "union types (A | B) — values that can be multiple types",
        "intersection types (A & B) — combine multiple types",
        "keyof / typeof — type operators for keys and values",
        "as const — literal type inference for constants",
        "satisfies — validate type without widening",
        "Utility types: Partial, Required, Pick, Omit, Record",
        "tsconfig.json — compiler configuration",
      ],
      academicFoundations: `**Type Theory:** TypeScript's type system is based on structural subtyping (duck typing) — types are compatible if their shapes match, regardless of declared names. This contrasts with nominal typing (Java, C#) where types must be explicitly declared as compatible. Structural typing traces back to ML-family languages and Cardelli's work on type systems (1985).

**Gradual Typing:** TypeScript implements gradual typing (Siek & Taha, 2006) — you can mix typed and untyped code in the same program. The \`any\` type is the bridge between the typed and untyped worlds, allowing incremental adoption without rewriting entire codebases.

**Type Inference:** TypeScript uses local type inference based on the Hindley-Milner type system (adapted for a structural type system). The compiler infers types from usage context, reducing the annotation burden while maintaining type safety. This is the same principle used in Haskell and OCaml.

**Soundness vs Practicality:** TypeScript deliberately sacrifices type soundness for practicality. Some operations (like indexed access, type assertions) can bypass the type checker. This is a pragmatic design choice — a fully sound type system for JavaScript would be impractical given JavaScript's dynamic nature.`,
      furtherReading: [
        "TypeScript documentation — typescriptlang.org/docs",
        "TypeScript Deep Dive — basarat.gitbook.io/typescript",
        "Type Challenges — github.com/type-challenges/type-challenges",
        "Gradual Typing for Functional Languages (Siek & Taha, 2006)",
        "TypeScript Design Goals — github.com/Microsoft/TypeScript/wiki/TypeScript-Design-Goals",
      ],
    },
  ],
};
