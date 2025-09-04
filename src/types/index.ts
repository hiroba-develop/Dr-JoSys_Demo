export type TicketStatus = '未着手' | '作業中' | '確認待ち' | '完了';

export type Ticket = {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: '低' | '中' | '高';
  slaHours?: number;
  assignee?: string;
  startDate?: string; // YYYY-MM-DD
  dueDate?: string; // YYYY-MM-DD
  department?: string;
  createdAt: string;
  updatedAt: string;
};

export type AdviceMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
  imageUrl?: string;
  imageName?: string;
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

export type ItAssetType = 'PC' | '携帯' | 'プリンター' | 'その他';
export type ItAssetStatus = '新品' | '使用中' | '故障中';

export type ItAsset = {
  id: string;
  type: ItAssetType;
  status: ItAssetStatus;
  user: string;
  purchaseDate: string; // YYYY-MM-DD
  price: number;
};

export type ServiceAsset = {
  id: string;
  serviceName: string;
  department: string;
  owner: string;
  reason: string;
};

export type CompanyInfo = {
  companyName: string;
  companyNameKana: string;
  address: string;
  industry: string;
  contactPerson: string;
};

export type Department = {
  id: string;
  name: string;
};


