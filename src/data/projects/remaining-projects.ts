import type { Project } from "../types";

export const animatedWebGL: Project = {
  id: "animated-webgl-library",
  name: "Animated WebGL Library",
  description:
    "50+ Interactive Mindful Journey Visualizations built with pure WebGL/Canvas — no frameworks, no dependencies.",
  repo: "https://github.com/aptsalt/animated-webgl-library",
  languages: ["JavaScript", "HTML", "GLSL"],
  designPatterns: [
    {
      name: "Game Loop Pattern",
      category: "behavioral",
      whatItIs: "A continuous loop that processes input, updates state, and renders each frame at a fixed interval (typically 60fps via requestAnimationFrame).",
      howProjectUsesIt: "Every visualization runs a requestAnimationFrame loop that updates uniforms (time, mouse position) and issues WebGL/Canvas draw calls each frame.",
    },
    {
      name: "State Machine Pattern",
      category: "behavioral",
      whatItIs: "An object transitions between a finite set of states based on events, with each state defining allowed transitions and behaviors.",
      howProjectUsesIt: "Visualization transitions manage states (loading, running, paused, transitioning) to control animation flow and handle user-triggered visualization switches.",
    },
    {
      name: "Strategy Pattern",
      category: "behavioral",
      whatItIs: "Defines a family of interchangeable algorithms, encapsulating each one so they can be swapped at runtime without changing the client code.",
      howProjectUsesIt: "Multiple rendering techniques (WebGL shaders, Canvas 2D, particle systems) are interchangeable strategies — each visualization selects the appropriate renderer.",
    },
    {
      name: "Module Pattern",
      category: "structural",
      whatItIs: "Uses closures (typically IIFEs) to encapsulate private state and expose a public API, preventing global namespace pollution.",
      howProjectUsesIt: "Each visualization is wrapped in an IIFE that encapsulates canvas state, animation variables, and event handlers — isolating each visualization's scope.",
    },
    {
      name: "Observer Pattern",
      category: "behavioral",
      whatItIs: "An object (subject) maintains a list of dependents (observers) that are notified automatically when the subject's state changes.",
      howProjectUsesIt: "Mouse and touch event listeners observe user input and notify the rendering loop of coordinate changes, which are passed to shaders as uniforms.",
    },
  ],
  keyTakeaways: [
    "WebGL provides direct GPU access from the browser — essential for real-time graphics.",
    "Shader programming (GLSL) is fundamentally different from CPU programming — you think in parallel per-pixel operations.",
    "requestAnimationFrame is the correct way to create smooth 60fps animations in the browser.",
    "Canvas 2D API is sufficient for many visualizations — WebGL is needed only for GPU-intensive effects.",
    "Pure JavaScript without frameworks demonstrates the fundamentals that frameworks abstract away.",
  ],
  coreConcepts: [
    {
      name: "GPU Programming",
      slug: "gpu-programming",
      whatItIs: "Writing code that runs on the Graphics Processing Unit instead of the CPU. GPUs excel at parallel operations — executing the same instruction on thousands of data points simultaneously, making them ideal for graphics rendering.",
      whyItMatters: "CPUs process instructions sequentially (fast at one thing at a time). GPUs process thousands of operations in parallel. For graphics where every pixel needs independent computation, GPUs are orders of magnitude faster.",
      howProjectUsesIt: "Each visualization runs vertex and fragment shaders on the GPU. The GPU simultaneously computes the position and color of thousands of particles every frame at 60fps — work that would be impossibly slow on the CPU.",
      keyTerms: [
        { term: "SIMD", definition: "Single Instruction Multiple Data — the GPU executes the same shader on thousands of pixels simultaneously" },
        { term: "Vertex Shader", definition: "GPU program that runs once per vertex, positioning geometry in screen space" },
        { term: "Fragment Shader", definition: "GPU program that runs once per pixel, computing the final color" },
      ],
    },
    {
      name: "Shaders (GLSL)",
      slug: "shaders-glsl",
      whatItIs: "Small programs written in GLSL (OpenGL Shading Language) that run on the GPU. Vertex shaders position geometry, fragment shaders color pixels. Shaders are the programmable stages of the graphics pipeline.",
      whyItMatters: "Shaders enable per-pixel effects that would be impossible with CPU rendering — procedural textures, lighting, distortions, and particle effects all computed in real-time across millions of pixels simultaneously.",
      howProjectUsesIt: "50+ visualizations use custom GLSL shaders for procedural effects — noise-based gradients, ripple distortions, color cycling, particle glow effects. Uniform variables pass time and mouse position for interactivity.",
      keyTerms: [
        { term: "GLSL", definition: "OpenGL Shading Language — C-like language for GPU shader programs" },
        { term: "Uniform", definition: "A variable passed from JavaScript to the shader, constant across all vertices/fragments in a draw call" },
        { term: "Attribute", definition: "Per-vertex data (position, color) passed to the vertex shader" },
      ],
    },
    {
      name: "Rendering Pipeline",
      slug: "rendering-pipeline",
      whatItIs: "The sequence of stages that transforms 3D/2D geometry into pixels on screen: vertex processing → primitive assembly → rasterization → fragment processing → framebuffer output.",
      whyItMatters: "Understanding the pipeline is essential for GPU programming. Each stage has specific inputs, outputs, and programmable points. Knowing which stage to modify for each effect determines rendering performance and visual quality.",
      howProjectUsesIt: "JavaScript sets up buffers and uniforms, vertex shaders position particles, the rasterizer determines pixel coverage, fragment shaders compute per-pixel colors, and the result displays on the canvas at 60fps.",
      keyTerms: [
        { term: "Rasterization", definition: "Converting vector geometry into discrete pixels (fragments) for the fragment shader" },
        { term: "Framebuffer", definition: "The memory region holding the final pixel colors displayed on screen" },
        { term: "Draw Call", definition: "A JavaScript command telling the GPU to render geometry (gl.drawArrays, gl.drawElements)" },
      ],
    },
    {
      name: "Procedural Generation",
      slug: "procedural-generation",
      whatItIs: "Creating content algorithmically using mathematical functions rather than manually designing each element. Noise functions, sine waves, and random generators produce organic, infinitely variable patterns.",
      whyItMatters: "Procedural generation creates infinite variety from small programs. Instead of storing textures and animations as files, mathematical functions generate them in real-time, using minimal memory and enabling interactive parameters.",
      howProjectUsesIt: "Visualizations use Perlin/simplex noise for organic patterns, sine wave functions for smooth color palettes (rgb = 0.5 + 0.5 * sin(freq * t + phase)), and parametric equations for particle trajectories.",
      keyTerms: [
        { term: "Perlin Noise", definition: "Gradient noise function producing smooth, natural-looking random patterns" },
        { term: "Sine Wave Palette", definition: "Using sin() to generate smooth, cycling color gradients mathematically" },
        { term: "Parametric Equations", definition: "Expressing positions as functions of time: x(t), y(t) for animated trajectories" },
      ],
    },
  ],
  videoResources: [
    {
      title: "But what is a Neural Network?",
      url: "https://www.youtube.com/watch?v=aircAruvnKk",
      channel: "3Blue1Brown",
      durationMinutes: 19,
      relevance: "3Blue1Brown's visual explanation style is exactly what these WebGL visualizations achieve",
    },
    {
      title: "WebGL Fundamentals",
      url: "https://www.youtube.com/watch?v=kB0ZVUrI4Aw",
      channel: "Indigo Code",
      durationMinutes: 25,
      relevance: "Introduction to WebGL programming concepts used in every visualization",
    },
    {
      title: "The Art of Code",
      url: "https://www.youtube.com/watch?v=4Se0_w0ISYk",
      channel: "Big Think",
      durationMinutes: 10,
      relevance: "Creative coding philosophy behind generative art and procedural visualizations",
    },
    {
      title: "Shader Coding Introduction",
      url: "https://www.youtube.com/watch?v=f4s1h2YETNY",
      channel: "kishimisu",
      durationMinutes: 15,
      relevance: "GLSL shader programming techniques used throughout the library",
    },
  ],
  realWorldExamples: [
    {
      company: "Google",
      product: "Chrome Experiments",
      description: "Google's Chrome Experiments showcase creative WebGL/Canvas projects that push browser capabilities — the same pure-web graphics approach.",
      conceptConnection: "Browser-based creative coding with WebGL",
    },
    {
      company: "Shadertoy",
      product: "Shadertoy.com",
      description: "Community platform for sharing GLSL fragment shaders. Each shader is a self-contained procedural artwork — the same shader-based approach used in these visualizations.",
      conceptConnection: "Procedural shader-based visual generation",
    },
    {
      company: "Spotify",
      product: "Spotify Wrapped",
      description: "Spotify's annual Wrapped feature uses WebGL animations and particle effects to create personalized, visually stunning data stories.",
      conceptConnection: "WebGL particle effects in production web applications",
    },
  ],
  cicd: {
    overview: "Zero build pipeline — pure HTML/JavaScript served directly with no bundler, transpiler, or framework.",
    stages: [
      {
        name: "No Build Step",
        tool: "None",
        description: "Pure HTML/JS files served directly, no compilation needed",
      },
      {
        name: "Deployment",
        tool: "Static Hosting",
        description: "Deploy to GitHub Pages, Netlify, or any CDN - static file hosting",
      },
    ],
  },
  architecture: [
    {
      title: "Rendering Architecture",
      content: `Each visualization is a self-contained HTML file with embedded JavaScript:

1. **Canvas Setup:** Create canvas element, get WebGL or 2D context
2. **Shader Compilation:** Compile vertex and fragment shaders (WebGL only)
3. **Game Loop:** requestAnimationFrame drives the animation at 60fps
4. **State Update:** Update particle positions, colors, transforms each frame
5. **Render:** Draw to canvas using WebGL draw calls or Canvas 2D API
6. **Input:** Mouse/touch events modify visualization parameters`,
    },
  ],
  technologies: [
    {
      name: "WebGL",
      category: "library",
      icon: "GL",
      tagline: "GPU-accelerated graphics in the browser",
      origin: {
        creator: "Khronos Group (based on OpenGL ES 2.0)",
        year: 2011,
        motivation:
          "Before WebGL, browser graphics were limited to Canvas 2D, SVG, and Flash. WebGL brought GPU-accelerated 3D graphics to the web without plugins, based on the OpenGL ES standard used in mobile devices.",
      },
      whatItIs: `WebGL (Web Graphics Library) is a JavaScript API for rendering 2D and 3D graphics using the GPU:

- **GPU Access:** Direct access to the graphics processing unit from JavaScript
- **Shader-Based:** Programmable vertex and fragment shaders in GLSL
- **Based on OpenGL ES 2.0/3.0:** Web adaptation of the mobile OpenGL standard
- **Hardware-Accelerated:** Orders of magnitude faster than CPU rendering
- **WebGL 2.0:** Based on OpenGL ES 3.0, adds instanced rendering, transform feedback, MRT`,
      explainLikeImTen: `Your computer has two brains — the regular brain (CPU) that does math, runs programs, and thinks about things one at a time, and a special art brain (GPU) that can paint millions of tiny dots on the screen all at once. WebGL is like a walkie-talkie that lets your web browser talk directly to the art brain. Instead of the regular brain slowly drawing one dot at a time, the art brain paints the entire picture in one go. That's why WebGL animations are so smooth and fast — the art brain was literally built for this job.`,
      realWorldAnalogy: `WebGL is like the difference between one person painting a mural versus a thousand people each painting one tile simultaneously. The CPU (one painter) handles things sequentially — draw pixel 1, then pixel 2, then pixel 3. The GPU via WebGL (a thousand painters) handles all pixels at the same time. Each painter follows the same instructions (the shader program) but paints their own specific tile. This massive parallelism is why a GPU can render millions of particles in real time.`,
      whyWeUsedIt: `50+ visualizations with particles, fluid simulations, and generative art require GPU acceleration:
- Thousands of particles rendered simultaneously
- Per-pixel shader effects (gradients, noise, distortion)
- Real-time at 60fps — impossible with Canvas 2D alone
- No framework needed — direct WebGL API for maximum control and learning`,
      howItWorksInProject: `- Each visualization creates a WebGL context on a canvas element
- Vertex shaders position geometry (particles, meshes)
- Fragment shaders color each pixel (procedural effects)
- Uniform variables pass time, mouse position, and parameters to shaders
- Some simpler visualizations use Canvas 2D API instead`,
      featuresInProject: [
        {
          feature: "Particle systems with thousands of simultaneous particles",
          description: "WebGL renders 5,000-50,000 particles per visualization in real time, each with independent position, velocity, color, and size — updated every frame via vertex buffer updates and rendered as GL_POINTS.",
        },
        {
          feature: "Procedural fragment shader effects",
          description: "Fragment shaders generate per-pixel procedural effects — noise-based gradients, ripple distortions, color cycling, and organic patterns — all computed on the GPU without pre-baked textures.",
        },
        {
          feature: "Interactive mouse/touch-driven parameters",
          description: "Mouse position and touch coordinates are passed to shaders as uniform variables, allowing users to interact with visualizations — attracting particles, distorting fields, and changing color palettes in real time.",
        },
        {
          feature: "Real-time 60fps animation loop",
          description: "requestAnimationFrame drives a game loop that updates uniforms (time, mouse position) and issues draw calls each frame, maintaining smooth 60fps rendering across all 50+ visualizations.",
        },
        {
          feature: "Shader-based color palettes and gradients",
          description: "Color palettes are computed mathematically in GLSL using sine wave functions — rgb = 0.5 + 0.5 * sin(frequency * t + phase) — producing smooth, infinitely variable color gradients without texture lookups.",
        },
      ],
      coreConceptsMarkdown: `### WebGL Pipeline

\`\`\`
JavaScript (CPU) → Vertex Shader (GPU) → Rasterizer → Fragment Shader (GPU) → Framebuffer → Screen
\`\`\`

1. **JavaScript:** Sets up buffers, uniforms, and issues draw calls
2. **Vertex Shader:** Runs per-vertex, positions geometry in clip space
3. **Rasterizer:** Determines which pixels each triangle covers
4. **Fragment Shader:** Runs per-pixel, computes color
5. **Framebuffer:** Final pixel colors displayed on screen

### Shaders (GLSL)

\`\`\`glsl
// Vertex Shader — runs once per vertex
attribute vec2 a_position;
uniform float u_time;

void main() {
  vec2 pos = a_position;
  pos.y += sin(pos.x * 3.0 + u_time) * 0.1; // wave effect
  gl_Position = vec4(pos, 0.0, 1.0);
  gl_PointSize = 3.0;
}

// Fragment Shader — runs once per pixel
precision mediump float;
uniform float u_time;
uniform vec2 u_resolution;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float r = 0.5 + 0.5 * sin(u_time + uv.x * 6.28);
  float g = 0.5 + 0.5 * sin(u_time + uv.y * 6.28 + 2.0);
  float b = 0.5 + 0.5 * sin(u_time + 4.0);
  gl_FragColor = vec4(r, g, b, 1.0);
}
\`\`\`

### Game Loop

\`\`\`javascript
function render(time) {
  time *= 0.001; // convert to seconds

  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.uniform1f(timeLocation, time);
  gl.drawArrays(gl.POINTS, 0, particleCount);

  requestAnimationFrame(render);
}
requestAnimationFrame(render);
\`\`\`

### GPU vs CPU Rendering

| Aspect | CPU (Canvas 2D) | GPU (WebGL) |
|--------|-----------------|-------------|
| Parallelism | Sequential | Massively parallel |
| Particles | ~1,000 @ 60fps | ~1,000,000 @ 60fps |
| Per-pixel effects | Very slow | Native (fragment shader) |
| API complexity | Simple | Complex |
| Debugging | Browser DevTools | Specialized tools (Spector.js) |`,
      prosAndCons: {
        pros: [
          "GPU acceleration — orders of magnitude faster than CPU rendering",
          "Real-time 3D and 2D graphics at 60fps",
          "No plugins — runs in every modern browser",
          "Shader programming enables creative per-pixel effects",
          "Hardware-accelerated particle systems and simulations",
          "Foundation for Three.js, Babylon.js, and all web 3D libraries",
        ],
        cons: [
          "Extremely verbose API — hundreds of lines for a simple triangle",
          "GLSL debugging is painful — no console.log, limited error messages",
          "Cross-browser/device compatibility issues",
          "No built-in scene graph, physics, or asset loading",
          "Security restrictions (cross-origin textures, fingerprinting concerns)",
          "Steep learning curve — need to understand GPU architecture",
        ],
      },
      alternatives: [
        {
          name: "Three.js",
          comparison: "High-level 3D library built on WebGL. Scene graph, lights, cameras, materials. 100x less code for 3D scenes but abstracts away the GPU concepts.",
        },
        {
          name: "Canvas 2D",
          comparison: "Simpler CPU-based 2D drawing API. Easy to learn but much slower. Good for charts and simple animations but can't handle particles or shaders.",
        },
        {
          name: "WebGPU",
          comparison: "Next-generation GPU API (successor to WebGL). Based on Vulkan/Metal/D3D12. Compute shaders, better performance, modern API. Still gaining browser support.",
        },
        {
          name: "SVG",
          comparison: "Vector graphics as DOM elements. Scalable and interactive but very slow for many elements (>1000). Best for charts, icons, and simple animations.",
        },
      ],
      keyAPIs: [
        "gl.createShader/compileShader — shader compilation",
        "gl.createProgram/linkProgram — shader program linking",
        "gl.createBuffer/bufferData — vertex data upload",
        "gl.uniform* — pass data to shaders",
        "gl.drawArrays/drawElements — render geometry",
        "requestAnimationFrame — animation loop",
      ],
      academicFoundations: `**Computer Graphics Pipeline (Sutherland, 1963):** The rendering pipeline (vertex → rasterization → fragment) dates back to Ivan Sutherland's Sketchpad, the first interactive computer graphics program. WebGL implements a programmable version of this pipeline.

**Shader Programming (Cook, 1984):** Rob Cook's shade trees introduced the concept of programmable shading. Modern GLSL shaders descend from the RenderMan Shading Language. Each fragment shader execution is an independent parallel computation — the GPU runs thousands simultaneously.

**Parallel Computing (SIMD):** GPUs are SIMD (Single Instruction, Multiple Data) processors. The same shader program runs on thousands of pixels simultaneously. This is fundamentally different from CPU programming and is the source of GPU's performance advantage.

**Procedural Generation (Perlin, 1985):** Ken Perlin's noise function, created for the film Tron, is the foundation of procedural texture generation. Many WebGL visualizations use Perlin/Simplex noise to create organic-looking patterns.`,
      furtherReading: [
        "WebGL Fundamentals — webglfundamentals.org",
        "The Book of Shaders — thebookofshaders.com",
        "Learn OpenGL — learnopengl.com (concepts apply to WebGL)",
        "GPU Gems — developer.nvidia.com/gpugems",
      ],
    },
    {
      name: "JavaScript",
      category: "language",
      icon: "JS",
      tagline: "The language of the web",
      origin: {
        creator: "Brendan Eich at Netscape",
        year: 1995,
        motivation:
          "Netscape needed a scripting language for the browser to make web pages interactive. Brendan Eich created JavaScript in 10 days, originally named Mocha, then LiveScript. Despite the name, it has no relation to Java — the name was a marketing decision to ride Java's popularity.",
      },
      whatItIs: `JavaScript is the programming language of the web:
- **Dynamic Typing:** Variables can hold any type, types are checked at runtime
- **Prototype-Based OOP:** Objects inherit directly from other objects (no classes needed)
- **First-Class Functions:** Functions are values — pass them, return them, store them
- **Event Loop:** Single-threaded with asynchronous I/O via the event loop
- **ECMAScript Standard:** Evolved through TC39 proposals (ES6/2015 was a major milestone)
- **Universal:** Runs in browsers, servers (Node.js), mobile (React Native), desktop (Electron)`,
      explainLikeImTen: `JavaScript is the language that makes websites DO things. HTML is like the skeleton of a webpage (the structure), CSS is like the clothes (how it looks), and JavaScript is the muscles and brain (what it can do). When you click a button and something happens, that's JavaScript. When a game runs in your browser, that's JavaScript. It's the only programming language that every web browser in the world understands, which is why it's used on almost every website ever made.`,
      realWorldAnalogy: `JavaScript is like English for international business — it's not necessarily the best language for every task, but it's the one everyone agrees to use. Just as English became the lingua franca of global commerce because it was already widespread (British Empire, then American tech), JavaScript became the lingua franca of programming because it was already in every browser. It has quirks and inconsistencies, but its universality makes it indispensable.`,
      whyWeUsedIt: `The WebGL library is intentionally framework-free:
- Pure JavaScript with no build step, no transpilation, no dependencies
- Direct browser APIs (WebGL, Canvas 2D, requestAnimationFrame) are all JavaScript
- Each visualization is a single HTML file with embedded JavaScript
- Demonstrates fundamental concepts without framework abstractions
- Maximum portability — works in any browser without tooling`,
      howItWorksInProject: `- Each visualization is a self-contained script using ES6+ features
- Module Pattern (IIFE) encapsulates each visualization's state
- Event listeners handle mouse/touch input for interactivity
- requestAnimationFrame drives the animation loop
- Math functions compute particle physics, wave equations, and noise`,
      featuresInProject: [
        {
          feature: "Self-contained visualization scripts",
          description: "Each of the 50+ visualizations is a standalone JavaScript file with no imports or dependencies — all WebGL setup, shader compilation, animation logic, and input handling in a single file.",
        },
        {
          feature: "requestAnimationFrame game loop",
          description: "Every visualization uses requestAnimationFrame for its animation loop, ensuring 60fps rendering that automatically pauses when the tab is hidden — saving CPU/GPU resources.",
        },
        {
          feature: "Mouse/touch event handling",
          description: "JavaScript event listeners capture mousemove, mousedown, touchstart, and touchmove events, normalizing coordinates and passing them as parameters to WebGL shaders or Canvas 2D draw calls.",
        },
        {
          feature: "Mathematical animation functions",
          description: "JavaScript's Math library (Math.sin, Math.cos, Math.random, Math.PI) drives particle motion, wave equations, Lissajous curves, and parametric equations that create the organic visual patterns.",
        },
        {
          feature: "Dynamic canvas sizing",
          description: "JavaScript handles window resize events to dynamically update canvas dimensions and WebGL viewport, ensuring visualizations fill the screen and maintain correct aspect ratios on any device.",
        },
      ],
      coreConceptsMarkdown: `### Module Pattern (IIFE)

\`\`\`javascript
// Each visualization is encapsulated
(function() {
  const canvas = document.getElementById("canvas");
  const gl = canvas.getContext("webgl");

  // Private state
  let time = 0;
  let mouseX = 0;
  let mouseY = 0;

  // Animation loop
  function render() {
    time += 0.016;
    gl.uniform1f(timeLocation, time);
    gl.uniform2f(mouseLocation, mouseX, mouseY);
    gl.drawArrays(gl.POINTS, 0, particleCount);
    requestAnimationFrame(render);
  }

  // Input handling
  canvas.addEventListener("mousemove", (e) => {
    mouseX = e.clientX / canvas.width;
    mouseY = 1.0 - e.clientY / canvas.height;
  });

  render();
})();
\`\`\`

### Event Loop & requestAnimationFrame

\`\`\`
Call Stack → Web APIs → Callback Queue → Event Loop → Call Stack
                ↑
    requestAnimationFrame (syncs to display refresh rate)
\`\`\`

### ES6+ Features Used

- \`const\`/\`let\` — block-scoped variables
- Arrow functions — concise function syntax
- Template literals — string interpolation for shader source
- Destructuring — extract values from objects/arrays
- \`Math.*\` — trigonometric functions for animations`,
      prosAndCons: {
        pros: [
          "Universal — runs in every browser, no compilation needed",
          "Huge ecosystem — npm has 2M+ packages",
          "First-class functions enable functional programming patterns",
          "Async/await for clean asynchronous code",
          "Constant language evolution via TC39 proposals",
          "Can be used for frontend, backend, mobile, and desktop",
        ],
        cons: [
          "Dynamic typing leads to runtime errors (solved by TypeScript)",
          "Quirky type coercion ([] + {} === '[object Object]')",
          "Single-threaded — CPU-intensive work blocks the UI",
          "No built-in module system until ES6 (2015)",
          "Prototype-based OOP confuses developers from class-based languages",
          "Browser inconsistencies still exist for newer APIs",
        ],
      },
      alternatives: [
        {
          name: "TypeScript",
          comparison: "Typed superset of JavaScript. Catches errors at compile time. Industry standard for large projects. Adds build step but vastly improves reliability.",
        },
        {
          name: "WebAssembly (WASM)",
          comparison: "Low-level binary format for the web. Near-native performance. Compiled from C/C++/Rust. Better for computation-heavy tasks but can't directly manipulate the DOM.",
        },
        {
          name: "Dart",
          comparison: "Google's language for Flutter. Can compile to JavaScript. Stronger type system but tiny web ecosystem compared to JavaScript.",
        },
      ],
      keyAPIs: [
        "document.getElementById/querySelector — DOM access",
        "addEventListener — event handling",
        "requestAnimationFrame — animation loop",
        "Math.sin/cos/random/PI — mathematical functions",
        "canvas.getContext('webgl') — WebGL context creation",
        "canvas.getContext('2d') — Canvas 2D context creation",
      ],
      academicFoundations: `**Lambda Calculus (Church, 1936):** JavaScript's first-class functions (functions as values) are rooted in Alonzo Church's lambda calculus. Closures — functions that capture their enclosing scope — are a direct implementation of lambda expressions with free variables.

**Prototype-Based Inheritance (Self, 1987):** JavaScript's prototype chain is based on the Self programming language (David Ungar, Randall Smith). Objects delegate to other objects directly, without classes. This is simpler than class-based inheritance but less familiar to most developers.

**Event-Driven Programming:** JavaScript's event loop model (event listeners, callbacks, promises) implements the reactor pattern — a single thread processes events from a queue. This model, combined with non-blocking I/O, enables high concurrency without threads.

**Scheme Influence:** Brendan Eich was originally hired to put Scheme (a Lisp dialect) in the browser. JavaScript inherited Scheme's first-class functions, closures, and dynamic typing, wrapped in C/Java-like syntax for familiarity.`,
      furtherReading: [
        "MDN JavaScript Guide — developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
        "You Don't Know JS (book series) by Kyle Simpson",
        "Eloquent JavaScript by Marijn Haverbeke — eloquentjavascript.net",
        "JavaScript: The Good Parts by Douglas Crockford",
      ],
    },
    {
      name: "Canvas 2D API",
      category: "library",
      icon: "C2",
      tagline: "Immediate-mode 2D drawing in the browser",
      origin: {
        creator: "Apple (introduced in Safari, standardized by WHATWG/W3C)",
        year: 2004,
        motivation:
          "Before Canvas, dynamic graphics in the browser required Flash, Java applets, or SVG. Apple introduced the <canvas> element for Dashboard widgets in Mac OS X, providing a simple immediate-mode 2D drawing API accessible from JavaScript. It was later standardized as part of HTML5.",
      },
      whatItIs: `The Canvas 2D API provides immediate-mode 2D drawing:
- **Immediate Mode:** Draw commands execute immediately (no retained scene graph)
- **Pixel-Based:** Renders to a bitmap — once drawn, pixels are "forgotten"
- **Rich Drawing API:** Lines, arcs, curves, rectangles, text, images, gradients
- **Transformations:** translate, rotate, scale, transform matrix
- **Compositing:** globalCompositeOperation for blend modes
- **Image Data:** Direct pixel manipulation via getImageData/putImageData`,
      explainLikeImTen: `Canvas 2D is like a digital whiteboard for your web browser. You give it drawing commands — "draw a circle here," "draw a line there," "fill this area with blue" — and it paints them onto a flat surface. Unlike stickers (SVG/DOM elements) that you can move around after placing them, Canvas drawings are like paint on a wall. Once it's painted, you can't grab just one circle and move it. To animate things, you erase the whole wall and repaint everything in a new position, really fast — 60 times per second — so it looks like things are moving.`,
      realWorldAnalogy: `Canvas 2D is like a flip-book animation. Each page (frame) is drawn from scratch — you draw every circle, line, and shape on a blank page. To make things move, you draw slightly different positions on each page. When you flip through the pages fast enough (60 pages per second), it looks like smooth animation. SVG/DOM elements are more like puppets on strings — you move the puppet directly. Canvas requires redrawing the whole scene, but that redrawing is extremely fast for the CPU.`,
      whyWeUsedIt: `Several of the 50+ visualizations don't need GPU power:
- Simpler particle systems (<1000 particles) run fine on the CPU
- Canvas 2D API is much simpler to learn than WebGL
- Drawing circles, lines, and basic shapes requires just a few lines of code
- No shader compilation, no buffer management, no GLSL
- Ideal for visualizations focused on geometry rather than per-pixel effects`,
      howItWorksInProject: `- Simpler visualizations use canvas.getContext("2d") instead of WebGL
- Draw commands (fillRect, arc, lineTo) build each frame
- clearRect wipes the canvas before each frame
- globalCompositeOperation creates blend effects (additive, multiply)
- Gradient fills create smooth color transitions without shaders`,
      featuresInProject: [
        {
          feature: "Simple particle systems",
          description: "Visualizations with fewer than 1,000 particles use Canvas 2D — drawing each particle as a filled circle with arc() and fill(), which is simpler to code and debug than WebGL buffer management.",
        },
        {
          feature: "Geometric pattern generation",
          description: "Sacred geometry, mandala, and tessellation visualizations use Canvas 2D's path API (moveTo, lineTo, arc) to draw precise geometric patterns with mathematical relationships.",
        },
        {
          feature: "Blend mode compositing",
          description: "globalCompositeOperation with modes like 'lighter' (additive blending) and 'multiply' creates glowing, layered visual effects — overlapping circles that brighten where they intersect.",
        },
        {
          feature: "Gradient-based color effects",
          description: "createRadialGradient and createLinearGradient produce smooth color transitions for backgrounds, particle halos, and atmospheric effects without writing GLSL shader code.",
        },
        {
          feature: "Text rendering in visualizations",
          description: "Canvas 2D's fillText and measureText APIs render dynamic text overlays — displaying visualization names, frame rates, and parameter values directly on the canvas.",
        },
      ],
      coreConceptsMarkdown: `### Basic Drawing

\`\`\`javascript
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Clear and draw each frame
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw a particle
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(100, 200, 255, 0.8)";
  ctx.fill();

  requestAnimationFrame(render);
}
\`\`\`

### Compositing (Blend Modes)

\`\`\`javascript
// Additive blending — overlapping shapes get brighter
ctx.globalCompositeOperation = "lighter";

particles.forEach((p) => {
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
  ctx.fillStyle = \`rgba(\${p.r}, \${p.g}, \${p.b}, 0.3)\`;
  ctx.fill();
});
\`\`\`

### Canvas 2D vs WebGL

| Feature | Canvas 2D | WebGL |
|---------|-----------|-------|
| Complexity | Low | High |
| Performance | CPU-bound | GPU-accelerated |
| Particles | ~1,000 @ 60fps | ~1,000,000 @ 60fps |
| Shaders | No | Yes (GLSL) |
| Per-pixel effects | Manual (getImageData) | Native |
| Learning curve | Hours | Weeks |`,
      prosAndCons: {
        pros: [
          "Simple API — draw shapes in a few lines of code",
          "No compilation, no shaders, no GPU knowledge needed",
          "Supported in every browser (wider support than WebGL)",
          "Good for charts, diagrams, and simple animations",
          "Direct pixel manipulation via getImageData",
          "Easy to combine with DOM elements and CSS",
        ],
        cons: [
          "CPU-bound — performance degrades with many objects",
          "No retained scene graph — must redraw everything each frame",
          "No built-in hit testing (must implement manually)",
          "No hardware acceleration for drawing operations",
          "Text rendering quality varies across browsers",
          "No 3D support (flat 2D only)",
        ],
      },
      alternatives: [
        {
          name: "WebGL",
          comparison: "GPU-accelerated graphics. Orders of magnitude faster for particles and effects. But far more complex — hundreds of lines for a simple triangle.",
        },
        {
          name: "SVG",
          comparison: "Retained-mode vector graphics as DOM elements. Each shape is a node you can style with CSS and attach events to. Better for interactive charts but slower for many elements.",
        },
        {
          name: "PixiJS",
          comparison: "2D rendering engine that uses WebGL (falls back to Canvas 2D). Best-of-both-worlds: simple API with GPU acceleration. Good for games and complex 2D scenes.",
        },
        {
          name: "p5.js",
          comparison: "Creative coding library inspired by Processing. Easier API for generative art. Built on Canvas 2D/WebGL. Larger bundle but faster prototyping.",
        },
      ],
      keyAPIs: [
        "ctx.fillRect / ctx.strokeRect — rectangles",
        "ctx.arc / ctx.beginPath / ctx.fill — circles and paths",
        "ctx.moveTo / ctx.lineTo — lines and polygons",
        "ctx.fillStyle / ctx.strokeStyle — colors and gradients",
        "ctx.globalCompositeOperation — blend modes",
        "ctx.getImageData / ctx.putImageData — pixel manipulation",
        "ctx.translate / ctx.rotate / ctx.scale — transformations",
      ],
      academicFoundations: `**Immediate vs Retained Mode Graphics:** Canvas 2D is immediate-mode — you issue draw commands and the result is a bitmap. SVG/DOM is retained-mode — you build a scene graph of objects. Immediate mode is simpler for animation (clear and redraw) but loses object identity. This distinction dates back to early graphics systems (GKS, 1977 vs PHIGS, 1988).

**Raster Graphics:** Canvas 2D operates on a raster (pixel grid). Drawing operations are rasterized — converted from mathematical descriptions (circle at x,y with radius r) to pixels. This is the same process GPUs perform, but Canvas 2D does it on the CPU.

**Compositing (Porter-Duff, 1984):** Canvas 2D's globalCompositeOperation implements Porter-Duff compositing operators (source-over, destination-in, lighter, etc.). These operators define how source and destination pixels combine — the mathematical foundation of all digital compositing from Photoshop to film VFX.`,
      furtherReading: [
        "MDN Canvas API — developer.mozilla.org/en-US/docs/Web/API/Canvas_API",
        "Canvas Deep Dive — joshondesign.com/p/books/canvasdeepdive",
        "HTML5 Canvas by Steve Fulton & Jeff Fulton",
      ],
    },
    {
      name: "HTML5",
      category: "language",
      icon: "H5",
      tagline: "The markup language of the web",
      origin: {
        creator: "Tim Berners-Lee (original HTML); WHATWG/W3C (HTML5)",
        year: 2014,
        motivation:
          "HTML4 was finalized in 1997 and lacked support for multimedia, rich applications, and semantic structure. The WHATWG (formed by Apple, Mozilla, Opera in 2004) developed HTML5 to replace Flash and Java applets with native browser APIs for video, audio, canvas graphics, local storage, and more.",
      },
      whatItIs: `HTML5 is the current standard for structuring web content:
- **Semantic Elements:** header, nav, main, article, section, footer
- **Canvas:** 2D and WebGL graphics rendering surface
- **Multimedia:** Native audio and video elements (no plugins)
- **Web Storage:** localStorage and sessionStorage
- **Web Workers:** Background threads for CPU-intensive tasks
- **Geolocation, Drag & Drop, File API** — rich browser APIs
- **DOCTYPE simplification:** Just \`<!DOCTYPE html>\``,
      explainLikeImTen: `HTML5 is like the blueprint for a building. It tells the browser what goes where — "put a heading here, a paragraph there, a picture over there, and a canvas for drawing in this corner." Before HTML5, if you wanted to play a video or make graphics on a website, you needed special plugins like Flash. HTML5 said "browsers should be able to do all of that on their own." The canvas element that our WebGL visualizations draw on? That's an HTML5 feature. Without it, none of the visualizations would be possible.`,
      realWorldAnalogy: `HTML5 is like a universal building code for websites. Before HTML5, building a multimedia website was like constructing a building with parts from different vendors that didn't fit together — you needed Flash for video, Java for interactive content, and various plugins for different features. HTML5 standardized everything into one building code that every browser follows. It's the foundation that says "every building must have these standard connection points for electricity (canvas), water (audio/video), and gas (storage)."`,
      whyWeUsedIt: `Every visualization starts with an HTML5 document:
- The <canvas> element provides the rendering surface for both WebGL and Canvas 2D
- No build step — pure HTML files served directly
- Semantic structure for the visualization gallery/index page
- Each visualization is a self-contained HTML file with embedded JavaScript
- HTML5 DOCTYPE triggers standards mode in all browsers`,
      howItWorksInProject: `- Each of the 50+ visualizations is a standalone HTML5 file
- <canvas> element provides the rendering surface
- <script> tags embed the JavaScript visualization code
- Minimal HTML structure — often just <canvas> and <script>
- Index page uses semantic HTML for the visualization gallery`,
      featuresInProject: [
        {
          feature: "Canvas element as rendering surface",
          description: "Every visualization uses an HTML5 <canvas> element as its rendering target — JavaScript obtains either a WebGL or 2D context from this element and draws directly to it.",
        },
        {
          feature: "Self-contained HTML files",
          description: "Each visualization is a single HTML file with embedded CSS and JavaScript — no build step, no imports, no framework. Open the file in a browser and it runs immediately.",
        },
        {
          feature: "Fullscreen canvas layout",
          description: "HTML and CSS set the canvas to fill the entire viewport (width: 100vw, height: 100vh) with no margins or scrollbars, creating an immersive visualization experience.",
        },
        {
          feature: "Gallery index page",
          description: "The main index.html uses semantic HTML5 elements (nav, main, section, article) to create a browsable gallery of all 50+ visualizations with thumbnails and descriptions.",
        },
        {
          feature: "Meta viewport for mobile support",
          description: "HTML5 meta viewport tag ensures visualizations scale correctly on mobile devices, and touch events work alongside mouse events for cross-device interactivity.",
        },
      ],
      coreConceptsMarkdown: `### Minimal Visualization Template

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Particle Flow</title>
  <style>
    * { margin: 0; padding: 0; }
    canvas { display: block; width: 100vw; height: 100vh; }
  </style>
</head>
<body>
  <canvas id="canvas"></canvas>
  <script>
    const canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const gl = canvas.getContext("webgl");
    // ... visualization code
  </script>
</body>
</html>
\`\`\`

### HTML5 Canvas Element

The \`<canvas>\` element is just a rectangular drawing surface:
- **No visual output by default** — it's a blank bitmap
- **JavaScript required** — all drawing happens via the Canvas API or WebGL API
- **Two contexts:** \`getContext("2d")\` for Canvas 2D, \`getContext("webgl")\` for WebGL
- **Pixel-based:** Canvas has width/height in pixels (different from CSS size)

### HTML5 vs Previous Standards

| Feature | HTML4 + Plugins | HTML5 |
|---------|-----------------|-------|
| Video | Flash Player | \`<video>\` native |
| Graphics | Flash/Java | \`<canvas>\` + WebGL |
| Storage | Cookies only | localStorage, IndexedDB |
| Threads | Not possible | Web Workers |
| Offline | Not possible | Service Workers, Cache API |`,
      prosAndCons: {
        pros: [
          "Universal — every browser, every device",
          "No plugins required for multimedia or graphics",
          "Semantic elements improve accessibility and SEO",
          "Canvas element enables rich graphics (2D and WebGL)",
          "Simple to learn — markup is human-readable",
          "Backwards compatible — old HTML still works",
        ],
        cons: [
          "Not a programming language — needs JavaScript for interactivity",
          "Browser inconsistencies in edge-case rendering",
          "No built-in component model (solved by React, Vue, etc.)",
          "SEO challenges for Canvas-based content (not indexable)",
          "Accessibility for Canvas content requires manual ARIA implementation",
          "Verbose — lots of boilerplate for modern applications",
        ],
      },
      alternatives: [
        {
          name: "SVG",
          comparison: "XML-based vector graphics embedded in HTML. Each element is a DOM node with CSS and events. Better for interactive diagrams, worse for pixel-heavy rendering.",
        },
        {
          name: "WebAssembly",
          comparison: "Binary instruction format for the web. Not a replacement for HTML (still needs HTML as host) but enables C/C++/Rust code to run in the browser at near-native speed.",
        },
        {
          name: "Flash (deprecated)",
          comparison: "Adobe's rich media platform. Dominated web multimedia for 15 years but was closed-source, insecure, and resource-heavy. HTML5 replaced it entirely by 2020.",
        },
      ],
      keyAPIs: [
        "<canvas> — rendering surface for 2D/WebGL graphics",
        "<video> / <audio> — native multimedia playback",
        "localStorage / sessionStorage — client-side key-value storage",
        "Geolocation API — user location access",
        "Web Workers — background thread execution",
        "Drag and Drop API — native drag interactions",
        "History API — browser history manipulation (SPA routing)",
      ],
      academicFoundations: `**Hypertext (Ted Nelson, 1963; Tim Berners-Lee, 1989):** HTML descends from Ted Nelson's concept of hypertext — documents connected by links. Tim Berners-Lee implemented this vision as HTML at CERN, creating the World Wide Web. HTML5 is the latest evolution of this 60-year-old idea.

**Separation of Concerns (Dijkstra, 1974):** The HTML/CSS/JavaScript trinity embodies separation of concerns — structure (HTML), presentation (CSS), and behavior (JavaScript) are kept in separate layers. HTML5 strengthened this separation with semantic elements that describe meaning, not appearance.

**Document Object Model (W3C, 1998):** HTML5 documents are parsed into a DOM tree — a hierarchical data structure that JavaScript can manipulate. The DOM is an application of tree data structures from computer science, enabling programmatic access to document structure.`,
      furtherReading: [
        "MDN HTML5 Guide — developer.mozilla.org/en-US/docs/Web/HTML",
        "HTML Living Standard — html.spec.whatwg.org",
        "Dive Into HTML5 — diveintohtml5.info",
      ],
    },
  ],
};

