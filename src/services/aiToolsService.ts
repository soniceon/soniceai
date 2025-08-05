import { aiTools, AiTool } from '../data/aiTools';

export function getAllAiTools(): AiTool[] {
  return aiTools;
}

export function getAiToolById(id: string): AiTool | undefined {
  return aiTools.find(tool => tool.id === id);
}

export function getAiToolsByType(type: string): AiTool[] {
  return aiTools.filter(tool => tool.type === type);
}

export function getFeaturedAiTools(): AiTool[] {
  return aiTools.filter(tool => tool.featured);
}

export type { AiTool }; 