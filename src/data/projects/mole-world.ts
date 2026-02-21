import type { Project } from "../types";

export const moleWorld: Project = {
  id: "mole-world",
  name: "Mole World Dashboard",
  description:
    "Production dashboard for an AI-generated animated short film built with WanVideo 2.1, ComfyUI, and Next.js. Real-time pipeline monitoring, storyboard viewer, voice lab, and pitch deck.",
  repo: "https://github.com/aptsalt/mole-world-dashboard",
  languages: ["TypeScript", "CSS"],
  designPatterns: [
    {
      name: "Component Composition Pattern (React)",
      category: "structural",
      whatItIs: "A pattern where complex UIs are built by composing small, reusable components together, passing data and behavior through props and children.",
      howProjectUsesIt: "Dashboard panels, status badges, metric cards, and scene cards are composed into Pipeline Monitor, Storyboard Viewer, and Metrics pages from shared building blocks.",
    },
    {
      name: "State Management Pattern (Zustand)",
      category: "architectural",
      whatItIs: "A centralized state pattern where application state lives in a global store, with components subscribing to specific slices for selective re-rendering.",
      howProjectUsesIt: "Zustand stores hold pipeline status, user preferences, and storyboard navigation state, shared across multiple dashboard views with selective subscriptions.",
    },
    {
      name: "Observer Pattern (real-time pipeline updates)",
      category: "behavioral",
      whatItIs: "A pattern where an object (subject) maintains a list of dependents (observers) and notifies them of state changes, enabling loose coupling between producers and consumers.",
      howProjectUsesIt: "Pipeline status updates from ComfyUI are observed by the Zustand store, which notifies subscribed dashboard components to re-render with the latest generation progress.",
    },
    {
      name: "Presentational/Container Pattern",
      category: "structural",
      whatItIs: "A separation pattern where container components handle data fetching and state logic while presentational components focus purely on rendering UI based on props.",
      howProjectUsesIt: "Container components fetch pipeline data and metrics via hooks, while presentational components like StatusBadge, ProgressBar, and MetricCard render the visuals.",
    },
    {
      name: "Strategy Pattern (multiple animation renderers)",
      category: "behavioral",
      whatItIs: "A pattern that defines a family of interchangeable algorithms, allowing the client to select which algorithm to use at runtime without changing the consuming code.",
      howProjectUsesIt: "Different animation strategies (spring physics, keyframe, timeline) are selected for pipeline progress bars, scene transitions, and micro-interactions via Framer Motion variants.",
    },
  ],
  keyTakeaways: [
    "AI video generation pipelines require extensive monitoring — generation can fail silently with degraded quality.",
    "Zustand provides simpler state management than Redux for medium-complexity applications.",
    "Framer Motion makes complex animations declarative and composable in React.",
    "Recharts provides a simple API for data visualization in React dashboards.",
    "ComfyUI's node-based workflow enables visual pipeline design for AI video generation.",
  ],
  coreConcepts: [
    {
      name: "AI Video Generation",
      slug: "ai-video-generation",
      whatItIs: "Using AI models to generate video content from text prompts, images, or other inputs. Models like WanVideo 2.1 can produce short video clips with specified visual styles, camera movements, and scene compositions.",
      whyItMatters: "Traditional animation requires frame-by-frame creation by skilled artists. AI video generation can produce rough cuts and visual concepts in minutes, dramatically accelerating pre-production and storyboarding.",
      howProjectUsesIt: "The Mole World animated short is generated using WanVideo 2.1, with the dashboard monitoring generation pipeline status, quality metrics, and costs across all scenes.",
      keyTerms: [
        { term: "WanVideo 2.1", definition: "Open-source AI video generation model for creating short video clips from text/image prompts" },
        { term: "Frame Interpolation", definition: "Generating intermediate frames between keyframes for smoother video" },
        { term: "Scene Composition", definition: "Defining camera angles, lighting, and object placement for AI-generated scenes" },
      ],
    },
    {
      name: "ComfyUI Workflows",
      slug: "comfyui-workflows",
      whatItIs: "ComfyUI is a node-based visual interface for building AI image and video generation pipelines. Instead of writing code, you connect nodes (model loaders, samplers, encoders) into visual workflows that define the generation process.",
      whyItMatters: "AI generation pipelines have many parameters and steps. Visual node graphs make it easy to experiment with different configurations, share workflows, and debug generation issues without coding.",
      howProjectUsesIt: "ComfyUI workflows define the WanVideo generation pipeline — model loading, prompt encoding, sampling parameters, and post-processing steps. The dashboard monitors these workflow executions.",
      keyTerms: [
        { term: "Node Graph", definition: "Visual programming paradigm where processing steps are connected as nodes with input/output ports" },
        { term: "Sampler", definition: "The algorithm that iteratively denoises latent representations to produce images/video" },
        { term: "Checkpoint", definition: "A saved model state (weights) used as the base for generation" },
      ],
    },
    {
      name: "Pipeline Monitoring",
      slug: "pipeline-monitoring",
      whatItIs: "Real-time tracking of multi-stage processing pipelines — monitoring status, progress, quality metrics, timing, and costs for each stage. Essential for long-running AI generation tasks that can fail silently.",
      whyItMatters: "AI video generation takes minutes per clip and can fail silently with degraded quality. Without monitoring, you discover problems only after wasting compute time and costs on bad outputs.",
      howProjectUsesIt: "The dashboard provides real-time pipeline status via Zustand state management, generation quality metrics via Recharts, and per-scene cost analytics. Each generation stage (prompt encoding, sampling, decoding) is tracked independently.",
      keyTerms: [
        { term: "Pipeline Stage", definition: "A discrete step in the generation process (encoding, sampling, decoding, post-processing)" },
        { term: "Quality Metrics", definition: "Measurements of generation output quality (visual fidelity, consistency, prompt adherence)" },
        { term: "Cost Analytics", definition: "Tracking compute costs per scene, per stage, and per generation run" },
      ],
    },
  ],
  videoResources: [
    {
      title: "ComfyUI Explained",
      url: "https://www.youtube.com/watch?v=LNOlk8oz1nY",
      channel: "Olivio Sarikas",
      durationMinutes: 20,
      relevance: "Introduction to ComfyUI node-based workflows used in the video generation pipeline",
    },
    {
      title: "Zustand State Management",
      url: "https://www.youtube.com/watch?v=KEc0LLQjyfQ",
      channel: "Jack Herrington",
      durationMinutes: 15,
      relevance: "Zustand patterns used for pipeline state management in the dashboard",
    },
    {
      title: "Framer Motion Crash Course",
      url: "https://www.youtube.com/watch?v=znbCa4Rr054",
      channel: "Fireship",
      durationMinutes: 8,
      relevance: "Animation library powering the dashboard transitions and micro-interactions",
    },
  ],
  realWorldExamples: [
    {
      company: "Runway",
      product: "Runway Gen-3",
      description: "Runway's Gen-3 Alpha generates professional-quality video from text prompts. Same AI video generation concept used by Hollywood studios for pre-visualization.",
      conceptConnection: "Commercial AI video generation with production quality",
    },
    {
      company: "Pika",
      product: "Pika Labs",
      description: "Pika creates and edits videos using AI, allowing users to generate, extend, and modify video clips from text and image inputs.",
      conceptConnection: "AI video generation and editing for creators",
    },
    {
      company: "Netflix",
      product: "Production Dashboard",
      description: "Netflix uses internal dashboards to monitor content production pipelines — tracking status, quality, and costs across thousands of titles in production.",
      conceptConnection: "Pipeline monitoring dashboard for content production",
    },
  ],
  cicd: {
    overview: "Standard Next.js build pipeline with TypeScript type checking and ESLint.",
    stages: [
      {
        name: "Type Checking",
        tool: "TypeScript",
        description: "Strict mode type checking across all components",
        commands: ["npx tsc --noEmit"],
      },
      {
        name: "Linting",
        tool: "ESLint",
        description: "Next.js ESLint configuration for code quality",
        commands: ["npm run lint"],
      },
      {
        name: "Build",
        tool: "Next.js",
        description: "Production build with optimizations",
        commands: ["npm run build"],
      },
      {
        name: "Deployment",
        tool: "Vercel",
        description: "Automated deployment on push to main",
      },
    ],
  },
  architecture: [
    {
      title: "Dashboard Architecture",
      content: `The Mole World Dashboard monitors an AI video generation pipeline:

**Pages:**
- **Pipeline Monitor** — real-time status of video generation stages
- **Storyboard Viewer** — visual storyboard with scene descriptions
- **Voice Lab** — TTS experiment interface
- **Pitch Deck** — interactive presentation for stakeholders
- **Metrics** — generation quality, timing, and cost analytics

**Data Flow:**
Pipeline status → Zustand store → React components → UI updates
Recharts renders pipeline metrics and quality trends.`,
      diagram: `ComfyUI Workflow → [WanVideo 2.1] → Generated Video
                        │
                   Status Events
                        │
                        ▼
              ┌─────────────────┐
              │  Zustand Store  │
              │  ├── pipeline   │
              │  ├── scenes     │
              │  └── metrics    │
              └────────┬────────┘
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
    [Pipeline    [Storyboard  [Metrics
     Monitor]     Viewer]      Charts]
    (Recharts)               (Recharts)`,
    },
  ],
  technologies: [
    {
      name: "Next.js",
      category: "framework",
      icon: "NX",
      tagline: "The React framework for production",
      origin: {
        creator: "Guillermo Rauch at Vercel (formerly ZEIT)",
        year: 2016,
        motivation:
          "React alone provided no opinions on routing, server-side rendering, or data fetching. Every React project required assembling a custom toolchain. Next.js unified these concerns into a single, opinionated framework with file-based routing, SSR, SSG, and API routes.",
      },
      whatItIs: `Next.js is a full-stack React framework providing:
- **App Router** — file-system based routing with nested layouts
- **Server Components** — React components that run on the server, sending HTML instead of JavaScript
- **Server Actions** — RPC-style server mutations from client components
- **Streaming SSR** — progressive HTML rendering with Suspense
- **Static Site Generation (SSG)** — pre-render pages at build time
- **API Routes** — serverless API endpoints co-located with frontend
- **Middleware** — edge functions for request/response manipulation
- **Image/Font Optimization** — automatic optimization for Core Web Vitals`,
      explainLikeImTen: `Imagine you're building a house. React gives you bricks, but Next.js gives you bricks AND a blueprint, a foundation, plumbing, and electricity all ready to go. Instead of figuring out how to connect every room yourself, Next.js says "put a file in this folder and I'll make it a page." It also makes your website load super fast by preparing some pages ahead of time, like a restaurant that pre-makes popular dishes so they're ready the moment you order.`,
      realWorldAnalogy: `Next.js is like a pre-fabricated house kit vs building from raw lumber. React gives you the raw materials (components), but Next.js gives you a complete construction system with walls, plumbing, and wiring already designed to fit together. You still customize every room, but you skip months of infrastructure work.`,
      whyWeUsedIt: `The Mole World Dashboard is a multi-page production application:
- App Router provides clean routing for Pipeline, Storyboard, Voice Lab, Pitch Deck, and Metrics pages
- Server Components render static content (storyboard descriptions, pitch deck slides) without client JavaScript
- File-based routing eliminates manual route configuration
- Built-in image optimization for storyboard thumbnails and generated video frames
- Vercel deployment for instant previews and production hosting`,
      howItWorksInProject: `- App Router with nested layouts for consistent dashboard chrome
- Server Components for static content pages (pitch deck, storyboard descriptions)
- Client Components for interactive elements (pipeline monitor, voice lab, metrics charts)
- Dynamic routes for scene-specific pages (/storyboard/[sceneId])
- Image component optimizes generated video thumbnails`,
      featuresInProject: [
        {
          feature: "App Router with nested layouts",
          description: "Root layout provides the dashboard shell (sidebar, header), while each page (Pipeline, Storyboard, Metrics) has its own nested layout for section-specific navigation.",
        },
        {
          feature: "File-based routing",
          description: "Each dashboard section is a folder under /app — /app/pipeline, /app/storyboard, /app/voice-lab, /app/pitch-deck, /app/metrics — automatically creating routes.",
        },
        {
          feature: "Server Components for static content",
          description: "Pitch deck slides and storyboard descriptions are Server Components — rendered on the server with zero client-side JavaScript, improving load performance.",
        },
        {
          feature: "Dynamic route segments",
          description: "Storyboard uses /storyboard/[sceneId] dynamic routes so each scene has its own URL for deep-linking and sharing.",
        },
        {
          feature: "Image optimization",
          description: "Next.js Image component automatically optimizes video frame thumbnails and storyboard images with lazy loading, responsive sizing, and format conversion.",
        },
      ],
      coreConceptsMarkdown: `### App Router

\`\`\`
app/
├── layout.tsx          # Root layout (dashboard shell)
├── page.tsx            # Home / overview
├── pipeline/
│   ├── layout.tsx      # Pipeline section layout
│   └── page.tsx        # Pipeline monitor
├── storyboard/
│   ├── page.tsx        # Storyboard grid
│   └── [sceneId]/
│       └── page.tsx    # Individual scene detail
├── voice-lab/
│   └── page.tsx        # Voice lab interface
├── pitch-deck/
│   └── page.tsx        # Pitch deck viewer
└── metrics/
    └── page.tsx        # Analytics dashboard
\`\`\`

### Server vs Client Components

\`\`\`tsx
// Server Component (default) — runs on server, sends HTML
export default async function PitchDeck() {
  const slides = await getSlides();
  return <SlideViewer slides={slides} />;
}

// Client Component — runs in browser
"use client";
export function PipelineMonitor() {
  const status = usePipelineStore((s) => s.status);
  return <StatusPanel status={status} />;
}
\`\`\`

### Rendering Strategies

| Strategy | When | Use Case |
|----------|------|----------|
| Server Components | Default | Static content, data fetching |
| Client Components | "use client" | Interactivity, state, effects |
| SSG | generateStaticParams | Pre-rendered pages |
| Streaming | Suspense | Progressive loading |`,
      prosAndCons: {
        pros: [
          "Full-stack framework — routing, SSR, API routes, middleware in one package",
          "App Router with React Server Components reduces client JavaScript",
          "File-based routing eliminates manual route configuration",
          "Automatic code splitting per route",
          "Image and font optimization built-in",
          "Vercel deployment is seamless with preview deployments",
        ],
        cons: [
          "App Router has a steep learning curve (Server vs Client components)",
          "Vendor lock-in concerns with Vercel-specific features",
          "Build times can be slow for large applications",
          "Frequent breaking changes between major versions",
          "Server Actions are still maturing — error handling is rough",
          "Debugging SSR issues is harder than client-only React",
        ],
      },
      alternatives: [
        {
          name: "Remix",
          comparison: "Full-stack React framework with nested routing and progressive enhancement. Uses web standards (FormData, Response) more heavily. Better for forms-heavy apps but smaller ecosystem.",
        },
        {
          name: "Vite + React Router",
          comparison: "Lighter-weight setup with fast HMR. No SSR by default but can add it. Better for SPAs that don't need server rendering.",
        },
        {
          name: "Astro",
          comparison: "Content-focused framework with island architecture. Ships zero JavaScript by default. Better for content sites but less suited for interactive dashboards.",
        },
        {
          name: "SvelteKit",
          comparison: "Full-stack Svelte framework. Simpler mental model (no Server/Client component split). Smaller ecosystem but growing rapidly.",
        },
      ],
      keyAPIs: [
        "app/ directory — file-based routing",
        "layout.tsx — shared layouts with nested routing",
        "page.tsx — route pages",
        "loading.tsx / error.tsx — loading and error states",
        "generateStaticParams — static generation for dynamic routes",
        "next/image — optimized image component",
        "next/link — client-side navigation",
        "next/font — automatic font optimization",
        "middleware.ts — edge middleware",
      ],
      academicFoundations: `**Isomorphic JavaScript (Airbnb, 2013):** The concept of running the same JavaScript code on server and client. Next.js fully realizes this vision — React components render on the server for initial page load, then hydrate on the client for interactivity.

**Incremental Static Regeneration:** Next.js pioneered ISR, which combines the performance of static sites (CDN-cached HTML) with the freshness of dynamic rendering. Pages are statically generated at build time but can be revalidated on-demand, blending SSG and SSR.

**Edge Computing:** Next.js Middleware and Edge Runtime run at CDN edge locations, inspired by Cloudflare Workers. This moves computation closer to users, reducing latency for operations like authentication, redirects, and A/B testing.`,
      furtherReading: [
        "Next.js documentation — nextjs.org/docs",
        "App Router migration guide — nextjs.org/docs/app",
        "Vercel architecture — vercel.com/docs",
        "Patterns.dev — patterns.dev (React patterns in Next.js context)",
      ],
    },
    {
      name: "React",
      category: "framework",
      icon: "RE",
      tagline: "The library for building user interfaces",
      origin: {
        creator: "Jordan Walke at Facebook",
        year: 2013,
        motivation:
          "Facebook's News Feed was becoming impossible to maintain with direct DOM manipulation. Jordan Walke created React to introduce a declarative, component-based model for building UIs with a virtual DOM for efficient updates.",
      },
      whatItIs: `React is a JavaScript library for building user interfaces:
- **Declarative:** Describe what the UI should look like, React handles DOM updates
- **Component-Based:** Build encapsulated components that manage their own state
- **Virtual DOM:** Efficient reconciliation algorithm minimizes real DOM operations
- **Hooks:** useState, useEffect, useContext — functional state management
- **Server Components:** Components that run on the server, reducing client JS
- **Concurrent Features:** Suspense, transitions, streaming SSR`,
      explainLikeImTen: `Think of React like building with LEGO blocks. Each block is a "component" — it could be a button, a card, or a whole section of a website. You snap these blocks together to build your page. The cool part is, when something changes (like a new notification), React is smart enough to only update the specific block that changed, instead of rebuilding the whole thing. It's like if your LEGO city could magically swap out just one building without touching the rest.`,
      realWorldAnalogy: `React is like a restaurant kitchen with a ticket system. When a customer changes their order (state change), the kitchen doesn't remake every dish — it only remakes the dish that changed. The ticket system (virtual DOM) keeps track of what needs updating, and the chef (React reconciler) figures out the minimum work needed to get every table's order right.`,
      whyWeUsedIt: `The Mole World Dashboard is built entirely with React components:
- Component composition for reusable dashboard panels, status badges, and metric cards
- Hooks manage pipeline state, user preferences, and animation state
- React's ecosystem provides charting (Recharts), animation (Framer Motion), and state management (Zustand)
- Server Components render static dashboard content without client-side JS overhead`,
      howItWorksInProject: `- Functional components with hooks throughout the application
- Custom hooks for pipeline data polling and state management
- Composition pattern for dashboard layout (panels, cards, grids)
- React.memo and useMemo optimize re-renders for metric-heavy views
- Suspense boundaries for loading states on data-dependent panels`,
      featuresInProject: [
        {
          feature: "Component composition for dashboard panels",
          description: "Reusable panel components (StatusPanel, MetricCard, SceneCard) compose into different dashboard views — Pipeline Monitor, Storyboard Viewer, and Metrics pages all share the same building blocks.",
        },
        {
          feature: "Custom hooks for data management",
          description: "usePipelineStatus, useSceneData, and useMetrics custom hooks encapsulate data fetching, polling, and transformation logic, keeping components focused on rendering.",
        },
        {
          feature: "Conditional rendering for pipeline states",
          description: "Pipeline Monitor uses conditional rendering to show different UI states — idle, generating, complete, error — each with distinct visual treatments and available actions.",
        },
        {
          feature: "React.memo for performance optimization",
          description: "Metric cards and chart components are wrapped in React.memo to prevent unnecessary re-renders when unrelated state changes, critical for a dashboard with many simultaneously visible components.",
        },
        {
          feature: "Suspense boundaries for progressive loading",
          description: "Each dashboard section is wrapped in a Suspense boundary with a skeleton loader, so pipeline data, storyboard images, and metric charts load independently without blocking each other.",
        },
      ],
      coreConceptsMarkdown: `### Component Model

\`\`\`tsx
// Functional component with hooks
function PipelineStatus({ pipelineId }: { pipelineId: string }) {
  const status = usePipelineStore((s) => s.status);
  const progress = usePipelineStore((s) => s.progress);

  return (
    <div className="flex items-center gap-2">
      <StatusBadge status={status} />
      <ProgressBar value={progress} />
    </div>
  );
}
\`\`\`

### Hooks

\`\`\`tsx
// Custom hook for pipeline data
function usePipelineData(sceneId: string) {
  const [data, setData] = useState<SceneData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const interval = setInterval(async () => {
      const result = await fetchSceneData(sceneId);
      setData(result);
      setLoading(false);
    }, 5000);
    return () => clearInterval(interval);
  }, [sceneId]);

  return { data, loading };
}
\`\`\`

### Reconciliation

1. State change triggers re-render
2. React builds new Virtual DOM tree
3. Diffing algorithm compares with previous tree
4. Minimal DOM operations computed and applied
5. Browser paints the update`,
      prosAndCons: {
        pros: [
          "Massive ecosystem — most popular UI library",
          "Component model scales from widgets to large applications",
          "Hooks provide clean, composable state management",
          "Strong TypeScript support with generics and strict typing",
          "Server Components reduce client-side JavaScript",
          "Concurrent features enable responsive UIs under load",
        ],
        cons: [
          "Not a full framework — needs Next.js/Remix for routing, SSR",
          "Server vs Client component mental model is complex",
          "useEffect is widely misunderstood and misused",
          "Bundle size grows with dependency count",
          "Frequent major versions with migration effort",
          "Meta-driven roadmap — community has limited influence",
        ],
      },
      alternatives: [
        {
          name: "Vue.js",
          comparison: "More approachable with template syntax and two-way binding. Single-file components are elegant. Smaller ecosystem but growing.",
        },
        {
          name: "Svelte",
          comparison: "Compiles to vanilla JS — no virtual DOM, no runtime. Smaller bundles, simpler reactivity model. But smaller ecosystem and less mature tooling.",
        },
        {
          name: "Solid.js",
          comparison: "Fine-grained reactivity (no virtual DOM). React-like JSX but fundamentally different rendering model. Faster than React but tiny ecosystem.",
        },
        {
          name: "Angular",
          comparison: "Full framework with dependency injection, RxJS, forms, routing built-in. More opinionated, steeper learning curve. Better for large enterprise teams.",
        },
      ],
      keyAPIs: [
        "useState — local component state",
        "useEffect — side effects (data fetching, subscriptions)",
        "useContext — consume context without prop drilling",
        "useMemo / useCallback — memoization for performance",
        "useRef — mutable refs and DOM access",
        "Suspense — loading states for async components",
        "React.memo — skip re-renders when props are unchanged",
      ],
      academicFoundations: `**Functional Reactive Programming (FRP):** React's "UI = f(state)" model is rooted in FRP, formalized by Conal Elliott and Paul Hudak (1997). In FRP, the UI is a continuous function of time-varying values.

**Virtual DOM & Tree Diffing:** React's reconciliation is based on tree edit distance algorithms. The general tree diff problem is O(n^3), but React uses heuristics (same-type assumption, keys) to achieve O(n). Based on Tai's tree edit distance algorithm (1979).

**Fiber Architecture & Cooperative Scheduling:** React Fiber implements cooperative multitasking inspired by algebraic effects (Plotkin & Power, 2003). Rendering work is split into units that can be paused, resumed, and prioritized — enabling concurrent rendering.

**Component Model:** React's component model descends from Smalltalk's MVC (1979) and the composite pattern (GoF). Each component encapsulates state, behavior, and presentation.`,
      furtherReading: [
        "React documentation — react.dev",
        "Overreacted (Dan Abramov's blog) — overreacted.io",
        "React Fiber architecture — github.com/acdlite/react-fiber-architecture",
        "React Design Principles — react.dev/community/react-design-principles",
      ],
    },
    {
      name: "TypeScript",
      category: "language",
      icon: "TS",
      tagline: "JavaScript with types",
      origin: {
        creator: "Anders Hejlsberg at Microsoft",
        year: 2012,
        motivation:
          "Large-scale JavaScript applications at Microsoft and Google were plagued by runtime type errors, poor IDE support, and difficult refactoring. Anders Hejlsberg (creator of C# and Turbo Pascal) designed TypeScript as a strict superset of JavaScript that adds optional static typing.",
      },
      whatItIs: `TypeScript is a typed superset of JavaScript that compiles to plain JavaScript:
- **Static Types:** Catch errors at compile time, not runtime
- **Type Inference:** Automatically infers types without explicit annotations
- **Interfaces & Generics:** Model complex data shapes and reusable patterns
- **Strict Mode:** Enables stricter checks (strictNullChecks, noImplicitAny)
- **IDE Integration:** Powers autocomplete, refactoring, and inline documentation
- **Gradual Adoption:** Existing JavaScript is valid TypeScript`,
      explainLikeImTen: `Imagine you're writing a recipe. JavaScript is like writing "add some stuff to the bowl" — it works, but someone might add salt when you meant sugar. TypeScript is like writing "add 2 cups of sugar (white, granulated)" — it's very specific about what goes where. If someone tries to add the wrong ingredient, TypeScript catches the mistake before you even start cooking. It's a helper that reads your recipe and says "hey, this step won't work" before anything goes wrong.`,
      realWorldAnalogy: `TypeScript is like the safety rails and lane markers on a highway. JavaScript is the open road — you can drive anywhere, but you might accidentally swerve into oncoming traffic. TypeScript adds lane lines, guardrails, and signs that keep you on the right path. You can still drive fast, but the infrastructure prevents entire categories of crashes before they happen.`,
      whyWeUsedIt: `A production dashboard must be reliable:
- Type safety catches data shape mismatches between pipeline status updates and UI components
- Interface definitions for Pipeline, Scene, Metric types serve as living documentation
- Strict mode prevents null/undefined errors in production monitoring views
- IDE autocomplete accelerates development across 5+ dashboard pages
- Refactoring is safe — rename a field and TypeScript finds every usage`,
      howItWorksInProject: `- Strict mode enabled in tsconfig.json (strict: true)
- Typed Zustand stores with explicit state and action interfaces
- Generic types for dashboard data structures (Scene<T>, Metric<T>)
- Zod schemas validate external data at system boundaries (API responses)
- Path aliases configured for clean imports (@/components, @/lib)`,
      featuresInProject: [
        {
          feature: "Typed Zustand store definitions",
          description: "PipelineStore, StoryboardStore, and PreferencesStore interfaces define exact state shapes and action signatures, preventing misuse across the 5+ components that consume each store.",
        },
        {
          feature: "Interface definitions for domain models",
          description: "Scene, PipelineStage, Metric, VoiceConfig, and PitchSlide interfaces model the entire domain. These types are the single source of truth shared between data layer and UI components.",
        },
        {
          feature: "Strict null checks in pipeline monitoring",
          description: "Pipeline status can be null during initial load — strictNullChecks forces every component to handle the loading/null case, preventing blank screen errors in production.",
        },
        {
          feature: "Generic utility types for chart data",
          description: "Generic types like ChartDataPoint<T extends string> let Recharts components accept different metric shapes while maintaining type safety for data keys.",
        },
        {
          feature: "Discriminated unions for pipeline states",
          description: "Pipeline status uses a discriminated union type ('idle' | 'generating' | 'complete' | 'error') so TypeScript narrows the type in switch statements, ensuring every state is handled.",
        },
      ],
      coreConceptsMarkdown: `### Type System Basics

\`\`\`typescript
// Interfaces define data shapes
interface Scene {
  id: string;
  title: string;
  description: string;
  duration: number;
  status: "pending" | "generating" | "complete" | "failed";
  qualityScore?: number; // optional
}

// Generics for reusable patterns
interface ApiResponse<T> {
  data: T;
  timestamp: number;
  error?: string;
}

// Discriminated unions
type PipelineEvent =
  | { type: "started"; sceneId: string }
  | { type: "progress"; sceneId: string; percent: number }
  | { type: "complete"; sceneId: string; outputUrl: string }
  | { type: "error"; sceneId: string; message: string };

function handleEvent(event: PipelineEvent) {
  switch (event.type) {
    case "progress":
      updateProgress(event.percent); // TS knows percent exists
      break;
    case "error":
      showError(event.message); // TS knows message exists
      break;
  }
}
\`\`\`

### Strict Mode

\`\`\`json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
\`\`\`

Strict mode enables: strictNullChecks, noImplicitAny, strictFunctionTypes, strictBindCallApply, and more.`,
      prosAndCons: {
        pros: [
          "Catches entire categories of bugs at compile time",
          "IDE autocomplete and inline documentation",
          "Safe refactoring — rename a symbol and find all usages",
          "Self-documenting code via type annotations",
          "Gradual adoption — can add types incrementally",
          "Industry standard for professional JavaScript development",
        ],
        cons: [
          "Build step required (compilation to JavaScript)",
          "Learning curve for advanced types (conditional types, mapped types)",
          "Type definitions for third-party libraries can be outdated or incorrect",
          "Can slow down prototyping when types are complex",
          "Configuration complexity (tsconfig options)",
          "Runtime type checking still requires separate validation (Zod)",
        ],
      },
      alternatives: [
        {
          name: "JavaScript (plain)",
          comparison: "No compilation step, faster to prototype. JSDoc comments provide partial type checking. But no compile-time safety, worse IDE support, harder refactoring.",
        },
        {
          name: "Flow",
          comparison: "Facebook's type checker for JavaScript. Similar goals but lost the ecosystem war to TypeScript. Fewer contributors, smaller community, less tooling support.",
        },
        {
          name: "ReScript",
          comparison: "ML-family language that compiles to JavaScript. Sound type system (no any). Much smaller ecosystem but genuinely eliminates runtime type errors.",
        },
      ],
      keyAPIs: [
        "interface — define object shapes",
        "type — type aliases and unions",
        "generics <T> — parameterized types",
        "as const — literal type inference",
        "satisfies — validate type without widening",
        "keyof / typeof — type-level operators",
        "Partial<T>, Required<T>, Pick<T, K> — utility types",
      ],
      academicFoundations: `**Type Theory (Church, 1940):** TypeScript's type system is rooted in simply typed lambda calculus. Type checking ensures programs are well-formed before execution — a concept from Alonzo Church's work on formal systems.

**Hindley-Milner Type Inference (1969/1978):** TypeScript's type inference (inferring types without explicit annotations) descends from the Hindley-Milner type system used in ML, Haskell, and OCaml. TypeScript uses a bidirectional type inference approach.

**Structural Typing (vs Nominal):** TypeScript uses structural typing — two types are compatible if their structures match, regardless of name. This contrasts with nominal typing (Java, C#) where types must be explicitly declared compatible. Structural typing aligns better with JavaScript's duck-typed nature.

**Gradual Typing (Siek & Taha, 2006):** TypeScript implements gradual typing — the ability to mix typed and untyped code. The 'any' type acts as the bridge between the typed and untyped worlds.`,
      furtherReading: [
        "TypeScript Handbook — typescriptlang.org/docs/handbook",
        "Type Challenges — github.com/type-challenges/type-challenges",
        "Effective TypeScript by Dan Vanderkam",
        "Total TypeScript — totaltypescript.com",
      ],
    },
    {
      name: "Tailwind CSS",
      category: "library",
      icon: "TW",
      tagline: "Utility-first CSS framework",
      origin: {
        creator: "Adam Wathan",
        year: 2017,
        motivation:
          "Traditional CSS methodologies (BEM, OOCSS, SMACSS) attempted to organize CSS but still resulted in large, hard-to-maintain stylesheets. Adam Wathan argued that utility classes are more maintainable because they co-locate styles with markup, eliminating naming and specificity problems.",
      },
      whatItIs: `Tailwind CSS is a utility-first CSS framework:
- **Utility classes** — small, single-purpose classes (\`flex\`, \`p-4\`, \`text-blue-500\`)
- **No pre-built components** — build your own using utilities
- **Design tokens** — customizable spacing, colors, typography scales
- **JIT (Just-In-Time)** — generates only the CSS you use
- **Responsive** — mobile-first breakpoint prefixes (\`md:\`, \`lg:\`)
- **Dark mode** — \`dark:\` variant for dark mode styles`,
      explainLikeImTen: `Imagine you have a huge box of stickers — some change colors, some add borders, some make things bigger or smaller. Instead of drawing each design from scratch, you just stick the right combination of stickers on each piece. "This card needs a shadow sticker, a round-corners sticker, and a blue-background sticker." That's Tailwind — instead of writing custom styles for everything, you combine small, reusable "sticker" classes to style your page.`,
      realWorldAnalogy: `Tailwind CSS is like a modular closet system versus custom-built furniture. With traditional CSS, you hire a carpenter to build a unique dresser for every room (custom CSS classes). With Tailwind, you buy standardized shelf units, drawer inserts, and dividers, then assemble them into exactly the configuration you need. Every piece is interchangeable, and you never end up with an orphaned custom dresser that nobody knows how to modify.`,
      whyWeUsedIt: `The dashboard needs consistent, responsive styling:
- Utility classes let us build dashboard panels, cards, and layouts quickly
- Design tokens enforce consistent spacing, colors, and typography across all dashboard pages
- Responsive prefixes handle tablet and mobile layouts for the dashboard
- Dark mode support for monitoring environments (production dashboards are often viewed in dark rooms)
- JIT generates zero unused CSS in production`,
      howItWorksInProject: `- Tailwind CSS configured with Next.js PostCSS pipeline
- Custom color palette for pipeline status states (green/amber/red)
- Responsive grid layouts for dashboard panels
- Dark mode as default for the monitoring dashboard
- Utility classes compose every dashboard component`,
      featuresInProject: [
        {
          feature: "Pipeline status color system",
          description: "Custom Tailwind color tokens map to pipeline states — green for complete, amber for generating, red for error, gray for idle — used consistently across status badges, progress bars, and timeline indicators.",
        },
        {
          feature: "Responsive dashboard grid",
          description: "Dashboard panels use Tailwind's grid utilities (grid-cols-1 md:grid-cols-2 lg:grid-cols-3) to rearrange from stacked mobile layout to multi-column desktop layout.",
        },
        {
          feature: "Dark mode as default",
          description: "The dashboard defaults to dark mode (dark:bg-gray-950, dark:text-gray-100) optimized for production monitoring environments where teams view dashboards in dimly lit rooms.",
        },
        {
          feature: "Micro-interaction styling",
          description: "Hover, focus, and active state utilities (hover:bg-gray-800, focus:ring-2) provide tactile feedback on interactive dashboard elements without writing custom CSS.",
        },
        {
          feature: "Consistent spacing scale",
          description: "Tailwind's spacing scale (p-2, p-4, p-6, gap-4) enforces consistent whitespace across all dashboard panels, preventing the visual inconsistency common in rapidly-built dashboards.",
        },
      ],
      coreConceptsMarkdown: `### Utility-First Approach

\`\`\`tsx
// Dashboard panel with Tailwind utilities
<div className="rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-lg">
  <h2 className="text-lg font-semibold text-white">Pipeline Status</h2>
  <div className="mt-4 flex items-center gap-3">
    <StatusBadge className="bg-green-500/10 text-green-400" />
    <span className="text-sm text-gray-400">All scenes complete</span>
  </div>
</div>
\`\`\`

### Responsive Design

\`\`\`tsx
<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
  <MetricCard title="Scenes Generated" value={24} />
  <MetricCard title="Avg Quality" value={87} />
  <MetricCard title="Total Cost" value="$142" />
</div>
\`\`\`

### Custom Theme Configuration

\`\`\`css
@theme {
  --color-pipeline-idle: #6b7280;
  --color-pipeline-generating: #f59e0b;
  --color-pipeline-complete: #22c55e;
  --color-pipeline-error: #ef4444;
}
\`\`\``,
      prosAndCons: {
        pros: [
          "No naming — no BEM, no CSS modules, no styled-components",
          "Co-located styles — see styles right in the markup",
          "Tiny production CSS — JIT generates only what you use",
          "Consistent design tokens (spacing, colors, typography)",
          "Excellent responsive and dark mode support",
          "Huge ecosystem (shadcn/ui, Headless UI, Tailwind UI)",
        ],
        cons: [
          "Verbose markup — long class strings",
          "Learning curve — need to memorize utility names",
          "Tight coupling of style and structure",
          "Custom designs may need many arbitrary values",
          "Team consistency requires established conventions",
          "Difficult to override styles in third-party components",
        ],
      },
      alternatives: [
        {
          name: "CSS Modules",
          comparison: "Scoped CSS files co-located with components. No utility classes, write normal CSS. Better for complex animations and pseudo-selectors.",
        },
        {
          name: "styled-components / Emotion",
          comparison: "CSS-in-JS libraries. Dynamic styles based on props. But runtime cost and larger bundles.",
        },
        {
          name: "Vanilla Extract",
          comparison: "Zero-runtime CSS-in-TypeScript. Type-safe style definitions compiled at build time. More complex setup but zero runtime cost.",
        },
        {
          name: "UnoCSS",
          comparison: "Instant on-demand atomic CSS engine. Faster than Tailwind, more flexible (custom rules), but smaller ecosystem.",
        },
      ],
      keyAPIs: [
        "Layout: flex, grid, block, hidden",
        "Spacing: p-*, m-*, gap-*",
        "Typography: text-*, font-*, leading-*",
        "Colors: text-*, bg-*, border-*",
        "Responsive: sm:, md:, lg:, xl:",
        "Dark mode: dark:*",
        "States: hover:, focus:, active:",
      ],
      academicFoundations: `**Functional CSS (Tachyons, 2014):** Tailwind builds on the functional/atomic CSS movement started by Adam Morse's Tachyons. The core insight: CSS classes should do one thing, and complex styles are composed from simple primitives.

**Design Tokens (Salesforce, 2014):** Tailwind's configuration system implements design tokens — named values for colors, spacing, typography that ensure consistency. This concept was formalized by Salesforce's Lightning Design System.

**Specificity & The Cascade:** Traditional CSS suffers from specificity wars — competing selectors fight for priority. Tailwind eliminates this by using single-class selectors (specificity 0,0,1,0) applied in source order. No specificity conflicts possible.`,
      furtherReading: [
        "Tailwind CSS documentation — tailwindcss.com/docs",
        "CSS Utility Classes and Separation of Concerns by Adam Wathan",
        "Refactoring UI by Adam Wathan & Steve Schoger",
      ],
    },
    {
      name: "WanVideo / ComfyUI",
      category: "ai-ml",
      icon: "WV",
      tagline: "AI video generation pipeline for animated filmmaking",
      origin: {
        creator: "Alibaba (WanVideo) / comfyanonymous (ComfyUI)",
        year: 2024,
        motivation:
          "Text-to-video AI models like Runway Gen-2 and Pika were closed-source and expensive. WanVideo (Wan 2.1) from Alibaba provided an open-weight model competitive with commercial offerings. ComfyUI provided a node-based visual interface for building complex AI generation pipelines without writing code.",
      },
      whatItIs: `WanVideo and ComfyUI form the AI video generation pipeline:

**WanVideo (Wan 2.1):**
- Open-weight text-to-video and image-to-video diffusion model
- Supports 480p and 720p generation at variable lengths
- Based on diffusion transformer (DiT) architecture
- Competitive with Runway Gen-3, Kling, and Pika

**ComfyUI:**
- Node-based visual workflow editor for AI generation
- Connect nodes (model loaders, samplers, VAE decoders) visually
- Supports custom workflows saved as JSON
- Extensible with community nodes (ControlNet, IP-Adapter, upscaling)
- Queue system for batch generation`,
      explainLikeImTen: `Imagine you could describe a cartoon scene in words — "a mole digging through colorful tunnels underground" — and a robot artist would draw AND animate it for you. WanVideo is that robot artist. But the robot needs instructions in a very specific order: first load the brain, then read the description, then draw frame by frame. ComfyUI is like a visual instruction builder where you connect boxes with arrows to tell the robot exactly what steps to follow. The Mole World Dashboard watches the robot work and tells you how it's doing.`,
      realWorldAnalogy: `WanVideo/ComfyUI is like an automated film studio. WanVideo is the animation team — given a script (text prompt) and style references (images), it produces animated footage. ComfyUI is the production pipeline — a visual workflow where you arrange the steps: load the animation team's tools, feed them the script, set quality parameters, and output the final footage. The dashboard is the producer's office — monitoring every stage, tracking quality, and managing costs.`,
      whyWeUsedIt: `Mole World is an AI-generated animated short film:
- WanVideo 2.1 generates the actual video clips from text prompts and reference images
- ComfyUI orchestrates the multi-step generation pipeline (prompt → generation → upscaling → compositing)
- The pipeline runs on GPU infrastructure (RTX 4090 / cloud GPUs)
- The dashboard monitors this pipeline — tracking generation status, quality scores, and costs
- Understanding the AI pipeline is essential for building meaningful monitoring tools`,
      howItWorksInProject: `- ComfyUI workflows define the video generation pipeline as JSON node graphs
- Each scene in the storyboard has a corresponding ComfyUI workflow
- The dashboard reads pipeline status from ComfyUI's API (queue position, progress, errors)
- Quality metrics are computed post-generation and displayed in Recharts
- Batch generation queues manage overnight rendering runs`,
      featuresInProject: [
        {
          feature: "Pipeline status monitoring",
          description: "The dashboard polls ComfyUI's API to display real-time generation progress — which scene is rendering, current step count, estimated time remaining, and GPU utilization.",
        },
        {
          feature: "Scene-by-scene quality tracking",
          description: "After each video clip is generated, quality metrics (temporal consistency, prompt adherence, visual fidelity) are computed and displayed as trend charts so operators can identify degradation.",
        },
        {
          feature: "Workflow visualization",
          description: "ComfyUI node graphs are visualized in the dashboard showing the full pipeline: text encoder → sampler → VAE decoder → upscaler → output, with status indicators on each node.",
        },
        {
          feature: "Batch generation queue management",
          description: "The dashboard manages ComfyUI's generation queue — operators can prioritize scenes, pause/resume generation, and schedule overnight batch runs for cost optimization.",
        },
        {
          feature: "Cost analytics",
          description: "GPU time per scene is tracked and displayed with cost projections — showing $/scene, $/minute of final video, and total project cost against budget.",
        },
      ],
      coreConceptsMarkdown: `### Diffusion Model Pipeline

\`\`\`
Text Prompt → CLIP Text Encoder → Latent Noise → Denoising (50 steps) → VAE Decoder → Video Frames
                                        ↑
                                  Scheduler (Euler/DPM++)
\`\`\`

### ComfyUI Workflow (Conceptual)

\`\`\`
[Load Checkpoint] → [CLIP Text Encode] → [KSampler] → [VAE Decode] → [Save Video]
        ↓                    ↓                ↑
  [Load LoRA]        [Negative Prompt]   [Scheduler Config]
\`\`\`

### Key Parameters

| Parameter | Effect | Typical Value |
|-----------|--------|---------------|
| Steps | Quality vs speed tradeoff | 30-50 |
| CFG Scale | Prompt adherence strength | 6-8 |
| Resolution | Output dimensions | 720p (1280x720) |
| Frames | Video length | 81 frames (~3s) |
| Seed | Reproducibility | Random or fixed |

### WanVideo Architecture

WanVideo uses a **Diffusion Transformer (DiT)** architecture:
1. Text is encoded via a CLIP/T5 text encoder
2. Video is encoded to a latent space via 3D VAE
3. DiT denoises the latent representation over N steps
4. 3D VAE decodes latents back to pixel-space video frames`,
      prosAndCons: {
        pros: [
          "Open-weight model — no API costs, full control over generation",
          "ComfyUI's visual workflow is accessible to non-programmers",
          "Reproducible results via seed control and saved workflows",
          "Community extensions (ControlNet, IP-Adapter) expand capabilities",
          "Competitive quality with commercial alternatives (Runway, Pika)",
          "Batch processing enables overnight rendering for cost efficiency",
        ],
        cons: [
          "Requires expensive GPU hardware (16GB+ VRAM)",
          "Generation is slow — minutes per 3-second clip",
          "Quality is inconsistent — temporal coherence issues between frames",
          "Prompt engineering is trial-and-error intensive",
          "ComfyUI has a steep learning curve for non-technical users",
          "Model updates can break existing workflows",
        ],
      },
      alternatives: [
        {
          name: "Runway Gen-3",
          comparison: "Commercial text-to-video service. Higher quality and ease of use but expensive ($0.05/second), closed-source, and limited control over the generation process.",
        },
        {
          name: "Kling AI",
          comparison: "Chinese AI video generator with impressive motion quality. Free tier available but limited API access and potential data concerns.",
        },
        {
          name: "Pika",
          comparison: "User-friendly AI video tool focused on short clips. Easier to use but less customizable than ComfyUI workflows.",
        },
        {
          name: "Stable Video Diffusion",
          comparison: "Stability AI's open video model. Shorter clips (25 frames), lower quality than WanVideo 2.1, but lighter weight and faster generation.",
        },
      ],
      keyAPIs: [
        "ComfyUI API — /prompt (queue generation), /queue (check status), /history (results)",
        "KSampler — core denoising loop with configurable steps, CFG, scheduler",
        "CLIP Text Encode — convert text prompts to model embeddings",
        "VAE Decode — convert latent tensors to pixel-space images/video",
        "Load Checkpoint — load model weights into GPU memory",
        "ControlNet — guide generation with structural control (depth, pose, edge maps)",
      ],
      academicFoundations: `**Diffusion Models (Sohl-Dickstein et al., 2015; Ho et al., 2020):** Denoising Diffusion Probabilistic Models (DDPM) learn to reverse a noise-adding process. Training adds Gaussian noise to data over T steps; the model learns to denoise — recovering the original data from pure noise. Video diffusion extends this to 3D (spatial + temporal) latent spaces.

**Transformer Architecture (Vaswani et al., 2017):** WanVideo's DiT (Diffusion Transformer) replaces the U-Net backbone used in earlier diffusion models (Stable Diffusion) with a transformer. Self-attention over spatial and temporal dimensions enables better long-range coherence in generated videos.

**Latent Diffusion (Rombach et al., 2022):** Instead of diffusing in pixel space (computationally expensive), latent diffusion operates in a compressed latent space learned by a VAE (Variational Autoencoder). This reduces computation by ~50x while maintaining quality.

**Classifier-Free Guidance (Ho & Salimans, 2022):** CFG scale controls how strongly the model follows the text prompt. During training, the text condition is randomly dropped. At inference, the conditioned and unconditioned predictions are interpolated — higher CFG means stronger prompt adherence but less diversity.`,
      furtherReading: [
        "WanVideo GitHub — github.com/Wan-Video/Wan2.1",
        "ComfyUI documentation — github.com/comfyanonymous/ComfyUI",
        "Denoising Diffusion Probabilistic Models — arxiv.org/abs/2006.11239",
        "High-Resolution Image Synthesis with Latent Diffusion Models — arxiv.org/abs/2112.10752",
        "Scalable Diffusion Models with Transformers (DiT) — arxiv.org/abs/2212.09748",
      ],
    },
    {
      name: "Zustand",
      category: "library",
      icon: "ZS",
      tagline: "Bear-bones state management for React",
      origin: {
        creator: "Daishi Kato (pmndrs collective)",
        year: 2019,
        motivation:
          "Redux was powerful but required excessive boilerplate (actions, reducers, action creators, selectors). Zustand provides the same global state management with a fraction of the code.",
      },
      whatItIs: `Zustand is a small, fast state management library for React:
- **No boilerplate** — no actions, reducers, or action creators
- **No providers** — no React context wrapper needed
- **Subscribers** — components only re-render when their selected state changes
- **Middleware** — persist, devtools, immer integration
- **Tiny** — ~1KB minified`,
      explainLikeImTen: `Imagine your school has a bulletin board where teachers post announcements. With the old system (Redux), every time a teacher wanted to post something, they had to fill out a form, get it approved, write it on a special card, and then pin it to the board. With Zustand, the teacher just walks up and writes on the board. Students only look at the parts they care about — the math class student only reads math announcements, so they don't waste time reading art class news. Simple, fast, no paperwork.`,
      realWorldAnalogy: `Zustand is like a shared whiteboard in an office versus a formal memo system. Redux is the memo system — write a memo (action), route it through the mail room (dispatcher), file it in the right cabinet (reducer), then notify relevant departments (selectors). Zustand is the whiteboard — anyone can write on it, and people only pay attention to the sections relevant to their work. Same result, far less ceremony.`,
      whyWeUsedIt: `The dashboard needs global state for:
- Pipeline status (shared across multiple views)
- User preferences (theme, layout)
- Storyboard navigation state
- Filter/sort settings for metrics

Zustand is simpler than Redux and lighter than React Context for this use case.`,
      howItWorksInProject: `- Store defined in a single file with typed state and actions
- Components select specific slices of state
- Pipeline status updates flow through the store
- Persist middleware saves user preferences to localStorage`,
      featuresInProject: [
        {
          feature: "Pipeline status store",
          description: "A typed Zustand store holds the current pipeline status (idle/generating/complete/error), progress percentage, and current scene — shared across the Pipeline Monitor, header status badge, and notification system.",
        },
        {
          feature: "User preferences persistence",
          description: "Theme, layout preferences, and dashboard panel visibility are stored in a Zustand store with the persist middleware, automatically saving to localStorage and restoring on page reload.",
        },
        {
          feature: "Storyboard navigation state",
          description: "Current scene index, zoom level, and view mode (grid/timeline/detail) are managed in a Zustand store so the storyboard viewer and scene detail panel stay synchronized.",
        },
        {
          feature: "Metrics filter/sort state",
          description: "Active filters (date range, scene selection, metric type) and sort order for the metrics dashboard are stored in Zustand, enabling consistent filtering across chart and table views.",
        },
        {
          feature: "Selective re-rendering with selectors",
          description: "Components subscribe to only the state slices they need — the status badge only re-renders when status changes, not when progress percentage updates, keeping the dashboard performant.",
        },
      ],
      coreConceptsMarkdown: `### Basic Store

\`\`\`typescript
import { create } from "zustand";

interface PipelineStore {
  status: "idle" | "generating" | "complete" | "error";
  progress: number;
  currentScene: number;
  setStatus: (status: PipelineStore["status"]) => void;
  setProgress: (progress: number) => void;
}

const usePipelineStore = create<PipelineStore>((set) => ({
  status: "idle",
  progress: 0,
  currentScene: 0,
  setStatus: (status) => set({ status }),
  setProgress: (progress) => set({ progress }),
}));

// In component — only re-renders when status changes
function StatusBadge() {
  const status = usePipelineStore((s) => s.status);
  return <Badge>{status}</Badge>;
}
\`\`\`

### Middleware

\`\`\`typescript
import { persist, devtools } from "zustand/middleware";

const useStore = create(
  devtools(
    persist(
      (set) => ({
        theme: "dark",
        setTheme: (theme: string) => set({ theme }),
      }),
      { name: "preferences" } // localStorage key
    )
  )
);
\`\`\`

### Zustand vs Redux vs Context

| Feature | Zustand | Redux Toolkit | React Context |
|---------|---------|---------------|---------------|
| Boilerplate | Minimal | Medium | Minimal |
| Re-renders | Selective | Selective (selectors) | All consumers |
| DevTools | Yes (middleware) | Yes (built-in) | No |
| Bundle size | ~1KB | ~11KB | 0 (built-in) |
| Learning curve | Low | Medium | Low |
| Async | Built-in | RTK Query / Thunks | Manual |`,
      prosAndCons: {
        pros: [
          "Minimal boilerplate — define store in one function",
          "No provider wrapper needed",
          "Selective re-renders via selectors",
          "TypeScript-first with excellent inference",
          "Tiny bundle size (~1KB)",
          "Works outside React (vanilla JS)",
        ],
        cons: [
          "Less structured than Redux for very large apps",
          "No built-in devtools (need middleware)",
          "Less ecosystem than Redux (fewer middleware, guides)",
          "Can become messy without conventions in large teams",
          "No built-in data fetching (unlike RTK Query)",
        ],
      },
      alternatives: [
        {
          name: "Redux Toolkit",
          comparison: "Official Redux with modern DX. More structured (slices, reducers) and includes RTK Query for data fetching. Better for large teams but more boilerplate.",
        },
        {
          name: "Jotai",
          comparison: "Atomic state management (same author as Zustand). Bottom-up approach — define individual atoms instead of a single store. Better for fine-grained reactivity.",
        },
        {
          name: "React Context",
          comparison: "Built into React, zero dependencies. But causes re-renders for ALL consumers when any value changes. Fine for rarely-changing data (theme, auth).",
        },
        {
          name: "Valtio",
          comparison: "Proxy-based state management (also from pmndrs). Mutable API that feels like vanilla JavaScript. Less explicit than Zustand.",
        },
      ],
      keyAPIs: [
        "create() — define store",
        "useStore(selector) — read state in component",
        "set() — update state",
        "get() — read state outside React",
        "subscribe() — listen to state changes",
        "persist/devtools — middleware",
      ],
      academicFoundations: `**Flux Architecture (Facebook, 2014):** Zustand simplifies the Flux pattern — unidirectional data flow where actions update a store, and views subscribe to store changes. Redux formalized Flux; Zustand simplifies Redux.

**Observer Pattern (GoF):** Zustand's subscribe mechanism is the Observer pattern — state is the subject, components are observers. Selective subscriptions (via selectors) optimize this by only notifying observers of relevant changes.

**Immutability:** Zustand uses immutable state updates (create new objects via spread/Object.assign). This enables efficient change detection — React can compare object references instead of deep equality.`,
      furtherReading: [
        "Zustand documentation — docs.pmnd.rs/zustand",
        "Zustand GitHub — github.com/pmndrs/zustand",
        "State management comparison — npmtrends.com",
      ],
    },
    {
      name: "Framer Motion",
      category: "library",
      icon: "FM",
      tagline: "Production-ready React animation library",
      origin: {
        creator: "Framer (Matt Perry)",
        year: 2019,
        motivation:
          "CSS animations are limited and imperative. React Spring was powerful but complex. Framer Motion provides a declarative animation API that feels natural in React's component model.",
      },
      whatItIs: `Framer Motion is a React animation library providing:
- **Declarative animations** — animate with props, not imperative code
- **Layout animations** — animate between layouts automatically
- **Gestures** — drag, hover, tap, pan with physics
- **AnimatePresence** — animate components entering/leaving the DOM
- **Variants** — orchestrate animations across component trees`,
      explainLikeImTen: `You know how in cartoons, things don't just appear and disappear — they slide in, bounce, fade, and whoosh? Framer Motion does that for websites. Instead of things just popping onto the screen, you tell them "slide in from the left" or "fade in slowly" or "bounce when someone hovers over you." It's like giving your website cartoon superpowers. You just describe what you want to happen, and Framer Motion figures out all the in-between frames, just like a cartoon animator does.`,
      realWorldAnalogy: `Framer Motion is like a choreographer for a stage show. Without it, actors (UI elements) just teleport to their marks — one moment offstage, the next onstage. With the choreographer, actors glide to their positions, exit gracefully, and move in coordinated sequences. You tell the choreographer "the lead enters stage left while the chorus fades back," and they handle the timing, spacing, and flow. That's what Framer Motion does for UI elements.`,
      whyWeUsedIt: `The Mole World Dashboard needs smooth animations for:
- Pipeline status transitions (progress bars, status changes)
- Storyboard scene navigation (slide/fade transitions)
- Dashboard panel open/close animations
- Hover effects and micro-interactions
- Page transitions between dashboard sections`,
      howItWorksInProject: `- \`motion.div\` components replace regular divs for animated elements
- AnimatePresence handles dashboard panel mount/unmount animations
- Variants orchestrate storyboard scene transitions
- Spring physics for natural-feeling progress animations`,
      featuresInProject: [
        {
          feature: "Pipeline progress animations",
          description: "Progress bars animate smoothly between percentage values using spring physics, with color transitions from amber (generating) to green (complete) that feel natural and informative.",
        },
        {
          feature: "Storyboard scene transitions",
          description: "Scene navigation uses AnimatePresence with slide and fade variants — the current scene exits while the next scene enters, creating a cinematic browsing experience matching the film's creative theme.",
        },
        {
          feature: "Dashboard panel mount/unmount",
          description: "Expandable panels and detail views use AnimatePresence with height and opacity animations so they grow into view when opened and shrink away when closed, rather than popping in and out.",
        },
        {
          feature: "Staggered list animations",
          description: "Scene cards, metric entries, and pipeline stages use staggerChildren variants to cascade into view one after another, guiding the user's eye through the information hierarchy.",
        },
        {
          feature: "Hover micro-interactions",
          description: "Dashboard cards and buttons use whileHover and whileTap props for scale, shadow, and color micro-animations that provide tactile feedback without writing CSS transitions.",
        },
      ],
      coreConceptsMarkdown: `### Basic Animation

\`\`\`tsx
import { motion } from "framer-motion";

// Animate on mount
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Dashboard Content
</motion.div>

// Animate on state change
<motion.div animate={{ scale: isActive ? 1.1 : 1 }}>
  <SceneCard />
</motion.div>
\`\`\`

### AnimatePresence (Enter/Exit)

\`\`\`tsx
import { AnimatePresence, motion } from "framer-motion";

<AnimatePresence>
  {isVisible && (
    <motion.div
      key="panel"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
    >
      <DetailPanel />
    </motion.div>
  )}
</AnimatePresence>
\`\`\`

### Variants (Orchestrated Animations)

\`\`\`tsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 },
};

<motion.ul variants={container} initial="hidden" animate="show">
  {scenes.map((scene) => (
    <motion.li key={scene.id} variants={item}>
      {scene.title}
    </motion.li>
  ))}
</motion.ul>
\`\`\``,
      prosAndCons: {
        pros: [
          "Declarative API that fits React's mental model",
          "Layout animations are magical — just change CSS and it animates",
          "AnimatePresence handles exit animations (impossible with CSS alone)",
          "Spring physics for natural-feeling motion",
          "Gesture support (drag, hover, tap)",
          "Excellent documentation and examples",
        ],
        cons: [
          "Bundle size (~30KB) can impact initial load",
          "Performance can degrade with many simultaneous animations",
          "Learning curve for variants and complex orchestrations",
          "SSR compatibility requires care (no window on server)",
          "Can conflict with CSS transitions",
        ],
      },
      alternatives: [
        {
          name: "React Spring",
          comparison: "Physics-based animation library. More precise spring physics but more complex API. Better for data visualizations.",
        },
        {
          name: "CSS Animations/Transitions",
          comparison: "Zero bundle size, hardware-accelerated. But no exit animations, no layout animations, no gesture support. Limited orchestration.",
        },
        {
          name: "GSAP",
          comparison: "Professional animation library (GreenSock). More powerful timeline control but imperative API doesn't fit React's declarative model.",
        },
      ],
      keyAPIs: [
        "motion.div — animatable div component",
        "animate / initial / exit — animation states",
        "transition — timing and easing config",
        "variants — named animation states",
        "AnimatePresence — mount/unmount animations",
        "useMotionValue / useTransform — low-level control",
        "whileHover / whileTap — gesture animations",
      ],
      academicFoundations: `**Spring Physics:** Framer Motion's spring animations are based on damped harmonic oscillator equations: F = -kx - cv, where k is stiffness and c is damping. This produces natural-feeling motion that matches real-world physics.

**Animation Principles (Disney, 1981):** The 12 principles of animation (squash & stretch, anticipation, follow-through, etc.) inform good UI animation. Framer Motion's spring physics naturally implement several of these principles.

**Declarative vs Imperative Animation:** Framer Motion follows React's declarative paradigm — you describe WHAT the final state should be, and the library figures out HOW to get there. This contrasts with imperative animation (GSAP, Web Animations API) where you describe each step.`,
      furtherReading: [
        "Framer Motion documentation — motion.dev",
        "Animation principles for UI — material.io/design/motion",
        "The Illusion of Life: Disney Animation (Thomas & Johnston, 1981)",
      ],
    },
    {
      name: "Recharts",
      category: "library",
      icon: "RC",
      tagline: "Composable React charting library",
      origin: {
        creator: "Recharts team",
        year: 2016,
        motivation:
          "D3.js was powerful but had a steep learning curve and didn't integrate well with React's component model. Recharts wraps D3 calculations in declarative React components.",
      },
      whatItIs: `Recharts is a React charting library built on D3.js:
- **Composable** — build charts from component primitives (Axis, Line, Bar, Area)
- **Responsive** — auto-resize with ResponsiveContainer
- **Customizable** — custom tooltips, legends, shapes
- **Animated** — built-in transitions`,
      explainLikeImTen: `You know those bar graphs and line charts you make in school? Recharts lets you build those for websites, but way cooler. Instead of drawing them by hand, you just give it your numbers and tell it what kind of chart you want — a bar chart, a line chart, a pie chart. It's like snapping together LEGO pieces: "I want an X-axis piece, a Y-axis piece, and a line piece." Each piece does one job, and together they make a professional-looking chart that updates in real time.`,
      realWorldAnalogy: `Recharts is like a dashboard instrument panel in a car versus hand-painting gauges. D3.js is like being given raw materials (glass, metal, paint) to build each gauge from scratch — total control but incredibly time-consuming. Recharts is like ordering pre-made gauge components (speedometer, fuel gauge, tachometer) that you snap into your dashboard panel. You can customize the colors and scales, but the hard engineering is already done.`,
      whyWeUsedIt: `The dashboard displays pipeline metrics:
- Generation time per scene (bar chart)
- Quality scores over time (line chart)
- Cost breakdown (pie chart)
- Pipeline stage durations (area chart)`,
      howItWorksInProject: `- ResponsiveContainer wraps all charts for auto-sizing
- LineChart for quality trends over time
- BarChart for scene-by-scene metrics
- Custom tooltips show detailed metric information`,
      featuresInProject: [
        {
          feature: "Quality trend line chart",
          description: "A LineChart tracks quality scores (temporal consistency, prompt adherence, visual fidelity) across scenes over time, letting producers spot quality degradation before it compounds.",
        },
        {
          feature: "Scene-by-scene generation time bar chart",
          description: "A BarChart displays generation time per scene, highlighting which scenes took longer and correlating with complexity — helping optimize prompt engineering for future scenes.",
        },
        {
          feature: "Cost breakdown pie chart",
          description: "A PieChart shows cost distribution across pipeline stages (generation, upscaling, compositing) so producers can identify the most expensive operations and optimize budget allocation.",
        },
        {
          feature: "Custom interactive tooltips",
          description: "Custom Tooltip components display rich information on hover — scene name, exact metric value, timestamp, and comparison to average — providing detail-on-demand without cluttering the chart.",
        },
        {
          feature: "Responsive chart containers",
          description: "Every chart is wrapped in ResponsiveContainer so charts automatically resize with the dashboard layout, maintaining readability on screens from laptop to wall-mounted production monitors.",
        },
      ],
      coreConceptsMarkdown: `### Composable API

\`\`\`tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { scene: 1, quality: 85, time: 120 },
  { scene: 2, quality: 92, time: 95 },
  { scene: 3, quality: 78, time: 150 },
];

<ResponsiveContainer width="100%" height={300}>
  <LineChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="scene" />
    <YAxis />
    <Tooltip />
    <Line type="monotone" dataKey="quality" stroke="#8884d8" />
    <Line type="monotone" dataKey="time" stroke="#82ca9d" />
  </LineChart>
</ResponsiveContainer>
\`\`\``,
      prosAndCons: {
        pros: [
          "Declarative React components — no D3 boilerplate",
          "Easy to get started — basic charts in minutes",
          "Responsive out of the box",
          "Customizable with React components (tooltips, legends)",
          "Good TypeScript support",
        ],
        cons: [
          "Performance issues with large datasets (>10K points)",
          "SVG-based — not as performant as Canvas for real-time data",
          "Limited chart types compared to full D3",
          "Bundle size (~200KB with D3 dependency)",
          "Customization can be awkward for unusual chart types",
        ],
      },
      alternatives: [
        {
          name: "D3.js",
          comparison: "The most powerful data visualization library. Full control but steep learning curve and imperative API. Recharts uses D3 internally.",
        },
        {
          name: "Chart.js (react-chartjs-2)",
          comparison: "Canvas-based charting. Better performance for large datasets but less composable. More chart types out of the box.",
        },
        {
          name: "Nivo",
          comparison: "Rich React charting library with beautiful defaults. More chart types than Recharts but larger bundle. Built on D3.",
        },
        {
          name: "Tremor",
          comparison: "React dashboard components including charts. Higher-level abstraction — less customizable but faster to build dashboards.",
        },
      ],
      keyAPIs: [
        "LineChart, BarChart, PieChart, AreaChart — chart types",
        "XAxis, YAxis — axis components",
        "CartesianGrid — grid lines",
        "Tooltip, Legend — interactive elements",
        "ResponsiveContainer — auto-resize wrapper",
        "Line, Bar, Area, Pie — data series components",
      ],
      academicFoundations: `**Data Visualization Theory (Edward Tufte):** Tufte's principles — maximize data-ink ratio, avoid chartjunk, use small multiples — inform good dashboard design. Recharts provides the building blocks; applying Tufte's principles is the developer's responsibility.

**Grammar of Graphics (Wilkinson, 1999):** Recharts' composable API is influenced by the Grammar of Graphics — charts are composed from primitive elements (scales, coordinates, marks, guides). This theory underlies ggplot2 (R), Vega-Lite, and Observable Plot.

**SVG (Scalable Vector Graphics):** Recharts renders charts as SVG elements. SVG is a W3C standard for vector graphics in the browser. Each chart element is a DOM node, enabling CSS styling and event handling.`,
      furtherReading: [
        "Recharts documentation — recharts.org",
        "The Visual Display of Quantitative Information by Edward Tufte",
        "D3.js documentation — d3js.org",
      ],
    },
  ],
};
