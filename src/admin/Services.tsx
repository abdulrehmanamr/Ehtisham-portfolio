import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { Service } from '../types';
import { Plus, Edit2, Trash2, X, Save, Zap, Palette, Image as ImageIcon, Share2, Rocket } from 'lucide-react';
import DeleteModal from '../components/DeleteModal';

const AdminServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);
  const [currentService, setCurrentService] = useState<Partial<Service> | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const q = query(collection(db, 'services'), orderBy('order', 'asc'));
    const snap = await getDocs(q);
    setServices(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service)));
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (currentService?.id) {
        await updateDoc(doc(db, 'services', currentService.id), currentService);
      } else {
        await addDoc(collection(db, 'services'), {
          ...currentService,
          order: services.length,
          createdAt: serverTimestamp(),
        });
      }
      setIsModalOpen(false);
      fetchServices();
    } catch (error) {
      console.error(error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!serviceToDelete) return;
    setDeleteLoading(true);
    try {
      await deleteDoc(doc(db, 'services', serviceToDelete));
      setIsDeleteModalOpen(false);
      setServiceToDelete(null);
      fetchServices();
    } catch (error) {
      console.error(error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const confirmDelete = (id: string) => {
    setServiceToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const openModal = (service: Service | null = null) => {
    setCurrentService(service || { title: '', description: '', price: '', icon: 'zap' });
    setIsModalOpen(true);
  };

  const icons = [
    { name: 'Zap', value: 'zap', icon: <Zap size={18} /> },
    { name: 'Palette', value: 'palette', icon: <Palette size={18} /> },
    { name: 'Image', value: 'image', icon: <ImageIcon size={18} /> },
    { name: 'Share', value: 'share', icon: <Share2 size={18} /> },
    { name: 'Rocket', value: 'rocket', icon: <Rocket size={18} /> },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Services</h1>
          <p className="text-zinc-400 text-sm">Manage your service offerings and pricing.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="px-6 py-3 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-700 transition-all flex items-center gap-2"
        >
          <Plus size={20} />
          Add Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-zinc-900 border border-white/5 rounded-3xl p-8 flex items-start gap-6 group">
            <div className="w-14 h-14 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-500 shrink-0">
              {icons.find(i => i.value === service.icon)?.icon || <Zap size={24} />}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-xl">{service.title}</h3>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openModal(service)} className="p-2 text-zinc-400 hover:text-white transition-colors">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => confirmDelete(service.id)} className="p-2 text-rose-500 hover:text-rose-400 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <p className="text-zinc-400 text-sm mb-4">{service.description}</p>
              <p className="text-2xl font-bold text-white">{service.price}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-xl bg-zinc-900 border border-white/10 rounded-[40px] overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-2xl font-bold">{currentService?.id ? 'Edit Service' : 'Add New Service'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-white"><X size={24} /></button>
            </div>
            <form onSubmit={handleSave} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Service Title</label>
                <input
                  required
                  type="text"
                  value={currentService?.title || ''}
                  onChange={(e) => setCurrentService({ ...currentService, title: e.target.value })}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none"
                  placeholder="e.g. YouTube Thumbnail Design"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Price</label>
                  <input
                    required
                    type="text"
                    value={currentService?.price || ''}
                    onChange={(e) => setCurrentService({ ...currentService, price: e.target.value })}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none"
                    placeholder="e.g. $25"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Icon</label>
                  <select
                    value={currentService?.icon || 'zap'}
                    onChange={(e) => setCurrentService({ ...currentService, icon: e.target.value })}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none appearance-none"
                  >
                    {icons.map(icon => (
                      <option key={icon.value} value={icon.value}>{icon.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Description</label>
                <textarea
                  required
                  rows={4}
                  value={currentService?.description || ''}
                  onChange={(e) => setCurrentService({ ...currentService, description: e.target.value })}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none resize-none"
                  placeholder="Describe what's included in this service..."
                />
              </div>

              <div className="pt-4">
                <button
                  disabled={formLoading}
                  type="submit"
                  className="w-full py-4 bg-violet-600 text-white font-bold rounded-2xl hover:bg-violet-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Save size={20} />
                  {formLoading ? 'Saving...' : 'Save Service'}
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
        title="Delete Service"
        message="Are you sure you want to delete this service? This action cannot be undone."
        loading={deleteLoading}
      />
    </div>
  );
};

export default AdminServices;
