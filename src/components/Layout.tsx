import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { motion } from 'motion/react';
import { useSite } from '../context/SiteContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { config } = useSite();
  const sizes = config?.theme?.sizes;

  return (
    <div 
      className="min-h-screen bg-black text-white selection:bg-violet-500/30 selection:text-violet-200"
      style={{
        // @ts-ignore
        '--base-font-size': sizes?.baseFontSize || '16px',
        '--mobile-base-font-size': sizes?.mobileBaseFontSize || '14px',
        '--hero-title-size': sizes?.heroTitleSize || '72px',
        '--mobile-hero-title-size': sizes?.mobileHeroTitleSize || '36px',
        '--section-title-size': sizes?.sectionTitleSize || '48px',
        '--mobile-section-title-size': sizes?.mobileSectionTitleSize || '28px',
        '--image-scale': sizes?.imageScale || 1,
        '--mobile-image-scale': sizes?.mobileImageScale || 0.8,
        '--about-image-scale': sizes?.aboutImageScale || 0.5,
      }}
    >
      <Navbar />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.main>
      <Footer />
    </div>
  );
};

export default Layout;
