"use client";

import { useState } from "react";
import { allProjects } from "@/data/projects";
import { Project } from "@/data/types";
import { TechnologyViewer } from "./technology-viewer";
import { ThemeToggle } from "./theme-toggle";
import { MarkdownBlock } from "@/components/markdown-block";
import { getYouTubeVideoId } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";

type ViewType = "technology" | "architecture" | "cicd" | "patterns" | "overview" | "concepts";

interface SelectedView {
  type: ViewType;
  techIndex?: number;
}

const patternCategoryColors: Record<string, string> = {
  behavioral: "bg-blue-900/10 text-blue-800 dark:text-blue-300 border-blue-800/20",
  structural: "bg-green-900/10 text-green-800 dark:text-green-300 border-green-800/20",
  creational: "bg-amber-900/10 text-amber-800 dark:text-amber-300 border-amber-800/20",
  architectural: "bg-purple-900/10 text-purple-800 dark:text-purple-300 border-purple-800/20",
};

const techCategoryColors: Record<string, { bg: string; text: string; icon: string }> = {
  language: { bg: "bg-blue-950/10", text: "text-blue-800 dark:text-blue-300", icon: "bg-blue-700 text-white" },
  framework: { bg: "bg-purple-950/10", text: "text-purple-800 dark:text-purple-300", icon: "bg-purple-700 text-white" },
  database: { bg: "bg-green-950/10", text: "text-green-800 dark:text-green-300", icon: "bg-green-700 text-white" },
  infrastructure: { bg: "bg-orange-950/10", text: "text-orange-800 dark:text-orange-300", icon: "bg-orange-700 text-white" },
  library: { bg: "bg-pink-950/10", text: "text-pink-800 dark:text-pink-300", icon: "bg-pink-700 text-white" },
  tool: { bg: "bg-yellow-950/10", text: "text-yellow-800 dark:text-yellow-300", icon: "bg-yellow-700 text-white" },
  protocol: { bg: "bg-cyan-950/10", text: "text-cyan-800 dark:text-cyan-300", icon: "bg-cyan-700 text-white" },
  "ai-ml": { bg: "bg-red-950/10", text: "text-red-800 dark:text-red-300", icon: "bg-red-700 text-white" },
  testing: { bg: "bg-emerald-950/10", text: "text-emerald-800 dark:text-emerald-300", icon: "bg-emerald-700 text-white" },
  observability: { bg: "bg-indigo-950/10", text: "text-indigo-800 dark:text-indigo-300", icon: "bg-indigo-700 text-white" },
};

const sidebarItems: { type: ViewType; label: string; color: string; activeColor: string }[] = [
  { type: "overview", label: "Overview", color: "text-blue-800 dark:text-blue-300", activeColor: "bg-blue-800 dark:bg-blue-700" },
  { type: "concepts", label: "Core Concepts", color: "text-violet-800 dark:text-violet-300", activeColor: "bg-violet-800 dark:bg-violet-700" },
  { type: "architecture", label: "Architecture", color: "text-emerald-800 dark:text-emerald-300", activeColor: "bg-emerald-800 dark:bg-emerald-700" },
  { type: "cicd", label: "CI/CD & Build", color: "text-orange-800 dark:text-orange-300", activeColor: "bg-orange-800 dark:bg-orange-700" },
  { type: "patterns", label: "Design Patterns", color: "text-pink-800 dark:text-pink-300", activeColor: "bg-pink-800 dark:bg-pink-700" },
];

