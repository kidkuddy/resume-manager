// Core data types for the Resume & Skills Manager

export interface BaseItem {
  id: string;
  title: string;
  description?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Experience extends BaseItem {
  company: string;
  position: string;
  location: string;
  type: 'full-time' | 'part-time' | 'internship' | 'freelance';
  startDate: string;
  endDate?: string; // null for current position
  current: boolean;
  responsibilities: string[];
  achievements: string[];
  technologies: string[];
}

export interface Project extends BaseItem {
  url?: string;
  repository?: string;
  technologies: string[];
  status: 'completed' | 'in-progress' | 'planning';
  type: 'academic' | 'personal';
  year: number;
  highlights: string[];
}

export interface Certification extends BaseItem {
  issuer: string;
  issueDate: string;
  expirationDate?: string;
  credentialId?: string;
  url?: string;
}

export interface Activity extends BaseItem {
  organization: string;
  role?: string;
  startDate: string;
  endDate?: string;
  location?: string;
  type: 'volunteering' | 'speaking' | 'mentoring' | 'community' | 'other';
}

export interface Skill extends BaseItem {
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  years?: number;
  endorsements?: number;
}

export interface Education extends BaseItem {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  gpa?: string;
  achievements: string[];
  coursework?: string[];
}

export interface LaTeXTemplate {
  id: string;
  name: string;
  description?: string;
  content: string;
  variables: string[]; // List of variables that can be replaced
  createdAt: string;
  updatedAt: string;
}

export interface ResumeData {
  experiences: Experience[];
  projects: Project[];
  certifications: Certification[];
  activities: Activity[];
  skills: Skill[];
  education: Education[];
  templates: LaTeXTemplate[];
}

export type ItemType = 'experiences' | 'projects' | 'certifications' | 'activities' | 'skills' | 'education' | 'templates';

export type AllItems = Experience | Project | Certification | Activity | Skill | Education | LaTeXTemplate;
