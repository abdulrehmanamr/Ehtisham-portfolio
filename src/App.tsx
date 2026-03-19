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

const AppContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={{ willChange: "opacity" }}
    >
      {children}
    </motion.div>
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
          <AppContent>
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
          </AppContent>
        </Router>
      </SiteProvider>
    </AuthProvider>
  );
}

