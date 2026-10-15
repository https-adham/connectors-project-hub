export type SubmissionType = 'named' | 'anonymous';

export type ProjectType =
  | 'mobile_app'
  | 'website'
  | 'ai_ml'
  | 'hardware'
  | 'iot_embedded'
  | 'community_initiative'
  | 'event'
  | 'scientific_research'
  | 'ui_ux_design'
  | 'internal_tool'
  | 'multidisciplinary'
  | 'other';

export type EstimatedDuration =
  | 'less_than_1_month'
  | '1_to_3_months'
  | 'more_than_3_months';

export type WillingToLead = 'yes' | 'no' | 'unsure';

export type EstimatedTeamSize =
  | '1_2'
  | '3_4'
  | '5_6'
  | 'more_than_6'
  | 'undecided';

export type ReviewStatus =
  | 'new'
  | 'under_review'
  | 'needs_more_info'
  | 'accepted_provisionally'
  | 'deferred'
  | 'not_suitable';

export interface ProjectIdea {
  id: string;
  created_at: string;
  
  // Step 1: Submitter Info
  submission_type: SubmissionType;
  submitter_name: string | null;
  contact_method: string | null;
  
  // Step 2: Idea Details
  project_title: string;
  project_description: string;
  problem_statement: string;
  target_audience: string;
  
  // Step 3: Implementation Details
  project_type: ProjectType;
  custom_project_type?: string | null;
  required_skills: string[];
  custom_skills?: string[];
  estimated_duration: EstimatedDuration;
  difficulty_level: number; // 1 to 5
  
  // Step 4: Team Participation
  willing_to_lead: WillingToLead;
  preferred_collaborators?: string | null;
  estimated_team_size: EstimatedTeamSize;
  
  // Step 5: Additional Info
  inspiration_url?: string | null;
  additional_notes?: string | null;
  
  // Admin Review Fields
  review_status: ReviewStatus;
  reviewer_notes?: string | null;
  reviewed_at?: string | null;
  reviewed_by?: string | null;
}

export interface SubmissionFormData {
  // Step 1
  submission_type: SubmissionType;
  submitter_name: string;
  contact_method: string;
  
  // Step 2
  project_title: string;
  project_description: string;
  problem_statement: string;
  target_audience: string;
  
  // Step 3
  project_type: ProjectType;
  custom_project_type: string;
  required_skills: string[];
  custom_skills: string[];
  estimated_duration: EstimatedDuration;
  difficulty_level: number;
  
  // Step 4
  willing_to_lead: WillingToLead;
  preferred_collaborators: string;
  estimated_team_size: EstimatedTeamSize;
  
  // Step 5
  inspiration_url: string;
  additional_notes: string;
  consent: boolean;
  
  // Anti-spam honeypot (must stay empty)
  _honey?: string;
}

export interface AdminProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'super_admin' | 'reviewer' | 'leader';
  created_at: string;
  updated_at: string;
}

export interface DashboardMetrics {
  totalIdeas: number;
  newIdeas: number;
  underReview: number;
  acceptedProvisionally: number;
  needsMoreInfo: number;
  potentialLeaders: number;
}

export interface ProjectIdeaFilter {
  searchQuery?: string;
  projectType?: string;
  reviewStatus?: string;
  estimatedDuration?: string;
  difficultyLevel?: string;
  willingToLead?: string;
  sortBy?: 'created_at_desc' | 'created_at_asc' | 'difficulty_desc' | 'difficulty_asc';
  page?: number;
  pageSize?: number;
}
