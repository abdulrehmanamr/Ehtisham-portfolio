import React, { useEffect } from 'react';
import { useSite } from '../context/SiteContext';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  page?: 'home' | 'about' | 'projects' | 'services' | 'contact';
}

const SEO: React.FC<SEOProps> = ({ page }) => {
  const { config } = useSite();
  const location = useLocation();

  useEffect(() => {
    if (!config?.seo) return;

    const seo = config.seo;
    const pageKey = page || location.pathname.split('/')[1] || 'home';
    const pageSeo = seo.pages[pageKey] || seo.pages.home;

    // Update Title
    const title = pageSeo?.title 
      ? `${pageSeo.title} | ${seo.title}` 
      : seo.title;
    document.title = title;

    // Update Meta Description
    const description = pageSeo?.description || seo.description;
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // Update Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', seo.keywords);

    // OG Tags
    const updateOgTag = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    updateOgTag('og:title', title);
    updateOgTag('og:description', description);
    updateOgTag('og:type', 'website');
    updateOgTag('og:url', window.location.href);
    if (seo.ogImage) {
      updateOgTag('og:image', seo.ogImage);
    }

  }, [config, page, location]);

  return null;
};

export default SEO;
