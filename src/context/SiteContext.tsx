import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { SiteConfig } from '../types';

interface SiteContextType {
  config: SiteConfig | null;
  loading: boolean;
  setConfig: React.Dispatch<React.SetStateAction<SiteConfig | null>>;
}

const SiteContext = createContext<SiteContextType>({ 
  config: null, 
  loading: true,
  setConfig: () => {} 
});

const defaultConfig: SiteConfig = {
  name: 'Ehtisham Arshad',
  title: 'Thumbnail Designer',
  bio: 'I am a skilled thumbnail designer with a talent for crafting eye-catching visuals...',
  location: 'Lahore, Pakistan',
  experience: '2+ Years',
  availability: 'Available Now',
  profileImage: 'https://picsum.photos/seed/ehtisham/400/400',
  aboutImage: 'https://picsum.photos/seed/ehtisham/800/1000',
  logoUrl: '',
  seo: {
    title: 'Ehtisham Arshad | Professional Thumbnail Designer',
    description: 'Expert thumbnail designer helping YouTubers and creators boost their CTR and views with high-impact, viral designs.',
    keywords: 'thumbnail designer, youtube thumbnails, graphic design, CTR optimization, viral thumbnails',
    pages: {
      home: { title: 'Home', description: 'Welcome to Ehtisham Arshad Portfolio' },
      about: { title: 'About Me', description: 'Learn more about my journey and expertise' },
      projects: { title: 'Portfolio', description: 'Explore my best thumbnail designs' },
      services: { title: 'Services', description: 'Professional design services for creators' },
      contact: { title: 'Contact', description: 'Get in touch for your next project' }
    }
  },
  socialLinks: {
    behance: 'https://www.behance.net/ehtishamarshad22/projects',
    whatsapp: '',
    instagram: '',
    twitter: '',
    linkedin: '',
    fiverr: ''
  },
  theme: {
    primaryColor: '#8B5CF6',
    accentColor: '#10B981',
    darkMode: true,
    sizes: {
      baseFontSize: '16px',
      mobileBaseFontSize: '14px',
      heroTitleSize: '72px',
      mobileHeroTitleSize: '36px',
      sectionTitleSize: '48px',
      mobileSectionTitleSize: '28px',
      imageScale: 1,
      mobileImageScale: 0.8,
      aboutImageScale: 0.5
    },
    sectionColors: {
      hero: '',
      skills: '',
      projects: '',
      testimonials: '',
      cta: '',
      about: '',
      services: '',
      contact: '',
      text: ''
    }
  },
  skills: [
    { name: 'Photoshop', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg' },
    { name: 'Canva', icon: 'https://cdn.worldvectorlogo.com/logos/canva-1.svg' },
    { name: 'Illustrator', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/illustrator/illustrator-plain.svg' },
    { name: 'Premiere Pro', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/premierepro/premierepro-plain.svg' },
    { name: 'After Effects', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/aftereffects/aftereffects-plain.svg' }
  ],
  testimonials: [
    { id: '1', name: 'John Doe', role: 'Content Creator', content: 'Amazing work! The thumbnails really helped my CTR. Highly recommended for any YouTuber.', avatarUrl: 'https://picsum.photos/seed/1/100/100' },
    { id: '2', name: 'Sarah Wilson', role: 'Marketing Manager', content: 'Ehtisham is a true professional. His designs are modern, eye-catching, and delivered on time.', avatarUrl: 'https://picsum.photos/seed/2/100/100' },
    { id: '3', name: 'Mike Johnson', role: 'Streamer', content: 'The best thumbnail designer I have worked with. He understands the vision perfectly every time.', avatarUrl: 'https://picsum.photos/seed/3/100/100' },
    { id: '4', name: 'Emily Chen', role: 'Vlogger', content: 'My channel views increased by 40% after I started using Ehtisham\'s thumbnails. Simply the best!', avatarUrl: 'https://picsum.photos/seed/4/100/100' },
    { id: '5', name: 'David Miller', role: 'Tech Reviewer', content: 'Professional, creative, and extremely fast. Ehtisham is my go-to for all my design needs.', avatarUrl: 'https://picsum.photos/seed/5/100/100' },
    { id: '6', name: 'Jessica Lee', role: 'Gaming Channel', content: 'The attention to detail is incredible. My thumbnails stand out so much more now.', avatarUrl: 'https://picsum.photos/seed/6/100/100' }
  ],
  timeline: [
    { year: '2024 - Present', title: 'Senior Thumbnail Designer', company: 'Freelance', desc: 'Working with top-tier YouTubers to optimize their CTR.' },
    { year: '2022 - 2024', title: 'Graphic Designer', company: 'Creative Agency', desc: 'Focused on social media marketing and brand identity.' },
    { year: '2021 - 2022', title: 'Student & Learner', company: 'Self-Taught', desc: 'Mastering Adobe Creative Suite and design principles.' },
  ],
  pageContent: {
    home: {
      heroTitle: 'Crafting Viral Visuals for Creators.',
      heroSubtitle: "Hi, I'm Ehtisham Arshad. A professional thumbnail designer helping you boost CTR and engagement with high-impact designs.",
      ctaTitle: 'Ready to explode your views?',
      ctaSubtitle: "Let's collaborate and create thumbnails that your audience can't help but click."
    },
    about: {
      title: 'Passionate about Visual Storytelling.',
      subtitle: 'I believe that every thumbnail is a gateway to a story. My mission is to make that gateway as inviting and compelling as possible.'
    },
    services: {
      title: 'Premium Design Services',
      subtitle: 'Elevate your content with professional thumbnails and brand assets.'
    },
    contact: {
      title: "Let's Build Something Great",
      subtitle: "Have a project in mind? I'd love to hear from you."
    }
  },
  contactInfo: {
    email: 'contact@ehtisham.com',
    phone: '+92 300 0000000',
    address: 'Lahore, Pakistan',
    whatsapp: '+92 300 0000000'
  },
  homeBlocks: [
    { id: 'hero-1', type: 'hero', enabled: true },
    { id: 'skills-1', type: 'skills', enabled: true },
    { id: 'projects-1', type: 'projects', enabled: true },
    { id: 'services-1', type: 'services', enabled: true },
    { id: 'testimonials-1', type: 'testimonials', enabled: true },
    { id: 'cta-1', type: 'cta', enabled: true }
  ]
};

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'config', 'site'), (doc) => {
      if (doc.exists()) {
        const data = doc.data() as SiteConfig;
        setConfig({
          ...defaultConfig,
          ...data,
          socialLinks: { ...defaultConfig.socialLinks, ...(data.socialLinks || {}) },
          contactInfo: { ...defaultConfig.contactInfo, ...(data.contactInfo || {}) },
          homeBlocks: data.homeBlocks || defaultConfig.homeBlocks,
          pageContent: {
            ...defaultConfig.pageContent,
            ...(data.pageContent || {}),
            home: { ...defaultConfig.pageContent.home, ...(data.pageContent?.home || {}) },
            about: { ...defaultConfig.pageContent.about, ...(data.pageContent?.about || {}) },
            services: { ...defaultConfig.pageContent.services, ...(data.pageContent?.services || {}) },
            contact: { ...defaultConfig.pageContent.contact, ...(data.pageContent?.contact || {}) },
          }
        });
      } else {
        setConfig(defaultConfig);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <SiteContext.Provider value={{ config, loading, setConfig }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => useContext(SiteContext);
