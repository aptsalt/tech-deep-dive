export { llmGateway } from "./llm-gateway";
export { ragEvalEngine } from "./rag-eval-engine";
export { agenthire } from "./agenthire";
export { enterprisePlayground } from "./enterprise-playground";
export { moleWorld } from "./mole-world";
export { animatedWebGL, contextEngineeringAcademy } from "./remaining-projects";
import { llmGateway } from "./llm-gateway";
import { ragEvalEngine } from "./rag-eval-engine";
import { agenthire } from "./agenthire";
import { enterprisePlayground } from "./enterprise-playground";
import { moleWorld } from "./mole-world";
import { animatedWebGL, contextEngineeringAcademy } from "./remaining-projects";
import { Project } from "../types";

export const allProjects: Project[] = [
  llmGateway,
  ragEvalEngine,
  agenthire,
  enterprisePlayground,
  moleWorld,
  animatedWebGL,
  contextEngineeringAcademy,
];
