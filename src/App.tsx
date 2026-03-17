/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SiteProvider } from './context/SiteContext';

// Pages (to be created)
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Services from './pages/Services';
import Contact from './pages/Contact';

// Admin (to be created)
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/Dashboard';
import AdminProjects from './admin/Projects';
import AdminServices from './admin/Services';
import AdminSiteConfig from './admin/SiteConfig';
import AdminMessages from './admin/Messages';
import AdminInsights from './admin/Insights';
import AdminTestimonials from './admin/Testimonials';
import AdminUsers from './admin/Users';
import AdminLogin from './admin/Login';
import { useSite } from './context/SiteContext';

import { AnimatePresence, motion } from 'motion/react';

const SiteLoadingWrapper = ({ children }: { children: React.ReactNode }) => {
  const { loading } = useSite();
  
  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div 
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
        >
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="w-16 h-16 border-2 border-white/5 rounded-full" />
              <div className="absolute inset-0 w-16 h-16 border-t-2 border-violet-500 rounded-full animate-spin" />
            </div>
            <div className="text-center">
              <p className="text-white font-bold tracking-[0.2em] uppercase text-xs mb-2">Ehtisham Arshad</p>
              <p className="text-zinc-500 text-[10px] uppercase tracking-widest animate-pulse">Loading Experience</p>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) return <div className="h-screen w-screen flex items-center justify-center bg-black text-white">Loading...</div>;
  if (!user || !isAdmin) return <Navigate to="/admin/login" />;

  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <SiteProvider>
        <Router>
          <SiteLoadingWrapper>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <Routes>
                        <Route path="/" element={<AdminDashboard />} />
                        <Route path="/projects" element={<AdminProjects />} />
                        <Route path="/services" element={<AdminServices />} />
                        <Route path="/config" element={<AdminSiteConfig />} />
                        <Route path="/messages" element={<AdminMessages />} />
                        <Route path="/insights" element={<AdminInsights />} />
                        <Route path="/users" element={<AdminUsers />} />
                        <Route path="/testimonials" element={<AdminTestimonials />} />
                      </Routes>
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </SiteLoadingWrapper>
        </Router>
      </SiteProvider>
    </AuthProvider>
  );
}

