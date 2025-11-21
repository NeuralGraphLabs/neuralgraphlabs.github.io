import { NavItem, CarouselSlide, TimelineEvent, TabOption, ContentData } from './types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Docs', href: '#docs' },
  { label: 'Blogs', href: '#blogs' },
  { label: 'Experiments', href: '#experiments' },
  { label: 'Models', href: '#models' },
  { label: 'Previews', href: '#previews' },
  { label: 'Timeline', href: '#timeline', isSpecial: true },
];

export const CAROUSEL_SLIDES: CarouselSlide[] = [
  {
    id: 1,
    title: "Tensor Architectures",
    description: "Next-generation sparse matrix operations for edge devices.",
    imageUrl: "https://picsum.photos/1600/900?random=1"
  },
  {
    id: 2,
    title: "Visual Reasoning",
    description: "Zero-shot classification with multimodal attention heads.",
    imageUrl: "https://picsum.photos/1600/900?random=2"
  },
  {
    id: 3,
    title: "Auto-Optimization",
    description: "Compiler-level graph fusion reducing latency by 40%.",
    imageUrl: "https://picsum.photos/1600/900?random=3"
  }
];

export const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    year: "2021",
    title: "Inception",
    description: "The core differentiation engine was written in a basement in Zurich."
  },
  {
    year: "2022",
    title: "Alpha Release",
    description: "First public access. The dynamic graph construction shocked the community."
  },
  {
    year: "2023",
    title: "Ecosystem Growth",
    description: "Over 500 community plugins and standard model implementation."
  },
  {
    year: "2024",
    title: "Enterprise Scale",
    description: "Used by 3 of the top 5 tech giants for production inference."
  },
  {
    year: "Future",
    title: "AGI Foundations",
    description: "Laying the groundwork for self-modifying recursive architectures."
  }
];

export const TAB_CONTENT: Record<TabOption, ContentData> = {
  [TabOption.DOCUMENTATION]: {
    title: "Comprehensive Guides",
    body: "Our documentation is built for humans. Start with the 'Zero to Hero' tutorial to understand the core concepts of AutodiffLabs, or dive into the API reference for low-level graph manipulation details.",
    linkText: "Read the Docs"
  },
  [TabOption.EXPERIMENTS]: {
    title: "Lab Bench",
    body: "Explore our open sandbox of experimental layers. From non-Euclidean manifolds to quantum-simulated annealing layers, check out what the research team is brewing.",
    linkText: "View Experiments"
  },
  [TabOption.MODELS]: {
    title: "Model Zoo",
    body: "Pre-trained weights for Vision, NLP, and Audio tasks. Optimized for the Autodiff runtime, ensuring maximum throughput on consumer hardware.",
    linkText: "Browse Models"
  },
  [TabOption.PREVIEWS]: {
    title: "Early Access",
    body: "Get a glimpse of v2.0. The new JIT compiler promises a 2x speedup on dynamic workloads. Opt-in to the beta channel to test the nightly builds.",
    linkText: "Join Beta"
  },
};