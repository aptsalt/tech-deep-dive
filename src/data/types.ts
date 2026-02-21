export interface Technology {
  name: string;
  category: "language" | "framework" | "database" | "infrastructure" | "library" | "tool" | "protocol" | "ai-ml" | "testing" | "observability";
  icon: string;
  tagline: string;
  origin: {
    creator: string;
    year: number;
    motivation: string;
  };
  whatItIs: string;
  explainLikeImTen: string;
  realWorldAnalogy: string;
  whyWeUsedIt: string;
  howItWorksInProject: string;
  featuresInProject: {
    feature: string;
    description: string;
  }[];
  coreConceptsMarkdown: string;
  prosAndCons: {
    pros: string[];
    cons: string[];
  };
  alternatives: {
    name: string;
    comparison: string;
  }[];
  keyAPIs: string[];
  academicFoundations: string;
  furtherReading: string[];
}

export interface CoreConcept {
  name: string;
  slug: string;
  whatItIs: string;
  whyItMatters: string;
  howProjectUsesIt: string;
  keyTerms: { term: string; definition: string }[];
}

export interface VideoResource {
  title: string;
  url: string;
  channel: string;
  durationMinutes: number;
  relevance: string;
}

export interface RealWorldExample {
  company: string;
  product: string;
  description: string;
  conceptConnection: string;
  url?: string;
}

export interface DesignPattern {
  name: string;
  category: "behavioral" | "structural" | "creational" | "architectural";
  whatItIs: string;
  howProjectUsesIt: string;
  codeExample?: string;
}

export interface CICDStage {
  name: string;
  tool: string;
  description: string;
  commands?: string[];
}

export interface CICDPipeline {
  overview: string;
  stages: CICDStage[];
  infrastructure?: string;
  diagram?: string;
}

export interface ArchitectureSection {
  title: string;
  content: string;
  diagram?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  repo: string;
  languages: string[];
  technologies: Technology[];
  architecture: ArchitectureSection[];
  cicd: CICDPipeline;
  designPatterns: DesignPattern[];
  keyTakeaways: string[];
  coreConcepts: CoreConcept[];
  videoResources: VideoResource[];
  realWorldExamples: RealWorldExample[];
}
