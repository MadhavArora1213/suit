import { useState, useEffect } from 'react';
import { getSupportTickets, syncSupportTickets, updateSupportTicketStatus } from '../../utils/adminStore';
import { Search, Mail, Filter, CheckCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PURPLE = '#111111';

export default function SupportAdmin() {
  const [tickets, setTickets] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const load = () => setTickets([...getSupportTickets()]);
    load();
    syncSupportTickets(); // Fetch latest from DB
    window.addEventListener('admin-data-updated', load);
    return () => window.removeEventListener('admin-data-updated', load);
  }, []);

  const updateStatus = async (id, newStatus) => {
    await updateSupportTicketStatus(id, newStatus);
    setTickets([...getSupportTickets()]);
  };

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = (t.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (t.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 sm:mb-8 gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1A1A1A] tracking-tight">Support Tickets</h1>
          <p className="text-xs sm:text-sm text-[#6B8C90] mt-1">Manage and respond to customer inquiries</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full md:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8BCBE]" />
            <input 
              type="text"
              placeholder="Search email or name..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 bg-white border border-[#E8DDD0] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#111111] transition-colors w-full sm:w-56 md:w-64"
            />
          </div>
          <div className="bg-white border border-[#E8DDD0] rounded-xl px-3 sm:px-4 py-2 flex items-center gap-2">
            <Filter size={14} className="text-[#A8BCBE]" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-transparent text-xs sm:text-sm text-[#1A1A1A] focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="in-progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
        {[
          { label: 'Total', value: tickets.length, color: '#111111' },
          { label: 'New', value: tickets.filter(t => t.status === 'new').length, color: '#f59e0b' },
          { label: 'Closed', value: tickets.filter(t => t.status === 'closed').length, color: '#10b981' }
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 md:p-6 border border-[#E8DDD0] shadow-sm">
            <p className="text-[10px] sm:text-xs text-[#6B8C90] uppercase tracking-wider mb-1 sm:mb-2 font-medium">{stat.label}</p>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Ticket List */}
      <div className="space-y-3 sm:space-y-4">
        <AnimatePresence>
          {filteredTickets.map(ticket => (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#E8DDD0] shadow-sm flex flex-col md:flex-row gap-4 sm:gap-6 hover:shadow-md transition-all group"
            >
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-2">
                  <h3 className="font-bold text-[#1A1A1A] text-base sm:text-lg">{ticket.name}</h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <a href={`mailto:${ticket.email}`} className="text-xs sm:text-sm text-[#6B8C90] hover:text-[#111111] flex items-center gap-1 transition-colors">
                      <Mail size={12} />
                      {ticket.email}
                    </a>
                    <span className="text-[10px] sm:text-xs text-[#A8BCBE]">
                      {new Date(ticket.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
                
                <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#E8DDD0] text-sm text-[#1A1A1A] leading-relaxed mb-4">
                  {ticket.message}
                </div>
                
                <div className="flex items-start sm:items-center gap-2 flex-wrap">
                  <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-[#A8BCBE] hidden sm:inline">Status:</span>
                  <div className="flex gap-1.5 sm:gap-2 flex-wrap">
                    <button
                      onClick={() => updateStatus(ticket.id, 'new')}
                      className={`px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs rounded-full font-medium transition-colors ${ticket.status === 'new' ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-gray-50 text-gray-400 border border-gray-200 hover:bg-gray-100'}`}
                    >
                      New
                    </button>
                    <button
                      onClick={() => updateStatus(ticket.id, 'in-progress')}
                      className={`px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs rounded-full font-medium transition-colors flex items-center gap-1 ${ticket.status === 'in-progress' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-gray-50 text-gray-400 border border-gray-200 hover:bg-gray-100'}`}
                    >
                      <Clock size={10} />
                      In Progress
                    </button>
                    <button
                      onClick={() => updateStatus(ticket.id, 'closed')}
                      className={`px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs rounded-full font-medium transition-colors flex items-center gap-1 ${ticket.status === 'closed' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-gray-50 text-gray-400 border border-gray-200 hover:bg-gray-100'}`}
                    >
                      <CheckCircle size={10} />
                      Closed
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          {filteredTickets.length === 0 && (
            <div className="bg-white rounded-2xl p-12 border border-[#E8DDD0] flex flex-col items-center justify-center text-center">
              <Mail size={48} className="text-[#A8BCBE] mb-4 opacity-50" />
              <p className="text-lg font-medium text-[#1A1A1A] mb-1">No support tickets found</p>
              <p className="text-sm text-[#6B8C90]">Try adjusting your search or filter.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
