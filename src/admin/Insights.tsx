import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, limit, getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { Message, Project } from '../types';
import { 
  TrendingUp, 
  Users, 
  Eye, 
  MousePointer2, 
  BarChart3, 
  PieChart, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  Globe,
  FolderKanban,
  MessageSquare,
  Star
} from 'lucide-react';
import { format, subDays, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

const Insights = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalViews: 12540,
    uniqueVisitors: 3420,
    avgSessionTime: '4m 32s',
    bounceRate: '32.4%',
    viewsGrowth: 12.5,
    visitorsGrowth: 8.2,
    totalProjects: 0,
    totalMessages: 0,
    avgRating: 5.0,
    totalTestimonials: 0,
  });

  const [chartData, setChartData] = useState<any[]>([]);
  const [topPages, setTopPages] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectsSnap = await getDocs(collection(db, 'projects'));
        const messagesSnap = await getDocs(collection(db, 'messages'));
        const configSnap = await getDoc(doc(db, 'config', 'site'));
        const siteConfig = configSnap.data();
        
        const testimonials = siteConfig?.testimonials || [];
        const totalRating = testimonials.reduce((acc: number, t: any) => acc + (t.rating || 5), 0);
        const avgRating = testimonials.length > 0 ? totalRating / testimonials.length : 5.0;

        setStats(prev => ({
          ...prev,
          totalProjects: projectsSnap.size,
          totalMessages: messagesSnap.size,
          totalTestimonials: testimonials.length,
          avgRating: avgRating,
        }));

        // Mocking some data for insights
        const data = [];
        for (let i = 6; i >= 0; i--) {
          const date = subDays(new Date(), i);
          data.push({
            name: format(date, 'MMM d'),
            views: Math.floor(Math.random() * 500) + 800,
            visitors: Math.floor(Math.random() * 200) + 300,
          });
        }
        setChartData(data);

        setTopPages([
          { path: '/', views: 5420, rate: '45%' },
          { path: '/projects', views: 3210, rate: '25%' },
          { path: '/services', views: 2150, rate: '18%' },
          { path: '/about', views: 1240, rate: '8%' },
          { path: '/contact', views: 520, rate: '4%' },
        ]);
      } catch (error) {
        console.error("Error fetching insights data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="animate-pulse space-y-8">
    <div className="grid grid-cols-4 gap-6">
      {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-zinc-900 rounded-3xl" />)}
    </div>
    <div className="h-96 bg-zinc-900 rounded-3xl" />
  </div>;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold mb-2">Website Insights</h1>
        <p className="text-zinc-400 text-sm">Track your portfolio performance and audience engagement.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-8 bg-zinc-900 border border-white/5 rounded-[32px] shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center mb-6 text-violet-500">
            <Eye size={24} />
          </div>
          <p className="text-zinc-400 text-sm font-medium mb-1">Total Page Views</p>
          <div className="flex items-end gap-3">
            <p className="text-3xl font-bold text-white">{stats.totalViews.toLocaleString()}</p>
            <span className="text-emerald-500 text-xs font-bold flex items-center gap-0.5 mb-1">
              <ArrowUpRight size={14} />
              {stats.viewsGrowth}%
            </span>
          </div>
        </div>

        <div className="p-8 bg-zinc-900 border border-white/5 rounded-[32px] shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 text-blue-500">
            <Users size={24} />
          </div>
          <p className="text-zinc-400 text-sm font-medium mb-1">Unique Visitors</p>
          <div className="flex items-end gap-3">
            <p className="text-3xl font-bold text-white">{stats.uniqueVisitors.toLocaleString()}</p>
            <span className="text-emerald-500 text-xs font-bold flex items-center gap-0.5 mb-1">
              <ArrowUpRight size={14} />
              {stats.visitorsGrowth}%
            </span>
          </div>
        </div>

        <div className="p-8 bg-zinc-900 border border-white/5 rounded-[32px] shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 text-emerald-500">
            <FolderKanban size={24} />
          </div>
          <p className="text-zinc-400 text-sm font-medium mb-1">Total Projects</p>
          <p className="text-3xl font-bold text-white">{stats.totalProjects}</p>
        </div>

        <div className="p-8 bg-zinc-900 border border-white/5 rounded-[32px] shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-6 text-amber-500">
            <MessageSquare size={24} />
          </div>
          <p className="text-zinc-400 text-sm font-medium mb-1">Total Messages</p>
          <p className="text-3xl font-bold text-white">{stats.totalMessages}</p>
        </div>

        <div className="p-8 bg-zinc-900 border border-white/5 rounded-[32px] shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 flex items-center justify-center mb-6 text-yellow-500">
            <Star size={24} />
          </div>
          <p className="text-zinc-400 text-sm font-medium mb-1">Avg. Rating</p>
          <div className="flex items-center gap-2">
            <p className="text-3xl font-bold text-white">{stats.avgRating.toFixed(1)}</p>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} size={12} className="fill-yellow-500 text-yellow-500" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-zinc-900 border border-white/5 rounded-[32px] p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold">Traffic Overview</h2>
            <div className="flex gap-2">
              <span className="flex items-center gap-2 text-xs text-zinc-400">
                <div className="w-2 h-2 rounded-full bg-violet-500" /> Views
              </span>
              <span className="flex items-center gap-2 text-xs text-zinc-400">
                <div className="w-2 h-2 rounded-full bg-blue-500" /> Visitors
              </span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#71717a" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#71717a" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #ffffff10', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#8B5CF6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorViews)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="visitors" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorVisitors)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-zinc-900 border border-white/5 rounded-[32px] p-8">
          <h2 className="text-xl font-bold mb-8">Top Pages</h2>
          <div className="space-y-6">
            {topPages.map((page, i) => (
              <div key={page.path} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-300 font-medium">{page.path}</span>
                  <span className="text-white font-bold">{page.views.toLocaleString()}</span>
                </div>
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-violet-600 rounded-full" 
                    style={{ width: page.rate }}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-10 p-6 bg-violet-500/5 border border-violet-500/10 rounded-2xl">
            <h4 className="text-sm font-bold text-violet-400 mb-2 flex items-center gap-2">
              <TrendingUp size={16} /> Insight
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Your home page traffic is up 15% this week. Consider adding more direct links to your services to improve conversion.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;
