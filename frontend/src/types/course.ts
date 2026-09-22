export interface Term {
  name: string;
  summary: string;
  detail: string[];
}

export interface Lesson {
  id: string;
  title: string;
  level: string;
  focus: string;
  estimatedMinutes: number;
  scenario?: string;
  why: string;
  definition: string;
  explanation: string[];
  levels?: Array<{label: string; content: string}>;
  misconceptions: string[];
  pitfalls: string[];
  compare: string[][];
  terms: Term[];
  lab: { title: string; runtime: string; objective: string; starterCode: string; realCode?: string };
  task: { title: string; description: string; checklist: string[] };
  interview: Array<{ q: string; a: string }>;
}

export interface Chapter {
  id: string;
  title: string;
  goal: string;
  lessons: Lesson[];
  examples?: Array<{ title: string; scenario: string; takeaway: string }>;
  diagram?: { title: string; caption: string; nodes: string[] };
  projectMilestones?: Array<{ version: string; title: string; learns: string; deliverable: string; acceptance: string[] }>;
}

export interface Stage {
  id: string;
  title: string;
  goal: string;
  routeIndex: number;
  routeFocus: string;
  studyFlow: string[];
  chapters: Chapter[];
}

export interface Course {
  version: string;
  title: string;
  description: string;
  stages: Stage[];
  learningRoute: Array<{ id: string; title: string; question: string; outcome: string }>;
  conceptMap: {
    intro: string;
    layers: Array<{ id: string; label: string; description: string; color: string }>;
    projects: Array<{ id: string; title: string; subtitle: string; deliverable: string; lessonIds: string[] }>;
    concepts: Array<{ id: string; name: string; layer: string; plain: string; lessonId: string; projects: string[]; use: string; output: string; prerequisites: string[] }>;
  };
}
