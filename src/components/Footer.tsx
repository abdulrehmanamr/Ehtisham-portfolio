import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';
import { useSite } from '../context/SiteContext';

const Footer = () => {
  const { config } = useSite();

  return (
    <footer className="bg-zinc-950 border-t border-white/5 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1 md:col-span-2">
          <Link to="/" className="text-2xl font-bold tracking-tighter text-white mb-6 block">
            {config?.name || 'Ehtisham'}
          </Link>
          <p className="text-zinc-400 max-w-sm mb-8">
            Professional thumbnail designer dedicated to creating high-impact visuals that drive engagement and growth for content creators.
          </p>
          <div className="flex gap-4">
            {config?.socialLinks.instagram && (
              <a href={config.socialLinks.instagram} className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:bg-violet-600 hover:text-white transition-all">
                <Instagram size={18} />
              </a>
            )}
            {config?.socialLinks.twitter && (
              <a href={config.socialLinks.twitter} className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:bg-violet-600 hover:text-white transition-all">
                <Twitter size={18} />
              </a>
            )}
            {config?.socialLinks.linkedin && (
              <a href={config.socialLinks.linkedin} className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:bg-violet-600 hover:text-white transition-all">
                <Linkedin size={18} />
              </a>
            )}
            {config?.socialLinks.fiverr && (
              <a href={config.socialLinks.fiverr} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:bg-emerald-600 hover:text-white transition-all font-bold text-[10px]">
                FI
              </a>
            )}
            <a href={`mailto:${config?.contactInfo?.email || 'contact@example.com'}`} className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:bg-violet-600 hover:text-white transition-all">
              <Mail size={18} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-6">Quick Links</h4>
          <ul className="space-y-4">
            <li><Link to="/" className="text-zinc-400 hover:text-violet-400 transition-colors">Home</Link></li>
            <li><Link to="/about" className="text-zinc-400 hover:text-violet-400 transition-colors">About</Link></li>
            <li><Link to="/projects" className="text-zinc-400 hover:text-violet-400 transition-colors">Projects</Link></li>
            <li><Link to="/services" className="text-zinc-400 hover:text-violet-400 transition-colors">Services</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-6">Newsletter</h4>
          <p className="text-zinc-400 text-sm mb-4">Subscribe to get the latest design tips and updates.</p>
          <form className="flex gap-2">
            <input
              type="email"
              placeholder="Email address"
              className="bg-zinc-900 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-violet-500 w-full"
            />
            <button className="bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-violet-700 transition-colors">
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-zinc-500 text-sm text-center md:text-left">
          © {new Date().getFullYear()} {config?.name || 'Ehtisham'}. All rights reserved.
        </p>
        <div className="flex gap-6 text-sm text-zinc-500">
          <Link to="/admin" className="hover:text-violet-400 transition-colors">Admin</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
