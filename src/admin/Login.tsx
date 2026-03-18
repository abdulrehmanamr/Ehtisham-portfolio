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
            <div className="text-left mb-4">
              <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest mb-1">Email Address</p>
              <input
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none"
                required
              />
            </div>
            <div className="text-left mb-6">
              <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest mb-1">Password</p>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none"
                required
              />
            </div>
            <button
              disabled={loginLoading}
              type="submit"
              className="w-full py-4 bg-violet-600 text-white font-bold rounded-2xl hover:bg-violet-700 transition-all flex items-center justify-center gap-3 shadow-xl disabled:opacity-50"
            >
              {loginLoading ? 'Processing...' : isRegistering ? 'Create Admin Account' : 'Sign in with Email'}
            </button>
            <div className="flex flex-col gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-violet-400 text-sm hover:text-violet-300 transition-colors"
              >
                {isRegistering ? 'Already have an account? Sign in' : 'Need to use email/password? Register here'}
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
          <div className="space-y-6">
            <button
              onClick={handleGoogleLogin}
              disabled={loginLoading}
              className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 shadow-xl disabled:opacity-50 group"
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </div>
              Continue with Google
            </button>
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-zinc-900 px-2 text-zinc-500">Or</span></div>
            </div>
            <button
              onClick={() => setIsEmailLogin(true)}
              className="w-full py-4 bg-zinc-800 text-white font-bold rounded-2xl hover:bg-zinc-700 transition-all flex items-center justify-center gap-3 border border-white/5"
            >
              <LogIn size={20} className="text-zinc-400" />
              Sign in with Email
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