export const contextEngineeringAcademy: Project = {
  id: "context-engineering-academy",
  name: "Context Engineering Academy",
  description:
    "LLM/Agent Engineering Academy — 6 academies, 70+ modules, interactive playgrounds. Free & open source.",
  repo: "https://github.com/aptsalt/context-engineering-academy",
  languages: ["TypeScript", "CSS"],
  designPatterns: [
    {
      name: "Component Composition Pattern",
      category: "structural",
      whatItIs: "Building complex UIs by composing small, focused components together — each component handles one responsibility and delegates to children via props and slots.",
      howProjectUsesIt: "Academy pages compose ContentBlock, CodeExample, Playground, and QuizCard components into lesson layouts — each component is reusable across all 70+ modules.",
    },
    {
      name: "Content-Driven Architecture",
      category: "architectural",
      whatItIs: "Structuring the application around content models rather than UI components — content data drives rendering, routing, and navigation decisions.",
      howProjectUsesIt: "Structured data models for academies, modules, and lessons drive the entire platform — routes, navigation, and page rendering are all generated from the content schema.",
    },
    {
      name: "Module Pattern",
      category: "structural",
      whatItIs: "Organizing code into self-contained modules with clear interfaces, encapsulating internal implementation details and exposing only the public API.",
      howProjectUsesIt: "Each academy is a self-contained module with its own data, components, and routes — the course structure maps directly to the codebase organization.",
    },
    {
      name: "Observer Pattern",
      category: "behavioral",
      whatItIs: "An object (subject) maintains a list of dependents (observers) that are notified automatically when the subject's state changes.",
      howProjectUsesIt: "Progress tracking observes lesson completion events and updates the module/academy completion state, persisting progress and updating UI indicators reactively.",
    },
    {
      name: "Strategy Pattern",
      category: "behavioral",
      whatItIs: "Defines a family of interchangeable algorithms, encapsulating each one so they can be swapped at runtime without changing the client code.",
      howProjectUsesIt: "Different playground types (prompt tester, chain builder, eval runner) are interchangeable rendering strategies selected by the lesson's playgroundType discriminator.",
    },
  ],
  keyTakeaways: [
    "Content-heavy applications benefit from structured data models for courses, modules, and lessons.",
    "Interactive playgrounds embedded in educational content dramatically improve learning retention.",
    "Radix UI primitives provide accessible, unstyled components that integrate well with Tailwind CSS.",
    "shadcn/ui is not a component library — it's a collection of copy-paste components you own and customize.",
    "Next.js App Router with React Server Components enables efficient content rendering with minimal client JavaScript.",
  ],
  coreConcepts: [
    {
      name: "Context Engineering",
      slug: "context-engineering",
      whatItIs: "The discipline of designing and optimizing the context window content sent to LLMs. This includes structuring system prompts, selecting relevant examples, managing token budgets, and orchestrating multiple information sources into an effective prompt.",
      whyItMatters: "LLM output quality is directly proportional to context quality. Even the most capable model produces poor results with poorly engineered context. Context engineering is the highest-leverage skill for building effective AI applications.",
      howProjectUsesIt: "The academy teaches context engineering through 6 structured academies covering prompt engineering, context window design, agent engineering, RAG, evaluation, and deployment. Each module includes interactive playgrounds for hands-on practice.",
      keyTerms: [
        { term: "Context Window", definition: "The total input text (system prompt + user message + examples + retrieved context) sent to the LLM" },
        { term: "Token Budget", definition: "The maximum number of tokens available in the context window, typically 4K-200K depending on model" },
        { term: "System Prompt", definition: "Instructions that define the LLM's role, capabilities, and constraints" },
      ],
    },
    {
      name: "Prompt Engineering",
      slug: "prompt-engineering",
      whatItIs: "The practice of crafting effective prompts to get desired outputs from LLMs. Techniques include few-shot examples, chain-of-thought reasoning, structured output formats, and persona-based prompting.",
      whyItMatters: "The same LLM can produce vastly different quality outputs depending on how you prompt it. Systematic prompt engineering transforms LLMs from interesting demos into reliable production tools.",
      howProjectUsesIt: "The Prompt Engineering Academy covers fundamental techniques (zero-shot, few-shot, chain-of-thought, ReAct) with interactive playgrounds where learners can experiment with prompts and see results in real-time.",
      keyTerms: [
        { term: "Few-Shot Learning", definition: "Including examples in the prompt to demonstrate the desired output format and quality" },
        { term: "Chain-of-Thought", definition: "Instructing the model to show reasoning steps before providing an answer" },
        { term: "ReAct", definition: "Reasoning + Acting pattern where the model alternates between thinking and taking actions" },
      ],
    },
    {
      name: "Educational Platform Design",
      slug: "educational-platform",
      whatItIs: "Designing content-rich learning platforms with structured curricula, interactive exercises, and progressive skill building. Combines information architecture, instructional design, and interactive web technologies.",
      whyItMatters: "Effective learning requires more than text on a page. Structured curricula with interactive playgrounds, code examples, and assessments dramatically improve knowledge retention and practical skill development.",
      howProjectUsesIt: "The platform organizes 70+ modules across 6 academies using a consistent structure: theory content (Server Components), interactive playgrounds (Client Components), code examples (syntax highlighted), and quiz assessments.",
      keyTerms: [
        { term: "Academy", definition: "A top-level subject area containing multiple related modules" },
        { term: "Module", definition: "A focused learning unit within an academy, covering one concept with theory + practice" },
        { term: "Playground", definition: "An interactive client-side component where learners experiment with concepts hands-on" },
      ],
    },
  ],
  videoResources: [
    {
      title: "Prompt Engineering Guide",
      url: "https://www.youtube.com/watch?v=_ZvnD96BPQo",
      channel: "Anthropic",
      durationMinutes: 30,
      relevance: "Official Anthropic guide to prompt engineering techniques taught in the academy",
    },
    {
      title: "Context Engineering for AI Applications",
      url: "https://www.youtube.com/watch?v=dRUIGgNBvVk",
      channel: "AI Engineer",
      durationMinutes: 25,
      relevance: "Deep dive into context window optimization — the core subject of the academy",
    },
    {
      title: "Building with Next.js App Router",
      url: "https://www.youtube.com/watch?v=DrxiNfbr63s",
      channel: "Vercel",
      durationMinutes: 20,
      relevance: "App Router patterns used to build the academy platform",
    },
  ],
  realWorldExamples: [
    {
      company: "Anthropic",
      product: "Anthropic Docs",
      description: "Anthropic's official documentation includes interactive prompt examples and guides — the same educational approach for teaching effective AI usage.",
      conceptConnection: "Interactive documentation for AI prompt engineering",
    },
    {
      company: "DeepLearning.AI",
      product: "ChatGPT Prompt Engineering Course",
      description: "Andrew Ng's free course on prompt engineering covers systematic approaches to prompting — the academy expands this into a comprehensive curriculum.",
      conceptConnection: "Structured AI engineering education",
    },
    {
      company: "OpenAI",
      product: "OpenAI Cookbook",
      description: "OpenAI's collection of examples and best practices for using their API — practical recipes similar to the academy's hands-on modules.",
      conceptConnection: "Practical AI engineering guides with code examples",
    },
  ],
  cicd: {
    overview: "Standard Next.js 16 build pipeline with Tailwind CSS v4, shadcn/ui, and ESLint.",
    stages: [
      {
        name: "Linting",
        tool: "ESLint",
        description: "Next.js ESLint configuration for code quality",
        commands: ["npm run lint"],
      },
      {
        name: "Build",
        tool: "Next.js",
        description: "Production build with static generation of all academy pages",
        commands: ["npm run build"],
      },
      {
        name: "Deployment",
        tool: "Vercel",
        description: "Automated deployment with instant previews",
      },
    ],
  },
  architecture: [
    {
      title: "Academy Architecture",
      content: `The platform is structured as 6 academies, each containing multiple modules:

1. **Prompt Engineering Academy** — fundamentals of effective prompting
2. **Context Engineering Academy** — building context windows for LLMs
3. **Agent Engineering Academy** — designing multi-agent systems
4. **RAG Engineering Academy** — retrieval-augmented generation
5. **Evaluation Engineering Academy** — measuring LLM quality
6. **Deployment Engineering Academy** — production LLM systems

Each module contains:
- Theory content (rendered from structured data)
- Interactive playgrounds (client components)
- Code examples with syntax highlighting
- Quiz/assessment components`,
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
          "React alone provided no opinions on routing, server-side rendering, or data fetching. Next.js unified these concerns into a single framework with file-based routing, SSR, SSG, and API routes.",
      },
      whatItIs: `Next.js is a full-stack React framework providing:
- **App Router** — file-system based routing with nested layouts
- **Server Components** — React components that run on the server, sending HTML instead of JavaScript
- **Server Actions** — RPC-style server mutations from client components
- **Streaming SSR** — progressive HTML rendering with Suspense
- **Static Site Generation (SSG)** — pre-render pages at build time
- **Image/Font Optimization** — automatic optimization for Core Web Vitals`,
      explainLikeImTen: `Imagine you're building a school with many classrooms. React gives you the bricks for each classroom, but you'd have to figure out the hallways, doors, and signs yourself. Next.js is like hiring a construction company that already knows how to build schools — they give you the bricks AND the hallways, doors, and a directory so students can find their classrooms. For the academy, each "classroom" is a module page, and Next.js automatically creates the hallways (navigation) and door signs (URLs) based on how you organize the files.`,
      realWorldAnalogy: `Next.js is like a publishing platform versus a word processor. React (word processor) lets you write content, but you handle printing, distribution, and indexing yourself. Next.js (publishing platform) takes your content and handles printing (SSR/SSG), distribution (CDN deployment), indexing (SEO), and even lets readers preview before the full edition is ready (streaming). You focus on the content; Next.js handles the infrastructure.`,
      whyWeUsedIt: `The academy is a content-heavy, multi-page educational platform:
- App Router provides clean routing for 6 academies, 70+ modules, and individual lesson pages
- Server Components render course content without client-side JavaScript — critical for text-heavy educational pages
- Static generation pre-renders all course pages for instant loading
- Nested layouts maintain consistent navigation across academy → module → lesson hierarchy
- Image optimization for diagrams and illustrations throughout the curriculum`,
      howItWorksInProject: `- App Router with deeply nested layouts: /[academy]/[module]/[lesson]
- Server Components for all course content pages (theory, explanations, code examples)
- Client Components only for interactive playgrounds and quiz components
- generateStaticParams pre-renders all academy/module/lesson pages at build time
- Shared layout components provide consistent sidebar navigation and breadcrumbs`,
      featuresInProject: [
        {
          feature: "Deeply nested dynamic routing",
          description: "The URL structure /[academy]/[module]/[lesson] maps directly to the folder structure, with generateStaticParams pre-rendering all 70+ module pages and their lessons at build time.",
        },
        {
          feature: "Server Components for course content",
          description: "Theory pages, code examples, and explanations are Server Components — rendered on the server with zero client-side JavaScript, making educational content load instantly.",
        },
        {
          feature: "Nested layouts for navigation hierarchy",
          description: "Root layout provides the global header, academy layout provides the sidebar navigation for modules, and module layout provides the lesson list — each level wraps its children without re-rendering parents.",
        },
        {
          feature: "Client Components for interactive playgrounds",
          description: "Playground components (prompt tester, token counter, chain builder) use 'use client' directive to enable interactivity while the surrounding content remains server-rendered.",
        },
        {
          feature: "Static generation for all content pages",
          description: "generateStaticParams generates all academy/module/lesson pages at build time, enabling instant page loads from CDN — critical for an educational platform where content rarely changes.",
        },
      ],
      coreConceptsMarkdown: `### Academy Route Structure

\`\`\`
app/
├── layout.tsx                    # Global header + footer
├── page.tsx                      # Home / academy index
├── [academy]/
│   ├── layout.tsx                # Academy sidebar
│   ├── page.tsx                  # Module list
│   └── [module]/
│       ├── layout.tsx            # Lesson navigation
│       ├── page.tsx              # Module overview
│       └── [lesson]/
│           └── page.tsx          # Individual lesson
\`\`\`

### Server vs Client Split

\`\`\`tsx
// Server Component (default) — course content
export default function LessonPage({ params }: LessonPageProps) {
  const lesson = getLesson(params.academy, params.module, params.lesson);
  return (
    <article>
      <h1>{lesson.title}</h1>
      <LessonContent content={lesson.content} />
      {/* Client Component island for interactivity */}
      <Playground type={lesson.playgroundType} />
    </article>
  );
}
\`\`\``,
      prosAndCons: {
        pros: [
          "File-based routing maps perfectly to academy/module/lesson hierarchy",
          "Server Components eliminate client JS for content-heavy educational pages",
          "Static generation enables instant page loads from CDN",
          "Nested layouts prevent re-rendering when navigating between lessons",
          "Image optimization for curriculum diagrams and illustrations",
          "Built-in SEO support for discoverability",
        ],
        cons: [
          "App Router complexity for deeply nested dynamic routes",
          "Server/Client component boundary requires careful planning",
          "Build times increase with 70+ statically generated pages",
          "Vendor lock-in with Vercel for optimal deployment",
          "Hot reload can be slow with many route segments",
          "Error boundaries and loading states need setup at each layout level",
        ],
      },
      alternatives: [
        {
          name: "Astro",
          comparison: "Content-focused framework with island architecture. Ships zero JS by default — ideal for documentation sites. But interactive playgrounds would require more manual island setup.",
        },
        {
          name: "Remix",
          comparison: "Full-stack React framework with nested routing. Better data mutation patterns but less mature static generation for content-heavy sites.",
        },
        {
          name: "Docusaurus",
          comparison: "Documentation framework from Meta. Built-in MDX support, versioning, and search. Less flexible for custom interactive components like playgrounds.",
        },
        {
          name: "VitePress",
          comparison: "Vue-based static site generator. Excellent for documentation with instant page loads. But Vue ecosystem, not React.",
        },
      ],
      keyAPIs: [
        "app/ directory — file-based routing",
        "layout.tsx — nested shared layouts",
        "page.tsx — route pages",
        "generateStaticParams — static generation for dynamic routes",
        "loading.tsx / error.tsx — loading and error UI",
        "next/image — optimized images",
        "next/link — client-side navigation",
      ],
      academicFoundations: `**Isomorphic JavaScript (Airbnb, 2013):** Next.js realizes universal rendering — the same React components render on server and client. Server Components extend this by keeping some components server-only, reducing the JavaScript sent to clients.

**Static Site Generation (Jekyll, 2008):** Pre-rendering pages at build time is the oldest web performance technique. Next.js combines SSG with dynamic runtime features, enabling static content pages that coexist with interactive client components.

**Progressive Enhancement:** Next.js App Router implements progressive enhancement — content is readable as server-rendered HTML before JavaScript loads. Interactive playgrounds enhance the experience but aren't required for core learning content.`,
      furtherReading: [
        "Next.js documentation — nextjs.org/docs",
        "App Router migration guide — nextjs.org/docs/app",
        "Patterns.dev — patterns.dev",
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
          "Large-scale JavaScript applications suffered from runtime type errors, poor IDE support, and brittle refactoring. TypeScript adds optional static typing as a superset of JavaScript, catching errors before runtime.",
      },
      whatItIs: `TypeScript is a typed superset of JavaScript that compiles to plain JavaScript:
- **Static Types:** Catch errors at compile time, not runtime
- **Type Inference:** Automatically infers types without explicit annotations
- **Interfaces & Generics:** Model complex data shapes and reusable patterns
- **Strict Mode:** strictNullChecks, noImplicitAny, and more
- **IDE Integration:** Powers autocomplete, refactoring, and documentation
- **Gradual Adoption:** Existing JavaScript is valid TypeScript`,
      explainLikeImTen: `Imagine you're building a huge LEGO set with thousands of pieces. Without instructions (JavaScript), you just try pieces and hope they fit — sometimes they do, sometimes you find out they don't until the whole thing falls apart. TypeScript is like having a smart instruction manual that checks each piece before you snap it in. It says "nope, that red 2x4 brick can't go there — you need a blue 1x2 flat piece." It catches your mistakes while you're building, not after the whole thing collapses.`,
      realWorldAnalogy: `TypeScript is like a spell-checker and grammar-checker for code. Just as a word processor underlines your misspellings and grammatical errors while you type — before you send the email — TypeScript underlines code mistakes while you write them, before your program runs. You could ignore the suggestions (using 'any'), but the more you follow them, the fewer embarrassing errors make it into production.`,
      whyWeUsedIt: `An educational platform with 70+ modules needs reliability:
- Type-safe data models for Course, Module, Lesson structures prevent data shape mismatches
- Complex component props (playgrounds accept different configurations) are validated at compile time
- Refactoring across 6 academies is safe — rename a field and TypeScript finds every reference
- IDE autocomplete accelerates development of repetitive content structures
- Strict mode prevents null/undefined errors in navigation and content rendering`,
      howItWorksInProject: `- Strict mode enabled throughout the project
- Typed data models for Academy, Module, Lesson, Playground content structures
- Generic types for reusable content components (ContentBlock<T>, PlaygroundConfig<T>)
- Discriminated unions for different playground types (prompt, chain, evaluation)
- Path aliases for clean imports across the deep folder structure`,
      featuresInProject: [
        {
          feature: "Typed content data models",
          description: "Academy, Module, Lesson, and PlaygroundConfig interfaces define the exact shape of all educational content — ensuring every module has required fields like title, description, lessons array, and difficulty level.",
        },
        {
          feature: "Discriminated unions for playground types",
          description: "Different playground components (PromptPlayground, ChainPlayground, EvalPlayground) use discriminated union types so TypeScript enforces the correct props for each playground variant.",
        },
        {
          feature: "Generic content components",
          description: "Reusable components like ContentSection<T> and CodeExample<T> use generics to accept different content types while maintaining full type safety for rendering logic.",
        },
        {
          feature: "Type-safe navigation helpers",
          description: "Utility functions for generating breadcrumbs and next/previous navigation are fully typed — they accept Academy and Module types and return typed navigation objects, preventing broken links.",
        },
        {
          feature: "Strict null checks for content lookups",
          description: "Looking up a module or lesson by slug can return undefined — strictNullChecks forces every page component to handle the not-found case, preventing 500 errors on invalid URLs.",
        },
      ],
      coreConceptsMarkdown: `### Content Type System

\`\`\`typescript
interface Academy {
  id: string;
  name: string;
  description: string;
  modules: Module[];
  icon: string;
}

interface Module {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  lessons: Lesson[];
  estimatedMinutes: number;
}

interface Lesson {
  id: string;
  title: string;
  content: ContentBlock[];
  playground?: PlaygroundConfig;
}

// Discriminated union for playground types
type PlaygroundConfig =
  | { type: "prompt"; systemPrompt: string; examples: string[] }
  | { type: "chain"; steps: ChainStep[]; model: string }
  | { type: "evaluation"; criteria: EvalCriteria[] };
\`\`\`

### Type-Safe Content Lookup

\`\`\`typescript
function getModule(academyId: string, moduleId: string): Module | undefined {
  const academy = academies.find((a) => a.id === academyId);
  return academy?.modules.find((m) => m.id === moduleId);
}

// TypeScript forces null check
const module = getModule(params.academy, params.module);
if (!module) {
  notFound(); // Next.js 404
}
// After this point, TypeScript knows module is defined
\`\`\``,
      prosAndCons: {
        pros: [
          "Catches content structure errors at compile time",
          "IDE autocomplete for content models speeds up module creation",
          "Safe refactoring across 70+ modules",
          "Self-documenting interfaces serve as content schema",
          "Discriminated unions model different component variants cleanly",
          "Strict null checks prevent runtime errors on content lookups",
        ],
        cons: [
          "Build step adds complexity to the development workflow",
          "Complex generic types can be hard to read for contributors",
          "Type definitions for content structures add verbosity",
          "Third-party type definitions can be incomplete",
          "Configuration (tsconfig) needs tuning for Next.js App Router",
        ],
      },
      alternatives: [
        {
          name: "JavaScript with JSDoc",
          comparison: "Type checking via JSDoc comments. No build step, but weaker inference and less tooling. Fine for small projects, insufficient for 70+ module content structure.",
        },
        {
          name: "Zod (runtime validation)",
          comparison: "Runtime schema validation that generates TypeScript types. Useful at system boundaries (API responses) but adds runtime cost. Best used alongside TypeScript, not as a replacement.",
        },
        {
          name: "Flow",
          comparison: "Facebook's type checker. Similar goals but lost ecosystem adoption to TypeScript. Fewer tools, smaller community, less Next.js integration.",
        },
      ],
      keyAPIs: [
        "interface — define content data shapes",
        "type — discriminated unions for component variants",
        "generics <T> — reusable typed components",
        "satisfies — validate type without widening",
        "as const — literal type inference for content arrays",
        "Partial<T>, Pick<T, K> — utility types for partial updates",
        "strictNullChecks — force null/undefined handling",
      ],
      academicFoundations: `**Type Theory (Church, 1940):** TypeScript's type system is based on simply typed lambda calculus. Types classify values and ensure operations are applied to compatible data — preventing a string from being used where a number is expected.

**Structural Typing:** TypeScript uses structural typing — if two types have the same shape, they're compatible regardless of name. This aligns with JavaScript's duck typing ("if it walks like a duck and quacks like a duck...") but adds compile-time verification.

**Gradual Typing (Siek & Taha, 2006):** TypeScript's 'any' type enables gradual typing — mixing typed and untyped code in the same project. This allows incremental adoption without requiring a complete rewrite.`,
      furtherReading: [
        "TypeScript Handbook — typescriptlang.org/docs/handbook",
        "Effective TypeScript by Dan Vanderkam",
        "Total TypeScript — totaltypescript.com",
        "Type Challenges — github.com/type-challenges/type-challenges",
      ],
    },
    {
      name: "React 19",
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
- **Server Components (React 19):** Components that run on the server, reducing client JS
- **Concurrent Features:** Suspense, transitions, streaming SSR`,
      explainLikeImTen: `Think of React like building with LEGO blocks. Each block is a "component" — it could be a button, a card, or a whole section of a website. You snap these blocks together to build your page. The cool part is, when something changes (like a new notification), React is smart enough to only update the specific block that changed, instead of rebuilding the whole thing. It's like if your LEGO city could magically swap out just one building without touching the rest.`,
      realWorldAnalogy: `React is like a restaurant kitchen with a ticket system. When a customer changes their order (state change), the kitchen doesn't remake every dish — it only remakes the dish that changed. The ticket system (virtual DOM) keeps track of what needs updating, and the chef (React reconciler) figures out the minimum work needed to get every table's order right.`,
      whyWeUsedIt: `The academy is a content-heavy interactive application:
- Server Components render course content without sending JavaScript to the client
- Client Components power interactive playgrounds
- Component composition enables reusable course/module/lesson structures
- React's ecosystem provides syntax highlighting, markdown rendering, code editors`,
      howItWorksInProject: `- Next.js App Router with React 19 features
- Server Components for course content pages (minimal JS)
- Client Components for interactive elements (playgrounds, quizzes)
- Shared layout components for consistent navigation
- Dynamic routing for academy/module/lesson URLs`,
      featuresInProject: [
        {
          feature: "Server Components for content pages",
          description: "All educational content (theory, explanations, code examples) renders as Server Components — zero client JavaScript for text-heavy pages, improving load times for the 70+ module pages.",
        },
        {
          feature: "Client Component islands for playgrounds",
          description: "Interactive playground components (prompt tester, chain builder, eval runner) are Client Components embedded within Server Component pages — only the interactive parts ship JavaScript.",
        },
        {
          feature: "Reusable content components",
          description: "ContentBlock, CodeExample, DiagramViewer, and QuizCard components are composed throughout the curriculum, ensuring consistent rendering across all 6 academies.",
        },
        {
          feature: "Suspense for progressive loading",
          description: "Heavy playground components are wrapped in Suspense with skeleton loaders, so theory content displays instantly while interactive tools load asynchronously.",
        },
        {
          feature: "use() hook for server data",
          description: "React 19's use() hook reads resolved promises from Server Components, enabling clean data flow from server-fetched course content to client-rendered interactive elements.",
        },
      ],
      coreConceptsMarkdown: `### React Mental Model

\`\`\`
UI = f(state)
\`\`\`

React treats UI as a pure function of state. When state changes, React re-renders the component and efficiently updates the DOM.

### Hooks (Core)

\`\`\`tsx
import { useState, useEffect, useMemo } from "react";

function ModulePlayer({ moduleId }: { moduleId: string }) {
  // State
  const [currentLesson, setCurrentLesson] = useState(0);
  const [progress, setProgress] = useState<Record<number, boolean>>({});

  // Side effects
  useEffect(() => {
    saveProgress(moduleId, progress);
  }, [progress, moduleId]);

  // Memoized computation
  const completionPercentage = useMemo(() => {
    const completed = Object.values(progress).filter(Boolean).length;
    return Math.round((completed / totalLessons) * 100);
  }, [progress]);

  return (
    <div>
      <ProgressBar value={completionPercentage} />
      <LessonContent lesson={lessons[currentLesson]} />
      <button onClick={() => setCurrentLesson((l) => l + 1)}>
        Next Lesson
      </button>
    </div>
  );
}
\`\`\`

### React 19 Features

- **Server Components:** Default in App Router. Run on the server, send HTML (not JS) to client.
- **Actions:** Server-side form handling with useActionState.
- **use() hook:** Read promises and context in render.
- **Document Metadata:** title, meta, link tags in components.

### Reconciliation (Virtual DOM)

1. State change triggers re-render
2. React builds a new Virtual DOM tree
3. Diffing algorithm compares new tree with previous tree
4. Minimal set of DOM operations computed
5. Real DOM updated in a batch

**Fiber Architecture (React 16+):** Reconciliation is split into units of work that can be paused, resumed, and prioritized. This enables concurrent rendering — urgent updates (typing) interrupt less urgent ones (list rendering).`,
      prosAndCons: {
        pros: [
          "Massive ecosystem — most popular UI library",
          "Component model scales from small widgets to large applications",
          "Server Components reduce client-side JavaScript",
          "Concurrent features enable responsive UIs",
          "Strong TypeScript support",
          "Huge job market and community",
        ],
        cons: [
          "Not a full framework — need Next.js/Remix for routing, SSR",
          "Server vs Client component mental model is complex",
          "useEffect is widely misunderstood and misused",
          "Bundle size grows with dependencies",
          "Frequent major versions with migration effort",
          "Meta-driven roadmap — community has limited influence",
        ],
      },
      alternatives: [
        {
          name: "Vue.js",
          comparison: "More approachable with template syntax and two-way binding. Single-file components (SFC) are elegant. Smaller ecosystem but growing. Better documentation.",
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
          comparison: "Full framework with dependency injection, RxJS, forms, routing. More opinionated, larger bundle, steeper learning curve. Better for large enterprise teams.",
        },
      ],
      keyAPIs: [
        "useState — local component state",
        "useEffect — side effects (data fetching, subscriptions)",
        "useContext — consume context without prop drilling",
        "useMemo / useCallback — memoization",
        "useRef — mutable refs and DOM access",
        "Suspense — loading states for async components",
        "use() — read promises and context in render (React 19)",
      ],
      academicFoundations: `**Functional Reactive Programming (FRP):** React's "UI = f(state)" model is rooted in FRP, formalized by Conal Elliott and Paul Hudak (1997). In FRP, the UI is a continuous function of time-varying values (signals).

**Virtual DOM & Tree Diffing:** React's reconciliation algorithm is based on tree edit distance algorithms. The general tree diff problem is O(n³), but React uses heuristics (same-type assumption, keys) to achieve O(n) in practice. This is based on Tai's tree edit distance algorithm (1979).

**Fiber Architecture & Algebraic Effects:** React Fiber implements cooperative scheduling inspired by algebraic effects (Plotkin & Power, 2003). Effects (like setState) are descriptions of side effects that the scheduler can reorder, batch, or defer.

**Component Model:** React's component model descends from Smalltalk's MVC (1979) and composite pattern (GoF). Each component encapsulates state, behavior, and presentation — a self-contained unit of UI.`,
      furtherReading: [
        "React documentation — react.dev",
        "React Design Principles — react.dev/community/react-design-principles",
        "Overreacted (Dan Abramov's blog) — overreacted.io",
        "React Fiber architecture — github.com/acdlite/react-fiber-architecture",
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
      explainLikeImTen: `Imagine you have a huge box of stickers — some change colors, some add borders, some make things bigger or smaller. Instead of drawing each design from scratch, you just stick the right combination of stickers on each piece. "This card needs a shadow sticker, a round-corners sticker, and a blue-background sticker." That's Tailwind — instead of writing custom styles for everything, you combine small, reusable "sticker" classes to style your page quickly and consistently.`,
      realWorldAnalogy: `Tailwind CSS is like a modular closet system versus custom-built furniture. With traditional CSS, you hire a carpenter to build a unique dresser for every room. With Tailwind, you buy standardized shelf units, drawer inserts, and dividers, then assemble them into exactly the configuration you need. Every piece is interchangeable, and you never end up with an orphaned custom piece nobody knows how to modify.`,
      whyWeUsedIt: `The academy needs consistent, maintainable styling:
- Utility classes are self-documenting — you see what each element looks like
- No CSS file switching — styles are in the component
- Design tokens enforce consistency (spacing, colors)
- JIT mode means zero unused CSS in production
- shadcn/ui components use Tailwind — consistent ecosystem`,
      howItWorksInProject: `- Tailwind CSS v4 with PostCSS plugin
- Design tokens customized for academy branding
- Responsive design with mobile-first breakpoints
- Dark mode support via \`dark:\` variant
- shadcn/ui components styled with Tailwind utilities`,
      featuresInProject: [
        {
          feature: "Academy brand color system",
          description: "Custom Tailwind theme tokens define the academy's color palette — each of the 6 academies has a distinct accent color while sharing a consistent neutral palette for backgrounds, text, and borders.",
        },
        {
          feature: "Responsive content layout",
          description: "Course content uses responsive utilities (prose, max-w-3xl, mx-auto on desktop; full-width on mobile) to ensure readability across devices from phones to wide desktop monitors.",
        },
        {
          feature: "Dark mode for code-heavy content",
          description: "Dark mode (dark:bg-gray-950) is the default for code-heavy educational content, reducing eye strain during long study sessions and matching the syntax highlighting theme.",
        },
        {
          feature: "Consistent component spacing",
          description: "Tailwind's spacing scale (space-y-4 for content sections, gap-6 for card grids, p-6 for card padding) ensures visual consistency across all 70+ module pages without custom CSS.",
        },
        {
          feature: "Typography utilities for educational content",
          description: "Tailwind typography plugin (@tailwindcss/typography) styles prose content (headings, paragraphs, lists, code blocks) with a single 'prose' class, keeping educational text readable.",
        },
      ],
      coreConceptsMarkdown: `### Utility-First Approach

\`\`\`tsx
// Traditional CSS
<div className="card">
  <h2 className="card-title">Module 1</h2>
  <p className="card-description">Introduction to prompting</p>
</div>

// Tailwind CSS
<div className="rounded-lg border p-6 shadow-sm">
  <h2 className="text-xl font-semibold">Module 1</h2>
  <p className="text-sm text-muted-foreground">Introduction to prompting</p>
</div>
\`\`\`

### Responsive Design

\`\`\`tsx
// Mobile-first breakpoints
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {modules.map((m) => <ModuleCard key={m.id} module={m} />)}
</div>
// 1 column on mobile, 2 on tablet, 3 on desktop
\`\`\`

### Dark Mode

\`\`\`tsx
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
  Content that adapts to light/dark mode
</div>
\`\`\`

### Tailwind v4 Changes

- CSS-first configuration (no more tailwind.config.js)
- Native CSS cascade layers
- Faster build performance
- Improved color system`,
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
      name: "shadcn/ui",
      category: "library",
      icon: "SH",
      tagline: "Copy-paste React components you own",
      origin: {
        creator: "shadcn (Shadiq Hkim)",
        year: 2023,
        motivation:
          "Component libraries (Material UI, Chakra UI) provide pre-built components but are hard to customize deeply. shadcn/ui takes a different approach — you copy the component source code into your project and own it entirely.",
      },
      whatItIs: `shadcn/ui is NOT a component library. It's a collection of re-usable components built on:
- **Radix UI** — unstyled, accessible primitives
- **Tailwind CSS** — styling via utility classes
- **class-variance-authority (CVA)** — variant management

You don't install shadcn/ui as a package. You run \`npx shadcn add button\` and it copies the component source into your project. You own the code and can modify it freely.`,
      explainLikeImTen: `Most component libraries are like buying a pre-made bookshelf from IKEA — it looks nice, but you can't really change the shape or size. shadcn/ui is different. It's like IKEA giving you the actual blueprints and cut wood pieces. You assemble it yourself, and since you have the blueprints, you can modify anything — make a shelf taller, add an extra drawer, change the color. You OWN the furniture, not just a license to use it. If something breaks, you fix it yourself because you have all the pieces.`,
      realWorldAnalogy: `shadcn/ui is like an open-source recipe collection versus a meal delivery service. Material UI (meal delivery) gives you finished dishes that are hard to modify — if you don't like the seasoning, tough luck. shadcn/ui gives you tested recipes (component source code) that you cook yourself. You can adjust any ingredient, swap out spices, or combine recipes. The recipes use professional techniques (Radix UI accessibility, Tailwind styling) but the final dish is yours to customize.`,
      whyWeUsedIt: `The academy needs professional-looking, accessible UI components:
- Tabs for academy/module navigation
- Cards for module previews
- Accordions for FAQ/lesson sections
- Accessible by default (Radix UI handles ARIA)
- Full customization — we own the code
- Consistent with Tailwind CSS styling`,
      howItWorksInProject: `- \`src/components/ui/\` contains shadcn/ui components
- Components: tabs, card, badge, scroll-area, separator, accordion
- Customized colors/styles to match academy branding
- components.json configures the CLI for adding new components`,
      featuresInProject: [
        {
          feature: "Tabs for academy navigation",
          description: "shadcn/ui Tabs component powers the academy section navigation — switching between Overview, Modules, and Progress tabs within each academy page, with accessible keyboard navigation via Radix.",
        },
        {
          feature: "Cards for module previews",
          description: "Each of the 70+ modules is displayed as a shadcn/ui Card with title, description, difficulty badge, estimated time, and progress indicator — consistent layout across all academies.",
        },
        {
          feature: "Accordion for FAQ and lesson sections",
          description: "Frequently asked questions and expandable lesson sections use the Accordion component — animated expand/collapse with proper ARIA attributes for screen reader compatibility.",
        },
        {
          feature: "Badge components for difficulty levels",
          description: "Module difficulty (beginner, intermediate, advanced) is shown with color-coded Badge components — green, amber, red variants defined with CVA for consistent styling.",
        },
        {
          feature: "ScrollArea for code examples",
          description: "Long code examples in lessons use the ScrollArea component — custom-styled scrollbars that maintain visual consistency with the academy theme while enabling overflow scrolling.",
        },
      ],
      coreConceptsMarkdown: `### How It Works

\`\`\`bash
# Add a component — copies source to your project
npx shadcn add button

# This creates:
# src/components/ui/button.tsx
\`\`\`

The generated component:
\`\`\`tsx
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "border border-input bg-background hover:bg-accent",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export function Button({ variant, size, className, ...props }) {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}
\`\`\`

### Radix UI Primitives

Radix provides the behavior and accessibility:
- Keyboard navigation
- Focus management
- ARIA attributes
- Screen reader support

shadcn/ui adds the styling via Tailwind.`,
      prosAndCons: {
        pros: [
          "Full ownership — code is in your project, modify freely",
          "Accessible by default (Radix UI)",
          "Beautiful defaults with Tailwind CSS",
          "No version lock-in — no dependency to update",
          "Excellent dark mode support",
          "Growing ecosystem and community",
        ],
        cons: [
          "Manual updates — no npm update for bug fixes",
          "Requires Tailwind CSS (not optional)",
          "Component consistency depends on developer discipline",
          "Limited to components in the registry",
          "Initial setup requires CLI configuration",
        ],
      },
      alternatives: [
        {
          name: "Material UI (MUI)",
          comparison: "Comprehensive component library with Material Design. Many components, good docs, but hard to customize away from Material Design aesthetic. Heavy bundle.",
        },
        {
          name: "Chakra UI",
          comparison: "Styled component library with good DX. Easier customization than MUI but still an npm dependency you don't own.",
        },
        {
          name: "Headless UI",
          comparison: "Unstyled, accessible components from Tailwind Labs. Similar to Radix but with Tailwind-first design. Fewer components.",
        },
        {
          name: "Ark UI",
          comparison: "Framework-agnostic headless components from the Chakra team. Works with React, Vue, Solid. More flexible but less styling out of the box.",
        },
      ],
      keyAPIs: [
        "npx shadcn add <component> — add component",
        "npx shadcn init — initialize project",
        "components.json — configuration file",
        "cn() — className merge utility (clsx + tailwind-merge)",
        "cva() — class variance authority for variants",
      ],
      academicFoundations: `**Composition over Inheritance:** shadcn/ui embodies this OOP principle. Instead of inheriting from a base component library, you compose from primitive building blocks (Radix) and styling utilities (Tailwind).

**Accessibility Standards (WCAG):** Radix UI primitives implement WAI-ARIA (Web Accessibility Initiative - Accessible Rich Internet Applications) design patterns. These standards define how web components should behave for users with disabilities.

**Open/Closed Principle:** Components are open for extension (you own the code) but closed for modification of the underlying accessibility behavior (Radix handles that). This separation of concerns (behavior vs. styling) is a clean architectural boundary.`,
      furtherReading: [
        "shadcn/ui documentation — ui.shadcn.com",
        "Radix UI documentation — radix-ui.com",
        "CVA documentation — cva.style",
      ],
    },
    {
      name: "Radix UI",
      category: "library",
      icon: "RX",
      tagline: "Unstyled, accessible React UI primitives",
      origin: {
        creator: "WorkOS (Pedro Duarte, Benoit Gregoire)",
        year: 2021,
        motivation:
          "Building accessible UI components is extremely difficult — proper keyboard navigation, focus management, screen reader support, and ARIA attributes require deep expertise. Radix UI provides unstyled, fully accessible primitives that developers can style however they want.",
      },
      whatItIs: `Radix UI is a library of unstyled, accessible React component primitives:
- **Unstyled:** No visual opinions — you add all styling (Tailwind, CSS, etc.)
- **Accessible:** WAI-ARIA compliant keyboard navigation, focus management, screen reader support
- **Composable:** Compound component pattern — compose from sub-components
- **Controlled & Uncontrolled:** Works both ways, like native HTML elements
- **Incremental:** Install only the primitives you need (@radix-ui/react-dialog, etc.)`,
      explainLikeImTen: `Imagine you're building a toy car. Radix UI gives you the engine, wheels, and steering mechanism — all the complicated internal parts that make a car actually work. But it doesn't paint the car or decide what shape the body should be. You get to design the outside however you want — make it a race car, a truck, or a spaceship. The important thing is that the engine always works perfectly. In websites, the "engine" is stuff like making sure keyboard users can navigate menus, blind users can hear what's on screen, and dropdowns open and close correctly.`,
      realWorldAnalogy: `Radix UI is like a car chassis with a working drivetrain, but no body panels. The chassis (Radix) handles the engineering that must work perfectly — steering, braking, suspension, engine. You design the body (styling) however you want — sports car, SUV, van. Traditional component libraries (Material UI) give you a complete car — but if you want to change the body shape, you're fighting against the factory design. With Radix, the engineering is solid and the exterior is entirely up to you.`,
      whyWeUsedIt: `The academy uses shadcn/ui, which is built on Radix UI primitives:
- Radix handles the hard accessibility problems (keyboard navigation, ARIA, focus trapping)
- shadcn/ui adds Tailwind styling on top of Radix primitives
- Every interactive component (tabs, accordion, dialog, dropdown) uses Radix under the hood
- We get WCAG compliance without being accessibility experts
- Custom styling ensures the academy's unique visual identity`,
      howItWorksInProject: `- Radix primitives are the foundation of all shadcn/ui components
- @radix-ui/react-tabs powers the academy navigation tabs
- @radix-ui/react-accordion powers the FAQ and lesson sections
- @radix-ui/react-scroll-area provides custom scrollbars for code examples
- @radix-ui/react-separator provides visual dividers between content sections`,
      featuresInProject: [
        {
          feature: "Accessible tabs navigation",
          description: "Radix Tabs primitive powers the academy section switcher — Arrow keys move between tabs, Tab key moves into the panel, Home/End jump to first/last tab — all WAI-ARIA compliant without custom code.",
        },
        {
          feature: "Keyboard-navigable accordions",
          description: "FAQ and lesson sections use Radix Accordion — Space/Enter toggles sections, Arrow keys navigate between items, and screen readers announce expanded/collapsed state automatically.",
        },
        {
          feature: "Focus-trapped dialogs",
          description: "Modal dialogs for playground settings and quiz results use Radix Dialog — focus is trapped inside the modal, Escape closes it, and focus returns to the trigger element on close.",
        },
        {
          feature: "Custom-styled scroll areas",
          description: "Radix ScrollArea provides custom scrollbar styling for code examples and long content — cross-browser consistent scrollbars that match the academy theme, with proper touch support.",
        },
        {
          feature: "Accessible tooltip and popover components",
          description: "Tooltips on icon buttons and popovers for additional context use Radix primitives — proper delay timing, keyboard trigger support, and screen reader announcements are handled automatically.",
        },
      ],
      coreConceptsMarkdown: `### Compound Component Pattern

\`\`\`tsx
import * as Tabs from "@radix-ui/react-tabs";

// Radix provides the behavior, you provide the styling
<Tabs.Root defaultValue="overview">
  <Tabs.List className="flex border-b">
    <Tabs.Trigger value="overview" className="px-4 py-2 data-[state=active]:border-b-2">
      Overview
    </Tabs.Trigger>
    <Tabs.Trigger value="modules" className="px-4 py-2 data-[state=active]:border-b-2">
      Modules
    </Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="overview" className="p-4">
    Academy overview content
  </Tabs.Content>
  <Tabs.Content value="modules" className="p-4">
    Module list
  </Tabs.Content>
</Tabs.Root>
\`\`\`

### Accessibility Built-In

Radix automatically handles:
- **role** attributes (tablist, tab, tabpanel)
- **aria-selected** on active tabs
- **aria-controls** / **aria-labelledby** connections
- **Keyboard navigation** (Arrow keys, Home, End)
- **Focus management** (focus moves to panel on selection)

### data-[state] for Styling

\`\`\`css
/* Style based on component state */
[data-state="active"] { border-bottom: 2px solid blue; }
[data-state="open"] { transform: rotate(180deg); }
[data-state="closed"] { opacity: 0.5; }
\`\`\``,
      prosAndCons: {
        pros: [
          "Best-in-class accessibility — WAI-ARIA compliant out of the box",
          "Completely unstyled — zero visual opinions to fight against",
          "Compound component pattern is composable and intuitive",
          "Incremental adoption — install only what you need",
          "data-[state] attributes enable clean CSS-based styling",
          "Controlled and uncontrolled modes for every component",
        ],
        cons: [
          "No styling included — more initial setup work",
          "Learning the compound component API takes time",
          "Bundle size adds up when using many primitives",
          "Documentation can be terse for complex components",
          "Some primitives lack features available in full component libraries",
          "Styling states via data attributes is unfamiliar to some developers",
        ],
      },
      alternatives: [
        {
          name: "Headless UI",
          comparison: "Tailwind Labs' unstyled component library. Fewer components than Radix but designed specifically for Tailwind. Simpler API but less comprehensive accessibility.",
        },
        {
          name: "React Aria (Adobe)",
          comparison: "Hook-based accessibility library. Even more granular control than Radix (hooks vs components). More complex to use but more flexible for unusual UIs.",
        },
        {
          name: "Ark UI",
          comparison: "Framework-agnostic headless components from the Chakra team. Works with React, Vue, Solid. Newer with growing feature set.",
        },
        {
          name: "Ariakit",
          comparison: "Accessible component toolkit with optional styling. More lightweight than Radix but smaller community and fewer components.",
        },
      ],
      keyAPIs: [
        "@radix-ui/react-tabs — tab navigation",
        "@radix-ui/react-accordion — collapsible sections",
        "@radix-ui/react-dialog — modal dialogs",
        "@radix-ui/react-scroll-area — custom scrollbars",
        "@radix-ui/react-tooltip — accessible tooltips",
        "@radix-ui/react-separator — visual dividers",
        "data-[state] — CSS state selectors",
      ],
      academicFoundations: `**WAI-ARIA (W3C, 2014):** Radix implements the WAI-ARIA Authoring Practices — W3C's guidelines for building accessible web components. Each component follows specific patterns (tabs, accordion, dialog, etc.) with prescribed keyboard interactions and ARIA roles.

**Accessibility Tree:** Browsers maintain an accessibility tree parallel to the DOM tree. Radix ensures this tree has correct roles, states, and properties so assistive technologies (screen readers, switch devices) can interpret UI components correctly.

**Compound Component Pattern:** Radix's API uses the compound component pattern — a parent component (Tabs.Root) provides context to child components (Tabs.Trigger, Tabs.Content) via React context. This pattern allows flexible composition while maintaining shared state.

**Inclusive Design (Microsoft, 2016):** Radix embodies inclusive design principles — building for the widest range of users from the start, rather than retrofitting accessibility. This benefits all users: keyboard shortcuts help power users, not just those with disabilities.`,
      furtherReading: [
        "Radix UI documentation — radix-ui.com",
        "WAI-ARIA Authoring Practices — w3.org/WAI/ARIA/apg",
        "Inclusive Components by Heydon Pickering — inclusive-components.design",
        "A11y Project — a11yproject.com",
      ],
    },
    {
      name: "Lucide React",
      category: "library",
      icon: "LU",
      tagline: "Beautiful, consistent open-source icons for React",
      origin: {
        creator: "Eric Fennis and community contributors (fork of Feather Icons)",
        year: 2020,
        motivation:
          "Feather Icons was a popular, minimal icon set but development stalled. Lucide forked the project to continue development — adding hundreds of new icons, improving consistency, and building first-class framework integrations (React, Vue, Svelte, etc.).",
      },
      whatItIs: `Lucide React is an icon library providing:
- **1,500+ icons** — consistent 24x24 pixel grid, 2px stroke
- **Tree-shakeable** — import only icons you use, bundle only those
- **Customizable** — size, color, stroke width via props
- **Accessible** — proper SVG semantics with optional aria-label
- **React-native components** — each icon is a typed React component
- **Consistent style** — unified design language across all icons`,
      explainLikeImTen: `Imagine you're making a poster for school and you need little pictures — an arrow, a star, a magnifying glass, a home icon. You could draw each one yourself, but they'd all look slightly different and it would take forever. Lucide is like a huge sticker book with over 1,500 perfectly-drawn tiny pictures that all look like they belong together. You just pick the stickers you need, and they all match perfectly. Plus, you can make them bigger, smaller, or change their color easily.`,
      realWorldAnalogy: `Lucide React is like a professional icon stamp set for graphic designers. Before icon libraries, every designer had to draw their own icons — inconsistent sizes, varying stroke widths, different visual weights. Lucide is a curated stamp set where every icon was designed by the same team with the same rules: same grid, same stroke, same style. You pick the stamps you need, adjust the ink color and size, and they always look like a cohesive set.`,
      whyWeUsedIt: `The academy uses icons extensively across the UI:
- Navigation icons for academy sections (book, code, brain, database, chart, rocket)
- Action icons for interactive elements (play, pause, copy, download)
- Status icons for progress indicators (check, circle, clock)
- Tree-shakeable import means we only ship the icons we use — not all 1,500+
- Consistent with shadcn/ui which uses Lucide by default`,
      howItWorksInProject: `- Import individual icons: import { BookOpen, Code, Brain } from "lucide-react"
- Consistent 20px size with className for Tailwind styling
- Icons in navigation, buttons, badges, and content section headers
- Color inherits from text color via currentColor SVG fill`,
      featuresInProject: [
        {
          feature: "Academy section navigation icons",
          description: "Each of the 6 academies has a distinct Lucide icon — BookOpen (Prompt), Brain (Context), Bot (Agent), Database (RAG), BarChart (Evaluation), Rocket (Deployment) — providing visual identity in the sidebar and cards.",
        },
        {
          feature: "Interactive element icons",
          description: "Playground controls use Lucide icons — Play/Pause for execution, Copy for code snippets, Download for exports, RefreshCw for reset — providing universally recognized affordances.",
        },
        {
          feature: "Progress and status indicators",
          description: "Module completion uses CircleCheck (complete), Circle (not started), and Clock (in progress) icons alongside progress text, providing quick visual scanning of learning progress.",
        },
        {
          feature: "Content section headers",
          description: "Theory sections use contextual Lucide icons (Lightbulb for concepts, AlertTriangle for warnings, Info for notes, Code for code sections) as visual anchors that help readers scan content structure.",
        },
        {
          feature: "Button icon composition",
          description: "shadcn/ui buttons compose with Lucide icons — <Button><Plus className='mr-2 h-4 w-4' /> Add Module</Button> — maintaining consistent icon sizing and spacing across all button variants.",
        },
      ],
      coreConceptsMarkdown: `### Basic Usage

\`\`\`tsx
import { BookOpen, Brain, Bot, Rocket } from "lucide-react";

// Default size (24px)
<BookOpen />

// Custom size and color
<Brain className="h-5 w-5 text-purple-500" />

// In a button
<button className="flex items-center gap-2">
  <Rocket className="h-4 w-4" />
  Launch Playground
</button>
\`\`\`

### Tree Shaking

\`\`\`tsx
// GOOD — only BookOpen is bundled (~1KB)
import { BookOpen } from "lucide-react";

// BAD — imports entire library
import * as Icons from "lucide-react";
\`\`\`

### Customization Props

| Prop | Default | Description |
|------|---------|-------------|
| size | 24 | Icon dimensions (width/height) |
| color | currentColor | Stroke color |
| strokeWidth | 2 | Stroke thickness |
| className | — | CSS classes (Tailwind) |
| absoluteStrokeWidth | false | Consistent stroke regardless of size |`,
      prosAndCons: {
        pros: [
          "1,500+ icons with consistent design language",
          "Tree-shakeable — only bundle icons you use",
          "First-class React components with TypeScript types",
          "Customizable size, color, stroke via props",
          "Active community with frequent new icon additions",
          "Default icon set for shadcn/ui — seamless integration",
        ],
        cons: [
          "SVG-based — not ideal for extremely small sizes (<12px)",
          "Outline-only style — no filled/solid variants for some icons",
          "Some niche icons may be missing (domain-specific)",
          "Stroke width scaling can look inconsistent at very large sizes",
          "Fork-based development means some Feather Icons docs are outdated",
        ],
      },
      alternatives: [
        {
          name: "Heroicons",
          comparison: "Tailwind Labs' icon set. Fewer icons (~300) but includes outline AND solid variants. Designed specifically for Tailwind projects.",
        },
        {
          name: "React Icons",
          comparison: "Aggregator that bundles multiple icon sets (Font Awesome, Material, etc.). More icons but inconsistent styling across sets. Larger bundle if not careful.",
        },
        {
          name: "Phosphor Icons",
          comparison: "Flexible icon family with 6 weights (thin, light, regular, bold, fill, duotone). More versatile styling but smaller set than Lucide.",
        },
        {
          name: "Font Awesome",
          comparison: "The original web icon set. Massive library (19,000+ icons) but heavy, pro icons require a license, and font-based loading is less flexible than SVG components.",
        },
      ],
      keyAPIs: [
        "import { IconName } from 'lucide-react' — named imports",
        "size prop — icon dimensions",
        "color prop — stroke color (default: currentColor)",
        "strokeWidth prop — line thickness",
        "className — Tailwind/CSS classes",
        "absoluteStrokeWidth — consistent stroke at any size",
      ],
      academicFoundations: `**Iconography & Visual Semiotics:** Icons are a form of visual communication studied in semiotics — the science of signs and symbols. Effective icons use culturally shared symbols (magnifying glass = search, house = home) that users recognize without labels. Lucide's consistency reinforces this recognition.

**Gestalt Principles of Visual Perception:** Lucide's design follows Gestalt principles — similarity (consistent stroke width), proximity (balanced whitespace), and closure (recognizable shapes from minimal lines). These 1920s psychology principles explain why well-designed icons are instantly recognizable.

**SVG (Scalable Vector Graphics, W3C 1999):** Lucide icons are SVG elements — mathematical descriptions of shapes rather than pixel bitmaps. SVGs scale to any size without pixelation, can be styled with CSS, and are accessible to screen readers. Each icon is a small, self-contained SVG document.`,
      furtherReading: [
        "Lucide documentation — lucide.dev",
        "Lucide GitHub — github.com/lucide-icons/lucide",
        "SVG on the web — svgontheweb.com",
        "Designing effective icons — material.io/design/iconography",
      ],
    },
  ],
};
