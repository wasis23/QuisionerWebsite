export type QuestionSection = 'knowledge' | 'evaluation' | 'review';
export type ScaleType = 'comprehension' | 'readability' | 'star' | 'text';

export interface Question {
  id: string;
  section: QuestionSection;
  text: string;
  type: ScaleType;
  required: boolean;
  order: number;
  customScaleLabels?: {
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
  };
}

export interface RespondentIdentity {
  name?: string;
  gender: 'Laki-Laki' | 'Perempuan' | 'Lainnya' | '';
  age: string;
  education: string;
  occupation: string;
}

export interface ResponseItem {
  id: string;
  timestamp: string;
  languageRead: 'id' | 'en';
  respondent: RespondentIdentity;
  answers: Record<string, number | string>; // questionId -> rating 1-5 or text
  timeSpentSeconds?: number;
}

export interface JournalMetadata {
  id: string;
  slug: string;
  title: string;
  authors: string;
  institution: string;
  abstractId: string;
  abstractEn: string;
  pdfPathId: string;
  pdfPathEn: string;
  status: 'active' | 'closed';
  deadline: string;
  keywords: string[];
}

export interface StatSummary {
  totalRespondents: number;
  idReadersCount: number;
  enReadersCount: number;
  overallAverageScore: number;
}
