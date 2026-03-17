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
import AdminLogin from './admin/Login';
import { useSite } from './context/SiteContext';

const SiteLoadingWrapper = ({ children }: { children: React.ReactNode }) => {
  const { loading } = useSite();
  if (loading) return <div className="h-screen w-screen flex items-center justify-center bg-black text-white">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-zinc-400 font-medium animate-pulse">Loading Experience...</p>
    </div>
  </div>;
  return <>{children}</>;
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

