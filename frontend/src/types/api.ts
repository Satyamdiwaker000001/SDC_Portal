export interface PublicHomeData {
  tagline: string;
  project_count: number;
  dev_count: number;
  featured_projects: Project[];
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  type: string;
  status: 'LIVE' | 'PENDING' | 'COMPLETED' | 'PENDING_ADMIN' | 'DRAFT';
  deadline: string;
  progress: number;
  team_id: string | null;
  short_description?: string;
  github_repo?: string;
  team?: {
    name: string;
    members: { name: string; role: string }[];
  };
}

export interface Developer {
  id: string;
  name: string;
  email: string;
  spec: string;
  join_date: string;
  retirement_date: string | null;
  status: 'ACTIVE' | 'PASSOUT' | 'RETIRED';
  image: string | null;
  tech_stack: string[];
  linkedin_url: string | null;
  github_url: string | null;
  is_founder?: boolean;
}

export interface Team {
  id: string;
  name: string;
  description: string | null;
  created_by: string;
  members: Developer[];
}

export interface RecruitmentDrive {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  status: 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
}

export interface RecruitmentStatus {
  is_active: boolean;
  drive: RecruitmentDrive | null;
}

export interface ApplicationFormData {
  name: string;
  email: string;
  contact: string;
  class_name: string;
  interested: string;
  github_url?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  resume?: File;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
}