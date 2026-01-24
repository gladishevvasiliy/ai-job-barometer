export type Specialty = 
  | 'frontend' 
  | 'backend' 
  | 'qa' 
  | 'devops' 
  | 'mobile' 
  | 'data_science' 
  | 'ml_engineer' 
  | 'designer' 
  | 'pm';

export type VoteType = 'working' | 'ai_replaced';

export interface Vote {
  id: string;
  user_id: string;
  vote_type: VoteType;
  specialty: Specialty;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  provider: string;
  display_name: string;
  specialty: Specialty | null;
}

export interface Stats {
  totalVotes: number;
  workingCount: number;
  aiReplacedCount: number;
  percentage: number;
}
