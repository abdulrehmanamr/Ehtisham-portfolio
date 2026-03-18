import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { Project } from '../types';
import { Plus, Edit2, Trash2, X, Save, Image as ImageIcon } from 'lucide-react';
import DeleteModal from '../components/DeleteModal';

const AdminProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [currentProject, setCurrentProject] = useState<Partial<Project> | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    setProjects(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project)));
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const projectData = {
        ...currentProject,
        tags: typeof currentProject?.tags === 'string' ? (currentProject.tags as string).split(',').map(t => t.trim()) : currentProject?.tags || [],
        updatedAt: serverTimestamp(),
      } as any;

      if (currentProject?.id) {
        await updateDoc(doc(db, 'projects', currentProject.id), projectData);
      } else {
        await addDoc(collection(db, 'projects'), {
          ...projectData,
          createdAt: serverTimestamp(),
        });
      }
      setIsModalOpen(false);
      fetchProjects();
    } catch (error) {
      console.error(error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!projectToDelete) return;
    setDeleteLoading(true);
    try {
      await deleteDoc(doc(db, 'projects', projectToDelete));
      setIsDeleteModalOpen(false);
      setProjectToDelete(null);
      fetchProjects();
    } catch (error) {
      console.error(error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const confirmDelete = (id: string) => {
    setProjectToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const openModal = (project: Project | null = null) => {
    setCurrentProject(project || { title: '', description: '', imageUrl: '', category: '', tags: [], featured: false });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-zinc-400 text-sm">Manage your portfolio items.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="px-6 py-3 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-700 transition-all flex items-center gap-2"
        >
          <Plus size={20} />
          Add Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-zinc-900 border border-white/5 rounded-3xl overflow-hidden group">
            <div className="aspect-video relative">
              <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button onClick={() => openModal(project)} className="p-3 bg-white text-black rounded-full hover:bg-violet-600 hover:text-white transition-all">
                  <Edit2 size={18} />
                </button>
                <button onClick={() => confirmDelete(project.id)} className="p-3 bg-rose-600 text-white rounded-full hover:bg-rose-700 transition-all">
                  <Trash2 size={18} />
                </button>
              </div>
              {project.featured && (
                <div className="absolute top-4 left-4 px-3 py-1 bg-violet-600 text-white text-[10px] font-bold rounded-full uppercase tracking-widest">
                  Featured
                </div>
              )}
            </div>
            <div className="p-6">
              <h3 className="font-bold text-lg mb-1">{project.title}</h3>
              <p className="text-zinc-500 text-sm mb-4">{project.category}</p>
              <div className="flex flex-wrap gap-2">
                {project.tags?.map(tag => (
                  <span key={tag} className="text-[10px] text-zinc-400 bg-zinc-800 px-2 py-1 rounded">#{tag}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-[40px] overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-2xl font-bold">{currentProject?.id ? 'Edit Project' : 'Add New Project'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white"><X size={24} /></button>
            </div>
            <form onSubmit={handleSave} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Title</label>
                  <input
                    required
                    type="text"
                    value={currentProject?.title || ''}
                    onChange={(e) => setCurrentProject({ ...currentProject, title: e.target.value })}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Category</label>
                  <input
                    required
                    type="text"
                    value={currentProject?.category || ''}
                    onChange={(e) => setCurrentProject({ ...currentProject, category: e.target.value })}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none"
                    placeholder="e.g. YouTube Thumbnail"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Image URL</label>
                <div className="flex gap-4">
                  <input
                    required
                    type="text"
                    value={currentProject?.imageUrl || ''}
                    onChange={(e) => setCurrentProject({ ...currentProject, imageUrl: e.target.value })}
                    className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none"
                    placeholder="https://..."
                  />
                  <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center overflow-hidden border border-white/10">
                    {currentProject?.imageUrl ? <img src={currentProject.imageUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" /> : <ImageIcon className="text-zinc-600" />}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Description</label>
                <textarea
                  required
                  rows={4}
                  value={currentProject?.description || ''}
                  onChange={(e) => setCurrentProject({ ...currentProject, description: e.target.value })}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={Array.isArray(currentProject?.tags) ? currentProject?.tags.join(', ') : (currentProject?.tags as string) || ''}
                    onChange={(e) => setCurrentProject({ ...currentProject, tags: e.target.value as any })}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none"
                    placeholder="gaming, viral, clickbait"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">External Link</label>
                  <input
                    type="text"
                    value={currentProject?.link || ''}
                    onChange={(e) => setCurrentProject({ ...currentProject, link: e.target.value })}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none"
                    placeholder="https://behance.net/..."
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="featured"
                  checked={currentProject?.featured || false}
                  onChange={(e) => setCurrentProject({ ...currentProject, featured: e.target.checked })}
                  className="w-5 h-5 rounded bg-black border-white/10 text-violet-600 focus:ring-violet-500"
                />
                <label htmlFor="featured" className="text-sm font-bold text-zinc-300">Feature this project on home page</label>
              </div>

              <div className="pt-4">
                <button
                  disabled={formLoading}
                  type="submit"
                  className="w-full py-4 bg-violet-600 text-white font-bold rounded-2xl hover:bg-violet-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Save size={20} />
                  {formLoading ? 'Saving...' : 'Save Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
        loading={deleteLoading}
      />
    </div>
  );
};

export default AdminProjects;
