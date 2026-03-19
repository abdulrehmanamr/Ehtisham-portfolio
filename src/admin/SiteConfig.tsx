import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { SiteConfig, HomeBlock } from '../types';
import { Save, Globe, User, MessageSquare, Palette, Share2, Image as ImageIcon, Zap, Plus, Trash2, Quote, History, Layout as LayoutIcon, GripVertical, Eye, EyeOff, Phone, Mail, MapPin, Star, XCircle, CheckCircle2, Crop } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { cn } from '../utils/cn';
import DeleteModal from '../components/DeleteModal';
import ImageCropper from '../components/ImageCropper';
import { motion, AnimatePresence } from 'motion/react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableBlockProps {
  block: any;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}

const SortableBlock = ({ block, onToggle, onRemove }: SortableBlockProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-4 p-4 bg-black border border-white/10 rounded-2xl group transition-all",
        isDragging && "opacity-50 border-violet-500 shadow-2xl shadow-violet-500/20",
        !block.enabled && "opacity-60"
      )}
    >
      <div {...attributes} {...listeners} className="cursor-grab text-zinc-600 hover:text-white transition-colors">
        <GripVertical size={20} />
      </div>
      
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold uppercase tracking-widest text-white">
            {block.type}
          </span>
          {!block.enabled && (
            <span className="text-[10px] bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded-full font-bold uppercase">
              Hidden
            </span>
          )}
        </div>
        <p className="text-xs text-zinc-500 mt-1">
          {block.type === 'hero' && 'Main introduction section'}
          {block.type === 'skills' && 'Tools and technologies section'}
          {block.type === 'projects' && 'Featured portfolio items'}
          {block.type === 'testimonials' && 'Client feedback section'}
          {block.type === 'cta' && 'Call to action section'}
          {block.type === 'text' && 'Custom text block'}
          {block.type === 'services' && 'List of services offered'}
          {block.type === 'about' && 'About me summary section'}
          {block.type === 'contact' && 'Contact form and info section'}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onToggle(block.id)}
          className={cn(
            "p-2 rounded-lg transition-colors",
            block.enabled ? "text-emerald-500 hover:bg-emerald-500/10" : "text-zinc-500 hover:bg-zinc-500/10"
          )}
          title={block.enabled ? "Hide Section" : "Show Section"}
        >
          {block.enabled ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>
        <button
          onClick={() => onRemove(block.id)}
          className="p-2 text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
          title="Remove Section"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

const AdminSiteConfig = () => {
  const { config: initialConfig } = useSite();
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [cropperConfig, setCropperConfig] = useState<{
    isOpen: boolean;
    image: string;
    aspect: number;
    onComplete: (cropped: string) => void;
  }>({
    isOpen: false,
    image: '',
    aspect: 1,
    onComplete: () => {}
  });
  
  // Delete Modal State
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    type: 'block' | 'skill' | 'timeline' | 'testimonial' | null;
    index?: number;
    id?: string;
  }>({
    isOpen: false,
    type: null
  });
  const activeTab = searchParams.get('tab') || 'general';
  
  const setActiveTab = (tab: string) => {
    setSearchParams({ tab });
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (initialConfig) {
      setConfig(initialConfig);
      setLoading(false);
    }
  }, [initialConfig]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;
    setSaveLoading(true);
    setMessage(null);
    try {
      await setDoc(doc(db, 'config', 'site'), {
        ...config,
        updatedAt: serverTimestamp(),
      });
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Error saving settings.' });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setConfig((prev) => {
        if (!prev || !prev.homeBlocks) return prev;
        const oldIndex = prev.homeBlocks.findIndex((b) => b.id === active.id);
        const newIndex = prev.homeBlocks.findIndex((b) => b.id === over.id);
        return {
          ...prev,
          homeBlocks: arrayMove(prev.homeBlocks, oldIndex, newIndex),
        };
      });
    }
  };

  const toggleBlock = (id: string) => {
    setConfig((prev) => {
      if (!prev || !prev.homeBlocks) return prev;
      return {
        ...prev,
        homeBlocks: prev.homeBlocks.map((b) =>
          b.id === id ? { ...b, enabled: !b.enabled } : b
        ),
      };
    });
  };

  const removeBlock = (id: string) => {
    setDeleteModal({ isOpen: true, type: 'block', id });
  };

  const addBlock = (type: any) => {
    setConfig((prev) => {
      if (!prev) return prev;
      const newBlock = {
        id: `${type}-${Date.now()}`,
        type,
        enabled: true,
      };
      return {
        ...prev,
        homeBlocks: [...(prev.homeBlocks || []), newBlock],
      };
    });
  };

  const tabs = [
    { id: 'general', name: 'General', icon: <Globe size={18} /> },
    { id: 'profile', name: 'Profile', icon: <User size={18} /> },
    { id: 'social', name: 'Social Links', icon: <Share2 size={18} /> },
    { id: 'contact_info', name: 'Contact Info', icon: <Phone size={18} /> },
    { id: 'home_builder', name: 'Home Builder', icon: <LayoutIcon size={18} /> },
    { id: 'page_content', name: 'Page Content', icon: <MessageSquare size={18} /> },
    { id: 'skills', name: 'Skills', icon: <Zap size={18} /> },
    { id: 'timeline', name: 'Timeline', icon: <History size={18} /> },
    { id: 'testimonials', name: 'Testimonials', icon: <Quote size={18} /> },
    { id: 'appearance', name: 'Appearance', icon: <Palette size={18} /> },
    { id: 'sizes', name: 'Sizes & Scale', icon: <LayoutIcon size={18} /> },
    { id: 'about_page', name: 'About Page', icon: <User size={18} /> },
  ];

  const addSkill = () => {
    if (!config) return;
    setConfig({
      ...config,
      skills: [...(config.skills || []), { name: '', icon: '' }]
    });
  };

  const removeSkill = (index: number) => {
    setDeleteModal({ isOpen: true, type: 'skill', index });
  };

  const addTimelineItem = () => {
    if (!config) return;
    setConfig({
      ...config,
      timeline: [...(config.timeline || []), { year: '', title: '', company: '', desc: '' }]
    });
  };

  const removeTimelineItem = (index: number) => {
    setDeleteModal({ isOpen: true, type: 'timeline', index });
  };

  const addTestimonial = () => {
    if (!config) return;
    setConfig({
      ...config,
      testimonials: [...(config.testimonials || []), { id: Date.now().toString(), name: '', role: '', content: '', avatarUrl: '' }]
    });
  };

  const removeTestimonial = (index: number) => {
    setDeleteModal({ isOpen: true, type: 'testimonial', index });
  };

  const confirmDelete = () => {
    if (!config) return;
    
    if (deleteModal.type === 'block' && deleteModal.id) {
      setConfig((prev) => {
        if (!prev || !prev.homeBlocks) return prev;
        return {
          ...prev,
          homeBlocks: prev.homeBlocks.filter((b) => b.id !== deleteModal.id),
        };
      });
    } else if (deleteModal.type === 'skill' && deleteModal.index !== undefined) {
      const newSkills = [...config.skills];
      newSkills.splice(deleteModal.index, 1);
      setConfig({ ...config, skills: newSkills });
    } else if (deleteModal.type === 'timeline' && deleteModal.index !== undefined) {
      const newTimeline = [...config.timeline];
      newTimeline.splice(deleteModal.index, 1);
      setConfig({ ...config, timeline: newTimeline });
    } else if (deleteModal.type === 'testimonial' && deleteModal.index !== undefined) {
      const newTestimonials = [...config.testimonials];
      newTestimonials.splice(deleteModal.index, 1);
      setConfig({ ...config, testimonials: newTestimonials });
    }

    setDeleteModal({ isOpen: false, type: null });
  };

  if (loading || !config) return <div className="animate-pulse h-96 bg-zinc-900 rounded-[40px]" />;

  return (
    <div className="space-y-8">
      {/* Message Toast */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={cn(
              "fixed top-24 right-8 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl",
              message.type === 'success' 
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" 
                : "bg-rose-500/10 border-rose-500/20 text-rose-500"
            )}
          >
            {message.type === 'success' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
            <span className="font-bold">{message.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between bg-zinc-900/50 p-8 rounded-[40px] border border-white/5 backdrop-blur-xl">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-white">Admin Dashboard</h1>
          <p className="text-zinc-400 text-sm mt-1">Manage your website's global content, layout, and settings.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saveLoading}
          className="px-8 py-4 bg-violet-600 text-white font-bold rounded-2xl hover:bg-violet-700 transition-all flex items-center gap-3 disabled:opacity-50 shadow-lg shadow-violet-600/20 active:scale-95"
        >
          <Save size={20} />
          {saveLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Tabs */}
        <div className="w-full md:w-64 space-y-2 bg-zinc-900/50 p-4 rounded-[32px] border border-white/5 h-fit sticky top-24">
          <div className="px-6 py-4 mb-2">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Menu</p>
          </div>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold text-sm',
                activeTab === tab.id
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20'
                  : 'text-zinc-400 hover:bg-white/5 hover:text-white'
              )}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 bg-zinc-900 border border-white/5 rounded-[40px] p-8 md:p-12 shadow-2xl">
          <form onSubmit={handleSave} className="space-y-8">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Full Name</label>
                    <input
                      type="text"
                      value={config.name}
                      onChange={(e) => setConfig({ ...config, name: e.target.value })}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Professional Title</label>
                    <input
                      type="text"
                      value={config.title}
                      onChange={(e) => setConfig({ ...config, title: e.target.value })}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Logo URL (Optional)</label>
                    <input
                      type="text"
                      value={config.logoUrl || ''}
                      onChange={(e) => setConfig({ ...config, logoUrl: e.target.value })}
                      placeholder="https://example.com/logo.png"
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Location</label>
                    <input
                      type="text"
                      value={config.location}
                      onChange={(e) => setConfig({ ...config, location: e.target.value })}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Experience (e.g. 2+ Years)</label>
                    <input
                      type="text"
                      value={config.experience}
                      onChange={(e) => setConfig({ ...config, experience: e.target.value })}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Availability Status</label>
                    <input
                      type="text"
                      value={config.availability}
                      onChange={(e) => setConfig({ ...config, availability: e.target.value })}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Profile Image URL</label>
                  <div className="flex gap-6 items-start">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={config.profileImage}
                        onChange={(e) => setConfig({ ...config, profileImage: e.target.value })}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none pr-12"
                      />
                      {config.profileImage && (
                        <button
                          type="button"
                          onClick={() => setCropperConfig({
                            isOpen: true,
                            image: config.profileImage,
                            aspect: 1,
                            onComplete: (cropped) => {
                              setConfig({ ...config, profileImage: cropped });
                              setCropperConfig(prev => ({ ...prev, isOpen: false }));
                            }
                          })}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-zinc-400 hover:text-violet-500 transition-colors"
                          title="Crop Image"
                        >
                          <Crop size={18} />
                        </button>
                      )}
                    </div>
                    <div className="w-24 h-24 rounded-2xl bg-zinc-800 overflow-hidden border border-white/10 shrink-0">
                      <img src={config.profileImage} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Full Biography</label>
                  <textarea
                    rows={8}
                    value={config.bio}
                    onChange={(e) => setConfig({ ...config, bio: e.target.value })}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none resize-none"
                  />
                </div>
              </div>
            )}

            {activeTab === 'social' && (
              <div className="space-y-6">
                {Object.keys(config.socialLinks).map((key) => (
                  <div key={key} className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest capitalize">{key} URL</label>
                    <input
                      type="text"
                      value={(config.socialLinks as any)[key] || ''}
                      onChange={(e) => setConfig({
                        ...config,
                        socialLinks: { ...config.socialLinks, [key]: e.target.value }
                      })}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none"
                      placeholder={`https://${key}.com/...`}
                    />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'contact_info' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Email Address</label>
                  <input
                    type="email"
                    value={config.contactInfo?.email || ''}
                    onChange={(e) => setConfig({
                      ...config,
                      contactInfo: { ...config.contactInfo, email: e.target.value }
                    })}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Phone Number</label>
                  <input
                    type="text"
                    value={config.contactInfo?.phone || ''}
                    onChange={(e) => setConfig({
                      ...config,
                      contactInfo: { ...config.contactInfo, phone: e.target.value }
                    })}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">WhatsApp Number</label>
                  <input
                    type="text"
                    value={config.contactInfo?.whatsapp || ''}
                    onChange={(e) => setConfig({
                      ...config,
                      contactInfo: { ...config.contactInfo, whatsapp: e.target.value }
                    })}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Office Address</label>
                  <textarea
                    rows={3}
                    value={config.contactInfo?.address || ''}
                    onChange={(e) => setConfig({
                      ...config,
                      contactInfo: { ...config.contactInfo, address: e.target.value }
                    })}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none resize-none"
                  />
                </div>
              </div>
            )}

            {activeTab === 'home_builder' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white">Home Page Layout</h3>
                    <p className="text-xs text-zinc-500 mt-1">Drag and drop to reorder sections. Toggle visibility to hide sections.</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => addBlock('text')}
                      className="px-4 py-2 bg-zinc-900 text-white text-xs font-bold rounded-xl border border-white/5 hover:bg-zinc-800 transition-all flex items-center gap-2"
                    >
                      <Plus size={14} /> Add Text Block
                    </button>
                  </div>
                </div>

                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={(config.homeBlocks || []).map(b => b.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-3">
                      {(config.homeBlocks || []).map((block) => (
                        <SortableBlock
                          key={block.id}
                          block={block}
                          onToggle={toggleBlock}
                          onRemove={removeBlock}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>

                <div className="p-6 bg-violet-500/5 border border-violet-500/10 rounded-[32px]">
                  <h4 className="text-sm font-bold text-violet-400 mb-4 flex items-center gap-2">
                    <Zap size={16} /> Available Sections
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {['hero', 'skills', 'projects', 'testimonials', 'services', 'cta', 'about', 'contact'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => addBlock(type)}
                        className="p-4 bg-black border border-white/5 rounded-2xl text-left hover:border-violet-500/30 transition-all group"
                      >
                        <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">{type}</p>
                        <p className="text-[10px] text-zinc-600 mt-1">Click to add to layout</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'page_content' && (
              <div className="space-y-12">
                {/* Home Page */}
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-violet-400 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-violet-400" />
                    Home Page
                  </h3>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase">Hero Title</label>
                      <input
                        type="text"
                        value={config.pageContent?.home?.heroTitle || ''}
                        onChange={(e) => setConfig({
                          ...config,
                          pageContent: {
                            ...config.pageContent,
                            home: { ...config.pageContent.home, heroTitle: e.target.value }
                          }
                        })}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase">Hero Subtitle</label>
                      <textarea
                        rows={2}
                        value={config.pageContent?.home?.heroSubtitle || ''}
                        onChange={(e) => setConfig({
                          ...config,
                          pageContent: {
                            ...config.pageContent,
                            home: { ...config.pageContent.home, heroSubtitle: e.target.value }
                          }
                        })}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none resize-none"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase">CTA Title (Bottom)</label>
                        <input
                          type="text"
                          value={config.pageContent?.home?.ctaTitle || ''}
                          onChange={(e) => setConfig({
                            ...config,
                            pageContent: {
                              ...config.pageContent,
                              home: { ...config.pageContent.home, ctaTitle: e.target.value }
                            }
                          })}
                          className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase">CTA Subtitle (Bottom)</label>
                        <input
                          type="text"
                          value={config.pageContent?.home?.ctaSubtitle || ''}
                          onChange={(e) => setConfig({
                            ...config,
                            pageContent: {
                              ...config.pageContent,
                              home: { ...config.pageContent.home, ctaSubtitle: e.target.value }
                            }
                          })}
                          className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* About Page */}
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-violet-400 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-violet-400" />
                    About Page
                  </h3>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase">Page Title</label>
                      <input
                        type="text"
                        value={config.pageContent?.about?.title || ''}
                        onChange={(e) => setConfig({
                          ...config,
                          pageContent: {
                            ...config.pageContent,
                            about: { ...config.pageContent.about, title: e.target.value }
                          }
                        })}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase">Page Subtitle</label>
                      <textarea
                        rows={2}
                        value={config.pageContent?.about?.subtitle || ''}
                        onChange={(e) => setConfig({
                          ...config,
                          pageContent: {
                            ...config.pageContent,
                            about: { ...config.pageContent.about, subtitle: e.target.value }
                          }
                        })}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Services Page */}
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-violet-400 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-violet-400" />
                    Services Page
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase">Page Title</label>
                      <input
                        type="text"
                        value={config.pageContent?.services?.title || ''}
                        onChange={(e) => setConfig({
                          ...config,
                          pageContent: {
                            ...config.pageContent,
                            services: { ...config.pageContent.services, title: e.target.value }
                          }
                        })}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase">Page Subtitle</label>
                      <input
                        type="text"
                        value={config.pageContent?.services?.subtitle || ''}
                        onChange={(e) => setConfig({
                          ...config,
                          pageContent: {
                            ...config.pageContent,
                            services: { ...config.pageContent.services, subtitle: e.target.value }
                          }
                        })}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Page */}
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-violet-400 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-violet-400" />
                    Contact Page
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase">Page Title</label>
                      <input
                        type="text"
                        value={config.pageContent?.contact?.title || ''}
                        onChange={(e) => setConfig({
                          ...config,
                          pageContent: {
                            ...config.pageContent,
                            contact: { ...config.pageContent.contact, title: e.target.value }
                          }
                        })}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase">Page Subtitle</label>
                      <input
                        type="text"
                        value={config.pageContent?.contact?.subtitle || ''}
                        onChange={(e) => setConfig({
                          ...config,
                          pageContent: {
                            ...config.pageContent,
                            contact: { ...config.pageContent.contact, subtitle: e.target.value }
                          }
                        })}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">Mastering Tools (Skills)</h3>
                  <button
                    type="button"
                    onClick={addSkill}
                    className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-xl text-sm font-bold hover:bg-violet-700 transition-all"
                  >
                    <Plus size={16} />
                    Add Skill
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {(config.skills || []).map((skill, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-black border border-white/10 rounded-2xl group">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-zinc-500 uppercase">Skill Name</label>
                          <input
                            type="text"
                            value={skill.name}
                            onChange={(e) => {
                              const newSkills = [...config.skills];
                              newSkills[index].name = e.target.value;
                              setConfig({ ...config, skills: newSkills });
                            }}
                            className="w-full bg-zinc-900 border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:border-violet-500 outline-none"
                            placeholder="e.g. Photoshop"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-zinc-500 uppercase">Icon URL (SVG preferred)</label>
                          <input
                            type="text"
                            value={skill.icon}
                            onChange={(e) => {
                              const newSkills = [...config.skills];
                              newSkills[index].icon = e.target.value;
                              setConfig({ ...config, skills: newSkills });
                            }}
                            className="w-full bg-zinc-900 border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:border-violet-500 outline-none"
                            placeholder="https://..."
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        className="p-2 text-zinc-600 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'timeline' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">My Journey (Timeline)</h3>
                  <button
                    type="button"
                    onClick={addTimelineItem}
                    className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-xl text-sm font-bold hover:bg-violet-700 transition-all"
                  >
                    <Plus size={16} />
                    Add Event
                  </button>
                </div>
                <div className="space-y-6">
                  {(config.timeline || []).map((item, index) => (
                    <div key={index} className="p-6 bg-black border border-white/10 rounded-3xl space-y-4 relative group">
                      <button
                        type="button"
                        onClick={() => removeTimelineItem(index)}
                        className="absolute top-4 right-4 p-2 text-zinc-600 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-zinc-500 uppercase">Year / Period</label>
                          <input
                            type="text"
                            value={item.year}
                            onChange={(e) => {
                              const newTimeline = [...config.timeline];
                              newTimeline[index].year = e.target.value;
                              setConfig({ ...config, timeline: newTimeline });
                            }}
                            className="w-full bg-zinc-900 border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:border-violet-500 outline-none"
                            placeholder="e.g. 2024 - Present"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-zinc-500 uppercase">Job Title</label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => {
                              const newTimeline = [...config.timeline];
                              newTimeline[index].title = e.target.value;
                              setConfig({ ...config, timeline: newTimeline });
                            }}
                            className="w-full bg-zinc-900 border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:border-violet-500 outline-none"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase">Company / Platform</label>
                        <input
                          type="text"
                          value={item.company}
                          onChange={(e) => {
                            const newTimeline = [...config.timeline];
                            newTimeline[index].company = e.target.value;
                            setConfig({ ...config, timeline: newTimeline });
                          }}
                          className="w-full bg-zinc-900 border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:border-violet-500 outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase">Description</label>
                        <textarea
                          rows={2}
                          value={item.desc}
                          onChange={(e) => {
                            const newTimeline = [...config.timeline];
                            newTimeline[index].desc = e.target.value;
                            setConfig({ ...config, timeline: newTimeline });
                          }}
                          className="w-full bg-zinc-900 border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:border-violet-500 outline-none resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'testimonials' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">Client Love (Testimonials)</h3>
                  <button
                    type="button"
                    onClick={addTestimonial}
                    className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-xl text-sm font-bold hover:bg-violet-700 transition-all"
                  >
                    <Plus size={16} />
                    Add Testimonial
                  </button>
                </div>
                <div className="space-y-6">
                  {(config.testimonials || []).map((testimonial, index) => (
                    <div key={testimonial.id} className="p-6 bg-black border border-white/10 rounded-3xl space-y-4 relative group">
                      <button
                        type="button"
                        onClick={() => removeTestimonial(index)}
                        className="absolute top-4 right-4 p-2 text-zinc-600 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-zinc-500 uppercase">Client Name</label>
                          <input
                            type="text"
                            value={testimonial.name}
                            onChange={(e) => {
                              const newTestimonials = [...config.testimonials];
                              newTestimonials[index].name = e.target.value;
                              setConfig({ ...config, testimonials: newTestimonials });
                            }}
                            className="w-full bg-zinc-900 border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:border-violet-500 outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-zinc-500 uppercase">Role / Company</label>
                          <input
                            type="text"
                            value={testimonial.role}
                            onChange={(e) => {
                              const newTestimonials = [...config.testimonials];
                              newTestimonials[index].role = e.target.value;
                              setConfig({ ...config, testimonials: newTestimonials });
                            }}
                            className="w-full bg-zinc-900 border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:border-violet-500 outline-none"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-zinc-500 uppercase">Avatar URL</label>
                          <input
                            type="text"
                            value={testimonial.avatarUrl}
                            onChange={(e) => {
                              const newTestimonials = [...config.testimonials];
                              newTestimonials[index].avatarUrl = e.target.value;
                              setConfig({ ...config, testimonials: newTestimonials });
                            }}
                            className="w-full bg-zinc-900 border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:border-violet-500 outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-zinc-500 uppercase">Rating (1-5)</label>
                          <div className="flex items-center gap-2 mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => {
                                  const newTestimonials = [...config.testimonials];
                                  newTestimonials[index].rating = star;
                                  setConfig({ ...config, testimonials: newTestimonials });
                                }}
                                className="focus:outline-none"
                              >
                                <Star
                                  size={20}
                                  className={cn(
                                    "transition-colors",
                                    (testimonial.rating || 5) >= star
                                      ? "fill-yellow-500 text-yellow-500"
                                      : "text-zinc-600"
                                  )}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase">Testimonial Content</label>
                        <textarea
                          rows={3}
                          value={testimonial.content}
                          onChange={(e) => {
                            const newTestimonials = [...config.testimonials];
                            newTestimonials[index].content = e.target.value;
                            setConfig({ ...config, testimonials: newTestimonials });
                          }}
                          className="w-full bg-zinc-900 border border-white/5 rounded-lg px-3 py-2 text-sm text-white focus:border-violet-500 outline-none resize-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'about_page' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">About Page Image URL</label>
                  <div className="flex gap-6 items-start">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={config.aboutImage || ''}
                        onChange={(e) => setConfig({ ...config, aboutImage: e.target.value })}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none pr-12"
                        placeholder="https://example.com/about.jpg"
                      />
                      {config.aboutImage && (
                        <button
                          type="button"
                          onClick={() => setCropperConfig({
                            isOpen: true,
                            image: config.aboutImage!,
                            aspect: 3 / 4,
                            onComplete: (cropped) => {
                              setConfig({ ...config, aboutImage: cropped });
                              setCropperConfig(prev => ({ ...prev, isOpen: false }));
                            }
                          })}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-zinc-400 hover:text-violet-500 transition-colors"
                          title="Crop Image"
                        >
                          <Crop size={18} />
                        </button>
                      )}
                    </div>
                    <div className="w-24 h-32 rounded-2xl bg-zinc-800 overflow-hidden border border-white/10 shrink-0">
                      <img src={config.aboutImage} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">About Title</label>
                    <input
                      type="text"
                      value={config.pageContent?.about?.title || ''}
                      onChange={(e) => setConfig({
                        ...config,
                        pageContent: {
                          ...config.pageContent,
                          about: { ...config.pageContent.about, title: e.target.value }
                        }
                      })}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">About Subtitle</label>
                    <textarea
                      rows={3}
                      value={config.pageContent?.about?.subtitle || ''}
                      onChange={(e) => setConfig({
                        ...config,
                        pageContent: {
                          ...config.pageContent,
                          about: { ...config.pageContent.about, subtitle: e.target.value }
                        }
                      })}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sizes' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-white">Typography Sizes (Desktop)</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Base Font Size (e.g. 16px)</label>
                        <input
                          type="text"
                          value={config.theme.sizes?.baseFontSize || '16px'}
                          onChange={(e) => setConfig({
                            ...config,
                            theme: {
                              ...config.theme,
                              sizes: { ...config.theme.sizes, baseFontSize: e.target.value }
                            }
                          })}
                          className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Hero Title Size (e.g. 72px)</label>
                        <input
                          type="text"
                          value={config.theme.sizes?.heroTitleSize || '72px'}
                          onChange={(e) => setConfig({
                            ...config,
                            theme: {
                              ...config.theme,
                              sizes: { ...config.theme.sizes, heroTitleSize: e.target.value }
                            }
                          })}
                          className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Section Title Size (e.g. 48px)</label>
                        <input
                          type="text"
                          value={config.theme.sizes?.sectionTitleSize || '48px'}
                          onChange={(e) => setConfig({
                            ...config,
                            theme: {
                              ...config.theme,
                              sizes: { ...config.theme.sizes, sectionTitleSize: e.target.value }
                            }
                          })}
                          className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-white">Typography Sizes (Mobile)</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Base Font Size (e.g. 14px)</label>
                        <input
                          type="text"
                          value={config.theme.sizes?.mobileBaseFontSize || '14px'}
                          onChange={(e) => setConfig({
                            ...config,
                            theme: {
                              ...config.theme,
                              sizes: { ...config.theme.sizes, mobileBaseFontSize: e.target.value }
                            }
                          })}
                          className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Hero Title Size (e.g. 36px)</label>
                        <input
                          type="text"
                          value={config.theme.sizes?.mobileHeroTitleSize || '36px'}
                          onChange={(e) => setConfig({
                            ...config,
                            theme: {
                              ...config.theme,
                              sizes: { ...config.theme.sizes, mobileHeroTitleSize: e.target.value }
                            }
                          })}
                          className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Section Title Size (e.g. 28px)</label>
                        <input
                          type="text"
                          value={config.theme.sizes?.mobileSectionTitleSize || '28px'}
                          onChange={(e) => setConfig({
                            ...config,
                            theme: {
                              ...config.theme,
                              sizes: { ...config.theme.sizes, mobileSectionTitleSize: e.target.value }
                            }
                          })}
                          className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-white">Image Scaling</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Desktop Image Scale ({config.theme.sizes?.imageScale || 1}x)</label>
                        <input
                          type="range"
                          min="0.5"
                          max="2"
                          step="0.1"
                          value={config.theme.sizes?.imageScale || 1}
                          onChange={(e) => setConfig({
                            ...config,
                            theme: {
                              ...config.theme,
                              sizes: { ...config.theme.sizes, imageScale: parseFloat(e.target.value) }
                            }
                          })}
                          className="w-full accent-violet-600"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Mobile Image Scale ({config.theme.sizes?.mobileImageScale || 0.8}x)</label>
                        <input
                          type="range"
                          min="0.3"
                          max="1.5"
                          step="0.1"
                          value={config.theme.sizes?.mobileImageScale || 0.8}
                          onChange={(e) => setConfig({
                            ...config,
                            theme: {
                              ...config.theme,
                              sizes: { ...config.theme.sizes, mobileImageScale: parseFloat(e.target.value) }
                            }
                          })}
                          className="w-full accent-violet-600"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">About Page Image Scale ({config.theme.sizes?.aboutImageScale || 1}x)</label>
                        <input
                          type="range"
                          min="0.3"
                          max="1.5"
                          step="0.1"
                          value={config.theme.sizes?.aboutImageScale || 1}
                          onChange={(e) => setConfig({
                            ...config,
                            theme: {
                              ...config.theme,
                              sizes: { ...config.theme.sizes, aboutImageScale: parseFloat(e.target.value) }
                            }
                          })}
                          className="w-full accent-violet-600"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Primary Color</label>
                    <div className="flex gap-4">
                      <input
                        type="color"
                        value={config.theme.primaryColor}
                        onChange={(e) => setConfig({
                          ...config,
                          theme: { ...config.theme, primaryColor: e.target.value }
                        })}
                        className="w-12 h-12 rounded-lg bg-black border border-white/10 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={config.theme.primaryColor}
                        onChange={(e) => setConfig({
                          ...config,
                          theme: { ...config.theme, primaryColor: e.target.value }
                        })}
                        className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Accent Color</label>
                    <div className="flex gap-4">
                      <input
                        type="color"
                        value={config.theme.accentColor}
                        onChange={(e) => setConfig({
                          ...config,
                          theme: { ...config.theme, accentColor: e.target.value }
                        })}
                        className="w-12 h-12 rounded-lg bg-black border border-white/10 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={config.theme.accentColor}
                        onChange={(e) => setConfig({
                          ...config,
                          theme: { ...config.theme, accentColor: e.target.value }
                        })}
                        className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-6 bg-black border border-white/10 rounded-2xl">
                  <input
                    type="checkbox"
                    id="darkMode"
                    checked={config.theme.darkMode}
                    onChange={(e) => setConfig({
                      ...config,
                      theme: { ...config.theme, darkMode: e.target.checked }
                    })}
                    className="w-6 h-6 rounded bg-zinc-900 border-white/10 text-violet-600 focus:ring-violet-500"
                  />
                  <label htmlFor="darkMode" className="font-bold text-zinc-300">Enable Dark Mode by Default</label>
                </div>

                <div className="space-y-6 pt-6 border-t border-white/5">
                  <h3 className="text-lg font-bold text-white">Section Background Colors</h3>
                  <p className="text-xs text-zinc-500">Leave empty to use default theme colors.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.keys(config.theme.sectionColors || {}).map((section) => (
                      <div key={section} className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest capitalize">{section} Background</label>
                        <div className="flex gap-4">
                          <input
                            type="color"
                            value={(config.theme.sectionColors as any)[section] || '#000000'}
                            onChange={(e) => setConfig({
                              ...config,
                              theme: {
                                ...config.theme,
                                sectionColors: {
                                  ...config.theme.sectionColors,
                                  [section]: e.target.value
                                }
                              }
                            })}
                            className="w-10 h-10 rounded-lg bg-black border border-white/10 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={(config.theme.sectionColors as any)[section] || ''}
                            onChange={(e) => setConfig({
                              ...config,
                              theme: {
                                ...config.theme,
                                sectionColors: {
                                  ...config.theme.sectionColors,
                                  [section]: e.target.value
                                }
                              }
                            })}
                            placeholder="e.g. #121212"
                            className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-violet-500 outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'about_page' && (
              <div className="space-y-8">
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-white">About Page Content</h3>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">About Image URL</label>
                      <div className="flex gap-6 items-start">
                        <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            value={config.aboutImage || ''}
                            onChange={(e) => setConfig({ ...config, aboutImage: e.target.value })}
                            className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none"
                            placeholder="https://..."
                          />
                          <button
                            onClick={() => setCropperConfig({
                              isOpen: true,
                              image: config.aboutImage || config.profileImage || '',
                              aspect: 4/5,
                              onComplete: (url) => setConfig({ ...config, aboutImage: url })
                            })}
                            className="flex items-center gap-2 text-xs font-bold text-violet-400 hover:text-violet-300 transition-colors"
                          >
                            <Crop size={14} />
                            Crop Image
                          </button>
                        </div>
                        <div className="w-24 h-24 rounded-2xl bg-zinc-800 overflow-hidden border border-white/10 shrink-0">
                          <img src={config.aboutImage || config.profileImage} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Page Title</label>
                      <input
                        type="text"
                        value={config.pageContent?.about?.title || ''}
                        onChange={(e) => setConfig({
                          ...config,
                          pageContent: {
                            ...config.pageContent,
                            about: { ...config.pageContent.about, title: e.target.value }
                          }
                        })}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Page Subtitle</label>
                      <textarea
                        rows={3}
                        value={config.pageContent?.about?.subtitle || ''}
                        onChange={(e) => setConfig({
                          ...config,
                          pageContent: {
                            ...config.pageContent,
                            about: { ...config.pageContent.about, subtitle: e.target.value }
                          }
                        })}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>

      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, type: null })}
        onConfirm={confirmDelete}
        title={`Remove ${deleteModal.type}`}
        message={`Are you sure you want to remove this ${deleteModal.type}? This action will be saved when you click "Save Changes".`}
      />

      {cropperConfig.isOpen && (
        <ImageCropper
          image={cropperConfig.image}
          aspect={cropperConfig.aspect}
          onCropComplete={cropperConfig.onComplete}
          onCancel={() => setCropperConfig(prev => ({ ...prev, isOpen: false }))}
        />
      )}
    </div>
  );
};

export default AdminSiteConfig;
