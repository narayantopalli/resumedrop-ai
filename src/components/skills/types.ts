export interface SkillRecommendation {
  skill: string;
  explanation: string;
  url: string;
  provider: string;
}

export interface SkillsData {
  skills_to_improve: SkillRecommendation[];
  job_title: string;
  company_name: string;
  work_arrangement: string;
  job_keywords: string[];
} 