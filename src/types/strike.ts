export type StrikeScope = 'national' | 'state' | 'municipal';
export type StrikeStatus = 'active' | 'ended' | 'suspended' | 'unconfirmed_end';
export type StrikeConfidence = 'confirmed' | 'likely' | 'unverified';

export type StrikePoint = {
  id: string;
  title: string;
  category: string;
  entityName: string | null;
  city: string | null;
  state: string | null;
  scope: StrikeScope;
  lat: number | null;
  lng: number | null;
  startedAt: string;
  endedAt: string | null;
  status: string;
  demands: string | null;
  confidence: string;
  confidenceScore: number;
  published: boolean;
  eventType?: string;
  sources?: StrikeSourcePoint[];
};

export type StrikeSourcePoint = {
  id: string;
  url: string;
  publisher: string | null;
  excerpt: string | null;
  sourceType: string;
};

export type MonthOption = {
  value: string;
  label: string;
  count: number;
};