export interface NavItem {
  label: string;
  href: string;
  isSpecial?: boolean;
}

export interface CarouselSlide {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

export interface TimelineEvent {
  topic: string;
  title: string;
  description: string;
}

export enum TabOption {
  DOCUMENTATION = 'Documentation',
  PROJECTS = 'Projects',
  MODELS = 'Models',
  Research = 'Research',
}

export interface ContentData {
  title: string;
  body: string;
  image?: string;
  linkText?: string;
}

export interface GitHubFile {
  name: string
  content: string
}

export interface GitHubItem {
  name: string;
  path: string;
  type: 'file' | 'dir';
  download_url: string | null;
  url: string; // API url to fetch contents if dir
}

export interface DocFile {
  name: string;
  content: string;
  path: string;
}

export interface DocSection {
  title: string;
  items: DocFile[];
}