import React, { useState } from 'react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { LogIn, ShieldCheck, AlertCircle } from 'lucide-react';

const AdminLogin = () => {
  const { user, isAdmin, loading } = useAuth();
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailLogin, setIsEmailLogin] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const navigate = useNavigate();

  if (loading) return <div className="h-screen flex items-center justify-center bg-black text-white">Loading...</div>;
  if (user && isAdmin) return <Navigate to="/admin" />;

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setLoginLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setLoginLoading(true);
      const { signInWithEmailAndPassword, createUserWithEmailAndPassword } = await import('firebase/auth');
      
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-black flex items-center justify-center px-6">
      <div className="max-w-md w-full p-12 bg-zinc-900 border border-white/5 rounded-[40px] text-center shadow-2xl">
        <div className="w-20 h-20 bg-violet-600/10 rounded-3xl flex items-center justify-center text-violet-500 mx-auto mb-8">
          <ShieldCheck size={40} />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Admin Access</h1>
        <p className="text-zinc-400 mb-10">Sign in to manage your portfolio.</p>

        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-sm flex items-center gap-2 text-left">
            <AlertCircle size={16} className="shrink-0" />
            {error}
          </div>
        )}

        {user && !isAdmin && (
          <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 text-sm flex items-center gap-2 text-left">
            <AlertCircle size={16} className="shrink-0" />
            Access Denied. You are not an admin.
          </div>
        )}

        {isEmailLogin ? (
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none"
              required
            />
            <button
              disabled={loginLoading}
              type="submit"
              className="w-full py-4 bg-violet-600 text-white font-bold rounded-2xl hover:bg-violet-700 transition-all flex items-center justify-center gap-3 shadow-xl disabled:opacity-50"
            >
              {loginLoading ? 'Processing...' : isRegistering ? 'Register Admin' : 'Sign in with Email'}
            </button>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-violet-400 text-xs hover:text-violet-300 transition-colors"
              >
                {isRegistering ? 'Already have an account? Sign in' : 'Need to create an admin account? Register'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEmailLogin(false);
                  setIsRegistering(false);
                }}
                className="text-zinc-500 text-sm hover:text-white transition-colors"
              >
                Back to Google Login
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <button
              onClick={handleGoogleLogin}
              disabled={loginLoading}
              className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 shadow-xl disabled:opacity-50"
            >
              <LogIn size={20} />
              Sign in with Google
            </button>
            <button
              onClick={() => setIsEmailLogin(true)}
              className="text-zinc-500 text-sm hover:text-white transition-colors"
            >
              Sign in with Email & Password
            </button>
          </div>
        )}

        {user && !isAdmin && (
          <button
            onClick={() => signOut(auth)}
            className="mt-6 text-zinc-500 text-sm hover:text-white transition-colors block w-full"
          >
            Sign out and try another account
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
