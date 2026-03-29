import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import { useSite } from '../context/SiteContext';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase';
import { Project } from '../types';
import { ExternalLink, Filter, X } from 'lucide-react';

const Projects = () => {
  const { config } = useSite();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setProjects(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project)));
      setLoading(false);
    };
    fetchProjects();
  }, []);

  const categories = ['All', ...new Set(projects.map(p => p.category).filter(Boolean))];
  const filteredProjects = filter === 'All' ? projects : projects.filter(p => p.category === filter);

  return (
    <Layout>
      <SEO 
        page="projects"
        projects={projects}
        title={config?.seo?.projects?.title || 'My Portfolio'} 
        description={config?.seo?.projects?.description || config?.seo?.description}
        keywords={config?.seo?.projects?.keywords || config?.seo?.keywords}
      />
      <section 
        className="pt-32 pb-20 px-6"
        style={{ backgroundColor: config?.theme?.sectionColors?.projects || undefined }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="hero-title font-bold tracking-tighter mb-6"
            >
              My <span className="text-violet-500">Portfolio</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-zinc-400 max-w-2xl mx-auto"
            >
              Explore my collection of high-converting thumbnails and creative designs.
            </motion.p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                  filter === cat
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20'
                    : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            <AnimatePresence mode="popLayout">
              {loading ? (
                [1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-video bg-zinc-900 rounded-[32px] mb-4" />
                    <div className="h-6 bg-zinc-900 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-zinc-900 rounded w-1/2" />
                  </div>
                ))
              ) : (
                filteredProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="group cursor-pointer"
                    onClick={() => setSelectedProject(project)}
                  >
                    <div className="relative aspect-video rounded-[32px] overflow-hidden border border-white/10 mb-4">
                      <img
                        src={project.imageUrl}
                        alt={`${project.title} - Thumbnail Design by Ehtisham Arshad`}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="px-6 py-2 bg-white text-black font-bold rounded-full text-sm">View Details</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-violet-400 transition-colors">{project.title}</h3>
                    <p className="text-zinc-500 text-sm">{project.category}</p>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-zinc-900 rounded-[40px] overflow-hidden border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all z-10"
              >
                <X size={20} />
              </button>

              <div className="aspect-video w-full">
                <img
                  src={selectedProject.imageUrl}
                  alt={`${selectedProject.title} - Thumbnail Design by Ehtisham Arshad`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">{selectedProject.title}</h2>
                    <p className="text-violet-400 font-bold uppercase tracking-widest text-xs">{selectedProject.category}</p>
                  </div>
                  {selectedProject.link && (
                    <a
                      href={selectedProject.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-700 transition-all flex items-center gap-2"
                    >
                      View Live Project <ExternalLink size={18} />
                    </a>
                  )}
                </div>

                <p className="text-zinc-400 text-lg leading-relaxed mb-8">{selectedProject.description}</p>

                <div className="flex flex-wrap gap-3">
                  {selectedProject.tags?.map(tag => (
                    <span key={tag} className="px-4 py-2 bg-zinc-800 border border-white/5 rounded-lg text-sm text-zinc-300 font-medium">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default Projects;
