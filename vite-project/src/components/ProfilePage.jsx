import { motion } from 'framer-motion';
import { LogOut, User, Mail, Phone, Calendar, ArrowLeft } from 'lucide-react';

export default function ProfilePage({ user, setView, handleLogout }) {
  if (!user) {
    setView('login');
    return null;
  }

  const joinDate = user.createdAt?.seconds 
    ? new Date(user.createdAt.seconds * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Recently Joined';

  return (
    <div className="min-h-screen bg-[#FAF9F6] pt-32 pb-20 px-6">
      <div className="max-w-[600px] mx-auto">
        
        {/* Back Button */}
        <button
          onClick={() => setView('customer-home')}
          className="flex items-center gap-2 text-[#111111]/40 hover:text-[#BCA58A] transition-colors cursor-pointer mb-12 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] tracking-[0.2em] uppercase font-semibold">Back to Home</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#111111]/5 relative overflow-hidden"
        >
          {/* Decorative background element */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#BCA58A]/10 to-transparent pointer-events-none" />

          {/* Header */}
          <div className="flex flex-col items-center mb-12 relative">
            <div className="w-24 h-24 rounded-full bg-[#111111]/5 flex items-center justify-center text-[#BCA58A] font-light text-4xl border-4 border-white shadow-sm mb-4">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <h1 className="text-3xl font-light text-[#111111] tracking-tight text-center" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {user.name || 'Anonymous User'}
            </h1>
            <span className="text-xs text-[#BCA58A] uppercase tracking-[0.2em] font-semibold mt-2 px-3 py-1 bg-[#BCA58A]/10 rounded-full">
              {user.role === 'admin' ? 'Administrator' : 'Customer'}
            </span>
          </div>

          {/* Details Grid */}
          <div className="space-y-6 mb-12">
            <div className="flex items-center p-4 rounded-xl bg-[#FAF9F6] border border-[#111111]/5">
              <Mail className="w-5 h-5 text-[#BCA58A] mr-4" />
              <div>
                <div className="text-[10px] text-[#111111]/40 uppercase tracking-wider font-semibold mb-1">Email Address</div>
                <div className="text-sm text-[#111111]">{user.email}</div>
              </div>
            </div>

            {user.phone && (
              <div className="flex items-center p-4 rounded-xl bg-[#FAF9F6] border border-[#111111]/5">
                <Phone className="w-5 h-5 text-[#BCA58A] mr-4" />
                <div>
                  <div className="text-[10px] text-[#111111]/40 uppercase tracking-wider font-semibold mb-1">Phone Number</div>
                  <div className="text-sm text-[#111111]">{user.phone}</div>
                </div>
              </div>
            )}

            <div className="flex items-center p-4 rounded-xl bg-[#FAF9F6] border border-[#111111]/5">
              <Calendar className="w-5 h-5 text-[#BCA58A] mr-4" />
              <div>
                <div className="text-[10px] text-[#111111]/40 uppercase tracking-wider font-semibold mb-1">Member Since</div>
                <div className="text-sm text-[#111111]">{joinDate}</div>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full py-4 border-2 border-[#111111]/10 text-[#111111]/60 rounded-xl flex items-center justify-center gap-2 hover:border-[#111111] hover:text-[#111111] hover:bg-[#111111]/5 transition-all duration-300 font-medium text-sm cursor-pointer"
          >
            <LogOut size={16} />
            Log Out Securely
          </button>
        </motion.div>
      </div>
    </div>
  );
}
