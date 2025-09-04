export type TicketStatus = '未着手' | '作業中' | '確認待ち' | '完了';

export type Ticket = {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: '低' | '中' | '高';
  slaHours?: number;
  createdAt: string;
  updatedAt: string;
};

export type AdviceMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
};

export type RiskAssessmentRecord = {
  id: string;
  score: 1 | 2 | 3 | 4 | 5;
  recommendations: string[];
  createdAt: string;
};

export type RoiRecord = {
  id: string;
  investment: number;
  benefitPerYear: number;
  years: number;
  roi: number;
  createdAt: string;
};


