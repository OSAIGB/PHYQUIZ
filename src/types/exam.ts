export type ExamSection = 'JUPEB' | 'UNIBEN' | 'JAMB';

export interface QuestionOption {
  label: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface Question {
  id: number;
  section: ExamSection;
  sectionTitle: string;
  source: string;
  prompt: string;
  options: QuestionOption[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  topic: string;
  formula: string;
}

export interface ExamInfraction {
  timestamp: number;
  type: 'fullscreen_exit' | 'tab_switch' | 'blur';
  message: string;
}

export interface ExamResult {
  studentName?: string;
  candidateId?: string;
  startTime: number;
  endTime: number;
  totalDurationSeconds: number;
  answers: Record<number, 'A' | 'B' | 'C' | 'D' | null>;
  timeSpentPerQuestion: Record<number, number>;
  timedOutQuestions: number[];
  score: number;
  totalQuestions: number;
  percentage: number;
  grade: string;
  infractions: ExamInfraction[];
  sectionScores: Record<ExamSection, { score: number; total: number; percentage: number }>;
  topicBreakdown: Record<string, { correct: number; total: number }>;
  recommendations: Recommendation[];
}

export interface Recommendation {
  title: string;
  status: 'critical' | 'moderate' | 'mastered';
  advice: string;
  keyFormula: string;
  relatedQuestions: number[];
}
