import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Star, Play, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useSite } from '../context/SiteContext';
import { cn } from '../utils/cn';
import { collection, query, where, limit, getDocs, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { Project, Testimonial, Service } from '../types';
import { Zap, Palette, Image as ImageIcon, Share2, Rocket, Briefcase, MapPin, Mail, MessageSquare, Send } from 'lucide-react';

const Home = () => {
  const { config } = useSite();
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await addDoc(collection(db, 'messages'), {
        ...formData,
        createdAt: serverTimestamp(),
        read: false
      });
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectsQuery = query(
          collection(db, 'projects'),
          where('featured', '==', true),
          limit(6)
        );

        const servicesQuery = query(collection(db, 'services'), orderBy('order', 'asc'), limit(3));

        const [projectsSnap, testimonialsSnap, servicesSnap] = await Promise.all([
          getDocs(projectsQuery),
          getDocs(collection(db, 'testimonials')),
          getDocs(servicesQuery)
        ]);

        setFeaturedProjects(projectsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project)));
        setTestimonials(testimonialsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Testimonial)));
        setServices(servicesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service)));
      } catch (error) {
        console.error("Error fetching home data:", error);
      }
    };

    fetchData();
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
      {config?.homeBlocks?.filter(b => b.enabled).map((block) => {
        switch (block.type) {
          case 'hero':
            return (
              <section 
                key={block.id} 
                className="relative pt-32 pb-20 px-6 overflow-hidden"
                style={{ backgroundColor: config?.theme?.sectionColors?.hero || undefined }}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
                  <div className="absolute top-20 left-10 w-72 h-72 bg-violet-600/20 rounded-full blur-[120px]" />
                  <div className="absolute bottom-20 right-10 w-72 h-72 bg-emerald-600/10 rounded-full blur-[120px]" />
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                  <div className="flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1 text-center md:text-left">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold uppercase tracking-wider mb-6"
                      >
                        <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                        {config?.availability || 'Available for Freelance'}
                      </motion.div>

                        <motion.h1
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="hero-title font-bold tracking-tighter mb-6 leading-tight"
                        >
                          {config?.pageContent?.home?.heroTitle || 'Crafting Viral Visuals for Creators.'}
                        </motion.h1>

                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-zinc-400 text-lg md:text-xl max-w-xl mb-10 leading-relaxed"
                      >
                        {config?.pageContent?.home?.heroSubtitle || `Hi, I'm ${config?.name || 'Ehtisham Arshad'}. A professional thumbnail designer helping you boost CTR and engagement with high-impact designs.`}
                      </motion.p>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-wrap items-center justify-center md:justify-start gap-4"
                      >
                        <Link
                          to="/contact"
                          className="px-8 py-4 bg-violet-600 text-white font-bold rounded-2xl hover:bg-violet-700 transition-all shadow-xl shadow-violet-600/25 flex items-center gap-2 group"
                        >
                          Start a Project
                          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                          to="/projects"
                          className="px-8 py-4 bg-zinc-900 text-white font-bold rounded-2xl border border-white/5 hover:bg-zinc-800 transition-all"
                        >
                          View Portfolio
                        </Link>
                        {config?.socialLinks?.fiverr && (
                          <a
                            href={config.socialLinks.fiverr}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-8 py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/25 flex items-center gap-2"
                          >
                            Fiverr Profile
                          </a>
                        )}
                      </motion.div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring' }}
                      className="flex-1 relative"
                    >
                      <div className="relative w-full aspect-square max-w-md mx-auto">
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-violet-900 rounded-[40px] rotate-6 opacity-20 blur-2xl" />
                        <div className="relative z-10 w-full h-full rounded-[40px] overflow-hidden border border-white/10 shadow-2xl">
                          <img
                            src={config?.profileImage || 'https://picsum.photos/seed/ehtisham/800/800'}
                            alt="Ehtisham Arshad"
                            // @ts-ignore
                            fetchPriority="high"
                            className="w-full h-full object-cover transition-transform duration-500"
                            style={{ 
                              transform: `scale(${window.innerWidth < 768 ? config?.theme?.sizes?.mobileImageScale || 1 : config?.theme?.sizes?.imageScale || 1})` 
                            }}
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs text-zinc-400 uppercase font-bold tracking-widest mb-1">Experience</p>
                                <p className="text-white font-bold">{config?.experience || '2+ Years'}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-zinc-400 uppercase font-bold tracking-widest mb-1">Projects</p>
                                <p className="text-white font-bold">500+</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </section>
            );
          case 'about':
            return (
              <section 
                key={block.id} 
                className="py-20 px-6 bg-zinc-950"
                style={{ backgroundColor: config?.theme?.sectionColors?.about || undefined }}
              >
                <div className="max-w-7xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      className="relative"
                    >
                      <div className="aspect-[4/5] rounded-[40px] overflow-hidden border border-white/10 shadow-2xl bg-zinc-900">
                        <img
                          src={config?.aboutImage || config?.profileImage || 'https://picsum.photos/seed/ehtisham/800/1000'}
                          alt="About"
                          loading="lazy"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-violet-600 rounded-3xl p-4 flex flex-col justify-center shadow-2xl">
                        <p className="text-2xl font-bold text-white mb-1">{config?.experience || '2+'}</p>
                        <p className="text-violet-200 text-[10px] font-bold uppercase tracking-wider leading-tight">Years Exp.</p>
                      </div>
                    </motion.div>
                    <div>
                      <h2 className="section-title font-bold tracking-tighter mb-6">
                        {config?.pageContent?.about?.title || 'Passionate about Visual Storytelling.'}
                      </h2>
                      <p className="text-zinc-400 text-lg leading-relaxed mb-8">
                        {config?.pageContent?.about?.subtitle || 'I believe that every thumbnail is a gateway to a story. My mission is to make that gateway as inviting and compelling as possible.'}
                      </p>
                      <Link
                        to="/about"
                        className="px-8 py-4 bg-zinc-900 text-white font-bold rounded-2xl border border-white/5 hover:bg-zinc-800 transition-all inline-flex items-center gap-2"
                      >
                        Read My Story <ArrowRight size={18} />
                      </Link>
                    </div>
                  </div>
                </div>
              </section>
            );
          case 'contact':
            return (
              <section 
                key={block.id} 
                className="py-20 px-6 bg-zinc-950"
                style={{ backgroundColor: config?.theme?.sectionColors?.contact || undefined }}
              >
                <div className="max-w-7xl mx-auto">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div>
                      <h2 className="section-title font-bold tracking-tighter mb-8">
                        {config?.pageContent?.contact?.title || 'Get in Touch'}
                      </h2>
                      <p className="text-zinc-400 text-lg mb-12">
                        {config?.pageContent?.contact?.subtitle || "Have a project in mind? Let's discuss how we can bring your vision to life."}
                      </p>
                      <div className="space-y-6">
                        <div className="flex items-center gap-6">
                          <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-500 shrink-0">
                            <Mail size={20} />
                          </div>
                          <div>
                            <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-1">Email Me</p>
                            <p className="text-white font-semibold">{config?.contactInfo?.email || 'contact@ehtisham.com'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-500 shrink-0">
                            <MessageSquare size={20} />
                          </div>
                          <div>
                            <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-1">WhatsApp</p>
                            <p className="text-white font-semibold">{config?.contactInfo?.whatsapp || '+92 300 0000000'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-zinc-900 border border-white/5 rounded-[40px] p-8 shadow-2xl">
                      <form onSubmit={handleContactSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input
                            required
                            type="text"
                            placeholder="Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none"
                          />
                          <input
                            required
                            type="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none"
                          />
                        </div>
                        <input
                          required
                          type="text"
                          placeholder="Subject"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none"
                        />
                        <textarea
                          required
                          rows={4}
                          placeholder="Message"
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none resize-none"
                        />
                        <button
                          disabled={status === 'loading'}
                          type="submit"
                          className="w-full py-4 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {status === 'loading' ? 'Sending...' : 'Send Message'}
                          <Send size={18} />
                        </button>
                        {status === 'success' && <p className="text-emerald-500 text-center text-sm font-bold">Sent!</p>}
                      </form>
                    </div>
                  </div>
                </div>
              </section>
            );
          case 'skills':
            return (
              <section 
                key={block.id} 
                className="py-20 px-6 bg-zinc-950"
                style={{ backgroundColor: config?.theme?.sectionColors?.skills || undefined }}
              >
                <div className="max-w-7xl mx-auto">
                  <div className="text-center mb-16">
                    <h2 
                      className="font-bold tracking-tighter mb-4"
                      style={{ 
                        fontSize: window.innerWidth < 768 
                          ? config?.theme?.sizes?.mobileSectionTitleSize || '28px' 
                          : config?.theme?.sizes?.sectionTitleSize || '48px' 
                      }}
                    >
                      Mastering the Tools
                    </h2>
                    <p className="text-zinc-400">Using the best industry software to deliver premium quality.</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6">
                    {(config?.skills || []).slice(0, 3).map((skill, i) => (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="p-4 md:p-8 bg-zinc-900 border border-white/5 rounded-[24px] md:rounded-[32px] flex flex-col items-center text-center group hover:border-violet-500/30 transition-all"
                      >
                        <img src={skill.icon} alt={skill.name} loading="lazy" className="w-10 h-10 md:w-16 md:h-16 mb-4 md:mb-6 transition-all duration-500" />
                        <h3 className="text-sm md:text-xl font-bold mb-1 md:mb-2">{skill.name}</h3>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>
            );
          case 'projects':
            return (
              <section 
                key={block.id} 
                className="py-20 px-6"
                style={{ backgroundColor: config?.theme?.sectionColors?.projects || undefined }}
              >
                <div className="max-w-7xl mx-auto">
                  <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
                    <div>
                      <h2 
                        className="section-title font-bold tracking-tighter mb-4"
                      >
                        Featured Work
                      </h2>
                      <p className="text-zinc-400">A selection of my best thumbnail designs.</p>
                    </div>
                    <Link to="/projects" className="text-violet-400 font-bold flex items-center gap-2 hover:text-violet-300 transition-colors">
                      View All Projects <ArrowRight size={18} />
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                    {featuredProjects.length > 0 ? (
                      featuredProjects.map((project, i) => (
                        <motion.div
                          key={project.id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1 }}
                          className="group relative"
                        >
                          <div className="relative aspect-video rounded-[32px] overflow-hidden border border-white/10 mb-6 bg-zinc-900">
                            <img
                              src={project.imageUrl}
                              alt={project.title}
                              loading="lazy"
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                              <a href={project.link} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:bg-violet-600 hover:text-white transition-all">
                                <ExternalLink size={20} />
                              </a>
                            </div>
                          </div>
                          <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                          <div className="flex flex-wrap gap-2">
                            {project.tags?.map(tag => (
                              <span key={tag} className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-2 py-1 rounded-md bg-zinc-900 border border-white/5">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      [1, 2, 3, 4, 5, 6].map((_, i) => (
                        <div key={i} className="space-y-4">
                          <div className="aspect-video bg-zinc-900/50 rounded-[32px] animate-pulse border border-white/5" />
                          <div className="space-y-2">
                            <div className="h-6 bg-zinc-900/50 rounded-lg w-3/4 animate-pulse" />
                            <div className="flex gap-2">
                              <div className="h-4 bg-zinc-900/50 rounded-md w-16 animate-pulse" />
                              <div className="h-4 bg-zinc-900/50 rounded-md w-16 animate-pulse" />
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </section>
            );
          case 'testimonials':
            return (
              <section 
                key={block.id} 
                className="py-20 px-6 bg-zinc-950"
                style={{ backgroundColor: config?.theme?.sectionColors?.testimonials || undefined }}
              >
                <div className="max-w-7xl mx-auto">
                  <div className="text-center mb-16">
                    <h2 
                      className="section-title font-bold tracking-tighter mb-4"
                    >
                      Client Love
                    </h2>
                    <p className="text-zinc-400">What creators say about my work.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {(config?.testimonials || []).length > 0 ? (
                      (config?.testimonials || []).map((t, i) => (
                        <motion.div
                          key={t.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1 }}
                          className="p-8 bg-zinc-900 border border-white/5 rounded-[32px] relative"
                        >
                          <div className="flex gap-1 mb-6">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star} 
                                className={cn(
                                  "transition-colors",
                                  (t.rating || 5) >= star ? "text-violet-500 fill-violet-500" : "text-zinc-700"
                                )} 
                                size={20} 
                              />
                            ))}
                          </div>
                          <p className="text-zinc-300 italic mb-8 leading-relaxed">"{t.content}"</p>
                          <div className="flex items-center gap-4">
                            <img src={t.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${t.name}`} alt={t.name} loading="lazy" className="w-12 h-12 rounded-full border border-white/10" />
                            <div>
                              <h4 className="font-bold text-white">{t.name}</h4>
                              <p className="text-xs text-zinc-500">{t.role}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="col-span-3 text-center py-10 text-zinc-500">
                        No testimonials yet.
                      </div>
                    )}
                  </div>
                </div>
              </section>
            );
          case 'services':
            return (
              <section 
                key={block.id} 
                className="py-20 px-6"
                style={{ backgroundColor: config?.theme?.sectionColors?.services || undefined }}
              >
                <div className="max-w-7xl mx-auto">
                  <div className="text-center mb-16">
                    <h2 className="section-title font-bold tracking-tighter mb-4">
                      {config?.pageContent?.services?.title || 'My Services'}
                    </h2>
                    <p className="text-zinc-400">
                      {config?.pageContent?.services?.subtitle || 'Premium design solutions for your brand.'}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {services.map((service, i) => (
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
                        <Link
                          to="/contact"
                          className="w-full py-4 bg-zinc-800 text-white font-bold rounded-2xl hover:bg-violet-600 transition-all flex items-center justify-center gap-2"
                        >
                          Order Now <Zap size={18} />
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>
            );
          case 'cta':
            return (
              <section 
                key={block.id} 
                className="py-20 px-6"
                style={{ backgroundColor: config?.theme?.sectionColors?.cta || undefined }}
              >
                <div className="max-w-5xl mx-auto">
                  <div className="relative p-12 md:p-20 bg-gradient-to-br from-violet-600 to-violet-900 rounded-[48px] overflow-hidden text-center">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                    <div className="relative z-10">
                      <h2 className="section-title font-bold tracking-tighter text-white mb-8">
                        {config?.pageContent?.home?.ctaTitle || 'Ready to explode your views?'}
                      </h2>
                      <p className="text-violet-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto opacity-80">
                        {config?.pageContent?.home?.ctaSubtitle || "Let's collaborate and create thumbnails that your audience can't help but click."}
                      </p>
                      <div className="flex flex-wrap justify-center gap-4">
                        <Link
                          to="/contact"
                          className="px-10 py-5 bg-white text-violet-900 font-bold rounded-2xl hover:bg-zinc-100 transition-all shadow-2xl"
                        >
                          Work with Me
                        </Link>
                        <a
                          href={config?.socialLinks.behance}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-10 py-5 bg-violet-800/50 text-white font-bold rounded-2xl border border-white/10 hover:bg-violet-800 transition-all"
                        >
                          View Behance
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            );
          case 'text':
            return (
              <section 
                key={block.id} 
                className="py-20 px-6"
                style={{ backgroundColor: config?.theme?.sectionColors?.text || undefined }}
              >
                <div className="max-w-3xl mx-auto text-center">
                  <p className="text-zinc-400 text-lg leading-relaxed">
                    {block.data?.text || 'Add your custom text here...'}
                  </p>
                </div>
              </section>
            );
          default:
            return null;
        }
      })}
    </Layout>
  );
};

export default Home;
