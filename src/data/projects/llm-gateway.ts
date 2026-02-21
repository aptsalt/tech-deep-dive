import type { Project } from "../types";

export const llmGateway: Project = {
  id: "llm-gateway",
  name: "LLM Gateway",
  description:
    "Intelligent multi-provider LLM gateway with cost-optimized routing, semantic caching, automated benchmarking, and real-time observability. Drop-in OpenAI API replacement.",
  repo: "https://github.com/aptsalt/llm-gateway",
  languages: ["TypeScript", "SQL"],
  designPatterns: [
    {
      name: "Gateway / Reverse Proxy Pattern",
      category: "architectural",
      whatItIs:
        "A single entry point that sits between clients and backend services, routing requests, aggregating responses, and handling cross-cutting concerns like auth and rate limiting.",
      howProjectUsesIt:
        "The LLM Gateway acts as a reverse proxy between client applications and multiple LLM providers (OpenAI, Anthropic, Ollama), exposing a unified OpenAI-compatible API while handling caching, budgets, and routing internally.",
    },
    {
      name: "Strategy Pattern",
      category: "behavioral",
      whatItIs:
        "Defines a family of interchangeable algorithms, encapsulates each one, and makes them selectable at runtime without changing the client code.",
      howProjectUsesIt:
        "The routing engine implements multiple strategies (cost-based, latency-based, capability-based, weighted random) that can be swapped at runtime to select the optimal LLM provider for each request.",
    },
    {
      name: "Decorator Pattern",
      category: "structural",
      whatItIs:
        "Wraps an object with additional behavior by stacking layers around it, each adding functionality without modifying the original object.",
      howProjectUsesIt:
        "The middleware chain (logging, auth, rate-limit, cache-check, metrics) decorates each incoming request with cross-cutting concerns before it reaches the route handler.",
    },
    {
      name: "Observer Pattern",
      category: "behavioral",
      whatItIs:
        "Defines a one-to-many dependency where when one object changes state, all its dependents are notified and updated automatically.",
      howProjectUsesIt:
        "The gateway emits metrics events (request count, latency, token usage, cache hits) that Prometheus observes and scrapes, decoupling metric production from metric collection.",
    },
    {
      name: "Circuit Breaker Pattern",
      category: "behavioral",
      whatItIs:
        "A stability pattern that monitors for failures and temporarily stops sending requests to a failing service, allowing it to recover before resuming traffic.",
      howProjectUsesIt:
        "When an LLM provider starts failing, the circuit breaker opens to stop sending traffic, then transitions to half-open after a cooldown to test recovery before fully restoring the provider to the routing pool.",
    },
    {
      name: "Repository Pattern",
      category: "architectural",
      whatItIs:
        "Abstracts data access behind a collection-like interface, decoupling business logic from the specific database or ORM implementation.",
      howProjectUsesIt:
        "Drizzle ORM provides the repository abstraction over PostgreSQL, encapsulating usage logs, budget queries, and provider configurations behind typed query methods.",
    },
    {
      name: "Factory Pattern",
      category: "creational",
      whatItIs:
        "Encapsulates object creation logic, allowing the system to instantiate objects without specifying their exact class at compile time.",
      howProjectUsesIt:
        "Provider instances (OpenAI, Anthropic, Ollama) are created through a factory that reads configuration and instantiates the correct provider adapter with appropriate credentials and settings.",
    },
  ],
  keyTakeaways: [
    "API gateway design for AI workloads requires fundamentally different routing logic than traditional HTTP gateways — cost, latency, and model capability all factor into routing decisions.",
    "Semantic caching with vector similarity can reduce LLM costs by 40-60% for repetitive workloads.",
    "Token budget enforcement must happen at the gateway level, not the application level, to prevent cost overruns.",
    "Prometheus metrics + Grafana dashboards are the industry standard for real-time observability.",
  ],
  coreConcepts: [
    {
      name: "API Gateway for AI",
      slug: "api-gateway-for-ai",
      whatItIs:
        "A reverse proxy that sits between client applications and multiple LLM providers, providing a unified API interface. Unlike traditional API gateways, AI gateways must handle streaming responses, variable token costs, and model-specific capabilities.",
      whyItMatters:
        "Without a gateway, every client application must implement provider-specific integration logic, handle failover, manage API keys, and track costs independently. A gateway centralizes these concerns, reducing duplication and enabling organization-wide cost control.",
      howProjectUsesIt:
        "The LLM Gateway exposes an OpenAI-compatible API so any existing OpenAI SDK client can use it as a drop-in replacement, while internally routing to the optimal provider based on cost, latency, and capability.",
      keyTerms: [
        {
          term: "Reverse Proxy",
          definition:
            "A server that sits in front of backend services and forwards client requests to them, hiding the backend topology from clients.",
        },
        {
          term: "API Compatibility Layer",
          definition:
            "An interface that mimics an existing API (in this case, OpenAI's) so clients can switch backends without code changes.",
        },
        {
          term: "Multi-Provider Abstraction",
          definition:
            "A unified interface that normalizes the differences between multiple LLM providers into a single consistent API.",
        },
      ],
    },
    {
      name: "Semantic Caching",
      slug: "semantic-caching",
      whatItIs:
        "Instead of exact-match caching, uses vector similarity to find \"close enough\" prompts. Two prompts meaning the same thing but worded differently can share a cached response, reducing LLM API costs by 40-60%.",
      whyItMatters:
        "LLM API calls are expensive and slow. Traditional exact-match caching misses semantically identical requests with different wording. Semantic caching dramatically increases cache hit rates for conversational and repetitive workloads.",
      howProjectUsesIt:
        "Incoming prompts are embedded using a lightweight model, and their embeddings are compared against cached entries in Redis using cosine similarity. If similarity exceeds a configurable threshold (default 0.95), the cached response is returned without hitting the LLM provider.",
      keyTerms: [
        {
          term: "Vector Embedding",
          definition:
            "A numerical representation of text as a high-dimensional vector, where semantically similar texts have vectors that are close together.",
        },
        {
          term: "Cosine Similarity",
          definition:
            "A measure of similarity between two vectors based on the angle between them, ranging from -1 (opposite) to 1 (identical).",
        },
        {
          term: "Similarity Threshold",
          definition:
            "The minimum cosine similarity score required to consider a cached response a valid match for a new prompt.",
        },
      ],
    },
    {
      name: "Cost-Optimized Routing",
      slug: "cost-optimized-routing",
      whatItIs:
        "Selecting the cheapest LLM provider that meets quality requirements for each request. Different providers charge different per-token rates, and the router dynamically chooses based on cost, latency, and model capability.",
      whyItMatters:
        "LLM costs vary dramatically between providers and models. Without intelligent routing, organizations either overpay by always using premium models or sacrifice quality by always using the cheapest option. Cost-optimized routing balances both.",
      howProjectUsesIt:
        "The routing engine compares per-token pricing across providers, checks model capabilities against request requirements, and selects the cheapest provider that satisfies the quality and capability constraints.",
      keyTerms: [
        {
          term: "Per-Token Pricing",
          definition:
            "The cost model used by LLM providers, charging separately for input (prompt) tokens and output (completion) tokens.",
        },
        {
          term: "Routing Strategy",
          definition:
            "An algorithm that determines which provider receives a given request, based on configurable criteria like cost, latency, or capability.",
        },
        {
          term: "Capability Matching",
          definition:
            "Verifying that a provider/model supports the features required by a request, such as function calling, vision, or large context windows.",
        },
      ],
    },
    {
      name: "Circuit Breaker",
      slug: "circuit-breaker",
      whatItIs:
        "A stability pattern that prevents cascading failures. When a provider starts failing, the circuit \"opens\" (stops sending traffic) to let it recover, automatically trying again after a cooldown period.",
      whyItMatters:
        "Without a circuit breaker, a failing provider receives continued traffic that will all fail, increasing latency for every request and potentially exhausting connection pools. The circuit breaker fails fast and redirects traffic to healthy providers.",
      howProjectUsesIt:
        "Each LLM provider has an independent circuit breaker that tracks failure rates. When failures exceed a threshold, the circuit opens and the routing engine excludes that provider. After a cooldown, it enters half-open state and sends a test request to check recovery.",
      keyTerms: [
        {
          term: "Closed State",
          definition:
            "Normal operation where requests flow through to the provider and failures are counted.",
        },
        {
          term: "Open State",
          definition:
            "The circuit has tripped due to excessive failures; all requests to this provider are immediately rejected.",
        },
        {
          term: "Half-Open State",
          definition:
            "After the cooldown period, a limited number of test requests are sent to check if the provider has recovered.",
        },
      ],
    },
    {
      name: "Token Budgets",
      slug: "token-budgets",
      whatItIs:
        "Enforcing spending limits at the gateway level to prevent cost overruns. Each organization/user has a configurable token budget, and requests are rejected when the budget is exhausted.",
      whyItMatters:
        "LLM costs can escalate rapidly, especially with high-throughput applications. Without gateway-level budget enforcement, individual applications cannot be trusted to self-regulate, and a single runaway process can consume an entire organization's AI budget.",
      howProjectUsesIt:
        "Before forwarding a request to an LLM provider, the gateway checks the organization's remaining token budget in PostgreSQL. If the budget is exhausted, the request is rejected with a 429 status. Usage is logged atomically within a database transaction to prevent concurrent overspending.",
      keyTerms: [
        {
          term: "Token Budget",
          definition:
            "A configurable limit on the total number of tokens (or equivalent cost) an organization or user can consume within a time period.",
        },
        {
          term: "Budget Enforcement",
          definition:
            "The process of checking remaining budget before processing a request and rejecting requests that would exceed the limit.",
        },
        {
          term: "Atomic Usage Logging",
          definition:
            "Recording token consumption within a database transaction to ensure concurrent requests cannot overspend the budget due to race conditions.",
        },
      ],
    },
  ],
  videoResources: [
    {
      title: "API Gateway Pattern",
      url: "https://www.youtube.com/watch?v=6ULyxuHKxg8",
      channel: "ByteByteGo",
      durationMinutes: 8,
      relevance:
        "Core gateway architecture concepts applied to this project",
    },
    {
      title: "Caching Strategies Explained",
      url: "https://www.youtube.com/watch?v=U3RkDLtS7uY",
      channel: "Hussein Nasser",
      durationMinutes: 18,
      relevance:
        "Understanding caching patterns including semantic caching",
    },
    {
      title: "Circuit Breaker Pattern",
      url: "https://www.youtube.com/watch?v=ADHcBxEXvFA",
      channel: "Christopher Okhravi",
      durationMinutes: 12,
      relevance:
        "Deep dive into the circuit breaker pattern used in provider failover",
    },
    {
      title: "Prometheus and Grafana Tutorial",
      url: "https://www.youtube.com/watch?v=7gW5pSM6dlU",
      channel: "TechWorld with Nana",
      durationMinutes: 20,
      relevance:
        "Monitoring stack used in the gateway observability layer",
    },
  ],
  realWorldExamples: [
    {
      company: "OpenRouter",
      product: "LLM Router",
      description:
        "Multi-provider LLM gateway that routes requests across 100+ models. Same cost-optimized routing pattern at commercial scale.",
      conceptConnection:
        "Same gateway + routing pattern, commercial implementation",
    },
    {
      company: "Cloudflare",
      product: "AI Gateway",
      description:
        "Cloudflare's AI Gateway provides caching, rate limiting, and analytics for AI API calls. Enterprise-grade version of this project's architecture.",
      conceptConnection:
        "Enterprise AI gateway with semantic caching",
    },
    {
      company: "Amazon",
      product: "AWS Bedrock",
      description:
        "AWS's managed service for accessing multiple foundation models through a unified API. Same multi-provider abstraction pattern.",
      conceptConnection:
        "Multi-provider gateway at cloud scale",
    },
    {
      company: "LiteLLM",
      product: "LiteLLM Proxy",
      description:
        "Open-source LLM proxy supporting 100+ providers with OpenAI-compatible API. Direct open-source competitor architecture.",
      conceptConnection:
        "Open-source multi-provider LLM proxy",
    },
  ],
  cicd: {
    overview:
      "TypeScript-based CI/CD pipeline with containerized local development, automated testing, and database migration management.",
    stages: [
      {
        name: "Build",
        tool: "tsc",
        description:
          "TypeScript compiled to JavaScript ES modules.",
        commands: ["npm run build", "tsc --project tsconfig.json"],
      },
      {
        name: "Testing",
        tool: "Vitest",
        description:
          "Unit and integration tests run on every push.",
        commands: ["npm run test", "vitest run --coverage"],
      },
      {
        name: "Containerization",
        tool: "Docker",
        description:
          "Multi-stage Dockerfile: build stage compiles TS, production stage runs slim Node.js 20 Alpine.",
        commands: ["docker build -t llm-gateway ."],
      },
      {
        name: "Database Migrations",
        tool: "Drizzle Kit",
        description:
          "SQL migrations generated from TypeScript schema definitions.",
        commands: ["drizzle-kit generate", "drizzle-kit push"],
      },
      {
        name: "Compose Stack",
        tool: "Docker Compose",
        description:
          "Full local stack with PostgreSQL, Redis, Prometheus, Grafana.",
        commands: ["docker compose up", "docker compose down"],
      },
    ],
    infrastructure:
      "Node.js >=20, strict TypeScript mode, ES modules throughout.",
    diagram: `[tsc build] → [Vitest] → [Docker Build] → [docker-compose up]
                                         ↓
                              ┌──────────┼──────────┐
                              │          │          │
                          PostgreSQL   Redis   Prometheus
                                                    │
                                                 Grafana`,
  },
  architecture: [
    {
      title: "System Overview",
      content: `The LLM Gateway sits between client applications and multiple LLM providers (OpenAI, Anthropic, Ollama). It exposes an OpenAI-compatible API so any existing OpenAI SDK client can use it as a drop-in replacement.

**Request Flow:**
1. Client sends request to gateway (OpenAI-compatible format)
2. Semantic cache check — if a similar prompt was seen before, return cached response
3. Token budget check — verify the org/user hasn't exceeded their budget
4. Router selects optimal provider based on cost, latency, model capability
5. Request forwarded to selected provider with retry/failover logic
6. Response streamed back to client
7. Metrics emitted to Prometheus, usage logged to PostgreSQL`,
      diagram: `Client App (OpenAI SDK)
       │
       ▼
┌─────────────────┐
│   LLM Gateway   │
│  ┌───────────┐  │
│  │ Semantic   │  │
│  │ Cache      │──┤──→ Redis
│  └───────────┘  │
│  ┌───────────┐  │
│  │ Token     │  │
│  │ Budget    │──┤──→ PostgreSQL
│  └───────────┘  │
│  ┌───────────┐  │
│  │ Router    │  │
│  └─────┬─────┘  │
└────────┼────────┘
    ┌────┼────┐
    ▼    ▼    ▼
 OpenAI Anthropic Ollama`,
    },
    {
      title: "Routing Engine",
      content: `The routing engine is the brain of the gateway. It implements multiple strategies:

**Cost-Based Routing:** Compares per-token pricing across providers and selects the cheapest option that meets quality requirements.

**Latency-Based Routing:** Uses exponential moving average of recent response times to route to the fastest provider.

**Capability-Based Routing:** Some models support function calling, vision, or large context windows. The router matches request requirements to provider capabilities.

**Weighted Random:** Distributes load across providers based on configurable weights.

**Failover Chain:** If the primary provider fails, automatically tries the next provider in a priority-ordered chain. Implements circuit breaker to avoid hammering a down provider.`,
    },
    {
      title: "Caching Layer",
      content: `**Semantic Caching** goes beyond exact-match caching. Instead of requiring identical prompts, it uses cosine similarity between prompt embeddings to find "close enough" matches.

**How it works:**
1. Incoming prompt is embedded using a lightweight model
2. Embedding is compared against cached embeddings in Redis
3. If similarity exceeds threshold (configurable, default 0.95), cached response is returned
4. Cache entries have TTL and are evicted using LRU policy

**Why Redis:** Sub-millisecond lookups, built-in TTL, sorted sets for similarity search, persistence options.`,
    },
    {
      title: "Observability Stack",
      content: `**Metrics (Prometheus + prom-client):**
- Request count by provider, model, status
- Token usage (prompt + completion) by org/user
- Latency histograms (p50, p95, p99)
- Cache hit/miss ratios
- Circuit breaker state changes
- Active connections gauge

**Dashboards (Grafana):**
- Pre-built dashboards for cost tracking, latency monitoring, and usage analytics
- Alerting rules for budget overruns, high error rates, latency spikes

**Structured Logging:**
- JSON-formatted logs with request correlation IDs
- Log levels: debug, info, warn, error`,
    },
  ],
  technologies: [
    {
      name: "TypeScript",
      category: "language",
      icon: "TS",
      tagline: "JavaScript with static types",
      origin: {
        creator: "Anders Hejlsberg at Microsoft",
        year: 2012,
        motivation:
          "JavaScript's dynamic typing made large-scale application development error-prone. Anders Hejlsberg (who also created C# and Delphi) designed TypeScript to add optional static types to JavaScript while maintaining full backward compatibility.",
      },
      whatItIs: `TypeScript is a statically-typed superset of JavaScript that compiles to plain JavaScript. Every valid JavaScript program is also a valid TypeScript program, but TypeScript adds:

- **Static Type System:** Catch type errors at compile time rather than runtime
- **Type Inference:** Automatically deduces types without explicit annotations
- **Generics:** Write reusable type-safe code
- **Enums, Interfaces, Type Aliases:** Rich type modeling
- **Decorators:** Metadata annotations (stage 3 proposal)
- **Module System:** ES modules with full type information`,
      explainLikeImTen: `Imagine you're building with LEGO bricks. Regular JavaScript is like building without instructions — you can put any piece anywhere, but sometimes you accidentally use the wrong piece and your spaceship falls apart. TypeScript is like having a smart instruction book that checks your work as you build. It tells you "hey, that red piece won't fit there, you need a blue one!" before you even try. This way, you catch mistakes early instead of finding out your creation is broken after you're done. It still turns into the same LEGO creation at the end — TypeScript just helps you build it correctly.`,
      realWorldAnalogy: `TypeScript is like spell-check and grammar-check for code. Just like how Word underlines your mistakes with red and blue squiggles before you send an email, TypeScript highlights coding mistakes before your program runs. The email still gets sent as plain text — the spell-checker just helped you write it correctly.`,
      whyWeUsedIt: `In an API gateway handling financial-critical LLM routing decisions, runtime type errors are unacceptable. TypeScript catches entire categories of bugs at compile time:
- Mismatched provider API response shapes
- Invalid routing configuration
- Missing required fields in database schemas
- Incorrect metric label types

The Hono framework and Drizzle ORM both have first-class TypeScript support, providing end-to-end type safety from HTTP request to database query.`,
      howItWorksInProject: `- **Strict mode enabled** (\`"strict": true\` in tsconfig) — no implicit any, strict null checks
- **ES modules** (\`"type": "module"\` in package.json) — modern import/export syntax
- **Path aliases** for clean imports
- **Zod schemas** provide runtime validation that also generates TypeScript types
- **Drizzle schemas** are TypeScript-first — database types are inferred from schema definitions`,
      featuresInProject: [
        {
          feature: "Strict Type Safety Across the Gateway",
          description: "TypeScript strict mode ensures every provider response shape, routing configuration, and database schema is type-checked at compile time, preventing runtime crashes in production.",
        },
        {
          feature: "OpenAI-Compatible API Types",
          description: "Request and response types for the OpenAI-compatible API surface are defined in TypeScript, ensuring the gateway correctly implements the chat completions, embeddings, and models endpoints.",
        },
        {
          feature: "Provider Abstraction Layer",
          description: "TypeScript interfaces define a common shape for all LLM providers (OpenAI, Anthropic, Ollama), enabling the routing engine to treat them uniformly while preserving provider-specific type information.",
        },
        {
          feature: "Zod Schema Type Inference",
          description: "Zod schemas generate TypeScript types via z.infer, creating a single source of truth for request validation and static types — no manual type duplication needed.",
        },
        {
          feature: "Drizzle ORM Schema Definitions",
          description: "Database table schemas are written as TypeScript objects using Drizzle's pgTable API, and query result types are automatically inferred from these definitions.",
        },
      ],
      coreConceptsMarkdown: `### Type System Fundamentals

**Structural Typing:** TypeScript uses structural typing (duck typing), not nominal typing. Two types are compatible if their structures match, regardless of name.

\`\`\`typescript
interface Point { x: number; y: number }
interface Coordinate { x: number; y: number }
// Point and Coordinate are interchangeable
\`\`\`

**Union and Intersection Types:**
\`\`\`typescript
type Result = Success | Failure;        // Union — one or the other
type AdminUser = User & AdminPerms;     // Intersection — both
\`\`\`

**Generics:**
\`\`\`typescript
function identity<T>(arg: T): T { return arg; }
// T is inferred from the argument
\`\`\`

**Mapped Types:**
\`\`\`typescript
type Readonly<T> = { readonly [K in keyof T]: T[K] };
type Partial<T> = { [K in keyof T]?: T[K] };
\`\`\`

**Conditional Types:**
\`\`\`typescript
type IsString<T> = T extends string ? true : false;
\`\`\`

**Template Literal Types:**
\`\`\`typescript
type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE";
type Endpoint = \`/api/\${string}\`;
\`\`\`

### Compiler Architecture

The TypeScript compiler (tsc) works in phases:
1. **Scanner/Lexer** → tokenizes source code
2. **Parser** → builds Abstract Syntax Tree (AST)
3. **Binder** → creates symbol table, resolves scopes
4. **Type Checker** → validates types, infers missing types
5. **Emitter** → generates JavaScript output

### tsconfig.json Key Options

- \`strict\`: Enables all strict type checking options
- \`target\`: ECMAScript version for output (ES2022, ESNext)
- \`module\`: Module system (ESNext, CommonJS, NodeNext)
- \`moduleResolution\`: How to resolve imports (bundler, node16)
- \`skipLibCheck\`: Skip type checking .d.ts files (faster builds)`,
      prosAndCons: {
        pros: [
          "Catches bugs at compile time — entire categories of runtime errors eliminated",
          "Excellent IDE support — autocomplete, refactoring, go-to-definition",
          "Gradual adoption — can mix .ts and .js files",
          "Rich ecosystem — DefinitelyTyped has types for 10,000+ npm packages",
          "Self-documenting code — types serve as living documentation",
          "Refactoring safety — rename a field and the compiler finds every usage",
        ],
        cons: [
          "Build step required — can't run .ts files directly in browsers/Node (tsx/ts-node needed for dev)",
          "Learning curve for advanced types — conditional types, mapped types, template literals",
          "Type gymnastics — some library types become extremely complex",
          "Slower compilation on large codebases (mitigated by incremental builds)",
          "Third-party types can be inaccurate or outdated",
          "Configuration complexity — tsconfig has 100+ options",
        ],
      },
      alternatives: [
        {
          name: "JavaScript (vanilla)",
          comparison:
            "No build step, universal runtime support, but no compile-time type checking. JSDoc comments provide partial type information but lack the expressiveness of TypeScript's type system.",
        },
        {
          name: "Flow",
          comparison:
            "Facebook's static type checker for JavaScript. Similar goals to TypeScript but far less adoption, fewer IDE integrations, and a shrinking ecosystem. Meta has largely abandoned it in favor of TypeScript.",
        },
        {
          name: "ReScript",
          comparison:
            "Compiles to JavaScript with a sound type system (no any type). Much stricter than TypeScript but has its own syntax, making ecosystem integration harder.",
        },
        {
          name: "Dart",
          comparison:
            "Google's typed language for Flutter/web. Strong type system but a completely separate ecosystem from npm/Node.js.",
        },
      ],
      keyAPIs: [
        "tsc — TypeScript compiler CLI",
        "tsconfig.json — project configuration",
        "type / interface — type definitions",
        "as / satisfies — type assertions",
        "keyof / typeof / infer — type operators",
        "Utility types: Partial, Required, Pick, Omit, Record, Exclude",
      ],
      academicFoundations: `TypeScript's type system is rooted in **type theory**, a branch of mathematical logic and computer science.

**Hindley-Milner Type System:** TypeScript's type inference is inspired by (but not identical to) the Hindley-Milner algorithm used in ML, Haskell, and OCaml. HM provides complete type inference — no annotations needed. TypeScript's inference is more limited because JavaScript's dynamic nature makes complete inference undecidable.

**Structural Subtyping:** Based on Luca Cardelli's work on type systems for object-oriented languages. A type A is a subtype of B if A has all of B's properties — the name doesn't matter.

**Gradual Typing:** TypeScript implements Siek & Taha's gradual typing theory (2006) — you can mix typed and untyped code, with \`any\` as the boundary between the two worlds.

**Soundness vs. Practicality:** TypeScript intentionally sacrifices soundness for usability. The type system has known unsound features (bivariant function parameters, type assertions) that make real-world JavaScript patterns expressible.`,
      furtherReading: [
        "TypeScript Handbook — typescriptlang.org/docs/handbook",
        "Programming TypeScript by Boris Cherny (O'Reilly)",
        "Effective TypeScript by Dan Vanderkam (O'Reilly)",
        "Type Challenges — github.com/type-challenges/type-challenges",
      ],
    },
    {
      name: "Hono",
      category: "framework",
      icon: "HO",
      tagline: "Ultra-fast web framework for the edge",
      origin: {
        creator: "Yusuke Wada",
        year: 2022,
        motivation:
          "Existing Node.js frameworks (Express, Fastify) were designed for traditional server environments. Hono was built from the ground up for edge computing (Cloudflare Workers, Deno Deploy, Bun) while also working great on Node.js.",
      },
      whatItIs: `Hono is a lightweight, high-performance web framework built on Web Standards (Request/Response APIs). It runs on any JavaScript runtime:

- **Cloudflare Workers / Pages**
- **Deno / Deno Deploy**
- **Bun**
- **Node.js** (via @hono/node-server adapter)
- **AWS Lambda**
- **Vercel Edge Functions**

Key features:
- Zero dependencies in core
- RegExp-based router (fastest in benchmarks)
- Built-in middleware (CORS, ETag, Logger, Bearer Auth)
- First-class TypeScript support with type-safe routing
- ~14KB minified`,
      explainLikeImTen: `Think of Hono like a super-fast mail sorting machine at the post office. When letters (web requests) come in, the machine reads the address and instantly sends each letter to the right mailbox (the right piece of code). It can also add stickers or stamps along the way — like checking if the letter is allowed in or adding a tracking number. Hono is one of the fastest sorting machines out there, and it's really small so it doesn't take up much space.`,
      realWorldAnalogy: `Hono is like an airport's flight routing system. Incoming passengers (HTTP requests) arrive, get checked through security (middleware), and are directed to the correct gate (route handler). The system is designed to be extremely efficient because even small delays multiply across thousands of passengers per hour.`,
      whyWeUsedIt: `For an API gateway, the framework choice is critical — every millisecond of overhead is multiplied by every request.

**Why Hono over Express:**
- 5-10x faster in benchmarks (matters for high-throughput gateway)
- TypeScript-first (Express types are bolted on via @types/express)
- Zod validator middleware (\`@hono/zod-validator\`) provides type-safe request validation
- Modern async/await patterns, no callback legacy
- Web Standards API means the gateway could deploy to edge if needed

**Why Hono over Fastify:**
- Simpler API, less boilerplate
- Better TypeScript inference for route handlers
- Edge-runtime compatible (Fastify is Node.js only)`,
      howItWorksInProject: `- \`src/index.ts\` — Creates Hono app, registers middleware and routes
- \`src/server.ts\` — Node.js server adapter (\`@hono/node-server\`)
- \`src/gateway/\` — Route handlers for the OpenAI-compatible API
- \`@hono/zod-validator\` validates request bodies against Zod schemas
- Middleware chain: logging → auth → rate-limit → cache-check → route → metrics`,
      featuresInProject: [
        {
          feature: "OpenAI-Compatible API Endpoints",
          description: "Hono route handlers implement the /v1/chat/completions, /v1/embeddings, and /v1/models endpoints, making the gateway a drop-in replacement for the OpenAI API.",
        },
        {
          feature: "Middleware Pipeline",
          description: "Hono's middleware chain processes every request through logging, authentication, rate limiting, cache checking, and metrics collection before reaching the route handler.",
        },
        {
          feature: "Request Validation with Zod",
          description: "The @hono/zod-validator middleware validates incoming request bodies against Zod schemas, returning structured error responses for invalid requests before they reach the routing engine.",
        },
        {
          feature: "Prometheus Metrics Endpoint",
          description: "A dedicated /metrics route exposes all gateway metrics in Prometheus format, using Hono's route handler to serve the prom-client registry output.",
        },
        {
          feature: "Streaming Response Support",
          description: "Hono's streaming helpers enable the gateway to stream LLM responses back to clients in real time using Server-Sent Events, matching OpenAI's streaming API behavior.",
        },
      ],
      coreConceptsMarkdown: `### Web Standards Foundation

Hono is built on the \`Request\` and \`Response\` Web APIs (defined in the WHATWG Fetch Standard). This means the same code runs on any runtime that implements these standards.

\`\`\`typescript
import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => c.json({ message: "Hello" }));
// c is the Context object — provides helpers for
// request parsing, response building, and middleware data
\`\`\`

### Routing

Hono uses a **RegExp-based router** (RegExpRouter) by default, which pre-compiles all routes into a single regex for O(1) matching.

\`\`\`typescript
app.get("/users/:id", (c) => {
  const id = c.req.param("id"); // type-safe
  return c.json({ id });
});

// Grouping
const api = new Hono();
api.get("/health", (c) => c.text("ok"));
app.route("/api", api);
\`\`\`

### Middleware

\`\`\`typescript
// Custom middleware
app.use("*", async (c, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  c.header("X-Response-Time", \`\${ms}ms\`);
});

// Built-in middleware
import { cors } from "hono/cors";
import { logger } from "hono/logger";
app.use("*", cors());
app.use("*", logger());
\`\`\`

### Zod Validator Integration

\`\`\`typescript
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const schema = z.object({
  model: z.string(),
  messages: z.array(z.object({
    role: z.enum(["user", "assistant", "system"]),
    content: z.string(),
  })),
});

app.post("/v1/chat/completions",
  zValidator("json", schema),
  (c) => {
    const body = c.req.valid("json"); // fully typed!
    // body.model is string, body.messages is typed array
  }
);
\`\`\``,
      prosAndCons: {
        pros: [
          "Blazing fast — one of the fastest JS frameworks in benchmarks",
          "Truly portable — runs on Node.js, Deno, Bun, Cloudflare Workers, AWS Lambda",
          "TypeScript-first with excellent type inference",
          "Tiny bundle size (~14KB) — ideal for edge deployment",
          "Modern API design — no legacy callback patterns",
          "Active development with frequent releases",
        ],
        cons: [
          "Smaller ecosystem than Express (fewer third-party middleware)",
          "Relatively new (2022) — less battle-tested in production",
          "Node.js adapter adds a small abstraction layer",
          "Documentation is good but not as extensive as Express",
          "Some advanced Express middleware has no Hono equivalent",
        ],
      },
      alternatives: [
        {
          name: "Express.js",
          comparison:
            "The most popular Node.js framework (2010). Massive ecosystem, battle-tested, but slower, callback-based legacy, and poor TypeScript support. Express 5 has been in beta for years.",
        },
        {
          name: "Fastify",
          comparison:
            "High-performance Node.js framework with schema-based validation. Faster than Express but Node.js-only. Good TypeScript support but not as ergonomic as Hono.",
        },
        {
          name: "Elysia",
          comparison:
            "Bun-first framework with excellent TypeScript inference. Blazing fast but tied to the Bun runtime.",
        },
        {
          name: "tRPC",
          comparison:
            "End-to-end type-safe APIs without REST/GraphQL. Great for full-stack TypeScript apps but doesn't provide HTTP framework features (middleware, routing).",
        },
      ],
      keyAPIs: [
        "new Hono() — create app instance",
        "app.get/post/put/delete() — route handlers",
        "app.use() — middleware registration",
        "c.req — typed request object",
        "c.json() / c.text() / c.html() — response helpers",
        "c.header() / c.status() — response modifiers",
        "app.route() — sub-router mounting",
      ],
      academicFoundations: `Hono's architecture draws from several CS concepts:

**Middleware Pattern (Chain of Responsibility):** Each middleware is a handler that can process the request, modify context, and optionally pass to the next handler. This is the GoF Chain of Responsibility pattern applied to HTTP processing.

**Finite Automaton Routing:** The RegExpRouter compiles route patterns into a deterministic finite automaton (DFA) for O(1) route matching, regardless of the number of registered routes. This is based on Thompson's construction algorithm for converting regular expressions to NFAs, then subset construction to DFAs.

**Web Standards & Platform APIs:** The WHATWG Fetch Standard defines the Request/Response primitives. By building on these standards, Hono achieves runtime portability — a principle from the "write once, run anywhere" philosophy.`,
      furtherReading: [
        "Hono documentation — hono.dev",
        "Web Standards APIs — developer.mozilla.org/en-US/docs/Web/API/Request",
        "WHATWG Fetch Standard — fetch.spec.whatwg.org",
      ],
    },
    {
      name: "Drizzle ORM",
      category: "library",
      icon: "DZ",
      tagline: "TypeScript ORM that feels like SQL",
      origin: {
        creator: "Drizzle Team (Alex Blokh)",
        year: 2022,
        motivation:
          "Existing ORMs (Prisma, TypeORM, Sequelize) abstract away SQL too much, leading to N+1 queries and unpredictable performance. Drizzle was designed to give developers the power of raw SQL with full TypeScript type safety.",
      },
      whatItIs: `Drizzle is a TypeScript ORM with two key principles:
1. **If you know SQL, you know Drizzle** — the query API mirrors SQL syntax
2. **Zero overhead** — queries compile to exactly the SQL you'd write by hand

Components:
- **drizzle-orm**: The query builder and runtime
- **drizzle-kit**: CLI for migrations, schema introspection, database push
- **drizzle-studio**: Visual database browser`,
      explainLikeImTen: `Imagine you have a giant filing cabinet full of folders (that's your database). Normally, to find or add something, you'd have to speak a special language called SQL. Drizzle is like a friendly translator who lets you talk in your normal language (TypeScript) and translates it perfectly into that special filing cabinet language. The cool part is that your translator also checks your work — if you ask for a folder that doesn't exist, it tells you right away instead of letting you search for nothing.`,
      realWorldAnalogy: `Drizzle ORM is like a bilingual secretary who perfectly translates between you (TypeScript code) and the filing department (PostgreSQL). You write your requests in English, and the secretary converts them to the exact filing instructions needed — no extra steps, no lost-in-translation errors. Unlike other secretaries who paraphrase loosely, Drizzle translates word-for-word so you always know exactly what instruction the filing department received.`,
      whyWeUsedIt: `The LLM gateway stores usage logs, budget tracking, and provider configurations in PostgreSQL. Drizzle was chosen because:

- **Type-safe schemas** — database table definitions are TypeScript objects. Column types flow through to query results.
- **SQL-like API** — no ORM query language to learn. \`db.select().from(users).where(eq(users.id, 1))\` reads like SQL.
- **Migration generation** — \`drizzle-kit generate\` diffs your schema and generates SQL migrations automatically.
- **Performance** — no query overhead, no runtime schema parsing. Queries are compiled at build time.`,
      howItWorksInProject: `- \`src/db/\` contains schema definitions and migration logic
- Schema defines tables for: providers, models, usage_logs, budgets, cache_entries
- \`drizzle-kit push\` applies schema changes during development
- \`drizzle-kit generate\` creates versioned SQL migrations for production
- Queries use the relational query builder for joins and aggregations`,
      featuresInProject: [
        {
          feature: "Usage Logging",
          description: "Every LLM request is logged to a usage_logs table via Drizzle insert queries, capturing provider, model, token counts, cost, and latency for analytics and billing.",
        },
        {
          feature: "Budget Enforcement",
          description: "Drizzle queries aggregate token usage and costs per organization from the budgets and usage_logs tables to enforce spending limits before forwarding requests.",
        },
        {
          feature: "Provider Configuration Management",
          description: "Provider and model configurations are stored in PostgreSQL tables defined with Drizzle schemas, allowing dynamic updates to routing weights, pricing, and capabilities.",
        },
        {
          feature: "Schema Migration Pipeline",
          description: "Drizzle Kit generates SQL migrations from TypeScript schema changes and applies them during development with drizzle-kit push, ensuring the database stays in sync with the codebase.",
        },
        {
          feature: "Cost Analytics Aggregations",
          description: "Drizzle's SQL template tag enables type-safe aggregation queries (SUM, AVG, GROUP BY) for cost and latency analytics across providers, models, and time periods.",
        },
      ],
      coreConceptsMarkdown: `### Schema Definition

\`\`\`typescript
import { pgTable, text, integer, timestamp, uuid } from "drizzle-orm/pg-core";

export const usageLogs = pgTable("usage_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  provider: text("provider").notNull(),
  model: text("model").notNull(),
  promptTokens: integer("prompt_tokens").notNull(),
  completionTokens: integer("completion_tokens").notNull(),
  costCents: integer("cost_cents").notNull(),
  latencyMs: integer("latency_ms").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// TypeScript type is automatically inferred:
// type UsageLog = typeof usageLogs.$inferSelect;
\`\`\`

### Query Builder

\`\`\`typescript
// SELECT
const logs = await db
  .select()
  .from(usageLogs)
  .where(eq(usageLogs.provider, "openai"))
  .orderBy(desc(usageLogs.createdAt))
  .limit(100);

// INSERT
await db.insert(usageLogs).values({
  provider: "openai",
  model: "gpt-4",
  promptTokens: 500,
  completionTokens: 200,
  costCents: 42,
  latencyMs: 1200,
});

// Aggregations
const stats = await db
  .select({
    provider: usageLogs.provider,
    totalCost: sql<number>\`sum(\${usageLogs.costCents})\`,
    avgLatency: sql<number>\`avg(\${usageLogs.latencyMs})\`,
  })
  .from(usageLogs)
  .groupBy(usageLogs.provider);
\`\`\`

### Migrations

\`\`\`bash
# Generate migration from schema diff
npx drizzle-kit generate

# Apply migrations
npx drizzle-kit push

# Open visual studio
npx drizzle-kit studio
\`\`\`

### ORM vs Query Builder vs Raw SQL

| Approach | Type Safety | SQL Control | Performance |
|----------|-------------|-------------|-------------|
| Raw SQL (\`pg\`) | None | Full | Best |
| Query Builder (Knex) | Partial | High | Good |
| Drizzle ORM | Full | High | Best |
| Prisma | Full | Low | Good |
| TypeORM | Partial | Medium | Varies |`,
      prosAndCons: {
        pros: [
          "SQL-like API — no new query language to learn",
          "Full type safety from schema to query result",
          "Zero runtime overhead — compiles to exact SQL",
          "Automatic migration generation from schema diffs",
          "Supports PostgreSQL, MySQL, SQLite",
          "Lightweight — ~30KB vs Prisma's ~15MB",
        ],
        cons: [
          "Younger than Prisma — smaller community, fewer guides",
          "Relational queries API is still evolving",
          "Less magical than Prisma (which can be a pro or con)",
          "No built-in connection pooling (use pg-pool or PgBouncer)",
          "Schema-first workflow requires discipline in team settings",
        ],
      },
      alternatives: [
        {
          name: "Prisma",
          comparison:
            "Most popular TypeScript ORM. Uses its own schema language (.prisma files), auto-generates a type-safe client. Great DX but generates heavy client (~15MB), and the query engine is a Rust binary. Less SQL control than Drizzle.",
        },
        {
          name: "Knex.js",
          comparison:
            "SQL query builder (not a full ORM). Good SQL control but limited type safety. No schema definition or migration generation from types.",
        },
        {
          name: "TypeORM",
          comparison:
            "Decorator-based ORM inspired by Hibernate. Class-entity pattern. Poor TypeScript inference, many runtime surprises, and performance issues with complex queries.",
        },
        {
          name: "Kysely",
          comparison:
            "Type-safe SQL query builder. Similar philosophy to Drizzle but schema types must be manually maintained. No migration generation.",
        },
      ],
      keyAPIs: [
        "pgTable() — define PostgreSQL table schema",
        "db.select().from().where() — query builder",
        "db.insert().values() — insert records",
        "db.update().set().where() — update records",
        "eq/ne/gt/lt/and/or — filter operators",
        "sql`` — raw SQL template tag with type safety",
        "drizzle-kit generate/push/studio — CLI tools",
      ],
      academicFoundations: `**Relational Model (E.F. Codd, 1970):** Drizzle implements the relational model where data is organized into tables (relations) with typed columns (attributes). Codd's seminal paper "A Relational Model of Data for Large Shared Data Banks" laid the foundation for all SQL databases.

**Object-Relational Mapping:** The "impedance mismatch" between object-oriented programming and relational databases has been studied since the 1990s. ORMs bridge this gap by mapping tables to objects. Drizzle takes a minimalist approach — schema IS the mapping, no additional configuration.

**Type-Level Programming:** Drizzle uses TypeScript's advanced type system (conditional types, mapped types, template literals) to infer query result types at compile time. This is a form of type-level computation where the compiler acts as an interpreter for type expressions.`,
      furtherReading: [
        "Drizzle documentation — orm.drizzle.team",
        "Codd's Relational Model paper (1970)",
        "Martin Fowler — ORM Hate (blog post on ORM tradeoffs)",
      ],
    },
    {
      name: "PostgreSQL",
      category: "database",
      icon: "PG",
      tagline: "The world's most advanced open source database",
      origin: {
        creator: "Michael Stonebraker at UC Berkeley",
        year: 1986,
        motivation:
          "Stonebraker's POSTGRES project (Post-Ingres) aimed to extend the relational model with support for complex data types, user-defined functions, and extensibility. It became PostgreSQL when SQL support was added in 1995.",
      },
      whatItIs: `PostgreSQL is an open-source object-relational database system with 35+ years of active development. It's known for:

- **ACID compliance** — full transactional integrity
- **Advanced data types** — JSON/JSONB, arrays, hstore, geometric types, full-text search
- **Extensibility** — custom types, operators, functions, index methods
- **Concurrency** — MVCC (Multi-Version Concurrency Control) for lock-free reads
- **Standards compliance** — most SQL-standard compliant database`,
      explainLikeImTen: `PostgreSQL is like a super-organized librarian who manages a massive library. This librarian remembers exactly where every book is, can find any book in seconds, and never loses a book even if the power goes out. You can ask complicated questions like "find all science fiction books written after 2010 that have more than 300 pages" and the librarian finds them instantly. It's been around for almost 40 years and is trusted by banks, hospitals, and big companies to keep their most important information safe.`,
      realWorldAnalogy: `PostgreSQL is like a bank vault with an incredibly organized filing system inside. It guarantees that every transaction is recorded correctly (your deposit never disappears), multiple tellers can work simultaneously without interfering with each other, and even if the building loses power, every completed transaction is preserved when the lights come back on.`,
      whyWeUsedIt: `The LLM gateway needs to store:
- Usage logs (high-write, time-series-like data)
- Budget configurations (transactional reads/writes)
- Provider configurations (low-write, high-read)
- API keys and auth data (security-critical)

PostgreSQL handles all these workloads:
- JSONB columns store flexible provider response metadata
- Indexes on timestamp columns enable fast time-range queries
- Transactions ensure budget enforcement is atomic
- Row-level security can protect multi-tenant data`,
      howItWorksInProject: `- Runs as a Docker container in the docker-compose stack
- Drizzle ORM connects via the \`pg\` driver
- Schema managed by Drizzle Kit migrations
- Tables: providers, models, usage_logs, budgets, api_keys
- JSONB columns store provider-specific metadata and response details`,
      featuresInProject: [
        {
          feature: "Usage Logs Storage",
          description: "High-write usage_logs table stores every LLM request with provider, model, token counts, cost, latency, and timestamps, with indexes on timestamp columns for fast time-range queries.",
        },
        {
          feature: "Budget Tracking with Transactions",
          description: "PostgreSQL transactions ensure budget enforcement is atomic — checking the remaining budget and logging the usage happen in a single transaction so concurrent requests cannot overspend.",
        },
        {
          feature: "Provider Metadata in JSONB",
          description: "JSONB columns store flexible provider-specific metadata and response details that vary between OpenAI, Anthropic, and Ollama without requiring schema changes for each provider.",
        },
        {
          feature: "API Key and Auth Storage",
          description: "API keys, organization data, and authentication credentials are stored in PostgreSQL with proper indexing, serving as the security backbone of the gateway's multi-tenant architecture.",
        },
        {
          feature: "Analytics and Reporting Queries",
          description: "PostgreSQL's window functions, CTEs, and aggregations power the gateway's cost analytics, enabling queries like per-provider cost breakdown, daily usage trends, and latency percentile calculations.",
        },
      ],
      coreConceptsMarkdown: `### ACID Properties

- **Atomicity:** Transactions are all-or-nothing
- **Consistency:** Database moves from one valid state to another
- **Isolation:** Concurrent transactions don't interfere (MVCC)
- **Durability:** Committed data survives crashes (WAL)

### MVCC (Multi-Version Concurrency Control)

PostgreSQL doesn't lock rows for reads. Instead, each transaction sees a snapshot of the database at its start time. Writers create new versions of rows; readers see the version that was current when their transaction began.

This means:
- Readers never block writers
- Writers never block readers
- Only writer-writer conflicts cause blocking

### Write-Ahead Log (WAL)

Before any change is written to data files, it's first written to the WAL. This guarantees durability — if the server crashes, it replays the WAL to recover uncommitted changes.

WAL also enables:
- **Streaming replication** — ship WAL records to replicas
- **Point-in-time recovery** — restore to any moment
- **Logical replication** — replicate specific tables

### Indexing

PostgreSQL supports multiple index types:
- **B-tree** (default) — equality and range queries
- **Hash** — equality only, faster for exact matches
- **GiST** — geometric data, full-text search, nearest-neighbor
- **GIN** — inverted indexes for JSONB, arrays, full-text
- **BRIN** — block range indexes for naturally ordered data (timestamps)

### JSONB

\`\`\`sql
-- Store flexible data
INSERT INTO logs (metadata) VALUES ('{"provider": "openai", "model": "gpt-4"}'::jsonb);

-- Query nested fields
SELECT * FROM logs WHERE metadata->>'provider' = 'openai';

-- Index JSONB for fast queries
CREATE INDEX idx_metadata ON logs USING GIN (metadata);
\`\`\``,
      prosAndCons: {
        pros: [
          "Most feature-rich open-source database",
          "Rock-solid reliability — decades of production use",
          "JSONB provides document-database flexibility within a relational model",
          "Advanced indexing (GiST, GIN, BRIN) for specialized workloads",
          "Excellent extension ecosystem (PostGIS, pgvector, TimescaleDB)",
          "Strong community and commercial support (Supabase, Neon, CrunchyData)",
        ],
        cons: [
          "More complex to tune than MySQL for simple workloads",
          "MVCC creates table bloat (dead tuples) requiring VACUUM",
          "Replication setup is more complex than MySQL's built-in replication",
          "No built-in connection pooling (need PgBouncer or pgpool-II)",
          "Higher memory usage than lighter databases like SQLite",
        ],
      },
      alternatives: [
        {
          name: "MySQL / MariaDB",
          comparison:
            "Simpler, faster for simple read-heavy workloads, easier replication. But less SQL-standard, weaker JSON support, no advanced index types, and fewer data types.",
        },
        {
          name: "SQLite",
          comparison:
            "Embedded, zero-config, serverless database. Perfect for development and small applications. But single-writer, no concurrent connections, no network access.",
        },
        {
          name: "MongoDB",
          comparison:
            "Document database with flexible schemas. Good for unstructured data but lacks transactions (pre-4.0), joins, and relational integrity. PostgreSQL's JSONB provides similar flexibility within a relational model.",
        },
        {
          name: "CockroachDB",
          comparison:
            "Distributed SQL database with PostgreSQL wire compatibility. Built for global scale and automatic failover. But higher latency for single-node workloads and complex operational model.",
        },
      ],
      keyAPIs: [
        "SELECT / INSERT / UPDATE / DELETE — DML",
        "CREATE TABLE / ALTER TABLE — DDL",
        "CREATE INDEX — B-tree, GIN, GiST, BRIN",
        "JSONB operators: ->, ->>, @>, ?",
        "Window functions: ROW_NUMBER, RANK, LAG, LEAD",
        "CTEs: WITH ... AS",
        "EXPLAIN ANALYZE — query plan analysis",
      ],
      academicFoundations: `**Relational Model (Codd, 1970):** PostgreSQL implements Codd's relational model with extensions. The theoretical foundation is relational algebra — operations on sets of tuples (selection, projection, join, union).

**MVCC Theory:** Based on Reed's 1978 PhD thesis on multi-version timestamp ordering. PostgreSQL's implementation uses transaction IDs (xid) as version numbers and visibility rules to determine which row version each transaction can see.

**B-tree Theory (Bayer & McCreight, 1972):** The default index structure. A self-balancing tree where each node can have multiple children, optimized for disk I/O by matching node size to disk page size.

**Query Optimization:** PostgreSQL's query planner uses dynamic programming (Selinger et al., 1979) to find the optimal join order. For queries with many tables, it switches to a genetic algorithm (GEQO) to avoid exponential planning time.

**Concurrency Control Theory:** Bernstein & Goodman's serializability theory (1981) underpins PostgreSQL's transaction isolation levels. The Serializable Snapshot Isolation (SSI) implementation is based on Cahill et al. (2008).`,
      furtherReading: [
        "PostgreSQL documentation — postgresql.org/docs",
        "The Internals of PostgreSQL — interdb.jp/pg",
        "Designing Data-Intensive Applications by Martin Kleppmann (Chapter 7)",
        "PostgreSQL: Up and Running by Regina Obe",
      ],
    },
    {
      name: "Redis",
      category: "database",
      icon: "RD",
      tagline: "In-memory data structure store",
      origin: {
        creator: "Salvatore Sanfilippo (antirez)",
        year: 2009,
        motivation:
          "Sanfilippo needed a real-time log analyzer for his startup and found that existing databases were too slow for the access patterns he needed. He built Redis as an in-memory key-value store with rich data structures.",
      },
      whatItIs: `Redis (Remote Dictionary Server) is an in-memory data structure store used as a database, cache, message broker, and queue. It supports:

- **Strings** — simple key-value pairs
- **Hashes** — field-value maps (like objects)
- **Lists** — ordered sequences (queues, stacks)
- **Sets** — unordered unique collections
- **Sorted Sets** — sets with scores (leaderboards, priority queues)
- **Streams** — append-only log (event sourcing)
- **HyperLogLog** — probabilistic cardinality estimation
- **Bitmaps** — bit-level operations`,
      explainLikeImTen: `Imagine you have a whiteboard right next to your desk where you write down things you need to remember quickly — like phone numbers you just looked up. It's way faster to glance at your whiteboard than to dig through a filing cabinet. Redis is that whiteboard for computers. It keeps important information in its super-fast memory so the computer doesn't have to go searching through slower storage every time. The only catch is that whiteboards have limited space, so you only keep the most important stuff there.`,
      realWorldAnalogy: `Redis is like the counter at a busy deli. The most popular items (pre-made sandwiches, daily specials) are kept right at the counter for instant service. Less popular items are stored in the kitchen (disk-based database). The counter has limited space, so they rotate items based on popularity and freshness — old items get cleared, popular items stay up front.`,
      whyWeUsedIt: `The LLM gateway uses Redis for two critical functions:

**1. Semantic Cache:** LLM responses are cached in Redis with their prompt embeddings. When a new request arrives, its embedding is compared against cached entries using sorted sets. Sub-millisecond lookups make this viable for every request.

**2. Rate Limiting:** Token buckets are implemented as Redis counters with TTL. Distributed rate limiting works because Redis is a single source of truth across multiple gateway instances.

**Why not PostgreSQL for caching?** Disk-based databases add 1-10ms per query. Redis responds in <1ms. For a gateway that processes every request, this latency difference is critical.`,
      howItWorksInProject: `- \`ioredis\` client library (better than node-redis for TypeScript)
- Cache entries stored as hashes: \`cache:{hash}\` → \`{prompt, response, embedding, ttl}\`
- Sorted sets for similarity search: \`cache:embeddings\` → \`{score: similarity, member: hash}\`
- Rate limit counters: \`ratelimit:{orgId}:{window}\` → count with TTL
- Connection pooling via ioredis built-in pool`,
      featuresInProject: [
        {
          feature: "Semantic Cache Storage",
          description: "LLM responses are cached in Redis hashes with their prompt embeddings, enabling sub-millisecond lookups that can serve cached responses for similar prompts without hitting the LLM provider.",
        },
        {
          feature: "Embedding Similarity Search",
          description: "Redis sorted sets store prompt embeddings with similarity scores, allowing the gateway to find cached responses that are semantically similar (above a configurable threshold) to incoming prompts.",
        },
        {
          feature: "Rate Limiting Counters",
          description: "Token bucket rate limiting is implemented using Redis counters with TTL, providing distributed rate limiting that works correctly across multiple gateway instances.",
        },
        {
          feature: "Cache TTL and Eviction",
          description: "Cache entries have configurable TTL values and are evicted using LRU policy when Redis reaches its memory limit, ensuring the cache stays fresh and within resource bounds.",
        },
        {
          feature: "Circuit Breaker State",
          description: "Provider circuit breaker states (closed, open, half-open) and failure counters are stored in Redis, enabling consistent circuit breaker behavior across all gateway instances.",
        },
      ],
      coreConceptsMarkdown: `### Data Structures

\`\`\`
# Strings
SET key "value"
GET key

# Hashes (objects)
HSET user:1 name "Alice" age 30
HGET user:1 name
HGETALL user:1

# Lists (queues)
LPUSH queue "task1"
RPOP queue

# Sorted Sets (ranked data)
ZADD leaderboard 100 "player1"
ZRANGE leaderboard 0 -1 WITHSCORES

# Expiration
SET session "data" EX 3600  # expires in 1 hour
TTL session                  # check remaining time
\`\`\`

### Persistence Options

- **RDB (Redis Database):** Point-in-time snapshots at intervals. Fast recovery but data loss between snapshots.
- **AOF (Append-Only File):** Logs every write operation. Slower recovery but minimal data loss. Configurable fsync policy (always, every second, never).
- **RDB + AOF:** Best of both worlds. AOF for durability, RDB for fast restart.

### Pub/Sub & Streams

\`\`\`
# Pub/Sub (fire-and-forget)
SUBSCRIBE channel
PUBLISH channel "message"

# Streams (persistent, consumer groups)
XADD mystream * field value
XREAD COUNT 10 STREAMS mystream 0
\`\`\`

### Eviction Policies

When Redis reaches memory limit:
- \`noeviction\` — return errors on writes
- \`allkeys-lru\` — evict least recently used keys
- \`volatile-lru\` — evict LRU keys with TTL set
- \`allkeys-random\` — evict random keys
- \`volatile-ttl\` — evict keys with shortest TTL`,
      prosAndCons: {
        pros: [
          "Sub-millisecond latency — 100K+ ops/sec on single node",
          "Rich data structures — not just key-value",
          "Atomic operations — no race conditions",
          "Pub/Sub and Streams for real-time messaging",
          "Lua scripting for complex atomic operations",
          "Redis Cluster for horizontal scaling",
        ],
        cons: [
          "Memory-bound — dataset must fit in RAM",
          "Single-threaded for commands (I/O is multi-threaded in Redis 6+)",
          "Persistence adds latency and complexity",
          "No built-in query language (no SQL, no secondary indexes)",
          "Licensing controversy — Redis Ltd changed to SSPL, forks like Valkey emerged",
          "Data modeling requires different thinking than relational databases",
        ],
      },
      alternatives: [
        {
          name: "Memcached",
          comparison:
            "Simpler, multi-threaded, slightly faster for basic key-value caching. But no data structures, no persistence, no pub/sub. Redis is a superset of Memcached's functionality.",
        },
        {
          name: "Valkey",
          comparison:
            "Open-source fork of Redis (after Redis Ltd's license change). Fully compatible, community-governed. Backed by Linux Foundation, AWS, Google.",
        },
        {
          name: "KeyDB",
          comparison:
            "Multi-threaded Redis fork. Higher throughput on multi-core machines but less community adoption.",
        },
        {
          name: "DragonflyDB",
          comparison:
            "Modern Redis-compatible in-memory store. Multi-threaded, better memory efficiency. But newer and less battle-tested.",
        },
      ],
      keyAPIs: [
        "GET/SET/DEL — basic key operations",
        "HSET/HGET/HGETALL — hash operations",
        "LPUSH/RPOP/LRANGE — list operations",
        "ZADD/ZRANGE/ZSCORE — sorted set operations",
        "EXPIRE/TTL — key expiration",
        "MULTI/EXEC — transactions",
        "EVAL — Lua scripting",
      ],
      academicFoundations: `**In-Memory Computing:** Redis is built on the principle that RAM access (100ns) is 1000x faster than SSD access (100μs) and 100,000x faster than HDD access (10ms). This is the fundamental argument for in-memory databases, studied extensively in the database systems community.

**Hash Tables:** Redis's core data structure is a hash table with incremental rehashing. When the table needs to grow, Redis maintains two tables simultaneously and migrates entries gradually to avoid blocking.

**Skip Lists (Pugh, 1990):** Redis sorted sets use skip lists — a probabilistic data structure that provides O(log n) search, insert, and delete. Skip lists are simpler to implement than balanced trees while providing similar performance guarantees.

**Probabilistic Data Structures:** HyperLogLog (Flajolet et al., 2007) estimates cardinality with <1% error using only 12KB of memory, regardless of the number of unique elements. This is used for counting unique visitors, distinct queries, etc.

**Event Sourcing:** Redis Streams implement the event sourcing pattern where state is derived from an append-only log of events. This is based on Pat Helland's "Immutability Changes Everything" principle.`,
      furtherReading: [
        "Redis documentation — redis.io/docs",
        "Redis in Action by Josiah Carlson (Manning)",
        "Designing Data-Intensive Applications by Martin Kleppmann (Chapter 1, 5)",
        "The Little Redis Book — openmymind.net/redis.pdf",
      ],
    },
    {
      name: "Prometheus",
      category: "observability",
      icon: "PM",
      tagline: "Metrics monitoring and alerting toolkit",
      origin: {
        creator: "Matt T. Proud & Julius Volz at SoundCloud",
        year: 2012,
        motivation:
          "SoundCloud's microservices architecture needed a monitoring system that could handle dynamic service discovery and high-dimensional metrics. Inspired by Google's Borgmon internal monitoring system.",
      },
      whatItIs: `Prometheus is an open-source monitoring and alerting toolkit that collects and stores time-series metrics data. It's the de facto standard for cloud-native monitoring.

Key components:
- **Prometheus Server** — scrapes and stores metrics
- **Client Libraries** — instrument your code (prom-client for Node.js)
- **Alertmanager** — handles alerts (routing, deduplication, silencing)
- **PromQL** — powerful query language for metrics`,
      explainLikeImTen: `Imagine you have a fitness tracker on your wrist that counts your steps, measures your heart rate, and tracks your sleep. Now imagine one for your computer program. Prometheus is that fitness tracker for software. It checks on your program every few seconds and writes down numbers like "how many requests did you handle?" and "how fast were you?" Then you can look at graphs to see if your program is healthy or if something is wrong — just like checking your step count at the end of the day.`,
      realWorldAnalogy: `Prometheus is like a hospital's patient monitoring system. The monitors (client libraries) are attached to each patient (service), continuously measuring vital signs (metrics) like heart rate (request rate), blood pressure (latency), and temperature (error rate). Nurses (Grafana dashboards) check the readings, and alarms (Alertmanager) go off when something is outside normal range.`,
      whyWeUsedIt: `An LLM gateway needs real-time visibility into:
- Request rates and error rates by provider
- Latency distributions (p50, p95, p99)
- Token consumption and cost tracking
- Cache hit rates
- Circuit breaker states

Prometheus is the industry standard for this. The \`prom-client\` library provides a simple API to expose metrics that Prometheus scrapes, and Grafana dashboards visualize them.`,
      howItWorksInProject: `- \`prom-client\` library instruments the gateway code
- Custom metrics: request_duration_histogram, token_usage_counter, cache_hits_total, provider_errors_total
- Prometheus runs as a Docker container and scrapes the gateway's /metrics endpoint
- Grafana connects to Prometheus as a data source and displays pre-built dashboards
- Alert rules defined for budget overruns and high error rates`,
      featuresInProject: [
        {
          feature: "Request Duration Histograms",
          description: "A Prometheus histogram tracks request latency distributions by provider and model, enabling p50/p95/p99 latency calculations for routing decisions and SLA monitoring.",
        },
        {
          feature: "Token Usage Counters",
          description: "Counters track prompt and completion token consumption per organization, user, provider, and model, enabling real-time cost tracking and budget enforcement alerts.",
        },
        {
          feature: "Cache Hit/Miss Ratio Tracking",
          description: "Counters for cache hits and misses enable real-time monitoring of semantic cache effectiveness, helping tune the similarity threshold and cache TTL for optimal cost savings.",
        },
        {
          feature: "Provider Error Rate Monitoring",
          description: "Error counters labeled by provider and error type enable circuit breaker tuning and alert rules that fire when a provider's error rate exceeds acceptable thresholds.",
        },
        {
          feature: "Grafana Dashboard Integration",
          description: "Pre-built Grafana dashboards query Prometheus metrics to visualize cost trends, latency distributions, provider health, and cache performance in real-time panels.",
        },
      ],
      coreConceptsMarkdown: `### Pull-Based Architecture

Unlike push-based systems (StatsD, Datadog agent), Prometheus **pulls** metrics from targets:
1. Application exposes metrics at \`/metrics\` endpoint
2. Prometheus scrapes this endpoint at a configured interval (e.g., 15s)
3. Metrics are stored in Prometheus's time-series database

**Why pull over push?**
- Prometheus knows which targets are healthy (if scrape fails, target is down)
- No need for a push gateway or agent on the target
- Easier to run locally — just point Prometheus at your dev server

### Metric Types

\`\`\`typescript
import { Counter, Histogram, Gauge } from "prom-client";

// Counter — only goes up (requests, errors, bytes)
const requestsTotal = new Counter({
  name: "http_requests_total",
  help: "Total HTTP requests",
  labelNames: ["method", "status", "provider"],
});
requestsTotal.inc({ method: "POST", status: "200", provider: "openai" });

// Histogram — measures distributions (latency, size)
const requestDuration = new Histogram({
  name: "http_request_duration_seconds",
  help: "Request duration in seconds",
  labelNames: ["method"],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 5],
});
requestDuration.observe({ method: "POST" }, 0.234);

// Gauge — goes up and down (temperature, connections, queue size)
const activeConnections = new Gauge({
  name: "active_connections",
  help: "Current active connections",
});
activeConnections.inc();
activeConnections.dec();
\`\`\`

### PromQL (Prometheus Query Language)

\`\`\`
# Rate of requests per second (over 5 minutes)
rate(http_requests_total[5m])

# 95th percentile latency
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))

# Error rate percentage
sum(rate(http_requests_total{status=~"5.."}[5m]))
/ sum(rate(http_requests_total[5m])) * 100

# Top 5 most expensive providers
topk(5, sum by (provider) (rate(token_usage_total[1h])))
\`\`\``,
      prosAndCons: {
        pros: [
          "Industry standard for cloud-native monitoring",
          "Powerful query language (PromQL)",
          "Pull-based architecture is simple and reliable",
          "Excellent Grafana integration for dashboards",
          "Built-in alerting with Alertmanager",
          "CNCF graduated project — strong governance and community",
        ],
        cons: [
          "Not designed for long-term storage (default 15-day retention)",
          "Pull model doesn't work for short-lived batch jobs (need Pushgateway)",
          "High cardinality labels can cause memory issues",
          "No built-in distributed/HA mode (need Thanos or Cortex)",
          "PromQL has a learning curve",
        ],
      },
      alternatives: [
        {
          name: "Datadog",
          comparison:
            "Commercial SaaS monitoring platform. Push-based, fully managed, excellent UI. But expensive at scale ($15-23/host/month) and vendor lock-in.",
        },
        {
          name: "Grafana Mimir",
          comparison:
            "Horizontally scalable, long-term storage for Prometheus. Prometheus-compatible but adds operational complexity.",
        },
        {
          name: "InfluxDB",
          comparison:
            "Purpose-built time-series database with its own query language (Flux). Good for IoT/metrics but less ecosystem integration than Prometheus.",
        },
        {
          name: "OpenTelemetry",
          comparison:
            "Not a direct replacement but a vendor-neutral telemetry standard. OTel collectors can export to Prometheus, making them complementary rather than competitive.",
        },
      ],
      keyAPIs: [
        "Counter — monotonically increasing metric",
        "Gauge — value that goes up and down",
        "Histogram — distribution of values in configurable buckets",
        "Summary — similar to histogram with pre-calculated quantiles",
        "register.metrics() — expose all metrics",
        "PromQL — query language for alerting and dashboards",
      ],
      academicFoundations: `**Time-Series Data Model:** Prometheus models every metric as a time series identified by a metric name and a set of key-value labels. This is based on the dimensional data model used in data warehousing (Kimball, 1996).

**TSDB (Time-Series Database):** Prometheus's storage engine uses a custom TSDB optimized for write-heavy, time-ordered data. It uses gorilla compression (Facebook, 2015) to achieve 12x compression on time-series data by storing XOR of consecutive values.

**The Four Golden Signals (Google SRE):** Prometheus is designed around Google's four golden signals of monitoring: Latency, Traffic, Errors, and Saturation. These are the minimum metrics needed to understand service health.

**Control Theory:** Alerting in Prometheus is based on control theory — you define thresholds (setpoints) and the system alerts when metrics deviate beyond acceptable bounds. The \`for\` clause in alert rules acts as a debounce/hysteresis to avoid flapping.`,
      furtherReading: [
        "Prometheus: Up & Running by Brian Brazil (O'Reilly)",
        "Google SRE Book — Chapter 6: Monitoring Distributed Systems",
        "Gorilla paper: A Fast, Scalable, In-Memory TSDB (Facebook, 2015)",
      ],
    },
    {
      name: "Zod",
      category: "library",
      icon: "ZD",
      tagline: "TypeScript-first schema validation",
      origin: {
        creator: "Colin McDonnell",
        year: 2020,
        motivation:
          "TypeScript types are erased at runtime — they can't validate API inputs, environment variables, or external data. Zod creates schemas that validate at runtime AND infer TypeScript types, eliminating type duplication.",
      },
      whatItIs: `Zod is a TypeScript-first schema validation library. You define a schema once and get:
1. **Runtime validation** — parse unknown data and get type-safe results
2. **TypeScript types** — infer static types from schemas (no duplication)
3. **Error messages** — detailed, structured error reporting`,
      explainLikeImTen: `Imagine you're a bouncer at a party, and you have a guest list. Before anyone comes in, you check: "Is your name on the list? Are you old enough? Do you have your invitation?" Zod does the same thing for data coming into your program. When someone sends information to your app, Zod checks it against a set of rules you wrote. If everything looks good, the data comes in. If something's wrong — like a missing name or a weird number — Zod stops it at the door and explains exactly what's wrong.`,
      realWorldAnalogy: `Zod is like airport security screening. Every piece of luggage (incoming data) goes through an X-ray machine (schema validation). The machine checks that nothing prohibited is inside and everything matches the declared contents. If something doesn't match, the item is flagged with a specific reason. Cleared items get a "verified" tag (TypeScript type) that downstream processes can trust.`,
      whyWeUsedIt: `The LLM gateway receives external HTTP requests and must validate them before processing. Zod schemas:
- Validate incoming request bodies (model, messages, parameters)
- Validate environment variables at startup
- Validate provider API responses
- Generate TypeScript types automatically — single source of truth`,
      howItWorksInProject: `- Request validation via \`@hono/zod-validator\` middleware
- Environment variable validation in \`src/env.ts\`
- Provider response schemas for type-safe response handling
- Shared schemas between routes and database operations`,
      featuresInProject: [
        {
          feature: "Chat Completion Request Validation",
          description: "Zod schemas validate incoming /v1/chat/completions requests — checking model names, message arrays, role enums, temperature ranges, and optional parameters before the request reaches the routing engine.",
        },
        {
          feature: "Environment Variable Validation",
          description: "At startup, Zod schemas in src/env.ts validate all required environment variables (database URLs, API keys, port numbers), failing fast with clear errors if configuration is missing or malformed.",
        },
        {
          feature: "Provider Response Parsing",
          description: "Zod schemas parse and validate responses from LLM providers (OpenAI, Anthropic, Ollama), ensuring the gateway handles provider API changes gracefully with structured error reporting.",
        },
        {
          feature: "Routing Configuration Validation",
          description: "Routing strategy configurations (weights, priorities, cost thresholds) are validated with Zod schemas, preventing misconfigurations that could lead to incorrect provider selection or cost overruns.",
        },
        {
          feature: "Type Inference for Route Handlers",
          description: "Zod schemas used with @hono/zod-validator automatically infer TypeScript types for validated request bodies, eliminating manual type annotations in route handlers.",
        },
      ],
      coreConceptsMarkdown: `### Basic Schemas

\`\`\`typescript
import { z } from "zod";

// Primitives
const nameSchema = z.string().min(1).max(100);
const ageSchema = z.number().int().positive();
const emailSchema = z.string().email();

// Objects
const userSchema = z.object({
  name: nameSchema,
  age: ageSchema,
  email: emailSchema,
});

// Infer TypeScript type
type User = z.infer<typeof userSchema>;
// { name: string; age: number; email: string }

// Parse (throws on invalid)
const user = userSchema.parse(unknownData);

// SafeParse (returns result object)
const result = userSchema.safeParse(unknownData);
if (result.success) {
  console.log(result.data); // typed as User
} else {
  console.log(result.error.issues); // validation errors
}
\`\`\`

### Advanced Patterns

\`\`\`typescript
// Unions (discriminated)
const responseSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("success"), data: z.unknown() }),
  z.object({ type: z.literal("error"), message: z.string() }),
]);

// Transforms
const dateSchema = z.string().transform((s) => new Date(s));

// Refinements
const passwordSchema = z.string().refine(
  (s) => /[A-Z]/.test(s) && /[0-9]/.test(s),
  "Must contain uppercase letter and number"
);

// Coercion
const portSchema = z.coerce.number().int().min(1).max(65535);
\`\`\``,
      prosAndCons: {
        pros: [
          "Single source of truth — schema defines both validation and types",
          "Excellent TypeScript inference — no manual type duplication",
          "Composable — build complex schemas from simple ones",
          "Great error messages with structured error objects",
          "Zero dependencies, small bundle (~13KB)",
          "Transform and refine for custom validation logic",
        ],
        cons: [
          "Runtime overhead — validation has a cost (microseconds per parse)",
          "Bundle size matters for client-side usage",
          "Complex schemas can be hard to read",
          "No built-in i18n for error messages",
        ],
      },
      alternatives: [
        {
          name: "Yup",
          comparison:
            "Older validation library. Similar API but weaker TypeScript inference and larger bundle. Zod was designed to fix Yup's TypeScript shortcomings.",
        },
        {
          name: "Joi",
          comparison:
            "Hapi ecosystem validator. Feature-rich but no TypeScript type inference, large bundle, and designed for Node.js (not browser-friendly).",
        },
        {
          name: "Valibot",
          comparison:
            "Newer alternative with smaller bundle size (tree-shakeable). Functional API style. Good TypeScript support but smaller ecosystem.",
        },
        {
          name: "ArkType",
          comparison:
            "Type-safe validation using TypeScript syntax directly. Interesting approach but early stage and less adoption.",
        },
      ],
      keyAPIs: [
        "z.string() / z.number() / z.boolean() — primitives",
        "z.object({}) — object schemas",
        "z.array() — array schemas",
        "z.union() / z.discriminatedUnion() — union types",
        ".parse() / .safeParse() — validation",
        "z.infer<typeof schema> — type inference",
        ".transform() / .refine() — custom logic",
      ],
      academicFoundations: `**Dependent Types:** Zod's refinements are a limited form of dependent types — types whose definition depends on values. Full dependent type systems exist in Idris, Agda, and Coq, but Zod provides practical refinement types for JavaScript.

**Design by Contract (Meyer, 1986):** Zod schemas act as contracts — preconditions on function inputs. This is related to Bertrand Meyer's Design by Contract methodology where functions specify what they require (preconditions) and what they guarantee (postconditions).

**Parsing, not Validating:** Zod follows the "parse, don't validate" philosophy (Alexis King, 2019). Instead of checking if data is valid and then casting, you parse it into a typed result — making invalid states unrepresentable in your type system.`,
      furtherReading: [
        "Zod documentation — zod.dev",
        "Parse, Don't Validate — lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate",
        "Colin McDonnell's talk: Zod — TypeScript-First Schema Validation",
      ],
    },
    {
      name: "Docker",
      category: "infrastructure",
      icon: "DK",
      tagline: "Containerization platform",
      origin: {
        creator: "Solomon Hykes at dotCloud",
        year: 2013,
        motivation:
          "dotCloud was a PaaS provider that needed a way to package and deploy applications consistently. Solomon Hykes built Docker as an internal tool that used Linux containers (LXC) to isolate applications. It was open-sourced at PyCon 2013.",
      },
      whatItIs: `Docker is a platform for building, shipping, and running applications in containers. A container is a lightweight, standalone, executable package that includes everything needed to run an application: code, runtime, libraries, and system tools.

**Key concepts:**
- **Image:** A read-only template with instructions for creating a container (like a class)
- **Container:** A running instance of an image (like an object)
- **Dockerfile:** Recipe for building an image
- **Docker Compose:** Tool for defining multi-container applications
- **Registry:** Storage for images (Docker Hub, GitHub Container Registry)`,
      explainLikeImTen: `Imagine you want to share your science project with a friend. Instead of giving them a list of materials and hoping they build it the same way, you put your entire project into a magic box that works exactly the same on any table. Docker is that magic box for software. You pack your program and everything it needs (databases, tools, settings) into containers, and those containers run exactly the same way on any computer. No more "it works on my computer but not yours!"`,
      realWorldAnalogy: `Docker is like shipping containers in global trade. Before containers, loading a ship meant handling thousands of different-sized boxes, barrels, and crates — chaos. Standardized shipping containers changed everything: any cargo fits in the same container, any crane can load it, and any truck can carry it. Docker does the same for software — your app and all its dependencies go in a standard container that runs identically everywhere.`,
      whyWeUsedIt: `The LLM gateway has multiple runtime dependencies (PostgreSQL, Redis, Prometheus, Grafana). Docker Compose lets you start the entire stack with a single command:

\`docker compose up\`

Without Docker, you'd need to install PostgreSQL, Redis, Prometheus, and Grafana separately, configure each one, and hope the versions are compatible. Docker eliminates "works on my machine" entirely.

The multi-stage Dockerfile also creates an optimized production image — the build stage includes TypeScript compiler and dev dependencies, but the production stage only includes the compiled JavaScript and production dependencies.`,
      howItWorksInProject: `- \`Dockerfile\` — multi-stage build: build (tsc compile) → production (node:20-alpine)
- \`docker-compose.yml\` — defines services: gateway, postgres, redis, prometheus, grafana
- Volume mounts for database persistence and Prometheus/Grafana configs
- Network isolation between services
- Environment variables passed via \`.env\` file`,
      featuresInProject: [
        {
          feature: "Multi-Stage Production Build",
          description: "The Dockerfile uses a multi-stage build — the first stage compiles TypeScript with tsc, and the second stage creates a slim Node.js 20 Alpine image with only compiled JavaScript and production dependencies.",
        },
        {
          feature: "Full Local Development Stack",
          description: "Docker Compose defines the entire development stack (gateway, PostgreSQL, Redis, Prometheus, Grafana) so developers can start everything with a single 'docker compose up' command.",
        },
        {
          feature: "Service Networking",
          description: "Docker Compose creates an isolated network where services communicate using service names as hostnames (e.g., the gateway connects to 'postgres:5432' and 'redis:6379').",
        },
        {
          feature: "Persistent Data Volumes",
          description: "Docker volumes persist PostgreSQL data, Redis snapshots, and Grafana dashboard configurations across container restarts, preventing data loss during development.",
        },
        {
          feature: "Pre-configured Observability Stack",
          description: "Prometheus and Grafana containers are pre-configured with scrape targets and dashboard JSON files mounted as volumes, providing out-of-the-box monitoring with zero manual setup.",
        },
      ],
      coreConceptsMarkdown: `### Container vs VM

| Feature | Container | Virtual Machine |
|---------|-----------|-----------------|
| Isolation | Process-level (namespaces) | Hardware-level (hypervisor) |
| Startup | Milliseconds | Minutes |
| Size | MB | GB |
| Overhead | Minimal | Significant |
| OS | Shares host kernel | Full guest OS |

### Linux Kernel Features

Docker containers are built on Linux kernel features:
- **Namespaces:** Isolate process IDs, network, filesystem, users
- **cgroups:** Limit CPU, memory, I/O usage per container
- **Union filesystems (OverlayFS):** Layer-based filesystem for efficient image storage

### Dockerfile Best Practices

\`\`\`dockerfile
# Multi-stage build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
EXPOSE 3000
CMD ["node", "dist/index.js"]
\`\`\`

### Docker Compose

\`\`\`yaml
services:
  api:
    build: .
    ports: ["3000:3000"]
    depends_on: [db, redis]
    environment:
      DATABASE_URL: postgres://user:pass@db:5432/mydb

  db:
    image: postgres:16-alpine
    volumes: [postgres_data:/var/lib/postgresql/data]

  redis:
    image: redis:7-alpine

volumes:
  postgres_data:
\`\`\``,
      prosAndCons: {
        pros: [
          "Eliminates 'works on my machine' — identical environments everywhere",
          "Fast startup (ms) compared to VMs (minutes)",
          "Efficient resource usage — containers share host kernel",
          "Massive ecosystem — Docker Hub has millions of pre-built images",
          "Reproducible builds — Dockerfile is version-controlled",
          "Microservices-friendly — each service in its own container",
        ],
        cons: [
          "Linux-specific features — Docker Desktop on Mac/Windows runs a Linux VM",
          "Security — containers share the host kernel, escape vulnerabilities exist",
          "Persistent storage is complex (volumes, bind mounts)",
          "Networking between containers has a learning curve",
          "Image size management requires attention (multi-stage builds)",
          "Docker Desktop licensing changes (paid for large enterprises)",
        ],
      },
      alternatives: [
        {
          name: "Podman",
          comparison:
            "Daemonless, rootless container engine. Drop-in Docker CLI replacement. Better security model (no root daemon) but smaller ecosystem. RedHat-backed.",
        },
        {
          name: "containerd",
          comparison:
            "Lower-level container runtime (Docker actually uses containerd under the hood). Used directly by Kubernetes. No developer-facing CLI.",
        },
        {
          name: "Nix",
          comparison:
            "Reproducible build system, not containers. Nix derivations ensure identical builds without containerization overhead. Steeper learning curve but more principled approach.",
        },
        {
          name: "Virtual Machines (VMware, QEMU)",
          comparison:
            "Full hardware virtualization with stronger isolation. Better for running different OSes but much heavier (GB vs MB, minutes vs ms startup).",
        },
      ],
      keyAPIs: [
        "docker build — build image from Dockerfile",
        "docker run — create and start container",
        "docker compose up/down — manage multi-container apps",
        "docker exec — run command in running container",
        "docker logs — view container logs",
        "docker volume — manage persistent storage",
        "docker network — manage container networks",
      ],
      academicFoundations: `**Operating System Virtualization:** Containers are a form of OS-level virtualization, as opposed to hardware-level virtualization (VMs). The theoretical foundation is process isolation — ensuring one process cannot access another's memory, filesystem, or network.

**Namespaces (Plan 9, 1995):** Linux namespaces, which Docker relies on, were inspired by the Plan 9 operating system from Bell Labs. Plan 9's per-process namespaces allowed each process to have its own view of the filesystem.

**Resource Cgroups:** Control groups (cgroups) were developed by Google engineers (Paul Menage, Rohit Seth) for managing resource allocation in Google's data centers. They were contributed to the Linux kernel in 2008.

**Union Filesystems:** Docker's layered image format is based on union mount filesystems (UnionFS, AUFS, OverlayFS) where multiple filesystem layers are merged into a single coherent view. This enables efficient image sharing — common base layers are stored once.

**Immutable Infrastructure (Chad Fowler, 2013):** Docker popularized the concept of immutable infrastructure — servers are never modified after deployment. Instead, you build a new image and replace the old container. This eliminates configuration drift.`,
      furtherReading: [
        "Docker documentation — docs.docker.com",
        "Docker Deep Dive by Nigel Poulton",
        "The Docker Book by James Turnbull",
        "Linux Namespaces — man7.org/linux/man-pages/man7/namespaces.7.html",
      ],
    },
    {
      name: "Vitest",
      category: "testing",
      icon: "VT",
      tagline: "Blazing-fast unit testing powered by Vite",
      origin: {
        creator: "Anthony Fu & Vitest team",
        year: 2022,
        motivation:
          "Jest was the dominant test runner but suffered from slow startup, complex configuration, and poor ESM support. Vitest leverages Vite's transform pipeline for near-instant test execution.",
      },
      whatItIs: `Vitest is a Vite-native testing framework that provides:
- Jest-compatible API (drop-in replacement)
- Native ESM, TypeScript, JSX support (no configuration)
- HMR-like watch mode — only re-runs affected tests
- Built-in code coverage (v8 or Istanbul)
- Snapshot testing, mocking, spy functions`,
      explainLikeImTen: `Before a car company sells a new car, they crash-test it, test the brakes, and check if the airbags work. Vitest does the same thing for code. You write little experiments that say "when I do X, Y should happen." Then Vitest runs all those experiments super fast and tells you if anything is broken. It's like having a robot assistant that tests every part of your program in seconds, so you know everything works before real people use it.`,
      realWorldAnalogy: `Vitest is like a quality control inspector on a factory assembly line. Each test is a specific check: "Does this bolt hold under pressure? Does this circuit light up? Does this button click?" The inspector runs through every check rapidly after each change to the product. If something fails, the line stops and you fix it before shipping — catching defects early when they're cheap to fix.`,
      whyWeUsedIt: `The LLM gateway uses ESM and TypeScript throughout. Vitest:
- Runs TypeScript tests without separate compilation
- Understands ES modules natively (no CommonJS transform)
- Jest-compatible API means familiar syntax
- Watch mode re-runs only changed tests in milliseconds`,
      howItWorksInProject: `- \`vitest.config.ts\` configures test environment
- Tests in \`tests/\` directory test routing logic, caching, budget enforcement
- Mocks for external providers (no real API calls in tests)
- Coverage reports generated with \`vitest run --coverage\``,
      featuresInProject: [
        {
          feature: "Routing Logic Unit Tests",
          description: "Tests verify that the routing engine correctly selects providers based on cost, latency, and capability strategies, including edge cases like all providers being unavailable.",
        },
        {
          feature: "Semantic Cache Tests",
          description: "Tests validate cache hit/miss behavior, similarity threshold logic, TTL expiration, and LRU eviction to ensure the caching layer saves costs without serving stale responses.",
        },
        {
          feature: "Budget Enforcement Tests",
          description: "Tests verify that requests are rejected when organizations exceed their token budgets, including concurrent request scenarios that could cause race-condition overspending.",
        },
        {
          feature: "Provider Mock Testing",
          description: "vi.mock() replaces real LLM provider API calls with mock responses, enabling fast tests that validate request transformation, error handling, and response parsing without network calls.",
        },
        {
          feature: "Circuit Breaker Behavior Tests",
          description: "Tests simulate provider failures to verify that the circuit breaker transitions through closed, open, and half-open states correctly, and that failover routing engages as expected.",
        },
      ],
      coreConceptsMarkdown: `### Test Structure

\`\`\`typescript
import { describe, it, expect, vi } from "vitest";

describe("Router", () => {
  it("selects cheapest provider", () => {
    const result = selectProvider(providers, { strategy: "cost" });
    expect(result.name).toBe("ollama");
  });

  it("falls back on provider failure", async () => {
    const mockProvider = vi.fn().mockRejectedValueOnce(new Error("down"));
    const result = await routeWithFailover(mockProvider);
    expect(result.provider).toBe("fallback");
  });
});
\`\`\`

### Mocking

\`\`\`typescript
// Mock modules
vi.mock("./providers/openai", () => ({
  complete: vi.fn().mockResolvedValue({ text: "mocked" }),
}));

// Spy on methods
const spy = vi.spyOn(cache, "get");
await handleRequest(req);
expect(spy).toHaveBeenCalledWith("cache-key");
\`\`\``,
      prosAndCons: {
        pros: [
          "Near-instant startup — uses Vite's transform pipeline",
          "Native ESM and TypeScript — zero configuration",
          "Jest-compatible API — easy migration",
          "Smart watch mode — HMR for tests",
          "Built-in coverage, mocking, snapshots",
        ],
        cons: [
          "Vite-specific — not ideal for non-Vite projects",
          "Younger than Jest — fewer community plugins",
          "Some Jest plugins don't have Vitest equivalents",
          "Browser mode is still experimental",
        ],
      },
      alternatives: [
        {
          name: "Jest",
          comparison:
            "Most popular JavaScript test framework. Mature, huge ecosystem, but slow startup, complex ESM support, and requires babel/ts-jest for TypeScript.",
        },
        {
          name: "Node.js Test Runner",
          comparison:
            "Built into Node.js (v18+). Zero dependencies but minimal features — no built-in mocking framework, no watch mode, no coverage.",
        },
        {
          name: "Mocha + Chai",
          comparison:
            "Flexible test framework + assertion library. Highly configurable but requires more setup and doesn't include mocking or coverage.",
        },
      ],
      keyAPIs: [
        "describe() / it() / test() — test structure",
        "expect() — assertions",
        "vi.fn() / vi.mock() / vi.spyOn() — mocking",
        "beforeEach() / afterEach() — setup/teardown",
        "vitest run — single run",
        "vitest watch — watch mode",
      ],
      academicFoundations: `**xUnit Architecture (Kent Beck, 1998):** Vitest follows the xUnit pattern — test fixtures (beforeEach/afterEach), test cases (it/test), assertions (expect), and test suites (describe). This pattern originated with SUnit for Smalltalk and was popularized by JUnit for Java.

**Test Doubles (Gerard Meszaros, 2007):** Vitest's vi.fn(), vi.mock(), vi.spyOn() implement test doubles — stubs, mocks, spies, and fakes. Meszaros's taxonomy in "xUnit Test Patterns" formalized these concepts.

**Test-Driven Development (Kent Beck, 2003):** The Red-Green-Refactor cycle: write a failing test, make it pass, then refactor. Vitest's fast watch mode makes this cycle nearly instant.`,
      furtherReading: [
        "Vitest documentation — vitest.dev",
        "Testing JavaScript with Kent C. Dodds",
        "xUnit Test Patterns by Gerard Meszaros",
      ],
    },
  ],
};
