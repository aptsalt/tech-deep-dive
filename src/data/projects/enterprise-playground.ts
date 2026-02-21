import type { Project } from "../types";

export const enterprisePlayground: Project = {
  id: "enterprise-playground",
  name: "Enterprise Playground",
  description:
    "Dual-model AI playground generator — scrape banking UIs, generate interactive HTML with local LLMs, fine-tune on your own data. All on one RTX 4090.",
  repo: "https://github.com/aptsalt/enterprise-playground",
  languages: ["Python", "TypeScript", "HTML", "CSS"],
  designPatterns: [
    {
      name: "Pipeline Pattern",
      category: "behavioral",
      whatItIs: "Chains processing steps sequentially, where each stage transforms data and passes it to the next.",
      howProjectUsesIt: "The core scrape-process-generate-evaluate flow passes data through discrete stages: Playwright scrapes HTML, BeautifulSoup cleans it, the LLM generates output, and the evaluator scores quality.",
    },
    {
      name: "Repository Pattern",
      category: "architectural",
      whatItIs: "Abstracts data storage behind a collection-like interface, decoupling business logic from persistence details.",
      howProjectUsesIt: "Scraped HTML components, embeddings, and metadata are stored and retrieved through a unified repository interface backed by ChromaDB, hiding vector-database specifics from the pipeline code.",
    },
    {
      name: "Strategy Pattern",
      category: "behavioral",
      whatItIs: "Defines a family of interchangeable algorithms, letting the caller switch between them at runtime.",
      howProjectUsesIt: "The generation pipeline swaps between the base Qwen2.5-Coder model and the QLoRA fine-tuned variant at runtime, using the same interface for both to enable side-by-side comparison.",
    },
    {
      name: "Observer Pattern",
      category: "behavioral",
      whatItIs: "Lets objects subscribe to events on a subject and get notified automatically when state changes.",
      howProjectUsesIt: "HuggingFace Trainer callbacks observe training events (epoch end, loss update, checkpoint save) and push metrics to the OpenTelemetry pipeline for real-time dashboard updates.",
    },
    {
      name: "Factory Pattern",
      category: "creational",
      whatItIs: "Encapsulates object creation behind a method, returning different concrete instances based on configuration.",
      howProjectUsesIt: "A model loader factory accepts a model name and configuration, returning either a quantized base model or a PEFT-wrapped fine-tuned model without callers knowing the construction details.",
    },
    {
      name: "ETL Pattern",
      category: "architectural",
      whatItIs: "Extract-Transform-Load separates data ingestion into three phases: pull raw data, reshape it, then persist the result.",
      howProjectUsesIt: "Scraped raw HTML is extracted via Playwright, transformed by BeautifulSoup into clean instruction-following pairs, and loaded into ChromaDB collections for retrieval and fine-tuning.",
    },
  ],
  keyTakeaways: [
    "Fine-tuning small models on domain-specific data can match or exceed larger general models for narrow tasks.",
    "Web scraping at scale requires robust error handling, rate limiting, and anti-detection measures.",
    "ChromaDB provides a simple developer experience for embedding-based retrieval without the overhead of a dedicated vector database.",
    "OpenTelemetry provides vendor-neutral observability — switch backends without changing instrumentation code.",
    "QLoRA enables fine-tuning 7B+ models on a single consumer GPU (RTX 4090 with 16GB VRAM).",
  ],
  coreConcepts: [
    {
      name: "Fine-Tuning (QLoRA)",
      slug: "fine-tuning-qlora",
      whatItIs: "Adapting a pre-trained language model to perform better on a specific task by training it on domain-specific data. QLoRA (Quantized Low-Rank Adaptation) makes this possible on consumer GPUs by quantizing the base model to 4-bit and only training tiny adapter matrices.",
      whyItMatters: "General-purpose LLMs produce generic output. Fine-tuning on domain-specific data (banking UI HTML/CSS) produces models that generate more accurate, domain-appropriate content with less prompting.",
      howProjectUsesIt: "Scraped banking UI HTML/CSS pairs are structured as instruction-following examples. The base Qwen2.5-Coder model is quantized to 4-bit and fine-tuned with LoRA adapters on an RTX 4090, requiring only ~4GB VRAM for a 7B model.",
      keyTerms: [
        { term: "QLoRA", definition: "Quantized Low-Rank Adaptation — 4-bit quantized base model with trainable low-rank adapter matrices" },
        { term: "LoRA", definition: "Low-Rank Adaptation — adding small trainable matrices to frozen model layers" },
        { term: "NF4 Quantization", definition: "4-bit NormalFloat quantization that preserves model quality while reducing memory 4x" },
        { term: "Adapter Weights", definition: "The small trainable matrices (0.1% of total parameters) that capture domain knowledge" },
      ],
    },
    {
      name: "Web Scraping",
      slug: "web-scraping",
      whatItIs: "Automatically extracting data from websites by programmatically navigating pages, capturing content, and parsing HTML structures. Modern scraping requires headless browsers to handle JavaScript-rendered single-page applications.",
      whyItMatters: "Training data for domain-specific models doesn't exist in neat datasets. Web scraping captures real-world UI patterns, HTML structures, and design systems directly from production websites.",
      howProjectUsesIt: "Playwright automates headless browsers to crawl banking/enterprise websites, capturing UI component screenshots, HTML structures, and CSS styles. This scraped data becomes the training corpus for fine-tuning.",
      keyTerms: [
        { term: "Headless Browser", definition: "A browser without a visible UI, controlled programmatically for scraping and testing" },
        { term: "Playwright", definition: "Microsoft's browser automation library supporting Chromium, Firefox, and WebKit" },
        { term: "Rate Limiting", definition: "Controlling request frequency to avoid overwhelming target servers" },
      ],
    },
    {
      name: "Domain-Specific Training Data",
      slug: "domain-specific-training",
      whatItIs: "Curating and structuring training data from a specific domain (banking UIs) rather than using general web data. Domain-specific data teaches models the patterns, conventions, and vocabulary unique to that field.",
      whyItMatters: "A model fine-tuned on 1,000 banking UI examples can outperform GPT-4 at generating banking UIs, because it has learned the specific component patterns, color schemes, and layouts used in financial applications.",
      howProjectUsesIt: "Scraped HTML/CSS pairs are cleaned, structured as instruction-following examples (input: description, output: HTML), and used to fine-tune Qwen2.5-Coder for banking UI generation.",
      keyTerms: [
        { term: "Instruction Tuning", definition: "Training format where each example has an instruction (prompt) and expected response" },
        { term: "Training Corpus", definition: "The complete set of examples used to fine-tune the model" },
        { term: "Data Pipeline", definition: "The automated process of scraping, cleaning, and formatting training data" },
      ],
    },
    {
      name: "UI Generation",
      slug: "ui-generation",
      whatItIs: "Using AI models to generate functional HTML/CSS/JavaScript from natural language descriptions. The model understands UI patterns and produces interactive, visually accurate replicas of real-world interfaces.",
      whyItMatters: "Manually coding enterprise UIs is slow and expensive. AI-generated UIs can produce functional prototypes in seconds, dramatically accelerating design iteration and reducing development costs.",
      howProjectUsesIt: "Both the base model and fine-tuned model generate interactive HTML playgrounds from descriptions. The fine-tuned model produces more accurate banking-specific UI components compared to the general-purpose base model.",
      keyTerms: [
        { term: "Playground", definition: "An interactive HTML page generated by the AI model that replicates enterprise UI patterns" },
        { term: "Visual Fidelity", definition: "How closely the generated UI matches the original design" },
        { term: "Dual-Model Comparison", definition: "Running both base and fine-tuned models to compare generation quality" },
      ],
    },
  ],
  videoResources: [
    {
      title: "QLoRA: Efficient Finetuning of Quantized LLMs",
      url: "https://www.youtube.com/watch?v=y9PHWGOa8HA",
      channel: "Yannic Kilcher",
      durationMinutes: 30,
      relevance: "Deep dive into QLoRA, the fine-tuning technique used for training on RTX 4090",
    },
    {
      title: "Web Scraping with Playwright",
      url: "https://www.youtube.com/watch?v=H73m_1A5MzY",
      channel: "John Watson Rooney",
      durationMinutes: 15,
      relevance: "Playwright scraping techniques used in the data collection pipeline",
    },
    {
      title: "Fine-tuning LLMs on Custom Data",
      url: "https://www.youtube.com/watch?v=eC6Hd1hFvos",
      channel: "Trelis Research",
      durationMinutes: 25,
      relevance: "Practical guide to fine-tuning open-source models on custom datasets",
    },
  ],
  realWorldExamples: [
    {
      company: "Vercel",
      product: "v0.dev",
      description: "Vercel's v0 generates React/Tailwind UI components from natural language descriptions — the same UI generation concept at commercial scale with a polished product.",
      conceptConnection: "AI-powered UI generation from text descriptions",
    },
    {
      company: "GitHub",
      product: "Copilot Workspace",
      description: "GitHub Copilot Workspace generates and modifies code across entire repositories, using understanding of project context to produce domain-appropriate code.",
      conceptConnection: "Domain-aware AI code generation",
    },
    {
      company: "Figma",
      product: "Figma AI",
      description: "Figma's AI features generate UI designs and suggest component layouts based on design patterns learned from millions of Figma files.",
      conceptConnection: "AI-generated UI from learned design patterns",
    },
  ],
  cicd: {
    overview: "Dual-stack pipeline with Python backend (Ruff + Pytest) and Next.js frontend, containerized with GPU passthrough for fine-tuning.",
    stages: [
      {
        name: "Python Linting",
        tool: "Ruff",
        description: "Fast Python linting and formatting, replaces Black + isort + flake8",
        commands: ["ruff check .", "ruff format ."],
      },
      {
        name: "Python Testing",
        tool: "Pytest",
        description: "Unit and integration tests for scraping and generation pipelines",
        commands: ["pytest"],
      },
      {
        name: "Frontend Build",
        tool: "Next.js",
        description: "TypeScript compilation and Next.js production build",
        commands: ["npm run build"],
      },
      {
        name: "Containerization",
        tool: "Docker",
        description: "Multi-service compose with GPU passthrough for fine-tuning",
        commands: ["docker-compose up --build"],
      },
      {
        name: "Training Scripts",
        tool: "Shell",
        description: "Shell scripts for training workflows and data processing",
        commands: ["./scripts/train.sh", "./scripts/process_data.sh"],
      },
    ],
    infrastructure: "Docker with NVIDIA GPU passthrough, RTX 4090 16GB VRAM for QLoRA fine-tuning.",
  },
  architecture: [
    {
      title: "System Overview",
      content: `The Enterprise Playground has three main pipelines:

1. **Scraper Pipeline:** Crawls banking/enterprise websites, captures UI components, screenshots, and HTML structures. Uses Playwright for headless browser automation.

2. **Generation Pipeline:** Takes scraped UI data and generates interactive HTML playgrounds using local LLMs. Models understand the UI patterns and generate functional replicas.

3. **Fine-Tuning Pipeline:** Uses scraped data to fine-tune local LLMs (Qwen2.5-Coder) for domain-specific HTML generation. QLoRA enables this on a single RTX 4090.`,
      diagram: `[Playwright Scraper]
       |
       v
 Scraped HTML/CSS
       |
  +----+----+
  v         v
[Generator]  [Fine-Tuner]
(Base LLM)   (QLoRA on RTX 4090)
  |              |
  v              v
[Base Output]  [Fine-tuned Output]
  |              |
  +------+-------+
         v
   [Evaluator]
   (Visual Fidelity + Code Quality)`,
    },
    {
      title: "Fine-Tuning Architecture",
      content: `**QLoRA (Quantized Low-Rank Adaptation):**
1. Base model quantized to 4-bit (NF4 quantization)
2. Small trainable adapter matrices added to attention layers
3. Only adapter weights are trained (0.1% of total parameters)
4. Effective fine-tuning with ~4GB VRAM for a 7B model

**Training Data:** Scraped HTML/CSS pairs with descriptions, structured as instruction-following examples.

**Evaluation:** Generated playgrounds evaluated on visual fidelity, interactivity, and code quality.`,
    },
  ],
  technologies: [
    {
      name: "Playwright",
      category: "tool",
      icon: "PW",
      tagline: "Browser automation framework",
      origin: {
        creator: "Microsoft",
        year: 2020,
        motivation:
          "Selenium was the standard for browser automation but was slow, flaky, and had poor cross-browser support. The Puppeteer team at Google (Andrey Lushnikov) moved to Microsoft and built Playwright with first-class cross-browser support.",
      },
      whatItIs: `Playwright is a browser automation library for end-to-end testing and web scraping:
- **Cross-browser:** Chromium, Firefox, WebKit
- **Auto-wait:** Automatically waits for elements to be ready
- **Network interception:** Mock API responses, block resources
- **Multi-page/frame support:** Handle popups, iframes, tabs
- **Codegen:** Record actions and generate test code`,
      explainLikeImTen: `Imagine you have a robot that can use a web browser just like you do — it can click buttons, type in boxes, scroll around, and even take screenshots. Playwright is the instruction manual for that robot. You tell it "go to this website, click this button, and save what you see," and it does it all by itself. It's like having a really fast helper that never gets tired of browsing websites for you.`,
      realWorldAnalogy: `Playwright is like a skilled personal assistant who can operate any computer on your behalf. You give them a checklist — "go to this bank's website, log in, take a photo of the dashboard, and copy the HTML code" — and they execute each step perfectly, every single time, without getting distracted or making typos.`,
      whyWeUsedIt: `Scraping enterprise banking UIs requires a real browser:
- JavaScript-rendered content (SPAs)
- Complex CSS animations and transitions
- Login flows and session management
- Screenshot capture of rendered components
- Network request interception for data capture`,
      howItWorksInProject: `- Python Playwright SDK drives headless Chromium
- Crawler navigates banking websites, captures page structure
- Screenshots taken of individual UI components
- HTML/CSS extracted and cleaned for training data
- Rate limiting and stealth mode to avoid detection`,
      featuresInProject: [
        {
          feature: "Banking UI Crawler",
          description:
            "Playwright drives a headless Chromium browser to navigate banking websites, handling JavaScript-rendered SPAs, login flows, and session cookies to reach deep dashboard pages that simple HTTP scrapers cannot access.",
        },
        {
          feature: "Component Screenshot Capture",
          description:
            "Individual UI components (forms, tables, charts, navbars) are isolated via CSS selectors and screenshotted using Playwright's element-level screenshot API, producing training data pairs of visual output + source HTML.",
        },
        {
          feature: "HTML/CSS Extraction Pipeline",
          description:
            "After rendering each page, Playwright's page.inner_html() and page.evaluate() APIs extract cleaned HTML and computed CSS for each component, which becomes the target output in fine-tuning instruction pairs.",
        },
        {
          feature: "Network Request Interception",
          description:
            "Playwright's page.route() intercepts XHR/fetch calls to capture API response schemas and mock data structures, enabling generated playgrounds to include realistic fake data matching the original API shapes.",
        },
        {
          feature: "Anti-Detection & Rate Limiting",
          description:
            "Stealth mode configurations (randomized user agents, viewport sizes, mouse movement) and configurable delays between actions prevent bot detection on enterprise banking portals.",
        },
      ],
      coreConceptsMarkdown: `### Browser Automation

\`\`\`python
from playwright.async_api import async_playwright

async with async_playwright() as p:
    browser = await p.chromium.launch(headless=True)
    page = await browser.new_page()

    await page.goto("https://example.com/dashboard")

    # Wait for element and interact
    await page.click("button.login")
    await page.fill("#email", "user@example.com")

    # Screenshot
    await page.screenshot(path="screenshot.png")

    # Extract HTML
    html = await page.inner_html(".dashboard-component")

    # Network interception
    async def handle_response(response):
        if "/api/" in response.url:
            data = await response.json()

    page.on("response", handle_response)
\`\`\`

### Auto-Wait vs Selenium

Selenium requires explicit waits:
\`\`\`python
# Selenium — manual waits
WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.CSS_SELECTOR, ".loaded"))
)
\`\`\`

Playwright auto-waits for actionability:
\`\`\`python
# Playwright — automatic
await page.click(".loaded")  # waits until element is visible and clickable
\`\`\``,
      prosAndCons: {
        pros: [
          "Cross-browser support (Chromium, Firefox, WebKit)",
          "Auto-wait eliminates flaky tests",
          "Excellent for both testing and scraping",
          "Network interception for mocking/monitoring",
          "Codegen — record browser actions as code",
          "Active development with frequent releases",
        ],
        cons: [
          "Large download (~200MB per browser)",
          "Higher memory usage than HTTP-based scrapers",
          "Complex debugging for headless failures",
          "Slower than direct HTTP requests for simple scraping",
        ],
      },
      alternatives: [
        {
          name: "Puppeteer",
          comparison:
            "Google's browser automation for Chromium only. Simpler API but no Firefox/WebKit. Playwright was built by the same team with more features.",
        },
        {
          name: "Selenium",
          comparison:
            "The original browser automation tool. Massive ecosystem but slower, flakier, and more boilerplate than Playwright.",
        },
        {
          name: "Crawlee",
          comparison:
            "JavaScript web scraping framework built on Playwright/Puppeteer. Higher-level abstractions for crawling, but less control.",
        },
      ],
      keyAPIs: [
        "page.goto(url) — navigate to URL",
        "page.click(selector) — click element",
        "page.fill(selector, text) — type text",
        "page.screenshot() — capture screenshot",
        "page.inner_html(selector) — get element HTML",
        "page.evaluate(fn) — run JavaScript in page context",
        "page.route(pattern, handler) — intercept network requests",
      ],
      academicFoundations: `**Browser Architecture:** Playwright communicates with browsers via the Chrome DevTools Protocol (CDP) for Chromium and similar protocols for Firefox/WebKit. This is a JSON-RPC protocol over WebSocket that exposes browser internals (DOM, network, rendering).

**Web Scraping Ethics:** Web scraping operates in a legal gray area. The hiQ v. LinkedIn (2022) case established that scraping publicly available data is not a violation of the CFAA. However, respecting robots.txt and rate limiting are ethical best practices.

**Headless Browsers:** Running browsers without a GUI (headless mode) enables server-side rendering, testing, and scraping. Chrome's headless mode was added in 2017, enabling programmatic access to the full browser rendering engine.`,
      furtherReading: [
        "Playwright documentation — playwright.dev",
        "Chrome DevTools Protocol — chromedevtools.github.io/devtools-protocol",
        "Web Scraping with Python by Ryan Mitchell (O'Reilly)",
      ],
    },
    {
      name: "QLoRA / Fine-Tuning",
      category: "ai-ml",
      icon: "QL",
      tagline: "Efficient LLM fine-tuning on consumer GPUs",
      origin: {
        creator: "Tim Dettmers et al. (University of Washington)",
        year: 2023,
        motivation:
          "Fine-tuning large language models required expensive GPU clusters. QLoRA combines quantization (reducing model precision) with LoRA (low-rank adapters) to enable fine-tuning of 65B models on a single 48GB GPU.",
      },
      whatItIs: `QLoRA (Quantized Low-Rank Adaptation) is a fine-tuning method:

1. **Quantize** the base model to 4-bit (NF4 data type)
2. **Freeze** all original weights
3. **Add LoRA adapters** — small trainable matrices in attention layers
4. **Train only the adapters** — 0.1-1% of total parameters

This reduces VRAM requirements by 4-8x while maintaining quality.

**LoRA Math:** Instead of updating a weight matrix W (size d×d), learn two small matrices A (d×r) and B (r×d) where r << d. The adapted weight is W + AB.`,
      explainLikeImTen: `Imagine you have a really smart friend who knows a lot about everything, but you need them to be an expert at drawing houses specifically. Instead of teaching them everything from scratch (which would take forever), you just give them a small notebook with special tips about drawing houses. They keep all their old knowledge and just peek at the notebook when they need house-drawing tips. QLoRA is that small notebook — it teaches a big AI model new tricks without having to retrain the whole thing.`,
      realWorldAnalogy: `QLoRA is like giving a seasoned architect a specialized guidebook for designing bank interiors. The architect already knows how to design buildings (the base model), and the guidebook (the LoRA adapter) is a thin, focused supplement that teaches them the specific style, regulations, and patterns unique to banking environments — without them forgetting how to design other buildings.`,
      whyWeUsedIt: `Fine-tuning Qwen2.5-Coder (7B parameters) to generate enterprise HTML from descriptions:
- Full fine-tuning would need ~28GB VRAM (FP16)
- QLoRA needs ~6GB VRAM (4-bit quantized + small adapters)
- RTX 4090 (16GB) can handle this with room for data batching
- Fine-tuned model generates domain-specific HTML with much higher quality than the base model`,
      howItWorksInProject: `- \`fine_tuning/\` directory contains training scripts
- Training data: scraped HTML + descriptions (instruction-following format)
- Base model: Qwen2.5-Coder-7B quantized to 4-bit
- LoRA config: r=16, alpha=32, target modules=q_proj,v_proj
- Training on RTX 4090: ~2 hours for 3 epochs on 10K examples
- Adapter weights saved separately (~50MB vs 14GB full model)`,
      featuresInProject: [
        {
          feature: "Domain-Specific HTML Generation",
          description:
            "QLoRA fine-tunes Qwen2.5-Coder-7B on scraped banking UI data so the model generates enterprise-grade HTML/CSS that matches the visual patterns, color schemes, and component structures found in real banking dashboards.",
        },
        {
          feature: "Training Data Pipeline",
          description:
            "Scraped HTML/CSS pairs are formatted into instruction-following examples (prompt: 'Generate a banking login form with...', completion: '<actual HTML>') and used as the training dataset for QLoRA fine-tuning.",
        },
        {
          feature: "Adapter Weight Management",
          description:
            "LoRA adapter weights (~50MB) are saved, versioned, and hot-swapped independently of the base model, allowing multiple specialized adapters (banking forms, dashboards, charts) to be loaded on demand.",
        },
        {
          feature: "4-Bit Quantized Inference",
          description:
            "The base Qwen2.5-Coder model is quantized to NF4 (4-bit Normal Float) for both training and inference, reducing VRAM usage from ~14GB to ~4GB and enabling the entire pipeline to run on a single RTX 4090.",
        },
        {
          feature: "Training Monitoring & Callbacks",
          description:
            "Custom HuggingFace Trainer callbacks report training loss, learning rate, and VRAM usage to the OpenTelemetry pipeline, providing real-time visibility into fine-tuning runs via the dashboard.",
        },
      ],
      coreConceptsMarkdown: `### LoRA (Low-Rank Adaptation)

**Core Idea:** Weight updates during fine-tuning are low-rank. Instead of learning a full d×d update matrix, decompose it into two smaller matrices.

\`\`\`
W_new = W_original + A @ B
where A is (d, r), B is (r, d), and r << d

For d=4096, r=16:
Full update: 4096 × 4096 = 16.7M parameters
LoRA update: 4096 × 16 + 16 × 4096 = 131K parameters (127x fewer!)
\`\`\`

### Quantization (NF4)

NF4 (Normal Float 4-bit) quantizes weights assuming a normal distribution:
1. Compute quantile breakpoints for a standard normal distribution
2. Map each weight to the nearest quantile
3. Store as 4-bit index (16 possible values)

4-bit quantization reduces model memory by 4x with minimal quality loss.

### Training Pipeline

\`\`\`python
from transformers import AutoModelForCausalLM, BitsAndBytesConfig
from peft import LoraConfig, get_peft_model

# 4-bit quantization config
bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.bfloat16,
)

# Load quantized model
model = AutoModelForCausalLM.from_pretrained(
    "Qwen/Qwen2.5-Coder-7B",
    quantization_config=bnb_config,
)

# Add LoRA adapters
lora_config = LoraConfig(
    r=16,
    lora_alpha=32,
    target_modules=["q_proj", "v_proj"],
    lora_dropout=0.05,
)
model = get_peft_model(model, lora_config)
# Trainable params: 0.1% of total

# Train with standard HuggingFace Trainer
trainer = Trainer(model=model, train_dataset=dataset, ...)
trainer.train()

# Save adapter only (~50MB)
model.save_pretrained("./qlora-adapter")
\`\`\``,
      prosAndCons: {
        pros: [
          "Fine-tune 7B+ models on consumer GPUs (RTX 3090/4090)",
          "Minimal quality loss compared to full fine-tuning",
          "Adapter weights are tiny (~50MB) — easy to share and version",
          "Can stack multiple adapters for different tasks",
          "Base model stays frozen — no catastrophic forgetting",
          "Fast training — hours instead of days",
        ],
        cons: [
          "Slightly lower quality than full fine-tuning",
          "Not all tasks benefit from fine-tuning (sometimes prompting is enough)",
          "Training data quality is critical — garbage in, garbage out",
          "Quantization adds inference latency (dequantization step)",
          "LoRA rank (r) needs tuning for each task",
          "Merging adapters back into base model can be lossy",
        ],
      },
      alternatives: [
        {
          name: "Full Fine-Tuning",
          comparison:
            "Update all model weights. Best quality but requires 4x more memory and 10x more compute. Only feasible with multiple A100/H100 GPUs.",
        },
        {
          name: "LoRA (without quantization)",
          comparison:
            "Same low-rank adapter approach but on FP16 model. Better quality than QLoRA but needs 2x more VRAM.",
        },
        {
          name: "Prompt Tuning",
          comparison:
            "Learn a soft prompt prefix instead of weight adapters. Even more parameter-efficient but generally lower quality.",
        },
        {
          name: "RAG (instead of fine-tuning)",
          comparison:
            "Provide relevant context at inference time instead of baking knowledge into weights. Better for factual knowledge, worse for style/behavior changes.",
        },
      ],
      keyAPIs: [
        "BitsAndBytesConfig — quantization configuration",
        "LoraConfig — LoRA adapter configuration",
        "get_peft_model() — add adapters to model",
        "model.save_pretrained() — save adapter weights",
        "PeftModel.from_pretrained() — load adapter weights",
        "Trainer — HuggingFace training loop",
      ],
      academicFoundations: `**Low-Rank Approximation:** LoRA is based on the mathematical observation that weight updates during fine-tuning have low intrinsic rank. This connects to the SVD (Singular Value Decomposition) and the Eckart-Young theorem, which states that the best rank-r approximation of a matrix is given by its top-r singular values.

**Quantization Theory (Dettmers et al., 2023):** NF4 quantization is based on the observation that pre-trained model weights follow approximately normal distributions. By using quantile-based breakpoints, NF4 minimizes quantization error for normally-distributed data.

**Transfer Learning (Yosinski et al., 2014):** Fine-tuning is a form of transfer learning — knowledge from pre-training transfers to the downstream task. Lower layers capture general features (syntax, common patterns) while upper layers are adapted for specific tasks.

**Catastrophic Forgetting (McCloskey & Cohen, 1989):** Full fine-tuning can cause the model to forget pre-training knowledge. LoRA mitigates this by keeping the original weights frozen and only learning small perturbations.`,
      furtherReading: [
        "QLoRA paper: Efficient Finetuning of Quantized LLMs (Dettmers et al., 2023)",
        "LoRA paper: Low-Rank Adaptation of Large Language Models (Hu et al., 2021)",
        "Hugging Face PEFT documentation — huggingface.co/docs/peft",
      ],
    },
    {
      name: "ChromaDB",
      category: "database",
      icon: "CR",
      tagline: "AI-native embedding database",
      origin: {
        creator: "Jeff Huber & Anton Troynikov",
        year: 2022,
        motivation:
          "Vector databases were too complex for AI application developers. ChromaDB was designed to be the 'SQLite of vector databases' — simple, embedded, and developer-friendly.",
      },
      whatItIs: `ChromaDB is an open-source embedding database designed for AI applications:
- **Embedded mode** — runs in-process, no server needed
- **Client/server mode** — for production deployments
- **Automatic embedding** — pass text, ChromaDB embeds it
- **Metadata filtering** — combine vector search with filters
- **Simple API** — add, query, update, delete`,
      explainLikeImTen: `Think of a huge library where instead of organizing books by title or author, you organize them by what they're about. If you ask "show me books about space travel adventures," the librarian instantly finds the most similar books even if none of them have "space travel" in the title. ChromaDB is that smart librarian for our AI — it finds the most similar website pieces we've already seen, so the AI can use them as inspiration when building new ones.`,
      realWorldAnalogy: `ChromaDB is like a mood board for an interior designer. When a client says "I want something that feels like a modern bank lobby," the designer flips through their organized collection of photos and picks the five closest matches. ChromaDB does the same thing with scraped UI components — you describe what you want, and it finds the most visually and structurally similar components from everything that has been scraped.`,
      whyWeUsedIt: `For RAG in the playground generator, ChromaDB provides:
- Embedded mode for development — no Docker container needed
- Automatic embedding generation (built-in models)
- Simple Python API for storing and querying scraped UI components
- Good enough performance for moderate-sized datasets (<100K documents)`,
      howItWorksInProject: `- Embedded mode during development, client/server in production
- Collections for different types of scraped data (HTML components, screenshots, descriptions)
- Automatic embedding via default model or sentence-transformers
- Queried during generation to find similar existing components`,
      featuresInProject: [
        {
          feature: "UI Component Retrieval (RAG)",
          description:
            "During HTML generation, ChromaDB is queried with the user's description to retrieve the top-K most similar previously scraped UI components. These are injected into the LLM prompt as few-shot examples, dramatically improving output quality.",
        },
        {
          feature: "Scraped Data Storage",
          description:
            "All scraped HTML snippets, their text descriptions, and metadata (source URL, component type, scrape date) are stored in ChromaDB collections, creating a searchable repository of enterprise UI patterns.",
        },
        {
          feature: "Deduplication Pipeline",
          description:
            "Before storing new scraped components, ChromaDB similarity search checks if a near-duplicate already exists (cosine similarity > 0.95), preventing redundant training data and storage bloat.",
        },
        {
          feature: "Training Data Curation",
          description:
            "ChromaDB's metadata filtering enables curating fine-tuning datasets by component type (forms, tables, charts), source domain, or quality score — allowing targeted fine-tuning runs on specific UI categories.",
        },
        {
          feature: "Semantic Search API",
          description:
            "The FastAPI backend exposes a /search endpoint that proxies to ChromaDB, allowing the Next.js frontend to perform semantic search over all scraped components and display similar results in the dashboard.",
        },
      ],
      coreConceptsMarkdown: `### Basic Usage

\`\`\`python
import chromadb

client = chromadb.Client()  # embedded mode

collection = client.create_collection("ui_components")

# Add documents (auto-embedded)
collection.add(
    documents=["Login form with email and password", "Dashboard with charts"],
    metadatas=[{"type": "form"}, {"type": "dashboard"}],
    ids=["comp1", "comp2"],
)

# Query (auto-embedded)
results = collection.query(
    query_texts=["authentication form"],
    n_results=5,
)
\`\`\`

### ChromaDB vs Qdrant

| Feature | ChromaDB | Qdrant |
|---------|----------|--------|
| Language | Python | Rust |
| Embedded mode | Yes | No |
| Auto-embedding | Yes | No |
| Performance (>1M vectors) | Good | Excellent |
| Filtering | Basic | Advanced |
| Production-ready | Growing | Yes |
| API simplicity | Very simple | Moderate |`,
      prosAndCons: {
        pros: [
          "Simplest vector database — embed and query in 3 lines",
          "Embedded mode — no server needed for development",
          "Auto-embedding — just pass text",
          "Great for prototyping and small datasets",
          "Python-native",
        ],
        cons: [
          "Performance degrades past ~500K vectors",
          "Limited filtering compared to Qdrant/Weaviate",
          "Embedded mode not suitable for production",
          "Less mature than Qdrant or Pinecone",
          "No built-in replication or sharding",
        ],
      },
      alternatives: [
        {
          name: "Qdrant",
          comparison:
            "Rust-based, production-grade. Better performance, richer filtering, but requires a server. Used in our RAG Eval Engine project.",
        },
        {
          name: "FAISS",
          comparison:
            "Facebook's vector similarity search library. Very fast (C++ with Python bindings) but no persistence, no metadata filtering. Low-level library, not a database.",
        },
        {
          name: "LanceDB",
          comparison:
            "Embedded vector database built on Lance format. Better performance than ChromaDB and supports multimodal data.",
        },
      ],
      keyAPIs: [
        "chromadb.Client() — create embedded client",
        "client.create_collection() — create collection",
        "collection.add() — add documents",
        "collection.query() — similarity search",
        "collection.update() — update documents",
        "collection.delete() — remove documents",
      ],
      academicFoundations: `**Embedded Databases:** ChromaDB follows the embedded database paradigm (SQLite, LevelDB, RocksDB) where the database runs in the application's process space. This eliminates network overhead but limits concurrency to a single process.

**Approximate Nearest Neighbor (ANN):** ChromaDB uses HNSW (same as Qdrant) internally for similarity search. The trade-off between recall (accuracy) and speed is controlled by the ef_search parameter.`,
      furtherReading: [
        "ChromaDB documentation — docs.trychroma.com",
        "Comparing vector databases — superlinked.com/vectorhub",
      ],
    },
    {
      name: "OpenTelemetry",
      category: "observability",
      icon: "OT",
      tagline: "Vendor-neutral observability framework",
      origin: {
        creator: "CNCF (merger of OpenTracing + OpenCensus)",
        year: 2019,
        motivation:
          "Observability vendors (Datadog, New Relic, Jaeger) each had proprietary instrumentation APIs. OpenTelemetry unifies traces, metrics, and logs into a single vendor-neutral standard.",
      },
      whatItIs: `OpenTelemetry (OTel) is a collection of APIs, SDKs, and tools for generating and collecting telemetry data:
- **Traces:** Request flow across services (distributed tracing)
- **Metrics:** Counters, histograms, gauges
- **Logs:** Structured log events correlated with traces
- **Exporters:** Send data to any backend (Jaeger, Prometheus, Datadog)`,
      explainLikeImTen: `Imagine you're running a giant relay race with dozens of runners. You want to know exactly how long each runner took, if anyone dropped the baton, and where the slowdowns happened. OpenTelemetry is like giving every runner a stopwatch and a walkie-talkie so they report back everything that happens during their leg of the race. It helps us see the whole picture of what our software is doing, where it's slow, and where things go wrong.`,
      realWorldAnalogy: `OpenTelemetry is like an airport's flight tracking system. Every flight (request) gets a unique tracking number. As it moves through check-in, security, boarding, and takeoff (different services), each station logs the timestamp and any issues. The control tower (dashboard) sees the entire journey in one view and can instantly spot where delays or problems occurred.`,
      whyWeUsedIt: `The scraper pipeline has multiple stages (scrape → process → embed → store). OTel provides:
- Distributed tracing across pipeline stages
- Performance metrics for each stage
- Error tracking with full context
- Vendor-neutral — can switch from Jaeger to Datadog without code changes`,
      howItWorksInProject: `- FastAPI auto-instrumentation captures HTTP traces
- Custom spans for scraping, embedding, and storage operations
- Metrics exported to local Prometheus or OTLP collector
- Trace context propagated across async operations`,
      featuresInProject: [
        {
          feature: "Pipeline Stage Tracing",
          description:
            "Each stage of the scraper pipeline (page load, HTML extraction, embedding generation, ChromaDB storage) is wrapped in an OpenTelemetry span, producing end-to-end traces that show exactly how long each step takes per scraped page.",
        },
        {
          feature: "FastAPI Auto-Instrumentation",
          description:
            "The opentelemetry-instrumentation-fastapi package automatically creates spans for every HTTP request to the API, capturing request/response metadata, status codes, and latency without any manual code changes.",
        },
        {
          feature: "Fine-Tuning Metrics Dashboard",
          description:
            "Custom OTel metrics (training loss per epoch, VRAM utilization, tokens per second) are exported during QLoRA fine-tuning runs, providing real-time training visibility in Grafana via Prometheus.",
        },
        {
          feature: "Error Tracking with Context",
          description:
            "When a scrape fails (timeout, anti-bot detection, network error), the error is recorded on the active span with full context (URL, retry count, error type), making it easy to diagnose patterns in scraping failures.",
        },
        {
          feature: "Generation Quality Metrics",
          description:
            "Custom counters and histograms track HTML generation metrics — tokens generated, generation time, and user quality ratings — enabling data-driven decisions about when to retrain or swap adapters.",
        },
      ],
      coreConceptsMarkdown: `### Three Pillars of Observability

**Traces:** Follow a request across services. Each span represents a unit of work.
\`\`\`python
from opentelemetry import trace
tracer = trace.get_tracer(__name__)

with tracer.start_as_current_span("scrape_page") as span:
    span.set_attribute("url", url)
    html = await scrape(url)
    span.set_attribute("html_size", len(html))
\`\`\`

**Metrics:** Aggregate measurements.
\`\`\`python
from opentelemetry import metrics
meter = metrics.get_meter(__name__)
counter = meter.create_counter("pages_scraped")
counter.add(1, {"status": "success"})
\`\`\`

**Logs:** Structured events with trace correlation.

### Collector Architecture

\`\`\`
App → OTel SDK → OTLP Exporter → OTel Collector → Backend
                                      ↓
                              Jaeger / Prometheus / Datadog
\`\`\``,
      prosAndCons: {
        pros: [
          "Vendor-neutral — switch backends without code changes",
          "Unified API for traces, metrics, and logs",
          "Auto-instrumentation for popular frameworks",
          "CNCF standard — broad industry adoption",
          "Rich context propagation across services",
        ],
        cons: [
          "Complex setup — many components to configure",
          "Overhead for high-throughput applications",
          "SDK can be verbose for simple use cases",
          "Log integration is still maturing",
          "Breaking changes between versions",
        ],
      },
      alternatives: [
        {
          name: "Datadog APM",
          comparison:
            "Commercial APM with excellent DX. Auto-instrumentation, anomaly detection, AI-powered insights. But expensive and vendor-locked.",
        },
        {
          name: "Prometheus + Jaeger",
          comparison:
            "Open-source metrics (Prometheus) + tracing (Jaeger). OTel can export to both, making them complementary.",
        },
        {
          name: "Sentry",
          comparison:
            "Error tracking with performance monitoring. Great for error reporting but less comprehensive for distributed tracing.",
        },
      ],
      keyAPIs: [
        "trace.get_tracer() — create tracer",
        "tracer.start_as_current_span() — create span",
        "span.set_attribute() — add metadata",
        "metrics.get_meter() — create meter",
        "meter.create_counter/histogram() — create metrics",
        "OTLPExporter — send data to collector",
      ],
      academicFoundations: `**Distributed Tracing (Sigelman et al., 2010):** Google's Dapper paper introduced the concept of trace trees for understanding distributed system behavior. Each trace is a DAG of spans, where each span represents a unit of work in a service.

**The Three Pillars:** Distributed observability theory identifies three complementary signal types: metrics (aggregated measurements), traces (request-scoped causality), and logs (discrete events). Together they provide complete system understanding.

**Context Propagation:** W3C Trace Context standard defines how trace IDs are propagated across service boundaries via HTTP headers (traceparent, tracestate). This enables end-to-end tracing across different languages and frameworks.`,
      furtherReading: [
        "OpenTelemetry documentation — opentelemetry.io/docs",
        "Google Dapper paper (2010)",
        "Distributed Systems Observability by Cindy Sridharan (O'Reilly)",
      ],
    },
    {
      name: "Python",
      category: "language",
      icon: "PY",
      tagline: "Primary backend language powering scraping, ML, and API",
      origin: {
        creator: "Guido van Rossum",
        year: 1991,
        motivation:
          "Van Rossum wanted a language that was easy to read and write, bridging the gap between shell scripting and C. Named after Monty Python's Flying Circus, Python prioritized developer productivity and code readability over raw performance.",
      },
      whatItIs: `Python is a high-level, interpreted, dynamically-typed programming language:
- **Readable syntax:** Indentation-based blocks, minimal boilerplate
- **Rich ecosystem:** pip/PyPI with 500K+ packages
- **ML/AI dominance:** PyTorch, TensorFlow, HuggingFace, scikit-learn
- **Web scraping:** Playwright, BeautifulSoup, Scrapy
- **Async support:** asyncio, async/await for concurrent I/O
- **Typing:** Optional type hints (PEP 484) with mypy/pyright for static analysis`,
      explainLikeImTen: `Python is a programming language — a way to tell computers what to do. It's one of the easiest languages to learn because it reads almost like English. Instead of writing complicated symbols, you write things like "for item in list: print(item)." It's super popular for AI and data science because smart people have built tons of free tools for it. In our project, Python is the language we use to tell the computer how to scrape websites, train AI models, and run the backend server.`,
      realWorldAnalogy: `Python is like English in the programming world — it's the lingua franca that almost everyone knows, and it has the largest library of textbooks (packages) available. Just as English is the default language for international business and science, Python is the default language for AI/ML research, data science, and rapid prototyping. It may not be the fastest spoken language, but its universality and extensive vocabulary make it the most practical choice.`,
      whyWeUsedIt: `Python is the only practical choice for this project because:
- HuggingFace Transformers, PEFT, and bitsandbytes (QLoRA) are Python-only
- Playwright's Python SDK is first-class for async scraping
- ChromaDB's embedded mode is Python-native
- FastAPI provides a high-performance async Python web framework
- The entire ML/AI ecosystem (PyTorch, sentence-transformers) is Python-first
- Rapid prototyping with type hints for production safety`,
      howItWorksInProject: `- Python 3.11+ for all backend code (performance improvements in 3.11)
- asyncio throughout — async scraping, async API endpoints, async DB operations
- Type hints with Pydantic for runtime validation
- Ruff for linting and formatting (replaces flake8 + black + isort)
- Poetry or pip-tools for dependency management
- pytest for testing with pytest-asyncio for async tests`,
      featuresInProject: [
        {
          feature: "Async Scraping Pipeline",
          description:
            "Python's asyncio drives the entire scraping pipeline — concurrent page loads, parallel HTML extraction, and batched ChromaDB writes — achieving 10x throughput over synchronous scraping by overlapping network I/O.",
        },
        {
          feature: "ML Training Scripts",
          description:
            "All fine-tuning code (data loading, QLoRA configuration, training loops, evaluation) is written in Python using HuggingFace Transformers and PEFT, the only ecosystem with mature QLoRA support.",
        },
        {
          feature: "FastAPI Backend",
          description:
            "The REST API serving scraped data, triggering generation, and managing training runs is built with FastAPI (Python), leveraging Pydantic models for request/response validation and automatic OpenAPI documentation.",
        },
        {
          feature: "Data Processing Utilities",
          description:
            "Python scripts in the scripts/ directory handle data cleaning, HTML normalization, training data formatting (instruction pairs), and dataset statistics — tasks where Python's string manipulation and pandas integration excel.",
        },
        {
          feature: "ChromaDB Integration",
          description:
            "Python's native ChromaDB client runs in embedded mode during development, providing zero-config vector storage and retrieval directly within the application process.",
        },
      ],
      coreConceptsMarkdown: `### Async/Await in Python

Python's asyncio enables concurrent I/O operations — critical for scraping and API serving:

\`\`\`python
import asyncio
from playwright.async_api import async_playwright

async def scrape_pages(urls: list[str]) -> list[str]:
    async with async_playwright() as p:
        browser = await p.chromium.launch()

        async def scrape_one(url: str) -> str:
            page = await browser.new_page()
            await page.goto(url)
            html = await page.inner_html("body")
            await page.close()
            return html

        # Concurrent scraping with semaphore for rate limiting
        semaphore = asyncio.Semaphore(5)
        async def limited_scrape(url: str) -> str:
            async with semaphore:
                return await scrape_one(url)

        results = await asyncio.gather(*[limited_scrape(u) for u in urls])
        await browser.close()
        return results
\`\`\`

### Type Hints + Pydantic

\`\`\`python
from pydantic import BaseModel

class ScrapedComponent(BaseModel):
    url: str
    html: str
    component_type: str
    metadata: dict[str, str]

# Runtime validation — raises on invalid data
component = ScrapedComponent(
    url="https://bank.com/login",
    html="<form>...</form>",
    component_type="form",
    metadata={"bank": "Chase"},
)
\`\`\`

### Project Structure

\`\`\`
enterprise-playground/
├── api/              # FastAPI routes and middleware
├── scraper/          # Playwright-based scraping pipeline
├── fine_tuning/      # QLoRA training scripts
├── generation/       # LLM-based HTML generation
├── storage/          # ChromaDB and data persistence
├── scripts/          # Data processing utilities
├── tests/            # pytest test suite
└── frontend/         # Next.js dashboard (TypeScript)
\`\`\``,
      prosAndCons: {
        pros: [
          "Dominant ML/AI ecosystem — no real alternative for this project",
          "Excellent async support for I/O-bound scraping workloads",
          "Readable code reduces onboarding time",
          "Type hints + Pydantic provide runtime safety",
          "Massive package ecosystem (PyPI)",
          "Fast prototyping with REPL-driven development",
        ],
        cons: [
          "Slow execution speed compared to compiled languages",
          "GIL limits true parallelism for CPU-bound tasks",
          "Dynamic typing can hide bugs without type checkers",
          "Dependency management historically painful (improving with uv/poetry)",
          "Memory-hungry compared to Go/Rust",
        ],
      },
      alternatives: [
        {
          name: "Rust",
          comparison:
            "10-100x faster, memory-safe without GC. But the ML ecosystem is nascent — no HuggingFace, no PEFT, no bitsandbytes. Not viable for this project.",
        },
        {
          name: "Go",
          comparison:
            "Excellent for networking and concurrency. But no ML ecosystem, no Playwright SDK, no ChromaDB client. Wrong tool for AI workloads.",
        },
        {
          name: "JavaScript/TypeScript (Node.js)",
          comparison:
            "Good for web scraping (Puppeteer/Playwright) and APIs. But ML ecosystem is minimal — no PyTorch, no HuggingFace, no QLoRA tooling.",
        },
      ],
      keyAPIs: [
        "asyncio.gather() — run coroutines concurrently",
        "asyncio.Semaphore — rate-limit concurrent operations",
        "typing module — type hints for static analysis",
        "dataclasses — lightweight data containers",
        "pathlib.Path — cross-platform file path handling",
        "contextlib.asynccontextmanager — async resource management",
      ],
      academicFoundations: `**Language Design (Van Rossum, 1991):** Python's design philosophy is captured in PEP 20 (The Zen of Python): "Readability counts," "There should be one obvious way to do it," and "Simple is better than complex." These principles directly influenced Python's dominance in scientific computing and education.

**GIL (Global Interpreter Lock):** CPython uses a GIL to simplify memory management, preventing true multi-threaded parallelism for CPU-bound tasks. This is mitigated by asyncio for I/O-bound workloads (like web scraping) and multiprocessing for CPU-bound tasks (like data processing). PEP 703 (no-GIL Python) is in progress for Python 3.13+.

**Duck Typing and Structural Subtyping:** Python's type system is structurally typed — "if it walks like a duck and quacks like a duck, it's a duck." PEP 544 formalized this with Protocol classes, enabling static type checking of duck-typed code.`,
      furtherReading: [
        "Python documentation — docs.python.org",
        "Fluent Python by Luciano Ramalho (O'Reilly)",
        "Python asyncio documentation — docs.python.org/3/library/asyncio.html",
        "PEP 484 — Type Hints",
      ],
    },
    {
      name: "FastAPI",
      category: "framework",
      icon: "FA",
      tagline: "High-performance async Python web framework",
      origin: {
        creator: "Sebastian Ramirez",
        year: 2018,
        motivation:
          "Flask and Django were the standard Python web frameworks but lacked native async support and automatic API documentation. FastAPI was built on Starlette (ASGI) and Pydantic to provide automatic OpenAPI docs, request validation, and async-first performance.",
      },
      whatItIs: `FastAPI is a modern Python web framework for building APIs:
- **Async-first:** Built on Starlette's ASGI foundation for high concurrency
- **Automatic validation:** Pydantic models validate requests and responses
- **Auto-generated docs:** Swagger UI and ReDoc from type hints
- **Dependency injection:** Clean, testable endpoint composition
- **WebSocket support:** Real-time communication built-in
- **Performance:** One of the fastest Python frameworks (on par with Node.js/Go for I/O)`,
      explainLikeImTen: `When you use an app on your phone, it talks to a server somewhere to get information. FastAPI is the tool we use to build that server. It's like a really smart receptionist at a hotel — when someone walks in (a request arrives), the receptionist checks their ID (validates the data), looks up their reservation (processes the request), and gives them their room key (sends back the response). FastAPI does all of this automatically and super fast, and it even writes its own instruction manual so other developers know how to talk to it.`,
      realWorldAnalogy: `FastAPI is like a drive-through window at a well-organized restaurant. The menu board (OpenAPI docs) shows exactly what you can order and what you'll get. The cashier (Pydantic validation) checks your order is valid before passing it to the kitchen. The kitchen (async handlers) can prepare multiple orders simultaneously instead of one at a time. And it all happens fast because the whole operation is optimized for throughput.`,
      whyWeUsedIt: `FastAPI is the backend framework for the Enterprise Playground because:
- Async support matches our async scraping pipeline (Playwright, ChromaDB)
- Pydantic models define clear contracts for scraped data structures
- Auto-generated OpenAPI docs make the frontend integration seamless
- Dependency injection cleanly manages ChromaDB clients, model loaders, OTel tracers
- Performance handles concurrent generation requests without blocking`,
      howItWorksInProject: `- Serves as the REST API layer between the Next.js frontend and Python backend
- Endpoints for: triggering scrapes, querying components, generating HTML, managing training runs
- Pydantic models enforce data contracts for all request/response types
- Dependency injection provides ChromaDB, Ollama client, and OTel tracer to endpoints
- CORS middleware configured for Next.js frontend communication
- OpenTelemetry auto-instrumentation captures all HTTP traces`,
      featuresInProject: [
        {
          feature: "Scraper Management API",
          description:
            "POST /scrape endpoints accept target URLs and configuration (depth, rate limits, selectors), validate inputs via Pydantic, and dispatch async scraping tasks using Playwright — returning a job ID for status polling.",
        },
        {
          feature: "HTML Generation Endpoint",
          description:
            "POST /generate accepts a natural language description, retrieves similar components from ChromaDB (RAG), constructs a prompt, and streams the generated HTML back from Ollama — using FastAPI's StreamingResponse for real-time output.",
        },
        {
          feature: "Training Run Management",
          description:
            "Endpoints to start, monitor, and stop QLoRA fine-tuning runs. POST /train/start accepts training configuration (LoRA rank, epochs, dataset filters), launches the training in a background task, and exposes GET /train/status for progress monitoring.",
        },
        {
          feature: "Component Search API",
          description:
            "GET /components/search proxies semantic search queries to ChromaDB, returning ranked UI components with metadata. Query parameters control result count, component type filters, and similarity threshold.",
        },
        {
          feature: "Auto-Generated API Documentation",
          description:
            "FastAPI's automatic Swagger UI at /docs provides interactive API documentation derived from Pydantic models and type hints, enabling the frontend team to explore and test all endpoints without separate documentation.",
        },
      ],
      coreConceptsMarkdown: `### Basic FastAPI Application

\`\`\`python
from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel

app = FastAPI(title="Enterprise Playground API")

class GenerateRequest(BaseModel):
    description: str
    max_tokens: int = 2048
    use_rag: bool = True

class GenerateResponse(BaseModel):
    html: str
    tokens_used: int
    similar_components: list[str]

@app.post("/generate", response_model=GenerateResponse)
async def generate_html(request: GenerateRequest):
    # Retrieve similar components from ChromaDB
    similar = await chromadb_client.query(request.description)

    # Generate HTML via Ollama
    html = await ollama_generate(request.description, similar)

    return GenerateResponse(
        html=html,
        tokens_used=len(html) // 4,
        similar_components=[s.id for s in similar],
    )
\`\`\`

### Dependency Injection

\`\`\`python
from fastapi import Depends

async def get_chromadb():
    client = chromadb.AsyncHttpClient()
    try:
        yield client
    finally:
        await client.close()

async def get_tracer():
    return trace.get_tracer("api")

@app.get("/components/{component_id}")
async def get_component(
    component_id: str,
    db: chromadb.AsyncHttpClient = Depends(get_chromadb),
    tracer: trace.Tracer = Depends(get_tracer),
):
    with tracer.start_as_current_span("get_component"):
        return await db.get(component_id)
\`\`\`

### Streaming Response

\`\`\`python
from fastapi.responses import StreamingResponse

@app.post("/generate/stream")
async def generate_stream(request: GenerateRequest):
    async def token_stream():
        async for token in ollama_stream(request.description):
            yield token

    return StreamingResponse(token_stream(), media_type="text/html")
\`\`\``,
      prosAndCons: {
        pros: [
          "Automatic request/response validation via Pydantic",
          "Auto-generated OpenAPI docs (Swagger + ReDoc)",
          "Async-first — high concurrency for I/O-bound workloads",
          "Dependency injection built-in (clean, testable code)",
          "Excellent developer experience — type hints drive everything",
          "One of the fastest Python frameworks",
        ],
        cons: [
          "Smaller ecosystem than Django (no built-in ORM, admin, auth)",
          "Pydantic v1 to v2 migration was painful for early adopters",
          "Background tasks are limited — need Celery/ARQ for heavy jobs",
          "No built-in WebSocket scaling (need external broker)",
          "Still Python — slower than Go/Rust for CPU-bound work",
        ],
      },
      alternatives: [
        {
          name: "Flask",
          comparison:
            "The classic Python microframework. Simpler but synchronous by default, no built-in validation, no auto-generated docs. FastAPI is the modern replacement.",
        },
        {
          name: "Django + DRF",
          comparison:
            "Full-featured framework with ORM, admin, auth. Better for CRUD apps with databases, but heavier and slower for API-only ML backends.",
        },
        {
          name: "Litestar",
          comparison:
            "Similar to FastAPI (ASGI, Pydantic, auto-docs) but with a different philosophy on dependency injection and configuration. Smaller community.",
        },
        {
          name: "Express.js (Node)",
          comparison:
            "JavaScript equivalent. Faster raw performance but no Python ML ecosystem integration — would require a separate Python service for ML tasks.",
        },
      ],
      keyAPIs: [
        "FastAPI() — create application instance",
        "@app.get/post/put/delete — route decorators",
        "Depends() — dependency injection",
        "BaseModel — Pydantic request/response models",
        "StreamingResponse — stream data to client",
        "BackgroundTasks — run tasks after response",
        "HTTPException — raise HTTP errors",
      ],
      academicFoundations: `**ASGI (Asynchronous Server Gateway Interface):** FastAPI is built on ASGI (PEP 3333's async successor), which defines how Python web servers communicate with applications asynchronously. Starlette provides the ASGI toolkit, and Uvicorn/Hypercorn serve as ASGI servers.

**OpenAPI Specification (OAS):** FastAPI automatically generates OpenAPI 3.0 schemas from Python type hints. The OpenAPI spec (originally Swagger) is an industry standard for describing REST APIs, enabling automated client generation, documentation, and testing.

**Dependency Injection (Martin Fowler, 2004):** FastAPI's Depends() system implements constructor injection, where dependencies are declared as function parameters and resolved by the framework. This promotes loose coupling and testability — endpoints don't create their own dependencies.

**Pydantic and Runtime Validation:** Pydantic uses Python's type annotations to perform runtime data validation, bridging the gap between static type checking (mypy) and actual data safety. This is related to contract programming (Design by Contract, Bertrand Meyer, 1986).`,
      furtherReading: [
        "FastAPI documentation — fastapi.tiangolo.com",
        "Starlette documentation — starlette.io",
        "Pydantic documentation — docs.pydantic.dev",
        "ASGI specification — asgi.readthedocs.io",
      ],
    },
    {
      name: "Ollama",
      category: "ai-ml",
      icon: "OL",
      tagline: "Local LLM inference server for HTML generation",
      origin: {
        creator: "Jeffrey Morgan & Ollama team",
        year: 2023,
        motivation:
          "Running large language models locally required complex setup with CUDA, quantization libraries, and model format conversions. Ollama wraps llama.cpp in a Docker-like CLI experience — pull a model and run it with one command.",
      },
      whatItIs: `Ollama is a local LLM inference platform:
- **One-command setup:** \`ollama pull qwen2.5-coder\` downloads and runs models
- **REST API:** OpenAI-compatible HTTP API on localhost:11434
- **GPU acceleration:** Automatic CUDA/Metal detection and offloading
- **Model management:** Pull, list, remove models like Docker images
- **Modelfile:** Customize system prompts, parameters, and adapters
- **Quantization:** Runs GGUF-quantized models for lower memory usage
- **Concurrent requests:** Queue and batch multiple inference requests`,
      explainLikeImTen: `You know how you can ask ChatGPT questions on the internet? Ollama lets you run a similar AI right on your own computer, without needing the internet at all. It's like having your own personal robot assistant living inside your computer. You can ask it to write code, answer questions, or in our project, generate website pages. The best part is that everything stays on your machine — your questions and the AI's answers never leave your computer.`,
      realWorldAnalogy: `Ollama is like a home espresso machine compared to going to a coffee shop. The coffee shop (cloud APIs like OpenAI) makes great coffee but you have to go out, wait in line, and pay per cup. A home espresso machine (Ollama) sits on your counter, makes coffee instantly whenever you want, and after the upfront cost of the machine, every cup is essentially free. You trade some quality for convenience, speed, and privacy.`,
      whyWeUsedIt: `Ollama powers the HTML generation pipeline because:
- Runs Qwen2.5-Coder locally on the RTX 4090 — no API costs, no rate limits
- OpenAI-compatible API makes it a drop-in replacement for cloud models
- Supports loading custom QLoRA adapters via Modelfile
- Fast inference with GPU offloading — 30-50 tokens/sec on RTX 4090
- Data never leaves the machine — critical for enterprise/banking UI data
- Can run fine-tuned and base models simultaneously for A/B comparison`,
      howItWorksInProject: `- Ollama runs as a background service on the RTX 4090 machine
- Base model: Qwen2.5-Coder-7B (GGUF quantized)
- Fine-tuned model: Custom Modelfile loading QLoRA adapter
- FastAPI backend calls Ollama's /api/generate endpoint
- Streaming responses sent to frontend via FastAPI StreamingResponse
- Both base and fine-tuned models available for side-by-side comparison`,
      featuresInProject: [
        {
          feature: "Dual-Model HTML Generation",
          description:
            "Ollama serves both the base Qwen2.5-Coder and the QLoRA fine-tuned variant simultaneously, enabling the frontend to generate HTML from both models side-by-side so users can compare base vs. fine-tuned output quality.",
        },
        {
          feature: "Custom Modelfile for Fine-Tuned Models",
          description:
            "A custom Ollama Modelfile loads the base GGUF model with the QLoRA adapter weights merged in, along with a system prompt optimized for enterprise HTML generation — deployed with a single 'ollama create' command.",
        },
        {
          feature: "Streaming Token Output",
          description:
            "Ollama's /api/generate endpoint streams tokens as they're generated, which FastAPI proxies to the frontend via StreamingResponse. Users see HTML being written in real-time, providing immediate feedback on generation quality.",
        },
        {
          feature: "RAG-Augmented Prompts",
          description:
            "Before calling Ollama, the FastAPI backend retrieves similar UI components from ChromaDB and injects them into the prompt as few-shot examples, dramatically improving the relevance and accuracy of generated HTML.",
        },
        {
          feature: "Model Hot-Swapping",
          description:
            "The API supports switching between different Ollama models (different adapter versions, different base models) without restarting the server — enabling rapid experimentation with training iterations.",
        },
      ],
      coreConceptsMarkdown: `### Running Models with Ollama

\`\`\`bash
# Pull a model
ollama pull qwen2.5-coder:7b

# Run interactively
ollama run qwen2.5-coder:7b "Generate a login form in HTML"

# List models
ollama list

# Create custom model with Modelfile
ollama create enterprise-coder -f Modelfile
\`\`\`

### Modelfile (Custom Model Configuration)

\`\`\`dockerfile
FROM qwen2.5-coder:7b

# System prompt for enterprise HTML generation
SYSTEM """You are an expert frontend developer specializing in enterprise
banking UIs. Generate clean, semantic HTML with Tailwind CSS classes.
Always include proper form validation, accessibility attributes,
and responsive design."""

# Inference parameters
PARAMETER temperature 0.7
PARAMETER top_p 0.9
PARAMETER num_ctx 4096
\`\`\`

### REST API Usage

\`\`\`python
import httpx

async def generate_html(prompt: str, model: str = "enterprise-coder") -> str:
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "http://localhost:11434/api/generate",
            json={
                "model": model,
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": 0.7,
                    "num_predict": 2048,
                },
            },
        )
        return response.json()["response"]

# Streaming version
async def stream_html(prompt: str):
    async with httpx.AsyncClient() as client:
        async with client.stream(
            "POST",
            "http://localhost:11434/api/generate",
            json={"model": "enterprise-coder", "prompt": prompt, "stream": True},
        ) as response:
            async for line in response.aiter_lines():
                data = json.loads(line)
                yield data["response"]
\`\`\`

### GPU Memory Management

\`\`\`
RTX 4090 (16GB VRAM) allocation:
- Qwen2.5-Coder-7B (Q4_K_M): ~4.5GB
- Fine-tuned variant:           ~4.5GB
- KV cache per request:         ~0.5GB
- Available for batching:       ~6.5GB
\`\`\``,
      prosAndCons: {
        pros: [
          "One-command model setup — no CUDA/PyTorch configuration",
          "OpenAI-compatible API — easy migration from cloud to local",
          "Zero cost after hardware — no per-token pricing",
          "Data privacy — nothing leaves the machine",
          "Modelfile system for custom model configurations",
          "Active development with frequent model support additions",
        ],
        cons: [
          "Limited to GGUF format — not all model formats supported",
          "Quantized models have lower quality than FP16",
          "No built-in batching optimization (sequential request processing)",
          "Model switching has cold-start latency (loading into VRAM)",
          "Less mature than vLLM/TGI for production serving",
          "Limited multi-GPU support compared to vLLM",
        ],
      },
      alternatives: [
        {
          name: "vLLM",
          comparison:
            "Production-grade LLM serving with continuous batching, PagedAttention, and tensor parallelism. Much higher throughput but complex setup. Better for serving at scale, overkill for single-user local development.",
        },
        {
          name: "llama.cpp",
          comparison:
            "The engine under Ollama's hood. Direct llama.cpp gives more control (custom quantization, fine-grained memory management) but requires manual compilation and configuration.",
        },
        {
          name: "OpenAI API",
          comparison:
            "Cloud-based, highest quality models (GPT-4). But costs money per token, requires internet, and data leaves your machine — unacceptable for enterprise banking UI data.",
        },
        {
          name: "Text Generation Inference (TGI)",
          comparison:
            "HuggingFace's serving solution. Better batching and production features than Ollama, but heavier setup and Docker-centric deployment.",
        },
      ],
      keyAPIs: [
        "POST /api/generate — generate text completion",
        "POST /api/chat — chat completion (multi-turn)",
        "POST /api/embeddings — generate embeddings",
        "GET /api/tags — list available models",
        "POST /api/pull — download a model",
        "POST /api/create — create model from Modelfile",
        "DELETE /api/delete — remove a model",
      ],
      academicFoundations: `**GGUF Format (Gerganov, 2023):** GGUF (GPT-Generated Unified Format) is a binary format for storing quantized LLM weights, designed by Georgi Gerganov for llama.cpp. It supports multiple quantization levels (Q4_K_M, Q5_K_M, Q8_0) that trade quality for memory efficiency.

**Quantization for Inference:** Unlike QLoRA's training-time quantization, inference quantization (GGUF) permanently reduces model precision. K-quant methods use importance-based mixed precision — more important layers get higher precision, less important layers get lower.

**KV Cache:** During autoregressive generation, the key-value pairs from previous tokens are cached to avoid recomputation. KV cache size scales linearly with context length and is often the memory bottleneck for long generations.

**Speculative Decoding (Leviathan et al., 2023):** An optimization where a smaller "draft" model generates candidate tokens that a larger model verifies in parallel. Ollama is exploring this for faster inference with large models.`,
      furtherReading: [
        "Ollama documentation — ollama.com",
        "llama.cpp repository — github.com/ggerganov/llama.cpp",
        "GGUF format specification — github.com/ggerganov/ggml",
        "vLLM paper: Efficient Memory Management for LLM Serving (Kwon et al., 2023)",
      ],
    },
    {
      name: "Next.js",
      category: "framework",
      icon: "NX",
      tagline: "React framework powering the frontend dashboard",
      origin: {
        creator: "Vercel (Guillermo Rauch)",
        year: 2016,
        motivation:
          "React was powerful but lacked opinions on routing, SSR, and deployment. Next.js provided a batteries-included React framework with file-based routing, server-side rendering, and zero-config deployment — solving the 'create-react-app is not enough for production' problem.",
      },
      whatItIs: `Next.js is a full-stack React framework:
- **App Router:** File-based routing with layouts, loading states, error boundaries
- **Server Components:** React components that render on the server (RSC)
- **SSR/SSG/ISR:** Multiple rendering strategies per page
- **API Routes:** Backend endpoints alongside frontend code
- **Image/Font optimization:** Automatic optimization built-in
- **TypeScript-first:** Native TypeScript support with strict mode
- **Middleware:** Edge-compatible request interception`,
      explainLikeImTen: `When you visit a website, your browser needs to show you buttons, text, images, and interactive stuff. Next.js is the tool we use to build all of that. Think of it like a LEGO kit for websites — it comes with special pre-made pieces (components) that snap together to build pages. It's smart enough to build some pages ahead of time so they load super fast, and it can also build pages on-the-fly when you need fresh data. Our project's dashboard — where you see scraped components, trigger generation, and compare AI outputs — is all built with Next.js.`,
      realWorldAnalogy: `Next.js is like a pre-fabricated house construction system. Instead of building every wall, floor, and roof from raw lumber (vanilla React), you get pre-engineered modules that snap together. The factory (build system) pre-assembles what it can (static generation), ships partially assembled modules (server components), and the on-site crew (client) only handles the interactive finishing touches (client components). The result goes up faster and is more structurally sound than fully custom construction.`,
      whyWeUsedIt: `The frontend dashboard needs:
- Real-time streaming display of generated HTML (Server-Sent Events / WebSocket)
- Interactive side-by-side comparison of base vs fine-tuned model outputs
- Component gallery with search and filtering (fast, responsive UI)
- Training run monitoring dashboards
- TypeScript strict mode for type safety across the frontend
- Fast development with hot module replacement`,
      howItWorksInProject: `- Lives in the frontend/ directory as a separate Next.js 14+ application
- App Router with TypeScript strict mode
- Communicates with the FastAPI backend via REST API calls
- shadcn/ui components for consistent design system
- Tailwind CSS for styling
- Real-time generation display using streaming responses
- Zustand for client-side state management`,
      featuresInProject: [
        {
          feature: "Dual-Model Playground View",
          description:
            "A split-pane interface built with React components where users enter a description on the left and see HTML generated by both the base and fine-tuned models rendered side-by-side on the right, with real-time streaming output.",
        },
        {
          feature: "Component Gallery Dashboard",
          description:
            "A searchable, filterable gallery page displaying all scraped UI components with thumbnails, metadata, and similarity scores. Uses server components for initial load performance and client components for interactive filtering.",
        },
        {
          feature: "Training Run Monitor",
          description:
            "A dashboard page that polls the FastAPI backend's /train/status endpoint and displays real-time training metrics (loss curves, VRAM usage, tokens/sec) using chart components — providing visibility into QLoRA fine-tuning progress.",
        },
        {
          feature: "Scraper Configuration UI",
          description:
            "A form-based interface for configuring and launching scraping jobs — target URLs, CSS selectors, depth limits, rate limiting — with form validation via Zod and real-time job status updates.",
        },
        {
          feature: "Generated HTML Preview & Editor",
          description:
            "An embedded HTML preview pane that renders generated HTML in a sandboxed iframe, alongside a code editor (Monaco) showing the raw HTML/CSS source. Users can edit the generated code and see live preview updates.",
        },
      ],
      coreConceptsMarkdown: `### App Router Structure

\`\`\`
frontend/
├── app/
│   ├── layout.tsx          # Root layout with navigation
│   ├── page.tsx            # Home / playground page
│   ├── gallery/
│   │   └── page.tsx        # Component gallery
│   ├── training/
│   │   └── page.tsx        # Training dashboard
│   └── api/
│       └── proxy/
│           └── route.ts    # Proxy to FastAPI backend
├── components/
│   ├── playground/
│   │   ├── dual-view.tsx   # Side-by-side generation
│   │   └── html-preview.tsx
│   ├── gallery/
│   │   └── component-card.tsx
│   └── ui/                 # shadcn/ui components
└── lib/
    ├── api.ts              # FastAPI client
    └── store.ts            # Zustand state
\`\`\`

### Streaming Generation Display

\`\`\`tsx
"use client";

import { useState } from "react";

export const PlaygroundView = () => {
  const [html, setHtml] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generate = async (description: string) => {
    setIsGenerating(true);
    setHtml("");

    const response = await fetch("/api/proxy/generate/stream", {
      method: "POST",
      body: JSON.stringify({ description }),
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    while (reader) {
      const { done, value } = await reader.read();
      if (done) break;
      setHtml((prev) => prev + decoder.decode(value));
    }

    setIsGenerating(false);
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <CodeEditor value={html} />
      <HtmlPreview html={html} />
    </div>
  );
};
\`\`\`

### API Client

\`\`\`typescript
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export const api = {
  generate: (description: string) =>
    fetch(\`\${API_BASE}/generate\`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description }),
    }),

  searchComponents: (query: string) =>
    fetch(\`\${API_BASE}/components/search?q=\${encodeURIComponent(query)}\`)
      .then((r) => r.json()),

  getTrainingStatus: () =>
    fetch(\`\${API_BASE}/train/status\`).then((r) => r.json()),
};
\`\`\``,
      prosAndCons: {
        pros: [
          "App Router with layouts, loading states, and error boundaries",
          "Server Components reduce client-side JavaScript",
          "TypeScript strict mode catches bugs at compile time",
          "Excellent developer experience (fast refresh, great error messages)",
          "Vercel deployment is one-click (though we self-host)",
          "Rich ecosystem — shadcn/ui, Tailwind, Zustand integrate seamlessly",
        ],
        cons: [
          "App Router has a steep learning curve (Server vs Client Components)",
          "Bundle size can grow large without careful code splitting",
          "Server Components add mental overhead for simple apps",
          "Vercel-centric features (Edge Runtime, ISR) don't work well self-hosted",
          "Frequent breaking changes between major versions",
        ],
      },
      alternatives: [
        {
          name: "Vite + React",
          comparison:
            "Lighter, faster build tool with no opinions on SSR/routing. Better for pure SPAs, but lacks Next.js's file-based routing, SSR, and full-stack features.",
        },
        {
          name: "Remix",
          comparison:
            "Web-standards focused React framework with nested routing and progressive enhancement. Better data loading patterns but smaller ecosystem than Next.js.",
        },
        {
          name: "SvelteKit",
          comparison:
            "Svelte's full-stack framework. Smaller bundle sizes and simpler mental model, but much smaller ecosystem and component library availability.",
        },
      ],
      keyAPIs: [
        "app/ directory — file-based routing",
        "'use client' directive — mark Client Components",
        "fetch() — data fetching with caching",
        "loading.tsx — streaming loading states",
        "error.tsx — error boundaries per route",
        "middleware.ts — request interception",
        "next/image — optimized image component",
      ],
      academicFoundations: `**Server-Side Rendering (SSR):** Next.js implements SSR by rendering React components on the server and sending HTML to the client. This improves First Contentful Paint (FCP) and SEO. The hydration step then makes the HTML interactive by attaching React event handlers.

**React Server Components (RSC):** A paradigm shift where components can run exclusively on the server, sending only their rendered output (not JavaScript) to the client. This reduces bundle size and enables direct database/API access from components. Based on the React team's research into zero-bundle-size components.

**Streaming SSR (React 18):** Next.js App Router uses React 18's streaming SSR with Suspense, sending HTML in chunks as components resolve. This enables progressive rendering — the user sees content before the entire page is ready.

**File-Based Routing:** Next.js's routing maps filesystem paths to URL paths, a convention popularized by PHP and later adopted by frameworks like Nuxt.js and SvelteKit. This eliminates route configuration boilerplate.`,
      furtherReading: [
        "Next.js documentation — nextjs.org/docs",
        "React Server Components RFC — github.com/reactjs/rfcs",
        "Vercel's architecture blog — vercel.com/blog",
        "Patterns.dev — patterns for modern web apps",
      ],
    },
    {
      name: "BeautifulSoup",
      category: "library",
      icon: "BS",
      tagline: "HTML/XML parsing and extraction library",
      origin: {
        creator: "Leonard Richardson",
        year: 2004,
        motivation:
          "Parsing real-world HTML is messy — malformed tags, missing closing elements, inconsistent encoding. BeautifulSoup was designed to handle the 'tag soup' of the real web, creating a navigable parse tree from even the most broken HTML.",
      },
      whatItIs: `BeautifulSoup is a Python library for parsing HTML and XML documents:
- **Tolerant parsing:** Handles malformed, broken, and inconsistent HTML
- **Multiple parsers:** html.parser (stdlib), lxml (fast), html5lib (most tolerant)
- **CSS selectors:** Find elements with CSS selector syntax
- **Tree navigation:** Parent, children, siblings, descendants traversal
- **Encoding detection:** Automatic encoding detection and conversion
- **Tag manipulation:** Modify, extract, and reconstruct HTML trees`,
      explainLikeImTen: `When you look at a website, you see nice buttons, text, and pictures. But underneath, it's all just code called HTML — a bunch of tags like <button> and <div>. BeautifulSoup is like a pair of special glasses that lets our program read and understand all that code. It can find specific pieces (like "find me all the login forms") and pull them out neatly, even when the code is messy and has mistakes in it. It's basically a treasure hunter that digs through website code to find exactly the pieces we need.`,
      realWorldAnalogy: `BeautifulSoup is like a skilled archaeologist at a dig site. The dig site (raw HTML) is messy — things are broken, out of place, and mixed together. The archaeologist (BeautifulSoup) carefully sifts through the mess, identifies each artifact (HTML element), catalogs it by type (tag, class, id), and can extract specific items ("find me all the pottery fragments") even when they're buried in debris and partially damaged.`,
      whyWeUsedIt: `After Playwright captures raw HTML from banking sites, BeautifulSoup handles the parsing:
- Cleans malformed HTML from enterprise sites (often generated by Java frameworks)
- Extracts specific UI components by CSS selector or tag structure
- Removes script tags, tracking pixels, and irrelevant elements
- Normalizes HTML structure for consistent training data
- Faster than Playwright's page.evaluate() for batch HTML processing`,
      howItWorksInProject: `- Playwright captures raw page HTML via page.content()
- BeautifulSoup parses the raw HTML with lxml parser (fast + tolerant)
- Component extraction: isolate forms, tables, navbars, cards by selector
- HTML cleaning: strip scripts, inline styles, tracking elements
- Structure normalization: consistent indentation, attribute ordering
- Output clean HTML snippets paired with descriptions for fine-tuning data`,
      featuresInProject: [
        {
          feature: "HTML Component Isolation",
          description:
            "BeautifulSoup's CSS selector API extracts individual UI components (forms, tables, navigation bars, cards) from full-page HTML dumps, isolating each component into a self-contained HTML snippet suitable for training data.",
        },
        {
          feature: "Script and Tracker Removal",
          description:
            "A cleaning pipeline uses BeautifulSoup to strip all <script>, <noscript>, tracking pixels, analytics tags, and inline event handlers from scraped HTML, producing clean structural HTML for the fine-tuning dataset.",
        },
        {
          feature: "HTML Normalization",
          description:
            "BeautifulSoup's prettify() and custom tree manipulation normalize inconsistent HTML from different banking sites — fixing unclosed tags, standardizing attribute ordering, and producing consistent indentation for training data uniformity.",
        },
        {
          feature: "Metadata Extraction",
          description:
            "BeautifulSoup extracts metadata from scraped pages — page titles, form labels, aria attributes, heading hierarchy — which becomes the natural language description paired with each HTML snippet in the training dataset.",
        },
        {
          feature: "CSS Class Analysis",
          description:
            "BeautifulSoup traverses the parse tree to catalog all CSS classes used across scraped components, enabling analysis of design system patterns (Bootstrap, Tailwind, custom frameworks) used by different banking sites.",
        },
      ],
      coreConceptsMarkdown: `### Parsing and Extracting

\`\`\`python
from bs4 import BeautifulSoup

# Parse HTML (lxml parser for speed)
html = """
<div class="dashboard">
  <form class="login-form" action="/auth">
    <input type="email" name="email" placeholder="Email">
    <input type="password" name="pass">
    <button type="submit">Login</button>
  </form>
  <script>trackUser();</script>
</div>
"""

soup = BeautifulSoup(html, "lxml")

# CSS selector
form = soup.select_one(".login-form")

# Remove scripts
for script in soup.find_all("script"):
    script.decompose()

# Extract clean HTML
clean_html = soup.prettify()
\`\`\`

### Component Extraction Pipeline

\`\`\`python
def extract_components(raw_html: str) -> list[dict]:
    soup = BeautifulSoup(raw_html, "lxml")
    components = []

    # Extract forms
    for form in soup.find_all("form"):
        components.append({
            "type": "form",
            "html": str(form),
            "labels": [label.text for label in form.find_all("label")],
            "inputs": len(form.find_all("input")),
        })

    # Extract tables
    for table in soup.find_all("table"):
        headers = [th.text for th in table.find_all("th")]
        components.append({
            "type": "table",
            "html": str(table),
            "headers": headers,
            "rows": len(table.find_all("tr")) - 1,
        })

    # Extract navigation
    for nav in soup.find_all("nav"):
        links = [a.text for a in nav.find_all("a")]
        components.append({
            "type": "navigation",
            "html": str(nav),
            "links": links,
        })

    return components
\`\`\`

### BeautifulSoup vs lxml Direct

| Feature | BeautifulSoup | lxml |
|---------|--------------|------|
| API | Pythonic, simple | Lower-level, XPath-based |
| Speed | Moderate (uses lxml internally) | Fast (C-based) |
| Tolerance | Very high (handles broken HTML) | Moderate |
| Learning curve | Low | Medium |
| Use case | Scraping, data extraction | Performance-critical XML/HTML |`,
      prosAndCons: {
        pros: [
          "Handles broken, malformed HTML gracefully",
          "Simple, Pythonic API — intuitive for beginners",
          "CSS selector support for familiar element targeting",
          "Multiple parser backends (html.parser, lxml, html5lib)",
          "Battle-tested — 20+ years of production use",
          "Excellent for one-off scraping and data extraction",
        ],
        cons: [
          "Slower than lxml for large documents",
          "No JavaScript execution — can't handle dynamic content alone",
          "Memory-intensive for very large HTML documents",
          "Not suitable for HTML generation or templating",
          "API can be verbose for complex tree manipulations",
        ],
      },
      alternatives: [
        {
          name: "lxml",
          comparison:
            "C-based XML/HTML parser. Faster than BeautifulSoup for large documents and supports XPath queries. But less tolerant of broken HTML and steeper learning curve.",
        },
        {
          name: "selectolax",
          comparison:
            "Cython-based HTML parser using the Modest engine. 10-20x faster than BeautifulSoup for parsing. Smaller API surface but excellent for performance-critical scraping.",
        },
        {
          name: "Parsel (Scrapy)",
          comparison:
            "Scrapy's selector library combining CSS selectors and XPath. Tighter integration with Scrapy framework but usable standalone. Similar functionality to BeautifulSoup.",
        },
      ],
      keyAPIs: [
        "BeautifulSoup(html, parser) — parse HTML string",
        "soup.find(tag, attrs) — find first matching element",
        "soup.find_all(tag, attrs) — find all matching elements",
        "soup.select(css_selector) — CSS selector query",
        "element.decompose() — remove element from tree",
        "element.get_text() — extract text content",
        "soup.prettify() — format HTML with indentation",
      ],
      academicFoundations: `**HTML Parsing Theory:** HTML parsing is formally defined by the WHATWG HTML Living Standard's parsing algorithm — a state machine with ~80 states that handles tag soup, implicit element creation, and error recovery. BeautifulSoup delegates to parsers (lxml, html5lib) that implement variations of this algorithm.

**Tag Soup and Error Recovery:** The term "tag soup" refers to malformed HTML that doesn't conform to any specification. Real-world web pages are overwhelmingly tag soup — missing closing tags, overlapping elements, invalid nesting. BeautifulSoup's core value is making sense of this mess.

**DOM (Document Object Model):** BeautifulSoup creates an in-memory tree representation similar to the browser's DOM. The W3C DOM specification (1998) defines the standard tree structure for HTML/XML documents, which BeautifulSoup approximates with its NavigableString and Tag classes.

**Web Scraping as Information Extraction:** Academic information extraction research (IE) studies how to extract structured data from unstructured sources. Web scraping is a practical application of IE, where HTML structure provides semi-structured cues for extraction.`,
      furtherReading: [
        "BeautifulSoup documentation — crummy.com/software/BeautifulSoup/bs4/doc",
        "WHATWG HTML parsing specification — html.spec.whatwg.org/multipage/parsing.html",
        "Web Scraping with Python by Ryan Mitchell (O'Reilly)",
      ],
    },
    {
      name: "Docker",
      category: "infrastructure",
      icon: "DK",
      tagline: "Multi-service containerization with GPU passthrough",
      origin: {
        creator: "Solomon Hykes / Docker Inc.",
        year: 2013,
        motivation:
          "Deploying applications across different environments (development, staging, production) was fragile — 'works on my machine' was the universal developer excuse. Docker standardized application packaging using Linux containers, making deployments reproducible and environment-independent.",
      },
      whatItIs: `Docker is a containerization platform for packaging and running applications:
- **Containers:** Lightweight, isolated environments sharing the host kernel
- **Images:** Immutable, layered filesystem snapshots
- **Dockerfile:** Declarative build instructions
- **Docker Compose:** Multi-container application orchestration
- **Volumes:** Persistent data storage across container restarts
- **Networking:** Container-to-container communication via virtual networks
- **GPU passthrough:** NVIDIA Container Toolkit for GPU access in containers`,
      explainLikeImTen: `Imagine you're building something with LEGOs, and you want to share your creation with a friend. Instead of telling them "get these 200 specific pieces and follow these complicated instructions," you just put the whole thing in a special box that includes everything — the LEGO pieces, the baseplate, even a tiny instruction booklet. Your friend opens the box and the creation just works. Docker is that special box for software. It packages up our program with everything it needs so it works the same way on any computer.`,
      realWorldAnalogy: `Docker is like a shipping container in global trade. Before shipping containers, loading a ship was chaos — different sized boxes, barrels, and crates, each requiring special handling. Shipping containers standardized everything into one format that fits on any ship, truck, or train. Docker does the same for software — your application, its dependencies, and its configuration are packed into a standard container that runs identically on any machine, whether it's your laptop or a cloud server.`,
      whyWeUsedIt: `The Enterprise Playground has multiple services that need to work together:
- FastAPI backend (Python 3.11 + ML dependencies)
- Ollama (GPU-accelerated LLM inference)
- ChromaDB server (vector database)
- Next.js frontend (Node.js 20)
- Prometheus + Grafana (monitoring)
Docker Compose orchestrates all of these, and the NVIDIA Container Toolkit enables GPU passthrough for Ollama and fine-tuning jobs.`,
      howItWorksInProject: `- docker-compose.yml defines all services (API, Ollama, ChromaDB, frontend, monitoring)
- NVIDIA Container Toolkit enables RTX 4090 access from containers
- Multi-stage Dockerfiles for optimized image sizes
- Named volumes for persistent data (ChromaDB data, scraped assets, model weights)
- Internal Docker network for service-to-service communication
- GPU resource reservation ensures Ollama and training jobs get dedicated VRAM`,
      featuresInProject: [
        {
          feature: "Multi-Service Orchestration",
          description:
            "Docker Compose defines and manages all services (FastAPI, Ollama, ChromaDB, Next.js frontend, Prometheus, Grafana) with a single 'docker compose up' command, eliminating complex manual setup of six+ interconnected services.",
        },
        {
          feature: "GPU Passthrough for LLM Inference",
          description:
            "The NVIDIA Container Toolkit passes the RTX 4090 GPU into the Ollama and fine-tuning containers, enabling GPU-accelerated inference and training inside Docker without performance loss compared to bare-metal execution.",
        },
        {
          feature: "Reproducible Development Environment",
          description:
            "Dockerfiles pin exact versions of Python, Node.js, CUDA, and all dependencies, ensuring every developer and deployment gets identical environments — eliminating 'works on my machine' issues with complex ML toolchains.",
        },
        {
          feature: "Persistent Volume Management",
          description:
            "Named Docker volumes persist ChromaDB vector data, scraped HTML assets, Ollama model weights, and QLoRA adapter checkpoints across container restarts, preventing data loss during development cycles.",
        },
        {
          feature: "Internal Service Networking",
          description:
            "Docker's internal network enables services to communicate via hostname (e.g., the FastAPI backend reaches Ollama at 'http://ollama:11434' and ChromaDB at 'http://chromadb:8000') without exposing ports to the host machine.",
        },
      ],
      coreConceptsMarkdown: `### Docker Compose for Enterprise Playground

\`\`\`yaml
# docker-compose.yml
version: "3.8"

services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - OLLAMA_HOST=http://ollama:11434
      - CHROMA_HOST=http://chromadb:8000
    depends_on:
      - ollama
      - chromadb
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]

  ollama:
    image: ollama/ollama:latest
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]

  chromadb:
    image: chromadb/chroma:latest
    ports:
      - "8001:8000"
    volumes:
      - chroma_data:/chroma/chroma

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000

  prometheus:
    image: prom/prometheus:latest
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    depends_on:
      - prometheus

volumes:
  ollama_data:
  chroma_data:
\`\`\`

### Multi-Stage Dockerfile

\`\`\`dockerfile
# Stage 1: Build dependencies
FROM python:3.11-slim AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Stage 2: Runtime
FROM python:3.11-slim AS runtime
WORKDIR /app
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY . .
EXPOSE 8000
CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000"]
\`\`\`

### GPU Passthrough Setup

\`\`\`bash
# Install NVIDIA Container Toolkit
distribution=$(. /etc/os-release; echo $ID$VERSION_ID)
curl -s -L https://nvidia.github.io/libnvidia-container/gpgkey | sudo apt-key add -
curl -s -L https://nvidia.github.io/libnvidia-container/$distribution/libnvidia-container.list | \\
  sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list

sudo apt-get update && sudo apt-get install -y nvidia-container-toolkit
sudo nvidia-ctk runtime configure --runtime=docker
sudo systemctl restart docker

# Verify GPU access
docker run --rm --gpus all nvidia/cuda:12.2-base nvidia-smi
\`\`\``,
      prosAndCons: {
        pros: [
          "Reproducible environments — identical builds everywhere",
          "Multi-service orchestration with Docker Compose",
          "GPU passthrough via NVIDIA Container Toolkit",
          "Layer caching speeds up rebuilds",
          "Isolation between services prevents dependency conflicts",
          "Industry standard — extensive tooling and documentation",
        ],
        cons: [
          "GPU passthrough requires NVIDIA Container Toolkit setup",
          "Docker Desktop licensing for commercial use",
          "Image sizes can be large with ML dependencies (5GB+ for CUDA)",
          "Networking complexity for multi-service debugging",
          "Filesystem performance overhead on macOS/Windows (WSL2 helps)",
          "Security — containers share the host kernel",
        ],
      },
      alternatives: [
        {
          name: "Podman",
          comparison:
            "Daemonless, rootless container engine compatible with Docker CLI. Better security model but less ecosystem support and GPU passthrough is less mature.",
        },
        {
          name: "Kubernetes",
          comparison:
            "Container orchestration at scale — service discovery, auto-scaling, rolling deployments. Overkill for a single-machine setup but necessary for production multi-node deployments.",
        },
        {
          name: "Nix / devenv",
          comparison:
            "Reproducible development environments without containers. Better for development but doesn't solve deployment packaging. No GPU passthrough equivalent.",
        },
        {
          name: "Bare Metal",
          comparison:
            "Run everything directly on the host. Best performance (no container overhead) but fragile — dependency conflicts, no isolation, hard to reproduce.",
        },
      ],
      keyAPIs: [
        "docker build — build image from Dockerfile",
        "docker compose up — start all services",
        "docker compose down — stop and remove containers",
        "docker volume — manage persistent storage",
        "docker network — manage container networking",
        "docker exec — run commands in running container",
        "--gpus all — enable GPU passthrough",
      ],
      academicFoundations: `**OS-Level Virtualization:** Docker containers use Linux kernel features — namespaces (process isolation), cgroups (resource limits), and overlay filesystems (layered images). Unlike VMs, containers share the host kernel, providing near-native performance with process-level isolation.

**Immutable Infrastructure (Fowler, 2012):** Docker embodies the immutable infrastructure pattern — instead of updating running servers (mutable), you build new images and replace containers. This eliminates configuration drift and ensures reproducibility.

**Union Filesystems:** Docker images use a union filesystem (OverlayFS) where each Dockerfile instruction creates a new layer. Layers are shared between images, and only changed layers are rebuilt. This is analogous to copy-on-write (COW) mechanisms in operating systems.

**GPU Virtualization:** The NVIDIA Container Toolkit creates a bridge between the host's GPU driver and containerized CUDA applications. It intercepts CUDA calls inside the container and forwards them to the host's GPU driver, providing near-native GPU performance. This builds on the GPU passthrough techniques originally developed for VM-based GPU sharing.`,
      furtherReading: [
        "Docker documentation — docs.docker.com",
        "NVIDIA Container Toolkit — docs.nvidia.com/datacenter/cloud-native",
        "Docker Deep Dive by Nigel Poulton",
        "The Twelve-Factor App — 12factor.net",
      ],
    },
  ],
};
