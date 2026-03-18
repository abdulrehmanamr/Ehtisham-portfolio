export interface SEOConfig {
  title: string;
  description: string;
  keywords: string;
  ogImage?: string;
  pages: {
    [key: string]: {
      title: string;
      description: string;
    }
  };
}

export interface SiteConfig {
  name: string;
  title: string;
  bio: string;
  location: string;
  experience: string;
  availability: string;
  profileImage: string;
  aboutImage?: string;
  logoUrl?: string;
  seo?: SEOConfig;
  socialLinks: {
    behance?: string;
    whatsapp?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    fiverr?: string;
  };
  theme: {
    primaryColor: string;
    accentColor: string;
    darkMode: boolean;
    sizes?: {
      baseFontSize?: string;
      mobileBaseFontSize?: string;
      heroTitleSize?: string;
      mobileHeroTitleSize?: string;
      sectionTitleSize?: string;
      mobileSectionTitleSize?: string;
      imageScale?: number;
      mobileImageScale?: number;
      aboutImageScale?: number;
    };
    sectionColors?: {
      hero?: string;
      skills?: string;
      projects?: string;
      testimonials?: string;
      cta?: string;
      about?: string;
      services?: string;
      contact?: string;
      text?: string;
    };
  };
  skills: {
    name: string;
    icon: string;
  }[];
  testimonials: {
    id: string;
    name: string;
    role: string;
    content: string;
    avatarUrl?: string;
    rating?: number;
  }[];
  timeline: {
    year: string;
    title: string;
    company: string;
    desc: string;
  }[];
  pageContent: {
    home: {
      heroTitle: string;
      heroSubtitle: string;
      ctaTitle: string;
      ctaSubtitle: string;
    };
    about: {
      title: string;
      subtitle: string;
    };
    services: {
      title: string;
      subtitle: string;
    };
    contact: {
      title: string;
      subtitle: string;
    };
  };
  contactInfo: {
    email: string;
    phone: string;
    address: string;
    whatsapp: string;
  };
  homeBlocks: HomeBlock[];
}

export interface HomeBlock {
  id: string;
  type: 'hero' | 'skills' | 'projects' | 'testimonials' | 'cta' | 'text' | 'services' | 'about' | 'contact';
  enabled: boolean;
  data?: any;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  tags: string[];
  link?: string;
  featured: boolean;
  createdAt: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  icon: string;
  order: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatarUrl?: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  createdAt: string;
  read: boolean;
}
