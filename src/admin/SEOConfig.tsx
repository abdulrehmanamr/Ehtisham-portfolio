import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Globe, Save, Info, Layout, Search, Image as ImageIcon } from 'lucide-react';
import { motion } from 'motion/react';

const SEOConfig = () => {
  const { config, setConfig } = useSite();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [seo, setSeo] = useState(config?.seo || {
    title: '',
    description: '',
    keywords: '',
    pages: {
      home: { title: '', description: '' },
      about: { title: '', description: '' },
      projects: { title: '', description: '' },
      services: { title: '', description: '' },
      contact: { title: '', description: '' }
    }
  });

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const configRef = doc(db, 'config', 'site');
      await updateDoc(configRef, { 
        seo,
        faviconUrl: config?.faviconUrl || ''
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving SEO config:', err);
      setError('Failed to save SEO settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateGlobal = (field: string, value: string) => {
    setSeo(prev => ({ ...prev, [field]: value }));
  };

  const updatePage = (pageKey: string, field: string, value: string) => {
    setSeo(prev => ({
      ...prev,
      pages: {
        ...prev.pages,
        [pageKey]: {
          ...prev.pages[pageKey],
          [field]: value
        }
      }
    }));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Globe className="text-violet-500" />
            SEO Settings
          </h1>
          <p className="text-zinc-400 mt-1">Manage how your website appears on search engines like Google.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-6 py-3 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-700 transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-violet-600/20"
        >
          {loading ? 'Saving...' : success ? 'Saved!' : 'Save Changes'}
          <Save size={18} />
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Global SEO */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900 border border-white/5 rounded-3xl p-8">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Search size={20} className="text-violet-500" />
              Global SEO Defaults
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Default Site Title</label>
                <input
                  type="text"
                  value={seo.title}
                  onChange={(e) => updateGlobal('title', e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none transition-all"
                  placeholder="e.g. Ehtisham Arshad | Professional Thumbnail Designer"
                />
                <p className="text-[10px] text-zinc-500 mt-2 uppercase tracking-widest">Recommended: 50-60 characters</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Default Meta Description</label>
                <textarea
                  value={seo.description}
                  onChange={(e) => updateGlobal('description', e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none transition-all h-32 resize-none"
                  placeholder="Describe your site for search engines..."
                />
                <p className="text-[10px] text-zinc-500 mt-2 uppercase tracking-widest">Recommended: 150-160 characters</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Keywords (Comma separated)</label>
                <input
                  type="text"
                  value={seo.keywords}
                  onChange={(e) => updateGlobal('keywords', e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none transition-all"
                  placeholder="e.g. design, thumbnails, youtube, viral"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Social Share Image (OG Image) URL</label>
                <input
                  type="text"
                  value={seo.ogImage || ''}
                  onChange={(e) => updateGlobal('ogImage', e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none transition-all"
                  placeholder="https://..."
                />
                <p className="text-[10px] text-zinc-500 mt-2 uppercase tracking-widest">Recommended: 1200x630 pixels</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Favicon URL</label>
                <div className="flex gap-4 items-start">
                  <input
                    type="text"
                    value={config?.faviconUrl || ''}
                    onChange={(e) => setConfig(prev => prev ? { ...prev, faviconUrl: e.target.value } : null)}
                    className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none transition-all"
                    placeholder="https://..."
                  />
                  {config?.faviconUrl && (
                    <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center border border-white/10 shrink-0">
                      <img src={config.faviconUrl} alt="Favicon" className="w-8 h-8 object-contain" referrerPolicy="no-referrer" />
                    </div>
                  )}
                </div>
                <p className="text-[10px] text-zinc-500 mt-2 uppercase tracking-widest">Recommended: 32x32 or 64x64 PNG/ICO</p>
              </div>
            </div>
          </div>

          {/* Page Specific SEO */}
          <div className="bg-zinc-900 border border-white/5 rounded-3xl p-8">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Layout size={20} className="text-violet-500" />
              Page Specific Settings
            </h2>
            <div className="space-y-8">
              {Object.entries(seo.pages).map(([key, page]) => (
                <div key={key} className="p-6 bg-black/40 border border-white/5 rounded-2xl space-y-4">
                  <h3 className="text-sm font-bold text-violet-400 uppercase tracking-widest">{key} Page</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-zinc-500 mb-2 uppercase tracking-widest">Page Title</label>
                      <input
                        type="text"
                        value={page.title}
                        onChange={(e) => updatePage(key, 'title', e.target.value)}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white focus:border-violet-500 outline-none transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-500 mb-2 uppercase tracking-widest">Meta Description</label>
                      <input
                        type="text"
                        value={page.description}
                        onChange={(e) => updatePage(key, 'description', e.target.value)}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-white focus:border-violet-500 outline-none transition-all text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Preview & Tips */}
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-white/5 rounded-3xl p-8 sticky top-8">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Info size={20} className="text-violet-500" />
              Google Preview
            </h2>
            <div className="bg-white p-6 rounded-2xl space-y-2">
              <p className="text-[#1a0dab] text-xl font-medium hover:underline cursor-pointer truncate">
                {seo.pages.home.title || seo.title || 'Site Title'}
              </p>
              <p className="text-[#006621] text-sm truncate">
                {window.location.origin}
              </p>
              <p className="text-[#545454] text-sm line-clamp-2">
                {seo.pages.home.description || seo.description || 'Site description will appear here...'}
              </p>
            </div>

            <div className="mt-8 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-widest">SEO Tips</h3>
              <ul className="space-y-3">
                {[
                  'Use unique titles for every page.',
                  'Keep descriptions under 160 characters.',
                  'Include your main keywords naturally.',
                  'Make titles catchy to improve CTR.',
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-zinc-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-1.5 shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SEOConfig;
