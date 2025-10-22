// lib/api.ts

import { ApiResponse, Project, Experience, Skill, Education } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7071/api';

async function fetchAPI<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  const data: ApiResponse<T> = await response.json();
  
  if (!data.success) {
    throw new Error(data.message || 'API request failed');
  }

  return data.data;
}

// Projects API
export async function getProjects(params?: {
  category?: string;
  featured?: boolean;
}): Promise<Project[]> {
  let endpoint = '/projects';
  
  if (params) {
    const queryParams = new URLSearchParams();
    if (params.category) queryParams.append('category', params.category);
    if (params.featured !== undefined) queryParams.append('featured', params.featured.toString());
    
    if (queryParams.toString()) {
      endpoint += `?${queryParams.toString()}`;
    }
  }
  
  return fetchAPI<Project[]>(endpoint);
}

export async function getProjectById(id: number): Promise<Project> {
  return fetchAPI<Project>(`/projects/${id}`);
}

// Experience API
export async function getExperience(): Promise<Experience[]> {
  return fetchAPI<Experience[]>('/experience');
}

// Skills API
export async function getSkills(category?: string): Promise<Skill[]> {
  const endpoint = category ? `/skills?category=${category}` : '/skills';
  return fetchAPI<Skill[]>(endpoint);
}

// Education API
export async function getEducation(): Promise<Education[]> {
  return fetchAPI<Education[]>('/education');
}