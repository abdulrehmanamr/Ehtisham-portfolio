import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, limit, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { handleFirestoreError, OperationType } from '../utils/errorHandlers';
import { Project, Message, Service } from '../types';
import { FolderKanban, MessageSquare, Briefcase, Eye, TrendingUp, Clock, Settings } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../utils/cn';

const Dashboard = () => {
  const [stats, setStats] = useState({ projects: 0, messages: 0, services: 0, unreadMessages: 0 });
  const [recentMessages, setRecentMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projectsSnap, messagesSnap, servicesSnap] = await Promise.all([
          getDocs(collection(db, 'projects')),
          getDocs(collection(db, 'messages')),
          getDocs(collection(db, 'services'))
        ]);

        const unreadCount = messagesSnap.docs.filter(doc => !doc.data().read).length;

        setStats({
          projects: projectsSnap.size,
          messages: messagesSnap.size,
          services: servicesSnap.size,
          unreadMessages: unreadCount
        });

        // Fetch recent messages
        const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'), limit(5));
        const recentSnap = await getDocs(q);
        setRecentMessages(recentSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message)));
      } catch (error: any) {
        if (error?.message?.includes('permission')) {
          handleFirestoreError(error, OperationType.LIST, 'dashboard_data');
        }
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    { name: 'Total Projects', value: stats.projects, icon: <FolderKanban className="text-violet-500" />, color: 'bg-violet-500/10' },
    { name: 'Total Services', value: stats.services, icon: <Briefcase className="text-emerald-500" />, color: 'bg-emerald-500/10' },
    { name: 'Total Messages', value: stats.messages, icon: <MessageSquare className="text-blue-500" />, color: 'bg-blue-500/10' },
    { name: 'Unread Messages', value: stats.unreadMessages, icon: <TrendingUp className="text-amber-500" />, color: 'bg-amber-500/10' },
  ];

  if (loading) return <div className="animate-pulse space-y-8">
    <div className="grid grid-cols-4 gap-6">
      {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-zinc-900 rounded-3xl" />)}
    </div>
    <div className="h-96 bg-zinc-900 rounded-3xl" />
  </div>;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome back, Admin</h1>
        <p className="text-zinc-400 text-sm">Here's what's happening with your portfolio today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.name} className="p-8 bg-zinc-900 border border-white/5 rounded-[32px] shadow-xl">
            <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center mb-6', card.color)}>
              {card.icon}
            </div>
            <p className="text-zinc-400 text-sm font-medium mb-1">{card.name}</p>
            <p className="text-3xl font-bold text-white">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-zinc-900 border border-white/5 rounded-[32px] p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold">Recent Messages</h2>
            <button className="text-violet-400 text-sm font-bold hover:text-violet-300">View All</button>
          </div>
          <div className="space-y-6">
            {recentMessages.length > 0 ? (
              recentMessages.map((msg) => (
                <div key={msg.id} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all group">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-violet-600 group-hover:text-white transition-all">
                    {msg.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-sm">{msg.name}</h4>
                      <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                        <Clock size={10} />
                        {msg.createdAt ? format((msg.createdAt as any).toDate(), 'MMM d, h:mm a') : 'Just now'}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 line-clamp-1">{msg.message}</p>
                  </div>
                  {!msg.read && <div className="w-2 h-2 rounded-full bg-violet-500 mt-2" />}
                </div>
              ))
            ) : (
              <p className="text-center py-10 text-zinc-500 text-sm">No messages yet.</p>
            )}
          </div>
        </div>

        <div className="bg-zinc-900 border border-white/5 rounded-[32px] p-8">
          <h2 className="text-xl font-bold mb-8">Quick Actions</h2>
          <div className="space-y-4">
            <button className="w-full p-4 bg-violet-600 text-white font-bold rounded-2xl hover:bg-violet-700 transition-all flex items-center gap-3">
              <FolderKanban size={18} />
              Add New Project
            </button>
            <button className="w-full p-4 bg-zinc-800 text-white font-bold rounded-2xl hover:bg-zinc-700 transition-all flex items-center gap-3">
              <Briefcase size={18} />
              Manage Services
            </button>
            <button className="w-full p-4 bg-zinc-800 text-white font-bold rounded-2xl hover:bg-zinc-700 transition-all flex items-center gap-3">
              <Settings size={18} />
              Edit Site Config
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
