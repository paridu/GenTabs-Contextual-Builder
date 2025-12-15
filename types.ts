export interface TabContext {
  id: string;
  title: string;
  url: string;
  content: string; // Extracted text content
  favicon?: string;
  timestamp: number;
}

export enum AppType {
  SUMMARY = 'summary',
  COMPARISON = 'comparison',
  TIMELINE = 'timeline',
  KANBAN = 'kanban',
  QUIZ = 'quiz',
  UNDEFINED = 'undefined'
}

export interface AppSchema {
  type: AppType;
  title: string;
  description: string;
  data: any; // Flexible schema based on type
  sources: string[]; // IDs of tabs used
  createdAt: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  relatedAppId?: string; // If this message triggered an app generation
}

export interface AgentStatus {
  name: string;
  status: 'idle' | 'working' | 'done' | 'error';
  message?: string;
}

export interface ComparisonData {
  columns: string[];
  rows: Record<string, string>[];
}

export interface TimelineData {
  items: { date: string; title: string; description: string; sourceId?: string }[];
}

export interface KanbanData {
  columns: { id: string; title: string; items: { id: string; title: string; description?: string }[] }[];
}

export interface SummaryData {
  keyPoints: string[];
  summary: string;
  actionItems: string[];
}
