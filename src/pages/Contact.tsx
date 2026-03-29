import React, { useState } from 'react';
import { motion } from 'motion/react';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import { useSite } from '../context/SiteContext';
import { Mail, Phone, MapPin, Send, MessageSquare, Instagram, Twitter, Linkedin } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const Contact = () => {
  const { config } = useSite();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
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

  return (
    <Layout>
      <SEO 
        title={config?.seo?.contact?.title || 'Contact Me'} 
        description={config?.seo?.contact?.description || config?.seo?.description}
        keywords={config?.seo?.contact?.keywords || config?.seo?.keywords}
      />
      <section 
        className="pt-32 pb-20 px-6"
        style={{ backgroundColor: config?.theme?.sectionColors?.contact || undefined }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="hero-title font-bold tracking-tighter mb-6"
            >
              {config?.pageContent?.contact?.title || 'Get in Touch'}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-zinc-400 max-w-2xl mx-auto"
            >
              {config?.pageContent?.contact?.subtitle || "Have a project in mind? Let's discuss how we can bring your vision to life."}
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-12"
            >
              <div>
                <h2 className="text-3xl font-bold mb-8">Contact Information</h2>
                <div className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-500 shrink-0">
                      <Mail size={24} />
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-1">Email Me</p>
                      <a href={`mailto:${config?.contactInfo?.email || 'contact@ehtisham.com'}`} className="text-white font-semibold text-lg hover:text-violet-400 transition-colors">
                        {config?.contactInfo?.email || 'contact@ehtisham.com'}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-500 shrink-0">
                      <MessageSquare size={24} />
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-1">WhatsApp</p>
                      <a href={`https://wa.me/${(config?.contactInfo?.whatsapp || '').replace(/\s+/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-white font-semibold text-lg hover:text-violet-400 transition-colors">
                        {config?.contactInfo?.whatsapp || '+92 300 0000000'}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-500 shrink-0">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-1">Location</p>
                      <p className="text-white font-semibold text-lg">{config?.contactInfo?.address || 'Lahore, Pakistan'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-6">Follow Me</h3>
                <div className="flex gap-4">
                  {[
                    { icon: <Instagram size={20} />, link: config?.socialLinks.instagram },
                    { icon: <Twitter size={20} />, link: config?.socialLinks.twitter },
                    { icon: <Linkedin size={20} />, link: config?.socialLinks.linkedin },
                  ].map((social, i) => (
                    <a
                      key={i}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-400 hover:bg-violet-600 hover:text-white transition-all"
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-zinc-900 border border-white/5 rounded-[40px] p-8 md:p-12 shadow-2xl"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Full Name</label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-violet-500 transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Email Address</label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-violet-500 transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Subject</label>
                  <input
                    required
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-violet-500 transition-colors"
                    placeholder="Project Inquiry"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-black border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-violet-500 transition-colors resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>

                <button
                  disabled={status === 'loading'}
                  type="submit"
                  className="w-full py-5 bg-violet-600 text-white font-bold rounded-2xl hover:bg-violet-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-violet-600/20 disabled:opacity-50"
                >
                  {status === 'loading' ? 'Sending...' : 'Send Message'}
                  <Send size={18} />
                </button>

                {status === 'success' && (
                  <p className="text-emerald-500 text-center font-bold">Message sent successfully!</p>
                )}
                {status === 'error' && (
                  <p className="text-rose-500 text-center font-bold">Something went wrong. Please try again.</p>
                )}
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
