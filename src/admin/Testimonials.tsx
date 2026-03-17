import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { Plus, Trash2, Star, User, Image as ImageIcon, Save } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { motion, AnimatePresence } from 'motion/react';

const AdminTestimonials = () => {
  const { config, setConfig } = useSite();
  const [saving, setSaving] = useState(false);

  const addTestimonial = () => {
    const newTestimonial = {
      id: Date.now().toString(),
      name: '',
      role: '',
      content: '',
      avatarUrl: ''
    };
    setConfig({
      ...config,
      testimonials: [...(config.testimonials || []), newTestimonial]
    });
  };

  const removeTestimonial = (index: number) => {
    const newTestimonials = [...config.testimonials];
    newTestimonials.splice(index, 1);
    setConfig({ ...config, testimonials: newTestimonials });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const siteRef = doc(db, 'config', 'site');
      await updateDoc(siteRef, { testimonials: config.testimonials });
      alert('Testimonials updated successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to update testimonials.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Testimonials</h1>
          <p className="text-zinc-400 text-sm">Add, edit, or remove client testimonials to build trust.</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={addTestimonial}
            className="flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-2xl font-bold hover:bg-zinc-800 border border-white/5 transition-all"
          >
            <Plus size={20} />
            Add New
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 bg-violet-600 text-white rounded-2xl font-bold hover:bg-violet-700 transition-all shadow-xl shadow-violet-600/20 disabled:opacity-50"
          >
            <Save size={20} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="popLayout">
          {(config.testimonials || []).map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-8 bg-zinc-900 border border-white/5 rounded-[32px] relative group"
            >
              <button
                onClick={() => removeTestimonial(index)}
                className="absolute top-6 right-6 p-2 text-zinc-600 hover:text-rose-500 transition-colors"
              >
                <Trash2 size={20} />
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Client Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                      <input
                        type="text"
                        value={testimonial.name}
                        onChange={(e) => {
                          const newTestimonials = [...config.testimonials];
                          newTestimonials[index].name = e.target.value;
                          setConfig({ ...config, testimonials: newTestimonials });
                        }}
                        className="w-full bg-black border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:border-violet-500 outline-none"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Role / Company</label>
                    <input
                      type="text"
                      value={testimonial.role}
                      onChange={(e) => {
                        const newTestimonials = [...config.testimonials];
                        newTestimonials[index].role = e.target.value;
                        setConfig({ ...config, testimonials: newTestimonials });
                      }}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none"
                      placeholder="CEO at TechCorp"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Avatar URL</label>
                    <div className="relative">
                      <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                      <input
                        type="text"
                        value={testimonial.avatarUrl}
                        onChange={(e) => {
                          const newTestimonials = [...config.testimonials];
                          newTestimonials[index].avatarUrl = e.target.value;
                          setConfig({ ...config, testimonials: newTestimonials });
                        }}
                        className="w-full bg-black border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:border-violet-500 outline-none"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Testimonial Content</label>
                    <textarea
                      rows={6}
                      value={testimonial.content}
                      onChange={(e) => {
                        const newTestimonials = [...config.testimonials];
                        newTestimonials[index].content = e.target.value;
                        setConfig({ ...config, testimonials: newTestimonials });
                      }}
                      className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-violet-500 outline-none resize-none leading-relaxed"
                      placeholder="Write the client's feedback here..."
                    />
                  </div>

                  <div className="flex items-center gap-2 text-amber-500">
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <span className="text-xs font-bold ml-2 text-zinc-500 uppercase tracking-wider">5-Star Rating</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {(!config.testimonials || config.testimonials.length === 0) && (
          <div className="text-center py-20 bg-zinc-900/50 border border-dashed border-white/10 rounded-[40px]">
            <Star className="mx-auto text-zinc-700 mb-4" size={48} />
            <p className="text-zinc-500 font-medium">No testimonials added yet. Click "Add New" to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTestimonials;
