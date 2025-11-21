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
  year: string;
  title: string;
  description: string;
}

export enum TabOption {
  DOCUMENTATION = 'Documentation',
  EXPERIMENTS = 'Experiments',
  MODELS = 'Models',
  PREVIEWS = 'Previews',
}

export interface ContentData {
  title: string;
  body: string;
  image?: string;
  linkText?: string;
}