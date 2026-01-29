
export interface RiskClause {
  clause: string;
  reason: string;
}

export interface AnalysisResult {
  summary: string;
  risks: RiskClause[];
  tips: string[];
}

export type AppState = 'IDLE' | 'LOADING' | 'RESULT' | 'ERROR';
