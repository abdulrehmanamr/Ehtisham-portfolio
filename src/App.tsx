/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SiteProvider } from './context/SiteContext';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Projects = lazy(() => import('./pages/Projects'));
const Services = lazy(() => import('./pages/Services'));
const Contact = lazy(() => import('./pages/Contact'));

// Lazy load admin components
const AdminLayout = lazy(() => import('./admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./admin/Dashboard'));
const AdminProjects = lazy(() => import('./admin/Projects'));
const AdminServices = lazy(() => import('./admin/Services'));
const AdminSiteConfig = lazy(() => import('./admin/SiteConfig'));
const AdminMessages = lazy(() => import('./admin/Messages'));
const AdminInsights = lazy(() => import('./admin/Insights'));
const AdminTestimonials = lazy(() => import('./admin/Testimonials'));
const AdminUsers = lazy(() => import('./admin/Users'));
const AdminSEO = lazy(() => import('./admin/SEOConfig'));
const AdminLogin = lazy(() => import('./admin/Login'));

import { useSite } from './context/SiteContext';
import { AnimatePresence, motion } from 'motion/react';

const SiteLoadingWrapper = ({ children }: { children: React.ReactNode }) => {
  const { loading } = useSite();
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (loading) {
      // Small delay to avoid flickering on fast connections
      timer = setTimeout(() => setShowLoader(true), 200);
    } else {
      setShowLoader(false);
    }
    return () => clearTimeout(timer);
  }, [loading]);
  
  return (
    <AnimatePresence mode="wait">
      {loading && showLoader ? (
        <motion.div 
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
          style={{ willChange: "opacity" }}
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
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{ willChange: "opacity" }}
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
            <Suspense fallback={null}>
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
                        <Suspense fallback={<div className="h-full w-full flex items-center justify-center bg-zinc-950 text-white">Loading Admin...</div>}>
                          <Routes>
                            <Route path="/" element={<AdminDashboard />} />
                            <Route path="/projects" element={<AdminProjects />} />
                            <Route path="/services" element={<AdminServices />} />
                            <Route path="/config" element={<AdminSiteConfig />} />
                            <Route path="/messages" element={<AdminMessages />} />
                            <Route path="/insights" element={<AdminInsights />} />
                            <Route path="/users" element={<AdminUsers />} />
                            <Route path="/seo" element={<AdminSEO />} />
                            <Route path="/testimonials" element={<AdminTestimonials />} />
                          </Routes>
                        </Suspense>
                      </AdminLayout>
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Suspense>
          </SiteLoadingWrapper>
        </Router>
      </SiteProvider>
    </AuthProvider>
  );
}