const projectTabColors: Record<string, string> = {
  "llm-gateway": "text-fuchsia-700 dark:text-fuchsia-300 data-[state=active]:text-fuchsia-800 dark:data-[state=active]:text-fuchsia-200 after:!bg-fuchsia-700",
  "rag-eval-engine": "text-cyan-700 dark:text-cyan-300 data-[state=active]:text-cyan-800 dark:data-[state=active]:text-cyan-200 after:!bg-cyan-700",
  "agenthire": "text-lime-700 dark:text-lime-300 data-[state=active]:text-lime-800 dark:data-[state=active]:text-lime-200 after:!bg-lime-700",
  "enterprise-playground": "text-amber-700 dark:text-amber-300 data-[state=active]:text-amber-800 dark:data-[state=active]:text-amber-200 after:!bg-amber-700",
  "mole-world": "text-rose-700 dark:text-rose-300 data-[state=active]:text-rose-800 dark:data-[state=active]:text-rose-200 after:!bg-rose-700",
  "animated-webgl-library": "text-violet-700 dark:text-violet-300 data-[state=active]:text-violet-800 dark:data-[state=active]:text-violet-200 after:!bg-violet-700",
  "context-engineering-academy": "text-teal-700 dark:text-teal-300 data-[state=active]:text-teal-800 dark:data-[state=active]:text-teal-200 after:!bg-teal-700",
};

const companyFavicons: Record<string, string> = {
  google: "https://www.google.com/favicon.ico",
  perplexity: "https://www.perplexity.ai/favicon.ico",
  github: "https://github.com/favicon.ico",
  notion: "https://www.notion.so/favicon.ico",
  openrouter: "https://openrouter.ai/favicon.ico",
  cloudflare: "https://www.cloudflare.com/favicon.ico",
  amazon: "https://www.amazon.com/favicon.ico",
  litellm: "https://litellm.ai/favicon.ico",
  anthropic: "https://www.anthropic.com/favicon.ico",
  microsoft: "https://www.microsoft.com/favicon.ico",
  linkedin: "https://www.linkedin.com/favicon.ico",
  jasper: "https://www.jasper.ai/favicon.ico",
  vercel: "https://vercel.com/favicon.ico",
  figma: "https://www.figma.com/favicon.ico",
  runway: "https://runwayml.com/favicon.ico",
  pika: "https://pika.art/favicon.ico",
  netflix: "https://www.netflix.com/favicon.ico",
  spotify: "https://www.spotify.com/favicon.ico",
  shadertoy: "https://www.shadertoy.com/favicon.ico",
  "deeplearning.ai": "https://www.deeplearning.ai/favicon.ico",
  openai: "https://openai.com/favicon.ico",
};

function getCompanyFavicon(company: string): string | null {
  const key = company.toLowerCase().replace(/\s+/g, "");
  return companyFavicons[key] || null;
}

