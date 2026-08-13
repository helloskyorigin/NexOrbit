export type ConnectorType = 'gmail' | 'calendar' | 'drive' | 'notion' | 'github';

export interface SourceItem {
  id: string;
  connector: ConnectorType;
  connectorName: string;
  title: string;
  snippet: string;
  timestamp: string;
  url?: string;
}

export interface InsightCardData {
  id: string;
  title: string;
  content: string;
  priority: 'high' | 'medium' | 'info';
  sources: SourceItem[];
}

export interface AskResponseData {
  id: string;
  summaryText: string;
  insights: InsightCardData[];
  recommendedNextStep?: {
    text: string;
    actionLabel: string;
  };
  sources: SourceItem[];
  whyExplanation: string;
}

export interface AskMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  aiData?: AskResponseData;
}

export interface AskConversation {
  id: string;
  title: string;
  updatedAt: string;
  messages: AskMessage[];
}

export interface ContextEntity {
  id: string;
  title: string;
  type: 'project' | 'person' | 'email' | 'event' | 'doc';
  countText: string;
  details: string[];
}
