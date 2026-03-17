import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Briefcase, Settings, MessageSquare, LogOut, Menu, X, Globe, BarChart3, Star, FileText, Home, User, Mail, LayoutIcon } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { cn } from '../utils/cn';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarWidth, setSidebarWidth] = useState(256); // Default 256px (w-64)
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Insights', path: '/admin/insights', icon: <BarChart3 size={20} /> },
    { name: 'Users', path: '/admin/users', icon: <User size={20} /> },
    { name: 'Site Config', path: '/admin/config', icon: <Settings size={20} /> },
  ];

  const contentItems = [
    { name: 'Projects', path: '/admin/projects', icon: <FolderKanban size={20} /> },
    { name: 'Services', path: '/admin/services', icon: <Briefcase size={20} /> },
    { name: 'Testimonials', path: '/admin/testimonials', icon: <Star size={20} /> },
    { name: 'Messages', path: '/admin/messages', icon: <MessageSquare size={20} /> },
  ];

  const pageItems = [
    { name: 'Home Page', path: '/admin/config?tab=home_builder', icon: <Home size={20} /> },
    { name: 'About Page', path: '/admin/config?tab=about_page', icon: <User size={20} /> },
    { name: 'Services Page', path: '/admin/config?tab=page_content', icon: <LayoutIcon size={20} /> },
    { name: 'Contact Page', path: '/admin/config?tab=page_content', icon: <Mail size={20} /> },
  ];

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = e.clientX;
      if (newWidth >= 80 && newWidth <= 480) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex select-none">
      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        style={{ width: sidebarWidth }}
        className="fixed inset-y-0 left-0 z-50 bg-zinc-900 border-r border-white/5 flex flex-col"
      >
        <div className="h-full flex flex-col overflow-hidden">
          <div className="p-6 flex items-center justify-between shrink-0">
            {sidebarWidth > 120 && <span className="text-xl font-bold tracking-tighter">ADMIN CMS</span>}
            <button 
              onClick={() => setSidebarWidth(sidebarWidth > 120 ? 80 : 256)} 
              className="text-zinc-400 hover:text-white"
            >
              {sidebarWidth > 120 ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8 custom-scrollbar">
            <div className="space-y-2">
              {sidebarWidth > 120 && <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-4 mb-2">Main</p>}
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-4 px-4 py-3 rounded-xl transition-all group',
                    location.pathname === item.path
                      ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20'
                      : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                  )}
                >
                  <span className="shrink-0">{item.icon}</span>
                  {sidebarWidth > 120 && <span className="font-medium truncate">{item.name}</span>}
                </Link>
              ))}
            </div>

            <div className="space-y-2">
              {sidebarWidth > 120 && <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-4 mb-2">Content</p>}
              {contentItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-4 px-4 py-3 rounded-xl transition-all group',
                    location.pathname === item.path
                      ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20'
                      : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                  )}
                >
                  <span className="shrink-0">{item.icon}</span>
                  {sidebarWidth > 120 && <span className="font-medium truncate">{item.name}</span>}
                </Link>
              ))}
            </div>

            <div className="space-y-2">
              {sidebarWidth > 120 && <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-4 mb-2">Pages</p>}
              {pageItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-4 px-4 py-3 rounded-xl transition-all group',
                    location.pathname + location.search === item.path
                      ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20'
                      : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                  )}
                >
                  <span className="shrink-0">{item.icon}</span>
                  {sidebarWidth > 120 && <span className="font-medium truncate">{item.name}</span>}
                </Link>
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-white/5 space-y-2 shrink-0">
            <Link
              to="/"
              className="flex items-center gap-4 px-4 py-3 rounded-xl text-zinc-400 hover:bg-white/5 hover:text-white transition-all"
            >
              <Globe size={20} />
              {sidebarWidth > 120 && <span className="font-medium">View Site</span>}
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-all"
            >
              <LogOut size={20} />
              {sidebarWidth > 120 && <span className="font-medium">Logout</span>}
            </button>
          </div>
        </div>

        {/* Resize Handle */}
        <div
          onMouseDown={startResizing}
          className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-violet-500/50 transition-colors z-50"
        />
      </aside>

      {/* Main Content */}
      <main
        style={{ marginLeft: sidebarWidth }}
        className="flex-1 min-h-screen"
      >
        <div className="p-8 max-w-6xl mx-auto select-text">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
