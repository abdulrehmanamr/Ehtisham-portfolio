import React, { useEffect } from 'react';
import { useSite } from '../context/SiteContext';
import { useLocation } from 'react-router-dom';

import { Project } from '../types';

interface SEOProps {
  page?: 'home' | 'about' | 'projects' | 'services' | 'contact';
  projects?: Project[];
  title?: string;
  description?: string;
  keywords?: string;
}

const SEO: React.FC<SEOProps> = ({ page, projects, title: propTitle, description: propDescription, keywords: propKeywords }) => {
  const { config } = useSite();
  const location = useLocation();

  useEffect(() => {
    if (!config?.seo) return;

    const seo = config.seo;
    const pageKey = page || location.pathname.split('/')[1] || 'home';
    const pageSeo = seo.pages[pageKey] || seo.pages.home;

    // Update Title
    const baseTitle = propTitle || pageSeo?.title;
    const title = baseTitle 
      ? `${baseTitle} | ${seo.title}` 
      : seo.title;
    document.title = title;

    // Update Meta Description
    const description = propDescription || pageSeo?.description || seo.description;
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // Update Keywords
    const keywords = propKeywords || seo.keywords;
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', keywords);

    // OG Tags
    const updateMetaTag = (attr: string, attrValue: string, content: string) => {
      let tag = document.querySelector(`meta[${attr}="${attrValue}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attr, attrValue);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    updateMetaTag('property', 'og:title', title);
    updateMetaTag('property', 'og:description', description);
    updateMetaTag('property', 'og:type', 'website');
    updateMetaTag('property', 'og:url', window.location.href);
    if (seo.ogImage) {
      updateMetaTag('property', 'og:image', seo.ogImage);
    }

    // Twitter Tags
    updateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateMetaTag('name', 'twitter:title', title);
    updateMetaTag('name', 'twitter:description', description);
    if (seo.ogImage) {
      updateMetaTag('name', 'twitter:image', seo.ogImage);
    }
    
    // Update Favicon
    if (config.faviconUrl) {
      let favicon = document.querySelector('link[rel="icon"]');
      if (!favicon) {
        favicon = document.createElement('link');
        favicon.setAttribute('rel', 'icon');
        document.head.appendChild(favicon);
      }
      favicon.setAttribute('href', config.faviconUrl);
    }

    // Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', window.location.origin + location.pathname);

    // JSON-LD Structured Data
    const personData = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Ehtisham Arshad",
      "url": "https://ehtishamarshad.online",
      "jobTitle": "Professional Thumbnail Designer",
      "description": seo.description,
      "image": config.profileImage,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Lahore",
        "addressRegion": "Punjab",
        "addressCountry": "Pakistan"
      },
      "sameAs": [
        config.socialLinks.behance,
        config.socialLinks.instagram,
        config.socialLinks.twitter,
        config.socialLinks.linkedin,
        config.socialLinks.fiverr
      ].filter(Boolean)
    };

    const serviceData = {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": "Thumbnail Design",
      "provider": {
        "@type": "Person",
        "name": "Ehtisham Arshad"
      },
      "description": "High-impact, viral YouTube thumbnail design services to boost CTR and views.",
      "areaServed": "Worldwide",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Design Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "YouTube Thumbnail Design"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Social Media Kit"
            }
          }
        ]
      }
    };

    const schemas = [personData, serviceData];

    // Add Image Gallery Schema if on projects page
    if (pageKey === 'projects' && projects && projects.length > 0) {
      const gallerySchema = {
        "@context": "https://schema.org",
        "@type": "ImageGallery",
        "name": "Ehtisham Arshad Thumbnail Portfolio",
        "description": "A collection of high-converting YouTube thumbnails designed by Ehtisham Arshad.",
        "image": projects.map(p => ({
          "@type": "ImageObject",
          "contentUrl": p.imageUrl,
          "name": p.title,
          "description": p.description,
          "author": "Ehtisham Arshad",
          "creator": {
            "@type": "Person",
            "name": "Ehtisham Arshad"
          }
        }))
      };
      schemas.push(gallerySchema);
    }

    let script = document.querySelector('script[id="json-ld"]');
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.setAttribute('id', 'json-ld');
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schemas);

  }, [config, page, location, projects]);

  return null;
};

export default SEO;
