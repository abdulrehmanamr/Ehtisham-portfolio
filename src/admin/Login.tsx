import React, { useState } from 'react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { LogIn, ShieldCheck, AlertCircle } from 'lucide-react';

const AdminLogin = () => {
  const { user, isAdmin, loading } = useAuth();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  if (loading) return <div className="h-screen flex items-center justify-center bg-black text-white">Loading...</div>;
  if (user && isAdmin) return <Navigate to="/admin" />;

  const handleLogin = async () => {
    try {
      setError('');
      await signInWithPopup(auth, googleProvider);
      // AuthContext will handle the redirect if admin
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="h-screen w-screen bg-black flex items-center justify-center px-6">
      <div className="max-w-md w-full p-12 bg-zinc-900 border border-white/5 rounded-[40px] text-center shadow-2xl">
        <div className="w-20 h-20 bg-violet-600/10 rounded-3xl flex items-center justify-center text-violet-500 mx-auto mb-8">
          <ShieldCheck size={40} />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Admin Access</h1>
        <p className="text-zinc-400 mb-10">Sign in with your Google account to manage your portfolio.</p>

        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-sm flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {user && !isAdmin && (
          <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 text-sm flex items-center gap-2">
            <AlertCircle size={16} />
            Access Denied. You are not an admin.
          </div>
        )}

        <button
          onClick={handleLogin}
          className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 shadow-xl"
        >
          <LogIn size={20} />
          Sign in with Google
        </button>

        {user && !isAdmin && (
          <button
            onClick={() => signOut(auth)}
            className="mt-4 text-zinc-500 text-sm hover:text-white transition-colors"
          >
            Sign out and try another account
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
