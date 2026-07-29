import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Mail, Phone, Calendar, User as UserIcon, ShieldAlert } from 'lucide-react';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';

export default function UsersAdmin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedUsers = [];
        querySnapshot.forEach((doc) => {
          fetchedUsers.push({ id: doc.id, ...doc.data() });
        });
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F6F3F8] font-sans pb-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-12">
        {/* Header */}
        <div className="mb-6 sm:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-light text-[#111111] mb-2 tracking-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Login Users
            </h1>
            <p className="text-xs sm:text-sm text-[#111111]/50">Manage registered users and accounts</p>
          </div>
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#111111]/40" size={16} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-2 sm:py-2.5 bg-white border border-[#111111]/10 rounded-xl focus:border-[#BCA58A] focus:ring-1 focus:ring-[#BCA58A] outline-none w-full md:w-[300px] text-xs sm:text-sm text-[#111111] transition-all"
            />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#BCA58A]/30 border-t-[#BCA58A] rounded-full animate-spin" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-[#111111]/5 shadow-sm">
            <Users className="w-10 sm:w-12 h-10 sm:h-12 text-[#111111]/20 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-[#111111] mb-2">No users found</h3>
            <p className="text-xs sm:text-sm text-[#111111]/50">There are no customers matching your search criteria.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#111111]/5 shadow-sm overflow-hidden">
            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-[#111111]/5">
              {filteredUsers.map((user, idx) => (
                <motion.div key={user.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                  className="p-4 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#111111]/5 flex items-center justify-center text-[#BCA58A] font-medium border border-[#BCA58A]/20 flex-shrink-0">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-[#111111] text-sm truncate">{user.name || 'Anonymous User'}</div>
                      <div className="text-[10px] text-[#111111]/40 font-mono">ID: {user.id.substring(0, 8)}...</div>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium flex-shrink-0 ${user.role === 'admin' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                      {user.role === 'admin' ? 'Admin' : 'Customer'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#111111]/60">
                    <Mail size={12} className="text-[#111111]/40" />
                    <span className="truncate">{user.email || 'N/A'}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-2 text-xs text-[#111111]/50">
                      <Phone size={12} className="text-[#111111]/40" /> {user.phone}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-[10px] text-[#111111]/50">
                    <Calendar size={11} className="text-[#111111]/40" />
                    {user.createdAt ? new Date(user.createdAt.seconds * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Unknown'}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FAF9F6] border-b border-[#111111]/5">
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-[#111111]/60 uppercase">Customer Name</th>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-[#111111]/60 uppercase">Contact Info</th>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-[#111111]/60 uppercase">Role</th>
                    <th className="px-6 py-4 text-xs font-semibold tracking-wider text-[#111111]/60 uppercase text-right">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#111111]/5">
                  {filteredUsers.map((user, idx) => (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      key={user.id} 
                      className="hover:bg-[#FAF9F6]/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#111111]/5 flex items-center justify-center text-[#BCA58A] font-medium border border-[#BCA58A]/20">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <div className="font-medium text-[#111111] text-sm">{user.name || 'Anonymous User'}</div>
                            <div className="text-xs text-[#111111]/40 font-mono mt-0.5" style={{ fontSize: '10px' }}>ID: {user.id.substring(0, 8)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-sm text-[#111111]/70">
                            <Mail size={14} className="text-[#111111]/40" />
                            {user.email || 'N/A'}
                          </div>
                          {user.phone && (
                            <div className="flex items-center gap-2 text-xs text-[#111111]/50">
                              <Phone size={13} className="text-[#111111]/40" />
                              {user.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-600 border border-green-200'}`}>
                          {user.role === 'admin' ? <ShieldAlert size={12} /> : <UserIcon size={12} />}
                          {user.role === 'admin' ? 'Admin' : 'Customer'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 text-sm text-[#111111]/60">
                          <Calendar size={14} className="text-[#111111]/40" />
                          {user.createdAt ? new Date(user.createdAt.seconds * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Unknown'}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
