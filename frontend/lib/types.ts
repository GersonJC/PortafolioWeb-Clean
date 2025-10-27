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
    context?: string;
  problem?: string;
  objective?: string;
  chartConfig?: ProjectChartConfig;
}

export interface ProjectChartConfig {
  chartType: 'line' | 'bar' | 'area'| 'scatter';
  title: string;
  xAxisLabel: string;
  yAxisLabel: string;
  data: ChartDataPoint[];
}

export interface ChartDataPoint {
  name: string;
  value: number;
  category?: string;
  x?: number;
  y?: number;
  z?: number;
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

export interface ApiParameter {
  Name: string;
  Type: string;
  Required: boolean;
  Description: string;
}

export interface ApiRequestBody {
  Field: string;
  Type: string;
  Required: boolean;
  Description: string;
}

export interface ApiEndpoint {
  Id: number;
  Name: string;
  Method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  Endpoint: string;
  Description: string;
  Category: string;
  Parameters?: ApiParameter[];
  RequestBody?: ApiRequestBody[];
  ExampleRequest?: string;
  OrderIndex: number;
}

export interface ApiDocumentation {
  Id: number;
  Title: string;
  Description: string;
  BaseUrl: string;
  Technologies: string[];
}