import type { Project } from "../types";

export const ragEvalEngine: Project = {
  id: "rag-eval-engine",
  name: "RAG Eval Engine",
  description:
    "Production-grade RAG system with built-in evaluation harness — hybrid retrieval, multi-model LLM support, and continuous quality metrics.",
  repo: "https://github.com/aptsalt/rag-eval-engine",
  languages: ["Python", "TypeScript", "SQL"],
  designPatterns: [
    {
      name: "Pipeline Pattern",
      category: "architectural",
      whatItIs:
        "A chain of processing stages where the output of one stage becomes the input of the next. Each stage performs a single transformation, and the overall pipeline composes complex behavior from simple steps.",
      howProjectUsesIt:
        "The RAG system implements a six-stage pipeline: ingest -> chunk -> embed -> index -> retrieve -> generate. Documents flow through each stage sequentially, with each stage transforming the data for the next.",
      codeExample: `# Simplified pipeline flow
async def rag_pipeline(document: UploadFile) -> None:
    raw_text = await extract_text(document)      # Stage 1: Ingest
    chunks = chunk_text(raw_text, size=512)       # Stage 2: Chunk
    embeddings = await embed_chunks(chunks)       # Stage 3: Embed
    await store_in_qdrant(chunks, embeddings)     # Stage 4: Index
    await build_bm25_index(chunks)                # Stage 4b: Index (BM25)

async def query_pipeline(question: str) -> str:
    results = await hybrid_retrieve(question)     # Stage 5: Retrieve
    answer = await generate_answer(question, results)  # Stage 6: Generate
    return answer`,
    },
    {
      name: "Strategy Pattern",
      category: "behavioral",
      whatItIs:
        "Defines a family of algorithms, encapsulates each one, and makes them interchangeable. The strategy pattern lets the algorithm vary independently from the clients that use it.",
      howProjectUsesIt:
        "The retrieval system supports three interchangeable strategies: BM25 keyword search, vector similarity search, and hybrid (combining both via Reciprocal Rank Fusion). The strategy is selected per-query without changing the pipeline code.",
      codeExample: `class Retriever(Protocol):
    async def retrieve(self, query: str, top_k: int) -> list[Document]: ...

class BM25Retriever(Retriever): ...
class VectorRetriever(Retriever): ...
class HybridRetriever(Retriever):
    """Combines BM25 + Vector via Reciprocal Rank Fusion."""
    ...

# Strategy selected at runtime
retriever = get_retriever(strategy=request.strategy)  # "bm25" | "vector" | "hybrid"
results = await retriever.retrieve(query, top_k=5)`,
    },
    {
      name: "Template Method",
      category: "behavioral",
      whatItIs:
        "Defines the skeleton of an algorithm in a base class, letting subclasses override specific steps without changing the algorithm's structure.",
      howProjectUsesIt:
        "The evaluation harness defines a fixed evaluation loop (load dataset -> run queries -> compute metrics -> aggregate results) but allows pluggable metric implementations (faithfulness, relevance, recall) that can be swapped or extended.",
      codeExample: `class EvaluationHarness:
    def run(self, dataset: TestDataset) -> EvalReport:
        results = []
        for item in dataset:
            response = self.pipeline.query(item.question)
            scores = {m.name: m.compute(item, response) for m in self.metrics}
            results.append(scores)
        return self.aggregate(results)

# Pluggable metrics
harness = EvaluationHarness(
    metrics=[FaithfulnessMetric(), RelevanceMetric(), RecallMetric()]
)`,
    },
    {
      name: "Repository Pattern",
      category: "structural",
      whatItIs:
        "Mediates between the domain layer and data mapping layer, acting as an in-memory collection of domain objects. It abstracts the underlying data storage mechanism.",
      howProjectUsesIt:
        "The document store is abstracted behind a repository interface, allowing the system to swap between Qdrant, in-memory stores (for testing), or other vector databases without changing business logic.",
    },
    {
      name: "Factory Pattern",
      category: "creational",
      whatItIs:
        "Provides an interface for creating objects without specifying their exact class. The factory method lets a class defer instantiation to subclasses or configuration.",
      howProjectUsesIt:
        "LLM providers (Ollama, OpenAI) are instantiated via a factory that reads configuration and returns the correct client. Switching between local Ollama and cloud OpenAI requires only a config change, not code changes.",
      codeExample: `def create_llm_client(config: LLMConfig) -> LLMClient:
    match config.provider:
        case "ollama":
            return OllamaClient(base_url=config.base_url, model=config.model)
        case "openai":
            return OpenAIClient(api_key=config.api_key, model=config.model)
        case _:
            raise ValueError(f"Unknown provider: {config.provider}")`,
    },
    {
      name: "Observer Pattern",
      category: "behavioral",
      whatItIs:
        "Defines a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically.",
      howProjectUsesIt:
        "Quality metric callbacks observe the RAG pipeline execution. When a query completes, registered observers (metric collectors, loggers, dashboard updaters) are notified with the query results and evaluation scores.",
    },
  ],
  keyTakeaways: [
    "RAG quality depends more on retrieval quality than generation quality — garbage in, garbage out.",
    "Hybrid retrieval (BM25 + vector) consistently outperforms either method alone by 15-25%.",
    "Evaluation must be continuous — RAG quality degrades as the document corpus changes.",
    "Chunking strategy is the most underrated factor in RAG quality — overlap, size, and boundary detection all matter.",
    "Embedding model choice matters: domain-specific models outperform general models for specialized corpora.",
  ],
  coreConcepts: [
    {
      name: "Retrieval-Augmented Generation (RAG)",
      slug: "rag",
      whatItIs:
        "Retrieval-Augmented Generation combines a retrieval system with a generative LLM. Instead of relying solely on the LLM's training data, RAG fetches relevant documents from a knowledge base and includes them in the prompt context.",
      whyItMatters:
        "LLMs have knowledge cutoffs and hallucinate facts. RAG grounds generation in actual source documents, dramatically improving factual accuracy and enabling answers over private or recent data that the LLM was never trained on.",
      howProjectUsesIt:
        "The entire system IS a RAG pipeline. Documents are ingested, chunked, and indexed. At query time, relevant chunks are retrieved via hybrid search and injected into the LLM prompt as context for answer generation.",
      keyTerms: [
        { term: "Context Window", definition: "The maximum number of tokens an LLM can process in a single request. Retrieved chunks must fit within this window alongside the query and system prompt." },
        { term: "Grounding", definition: "The practice of constraining LLM output to information present in the provided context, reducing hallucination." },
        { term: "Knowledge Base", definition: "The indexed collection of documents that the retrieval system searches over. In this project, it is stored in Qdrant (vectors) and a BM25 index (keywords)." },
      ],
    },
    {
      name: "Evaluation and Benchmarking",
      slug: "evaluation-benchmarking",
      whatItIs:
        "Systematic measurement of RAG system quality across multiple dimensions (faithfulness, relevance, completeness). Without evaluation, RAG quality degrades silently as documents change.",
      whyItMatters:
        "RAG systems have many moving parts (chunking, embedding, retrieval, generation) and quality can regress without warning. Continuous evaluation catches degradation early and enables data-driven tuning of each component.",
      howProjectUsesIt:
        "The evaluation harness runs curated test datasets through the full RAG pipeline, scoring each response on faithfulness, answer relevance, context relevance, and context recall. Results are tracked over time to detect regressions.",
      keyTerms: [
        { term: "Faithfulness", definition: "Whether the generated answer only contains information from the retrieved context. Low faithfulness indicates hallucination." },
        { term: "Answer Relevance", definition: "Whether the generated answer actually addresses the user's question. Measured using LLM-as-judge evaluation." },
        { term: "Context Recall", definition: "Whether the retrieval system found all the necessary information to answer the question. Compared against ground truth answers." },
        { term: "LLM-as-Judge", definition: "Using a language model to evaluate the quality of another model's output, replacing expensive human evaluation with scalable automated scoring." },
      ],
    },
    {
      name: "Hybrid Retrieval",
      slug: "hybrid-retrieval",
      whatItIs:
        "Combining multiple search strategies (vector similarity + BM25 keyword matching) to get better results than either alone. Uses Reciprocal Rank Fusion to merge ranked results.",
      whyItMatters:
        "Vector search excels at semantic similarity but misses exact keywords. BM25 catches exact terms but misses semantic matches. Hybrid retrieval combines both strengths, consistently improving recall by 15-25% over either method alone.",
      howProjectUsesIt:
        "Every query runs through both Qdrant (vector search) and the BM25 index (keyword search) in parallel. Results are merged using Reciprocal Rank Fusion (RRF), where each result's fused score is 1/(rank_vector + k) + 1/(rank_bm25 + k).",
      keyTerms: [
        { term: "Reciprocal Rank Fusion (RRF)", definition: "A rank aggregation method that combines multiple ranked lists by summing reciprocal ranks. Score = sum of 1/(rank + k) across all lists. Works without score normalization." },
        { term: "Semantic Search", definition: "Finding results based on meaning rather than exact keywords. Uses vector embeddings to compute similarity between query and documents." },
        { term: "Lexical Search", definition: "Finding results based on exact keyword matches. BM25 is the standard lexical search algorithm used in most search engines." },
      ],
    },
    {
      name: "Vector Embeddings",
      slug: "vector-embeddings",
      whatItIs:
        "Dense numerical representations of text that capture semantic meaning. Similar concepts have similar vectors, enabling \"meaning-based\" search rather than keyword matching.",
      whyItMatters:
        "Embeddings bridge the gap between human language and machine computation. They enable finding relevant content even when the query and document use completely different words but share the same meaning.",
      howProjectUsesIt:
        "Sentence-transformers generates 384-dimensional embeddings for every document chunk and query. These embeddings are stored in Qdrant and compared using cosine similarity during retrieval.",
      keyTerms: [
        { term: "Cosine Similarity", definition: "Measures the angle between two vectors. Values range from -1 (opposite) to 1 (identical direction). The standard similarity metric for text embeddings." },
        { term: "Embedding Model", definition: "A neural network trained to produce vector representations of text. Common models include all-MiniLM-L6-v2 (fast, 384 dims) and all-mpnet-base-v2 (accurate, 768 dims)." },
        { term: "Vector Space", definition: "The high-dimensional mathematical space where embeddings live. Semantically similar texts cluster together in this space." },
        { term: "Dimensionality", definition: "The number of values in each embedding vector (e.g., 384 or 768). Higher dimensions can capture more nuance but require more storage and compute." },
      ],
    },
    {
      name: "Chunking",
      slug: "chunking",
      whatItIs:
        "The process of splitting documents into smaller pieces for embedding and retrieval. Chunk size, overlap, and boundary detection critically affect retrieval quality.",
      whyItMatters:
        "Embedding models have limited context windows (typically 256-512 tokens). Documents must be split into chunks that are small enough to embed but large enough to contain meaningful, self-contained information.",
      howProjectUsesIt:
        "Documents are split into overlapping chunks with configurable size (default 512 tokens) and overlap (default 50 tokens). The chunker respects sentence boundaries to avoid cutting mid-sentence, preserving semantic coherence.",
      keyTerms: [
        { term: "Chunk Size", definition: "The target number of tokens per chunk. Smaller chunks are more precise but may lack context. Larger chunks capture more context but may dilute relevance." },
        { term: "Chunk Overlap", definition: "The number of tokens shared between consecutive chunks. Overlap prevents information at chunk boundaries from being lost during retrieval." },
        { term: "Sentence Boundary Detection", definition: "Splitting chunks at natural sentence boundaries rather than arbitrary token counts, ensuring each chunk contains complete thoughts." },
      ],
    },
  ],
  videoResources: [
    {
      title: "But what is a GPT? Visual intro to transformers",
      url: "https://www.youtube.com/watch?v=wjZofJX0v4M",
      channel: "3Blue1Brown",
      durationMinutes: 27,
      relevance:
        "Foundational understanding of how LLMs work, which powers the generation side of RAG",
    },
    {
      title: "Vector Search RAG Tutorial",
      url: "https://www.youtube.com/watch?v=JEBDfGqrAUA",
      channel: "Fireship",
      durationMinutes: 10,
      relevance:
        "Quick practical overview of building RAG with vector databases",
    },
    {
      title: "Building Production RAG Applications",
      url: "https://www.youtube.com/watch?v=TRjq7t2Ms5I",
      channel: "Sam Witteveen",
      durationMinutes: 45,
      relevance:
        "Deep dive into production RAG architecture patterns",
    },
    {
      title: "Evaluation Metrics for RAG",
      url: "https://www.youtube.com/watch?v=OL1oTgLnIaM",
      channel: "Weights & Biases",
      durationMinutes: 20,
      relevance:
        "Covers faithfulness, relevance, and recall metrics used in the eval harness",
    },
  ],
  realWorldExamples: [
    {
      company: "Google",
      product: "Google Search (SGE)",
      description:
        "Google's Search Generative Experience retrieves web pages and synthesizes answers using an LLM, the same RAG pattern at massive scale.",
      conceptConnection:
        "Uses same hybrid retrieval + generation pattern",
    },
    {
      company: "Perplexity",
      product: "Perplexity AI",
      description:
        "AI-powered search engine that retrieves web sources and generates cited answers. Production RAG at scale with real-time retrieval.",
      conceptConnection:
        "Production RAG with citation and source attribution",
    },
    {
      company: "GitHub",
      product: "GitHub Copilot",
      description:
        "Copilot uses RAG to retrieve relevant code from the current repository and uses it as context for code generation suggestions.",
      conceptConnection:
        "RAG applied to code generation domain",
    },
    {
      company: "Notion",
      product: "Notion AI Q&A",
      description:
        "Notion's AI Q&A feature retrieves relevant workspace documents and generates answers grounded in your team's knowledge base.",
      conceptConnection:
        "Enterprise RAG over private document corpus",
    },
  ],
  cicd: {
    overview:
      "Automated pipeline covering linting, type checking, testing, containerization, and continuous RAG quality evaluation. Every change is validated for code quality and RAG performance before merge.",
    stages: [
      {
        name: "Linting",
        tool: "Ruff",
        description:
          "Fast Python linting and formatting that replaces Black, isort, and flake8 in a single tool. Enforces consistent code style and catches common errors.",
        commands: ["ruff check .", "ruff format ."],
      },
      {
        name: "Type Checking",
        tool: "Pyright",
        description:
          "Static type analysis in strict mode. Validates all type hints, catches type errors before runtime, and ensures type-safe configuration across the codebase.",
        commands: ["pyright --project pyrightconfig.json"],
      },
      {
        name: "Testing",
        tool: "Pytest",
        description:
          "Unit and integration tests with pytest-asyncio for async test support. Covers retrieval logic, evaluation metrics, and API endpoint behavior.",
        commands: ["pytest tests/ -v --asyncio-mode=auto"],
      },
      {
        name: "Containerization",
        tool: "Docker Compose",
        description:
          "Multi-service docker-compose orchestrating FastAPI backend, Qdrant vector DB, and Next.js dashboard. Ensures consistent deployment across environments.",
        commands: ["docker-compose up --build"],
      },
      {
        name: "Evaluation",
        tool: "Custom Eval Harness",
        description:
          "Automated evaluation harness runs on curated test datasets to track retrieval and generation quality over time. Measures faithfulness, relevance, and recall metrics.",
        commands: ["python -m eval.run --dataset test_suite.json --output reports/"],
      },
    ],
    infrastructure:
      "Docker Compose for local development and CI. Services: FastAPI backend (port 8000), Qdrant vector DB (port 6333), Next.js dashboard (port 3000).",
  },
  architecture: [
    {
      title: "System Overview",
      content: `The RAG Eval Engine is a complete Retrieval-Augmented Generation system with built-in quality evaluation.

**Pipeline:**
1. **Ingestion** — Upload documents (PDF, DOCX, TXT) via API
2. **Chunking** — Split documents into overlapping chunks with configurable size and overlap
3. **Embedding** — Generate vector embeddings using sentence-transformers
4. **Indexing** — Store embeddings in Qdrant vector database with BM25 index in parallel
5. **Retrieval** — Hybrid search combining vector similarity and BM25 keyword matching
6. **Generation** — Send retrieved context + query to LLM (Ollama or OpenAI)
7. **Evaluation** — Score the response on faithfulness, relevance, and completeness`,
      diagram: `Documents → [Chunker] → [Embedder] → Qdrant (vectors)
                                   → BM25 Index (keywords)

Query → [Embedder] → Vector Search  ─┐
     → [Tokenizer] → BM25 Search    ─┤→ [RRF Merge] → Top-K → [LLM] → Response
                                      │
                              [Evaluator] → Metrics`,
    },
    {
      title: "Hybrid Retrieval",
      content: `The system implements three retrieval strategies:

**Vector Search (Semantic):** Converts query to embedding, finds nearest neighbors in Qdrant. Good at finding semantically similar content even with different wording.

**BM25 (Keyword):** Classic information retrieval algorithm. Excellent for exact keyword matches, acronyms, and technical terms.

**Hybrid (Reciprocal Rank Fusion):** Combines vector and BM25 results using RRF scoring. Each result gets a score of 1/(rank + k) from each method, and scores are summed. This consistently outperforms either method alone.`,
    },
    {
      title: "Evaluation Harness",
      content: `Continuous quality evaluation using multiple metrics:

**Faithfulness:** Does the response only contain information from the retrieved context? Measures hallucination.

**Answer Relevance:** Does the response actually answer the question? Uses LLM-as-judge.

**Context Relevance:** Are the retrieved chunks relevant to the question? Measures retrieval quality.

**Context Recall:** Did we retrieve all the necessary information? Compares against ground truth answers.

The evaluation harness runs on curated test datasets and produces quality reports with trends over time.`,
    },
  ],
  technologies: [
    {
      name: "Python",
      category: "language",
      icon: "PY",
      tagline: "The language of AI/ML",
      origin: {
        creator: "Guido van Rossum",
        year: 1991,
        motivation:
          "Van Rossum wanted a language that was easy to read, with clean syntax, and could serve as a 'glue language' between C modules. He named it after Monty Python's Flying Circus.",
      },
      whatItIs: `Python is a high-level, dynamically-typed, interpreted language known for readability and a massive standard library. It dominates AI/ML due to:

- **NumPy/SciPy ecosystem** for numerical computing
- **PyTorch/TensorFlow** for deep learning
- **Hugging Face** for pre-trained models
- **FastAPI/Flask/Django** for web APIs
- **Rich standard library** (asyncio, typing, dataclasses)`,
      explainLikeImTen: `Python is like writing instructions in plain English that a computer can understand. Imagine you want to tell a robot what to do — instead of using complicated codes and symbols, you just write simple sentences like "get the document" or "find the answer." Python is the most popular language for teaching computers to be smart (artificial intelligence) because it has tons of ready-made tools, like a huge LEGO set where someone already built the tricky pieces for you. Almost every AI project in the world starts with Python.`,
      realWorldAnalogy: `Python is like English in the programming world — it's not the fastest or most precise language, but it's the one most people understand and the one with the most books, tools, and translators available. Just as English became the common language of international business, Python became the common language of AI and data science.`,
      whyWeUsedIt: `The RAG system requires heavy ML/NLP processing:
- sentence-transformers for embedding generation
- NLTK for text processing
- PyMuPDF for PDF parsing
- These libraries only exist in Python — the ML ecosystem is Python-first

Python 3.12 was chosen for:
- Performance improvements (10-15% faster than 3.11)
- Better error messages
- Improved typing support (TypeVar, ParamSpec)`,
      howItWorksInProject: `- FastAPI backend with async endpoints
- Pydantic models for request/response validation
- asyncio for concurrent embedding generation and retrieval
- Type hints throughout with Pyright strict mode
- Ruff for linting and formatting`,
      featuresInProject: [
        {
          feature: "Document Ingestion Pipeline",
          description:
            "Python orchestrates the entire ingestion flow — reading uploaded files (PDF, DOCX, TXT) with PyMuPDF and python-docx, chunking text with custom splitting logic, and coordinating embedding generation and storage.",
        },
        {
          feature: "Async Query Processing",
          description:
            "Python's asyncio powers concurrent retrieval — vector search and BM25 search run in parallel using asyncio.gather(), and LLM generation streams tokens asynchronously to the client.",
        },
        {
          feature: "Evaluation Harness Orchestration",
          description:
            "Python runs the evaluation loop: iterating over test datasets, calling the RAG pipeline for each question, computing faithfulness/relevance/recall metrics, and aggregating results into quality reports.",
        },
        {
          feature: "Type-Safe Configuration",
          description:
            "Python type hints with Pyright strict mode ensure all configuration (chunk sizes, model names, retrieval parameters) is validated at development time, catching errors before runtime.",
        },
        {
          feature: "Embedding Batch Processing",
          description:
            "Python manages batch encoding of document chunks using sentence-transformers, splitting large document sets into optimal batch sizes for GPU memory and processing them with progress tracking.",
        },
      ],
      coreConceptsMarkdown: `### Python for ML/AI

Python's dominance in AI/ML comes from:

1. **C Extensions:** NumPy, PyTorch etc. are Python wrappers around optimized C/C++/CUDA code. Python is the "orchestration layer" — you write Python, but heavy computation runs in C.

2. **Interactive Development:** Jupyter notebooks allow iterative experimentation — run a cell, see results, modify, repeat. This matches the experimental nature of ML research.

3. **Dynamic Typing:** ML researchers iterate fast. Dynamic typing removes the friction of declaring types for every variable.

### Async Python (asyncio)

\`\`\`python
import asyncio

async def embed_chunk(chunk: str) -> list[float]:
    """Generate embedding for a text chunk."""
    # Non-blocking I/O — other tasks run while waiting
    response = await httpx.post("/embed", json={"text": chunk})
    return response.json()["embedding"]

async def embed_all(chunks: list[str]) -> list[list[float]]:
    """Embed all chunks concurrently."""
    tasks = [embed_chunk(c) for c in chunks]
    return await asyncio.gather(*tasks)
\`\`\`

### Type Hints (PEP 484+)

\`\`\`python
from typing import TypeVar, Protocol

T = TypeVar("T")

class Retriever(Protocol):
    async def retrieve(self, query: str, top_k: int) -> list[Document]: ...

def create_pipeline(
    retriever: Retriever,
    generator: Generator,
    evaluator: Evaluator | None = None,
) -> Pipeline:
    ...
\`\`\``,
      prosAndCons: {
        pros: [
          "Dominant AI/ML ecosystem — PyTorch, TensorFlow, Hugging Face",
          "Extremely readable syntax — low barrier to entry",
          "Massive standard library and package ecosystem (PyPI)",
          "Strong async support with asyncio",
          "Excellent for prototyping and research",
          "Great community and documentation",
        ],
        cons: [
          "Slow execution (100x slower than C/Rust for CPU-bound tasks)",
          "GIL (Global Interpreter Lock) limits true multi-threading",
          "Dynamic typing leads to runtime errors (mitigated by Pyright/mypy)",
          "Package management is fragmented (pip, conda, poetry, uv)",
          "Deployment is complex (virtual environments, system dependencies)",
          "Memory-intensive compared to systems languages",
        ],
      },
      alternatives: [
        {
          name: "Rust",
          comparison: "Systems language with Python bindings (PyO3). 100x faster but much steeper learning curve. Used for performance-critical ML infrastructure (tokenizers, data loaders).",
        },
        {
          name: "Julia",
          comparison: "Designed for scientific computing with C-like performance. Good for numerical work but tiny ecosystem compared to Python.",
        },
        {
          name: "Go",
          comparison: "Fast, compiled, great for web services. But minimal ML ecosystem — no PyTorch/TensorFlow equivalent.",
        },
      ],
      keyAPIs: [
        "asyncio — asynchronous I/O framework",
        "typing — type hint support",
        "dataclasses — structured data containers",
        "pathlib — object-oriented filesystem paths",
        "collections — specialized container types",
        "functools — higher-order functions",
      ],
      academicFoundations: `**Interpreted Languages:** Python uses a bytecode compiler + virtual machine (CPython). Source code is compiled to .pyc bytecode, which is then interpreted by the Python VM. This is similar to Java's JVM approach.

**Duck Typing:** "If it walks like a duck and quacks like a duck, it's a duck." Python uses structural subtyping — an object's suitability is determined by its methods and properties, not its class hierarchy. This is formalized in Python's Protocol system (PEP 544).

**GIL and Concurrency:** The Global Interpreter Lock is a mutex that protects access to Python objects. It prevents true parallelism for CPU-bound tasks but doesn't affect I/O-bound tasks (where asyncio shines). The GIL is being removed in Python 3.13+ (PEP 703, "free-threaded Python").`,
      furtherReading: [
        "Fluent Python by Luciano Ramalho (O'Reilly)",
        "Python documentation — docs.python.org",
        "Effective Python by Brett Slatkin",
      ],
    },
    {
      name: "FastAPI",
      category: "framework",
      icon: "FA",
      tagline: "Modern Python web framework",
      origin: {
        creator: "Sebastian Ramirez",
        year: 2018,
        motivation:
          "Existing Python web frameworks (Flask, Django) were synchronous and lacked automatic API documentation. FastAPI was built on Starlette (async) and Pydantic (validation) to create a modern, fast, and well-documented API framework.",
      },
      whatItIs: `FastAPI is a modern, high-performance Python web framework built on:
- **Starlette** — async HTTP framework (ASGI)
- **Pydantic** — data validation and serialization
- **OpenAPI** — automatic API documentation (Swagger UI)

It's the fastest Python web framework in benchmarks and provides automatic request validation, serialization, and interactive documentation.`,
      explainLikeImTen: `FastAPI is like a super-organized receptionist for your computer program. When someone sends a message to your program (like "find me an answer"), FastAPI checks that the message makes sense, sends it to the right department, and packages up a nice reply. It automatically creates a guidebook showing everyone how to talk to your program. It's really fast because it can handle lots of messages at the same time without getting confused, like a receptionist with multiple phone lines.`,
      realWorldAnalogy: `FastAPI is like a modern post office with automated sorting machines. Letters (requests) come in, get automatically sorted and validated (is the address real? is the postage correct?), routed to the right department, and replies are sent back — all while handling thousands of letters simultaneously. The post office also publishes a directory of all its services (OpenAPI docs) so everyone knows exactly how to send mail.`,
      whyWeUsedIt: `The RAG backend exposes REST APIs for document upload, querying, and evaluation. FastAPI was chosen because:
- Native async support for concurrent embedding generation and retrieval
- Pydantic integration validates requests and generates typed responses
- Automatic OpenAPI docs make the API self-documenting
- File upload support for document ingestion
- WebSocket support for streaming LLM responses`,
      howItWorksInProject: `- \`src/main.py\` — FastAPI app with CORS, lifespan events
- \`src/routes/\` — API route handlers (ingest, query, evaluate)
- Pydantic models define request/response schemas
- Dependency injection for database sessions and vector store clients
- Background tasks for async document processing`,
      featuresInProject: [
        {
          feature: "Document Upload API",
          description:
            "FastAPI's UploadFile handler accepts PDF, DOCX, and TXT files via multipart form data. The endpoint validates file type and size, then triggers the background ingestion pipeline.",
        },
        {
          feature: "Query Endpoint with Streaming",
          description:
            "The /query POST endpoint accepts a QueryRequest Pydantic model (question, top_k, strategy), runs hybrid retrieval, and streams the LLM response back using FastAPI's StreamingResponse.",
        },
        {
          feature: "Evaluation API",
          description:
            "The /evaluate endpoint triggers evaluation runs on test datasets, returning faithfulness, relevance, and recall scores. Background tasks allow long-running evaluations without blocking.",
        },
        {
          feature: "Dependency Injection for Vector Store",
          description:
            "FastAPI's Depends() system injects the Qdrant client and BM25 index into route handlers, enabling clean separation of concerns and easy testing with mock stores.",
        },
        {
          feature: "Auto-Generated API Documentation",
          description:
            "FastAPI automatically generates OpenAPI (Swagger UI) documentation from route decorators and Pydantic models. The /docs endpoint provides an interactive API explorer for the entire RAG system.",
        },
      ],
      coreConceptsMarkdown: `### ASGI (Asynchronous Server Gateway Interface)

FastAPI runs on ASGI, the async successor to WSGI. ASGI servers (Uvicorn, Hypercorn) handle multiple requests concurrently using Python's asyncio.

\`\`\`python
from fastapi import FastAPI, UploadFile
from pydantic import BaseModel

app = FastAPI()

class QueryRequest(BaseModel):
    question: str
    top_k: int = 5
    strategy: str = "hybrid"

class QueryResponse(BaseModel):
    answer: str
    sources: list[dict]
    confidence: float

@app.post("/query", response_model=QueryResponse)
async def query(request: QueryRequest):
    # Pydantic validates input automatically
    results = await retriever.search(request.question, request.top_k)
    answer = await generator.generate(request.question, results)
    return QueryResponse(answer=answer, sources=results, confidence=0.85)
\`\`\`

### Dependency Injection

\`\`\`python
from fastapi import Depends

async def get_vector_store():
    store = QdrantStore(url="localhost:6333")
    yield store
    await store.close()

@app.post("/query")
async def query(
    request: QueryRequest,
    store: QdrantStore = Depends(get_vector_store),
):
    results = await store.search(request.question)
    ...
\`\`\`

### Automatic Documentation

FastAPI generates OpenAPI (Swagger) docs automatically from:
- Route decorators and path parameters
- Pydantic model definitions
- Docstrings and response model types

Available at \`/docs\` (Swagger UI) and \`/redoc\` (ReDoc).`,
      prosAndCons: {
        pros: [
          "Fastest Python framework in benchmarks",
          "Automatic request validation via Pydantic",
          "Auto-generated OpenAPI documentation",
          "Native async/await support",
          "Excellent developer experience with type hints",
          "Dependency injection system",
        ],
        cons: [
          "Still Python — slower than Go/Rust for CPU-bound tasks",
          "Starlette abstraction can be leaky for advanced use cases",
          "Smaller ecosystem than Django/Flask",
          "No built-in ORM (use SQLAlchemy, Tortoise, etc.)",
          "WebSocket support is basic compared to Socket.IO",
        ],
      },
      alternatives: [
        {
          name: "Flask",
          comparison: "Micro-framework, synchronous by default. Simpler but slower, no automatic validation, no auto-docs. Still the most popular Python web framework by downloads.",
        },
        {
          name: "Django",
          comparison: "Full-featured framework with ORM, admin, auth. Great for traditional web apps but heavier for APIs. Django REST Framework adds API capabilities.",
        },
        {
          name: "Litestar",
          comparison: "Modern ASGI framework, similar to FastAPI. Uses msgspec instead of Pydantic (faster serialization). Less popular but technically impressive.",
        },
      ],
      keyAPIs: [
        "@app.get/post/put/delete — route decorators",
        "Depends() — dependency injection",
        "BaseModel — Pydantic request/response models",
        "UploadFile — file upload handling",
        "BackgroundTasks — async background processing",
        "WebSocket — real-time communication",
      ],
      academicFoundations: `**ASGI Protocol:** Based on the Actor model of concurrency (Carl Hewitt, 1973). Each request handler is an actor that processes messages (requests) asynchronously. The ASGI server manages the event loop and dispatches requests to handlers.

**Dependency Injection (Martin Fowler, 2004):** FastAPI's Depends() implements IoC (Inversion of Control) — dependencies are injected into handlers rather than created by them. This enables testability (inject mocks) and separation of concerns.

**OpenAPI Specification:** Formerly Swagger, OpenAPI is a machine-readable API description format. It's based on JSON Schema and enables automatic client generation, documentation, and testing.`,
      furtherReading: [
        "FastAPI documentation — fastapi.tiangolo.com",
        "Building Data Science Applications with FastAPI by Francois Voron",
        "ASGI specification — asgi.readthedocs.io",
      ],
    },
    {
      name: "Qdrant",
      category: "database",
      icon: "QD",
      tagline: "High-performance vector database",
      origin: {
        creator: "Qdrant team (Andrey Vasnetsov)",
        year: 2021,
        motivation:
          "The rise of embedding models (BERT, GPT) created a need for databases optimized for vector similarity search. Qdrant was built in Rust for maximum performance and reliability.",
      },
      whatItIs: `Qdrant is a vector database designed for similarity search on high-dimensional vectors. Key features:

- **Written in Rust** — memory-safe, high performance
- **HNSW index** — state-of-the-art approximate nearest neighbor search
- **Filtering** — combine vector search with metadata filters
- **Payload storage** — store arbitrary JSON alongside vectors
- **Distributed mode** — horizontal scaling with sharding and replication
- **Quantization** — compress vectors for lower memory usage`,
      explainLikeImTen: `Imagine you have a giant library with millions of paragraphs from different books. When someone asks a question, you need to find the paragraphs that are most related to their question — not just ones with the same words, but ones that actually mean similar things. Qdrant is like a super-smart librarian that turns every paragraph into a secret code (a list of numbers) and then can instantly find the paragraphs whose codes are most similar to your question's code. It does this incredibly fast, even with millions of paragraphs, because it uses a clever shortcut map instead of checking every single one.`,
      realWorldAnalogy: `Qdrant is like Shazam for text. Shazam converts a song snippet into a "fingerprint" and matches it against millions of song fingerprints in milliseconds. Similarly, Qdrant converts text into numerical fingerprints (embeddings) and finds the closest matches in a massive database almost instantly, using the same kind of clever indexing that makes Shazam work.`,
      whyWeUsedIt: `The RAG system stores document chunk embeddings (768-dimensional vectors) and needs to find the most similar chunks for a given query. Qdrant was chosen because:

- Sub-millisecond vector search on millions of vectors
- Payload filtering (search within specific documents or categories)
- Simple HTTP/gRPC API
- Docker-friendly deployment
- Rust implementation means minimal memory overhead
- Supports multiple distance metrics (cosine, dot product, euclidean)`,
      howItWorksInProject: `- Runs as a Docker container
- \`qdrant-client\` Python SDK for operations
- Collection created per document corpus with HNSW index
- Chunks stored with embeddings + metadata (source document, page, position)
- Hybrid search: Qdrant for vector similarity, BM25 for keyword matching
- Results merged via Reciprocal Rank Fusion`,
      featuresInProject: [
        {
          feature: "Document Chunk Storage",
          description:
            "Every document chunk is stored as a Qdrant point with its embedding vector (384 or 768 dimensions) plus a payload containing the raw text, source document name, page number, and chunk position for citation tracking.",
        },
        {
          feature: "Semantic Vector Search",
          description:
            "When a user submits a query, it is embedded using the same sentence-transformer model. Qdrant's HNSW index finds the top-k nearest neighbors by cosine similarity in sub-millisecond time.",
        },
        {
          feature: "Metadata Filtering",
          description:
            "Qdrant's Filter and FieldCondition system allows scoping searches to specific documents, date ranges, or categories — e.g., 'search only within the Q4 financial report.'",
        },
        {
          feature: "Collection Management",
          description:
            "The system creates and manages Qdrant collections per document corpus, with configurable HNSW parameters (ef_construct, m) tuned for the expected corpus size and query latency requirements.",
        },
        {
          feature: "Batch Upsert During Ingestion",
          description:
            "During document ingestion, chunks are embedded in batches and upserted into Qdrant in bulk, with payload metadata attached. This allows efficient indexing of large document sets.",
        },
      ],
      coreConceptsMarkdown: `### Vector Similarity Search

The core operation: given a query vector, find the k most similar vectors in the database.

**Distance Metrics:**
- **Cosine Similarity:** Measures angle between vectors (0 = orthogonal, 1 = identical direction). Most common for text embeddings.
- **Dot Product:** Measures alignment + magnitude. Faster than cosine when vectors are normalized.
- **Euclidean (L2):** Measures geometric distance. Better for spatial data.

### HNSW (Hierarchical Navigable Small World)

HNSW is the state-of-the-art algorithm for approximate nearest neighbor (ANN) search:

1. **Build phase:** Construct a multi-layer graph where each vector is a node
   - Bottom layer: all vectors connected to nearby neighbors
   - Higher layers: sparse "express lanes" connecting distant nodes
2. **Search phase:** Start at the top layer, greedily navigate to nearest node, drop down a layer, repeat
3. **Complexity:** O(log n) search time, O(n log n) build time

**Approximate vs Exact:**
Exact nearest neighbor search is O(n) — you must compare against every vector. HNSW trades a tiny accuracy loss (99.9%+ recall) for O(log n) search time.

### Embeddings

Vectors in the database are embeddings — dense numerical representations of text/images produced by neural networks.

\`\`\`python
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")
embedding = model.encode("What is machine learning?")
# Returns: [0.0234, -0.0891, 0.0452, ...] (384 dimensions)
\`\`\`

**Why embeddings work:** Neural networks learn to map semantically similar inputs to nearby points in vector space. "dog" and "puppy" will have similar embeddings, even though the words are different.

### Qdrant Operations

\`\`\`python
from qdrant_client import QdrantClient
from qdrant_client.models import PointStruct, VectorParams, Distance

client = QdrantClient(url="localhost:6333")

# Create collection
client.create_collection(
    collection_name="documents",
    vectors_config=VectorParams(size=384, distance=Distance.COSINE),
)

# Insert vectors
client.upsert(
    collection_name="documents",
    points=[
        PointStruct(
            id=1,
            vector=[0.1, 0.2, ...],
            payload={"text": "chunk text", "source": "doc.pdf", "page": 3},
        )
    ],
)

# Search
results = client.search(
    collection_name="documents",
    query_vector=[0.15, 0.22, ...],
    limit=5,
    query_filter=Filter(must=[FieldCondition(key="source", match=MatchValue(value="doc.pdf"))]),
)
\`\`\``,
      prosAndCons: {
        pros: [
          "Written in Rust — fast, memory-safe, low overhead",
          "State-of-the-art HNSW index with high recall",
          "Rich filtering alongside vector search",
          "Simple REST/gRPC API",
          "Quantization for reduced memory usage",
          "Active development and growing community",
        ],
        cons: [
          "Relatively new — less battle-tested than Elasticsearch",
          "No built-in full-text search (need separate BM25 system)",
          "Memory-intensive for large collections without quantization",
          "Distributed mode is newer and less mature",
          "Limited aggregation/analytics capabilities",
        ],
      },
      alternatives: [
        {
          name: "Pinecone",
          comparison: "Fully managed vector database (SaaS). Zero ops but vendor lock-in and expensive at scale. No self-hosted option.",
        },
        {
          name: "Weaviate",
          comparison: "Open-source vector database with built-in vectorization. More features (multi-modal, generative search) but heavier and written in Go.",
        },
        {
          name: "ChromaDB",
          comparison: "Simple, developer-friendly vector database. Great for prototyping but less performant at scale. Python-native.",
        },
        {
          name: "pgvector",
          comparison: "PostgreSQL extension for vector similarity search. Use your existing PostgreSQL instance. Good for small-medium datasets but slower than dedicated vector DBs.",
        },
      ],
      keyAPIs: [
        "create_collection() — define vector space",
        "upsert() — insert/update vectors with payloads",
        "search() — find nearest neighbors",
        "scroll() — iterate through all points",
        "delete() — remove vectors",
        "Filter/FieldCondition — metadata filtering",
      ],
      academicFoundations: `**Nearest Neighbor Search (Fix & Hodges, 1951):** The k-nearest neighbors (k-NN) problem is fundamental to pattern recognition. Given a query point, find the k closest points in a dataset.

**HNSW (Malkov & Yashunin, 2016):** The HNSW algorithm is based on two ideas:
1. **Navigable Small World graphs** (Kleinberg, 2000): Networks where any node can reach any other node in O(log n) hops
2. **Hierarchical structure:** Multiple layers of decreasing density, inspired by skip lists (Pugh, 1990)

**Johnson-Lindenstrauss Lemma (1984):** High-dimensional vectors can be projected to lower dimensions while approximately preserving distances. This theoretical result underpins dimensionality reduction and quantization.

**Curse of Dimensionality (Bellman, 1961):** In high-dimensional spaces, all points become approximately equidistant. This is why exact nearest neighbor search becomes impractical above ~20 dimensions, motivating approximate methods like HNSW.

**Word Embeddings (Mikolov et al., 2013):** Word2Vec showed that neural networks can learn meaningful vector representations of words. This was extended to sentences (Sentence-BERT), documents, and images.`,
      furtherReading: [
        "Qdrant documentation — qdrant.tech/documentation",
        "HNSW paper: Efficient and robust approximate nearest neighbor search (Malkov & Yashunin, 2016)",
        "Ann-benchmarks — ann-benchmarks.com",
      ],
    },
    {
      name: "Sentence Transformers",
      category: "ai-ml",
      icon: "ST",
      tagline: "State-of-the-art text embeddings",
      origin: {
        creator: "Nils Reimers & Iryna Gurevych (UKP Lab, TU Darmstadt)",
        year: 2019,
        motivation:
          "BERT produces token-level embeddings but generating sentence embeddings requires expensive cross-encoding. Sentence-BERT modified BERT to produce fixed-size sentence embeddings efficiently.",
      },
      whatItIs: `Sentence Transformers is a Python library for computing dense vector representations (embeddings) of sentences, paragraphs, and images. It wraps Hugging Face transformers and provides:

- **Pre-trained models** for 100+ languages
- **Efficient encoding** — batch processing on GPU
- **Semantic similarity** — cosine similarity between embeddings
- **Fine-tuning** — adapt models to your domain
- Models: all-MiniLM-L6-v2 (fast), all-mpnet-base-v2 (accurate), multilingual models`,
      explainLikeImTen: `Imagine you could turn any sentence into a unique point on a giant map. Sentences that mean similar things would be close together on the map, and sentences that mean different things would be far apart. Sentence Transformers is the tool that creates this map. It reads a sentence, thinks about what it means (not just the individual words, but the whole meaning), and places it at exactly the right spot. Then when someone asks a question, it puts the question on the same map and finds the closest sentences — those are the best answers.`,
      realWorldAnalogy: `Sentence Transformers works like a sommelier matching wine to food. A sommelier doesn't just match "red meat = red wine" (keyword matching). They understand the flavor profile — richness, acidity, tannins — and find wines that complement the dish on multiple dimensions simultaneously. Similarly, Sentence Transformers understands text on many dimensions of meaning and finds the best semantic matches, not just word-for-word overlaps.`,
      whyWeUsedIt: `The RAG system needs to convert text chunks and queries into embeddings for vector search. Sentence Transformers provides:
- Pre-trained models that understand semantic meaning
- Batch encoding for efficient bulk processing during ingestion
- Small model options (all-MiniLM-L6-v2: 22M params, 80MB) that run fast on CPU
- Cosine similarity scores for retrieval ranking`,
      howItWorksInProject: `- Model loaded at startup, reused across requests
- Document chunks embedded during ingestion (batch processing)
- Query embedded at search time (single embedding)
- Embeddings stored in Qdrant (384 or 768 dimensions depending on model)
- Model runs on CPU for inference (fast enough for real-time queries)`,
      featuresInProject: [
        {
          feature: "Document Chunk Embedding",
          description:
            "During ingestion, every text chunk is passed through the sentence-transformer model (all-MiniLM-L6-v2 or all-mpnet-base-v2) in batches to generate dense vector representations stored in Qdrant.",
        },
        {
          feature: "Real-Time Query Embedding",
          description:
            "When a user submits a query, it is encoded into an embedding vector using the same model, ensuring the query lives in the same vector space as the document chunks for accurate similarity search.",
        },
        {
          feature: "Semantic Similarity Scoring",
          description:
            "Cosine similarity between query and chunk embeddings produces a relevance score. This score is used as one of the two inputs (alongside BM25) for Reciprocal Rank Fusion in hybrid retrieval.",
        },
        {
          feature: "Evaluation Context Relevance",
          description:
            "The evaluation harness uses sentence-transformer embeddings to compute context relevance scores — measuring how semantically related retrieved chunks are to the original question.",
        },
        {
          feature: "Model Hot-Swapping",
          description:
            "The system supports switching between embedding models (MiniLM for speed vs MPNet for accuracy) via configuration, enabling A/B testing of embedding quality impact on overall RAG performance.",
        },
      ],
      coreConceptsMarkdown: `### How Sentence Embeddings Work

1. Input text is tokenized into subword tokens
2. Tokens pass through a transformer encoder (BERT/RoBERTa/MPNet)
3. Token embeddings are pooled (mean pooling) into a single sentence vector
4. The resulting vector captures semantic meaning in a fixed-size representation

\`\`\`python
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")

# Single encoding
embedding = model.encode("What is machine learning?")
# Shape: (384,)

# Batch encoding
embeddings = model.encode([
    "Machine learning is a subset of AI",
    "Deep learning uses neural networks",
    "The weather is nice today",
])
# Shape: (3, 384)

# Similarity
from sentence_transformers.util import cos_sim
similarity = cos_sim(embeddings[0], embeddings[1])  # ~0.75
similarity = cos_sim(embeddings[0], embeddings[2])  # ~0.10
\`\`\`

### Transformer Architecture (Simplified)

The transformer (Vaswani et al., 2017) consists of:
- **Self-Attention:** Each token attends to every other token, learning contextual relationships
- **Multi-Head Attention:** Multiple attention heads capture different types of relationships
- **Feed-Forward Networks:** Process attention output
- **Layer Normalization:** Stabilize training
- **Positional Encoding:** Add position information (transformers have no inherent notion of order)

### Training Objectives

Sentence Transformers are fine-tuned with:
- **Contrastive Loss:** Similar pairs have high cosine similarity, dissimilar pairs have low
- **Multiple Negatives Ranking (MNRL):** Given (anchor, positive), all other positives in the batch are negatives
- **Cosine Similarity Loss:** Directly optimize cosine similarity to match human-judged similarity scores`,
      prosAndCons: {
        pros: [
          "Pre-trained models work out-of-the-box for most use cases",
          "Fast inference — small models run in milliseconds on CPU",
          "Rich model hub with 5,000+ models on Hugging Face",
          "Easy fine-tuning for domain-specific embeddings",
          "Multi-language support (100+ languages)",
          "Active research and development",
        ],
        cons: [
          "Fixed context length (usually 256-512 tokens)",
          "General models may underperform on specialized domains (medical, legal)",
          "Embedding quality depends heavily on model choice",
          "GPU needed for training/fine-tuning",
          "Model updates can change embedding space (reindex needed)",
        ],
      },
      alternatives: [
        {
          name: "OpenAI Embeddings",
          comparison: "text-embedding-3-small/large via API. No local infrastructure needed but costs money per token, adds latency, and sends data to a third party.",
        },
        {
          name: "Cohere Embed",
          comparison: "Commercial embedding API with compression support. Good quality but same drawbacks as any SaaS embedding service.",
        },
        {
          name: "FastEmbed (Qdrant)",
          comparison: "Lightweight ONNX-based embedding library. Faster CPU inference than sentence-transformers but fewer model options.",
        },
      ],
      keyAPIs: [
        "SentenceTransformer(model_name) — load model",
        "model.encode(texts) — generate embeddings",
        "cos_sim(a, b) — cosine similarity",
        "model.start_multi_process_pool() — parallel encoding",
        "InputExample — training data format",
        "losses.MultipleNegativesRankingLoss — training loss",
      ],
      academicFoundations: `**Attention Is All You Need (Vaswani et al., 2017):** The transformer architecture replaced RNNs for sequence modeling. Self-attention allows each token to attend to all other tokens in O(n²) time, capturing long-range dependencies.

**BERT (Devlin et al., 2018):** Bidirectional Encoder Representations from Transformers. Pre-trained on masked language modeling (predict missing words) and next sentence prediction. Produces contextual token embeddings.

**Sentence-BERT (Reimers & Gurevych, 2019):** Modified BERT with siamese/triplet network architecture to produce fixed-size sentence embeddings. Training uses contrastive learning — similar sentences should have similar embeddings.

**Distributional Hypothesis (Harris, 1954):** "Words that occur in similar contexts tend to have similar meanings." This linguistic theory underpins all embedding models — meaning is derived from usage patterns in large text corpora.`,
      furtherReading: [
        "Sentence-BERT paper (Reimers & Gurevych, 2019)",
        "Attention Is All You Need (Vaswani et al., 2017)",
        "Sentence Transformers docs — sbert.net",
        "Hugging Face course — huggingface.co/course",
      ],
    },
    {
      name: "BM25 (rank-bm25)",
      category: "ai-ml",
      icon: "25",
      tagline: "Classic probabilistic information retrieval",
      origin: {
        creator: "Stephen Robertson, Karen Sparck Jones (1994)",
        year: 1994,
        motivation:
          "BM25 (Best Matching 25) was the 25th iteration of a probabilistic ranking function developed at City University London. It was designed to improve on TF-IDF by adding document length normalization and term frequency saturation.",
      },
      whatItIs: `BM25 is a bag-of-words retrieval function that ranks documents based on term frequency. It's the default ranking algorithm in Elasticsearch, Apache Solr, and most search engines.

The formula: score(D, Q) = sum over query terms of: IDF(q) * (tf * (k1+1)) / (tf + k1 * (1 - b + b * |D|/avgDL))

Where:
- **tf:** term frequency in document
- **IDF:** inverse document frequency (rarity of term)
- **|D|/avgDL:** document length normalization
- **k1:** term frequency saturation parameter (default 1.5)
- **b:** document length normalization parameter (default 0.75)`,
      explainLikeImTen: `Imagine you are searching for a book about "space rockets" in a library. BM25 is a scoring system that helps find the best books. It looks at two things: how many times the words "space" and "rockets" appear in each book (more mentions = probably more relevant), and how rare those words are across all books (if the word "the" appears everywhere, it's not useful, but if "rockets" is rare, a book mentioning it is probably a good match). It also adjusts for book length — a short book that mentions "rockets" 5 times is more focused than a 1,000-page book that mentions it 5 times.`,
      realWorldAnalogy: `BM25 is like a detective searching for clues. The detective gives more weight to rare, distinctive clues (a unique fingerprint) than common ones (a shoe print from a popular brand). Finding the same rare clue multiple times strengthens the case, but with diminishing returns — the 10th fingerprint match doesn't add much beyond the 5th. And the detective adjusts for scene size: finding 3 clues in a small room is more significant than finding 3 clues spread across an entire building.`,
      whyWeUsedIt: `Vector search excels at semantic similarity but misses exact keyword matches. BM25 complements vector search:
- Catches exact technical terms, acronyms, product names
- Works without embeddings (no ML model needed)
- Extremely fast — O(log n) with inverted index
- Well-understood scoring (interpretable, unlike neural models)`,
      howItWorksInProject: `- \`rank-bm25\` Python library provides BM25Okapi implementation
- Inverted index built during document ingestion
- BM25 scores combined with vector similarity via Reciprocal Rank Fusion
- Hybrid retrieval typically improves recall by 15-25% vs either method alone`,
      featuresInProject: [
        {
          feature: "Keyword-Based Retrieval",
          description:
            "BM25 provides the keyword retrieval leg of the hybrid search system. It catches exact matches for technical terms, acronyms, and proper nouns that vector search might miss because they lack sufficient training data.",
        },
        {
          feature: "Inverted Index Construction",
          description:
            "During document ingestion, a BM25 inverted index is built alongside the Qdrant vector index. Each chunk is tokenized and indexed so keyword lookups run in O(log n) time.",
        },
        {
          feature: "Reciprocal Rank Fusion Input",
          description:
            "BM25 produces a ranked list of chunk results that is combined with the Qdrant vector search ranked list using RRF scoring. Each chunk gets a fused score of 1/(rank_bm25 + k) + 1/(rank_vector + k).",
        },
        {
          feature: "Retrieval Strategy Comparison",
          description:
            "The evaluation harness benchmarks BM25-only, vector-only, and hybrid retrieval on test datasets, generating comparative metrics to validate that hybrid consistently outperforms individual methods.",
        },
        {
          feature: "Acronym and Abbreviation Matching",
          description:
            "BM25 is the primary retrieval method for queries containing acronyms (e.g., 'API', 'HNSW', 'RRF') where vector embeddings may not capture the exact meaning of short technical abbreviations.",
        },
      ],
      coreConceptsMarkdown: `### TF-IDF vs BM25

**TF-IDF (Term Frequency - Inverse Document Frequency):**
\`\`\`
score = tf(t,d) * log(N / df(t))
\`\`\`
Problem: unbounded term frequency — a word appearing 100 times scores 100x more than appearing once.

**BM25:** Adds two key improvements:
1. **Term frequency saturation:** After a certain point, more occurrences of a term don't increase the score much (controlled by k1)
2. **Document length normalization:** Long documents don't automatically score higher (controlled by b)

### Inverted Index

BM25 uses an inverted index for fast retrieval:
\`\`\`
"machine"  -> [doc1:3, doc5:1, doc12:7]  (term frequency)
"learning" -> [doc1:2, doc3:4, doc5:1]
"neural"   -> [doc3:5, doc12:2]
\`\`\`

For query "machine learning":
1. Look up "machine" → get doc1, doc5, doc12
2. Look up "learning" → get doc1, doc3, doc5
3. Compute BM25 score for each candidate document
4. Return top-k by score

### Reciprocal Rank Fusion (RRF)

\`\`\`python
def reciprocal_rank_fusion(results_lists, k=60):
    scores = {}
    for results in results_lists:
        for rank, doc in enumerate(results):
            scores[doc.id] = scores.get(doc.id, 0) + 1 / (rank + k)
    return sorted(scores.items(), key=lambda x: x[1], reverse=True)
\`\`\`

RRF combines ranked lists without needing to normalize scores across different scoring systems (BM25 scores vs cosine similarity).`,
      prosAndCons: {
        pros: [
          "Excellent for exact keyword matching and technical terms",
          "Fast — O(log n) with inverted index",
          "No ML model required — works with raw text",
          "Interpretable — you can explain why a document ranked high",
          "Battle-tested — 30 years of use in production search engines",
          "Complements vector search in hybrid retrieval",
        ],
        cons: [
          "No semantic understanding — 'dog' and 'puppy' are different terms",
          "Bag-of-words — ignores word order and context",
          "Requires tokenization and text preprocessing",
          "Parameters (k1, b) need tuning for optimal performance",
          "Vocabulary mismatch problem — different words for same concept",
        ],
      },
      alternatives: [
        {
          name: "TF-IDF",
          comparison: "Simpler scoring without saturation or length normalization. BM25 consistently outperforms TF-IDF in benchmarks.",
        },
        {
          name: "Elasticsearch",
          comparison: "Full-featured search engine that uses BM25 internally. Much more than just BM25 — analyzers, aggregations, distributed search. Overkill for simple retrieval.",
        },
        {
          name: "SPLADE",
          comparison: "Learned sparse retrieval — uses a neural network to produce sparse vectors that can be searched with inverted indexes. Better than BM25 but requires ML infrastructure.",
        },
      ],
      keyAPIs: [
        "BM25Okapi(corpus) — create BM25 index",
        "bm25.get_scores(query) — score all documents",
        "bm25.get_top_n(query, corpus, n) — get top-n results",
      ],
      academicFoundations: `**Probabilistic Information Retrieval:** BM25 is derived from the Probability Ranking Principle (Robertson, 1977) — documents should be ranked by their probability of being relevant to the query. BM25 estimates this probability using term frequency, document frequency, and document length.

**Term Frequency Saturation:** The k1 parameter implements diminishing returns. In information theory, this relates to the concept of mutual information — after enough occurrences, additional repetitions provide diminishing information about relevance.

**IDF (Inverse Document Frequency):** Based on information theory's concept of self-information. A rare term carries more information (higher surprise value) than a common term. IDF(t) ≈ -log(P(t)), where P(t) is the probability of term t appearing in a random document.

**Robertson-Sparck Jones Weights (1976):** The theoretical foundation for BM25's relevance weighting. They proved that under certain independence assumptions, the optimal ranking function has the form that BM25 approximates.`,
      furtherReading: [
        "The Probabilistic Relevance Framework: BM25 and Beyond (Robertson & Zaragoza, 2009)",
        "Introduction to Information Retrieval by Manning, Raghavan, Schutze",
        "Okapi at TREC-3 — original BM25 paper",
      ],
    },
    {
      name: "Ollama",
      category: "ai-ml",
      icon: "OL",
      tagline: "Run LLMs locally",
      origin: {
        creator: "Jeffrey Morgan & Ollama team",
        year: 2023,
        motivation:
          "Running open-source LLMs locally required complex setup (CUDA, model weight management, quantization). Ollama packages everything into a simple CLI with a Docker-like pull/run interface.",
      },
      whatItIs: `Ollama is a tool for running large language models locally on your machine. It provides:
- **Model management** — pull, list, delete models
- **REST API** — OpenAI-compatible chat/completion endpoints
- **Quantization** — automatic model quantization for consumer hardware
- **Modelfile** — Dockerfile-like format for customizing models
- **GPU acceleration** — CUDA (NVIDIA), Metal (Apple), ROCm (AMD)`,
      explainLikeImTen: `Ollama is like having a really smart robot assistant that lives right on your computer instead of in the cloud. Normally, when you use AI (like ChatGPT), your questions travel over the internet to a big company's servers. Ollama lets you download the AI brain onto your own computer so it runs right there — no internet needed, no one else sees your questions, and you can use it for free as much as you want. You just tell it which AI brain to download ("pull llama3") and start chatting, kind of like downloading an app.`,
      realWorldAnalogy: `Ollama is like a home espresso machine vs going to Starbucks. Starbucks (cloud AI APIs) is convenient — no setup, always available, professionally maintained. But you pay per cup, you wait in line, and they know your order history. A home espresso machine (Ollama) requires buying the equipment and learning to use it, but then every cup is free, instant, and completely private. The quality depends on your machine (GPU), and you can experiment with any beans (models) you want.`,
      whyWeUsedIt: `The RAG system uses LLMs for answer generation and LLM-as-judge evaluation. Ollama provides:
- Zero cloud API costs — all inference runs on local GPU (RTX 4090)
- Data privacy — documents never leave the machine
- Model flexibility — switch between Llama, Mistral, Qwen without code changes
- OpenAI-compatible API — same client code works with Ollama and OpenAI`,
      howItWorksInProject: `- Runs as a local service on port 11434
- RAG backend calls Ollama API for answer generation
- Multiple models used: small (phi, qwen) for evaluation, large (llama3) for generation
- OpenAI Python SDK connects to Ollama's compatible API
- Model selection configurable per-request`,
      featuresInProject: [
        {
          feature: "Answer Generation",
          description:
            "When the RAG pipeline retrieves relevant chunks, Ollama runs a large model (e.g., llama3.2) to generate a natural language answer grounded in the retrieved context, using a system prompt that enforces context-only responses.",
        },
        {
          feature: "LLM-as-Judge Evaluation",
          description:
            "The evaluation harness uses Ollama to run a smaller, faster model (e.g., phi or qwen) as a judge — scoring generated answers for faithfulness, relevance, and completeness against the retrieved context.",
        },
        {
          feature: "Multi-Model Support",
          description:
            "The system supports switching between different Ollama models per-request via configuration. This enables A/B testing of generation quality across models (Llama vs Mistral vs Qwen) with the same retrieval results.",
        },
        {
          feature: "Streaming Response Generation",
          description:
            "Ollama streams tokens back as they are generated. The FastAPI backend forwards this stream to the Next.js frontend via a StreamingResponse, giving users real-time typewriter-style output.",
        },
        {
          feature: "OpenAI SDK Compatibility",
          description:
            "The codebase uses the standard OpenAI Python SDK pointed at Ollama's local endpoint (localhost:11434/v1). This means the same code works with both Ollama (local, free) and OpenAI (cloud, paid) by changing one URL.",
        },
      ],
      coreConceptsMarkdown: `### LLM Inference Basics

**Autoregressive Generation:** LLMs generate text one token at a time. For each token:
1. Encode all previous tokens
2. Compute attention across all tokens
3. Predict probability distribution over vocabulary
4. Sample next token from distribution
5. Repeat

This is why LLMs are slow — each token requires a full forward pass.

**KV-Cache:** Key-Value cache stores intermediate attention computations. Without it, generating token N requires recomputing attention for all N-1 previous tokens. KV-cache trades memory for speed — O(n) memory for O(1) per-token generation.

### Quantization

Full-precision models (FP16) require ~2 bytes per parameter:
- 7B model = ~14GB VRAM
- 70B model = ~140GB VRAM

Quantization reduces precision:
- **Q8:** 8-bit integers, ~1 byte/param, minimal quality loss
- **Q4_K_M:** 4-bit with k-means quantization, ~0.5 byte/param, slight quality loss
- **Q2:** 2-bit, ~0.25 byte/param, noticeable quality loss

A 7B Q4 model fits in ~4GB VRAM (runs on most GPUs).

### Ollama API

\`\`\`python
# Using OpenAI SDK (compatible)
from openai import OpenAI

client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")

response = client.chat.completions.create(
    model="llama3.2",
    messages=[{"role": "user", "content": "Explain RAG"}],
    temperature=0.7,
)
print(response.choices[0].message.content)
\`\`\`

### Modelfile (Customization)

\`\`\`
FROM llama3.2
SYSTEM "You are a helpful assistant that answers questions using only the provided context."
PARAMETER temperature 0.3
PARAMETER top_p 0.9
PARAMETER num_ctx 4096
\`\`\``,
      prosAndCons: {
        pros: [
          "Free — no API costs, unlimited usage",
          "Privacy — data never leaves your machine",
          "Simple CLI — docker-like pull/run commands",
          "OpenAI-compatible API — drop-in replacement",
          "GPU acceleration — CUDA, Metal, ROCm",
          "Growing model library — Llama, Mistral, Qwen, Gemma, Phi",
        ],
        cons: [
          "Requires capable hardware (GPU with enough VRAM)",
          "Slower than cloud APIs for large models",
          "Quantized models have lower quality than full-precision",
          "Limited to models that fit in your GPU memory",
          "No fine-tuning support (inference only)",
          "Single-user — no built-in multi-tenant serving",
        ],
      },
      alternatives: [
        {
          name: "vLLM",
          comparison: "Production-grade LLM serving with PagedAttention for optimal memory usage. Higher throughput but more complex setup. Designed for multi-user serving.",
        },
        {
          name: "llama.cpp",
          comparison: "Low-level C++ LLM inference engine (Ollama uses it internally). More control but requires manual model management and no REST API.",
        },
        {
          name: "OpenAI API",
          comparison: "Cloud API with the best models (GPT-4). No hardware needed but costs money, data leaves your machine, and you depend on their uptime.",
        },
      ],
      keyAPIs: [
        "ollama pull <model> — download model",
        "ollama run <model> — interactive chat",
        "POST /api/chat — chat completion",
        "POST /api/generate — text generation",
        "POST /api/embeddings — generate embeddings",
        "GET /api/tags — list installed models",
      ],
      academicFoundations: `**Transformer Architecture (Vaswani et al., 2017):** All LLMs are based on the transformer architecture. Key innovation: self-attention allows each token to attend to all other tokens, replacing sequential RNN processing with parallelizable matrix operations.

**Scaling Laws (Kaplan et al., 2020):** OpenAI discovered predictable power-law relationships between model size, dataset size, compute, and performance. Larger models trained on more data consistently perform better.

**Quantization Theory:** Post-training quantization (PTQ) reduces model weight precision. The key insight is that weight distributions are approximately Gaussian, so k-means quantization can preserve most information with 4-bit precision.

**Autoregressive Language Modeling:** The probability of a sequence P(w1, w2, ..., wn) is decomposed as P(w1) * P(w2|w1) * P(w3|w1,w2) * ... This chain rule decomposition is the mathematical foundation of all autoregressive LLMs.`,
      furtherReading: [
        "Ollama documentation — ollama.com",
        "llama.cpp project — github.com/ggerganov/llama.cpp",
        "GGUF format specification",
        "Attention Is All You Need (Vaswani et al., 2017)",
      ],
    },
    {
      name: "Pydantic",
      category: "library",
      icon: "PD",
      tagline: "Data validation using Python type hints",
      origin: {
        creator: "Samuel Colvin",
        year: 2017,
        motivation:
          "Python's type hints (PEP 484) only work at development time — they don't validate data at runtime. Pydantic bridges this gap by using type hints as the schema for runtime data validation.",
      },
      whatItIs: `Pydantic is a data validation library that uses Python type annotations to define schemas. In v2 (rewritten in Rust), it's the fastest Python validation library.

- **BaseModel** — define data classes with automatic validation
- **Field()** — add constraints (min, max, regex, custom validators)
- **Settings** — environment variable parsing with type coercion
- **Serialization** — JSON/dict conversion with aliases and exclusions`,
      explainLikeImTen: `Pydantic is like a bouncer at a club who checks IDs. When data comes into your program — like a user sending a message — Pydantic checks that everything is correct. Is the name actually text? Is the age actually a number? Is the email formatted properly? If anything is wrong, Pydantic stops the data from getting in and tells you exactly what the problem is. It uses the labels you put on your data (type hints) to know what to check for, so you describe what correct data looks like and Pydantic enforces it automatically.`,
      realWorldAnalogy: `Pydantic is like the quality control inspector at a factory assembly line. Every product (data) that comes down the line gets checked against a specification sheet (your type annotations). Does it have all the required parts? Are the measurements within tolerance? Is the serial number the right format? If anything is off, the inspector rejects it with a detailed report of what's wrong. In version 2, the inspector was replaced by a robot (rewritten in Rust), making inspections 5-50x faster.`,
      whyWeUsedIt: `Pydantic is the backbone of FastAPI. Every request and response goes through Pydantic validation:
- Request bodies validated against schemas
- Query parameters parsed and type-coerced
- Response models ensure consistent API output
- Configuration parsed from environment variables
- Database models validated before storage`,
      howItWorksInProject: `- Request/response models in each route module
- \`pydantic-settings\` for environment variable parsing
- Nested models for complex request structures (documents with chunks)
- Custom validators for business logic (chunk size limits, valid model names)`,
      featuresInProject: [
        {
          feature: "API Request Validation",
          description:
            "Every FastAPI endpoint uses Pydantic BaseModel subclasses (QueryRequest, IngestRequest, EvalRequest) to automatically validate incoming JSON bodies, rejecting malformed requests with detailed error messages.",
        },
        {
          feature: "Response Schema Enforcement",
          description:
            "Pydantic response models (QueryResponse, EvalResult) ensure the API always returns consistently structured JSON, with typed fields for answer text, source citations, confidence scores, and evaluation metrics.",
        },
        {
          feature: "Environment Configuration",
          description:
            "pydantic-settings parses environment variables and .env files into a typed Settings model — Qdrant URL, embedding model name, chunk size, LLM model name — with automatic type coercion and default values.",
        },
        {
          feature: "Document Metadata Validation",
          description:
            "During ingestion, document metadata (title, source, page numbers, chunk positions) is validated through nested Pydantic models before being stored as Qdrant payloads, preventing corrupt metadata from entering the system.",
        },
        {
          feature: "Custom Business Logic Validators",
          description:
            "Field validators enforce domain rules: chunk_size must be between 100-2048 tokens, model names must be from the allowed list, top_k must be positive, and questions cannot be empty strings.",
        },
      ],
      coreConceptsMarkdown: `### BaseModel

\`\`\`python
from pydantic import BaseModel, Field

class Document(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    content: str
    metadata: dict[str, str] = {}
    chunk_size: int = Field(default=512, ge=100, le=2048)

# Validates on creation
doc = Document(title="My Doc", content="...", chunk_size=500)

# Raises ValidationError
doc = Document(title="", content="...")  # title too short!
\`\`\`

### Settings Management

\`\`\`python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str
    qdrant_url: str = "localhost:6333"
    embedding_model: str = "all-MiniLM-L6-v2"
    chunk_size: int = 512

    model_config = {"env_file": ".env"}

settings = Settings()  # reads from environment / .env
\`\`\`

### Validators

\`\`\`python
from pydantic import field_validator

class QueryRequest(BaseModel):
    question: str
    top_k: int = 5

    @field_validator("question")
    @classmethod
    def question_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Question cannot be empty")
        return v.strip()
\`\`\``,
      prosAndCons: {
        pros: [
          "Rust-powered core (v2) — extremely fast validation",
          "Uses standard Python type hints — no new syntax",
          "Excellent error messages with field paths",
          "Deep FastAPI integration",
          "JSON Schema generation for API documentation",
          "Settings management for environment variables",
        ],
        cons: [
          "V1 to V2 migration was breaking (different API)",
          "Validation overhead for high-frequency internal calls",
          "Complex nested models can be hard to debug",
          "Custom validators can make models hard to read",
        ],
      },
      alternatives: [
        {
          name: "attrs + cattrs",
          comparison: "Lightweight alternative. attrs for class definition, cattrs for serialization. Less magical, more explicit, but no built-in validation.",
        },
        {
          name: "dataclasses",
          comparison: "Python standard library. No validation, no serialization, but zero dependencies. Good for internal data structures.",
        },
        {
          name: "msgspec",
          comparison: "Fastest Python serialization library. Struct types are even faster than Pydantic v2. But smaller ecosystem and fewer features.",
        },
      ],
      keyAPIs: [
        "BaseModel — model definition base class",
        "Field() — field constraints and metadata",
        "@field_validator — custom validation",
        "@model_validator — cross-field validation",
        "model_dump() — convert to dict",
        "model_validate() — create from dict/json",
      ],
      academicFoundations: `**Design by Contract:** Pydantic models implement preconditions on data — every field has constraints that must be satisfied. This is Bertrand Meyer's Design by Contract applied to data structures.

**Schema Languages:** Pydantic generates JSON Schema (IETF RFC draft), which is the standard machine-readable format for describing data structures. This connects to the broader field of schema languages (XML Schema, Protocol Buffers, Apache Avro).

**Dependent Types (Lightweight):** Pydantic's constrained types (conint, constr) are a practical form of refinement types — types with additional runtime constraints. Full dependent type theory (Curry-Howard correspondence) is impractical in Python, but Pydantic provides useful subset.`,
      furtherReading: [
        "Pydantic documentation — docs.pydantic.dev",
        "FastAPI + Pydantic integration guide",
        "JSON Schema specification — json-schema.org",
      ],
    },
    {
      name: "Next.js",
      category: "framework",
      icon: "NX",
      tagline: "The React framework for the web",
      origin: {
        creator: "Guillermo Rauch & Vercel",
        year: 2016,
        motivation:
          "React apps were client-side only (CSR), leading to slow initial loads and poor SEO. Next.js added server-side rendering (SSR), static generation (SSG), and file-based routing to React. Over time it evolved into a full-stack framework with the App Router (v13+), React Server Components, server actions, and edge runtime support — essentially becoming the default way to build production React applications.",
      },
      whatItIs: `Next.js is a full-stack React framework that provides everything needed to build production web applications. It has evolved from a simple SSR solution into the most comprehensive React meta-framework:

- **App Router (v13+)** — file-system based routing built on React Server Components (RSC). Each folder in the \`app/\` directory maps to a URL segment, and special files (\`page.tsx\`, \`layout.tsx\`, \`loading.tsx\`, \`error.tsx\`, \`not-found.tsx\`) define the UI for each route.
- **React Server Components (RSC)** — components that run exclusively on the server. They can directly access databases, read files, and call APIs without exposing secrets to the client. They send rendered HTML to the browser, not JavaScript — reducing bundle size dramatically.
- **Client Components** — interactive components marked with \`"use client"\` that run in the browser. They support useState, useEffect, event handlers, and browser APIs. Only client components add to the JavaScript bundle.
- **Rendering Strategies** — SSR (server-side rendering on every request), SSG (static site generation at build time), ISR (incremental static regeneration with background revalidation), PPR (partial prerendering — static shell with dynamic holes), and CSR (client-side rendering for interactive widgets).
- **Data Fetching** — the extended \`fetch()\` API with built-in caching, revalidation, and deduplication. Server components can fetch data directly with \`async/await\`. Route handlers provide API endpoints.
- **Server Actions** — functions marked with \`"use server"\` that run on the server but can be called from client components like regular functions. They enable form handling, mutations, and database operations without writing API routes.
- **Middleware** — runs at the edge before every request. Used for authentication checks, redirects, A/B testing, geolocation-based routing, and request rewriting.
- **Image Optimization** — the \`next/image\` component automatically resizes, converts to WebP/AVIF, lazy-loads, and serves responsive images from an optimized CDN.
- **Font Optimization** — \`next/font\` downloads Google Fonts or local fonts at build time, self-hosts them, and eliminates layout shift (CLS) by preloading font metrics.
- **Metadata API** — generate static and dynamic \`<head>\` metadata (title, description, Open Graph, Twitter cards, JSON-LD) per route for SEO.
- **Parallel and Intercepting Routes** — advanced routing patterns for modals, split views, and conditional route rendering without full page navigation.
- **Route Groups** — organize routes into logical groups with shared layouts without affecting the URL structure using \`(group)\` folder naming.
- **Edge Runtime** — deploy server components and middleware to edge locations worldwide for sub-50ms response times. Based on the Web APIs standard (not Node.js).`,
      explainLikeImTen: `Next.js is like a super-powered website builder for programmers. Normally when you make a website with React, everything loads in the user's browser — which can be slow, like waiting for a big app to download. Next.js is smarter: it prepares the website on the server first (like a chef pre-making meals) and sends the finished page to your browser so it loads instantly. Then it "wakes up" the interactive parts (like buttons and forms) once the page is showing. It also automatically makes your images smaller, picks the best way to show each page, and organizes all your pages into a clean folder structure. Think of it as React with superpowers.`,
      realWorldAnalogy: `Next.js is like a modern restaurant kitchen with multiple cooking stations. Some dishes (static pages) are prepared ahead during "prep time" (build) and just need plating when ordered. Other dishes (dynamic pages) are cooked to order per customer request (SSR). The kitchen has a pass-through window (middleware) where the chef inspects every plate before it goes out. There is a buffet section (ISR) where popular dishes are pre-made but refreshed every 30 minutes. The head chef (React Server Components) handles the heavy prep work in the kitchen so the waitstaff (client components) only carry the lightweight interactive elements to the table.`,
      whyWeUsedIt: `The RAG Eval Engine has a dashboard for viewing evaluation results, uploading documents, and querying the system. Next.js provides:
- Server-side rendering for the evaluation dashboard — server components fetch evaluation data directly from the Python backend, reducing client-side JavaScript and improving initial load performance
- App Router with nested layouts for consistent dashboard chrome (sidebar, header) across all pages
- API route handlers proxy requests to the Python FastAPI backend, avoiding CORS issues and keeping backend URLs private
- File-based routing creates clean URL structure: /documents, /query, /eval, /eval/[id], /metrics
- React Server Components fetch evaluation data on the server, keeping API keys and backend URLs out of the browser
- Built-in image optimization for document thumbnails and chart exports
- Loading states and error boundaries per route segment for graceful UX during long evaluation runs
- TypeScript strict mode ensures type safety across the entire frontend codebase`,
      howItWorksInProject: `- Dashboard in \`dashboard/\` directory using App Router
- Root layout with sidebar navigation and header
- Server components for pages: document list (\`/documents\`), evaluation results (\`/eval\`), metrics dashboard (\`/metrics\`)
- Client components for interactive features: query form, document upload dropzone, real-time streaming response display
- Route handlers in \`app/api/\` proxy requests to the FastAPI backend (POST /api/query, POST /api/ingest, GET /api/eval)
- Server actions for form submissions (document upload, query submission)
- Recharts-based visualization components for evaluation metrics (faithfulness, relevance, recall trends over time)
- Loading.tsx skeletons for each route segment during data fetching
- Error.tsx boundaries catch and display backend API errors gracefully
- Middleware checks authentication before accessing the dashboard
- Tailwind CSS + shadcn/ui for consistent, accessible component styling`,
      featuresInProject: [
        {
          feature: "Evaluation Dashboard (Server Component)",
          description:
            "The /eval page is a React Server Component that fetches the latest evaluation results directly from the FastAPI backend on the server. No JavaScript is sent to the browser for the data table — just rendered HTML with faithfulness, relevance, and recall scores.",
        },
        {
          feature: "Interactive Query Interface (Client Component)",
          description:
            "The /query page uses a 'use client' component with useState and useEffect to handle user input, submit queries to the backend, and stream the LLM-generated answer in real time with a typewriter effect.",
        },
        {
          feature: "Document Upload with Drag-and-Drop",
          description:
            "A client component dropzone on /documents accepts PDF, DOCX, and TXT files, uploads them via a Next.js API route handler that proxies to the FastAPI /ingest endpoint, and shows ingestion progress in real time.",
        },
        {
          feature: "API Route Proxy Layer",
          description:
            "Route handlers in app/api/ forward frontend requests to the Python FastAPI backend, hiding the backend URL from the browser, handling CORS, and attaching authentication headers.",
        },
        {
          feature: "Metrics Visualization Dashboard",
          description:
            "The /metrics page renders Recharts line charts and bar graphs showing evaluation metric trends over time — faithfulness, answer relevance, context relevance, and context recall — using server-fetched data with client-side chart interactivity.",
        },
      ],
      coreConceptsMarkdown: `### App Router Architecture

The App Router (introduced in Next.js 13) is built on React Server Components and provides a file-system based routing mechanism:

\`\`\`
dashboard/
  src/
    app/
      layout.tsx        # Root layout — sidebar nav, header (shared across all pages)
      page.tsx           # Home page (/)
      loading.tsx        # Root loading skeleton
      error.tsx          # Root error boundary
      not-found.tsx      # 404 page
      documents/
        page.tsx         # /documents — document list (Server Component)
        upload/
          page.tsx       # /documents/upload — upload form (Client Component)
      query/
        page.tsx         # /query — interactive query interface
      eval/
        page.tsx         # /eval — evaluation results list
        [id]/
          page.tsx       # /eval/:id — single evaluation detail
          loading.tsx    # Loading state for eval detail
      metrics/
        page.tsx         # /metrics — charts and graphs
      api/
        query/
          route.ts       # POST /api/query — proxy to FastAPI
        ingest/
          route.ts       # POST /api/ingest — proxy to FastAPI
        eval/
          route.ts       # GET /api/eval — proxy to FastAPI
\`\`\`

**Special Files:**
- \`page.tsx\` — the UI for a route segment (required to make a route accessible)
- \`layout.tsx\` — shared UI that wraps child routes (preserved across navigations, no re-render)
- \`loading.tsx\` — instant loading UI using React Suspense (shows while page data loads)
- \`error.tsx\` — error boundary that catches errors in the route subtree
- \`not-found.tsx\` — 404 UI for the segment
- \`route.ts\` — API endpoint (GET, POST, PUT, DELETE handlers)
- \`template.tsx\` — like layout but re-mounts on navigation (for animations)

### React Server Components (RSC) — Deep Dive

Server Components are the default in the App Router. They fundamentally change how React applications work:

\`\`\`typescript
// This is a Server Component (default — no directive needed)
// It runs ONLY on the server, NEVER in the browser
export default async function EvalPage() {
  // Direct database/API access — no need for useEffect or API routes
  const results = await fetch("http://backend:8000/eval/latest", {
    cache: "no-store", // Dynamic rendering — fresh data on every request
  });
  const data = await results.json();

  // This component's code is NOT sent to the browser
  // Only the rendered HTML is sent
  return (
    <div>
      <h1>Evaluation Results</h1>
      <EvalTable data={data} />     {/* Server Component — static table */}
      <EvalFilters />                {/* Client Component — interactive filters */}
    </div>
  );
}
\`\`\`

**Why Server Components matter:**
1. **Zero bundle size** — server component code is never sent to the browser. A 500-line data processing component adds 0 bytes to the client bundle.
2. **Direct backend access** — fetch data, read files, query databases directly. No API routes needed for read operations.
3. **Secure by default** — API keys, database URLs, and secrets stay on the server. They literally cannot leak to the client.
4. **Streaming** — server components can stream HTML progressively using Suspense boundaries. The browser shows content as it becomes ready.

### Client Components — When and Why

Client Components are opted into with the \`"use client"\` directive. Use them when you need interactivity:

\`\`\`typescript
"use client";

import { useState, useCallback } from "react";

export function QueryForm() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const handleSubmit = useCallback(async () => {
    setIsStreaming(true);
    const res = await fetch("/api/query", {
      method: "POST",
      body: JSON.stringify({ question: query, top_k: 5 }),
    });

    // Stream the response
    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    while (reader) {
      const { done, value } = await reader.read();
      if (done) break;
      setResponse((prev) => prev + decoder.decode(value));
    }
    setIsStreaming(false);
  }, [query]);

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <button type="submit" disabled={isStreaming}>
        {isStreaming ? "Generating..." : "Ask"}
      </button>
      <div>{response}</div>
    </form>
  );
}
\`\`\`

**The Server/Client Boundary:**
- Server Components can import Client Components
- Client Components CANNOT import Server Components (but can accept them as children via props)
- The boundary is the \`"use client"\` directive — everything below it in the import tree is client code
- Strategy: keep the "use client" boundary as low as possible in the component tree

### Rendering Strategies — Complete Guide

**Static Site Generation (SSG) — Build Time:**
\`\`\`typescript
// This page is rendered at build time and served as static HTML
// Default behavior when there's no dynamic data
export default function AboutPage() {
  return <h1>About the RAG Eval Engine</h1>;
}
\`\`\`

**Server-Side Rendering (SSR) — Per Request:**
\`\`\`typescript
// Force dynamic rendering by using cache: "no-store"
export default async function EvalPage() {
  const data = await fetch("http://backend:8000/eval", {
    cache: "no-store", // Opt into SSR — render on every request
  });
  return <EvalDashboard data={await data.json()} />;
}
\`\`\`

**Incremental Static Regeneration (ISR) — Cached with Revalidation:**
\`\`\`typescript
// Static page that revalidates every 60 seconds in the background
export default async function MetricsPage() {
  const data = await fetch("http://backend:8000/metrics", {
    next: { revalidate: 60 }, // Revalidate every 60 seconds
  });
  return <MetricsDashboard data={await data.json()} />;
}
\`\`\`

**Client-Side Rendering (CSR) — Browser Only:**
\`\`\`typescript
"use client";
// Only renders in the browser — useful for user-specific interactive content
export function UserQueryHistory() {
  const [history, setHistory] = useState([]);
  useEffect(() => {
    fetch("/api/history").then((r) => r.json()).then(setHistory);
  }, []);
  return <QueryList items={history} />;
}
\`\`\`

### Data Fetching and Caching

Next.js extends the native \`fetch()\` API with automatic caching and deduplication:

\`\`\`typescript
// Cached indefinitely (static data)
fetch("https://api.example.com/data");

// Revalidate every 60 seconds
fetch("https://api.example.com/data", { next: { revalidate: 60 } });

// Never cached (always fresh)
fetch("https://api.example.com/data", { cache: "no-store" });

// Revalidate on demand (triggered by server action)
import { revalidatePath, revalidateTag } from "next/cache";

// Tag-based revalidation
fetch("https://api.example.com/eval", { next: { tags: ["eval-results"] } });
// Later, in a server action:
revalidateTag("eval-results"); // Purge all fetches with this tag
\`\`\`

**Request Deduplication:** If multiple server components fetch the same URL with the same options during a single render, Next.js deduplicates the request — only one network call is made.

### Route Handlers (API Routes)

\`\`\`typescript
// app/api/query/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  // Proxy to FastAPI backend
  const response = await fetch("http://localhost:8000/query", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  // Stream the response back to the client
  return new NextResponse(response.body, {
    headers: { "Content-Type": "text/event-stream" },
  });
}
\`\`\`

### Middleware

\`\`\`typescript
// middleware.ts (root of project)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Check authentication
  const token = request.cookies.get("auth-token");
  if (!token && !request.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Add custom headers
  const response = NextResponse.next();
  response.headers.set("x-request-id", crypto.randomUUID());
  return response;
}

export const config = {
  matcher: ["/documents/:path*", "/query/:path*", "/eval/:path*", "/metrics/:path*"],
};
\`\`\`

### Image and Font Optimization

\`\`\`typescript
import Image from "next/image";
import { Inter } from "next/font/google";

// Font — downloaded at build time, self-hosted, zero layout shift
const inter = Inter({ subsets: ["latin"] });

// Image — automatic resize, WebP/AVIF conversion, lazy loading
export function DocumentThumbnail({ src }: { src: string }) {
  return (
    <Image
      src={src}
      alt="Document preview"
      width={200}
      height={280}
      placeholder="blur"
      priority={false} // Lazy load below-the-fold images
    />
  );
}
\`\`\`

### Metadata API for SEO

\`\`\`typescript
import type { Metadata } from "next";

// Static metadata
export const metadata: Metadata = {
  title: "RAG Eval Engine — Dashboard",
  description: "Monitor RAG quality metrics and evaluation results",
  openGraph: {
    title: "RAG Eval Engine",
    description: "Production-grade RAG evaluation dashboard",
  },
};

// Dynamic metadata (per-page)
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const evalRun = await fetch(\`http://backend:8000/eval/\${params.id}\`);
  const data = await evalRun.json();
  return {
    title: \`Eval Run \${data.id} — \${data.status}\`,
    description: \`Faithfulness: \${data.faithfulness}, Relevance: \${data.relevance}\`,
  };
}
\`\`\``,
      prosAndCons: {
        pros: [
          "Full-stack framework — frontend + backend in one project",
          "Multiple rendering strategies (SSR, SSG, ISR, CSR, PPR)",
          "React Server Components dramatically reduce client-side JavaScript",
          "Excellent DX — fast refresh, TypeScript support, built-in optimizations",
          "Vercel deployment is seamless, but works on any Node.js host",
          "Massive ecosystem and community — most popular React framework",
          "Built-in image, font, and script optimization",
          "Streaming and Suspense support for progressive rendering",
          "Middleware for edge-level request processing",
          "File-based routing eliminates boilerplate route configuration",
        ],
        cons: [
          "Complex mental model — server vs client components, caching layers, rendering strategies",
          "Vercel-optimized — some features (ISR, edge functions) work best on Vercel's platform",
          "Bundle size can grow with heavy client-side dependencies",
          "App Router is still evolving — caching behavior changed significantly between versions",
          "Build times increase with project size, especially with many static pages",
          "Server component debugging is harder than client-side debugging",
          "The abstraction between server and client can lead to confusing serialization errors",
          "Learning curve is steep for developers new to RSC and the App Router paradigm",
        ],
      },
      alternatives: [
        {
          name: "Remix",
          comparison: "Web-standards focused React framework. Better data loading patterns (loaders/actions), progressive enhancement by default, simpler mental model. Now merged with React Router v7. Less opinionated about caching than Next.js.",
        },
        {
          name: "Astro",
          comparison: "Content-focused framework with island architecture. Ships zero JavaScript by default — only hydrates interactive components. Excellent for content sites, documentation, and blogs. Less suitable for highly interactive dashboard applications.",
        },
        {
          name: "SvelteKit",
          comparison: "Svelte-based framework. Smaller bundle sizes (Svelte compiles away the framework), simpler reactivity model (no useState/useEffect), but smaller ecosystem and fewer job opportunities than React/Next.js.",
        },
        {
          name: "Nuxt",
          comparison: "Vue.js equivalent of Next.js. Similar features (SSR, SSG, file-based routing, auto-imports). Choose Nuxt if your team prefers Vue's template syntax and Options/Composition API over React's JSX.",
        },
      ],
      keyAPIs: [
        "page.tsx — route page component (the UI for a URL segment)",
        "layout.tsx — shared layout that persists across navigations",
        "loading.tsx — Suspense-based loading UI per route segment",
        "error.tsx — error boundary per route segment",
        "not-found.tsx — 404 UI per route segment",
        "route.ts — API endpoint with GET/POST/PUT/DELETE handlers",
        "middleware.ts — edge middleware for request interception",
        "next/image — automatic image optimization component",
        "next/link — client-side navigation with prefetching",
        "next/font — zero-CLS font loading",
        "next/headers — read request headers in server components",
        "next/navigation — useRouter, usePathname, useSearchParams hooks",
        "generateMetadata() — dynamic SEO metadata per page",
        "generateStaticParams() — define static paths for dynamic routes",
        "revalidatePath() / revalidateTag() — on-demand cache invalidation",
        "redirect() / notFound() — server-side navigation helpers",
      ],
      academicFoundations: `**Server-Side Rendering and the Request-Response Model:** SSR returns to the original web model (CGI, PHP, JSP) where servers generate HTML per request. The innovation in modern SSR is combining server rendering with client-side hydration — the server sends fully-rendered HTML for fast initial load (First Contentful Paint), then React "hydrates" it into an interactive single-page application. This gives the best of both worlds: fast initial render (server) + rich interactivity (client).

**Incremental Static Regeneration and Cache Theory:** ISR implements a stale-while-revalidate caching strategy derived from HTTP caching theory (RFC 5861). The key insight is that serving stale content immediately while revalidating in the background provides better user experience than waiting for fresh content. This is a practical application of the cache coherence problem from distributed systems — how do you serve content that is both fast (cached) and fresh (up-to-date)?

**React Server Components and Partial Hydration:** RSCs implement a form of partial hydration — only interactive components are sent as JavaScript to the client. Static content stays as HTML. This builds on the "islands architecture" concept (Jason Miller, 2020), where a sea of static HTML contains interactive "islands" of JavaScript. RSCs take this further by letting the server and client components interleave freely in the component tree. The theoretical basis connects to the actor model — server and client components communicate through a serialization boundary (the RSC wire format).

**Streaming and Progressive Rendering:** Next.js supports streaming HTML with React Suspense boundaries. This is based on chunked transfer encoding (HTTP/1.1) and the progressive rendering model where the browser renders content as it arrives rather than waiting for the full response. The theoretical basis is pipeline parallelism — different stages of rendering (data fetching, HTML generation, client hydration) overlap in time.

**Edge Computing and CDN Theory:** Next.js Middleware runs at the edge (CDN edge locations worldwide). This is an application of content distribution network theory — move computation closer to the user to reduce latency. Edge middleware enables sub-50ms response times for authentication, redirects, and request rewriting by avoiding round trips to the origin server.

**File-System Routing and Convention over Configuration:** The App Router's file-based routing embodies the "convention over configuration" principle (popularized by Ruby on Rails). Instead of declarative route configuration, the file system structure IS the route structure. This reduces boilerplate and makes the application's URL structure immediately visible from the project directory.

**Compositional Layout Architecture:** The nested layout system in the App Router implements a compositional UI pattern where each route segment can define its own layout that wraps child segments. This is based on the composite pattern (GoF) and enables persistent UI (layouts don't re-render on navigation) with isolated data fetching per segment.`,
      furtherReading: [
        "Next.js documentation — nextjs.org/docs",
        "React documentation — react.dev",
        "React Server Components RFC — github.com/reactjs/rfcs/pull/188",
        "Patterns.dev — rendering patterns for the web",
        "Islands Architecture — jasonformat.com/islands-architecture",
        "HTTP Caching (RFC 7234) and Stale-While-Revalidate (RFC 5861)",
        "Lee Robinson — Understanding React Server Components (Vercel blog)",
        "Dan Abramov — The Two Reacts (overreacted.io)",
      ],
    },
  ],
};
