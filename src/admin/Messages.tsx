import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Message } from '../types';
import { Trash2, Mail, CheckCircle, Clock, User, Search, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '../utils/cn';

const AdminMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    setMessages(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message)));
    setLoading(false);
  };

  const toggleRead = async (message: Message) => {
    await updateDoc(doc(db, 'messages', message.id), { read: !message.read });
    fetchMessages();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this message?')) {
      await deleteDoc(doc(db, 'messages', id));
      fetchMessages();
    }
  };

  const filteredMessages = messages.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-zinc-400 text-sm">Manage contact form submissions.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900 border border-white/5 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-violet-500 transition-all"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredMessages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              'p-6 rounded-[32px] border transition-all group',
              msg.read ? 'bg-zinc-900/50 border-white/5' : 'bg-zinc-900 border-violet-500/20 shadow-lg shadow-violet-500/5'
            )}
          >
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center font-bold',
                      msg.read ? 'bg-zinc-800 text-zinc-500' : 'bg-violet-600 text-white'
                    )}>
                      {msg.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{msg.name}</h3>
                      <p className="text-xs text-zinc-500">{msg.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-1 justify-end mb-1">
                      <Clock size={10} />
                      {msg.createdAt ? format((msg.createdAt as any).toDate(), 'MMM d, yyyy') : 'Recently'}
                    </p>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                      {msg.createdAt ? format((msg.createdAt as any).toDate(), 'h:mm a') : ''}
                    </p>
                  </div>
                </div>
                <h4 className="text-sm font-bold text-violet-400 mb-2">{msg.subject || 'No Subject'}</h4>
                <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
              </div>

              <div className="flex md:flex-col gap-2 justify-end">
                <button
                  onClick={() => toggleRead(msg)}
                  title={msg.read ? 'Mark as unread' : 'Mark as read'}
                  className={cn(
                    'p-3 rounded-xl transition-all',
                    msg.read ? 'bg-zinc-800 text-zinc-500 hover:text-white' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
                  )}
                >
                  <CheckCircle size={20} />
                </button>
                <button
                  onClick={() => handleDelete(msg.id)}
                  title="Delete message"
                  className="p-3 bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500/20 transition-all"
                >
                  <Trash2 size={20} />
                </button>
                <a
                  href={`mailto:${msg.email}`}
                  title="Reply via email"
                  className="p-3 bg-blue-500/10 text-blue-500 rounded-xl hover:bg-blue-500/20 transition-all"
                >
                  <Mail size={20} />
                </a>
              </div>
            </div>
          </div>
        ))}

        {filteredMessages.length === 0 && !loading && (
          <div className="text-center py-20 bg-zinc-900/50 border border-white/5 rounded-[40px]">
            <MessageSquare size={48} className="mx-auto text-zinc-700 mb-4" />
            <p className="text-zinc-500">No messages found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMessages;
