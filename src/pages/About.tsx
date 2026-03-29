import React from 'react';
import { motion } from 'motion/react';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import { useSite } from '../context/SiteContext';
import { Calendar, MapPin, Briefcase, GraduationCap, Award } from 'lucide-react';

const About = () => {
  const { config } = useSite();

  return (
    <Layout>
      <SEO 
        title={config?.seo?.about?.title || 'About Me'} 
        description={config?.seo?.about?.description || config?.seo?.description}
        keywords={config?.seo?.about?.keywords || config?.seo?.keywords}
      />
      <section 
        className="pt-32 pb-20 px-6"
        style={{ backgroundColor: config?.theme?.sectionColors?.about || undefined }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-[48px] overflow-hidden border border-white/10 shadow-2xl bg-zinc-900">
                <img
                  src={config?.aboutImage || config?.profileImage || 'https://picsum.photos/seed/ehtisham/800/1000'}
                  alt={`About Ehtisham Arshad - Professional Thumbnail Designer`}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 about-image-scale"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-violet-600 rounded-[32px] p-8 hidden md:flex flex-col justify-center shadow-2xl">
                <p className="text-4xl font-bold text-white mb-1">{config?.experience || '2+'}</p>
                <p className="text-violet-200 text-sm font-semibold leading-tight">Years of Experience</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 
                className="hero-title font-bold tracking-tighter mb-8"
              >
                {config?.pageContent?.about?.title || 'Passionate about Visual Storytelling.'}
              </h1>
              <div className="space-y-6 text-zinc-400 text-lg leading-relaxed mb-12">
                <p>
                  {config?.pageContent?.about?.subtitle || 'I believe that every thumbnail is a gateway to a story. My mission is to make that gateway as inviting and compelling as possible.'}
                </p>
                <p>{config?.bio}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <div className="flex items-center gap-4 p-4 bg-zinc-900/50 border border-white/5 rounded-2xl">
                  <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-500">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Location</p>
                    <p className="text-white font-semibold">{config?.location || 'Lahore, Pakistan'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-zinc-900/50 border border-white/5 rounded-2xl">
                  <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-500">
                    <Briefcase size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Job Type</p>
                    <p className="text-white font-semibold">Freelance / Remote</p>
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-bold mb-8">My Journey</h3>
              <div className="space-y-8">
                {(config?.timeline || []).map((item, i) => (
                  <div key={i} className="flex gap-6 relative">
                    {i !== (config?.timeline || []).length - 1 && (
                      <div className="absolute left-[19px] top-10 bottom-0 w-px bg-zinc-800" />
                    )}
                    <div className="w-10 h-10 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-violet-500 shrink-0 relative z-10">
                      <div className="w-2 h-2 rounded-full bg-current" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-violet-500 uppercase tracking-widest mb-1">{item.year}</p>
                      <h4 className="text-lg font-bold text-white mb-1">{item.title}</h4>
                      <p className="text-sm text-zinc-500 font-semibold mb-2">{item.company}</p>
                      <p className="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