function CoreConceptsView({ project }: { project: Project }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          <span className="text-violet-800 dark:text-violet-300">Core Concepts</span>
          {" "}<span className="text-muted-foreground font-normal text-lg">— {project.name}</span>
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          The big ideas behind this project, explained from scratch.
        </p>
      </div>
      <Accordion
        type="multiple"
        defaultValue={project.coreConcepts.map((c) => c.slug)}
        className="space-y-2"
      >
        {project.coreConcepts.map((concept) => (
          <AccordionItem
            key={concept.slug}
            value={concept.slug}
            className="border rounded-lg px-4"
          >
            <AccordionTrigger className="text-base font-semibold">
              {concept.name}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-violet-800 dark:text-violet-300 uppercase tracking-wider mb-1">
                    What It Is
                  </h4>
                  <p className="text-sm leading-relaxed">{concept.whatItIs}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 uppercase tracking-wider mb-1">
                    Why It Matters
                  </h4>
                  <p className="text-sm leading-relaxed">{concept.whyItMatters}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider mb-1">
                    How This Project Uses It
                  </h4>
                  <p className="text-sm leading-relaxed">{concept.howProjectUsesIt}</p>
                </div>
                {concept.keyTerms.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-300 uppercase tracking-wider mb-2">
                      Key Terms
                    </h4>
                    <div className="grid gap-2">
                      {concept.keyTerms.map((kt) => (
                        <div
                          key={kt.term}
                          className="border rounded-md p-2 bg-muted/30"
                        >
                          <span className="font-semibold text-sm">{kt.term}:</span>{" "}
                          <span className="text-sm text-muted-foreground">
                            {kt.definition}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

function ProjectOverview({ project }: { project: Project }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          <span className="text-blue-800 dark:text-blue-300">{project.name}</span>
        </h2>
        <p className="text-muted-foreground mt-1">{project.description}</p>
        <div className="flex gap-2 mt-3">
          {project.languages.map((lang) => (
            <Badge key={lang} variant="secondary">
              {lang}
            </Badge>
          ))}
        </div>
        <a
          href={project.repo}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary underline underline-offset-4 mt-2 inline-block"
        >
          View on GitHub
        </a>
      </div>

      {project.coreConcepts.length > 0 && (
        <>
          <Separator />
          <div>
            <h3 className="text-lg font-semibold mb-3">
              <span className="text-violet-800 dark:text-violet-300">Core Concepts</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.coreConcepts.map((concept) => (
                <Badge
                  key={concept.slug}
                  variant="outline"
                  className="bg-violet-900/10 border-violet-800/20 text-violet-800 dark:text-violet-300"
                >
                  {concept.name}
                </Badge>
              ))}
            </div>
          </div>
        </>
      )}

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-3">
          <span className="text-pink-800 dark:text-pink-300">Design Patterns</span>
        </h3>
        <div className="flex flex-wrap gap-2">
          {project.designPatterns.map((pattern) => (
            <Badge
              key={pattern.name}
              variant="outline"
              className={patternCategoryColors[pattern.category] || ""}
            >
              {pattern.name}
            </Badge>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-3">
          <span className="text-amber-800 dark:text-amber-300">Key Takeaways</span>
        </h3>
        <div className="space-y-2">
          {project.keyTakeaways.map((takeaway, i) => (
            <div key={i} className="flex gap-3 text-sm">
              <span className="text-amber-800 dark:text-amber-300 font-bold shrink-0">{i + 1}.</span>
              <span className="leading-relaxed">{takeaway}</span>
            </div>
          ))}
        </div>
      </div>

      {project.realWorldExamples.length > 0 && (
        <>
          <Separator />
          <div>
            <h3 className="text-lg font-semibold mb-3">
              <span className="text-cyan-800 dark:text-cyan-300">Real-World Examples</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {project.realWorldExamples.map((example, i) => {
                const favicon = getCompanyFavicon(example.company);
                return (
                  <Card key={i} className="transition-colors hover:border-cyan-800/30 dark:hover:border-cyan-300/30">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {favicon ? (
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted shrink-0 overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={favicon}
                              alt={example.company}
                              className="h-6 w-6"
                              onError={(e) => {
                                const target = e.currentTarget;
                                target.style.display = "none";
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.classList.add("bg-primary/10", "text-primary", "text-xs", "font-bold");
                                  parent.textContent = example.company.slice(0, 2).toUpperCase();
                                }
                              }}
                            />
                          </div>
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold shrink-0">
                            {example.company.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{example.company}</div>
                          <div className="text-xs text-muted-foreground">{example.product}</div>
                          <p className="text-sm mt-1 leading-relaxed">
                            {example.description}
                          </p>
                          <p className="text-xs text-cyan-800 dark:text-cyan-300 mt-1">
                            {example.conceptConnection}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </>
      )}

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-3">
          <span className="text-emerald-800 dark:text-emerald-300">Technologies</span>
          {" "}<span className="text-muted-foreground font-normal text-sm">({project.technologies.length})</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {project.technologies.map((tech) => {
            const colors = techCategoryColors[tech.category] || { bg: "bg-muted", text: "text-muted-foreground", icon: "bg-primary text-primary-foreground" };
            return (
              <Card key={tech.name} className={`cursor-default border !py-1.5 !gap-0 ${colors.bg}`}>
                <CardContent className="px-2.5 py-0">
                  <div className="flex items-center gap-2">
                    <div className={`flex h-7 w-7 items-center justify-center rounded text-[10px] font-bold shrink-0 ${colors.icon}`}>
                      {tech.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-medium truncate">{tech.name}</div>
                      <div className={`text-[10px] ${colors.text}`}>
                        {tech.category}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {project.videoResources.length > 0 && (
        <>
          <Separator />
          <div>
            <h3 className="text-lg font-semibold mb-3">
              <span className="text-red-800 dark:text-red-300">Video Resources</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {project.videoResources.map((video, i) => {
                const videoId = getYouTubeVideoId(video.url);
                return (
                  <a
                    key={i}
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block"
                  >
                    <Card className="overflow-hidden transition-colors group-hover:border-primary/50">
                      {videoId && (
                        <div className="aspect-video bg-muted relative overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                            <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
                              <div className="w-0 h-0 border-l-[16px] border-l-white border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent ml-1" />
                            </div>
                          </div>
                        </div>
                      )}
                      <CardContent className="p-3">
                        <div className="text-sm font-medium leading-tight line-clamp-2">
                          {video.title}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <span>{video.channel}</span>
                          <span>&#8226;</span>
                          <span>{video.durationMinutes} min</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {video.relevance}
                        </p>
                      </CardContent>
                    </Card>
                  </a>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function ArchitectureView({ project }: { project: Project }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">
        <span className="text-emerald-800 dark:text-emerald-300">Architecture</span>
        {" "}<span className="text-muted-foreground font-normal text-lg">— {project.name}</span>
      </h2>
      <Accordion type="multiple" defaultValue={project.architecture.map((_, i) => `arch-${i}`)}>
        {project.architecture.map((section, i) => (
          <AccordionItem key={i} value={`arch-${i}`} className="border rounded-lg px-4 mb-2">
            <AccordionTrigger className="text-base font-semibold">
              {section.title}
            </AccordionTrigger>
            <AccordionContent>
              <MarkdownBlock content={section.content} />
              {section.diagram && (
                <div className="mt-4">
                  <pre className="bg-muted/50 border rounded-lg p-4 text-xs font-mono leading-relaxed overflow-x-auto">
                    {section.diagram}
                  </pre>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

function CICDView({ project }: { project: Project }) {
  const pipeline = project.cicd;
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">
        <span className="text-orange-800 dark:text-orange-300">CI/CD & Build</span>
        {" "}<span className="text-muted-foreground font-normal text-lg">— {project.name}</span>
      </h2>

      <MarkdownBlock content={pipeline.overview} />

      {pipeline.diagram && (
        <div>
          <h3 className="text-lg font-semibold mb-2">
            <span className="text-orange-800 dark:text-orange-300">Pipeline Diagram</span>
          </h3>
          <pre className="bg-muted/50 border rounded-lg p-4 text-xs font-mono leading-relaxed overflow-x-auto">
            {pipeline.diagram}
          </pre>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold mb-3">
          <span className="text-orange-800 dark:text-orange-300">Pipeline Stages</span>
        </h3>
        <div className="space-y-3">
          {pipeline.stages.map((stage, i) => (
            <Card key={i} className="transition-colors hover:border-orange-800/30 dark:hover:border-orange-300/30">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-700 text-white text-sm font-bold shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">{stage.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {stage.tool}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{stage.description}</p>
                    {stage.commands && stage.commands.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {stage.commands.map((cmd, ci) => (
                          <code
                            key={ci}
                            className="bg-muted rounded px-2 py-1 text-xs font-mono block"
                          >
                            {cmd}
                          </code>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {pipeline.infrastructure && (
        <div>
          <h3 className="text-lg font-semibold mb-2">
            <span className="text-orange-800 dark:text-orange-300">Infrastructure</span>
          </h3>
          <MarkdownBlock content={pipeline.infrastructure} />
        </div>
      )}
    </div>
  );
}

function PatternsView({ project }: { project: Project }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          <span className="text-pink-800 dark:text-pink-300">Design Patterns</span>
          {" "}<span className="text-muted-foreground font-normal text-lg">— {project.name}</span>
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {project.designPatterns.length} patterns used in this project
        </p>
      </div>
      <Accordion
        type="multiple"
        defaultValue={project.designPatterns.map((_, i) => `pattern-${i}`)}
        className="space-y-2"
      >
        {project.designPatterns.map((pattern, i) => (
          <AccordionItem
            key={i}
            value={`pattern-${i}`}
            className="border rounded-lg px-4"
          >
            <AccordionTrigger className="text-base font-semibold">
              <div className="flex items-center gap-2">
                <span>{pattern.name}</span>
                <Badge
                  variant="outline"
                  className={`text-xs ${patternCategoryColors[pattern.category] || ""}`}
                >
                  {pattern.category}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-semibold text-pink-800 dark:text-pink-300 uppercase tracking-wider mb-1">
                    What It Is
                  </h4>
                  <p className="text-sm leading-relaxed">{pattern.whatItIs}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-purple-800 dark:text-purple-300 uppercase tracking-wider mb-1">
                    How It&apos;s Used Here
                  </h4>
                  <p className="text-sm leading-relaxed">{pattern.howProjectUsesIt}</p>
                </div>
                {pattern.codeExample && (
                  <div>
                    <h4 className="text-sm font-semibold text-cyan-800 dark:text-cyan-300 uppercase tracking-wider mb-1">
                      Code Example
                    </h4>
                    <MarkdownBlock content={pattern.codeExample} />
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

export function ProjectExplorer() {
  const [selectedProjectId, setSelectedProjectId] = useState(allProjects[0].id);
  const [selectedView, setSelectedView] = useState<SelectedView>({
    type: "overview",
  });

  const project = allProjects.find((p) => p.id === selectedProjectId) ?? allProjects[0];

  const handleTechClick = (index: number) => {
    setSelectedView({ type: "technology", techIndex: index });
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 text-white text-sm font-bold">
              TD
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">
                Tech Deep Dive
              </h1>
              <p className="text-xs text-muted-foreground">
                {allProjects.length} projects &middot; {allProjects.reduce((sum, p) => sum + p.technologies.length, 0)} technologies
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Project Tabs */}
      <div className="border-b px-6 pt-2">
        <Tabs
          value={selectedProjectId}
          onValueChange={(val) => {
            setSelectedProjectId(val);
            setSelectedView({ type: "overview" });
          }}
        >
          <TabsList variant="line" className="w-full overflow-x-auto flex-nowrap">
            {allProjects.map((p) => (
              <TabsTrigger
                key={p.id}
                value={p.id}
                className={`whitespace-nowrap text-xs font-semibold ${projectTabColors[p.id] || ""}`}
              >
                {p.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-60 border-r shrink-0 overflow-hidden flex flex-col bg-muted/30">
          <ScrollArea className="flex-1">
            <div className="p-3 space-y-0.5">
              {sidebarItems.map((item) => (
                <button
                  key={item.type}
                  onClick={() => setSelectedView({ type: item.type })}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    selectedView.type === item.type
                      ? `${item.activeColor} text-white shadow-sm`
                      : `${item.color} hover:bg-muted/80`
                  }`}
                >
                  {item.label}
                </button>
              ))}

              <Separator className="!my-3" />
              <p className="px-3 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                Technologies ({project.technologies.length})
              </p>

              {project.technologies.map((tech, i) => {
                const isActive = selectedView.type === "technology" && selectedView.techIndex === i;
                const colors = techCategoryColors[tech.category];
                return (
                  <button
                    key={tech.name}
                    onClick={() => handleTechClick(i)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-sm transition-all duration-150 flex items-center gap-2 ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "hover:bg-muted/80"
                    }`}
                  >
                    <span className={`flex h-5 w-5 items-center justify-center rounded text-[9px] font-bold shrink-0 ${isActive ? "bg-primary-foreground/20 text-primary-foreground" : colors?.icon || "bg-muted text-muted-foreground"}`}>
                      {tech.icon}
                    </span>
                    <span className={`truncate text-xs ${!isActive ? (colors?.text || "") : ""}`}>{tech.name}</span>
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-6 py-8">
            {selectedView.type === "overview" && (
              <ProjectOverview project={project} />
            )}
            {selectedView.type === "concepts" && (
              <CoreConceptsView project={project} />
            )}
            {selectedView.type === "architecture" && (
              <ArchitectureView project={project} />
            )}
            {selectedView.type === "cicd" && <CICDView project={project} />}
            {selectedView.type === "patterns" && (
              <PatternsView project={project} />
            )}
            {selectedView.type === "technology" &&
              selectedView.techIndex !== undefined && (
                <TechnologyViewer
                  tech={project.technologies[selectedView.techIndex]}
                />
              )}
          </div>
        </main>
      </div>
    </div>
  );
}
