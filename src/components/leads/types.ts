export interface PostedLead {
  id: string;
  contact: string;
  title: string;
  description: string;
  requirements: string;
  created_at: string;
  user_id: string;
  embedding: number[];
  selectiveness: number;
}

export interface MyLead {
  id: string;
  similarity: number;
  contact: string;
  title: string;
  description: string;
  created_at: string;
}

export interface CreateLeadData {
  contact: string;
  title: string;
  description: string;
  requirements: string;
  selectiveness: number;
} 