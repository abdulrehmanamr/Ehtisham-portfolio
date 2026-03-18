import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, setDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { UserPlus, Trash2, Shield, Mail, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import DeleteModal from '../components/DeleteModal';

interface AdminUser {
  id: string;
  email: string;
  role: string;
  addedAt: any;
}

const Users = () => {
  const { user: currentUser } = useAuth();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<{ id: string, email: string } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const q = query(collection(db, 'admins'));
      const snap = await getDocs(q);
      const adminList = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as AdminUser));
      setAdmins(adminList);
    } catch (err: any) {
      console.error('Error fetching admins:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;

    try {
      setError('');
      setSuccess('');
      setIsAdding(true);

      // In a real app, you might want to use a cloud function to check if user exists
      // For now, we just add the email to the 'admins' collection
      // The AuthContext will then recognize this email as an admin
      
      // Use email as ID for lookup if UID is unknown
      const adminId = newEmail.toLowerCase();
      
      await setDoc(doc(db, 'admins', adminId), {
        email: newEmail.toLowerCase(),
        role: 'admin',
        addedAt: new Date(),
        addedBy: currentUser?.email
      });

      setSuccess(`Admin ${newEmail} added successfully.`);
      setNewEmail('');
      fetchAdmins();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteAdmin = async () => {
    if (!adminToDelete) return;
    
    setDeleteLoading(true);
    try {
      await deleteDoc(doc(db, 'admins', adminToDelete.id));
      setSuccess('Admin removed successfully.');
      setIsDeleteModalOpen(false);
      setAdminToDelete(null);
      fetchAdmins();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const confirmDelete = (id: string, email: string) => {
    if (email === 'abdulrehmanamr06@gmail.com') {
      setError('Cannot delete the bootstrap admin.');
      return;
    }
    setAdminToDelete({ id, email });
    setIsDeleteModalOpen(true);
  };

  if (loading) return <div className="animate-pulse space-y-8">
    <div className="h-12 bg-zinc-900 rounded-xl w-1/4" />
    <div className="h-64 bg-zinc-900 rounded-3xl" />
  </div>;

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">User Management</h1>
          <p className="text-zinc-400 text-sm">Manage who has access to this admin panel.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-zinc-900 border border-white/5 rounded-[32px] overflow-hidden">
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Shield size={20} className="text-violet-500" />
                Admin Users
              </h2>
              <span className="px-3 py-1 bg-violet-500/10 text-violet-500 text-xs font-bold rounded-full">
                {admins.length} Total
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-zinc-500 text-xs uppercase tracking-widest border-b border-white/5">
                    <th className="px-8 py-4 font-bold">Email Address</th>
                    <th className="px-8 py-4 font-bold">Role</th>
                    <th className="px-8 py-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {/* Bootstrap Admin (Always visible) */}
                  <tr className="group hover:bg-white/5 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-xs font-bold">
                          A
                        </div>
                        <div>
                          <p className="font-bold text-sm">abdulrehmanamr06@gmail.com</p>
                          <p className="text-[10px] text-violet-500 font-bold uppercase tracking-widest">System Owner</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold rounded-md uppercase">Super Admin</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className="text-zinc-600 text-xs italic">Protected</span>
                    </td>
                  </tr>

                  {admins.filter(a => a.email !== 'abdulrehmanamr06@gmail.com').map((admin) => (
                    <tr key={admin.id} className="group hover:bg-white/5 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold group-hover:bg-violet-600 transition-colors">
                            {admin.email.charAt(0).toUpperCase()}
                          </div>
                          <p className="font-bold text-sm">{admin.email}</p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-2 py-1 bg-violet-500/10 text-violet-500 text-[10px] font-bold rounded-md uppercase">{admin.role}</span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button
                          onClick={() => confirmDelete(admin.id, admin.email)}
                          className="p-2 text-zinc-500 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-900 border border-white/5 rounded-[32px] p-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <UserPlus size={20} className="text-violet-500" />
              Add Admin
            </h2>
            
            {error && (
              <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-sm flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500 text-sm flex items-center gap-2">
                <CheckCircle2 size={16} className="shrink-0" />
                {success}
              </div>
            )}

            <form onSubmit={handleAddAdmin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 px-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                  <input
                    type="email"
                    placeholder="admin@example.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-violet-500 outline-none transition-all"
                    required
                  />
                </div>
              </div>
              <button
                disabled={isAdding}
                type="submit"
                className="w-full py-4 bg-violet-600 text-white font-bold rounded-2xl hover:bg-violet-700 transition-all flex items-center justify-center gap-2 shadow-xl disabled:opacity-50"
              >
                {isAdding ? 'Adding...' : 'Add Admin User'}
              </button>
            </form>
            
            <div className="mt-8 p-4 bg-white/5 rounded-2xl">
              <p className="text-xs text-zinc-400 leading-relaxed">
                <span className="text-violet-400 font-bold">Note:</span> Adding an email here grants that user full access to the admin panel. They will still need to sign in using that email.
              </p>
            </div>
          </div>
        </div>
      </div>
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAdmin}
        title="Remove Admin"
        message={`Are you sure you want to remove ${adminToDelete?.email} from admins? They will lose all access to the admin panel.`}
        loading={deleteLoading}
      />
    </div>
  );
};

export default Users;
