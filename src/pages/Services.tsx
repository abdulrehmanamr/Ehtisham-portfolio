import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
import { Service } from '../types';
import { CheckCircle2, Zap, Palette, Image as ImageIcon, Share2, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useSite } from '../context/SiteContext';

const Services = () => {
  const { config } = useSite();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      const q = query(collection(db, 'services'), orderBy('order', 'asc'));
      const snap = await getDocs(q);
      setServices(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service)));
      setLoading(false);
    };
    fetchServices();
  }, []);

  const getIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'palette': return <Palette size={32} />;
      case 'image': return <ImageIcon size={32} />;
      case 'share': return <Share2 size={32} />;
      case 'rocket': return <Rocket size={32} />;
      case 'zap': return <Zap size={32} />;
      default: return <Zap size={32} />;
    }
  };

  return (
    <Layout>
      <SEO 
        title={config?.seo?.services?.title || 'My Services'} 
        description={config?.seo?.services?.description || config?.seo?.description}
        keywords={config?.seo?.services?.keywords || config?.seo?.keywords}
      />
      <section 
        className="pt-32 pb-20 px-6"
        style={{ backgroundColor: config?.theme?.sectionColors?.services || undefined }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="hero-title font-bold tracking-tighter mb-6"
            >
              {config?.pageContent?.services?.title || 'My Services'}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-zinc-400 max-w-2xl mx-auto"
            >
              {config?.pageContent?.services?.subtitle || 'Tailored design solutions to help you stand out and grow your brand.'}
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {loading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="p-10 bg-zinc-900 border border-white/5 rounded-[40px] animate-pulse h-[400px]" />
              ))
            ) : services.length > 0 ? (
              services.map((service, i) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-10 bg-zinc-900 border border-white/5 rounded-[40px] hover:border-violet-500/30 transition-all group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-500 mb-8 group-hover:scale-110 transition-transform">
                    {getIcon(service.icon)}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                  <p className="text-zinc-400 mb-8 leading-relaxed">{service.description}</p>
                  <div className="flex items-end gap-2 mb-8">
                    <span className="text-3xl font-bold text-white">{service.price}</span>
                    <span className="text-zinc-500 text-sm mb-1">/ project</span>
                  </div>
                  <Link
                    to="/contact"
                    className="w-full py-4 bg-zinc-800 text-white font-bold rounded-2xl hover:bg-violet-600 transition-all flex items-center justify-center gap-2"
                  >
                    Order Now <Zap size={18} />
                  </Link>
                </motion.div>
              ))
            ) : (
              // Default services if none in DB
              [
                { title: 'YouTube Thumbnail', price: '$25', desc: 'High CTR thumbnails designed to grab attention and drive clicks.', icon: 'zap' },
                { title: 'Social Media Kit', price: '$80', desc: 'Complete set of graphics for your Instagram, Twitter, and Facebook.', icon: 'share' },
                { title: 'Custom Branding', price: '$150', desc: 'Unique visual identity including logos, banners, and color palettes.', icon: 'palette' },
              ].map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-10 bg-zinc-900 border border-white/5 rounded-[40px]"
                >
                  <div className="w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-500 mb-8">
                    {getIcon(s.icon)}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{s.title}</h3>
                  <p className="text-zinc-400 mb-8">{s.desc}</p>
                  <div className="flex items-end gap-2 mb-8">
                    <span className="text-3xl font-bold text-white">{s.price}</span>
                  </div>
                  <Link to="/contact" className="w-full py-4 bg-zinc-800 text-white font-bold rounded-2xl hover:bg-violet-600 transition-all text-center">
                    Order Now
                  </Link>
                </motion.div>
              ))
            )}
          </div>

          {/* Pricing Table / Comparison */}
          <div className="bg-zinc-900 border border-white/5 rounded-[48px] p-8 md:p-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose Me?</h2>
              <p className="text-zinc-400">Premium quality with a focus on results.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                'Unlimited Revisions',
                'Fast 24-Hour Delivery',
                'High-Resolution Source Files',
                'Custom Hand-Drawn Elements',
                'Audience Psychology Research',
                'Competitor Analysis',
                'Brand Consistency',
                '100% Satisfaction Guarantee',
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
                    <CheckCircle2 size={14} />
                  </div>
                  <span className="text-zinc-300 font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
