export interface Profile {
  match_id: string;
  id: string;
  name: string;
  avatar_url: string;
  reason: string;
  contactInfo: {
    email?: string;
    phone?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    github?: string;
    }
  similarity: number;
} 