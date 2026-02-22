import type { Project } from "../types";

export const llmGateway: Project = {
  id: "llm-gateway",
  name: "LLM Gateway",
  description:
    "Multi-tenant SaaS LLM gateway with cost-optimized routing, semantic caching, per-tenant isolation, Stripe billing, and a Next.js control dashboard. Drop-in OpenAI API replacement.",
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
        "The middleware chain (logging, tenant resolution, auth, rate-limit, cache-check, metrics) decorates each incoming request with cross-cutting concerns before it reaches the route handler.",
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
        "Drizzle ORM provides the repository abstraction over PostgreSQL, encapsulating usage logs, budget queries, organization lookups, and provider configurations behind typed query methods.",
    },
    {
      name: "Factory Pattern",
      category: "creational",
      whatItIs:
        "Encapsulates object creation logic, allowing the system to instantiate objects without specifying their exact class at compile time.",
      howProjectUsesIt:
        "Provider instances (OpenAI, Anthropic, Ollama) are created through a factory that reads per-tenant configuration and instantiates the correct provider adapter with the tenant's own keys or platform fallback credentials.",
    },
    {
      name: "Tenant Isolation Pattern",
      category: "architectural",
      whatItIs:
        "Ensures that each tenant in a multi-tenant system operates in a logically isolated environment where their data, configuration, rate limits, and resource consumption cannot leak into or be affected by other tenants. Isolation is enforced at every layer: database (Row Level Security, org-scoped queries), cache (namespaced keys), rate limiting (per-org counters), and provider credentials (per-org key vaults).",
      howProjectUsesIt:
        "Every request is resolved to an organization via the tenant resolution middleware (API key lookup). From that point, all downstream operations are scoped: Redis cache keys are prefixed with `gw:cache:{orgId}:`, rate limit counters use `ratelimit:{orgId}:{window}`, database queries filter by org_id, and provider credentials are loaded from the organization's own JSONB key vault with platform fallback. Row Level Security policies on the organizations and org_members tables ensure the Supabase dashboard queries never cross tenant boundaries.",
    },
    {
      name: "BYOK (Bring Your Own Key) Pattern",
      category: "architectural",
      whatItIs:
        "Allows tenants to supply their own API keys for third-party services rather than relying exclusively on platform-managed credentials. The system merges tenant-provided keys with platform defaults, preferring tenant keys when available and falling back to platform keys for providers the tenant has not configured. This reduces platform costs, gives enterprises direct billing relationships with providers, and satisfies compliance requirements around credential ownership.",
      howProjectUsesIt:
        "Each organization has a `provider_keys` JSONB column storing encrypted credentials for OpenAI, Anthropic, and other providers. When the provider factory creates a provider instance for a request, it checks the tenant's key vault first. If the tenant has a key for the selected provider, that key is used. Otherwise, the platform's own key is used as a fallback (available on Starter plans and above). This means enterprise customers can use their own negotiated rates and volume discounts while still benefiting from the gateway's routing, caching, and observability.",
    },
    {
      name: "Webhook Event Processing",
      category: "behavioral",
      whatItIs:
        "A pattern for handling asynchronous event notifications from external services. The system receives HTTP POST callbacks (webhooks) containing event payloads, verifies their authenticity using cryptographic signatures, and processes them idempotently to update internal state. Idempotency is critical because webhook delivery is at-least-once — the same event may be delivered multiple times.",
      howProjectUsesIt:
        "Stripe sends webhook events to the gateway's `/api/webhooks/stripe` endpoint for billing lifecycle events: `checkout.session.completed` (upgrade org plan and attach Stripe IDs), `customer.subscription.deleted` (downgrade to free plan), and `invoice.payment_failed` (flag account for follow-up). Each webhook is verified using the Stripe webhook secret and HMAC signature. Event processing is idempotent — processing the same event twice produces the same org state, preventing double-upgrades or double-downgrades.",
    },
  ],
  keyTakeaways: [
    "API gateway design for AI workloads requires fundamentally different routing logic than traditional HTTP gateways — cost, latency, and model capability all factor into routing decisions.",
    "Semantic caching with vector similarity can reduce LLM costs by 40-60% for repetitive workloads.",
    "Token budget enforcement must happen at the gateway level, not the application level, to prevent cost overruns.",
    "Prometheus metrics + Grafana dashboards are the industry standard for real-time observability.",
    "Multi-tenancy in API gateways requires isolation at every layer: database, cache, rate limits, and provider credentials.",
    "Usage-based billing with Stripe Meters allows charging per-token without building a custom metering system.",
    "BYOK (Bring Your Own Key) reduces platform costs while giving enterprises the control they need.",
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
        "Incoming prompts are embedded using a lightweight model, and their embeddings are compared against cached entries in Redis using cosine similarity. If similarity exceeds a configurable threshold (default 0.95), the cached response is returned without hitting the LLM provider. In v2, cache entries are namespaced per-tenant (`gw:cache:{orgId}:`) so tenants never see each other's cached responses.",
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
        "The routing engine compares per-token pricing across providers, checks model capabilities against request requirements, and selects the cheapest provider that satisfies the quality and capability constraints. In v2, each organization can configure custom routing weights (cost vs quality vs latency) and the router respects per-tenant provider availability based on BYOK configuration.",
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
        "Before forwarding a request to an LLM provider, the gateway checks the organization's remaining token budget in PostgreSQL. If the budget is exhausted, the request is rejected with a 429 status. Usage is logged atomically within a database transaction to prevent concurrent overspending. In v2, budgets are plan-based: Free gets 100K tokens/month, Starter gets 1M, Growth gets 10M, Scale gets 100M, and Enterprise gets unlimited.",
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
    {
      name: "Multi-Tenancy",
      slug: "multi-tenancy",
      whatItIs:
        "A software architecture where a single instance of the application serves multiple customers (tenants), each with logically isolated data, configuration, and resource limits. There are three main approaches: silo (separate infrastructure per tenant), pool (shared everything with logical isolation), and bridge (shared compute, separate databases). Multi-tenancy is the foundation of SaaS economics — it allows one deployment to serve thousands of customers, amortizing infrastructure costs across all of them.",
      whyItMatters:
        "Without multi-tenancy, you need separate deployments for each customer, which is operationally expensive and does not scale. Multi-tenancy enables SaaS pricing models where customers pay based on usage rather than infrastructure. However, it introduces complexity around data isolation, noisy neighbor problems, and fair resource allocation. Getting isolation wrong in a multi-tenant system can lead to data leaks, security breaches, and compliance failures.",
      howProjectUsesIt:
        "The LLM Gateway uses the pool approach (shared database with logical isolation). All organizations share the same PostgreSQL instance, Redis cluster, and application servers, but every query is scoped by org_id, every cache key is prefixed with the org ID, and every rate limit counter is org-specific. Row Level Security (RLS) policies on Supabase ensure that dashboard queries through the Supabase client never cross tenant boundaries. The organizations table stores per-tenant configuration: plan tier, budget limits, routing weights, and provider API keys.",
      keyTerms: [
        {
          term: "Tenant",
          definition:
            "A single customer organization that uses the SaaS platform. Each tenant has its own users, API keys, configuration, and usage data, logically isolated from other tenants.",
        },
        {
          term: "Tenant Resolution",
          definition:
            "The process of determining which tenant a request belongs to, typically by looking up an API key or JWT token and mapping it to an organization ID.",
        },
        {
          term: "Noisy Neighbor",
          definition:
            "A problem in shared infrastructure where one tenant's heavy usage degrades performance for other tenants. Mitigated by per-tenant rate limiting and resource quotas.",
        },
      ],
    },
    {
      name: "Usage-Based Billing",
      slug: "usage-based-billing",
      whatItIs:
        "A pricing model where customers are charged based on how much they consume rather than a flat subscription fee. In the context of API platforms, this typically means metering API calls, tokens processed, or compute time consumed, then billing at the end of the billing period. Stripe Meters provide the infrastructure for this: the application reports usage events in real-time, Stripe aggregates them, and the billing system charges accordingly at invoice time.",
      whyItMatters:
        "Usage-based billing aligns cost with value — customers who get more value (more API calls, more tokens) pay more. This creates natural upsell without requiring sales effort, reduces churn because customers are not locked into tiers that don't fit, and gives startups a low-barrier entry point (free tier or pay-per-use) that converts into revenue as usage grows. For AI API platforms specifically, the variable cost of LLM providers makes flat-rate pricing risky — usage-based pricing passes the variable cost through to customers while maintaining margins. The economics of SaaS pricing tiers typically follow a 10x value curve: each tier costs roughly 3x more but delivers 10x the included usage.",
      howProjectUsesIt:
        "The gateway tracks token usage per organization in real-time. After each LLM request, a Stripe Meter Event is fired with the token count. Stripe aggregates these meter events and includes them on the customer's monthly invoice. Five pricing tiers (Free, Starter at $29, Growth at $99, Scale at $299, Enterprise at $999) provide escalating token budgets. Budget enforcement happens at the gateway level — when an org exceeds their plan's token limit, requests are rejected with 429. Upgrade flows are handled via Stripe Checkout Sessions, and billing management via the Stripe Billing Portal.",
      keyTerms: [
        {
          term: "Stripe Meter Event",
          definition:
            "A real-time usage record sent to Stripe's metering system. Each event includes a customer ID, a meter name, and a quantity (e.g., tokens consumed). Stripe aggregates events and includes them on invoices.",
        },
        {
          term: "Billing Period",
          definition:
            "The time window (typically monthly) over which usage is aggregated before an invoice is generated. Budget counters reset at the start of each billing period.",
        },
        {
          term: "Overage",
          definition:
            "Usage that exceeds the included allocation in a pricing tier. Can be billed at a per-unit rate or blocked entirely depending on the platform's policy.",
        },
      ],
    },
    {
      name: "Tenant Isolation",
      slug: "tenant-isolation",
      whatItIs:
        "The set of mechanisms that ensure one tenant's data, configuration, and resource consumption are completely separated from another tenant's, even though they share the same infrastructure. Isolation operates at three levels: data isolation (tenant A cannot see tenant B's cached responses or usage logs), resource isolation (tenant A's traffic spike cannot exhaust tenant B's rate limits or budget), and provider isolation (tenant A's API keys are never used for tenant B's requests). In a pool-based multi-tenant architecture, isolation is enforced through application logic, database policies, and infrastructure namespacing rather than physical separation.",
      whyItMatters:
        "Tenant isolation is the trust foundation of any multi-tenant SaaS. A failure in isolation can result in data leaks (one tenant seeing another's data), resource starvation (noisy neighbor problem), or credential exposure (one tenant's API keys used for another's requests). These failures destroy customer trust and can have legal and compliance consequences. Isolation must be enforced at every layer of the stack, and it must be tested explicitly — you cannot assume isolation from application correctness alone.",
      howProjectUsesIt:
        "The gateway enforces isolation at every layer. Data isolation: Redis cache keys are prefixed with `gw:cache:{orgId}:`, so cache lookups only match within the same org. Database queries always include an org_id filter, and Supabase RLS policies enforce isolation at the database level even if application code has a bug. Resource isolation: rate limiting uses per-org counters (`ratelimit:{orgId}:{window}`) with plan-based limits (Free: 60 rpm, Starter: 300 rpm, Growth: 1000 rpm, Scale: 5000 rpm, Enterprise: unlimited). Provider isolation: each org's provider_keys JSONB column stores their own API keys, and the provider factory loads the correct key for each request. Platform fallback keys are only used when the tenant has not configured their own.",
      keyTerms: [
        {
          term: "Namespace Isolation",
          definition:
            "Prefixing shared resource identifiers (cache keys, queue names, metric labels) with a tenant identifier to prevent cross-tenant data access in shared infrastructure.",
        },
        {
          term: "Row Level Security (RLS)",
          definition:
            "A PostgreSQL feature that adds automatic WHERE clauses to every query based on the current user's identity, preventing queries from returning rows belonging to other tenants even if the application code forgets to filter.",
        },
        {
          term: "Plan-Based Rate Limiting",
          definition:
            "Setting different rate limit thresholds (requests per minute, tokens per minute) based on the tenant's subscription tier, ensuring fair resource allocation across pricing tiers.",
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
    {
      title: "Multi-Tenancy Architecture Patterns",
      url: "https://www.youtube.com/watch?v=x8vtmX4vF9I",
      channel: "ByteByteGo",
      durationMinutes: 10,
      relevance:
        "Silo vs pool vs bridge multi-tenancy models — the gateway uses pool with logical isolation",
    },
    {
      title: "Stripe Billing Integration for SaaS",
      url: "https://www.youtube.com/watch?v=1XKRxeo9414",
      channel: "Fireship",
      durationMinutes: 12,
      relevance:
        "Stripe subscriptions, metered billing, and webhook handling patterns used in the billing layer",
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
    {
      company: "Vercel",
      product: "Vercel Platform",
      description:
        "Vercel charges per-invocation for serverless functions and per-GB for bandwidth using a tiered usage-based pricing model. Their billing infrastructure uses Stripe Meters for real-time usage tracking — the same pattern the gateway uses for per-token billing. Vercel's Hobby/Pro/Enterprise tiers mirror the gateway's Free/Starter/Growth/Scale/Enterprise structure.",
      conceptConnection:
        "Usage-based SaaS billing with Stripe Meters, tiered pricing model",
    },
    {
      company: "Stripe",
      product: "Stripe API Platform",
      description:
        "Stripe itself uses usage-based billing for its API (2.9% + 30 cents per transaction). Their own billing infrastructure powers the gateway's payment processing — a conceptual mirror where the billing provider is also a real-world example of the billing pattern. Stripe's API key model (publishable/secret, test/live prefixes) inspired the gateway's API key design (gw-prod-, gw-stg-, gw-dev- prefixes).",
      conceptConnection:
        "Usage-based API billing, API key design patterns, webhook-driven architecture",
    },
  ],
  cicd: {
    overview:
      "TypeScript-based CI/CD pipeline with containerized local development, automated testing, dashboard builds, and database migration management.",
    stages: [
      {
        name: "Build — Gateway",
        tool: "tsc",
        description:
          "TypeScript compiled to JavaScript ES modules for the Hono gateway server.",
        commands: ["npm run build", "tsc --project tsconfig.json"],
      },
      {
        name: "Build — Dashboard",
        tool: "Next.js",
        description:
          "Next.js dashboard built with `next build`, producing optimized static and server-rendered pages for the control panel.",
        commands: ["cd dashboard && npm run build", "next build"],
      },
      {
        name: "Testing",
        tool: "Vitest",
        description:
          "Unit and integration tests run on every push, covering routing logic, tenant isolation, billing webhooks, and cache behavior.",
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
          "SQL migrations generated from TypeScript schema definitions, including multi-tenant tables (organizations, org_members, usage_daily).",
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
      "Node.js >=20, strict TypeScript mode, ES modules throughout. Dashboard: Next.js 16, Supabase Auth, Tailwind v4, shadcn/ui.",
    diagram: `[tsc build] → [next build] → [Vitest] → [Docker Build] → [docker-compose up]
                                                        ↓
                                             ┌──────────┼──────────┐
                                             │          │          │
                                         PostgreSQL   Redis   Prometheus
                                         (Supabase)            │
                                                             Grafana`,
  },
  architecture: [
    {
      title: "System Overview",
      content: `The LLM Gateway sits between client applications and multiple LLM providers (OpenAI, Anthropic, Ollama). It exposes an OpenAI-compatible API so any existing OpenAI SDK client can use it as a drop-in replacement. In v2, the gateway is multi-tenant — each organization gets isolated routing, caching, rate limits, and billing.

**Request Flow:**
1. Client sends request to gateway (OpenAI-compatible format)
2. Tenant resolution — API key lookup resolves the organization and plan
3. Rate limit check — per-tenant limits based on plan tier
4. Semantic cache check — if a similar prompt was seen before (within this tenant's namespace), return cached response
5. Token budget check — verify the org hasn't exceeded their plan's budget
6. Router selects optimal provider based on org's routing config and provider availability
7. Provider credentials loaded — tenant's BYOK key or platform fallback
8. Request forwarded to selected provider with retry/failover logic
9. Response streamed back to client
10. Usage logged to PostgreSQL, Stripe Meter Event fired, metrics emitted to Prometheus`,
      diagram: `Client App (OpenAI SDK)
       │
       ▼
┌──────────────────────┐
│    LLM Gateway       │
│  ┌────────────────┐  │
│  │ Tenant         │  │
│  │ Resolution     │──┤──→ PostgreSQL (API key → org lookup)
│  └────────────────┘  │
│  ┌────────────────┐  │
│  │ Rate Limiter   │──┤──→ Redis (per-tenant counters)
│  └────────────────┘  │
│  ┌────────────────┐  │
│  │ Semantic       │  │
│  │ Cache          │──┤──→ Redis (gw:cache:{orgId}:*)
│  └────────────────┘  │
│  ┌────────────────┐  │
│  │ Token Budget   │──┤──→ PostgreSQL (org budget check)
│  └────────────────┘  │
│  ┌────────────────┐  │
│  │ Router         │  │
│  └───────┬────────┘  │
└──────────┼───────────┘
      ┌────┼────┐
      ▼    ▼    ▼
   OpenAI Anthropic Ollama
      │
      ▼
  Stripe (meter event)`,
    },
    {
      title: "Routing Engine",
      content: `The routing engine is the brain of the gateway. It implements multiple strategies:

**Cost-Based Routing:** Compares per-token pricing across providers and selects the cheapest option that meets quality requirements.

**Latency-Based Routing:** Uses exponential moving average of recent response times to route to the fastest provider.

**Capability-Based Routing:** Some models support function calling, vision, or large context windows. The router matches request requirements to provider capabilities.

**Weighted Random:** Distributes load across providers based on configurable weights. In v2, each org can set custom weights via the dashboard.

**Failover Chain:** If the primary provider fails, automatically tries the next provider in a priority-ordered chain. Implements circuit breaker to avoid hammering a down provider.

**Per-Tenant Provider Registry:** In v2, the available providers for a request depend on the tenant. If a tenant has configured their own OpenAI key (BYOK), that provider is available with the tenant's key. If not, the platform key is used as fallback (paid plans only). Free tier tenants can only use providers they bring their own keys for.`,
    },
    {
      title: "Caching Layer",
      content: `**Semantic Caching** goes beyond exact-match caching. Instead of requiring identical prompts, it uses cosine similarity between prompt embeddings to find "close enough" matches.

**How it works:**
1. Incoming prompt is embedded using a lightweight model
2. Embedding is compared against cached embeddings in Redis
3. If similarity exceeds threshold (configurable, default 0.95), cached response is returned
4. Cache entries have TTL and are evicted using LRU policy

**Per-Tenant Namespacing (v2):** All cache keys are prefixed with \`gw:cache:{orgId}:\` so tenants never see each other's cached responses. This means if Org A caches a response for "explain quantum computing", Org B asking the same question will NOT get a cache hit — each tenant builds their own cache independently.

**Why Redis:** Sub-millisecond lookups, built-in TTL, sorted sets for similarity search, persistence options.`,
    },
    {
      title: "Observability Stack",
      content: `**Metrics (Prometheus + prom-client):**
- Request count by provider, model, status, org_id
- Token usage (prompt + completion) by org/user
- Latency histograms (p50, p95, p99)
- Cache hit/miss ratios per tenant
- Circuit breaker state changes
- Active connections gauge
- Billing events (Stripe meter event success/failure)

**Dashboards (Grafana):**
- Pre-built dashboards for cost tracking, latency monitoring, and usage analytics
- Alerting rules for budget overruns, high error rates, latency spikes

**Control Dashboard (Next.js):**
- Per-org usage overview, API key management, routing configuration
- Billing management via Stripe portal integration
- Provider configuration and BYOK key management

**Structured Logging:**
- JSON-formatted logs with request correlation IDs and org_id
- Log levels: debug, info, warn, error`,
    },
    {
      title: "Multi-Tenant Architecture",
      content: `**Tenant Resolution** is the first step in every request. The middleware chain resolves the API key to an organization:

1. Extract Bearer token from Authorization header
2. Look up API key in the api_keys table (with org_id join)
3. Load the organization record (plan, budget, routing config, provider keys)
4. Set tenant context on the Hono request context (\`c.set("org", org)\`)
5. All downstream middleware and handlers read from this context

**The Middleware Chain:**
\`\`\`
Request → Tenant Resolution → Rate Limit → Cache Check → Budget Check → Route → Provider → Response
                │                   │            │              │
                └── org context ────┴── orgId ───┴── org plan ──┘
\`\`\`

**Organization Creation Flow:**
1. User signs up via Supabase Auth (email/password or OAuth)
2. After first login, user creates an organization (name, slug)
3. Organization is created with Free plan defaults (100K tokens/month, 60 rpm)
4. First API key is generated with the org slug prefix: \`gw-prod-{slug}-{random}\`
5. User can invite team members (owner, admin, member roles)

**Environment Prefixes:** API keys use environment prefixes to separate traffic:
- \`gw-prod-\` — production traffic, counted toward billing
- \`gw-stg-\` — staging traffic, counted but with higher rate limits for testing
- \`gw-dev-\` — development traffic, not counted toward billing, lower rate limits`,
    },
    {
      title: "Billing & Plans",
      content: `**Stripe Integration** handles all billing through raw fetch calls (no Stripe SDK dependency, keeping the gateway lightweight):

**Plan Tiers:**
| Tier | Price | Tokens/Month | Rate Limit | Features |
|------|-------|-------------|------------|----------|
| Free | $0 | 100K | 60 rpm | 2 providers, basic routing |
| Starter | $29/mo | 1M | 300 rpm | All providers, basic caching, BYOK |
| Growth | $99/mo | 10M | 1,000 rpm | Semantic cache, budget alerts, analytics |
| Scale | $299/mo | 100M | 5,000 rpm | Custom routing, SLA, priority support |
| Enterprise | $999/mo | Unlimited | Unlimited | On-prem, SSO, dedicated support |

**Usage Tracking Flow:**
1. After each LLM request, token usage is logged to the \`usage_logs\` table with org_id
2. A Stripe Meter Event is fired with the token count: \`POST /v1/billing/meter_events\`
3. Daily usage is aggregated into the \`usage_daily\` rollup table for fast dashboard queries
4. Budget counters on the organizations table are updated atomically

**Stripe Webhook Events:**
- \`checkout.session.completed\` — customer upgraded, attach stripe_customer_id and stripe_subscription_id to org, update plan tier
- \`customer.subscription.deleted\` — subscription cancelled, downgrade org to Free plan
- \`invoice.payment_failed\` — payment failed, flag account, send notification

**Budget Enforcement:**
Before processing a request, the gateway checks \`tokens_used_this_month\` against \`monthly_token_budget\`. If the org has exceeded their plan limit, the request is rejected with HTTP 429 and a message indicating the budget is exhausted. Budget counters reset at the start of each billing period (tracked by \`budget_reset_at\`).`,
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
- **Drizzle schemas** are TypeScript-first — database types are inferred from schema definitions
- **Supabase client** is fully typed — Row Level Security policies are type-checked at the query level
- **Next.js dashboard** uses TypeScript strict mode with server/client component type boundaries`,
      featuresInProject: [
        {
          feature: "Strict Type Safety Across the Gateway",
          description: "TypeScript strict mode ensures every provider response shape, routing configuration, tenant context, and database schema is type-checked at compile time, preventing runtime crashes in production.",
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
          description: "Database table schemas — including multi-tenant tables (organizations, org_members, usage_daily) — are written as TypeScript objects using Drizzle's pgTable API, and query result types are automatically inferred from these definitions.",
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
- \`src/middleware/tenant.ts\` — Tenant resolution middleware (API key → org lookup)
- \`src/middleware/rate-limit.ts\` — Per-tenant rate limiting with plan-based limits
- \`@hono/zod-validator\` validates request bodies against Zod schemas
- Middleware chain: logging → tenant resolution → rate-limit → cache-check → budget-check → route → metrics
- \`src/api/webhooks/stripe.ts\` — Stripe webhook handler for billing events`,
      featuresInProject: [
        {
          feature: "OpenAI-Compatible API Endpoints",
          description: "Hono route handlers implement the /v1/chat/completions, /v1/embeddings, and /v1/models endpoints, making the gateway a drop-in replacement for the OpenAI API.",
        },
        {
          feature: "Multi-Tenant Middleware Pipeline",
          description: "Hono's middleware chain processes every request through tenant resolution, rate limiting, cache checking, budget enforcement, and metrics collection, with the org context flowing through the entire chain.",
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
- Schema defines tables for: providers, models, usage_logs, budgets, cache_entries, organizations, org_members, api_keys, usage_daily
- \`drizzle-kit push\` applies schema changes during development
- \`drizzle-kit generate\` creates versioned SQL migrations for production
- Queries use the relational query builder for joins and aggregations
- Multi-tenant queries always filter by org_id: \`db.select().from(usageLogs).where(eq(usageLogs.orgId, org.id))\``,
      featuresInProject: [
        {
          feature: "Usage Logging",
          description: "Every LLM request is logged to a usage_logs table via Drizzle insert queries, capturing provider, model, token counts, cost, latency, org_id, and timestamps for analytics and billing.",
        },
        {
          feature: "Budget Enforcement",
          description: "Drizzle queries aggregate token usage and costs per organization from the budgets and usage_logs tables to enforce spending limits before forwarding requests.",
        },
        {
          feature: "Multi-Tenant Schema",
          description: "Drizzle schemas define the organizations, org_members, and usage_daily tables that power multi-tenancy, with foreign keys enforcing referential integrity between tenants and their data.",
        },
        {
          feature: "Schema Migration Pipeline",
          description: "Drizzle Kit generates SQL migrations from TypeScript schema changes — including the v2 multi-tenant tables — and applies them during development with drizzle-kit push, ensuring the database stays in sync with the codebase.",
        },
        {
          feature: "Cost Analytics Aggregations",
          description: "Drizzle's SQL template tag enables type-safe aggregation queries (SUM, AVG, GROUP BY) for per-tenant cost and latency analytics across providers, models, and time periods.",
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
- Organizations and tenant data (multi-tenant core)
- Daily usage rollups (analytics)

PostgreSQL handles all these workloads:
- JSONB columns store flexible provider response metadata and per-tenant provider keys
- Indexes on timestamp columns enable fast time-range queries
- Transactions ensure budget enforcement is atomic
- Row-level security protects multi-tenant data via Supabase RLS policies`,
      howItWorksInProject: `- Hosted on Supabase (managed PostgreSQL with Auth and RLS)
- Drizzle ORM connects via the \`pg\` driver
- Schema managed by Drizzle Kit migrations
- Tables: providers, models, usage_logs, budgets, api_keys, organizations, org_members, usage_daily
- JSONB columns store provider-specific metadata, per-tenant routing weights, and encrypted provider keys
- Row Level Security policies enforce tenant isolation at the database level`,
      featuresInProject: [
        {
          feature: "Usage Logs Storage",
          description: "High-write usage_logs table stores every LLM request with provider, model, token counts, cost, latency, org_id, and timestamps, with indexes on (org_id, created_at) for fast per-tenant time-range queries.",
        },
        {
          feature: "Budget Tracking with Transactions",
          description: "PostgreSQL transactions ensure budget enforcement is atomic — checking the remaining budget and logging the usage happen in a single transaction so concurrent requests cannot overspend.",
        },
        {
          feature: "Multi-Tenant Organization Data",
          description: "The organizations table stores per-tenant configuration: plan tier, token budget, routing weights (JSONB), provider API keys (JSONB), and Stripe billing IDs. Foreign keys from usage_logs, api_keys, and org_members enforce referential integrity.",
        },
        {
          feature: "Row Level Security for Tenant Isolation",
          description: "Supabase RLS policies on organizations and org_members tables ensure that dashboard queries through the Supabase client are automatically scoped to the authenticated user's organizations, preventing cross-tenant data access.",
        },
        {
          feature: "Analytics and Reporting Queries",
          description: "PostgreSQL's window functions, CTEs, and aggregations power the gateway's cost analytics, enabling queries like per-provider cost breakdown, daily usage trends, and latency percentile calculations — all scoped by org_id.",
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
      whyWeUsedIt: `The LLM gateway uses Redis for three critical functions:

**1. Semantic Cache:** LLM responses are cached in Redis with their prompt embeddings. When a new request arrives, its embedding is compared against cached entries using sorted sets. Sub-millisecond lookups make this viable for every request.

**2. Rate Limiting:** Token buckets are implemented as Redis counters with TTL. Distributed rate limiting works because Redis is a single source of truth across multiple gateway instances. In v2, rate limit keys are namespaced per-tenant: \`ratelimit:{orgId}:{window}\`.

**3. Per-Tenant Cache Namespacing:** In v2, all cache keys are prefixed with \`gw:cache:{orgId}:\` so tenants never see each other's cached responses.

**Why not PostgreSQL for caching?** Disk-based databases add 1-10ms per query. Redis responds in <1ms. For a gateway that processes every request, this latency difference is critical.`,
      howItWorksInProject: `- \`ioredis\` client library (better than node-redis for TypeScript)
- Cache entries stored as hashes: \`gw:cache:{orgId}:{hash}\` → \`{prompt, response, embedding, ttl}\`
- Sorted sets for similarity search: \`gw:cache:{orgId}:embeddings\` → \`{score: similarity, member: hash}\`
- Rate limit counters: \`ratelimit:{orgId}:{window}\` → count with TTL
- Connection pooling via ioredis built-in pool
- Per-tenant namespace isolation ensures no cross-tenant cache leaks`,
      featuresInProject: [
        {
          feature: "Per-Tenant Semantic Cache Storage",
          description: "LLM responses are cached in Redis hashes namespaced by org ID (`gw:cache:{orgId}:{hash}`), enabling sub-millisecond lookups that can serve cached responses for similar prompts without hitting the LLM provider, with full tenant isolation.",
        },
        {
          feature: "Embedding Similarity Search",
          description: "Redis sorted sets store prompt embeddings with similarity scores per tenant, allowing the gateway to find cached responses that are semantically similar (above a configurable threshold) to incoming prompts.",
        },
        {
          feature: "Per-Tenant Rate Limiting Counters",
          description: "Plan-based rate limiting is implemented using Redis counters with TTL, namespaced by org ID (`ratelimit:{orgId}:{window}`), providing distributed rate limiting with per-tenant thresholds (60 rpm Free, 300 rpm Starter, 1000 rpm Growth, 5000 rpm Scale).",
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
- Metrics are labeled by org_id for per-tenant observability
- Prometheus runs as a Docker container and scrapes the gateway's /metrics endpoint
- Grafana connects to Prometheus as a data source and displays pre-built dashboards
- Alert rules defined for budget overruns and high error rates`,
      featuresInProject: [
        {
          feature: "Request Duration Histograms",
          description: "A Prometheus histogram tracks request latency distributions by provider, model, and org_id, enabling p50/p95/p99 latency calculations for routing decisions and SLA monitoring.",
        },
        {
          feature: "Token Usage Counters",
          description: "Counters track prompt and completion token consumption per organization, user, provider, and model, enabling real-time cost tracking and budget enforcement alerts.",
        },
        {
          feature: "Cache Hit/Miss Ratio Tracking",
          description: "Counters for cache hits and misses per tenant enable real-time monitoring of semantic cache effectiveness, helping tune the similarity threshold and cache TTL for optimal cost savings.",
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
- Validate environment variables at startup (including new Stripe and Supabase vars)
- Validate provider API responses
- Validate Stripe webhook payloads
- Generate TypeScript types automatically — single source of truth`,
      howItWorksInProject: `- Request validation via \`@hono/zod-validator\` middleware
- Environment variable validation in \`src/env.ts\` (DATABASE_URL, REDIS_URL, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_KEY)
- Provider response schemas for type-safe response handling
- Stripe webhook event schemas for type-safe billing event processing
- Shared schemas between routes and database operations`,
      featuresInProject: [
        {
          feature: "Chat Completion Request Validation",
          description: "Zod schemas validate incoming /v1/chat/completions requests — checking model names, message arrays, role enums, temperature ranges, and optional parameters before the request reaches the routing engine.",
        },
        {
          feature: "Environment Variable Validation",
          description: "At startup, Zod schemas in src/env.ts validate all required environment variables (database URLs, API keys, Stripe secrets, Supabase credentials, port numbers), failing fast with clear errors if configuration is missing or malformed.",
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
- Tests in \`tests/\` directory test routing logic, caching, budget enforcement, tenant isolation, billing webhooks
- Mocks for external providers (no real API calls in tests)
- Mocks for Stripe webhook events to test billing flows
- Coverage reports generated with \`vitest run --coverage\``,
      featuresInProject: [
        {
          feature: "Routing Logic Unit Tests",
          description: "Tests verify that the routing engine correctly selects providers based on cost, latency, and capability strategies, including edge cases like all providers being unavailable and per-tenant routing weights.",
        },
        {
          feature: "Semantic Cache Tests",
          description: "Tests validate cache hit/miss behavior, similarity threshold logic, TTL expiration, LRU eviction, and per-tenant namespace isolation to ensure the caching layer saves costs without serving stale or cross-tenant responses.",
        },
        {
          feature: "Budget Enforcement Tests",
          description: "Tests verify that requests are rejected when organizations exceed their token budgets, including concurrent request scenarios that could cause race-condition overspending and plan-based budget limit enforcement.",
        },
        {
          feature: "Provider Mock Testing",
          description: "vi.mock() replaces real LLM provider API calls with mock responses, enabling fast tests that validate request transformation, error handling, and response parsing without network calls.",
        },
        {
          feature: "Tenant Isolation and Billing Tests",
          description: "Tests verify that tenant resolution middleware correctly maps API keys to organizations, that cross-tenant data access is prevented, and that Stripe webhook events correctly update org plan state idempotently.",
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
    {
      name: "Supabase",
      category: "infrastructure",
      icon: "SB",
      tagline: "Open source Firebase alternative",
      origin: {
        creator: "Paul Copplestone & Ant Wilson",
        year: 2020,
        motivation:
          "Firebase offered a compelling developer experience for building applications quickly, but it locked developers into Google's proprietary ecosystem with a NoSQL database. Copplestone and Wilson set out to build an open-source alternative built on PostgreSQL — giving developers the Firebase DX with the power of a relational database and the freedom to self-host.",
      },
      whatItIs: `Supabase is an open-source Backend-as-a-Service (BaaS) platform built on top of PostgreSQL. It provides:

- **PostgreSQL Database** — fully managed Postgres with extensions, backups, and connection pooling
- **Authentication** — email/password, OAuth (Google, GitHub, etc.), magic links, phone auth
- **Row Level Security (RLS)** — PostgreSQL policies that restrict data access per user
- **Realtime** — WebSocket subscriptions for database changes
- **Storage** — S3-compatible file storage with RLS policies
- **Edge Functions** — Deno-based serverless functions
- **Auto-generated REST API** — PostgREST auto-generates a REST API from your schema
- **Auto-generated GraphQL API** — pg_graphql extension

Unlike Firebase, Supabase is built entirely on open-source tools: PostgreSQL, PostgREST, GoTrue (auth), Realtime (Elixir), and Kong (API gateway). You can self-host the entire stack.`,
      explainLikeImTen: `Imagine you want to build a treehouse, but instead of having to learn plumbing, electrical wiring, and carpentry all at once, someone gives you a treehouse kit with pre-built walls, a door with a lock, running water, and lights already installed. You just have to decide how to arrange the rooms. Supabase is that kit for building apps. It gives you a database to store things, a login system so people can sign in, and rules about who can see what — all pre-built and ready to use. The cool part is that unlike some kits where you're stuck with what they give you, Supabase's kit is built with real professional tools (PostgreSQL) so you can customize anything.`,
      realWorldAnalogy: `Supabase is like a modern office building that comes fully furnished. When you lease a floor (create a project), you get the reception desk (auth), the filing system (database), the security badge system (RLS), the intercom (realtime), and the storage room (file storage) — all ready to use on day one. You don't need to hire separate contractors for each system. But unlike a locked-down corporate office, Supabase gives you the master keys: you can rearrange anything, add custom rooms, or even move the entire building to your own land (self-host).`,
      whyWeUsedIt: `The LLM Gateway's SaaS conversion needed three things that Supabase provides out of the box:

**1. Authentication:** User signup/login for the dashboard. Supabase Auth handles email/password, OAuth, session management, and JWT tokens. No need to build auth from scratch.

**2. Managed PostgreSQL with RLS:** The gateway already uses PostgreSQL (Drizzle ORM). Supabase hosts it with Row Level Security policies that enforce multi-tenant isolation at the database level — even if the application code has a bug, RLS prevents cross-tenant data access.

**3. Client Library for Dashboard:** The \`@supabase/supabase-js\` client provides typed queries that respect RLS policies, making it easy to build the Next.js dashboard with per-tenant data access.

**Why Supabase over Auth0 + managed Postgres separately?**
- Single platform for auth + database + RLS = simpler architecture
- RLS policies are co-located with the database schema
- Supabase client handles JWT refresh, session management, and typed queries
- Free tier is generous enough for development and small deployments
- Open source — no vendor lock-in, can self-host for enterprise customers`,
      howItWorksInProject: `- **Supabase Auth** handles user signup, login, OAuth, and session management for the dashboard
- **Supabase PostgreSQL** hosts the gateway's database with all multi-tenant tables
- **Row Level Security** policies on organizations and org_members tables enforce tenant isolation
- **\`@supabase/supabase-js\`** client is used in the Next.js dashboard for typed, RLS-scoped queries
- **Service Role Key** is used server-side in the gateway for admin operations that bypass RLS (e.g., tenant resolution middleware)
- **Environment variables:** SUPABASE_URL, SUPABASE_ANON_KEY (dashboard), SUPABASE_SERVICE_KEY (gateway server)`,
      featuresInProject: [
        {
          feature: "User Authentication for Dashboard",
          description: "Supabase Auth provides email/password signup, OAuth login (Google, GitHub), session management, and JWT tokens for the Next.js control dashboard, eliminating the need to build auth from scratch.",
        },
        {
          feature: "Row Level Security for Tenant Isolation",
          description: "RLS policies on organizations, org_members, api_keys, and usage_logs tables automatically scope all dashboard queries to the authenticated user's organizations, preventing cross-tenant data access at the database level.",
        },
        {
          feature: "Typed Client Queries in Dashboard",
          description: "The @supabase/supabase-js client provides TypeScript-typed query results that respect RLS policies, making it safe and ergonomic to build dashboard pages that display per-tenant data.",
        },
        {
          feature: "Service Role for Gateway Operations",
          description: "The gateway server uses the Supabase service role key to bypass RLS for admin operations like tenant resolution (looking up any API key) and usage logging (writing to any org's usage records).",
        },
        {
          feature: "Managed PostgreSQL with Extensions",
          description: "Supabase manages PostgreSQL backups, connection pooling (PgBouncer), and provides access to extensions like pgvector (for semantic cache embeddings) and pg_cron (for budget reset scheduling).",
        },
      ],
      coreConceptsMarkdown: `### Authentication Flow

\`\`\`typescript
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Sign up
const { data, error } = await supabase.auth.signUp({
  email: "user@example.com",
  password: "securepassword",
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: "user@example.com",
  password: "securepassword",
});

// OAuth
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: "github",
});

// Get current user
const { data: { user } } = await supabase.auth.getUser();

// Sign out
await supabase.auth.signOut();
\`\`\`

### Row Level Security (RLS)

\`\`\`sql
-- Enable RLS on a table
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- Policy: users can only see their own organizations
CREATE POLICY "Members see own org" ON public.organizations
  FOR SELECT USING (
    id IN (
      SELECT org_id FROM public.org_members
      WHERE user_id = auth.uid()
    )
  );

-- Policy: owners can manage their org
CREATE POLICY "Owners manage org" ON public.organizations
  FOR ALL USING (owner_id = auth.uid());

-- auth.uid() returns the JWT's sub claim (current user's ID)
-- This is evaluated for EVERY query automatically
\`\`\`

### Typed Client Queries

\`\`\`typescript
// Fetch org's usage data — RLS automatically filters by user's orgs
const { data: usage, error } = await supabase
  .from("usage_daily")
  .select("date, total_requests, total_tokens, total_cost_usd")
  .eq("org_id", orgId)
  .order("date", { ascending: false })
  .limit(30);
// TypeScript knows usage is UsageDaily[] | null
\`\`\`

### Service Role vs Anon Key

| Key | Used By | RLS | Purpose |
|-----|---------|-----|---------|
| Anon Key | Dashboard (client) | Enforced | User-facing queries scoped by RLS |
| Service Role Key | Gateway (server) | Bypassed | Admin operations (tenant resolution, usage logging) |

The anon key is safe to expose in the browser — RLS policies ensure users only see their own data. The service role key must never be exposed to clients.`,
      prosAndCons: {
        pros: [
          "All-in-one backend: auth + database + RLS + storage + realtime",
          "Built on PostgreSQL — full SQL power, not a proprietary database",
          "Row Level Security provides database-level tenant isolation",
          "Open source — self-hostable, no vendor lock-in",
          "Generous free tier for development and small projects",
          "Auto-generated REST and GraphQL APIs from schema",
        ],
        cons: [
          "RLS policies can be complex and hard to debug",
          "Edge Functions are Deno-based (not Node.js), limiting library compatibility",
          "Realtime subscriptions have connection limits on free tier",
          "Database migrations are not as smooth as Prisma/Drizzle (use external tools)",
          "Some PostgreSQL extensions are not available on managed platform",
          "Auth customization (custom email templates, advanced flows) requires workarounds",
        ],
      },
      alternatives: [
        {
          name: "Firebase",
          comparison:
            "Google's BaaS platform. Proprietary NoSQL database (Firestore), excellent realtime support, tight GCP integration. But vendor lock-in, no SQL, no RLS, and the NoSQL model makes complex queries difficult.",
        },
        {
          name: "Auth0 + managed PostgreSQL",
          comparison:
            "Dedicated auth service + separate database. More flexibility in auth customization but two services to manage, no integrated RLS, and higher total cost. Auth0 is expensive at scale.",
        },
        {
          name: "Clerk",
          comparison:
            "Modern auth-focused service with excellent DX and pre-built UI components. But auth-only — still need a separate database and no RLS integration.",
        },
        {
          name: "Neon + custom auth",
          comparison:
            "Serverless PostgreSQL with branching. Better database scaling story but no built-in auth, no RLS integration, no client library. More assembly required.",
        },
      ],
      keyAPIs: [
        "supabase.auth.signUp() / signIn() — authentication",
        "supabase.auth.getUser() — get current user",
        "supabase.from(table).select() — typed queries",
        "supabase.from(table).insert() / update() / delete() — mutations",
        "CREATE POLICY — Row Level Security policies",
        "auth.uid() — current user ID in SQL policies",
        "supabase.auth.onAuthStateChange() — auth state listener",
        "createClient(url, key) — initialize client",
      ],
      academicFoundations: `**Row Level Security** is rooted in the Bell-LaPadula model (1973) of access control in operating systems. The model defines security levels and access rules (no read up, no write down) to prevent information leakage between security levels. PostgreSQL's RLS is a practical implementation where security levels are defined by SQL predicates evaluated per-row.

**Authentication & Authorization:** Supabase Auth implements OAuth 2.0 (RFC 6749) and OpenID Connect for identity federation. JWTs (RFC 7519) are used as bearer tokens — the same stateless authentication pattern used by most modern APIs. The JWT contains the user's ID, which RLS policies use to scope queries.

**Backend-as-a-Service (BaaS):** The BaaS model emerged from the observation that most applications need the same backend components: auth, database, storage, and realtime. By commoditizing these components, BaaS platforms let developers focus on business logic. This is an application of the "don't reinvent the wheel" principle from software engineering.

**PostgREST:** Supabase's auto-generated REST API uses PostgREST, which maps PostgreSQL schemas directly to RESTful endpoints. This is based on the principle of convention over configuration — the database schema IS the API definition.`,
      furtherReading: [
        "Supabase documentation — supabase.com/docs",
        "PostgreSQL Row Level Security — postgresql.org/docs/current/ddl-rowsecurity.html",
        "Supabase Architecture — supabase.com/docs/architecture",
        "GoTrue (auth engine) — github.com/supabase/gotrue",
      ],
    },
    {
      name: "Stripe",
      category: "library",
      icon: "ST",
      tagline: "Payment infrastructure for the internet",
      origin: {
        creator: "Patrick & John Collison",
        year: 2010,
        motivation:
          "Accepting payments online was absurdly complex — merchants needed merchant accounts, payment gateways, PCI compliance audits, and weeks of integration work. The Collison brothers, two Irish-American teenagers, built Stripe to make online payments as simple as adding a few lines of code. Their insight was that payments infrastructure should be a developer tool, not a financial product.",
      },
      whatItIs: `Stripe is a suite of payment APIs that powers online commerce for millions of businesses. For SaaS applications, the key components are:

- **Payments** — process credit cards, ACH, international payments
- **Subscriptions** — recurring billing with plan management
- **Billing** — invoicing, metered billing, proration
- **Meters** — real-time usage tracking for usage-based billing
- **Checkout** — pre-built, hosted payment pages
- **Customer Portal** — self-service billing management
- **Webhooks** — event notifications for billing lifecycle
- **Connect** — marketplace payments (not used in this project)

Stripe's API is REST-based with idempotency keys, versioned endpoints, and comprehensive webhook events. The API design is widely considered the gold standard for developer experience.`,
      explainLikeImTen: `Imagine you set up a lemonade stand, but instead of just collecting coins in a jar, you want to let people pay with credit cards, set up weekly lemonade subscriptions, and charge extra for the big cups. That's a lot of work! Stripe is like hiring a super-smart cashier who handles all of that for you. The cashier collects the money, keeps track of who's subscribed, sends receipts, and even tells you when someone's card doesn't work. You just tell the cashier your prices, and they handle everything else. They take a small cut of each sale (2.9% + 30 cents) for their trouble.`,
      realWorldAnalogy: `Stripe is like a full-service accounting firm for your online business. When you open a store, you could handle bookkeeping, invoicing, tax collection, subscription management, and payment processing yourself — but it would consume all your time. Instead, you hire an accounting firm (Stripe) that handles it all: processes payments, sends invoices, manages subscriptions, handles failed payments with automatic retries, and provides detailed financial reports. You focus on making great products; they handle the money.`,
      whyWeUsedIt: `The LLM Gateway SaaS needs usage-based billing — customers are charged based on how many tokens they consume. Stripe provides the complete billing infrastructure:

**Why Stripe over building billing from scratch:**
- PCI compliance is handled by Stripe (no credit card data on our servers)
- Stripe Meters track real-time usage without building a custom metering system
- Checkout Sessions handle the upgrade flow with a hosted payment page
- Billing Portal lets customers manage their own subscriptions
- Webhooks notify the gateway of billing events (upgrade, cancel, payment failure)

**Why raw fetch instead of the Stripe SDK:**
The official Stripe Node.js SDK adds ~2MB to the bundle and has dependencies. Since the gateway only uses 5-6 Stripe API endpoints, raw fetch calls with typed request/response schemas keep the gateway lightweight. Each Stripe API call is just a POST request with form-encoded parameters and a Bearer token.`,
      howItWorksInProject: `- \`src/billing/stripe.ts\` — StripeBilling class with raw fetch calls to Stripe API
- \`src/api/webhooks/stripe.ts\` — Webhook handler for billing lifecycle events
- Meter Events fired after each LLM request: \`POST /v1/billing/meter_events\`
- Checkout Sessions for plan upgrades: \`POST /v1/checkout/sessions\`
- Billing Portal for subscription management: \`POST /v1/billing_portal/sessions\`
- Webhook verification using HMAC signature (STRIPE_WEBHOOK_SECRET)
- Environment variables: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET`,
      featuresInProject: [
        {
          feature: "Usage-Based Billing via Meter Events",
          description: "After each LLM request, a Stripe Meter Event is fired with the token count. Stripe aggregates these events and includes them on the customer's monthly invoice, enabling per-token billing without a custom metering system.",
        },
        {
          feature: "Checkout Sessions for Plan Upgrades",
          description: "When a user clicks 'Upgrade' in the dashboard, a Stripe Checkout Session is created that redirects to a hosted payment page. After successful payment, a webhook event updates the organization's plan tier.",
        },
        {
          feature: "Billing Portal for Self-Service Management",
          description: "The Stripe Billing Portal lets customers update payment methods, view invoices, and cancel subscriptions without any custom UI — just a redirect to Stripe's hosted portal.",
        },
        {
          feature: "Webhook Event Processing",
          description: "Stripe webhooks notify the gateway of billing events: checkout.session.completed (upgrade plan), customer.subscription.deleted (downgrade to free), invoice.payment_failed (flag account). All handlers are idempotent.",
        },
        {
          feature: "Lightweight Integration via Raw Fetch",
          description: "Instead of the 2MB Stripe SDK, the gateway uses raw fetch calls with typed Zod schemas for the 5-6 Stripe endpoints it needs, keeping the gateway lightweight while maintaining type safety.",
        },
      ],
      coreConceptsMarkdown: `### Stripe API Basics

\`\`\`typescript
// Raw fetch to Stripe API (no SDK dependency)
const createCheckoutSession = async (orgId: string, priceId: string) => {
  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      "Authorization": \`Bearer \${STRIPE_SECRET_KEY}\`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      "mode": "subscription",
      "line_items[0][price]": priceId,
      "line_items[0][quantity]": "1",
      "success_url": \`\${DASHBOARD_URL}/billing?success=true\`,
      "cancel_url": \`\${DASHBOARD_URL}/billing?canceled=true\`,
      "metadata[org_id]": orgId,
    }),
  });
  return response.json();
};
\`\`\`

### Meter Events for Usage-Based Billing

\`\`\`typescript
// Fire a meter event after each LLM request
const reportUsage = async (customerId: string, tokens: number) => {
  await fetch("https://api.stripe.com/v1/billing/meter_events", {
    method: "POST",
    headers: {
      "Authorization": \`Bearer \${STRIPE_SECRET_KEY}\`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      "event_name": "token_usage",
      "payload[stripe_customer_id]": customerId,
      "payload[value]": tokens.toString(),
    }),
  });
};
\`\`\`

### Webhook Verification

\`\`\`typescript
// Verify Stripe webhook signature
const verifyWebhook = (payload: string, signature: string): boolean => {
  const elements = signature.split(",");
  const timestamp = elements.find(e => e.startsWith("t="))?.slice(2);
  const sig = elements.find(e => e.startsWith("v1="))?.slice(3);

  const signedPayload = \`\${timestamp}.\${payload}\`;
  const expected = crypto
    .createHmac("sha256", STRIPE_WEBHOOK_SECRET)
    .update(signedPayload)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(sig!),
    Buffer.from(expected)
  );
};
\`\`\`

### Billing Lifecycle

\`\`\`
User clicks "Upgrade"
    │
    ▼
Create Checkout Session → Stripe hosted page → Payment
    │
    ▼
Webhook: checkout.session.completed
    │
    ▼
Update org: plan = "growth", stripe_customer_id = "cus_...",
            stripe_subscription_id = "sub_..."
    │
    ▼
User makes API calls → Meter Events fired → Stripe aggregates
    │
    ▼
End of month: Stripe creates invoice with usage charges
\`\`\``,
      prosAndCons: {
        pros: [
          "Best-in-class developer experience — clear docs, typed APIs, great error messages",
          "Handles PCI compliance — no credit card data on your servers",
          "Comprehensive billing features — subscriptions, meters, invoicing, portals",
          "Webhooks for every event — reliable, retried, with signature verification",
          "Global payments — supports 135+ currencies and local payment methods",
          "Excellent dashboard for debugging and monitoring payments",
        ],
        cons: [
          "Transaction fees (2.9% + 30 cents) are higher than interchange-plus pricing",
          "Complex pricing for advanced features (Connect, Radar, Tax)",
          "Vendor lock-in for payment processing (hard to switch providers)",
          "Webhook ordering is not guaranteed — must handle out-of-order events",
          "No offline/cash payment support",
          "Customer portal customization is limited",
        ],
      },
      alternatives: [
        {
          name: "Paddle",
          comparison:
            "Merchant of Record — handles tax collection, compliance, and international payments. Simpler but less control, higher fees, and fewer customization options. Good for indie developers.",
        },
        {
          name: "LemonSqueezy",
          comparison:
            "Another Merchant of Record with simpler pricing. Good DX but fewer features than Stripe. No metered billing or advanced subscription management.",
        },
        {
          name: "Braintree",
          comparison:
            "PayPal's payment platform. Lower transaction fees for high volume but worse DX, older APIs, and less modern billing features.",
        },
        {
          name: "Custom billing with a payment processor",
          comparison:
            "Build metering, invoicing, and subscription management yourself. Full control but months of engineering effort, PCI compliance burden, and ongoing maintenance.",
        },
      ],
      keyAPIs: [
        "POST /v1/checkout/sessions — create hosted payment page",
        "POST /v1/billing_portal/sessions — customer self-service portal",
        "POST /v1/billing/meter_events — report usage for metered billing",
        "POST /v1/customers — create/manage customers",
        "POST /v1/subscriptions — manage subscriptions",
        "Webhook events — checkout.session.completed, subscription.deleted, invoice.payment_failed",
        "Stripe-Signature header — webhook verification",
        "Idempotency-Key header — prevent duplicate operations",
      ],
      academicFoundations: `**Idempotency:** Stripe's API uses idempotency keys (a concept from mathematics and distributed systems) to ensure that retrying a request produces the same result. In algebra, an operation f is idempotent if f(f(x)) = f(x). Stripe applies this to payment operations: sending the same charge request twice with the same idempotency key will only charge the customer once.

**Webhook Event-Driven Architecture:** Stripe's webhook system implements the Observer pattern at the distributed systems level. When a billing event occurs, Stripe notifies all registered observers (webhook endpoints). This is based on the publish-subscribe messaging pattern, with at-least-once delivery guarantees and exponential backoff retries.

**HMAC Authentication (RFC 2104):** Webhook signature verification uses HMAC-SHA256 — a keyed-hash message authentication code that proves the webhook came from Stripe and wasn't tampered with. HMAC is based on the Merkle-Damgard hash function construction.

**Usage-Based Pricing Economics:** The pricing model follows the principle of price discrimination — charging customers based on their willingness to pay, which correlates with usage. The 10x value curve (each tier costs ~3x more but delivers ~10x usage) is based on Van Westendorp's Price Sensitivity Meter and the SaaS pricing strategies documented by Patrick Campbell at ProfitWell.`,
      furtherReading: [
        "Stripe API documentation — stripe.com/docs/api",
        "Stripe Billing for SaaS — stripe.com/docs/billing/subscriptions/overview",
        "Stripe Meters — stripe.com/docs/billing/subscriptions/usage-based/recording-usage",
        "Designing Stripe-like APIs — blog.pragmaticengineer.com",
      ],
    },
    {
      name: "Next.js",
      category: "framework",
      icon: "NX",
      tagline: "The React framework for the web",
      origin: {
        creator: "Guillermo Rauch & the Vercel team",
        year: 2016,
        motivation:
          "Building production React applications required assembling a complex toolchain: Webpack, Babel, routing, server-side rendering, code splitting. Guillermo Rauch (creator of Socket.io, Mongoose) created Next.js to provide all of this out of the box with zero configuration. The framework follows the 'convention over configuration' philosophy — you create files in the right directories, and Next.js handles the rest.",
      },
      whatItIs: `Next.js is a full-stack React framework that provides:

- **File-based Routing** — pages defined by filesystem structure (App Router)
- **Server Components** — React components that render on the server (zero client JS)
- **Server Actions** — form submissions and mutations without API routes
- **Static Site Generation (SSG)** — pre-render pages at build time
- **Server-Side Rendering (SSR)** — render pages on each request
- **Incremental Static Regeneration (ISR)** — regenerate static pages on-demand
- **API Routes** — backend endpoints alongside frontend code
- **Middleware** — edge functions for request interception
- **Image Optimization** — automatic image resizing and format conversion
- **Built-in CSS/Tailwind Support** — zero-config styling

Next.js is the most popular React framework, used by Netflix, TikTok, Twitch, Hulu, Nike, and thousands of other companies. Vercel (the company behind Next.js) provides hosting optimized for the framework.`,
      explainLikeImTen: `Imagine you're building a website, and React gives you the LEGO bricks to build interactive pages. But you still need to figure out how to put the pages together, how to make them load fast, and how to show different pages when people click different links. Next.js is like a LEGO instruction book that comes with a display stand. It tells React how to organize the pages, makes them load super fast by building some pages ahead of time, and even gives you a way to talk to databases from the same project. Instead of figuring out 10 different tools, Next.js gives you everything in one box.`,
      realWorldAnalogy: `If React is a set of high-quality building materials (bricks, steel, glass), Next.js is the architectural firm that turns those materials into a finished building. The firm handles the blueprints (routing), the foundation (server rendering), the insulation (optimization), the security system (middleware), and the elevator system (data fetching). You describe what rooms you want, and the firm figures out the best way to build them — some rooms pre-built for speed (static), some custom-built per visitor (dynamic).`,
      whyWeUsedIt: `The LLM Gateway dashboard needs:
- Server-side rendering for fast initial loads and SEO
- Authentication-aware pages (redirect to login if not authenticated)
- Real-time data display (usage charts, cost analytics)
- Forms for configuration (routing weights, provider keys, billing)
- Integration with Supabase Auth and the gateway's REST API

**Why Next.js over Vite + React Router:**
- Server Components reduce client-side JavaScript (dashboard pages are mostly data display)
- Built-in middleware for auth redirects (check Supabase session before rendering)
- API routes for proxying Stripe webhook events and billing actions
- File-based routing matches the dashboard's page structure naturally

**Why Next.js over Remix:**
- Larger ecosystem and community
- Better Vercel deployment story (important for SaaS)
- Server Components (Remix uses loaders, a different model)
- More third-party component libraries (shadcn/ui is Next.js-first)`,
      howItWorksInProject: `- \`dashboard/\` directory contains the Next.js App Router application
- \`dashboard/app/\` — route segments for all 21 pages
- \`dashboard/app/(auth)/\` — login and signup pages (public)
- \`dashboard/app/(dashboard)/\` — authenticated pages with sidebar layout
- \`dashboard/components/\` — 8 shadcn/ui components (Button, Card, Input, Dialog, etc.)
- \`dashboard/lib/supabase.ts\` — Supabase client initialization (optional — dashboard works without auth)
- \`dashboard/middleware.ts\` — auth middleware (redirect to login if no session)
- Tailwind CSS with dark/light/system theme toggle, responsive sidebar layout
- Server Components for data fetching, Client Components for interactivity`,
      featuresInProject: [
        {
          feature: "21-Page Dashboard Application",
          description: "The dashboard includes auth pages (login, signup), and authenticated pages for overview, API keys, usage analytics, routing configuration, provider management, cache monitoring, billing, settings, and request logs.",
        },
        {
          feature: "Server Components for Data Display",
          description: "Dashboard pages like usage analytics and billing overview use Server Components to fetch data on the server (via Supabase queries) and send pre-rendered HTML to the client, reducing JavaScript bundle size.",
        },
        {
          feature: "Auth Middleware",
          description: "Next.js middleware checks for a valid Supabase session on every dashboard route. Unauthenticated requests are redirected to /login, and authenticated requests to auth pages are redirected to /dashboard.",
        },
        {
          feature: "Dark/Light Theme Toggle with Responsive Sidebar",
          description: "The dashboard uses Tailwind CSS with CSS variable-based theming (bg-card, border-border, text-muted-foreground) and a ThemeToggle component supporting dark, light, and system modes via next-themes. The responsive sidebar collapses on mobile.",
        },
        {
          feature: "Stripe Billing Integration Pages",
          description: "The billing page displays current plan, usage metrics, and upgrade options. Clicking 'Upgrade' creates a Stripe Checkout Session (via API route) and redirects to Stripe's hosted payment page.",
        },
      ],
      coreConceptsMarkdown: `### App Router File-Based Routing

\`\`\`
dashboard/app/
├── layout.tsx          # Root layout (theme provider, fonts)
├── page.tsx            # Home page (redirects to /dashboard)
├── (auth)/
│   ├── login/page.tsx  # Login page
│   └── signup/page.tsx # Signup page
├── (dashboard)/
│   ├── layout.tsx      # Sidebar layout
│   ├── page.tsx        # Dashboard overview
│   ├── keys/page.tsx   # API key management
│   ├── usage/page.tsx  # Usage analytics
│   ├── routing/page.tsx # Routing configuration
│   ├── providers/page.tsx # Provider management
│   ├── cache/page.tsx  # Cache monitoring
│   ├── billing/page.tsx # Billing & plans
│   ├── settings/page.tsx # Org settings
│   └── logs/page.tsx   # Request logs
\`\`\`

### Server Components vs Client Components

\`\`\`typescript
// Server Component (default) — runs on the server
// No "use client" directive needed
export default async function UsagePage() {
  const supabase = createServerClient();
  const { data: usage } = await supabase
    .from("usage_daily")
    .select("*")
    .order("date", { ascending: false })
    .limit(30);

  return <UsageChart data={usage} />;
}

// Client Component — runs in the browser
"use client";
export function UsageChart({ data }: { data: UsageDaily[] }) {
  const [timeRange, setTimeRange] = useState("30d");
  // Interactive chart with state
  return <Chart data={data} range={timeRange} />;
}
\`\`\`

### Middleware for Auth

\`\`\`typescript
// dashboard/middleware.ts
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();

  // Redirect to login if not authenticated
  if (!session && req.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Redirect to dashboard if already authenticated
  if (session && (req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return res;
}
\`\`\`

### Server Actions for Mutations

\`\`\`typescript
// app/(dashboard)/settings/actions.ts
"use server";

export async function updateOrgSettings(formData: FormData) {
  const supabase = createServerClient();
  const name = formData.get("name") as string;
  const routingStrategy = formData.get("routingStrategy") as string;

  const { error } = await supabase
    .from("organizations")
    .update({ name, default_routing_strategy: routingStrategy })
    .eq("id", orgId);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/settings");
}
\`\`\``,
      prosAndCons: {
        pros: [
          "Zero-config setup — routing, bundling, SSR all work out of the box",
          "Server Components reduce client-side JavaScript significantly",
          "Excellent performance — automatic code splitting, image optimization, font optimization",
          "File-based routing is intuitive for page-heavy applications",
          "Huge ecosystem — shadcn/ui, next-auth, next-intl, etc.",
          "Vercel deployment is seamless (but can deploy anywhere with Node.js)",
        ],
        cons: [
          "App Router complexity — Server vs Client Components have a learning curve",
          "Vercel-centric — some features work best on Vercel's platform",
          "Bundle size can grow large for complex applications",
          "Middleware runs on the edge (limited Node.js APIs available)",
          "Caching behavior in App Router can be confusing and opaque",
          "Breaking changes between major versions require significant migration effort",
        ],
      },
      alternatives: [
        {
          name: "Remix",
          comparison:
            "Full-stack React framework with nested routing and data loaders. Better form handling and progressive enhancement. But smaller ecosystem, no Server Components, and less corporate backing.",
        },
        {
          name: "Vite + React Router",
          comparison:
            "Lightweight SPA setup with fast builds. Full control over architecture. But no SSR out of the box, manual code splitting, and more configuration required.",
        },
        {
          name: "Astro",
          comparison:
            "Content-focused framework with island architecture. Excellent for static sites and blogs. But less suited for highly interactive dashboard applications.",
        },
        {
          name: "SvelteKit",
          comparison:
            "Full-stack framework for Svelte. Excellent performance, simpler mental model. But Svelte ecosystem is smaller than React's, and fewer pre-built UI components.",
        },
      ],
      keyAPIs: [
        "app/ directory — App Router file-based routing",
        "page.tsx / layout.tsx / loading.tsx / error.tsx — special files",
        "'use client' / 'use server' — component directives",
        "generateMetadata() — dynamic page metadata",
        "NextResponse / NextRequest — middleware APIs",
        "revalidatePath() / revalidateTag() — on-demand revalidation",
        "next/image — optimized image component",
        "next/font — font optimization",
      ],
      academicFoundations: `**Server-Side Rendering (SSR):** The idea of rendering HTML on the server predates the SPA era. Next.js brings SSR back with React Server Components, combining the interactivity of SPAs with the performance of server-rendered pages. This is a pendulum swing back toward the original web architecture (server-rendered HTML) with modern enhancements.

**Streaming & Suspense:** Next.js App Router uses React Suspense boundaries and HTTP streaming to progressively render pages. This is based on chunked transfer encoding (HTTP/1.1) and streaming architectures where the server sends HTML in chunks as data becomes available, rather than waiting for everything.

**Islands Architecture:** While Next.js doesn't use the islands pattern directly, Server Components achieve a similar goal: most of the page is static HTML (server-rendered) with "islands" of interactivity (Client Components). This pattern was formalized by Katie Sylor-Miller and popularized by Astro.

**Convention Over Configuration:** Next.js follows the Rails philosophy (David Heinemeier Hansson, 2004) where the framework makes decisions for you based on conventions (file-based routing, special file names) rather than requiring explicit configuration. This reduces boilerplate and cognitive overhead.

**Incremental Static Regeneration:** ISR implements a hybrid between static and dynamic rendering, similar to the stale-while-revalidate cache control directive (RFC 5861). Pages are served from cache while being regenerated in the background, providing both performance and freshness.`,
      furtherReading: [
        "Next.js documentation — nextjs.org/docs",
        "React Server Components RFC — github.com/reactjs/rfcs/pull/188",
        "Patterns.dev — patterns.dev (React and rendering patterns)",
        "Vercel Blog — vercel.com/blog (Next.js architecture deep dives)",
      ],
    },
  ],
};
