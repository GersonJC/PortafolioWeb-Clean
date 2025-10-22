// lib/types.ts

export interface Project {
  id: number;
  title: string;
  description: string;
  shortDescription: string;
  technologies: string[];
  imageUrl: string | null;
  githubUrl: string | null;
  demoUrl: string | null;
  startDate: string | null;
  endDate: string | null;
  featured: boolean;
  category: string;
  orderIndex: number;
}

export interface Experience {
  id: number;
  company: string;
  position: string;
  description: string;
  technologies: string[];
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  logoUrl: string | null;
  location: string;
}

export interface Skill {
  id: number;
  name: string;
  category: string;
  level: number;
  yearsExperience: number;
  projectsCount: number;
  icon: string | null;
}

export interface Education {
  id: number;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  description: string;
  logoUrl: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  count: number;
}