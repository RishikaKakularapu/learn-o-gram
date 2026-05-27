// Type definition only. Actual data lives in Supabase.
export type LearningPost = {
  id: string;
  topic: string;
  title: string;
  definition: string;
  example?: string;
  remember?: string;
  tags: string[];
  source?: string;
  icon?: string;
  backgroundImage?: string;
  foregroundImage?: string;
};
