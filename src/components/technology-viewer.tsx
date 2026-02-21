"use client";

import { Technology } from "@/data/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MarkdownBlock, formatInlineCode } from "@/components/markdown-block";

const categoryColors: Record<string, string> = {
  language: "bg-blue-900/10 text-blue-800 dark:text-blue-300 border-blue-800/20",
  framework: "bg-purple-900/10 text-purple-800 dark:text-purple-300 border-purple-800/20",
  database: "bg-green-900/10 text-green-800 dark:text-green-300 border-green-800/20",
  infrastructure: "bg-orange-900/10 text-orange-800 dark:text-orange-300 border-orange-800/20",
  library: "bg-pink-900/10 text-pink-800 dark:text-pink-300 border-pink-800/20",
  tool: "bg-yellow-900/10 text-yellow-800 dark:text-yellow-300 border-yellow-800/20",
  protocol: "bg-cyan-900/10 text-cyan-800 dark:text-cyan-300 border-cyan-800/20",
  "ai-ml": "bg-red-900/10 text-red-800 dark:text-red-300 border-red-800/20",
  testing: "bg-emerald-900/10 text-emerald-800 dark:text-emerald-300 border-emerald-800/20",
  observability: "bg-indigo-900/10 text-indigo-800 dark:text-indigo-300 border-indigo-800/20",
};

export function TechnologyViewer({ tech }: { tech: Technology }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
            {tech.icon}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold tracking-tight">{tech.name}</h2>
            <p className="text-sm text-muted-foreground">{tech.tagline}</p>
          </div>
          <Badge className={`${categoryColors[tech.category] || ""}`}>
            {tech.category}
          </Badge>
        </div>
      </div>

      <Separator />

      {/* ELI10 + Analogy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-blue-800/20 bg-blue-900/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-blue-800 dark:text-blue-300">
              Explain Like I&apos;m 10
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed">
            {tech.explainLikeImTen}
          </CardContent>
        </Card>
        <Card className="border-amber-800/20 bg-amber-900/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-amber-800 dark:text-amber-300">
              Real-World Analogy
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed">
            {tech.realWorldAnalogy}
          </CardContent>
        </Card>
      </div>

      {/* Origin Story */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Origin Story</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <div className="flex flex-wrap gap-4 text-muted-foreground">
            <span>
              Created by{" "}
              <strong className="text-foreground">
                {tech.origin.creator}
              </strong>
            </span>
            <span>
              Year:{" "}
              <strong className="text-foreground">{tech.origin.year}</strong>
            </span>
          </div>
          <p className="leading-relaxed">{tech.origin.motivation}</p>
        </CardContent>
      </Card>

      {/* Accordion Sections */}
      <Accordion
        type="multiple"
        defaultValue={["what", "features", "why", "how", "concepts"]}
        className="space-y-2"
      >
        <AccordionItem value="what" className="border rounded-lg px-4">
          <AccordionTrigger className="text-base font-semibold">
            What It Is
          </AccordionTrigger>
          <AccordionContent>
            <MarkdownBlock content={tech.whatItIs} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="why" className="border rounded-lg px-4">
          <AccordionTrigger className="text-base font-semibold">
            Why We Used It
          </AccordionTrigger>
          <AccordionContent>
            <MarkdownBlock content={tech.whyWeUsedIt} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="how" className="border rounded-lg px-4">
          <AccordionTrigger className="text-base font-semibold">
            How It Works in This Project
          </AccordionTrigger>
          <AccordionContent>
            <MarkdownBlock content={tech.howItWorksInProject} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="features" className="border rounded-lg px-4 border-primary/20 bg-primary/[0.02]">
          <AccordionTrigger className="text-base font-semibold">
            Features Using This Technology
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {tech.featuresInProject.map((feat, i) => (
                <div
                  key={i}
                  className="border rounded-md p-3 bg-muted/30"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                      {i + 1}
                    </div>
                    <h4 className="font-semibold text-sm">{feat.feature}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground ml-8">
                    {feat.description}
                  </p>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="concepts" className="border rounded-lg px-4">
          <AccordionTrigger className="text-base font-semibold">
            Core Concepts & Code
          </AccordionTrigger>
          <AccordionContent>
            <MarkdownBlock content={tech.coreConceptsMarkdown} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="proscons" className="border rounded-lg px-4">
          <AccordionTrigger className="text-base font-semibold">
            Pros & Cons
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">
                  Pros
                </h4>
                {tech.prosAndCons.pros.map((pro, i) => (
                  <div key={i} className="flex gap-2 py-1 text-sm">
                    <span className="text-green-800 dark:text-green-300 shrink-0">
                      +
                    </span>
                    <span>{pro}</span>
                  </div>
                ))}
              </div>
              <div>
                <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2">
                  Cons
                </h4>
                {tech.prosAndCons.cons.map((con, i) => (
                  <div key={i} className="flex gap-2 py-1 text-sm">
                    <span className="text-red-800 dark:text-red-300 shrink-0">
                      -
                    </span>
                    <span>{con}</span>
                  </div>
                ))}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="alternatives" className="border rounded-lg px-4">
          <AccordionTrigger className="text-base font-semibold">
            Alternatives & Comparisons
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {tech.alternatives.map((alt, i) => (
                <div key={i} className="border rounded-md p-3">
                  <h4 className="font-semibold text-sm">{alt.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {alt.comparison}
                  </p>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="apis" className="border rounded-lg px-4">
          <AccordionTrigger className="text-base font-semibold">
            Key APIs & Commands
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-1">
              {tech.keyAPIs.map((api, i) => (
                <div key={i} className="flex gap-2 py-1 text-sm font-mono">
                  <span className="text-muted-foreground">&#8250;</span>
                  <span>{formatInlineCode(api)}</span>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="academic" className="border rounded-lg px-4">
          <AccordionTrigger className="text-base font-semibold">
            Academic Foundations
          </AccordionTrigger>
          <AccordionContent>
            <MarkdownBlock content={tech.academicFoundations} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="reading" className="border rounded-lg px-4">
          <AccordionTrigger className="text-base font-semibold">
            Further Reading
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-1">
              {tech.furtherReading.map((ref, i) => (
                <div key={i} className="flex gap-2 py-1 text-sm">
                  <span className="text-muted-foreground shrink-0">
                    &#128214;
                  </span>
                  <span>{ref}</span>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
