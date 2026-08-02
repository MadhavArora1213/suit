import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, ShoppingBag, Image, Star,
  Settings, LogOut, ChevronRight, Sparkles, Layers,
  Film, Megaphone, FolderOpen, ChevronLeft, Menu, Tag, MessageSquare, Users, Store, Grid
} from 'lucide-react';

const navItems = [
  { id: 'dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
  { id: 'products',     label: 'Products',     icon: Package },
  { id: 'festive-items',label: 'Festive Items (Churi/Rakhi)', icon: Sparkles },
  { id: 'orders',       label: 'Orders',       icon: ShoppingBag },
  { id: 'users',        label: 'Users',        icon: Users },
  { id: 'boutiques',    label: 'Shops & Boutiques',    icon: Store },
  { id: 'collections',  label: 'Collections',  icon: Grid },
  { id: 'collection-tags', label: 'Collection Tags', icon: Tag },
  { id: 'categories',   label: 'Categories',   icon: FolderOpen },
  { id: 'support',      label: 'Support Tickets', icon: MessageSquare },
  { id: 'settings',     label: 'Settings',     icon: Settings },
];

const PURPLE = '#111111';
const PURPLE_DARK = '#111111';
const PURPLE_DEEP = '#002830';

export default function AdminLayout({ children, activePage, setActivePage, onLogout }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeItem = navItems.find(n => n.id === activePage);

  return (
    <div className="min-h-screen bg-[#F6F3F8] flex" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden" />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 76 : 256 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 h-full z-50 flex flex-col overflow-hidden shadow-[4px_0_24px_rgba(17,17,17,0.15)]
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
        style={{ background: `linear-gradient(180deg, ${PURPLE} 0%, ${PURPLE_DARK} 55%, ${PURPLE_DEEP} 100%)`, minWidth: collapsed ? 76 : 256 }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10 min-h-[72px]">
          <div className="w-9 h-9 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 border border-white/20">
            <Sparkles size={18} className="text-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}
                className="overflow-hidden flex-1">
                <p className="text-[13px] font-bold text-white leading-tight">Gurnaaz Admin</p>
                <p className="text-xs text-white/50 tracking-widest uppercase">Control Panel</p>
              </motion.div>
            )}
          </AnimatePresence>
          <button onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex w-7 h-7 rounded-lg items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0">
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 px-2.5 overflow-y-auto space-y-0.5">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <motion.button key={item.id}
                onClick={() => { 
                  window.history.pushState(null, '', '/admin/' + item.id);
                  setActivePage(item.id); 
                  setMobileOpen(false); 
                }}
                whileHover={{ x: collapsed ? 0 : 2 }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-200 group relative
                  ${isActive ? 'bg-white/20 text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'}`}>
                {isActive && (
                  <motion.div layoutId="sidebarActive"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 bg-white rounded-r-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }} />
                )}
                <Icon size={20} className="flex-shrink-0" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }} transition={{ duration: 0.2 }}
                      className="text-sm font-medium whitespace-nowrap overflow-hidden">
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isActive && !collapsed && <ChevronRight size={12} className="ml-auto opacity-70" />}
                {/* Tooltip */}
                {collapsed && (
                  <div className="absolute left-full ml-3 bg-[#002830] text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl border border-white/10">
                    {item.label}
                  </div>
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="p-3 border-t border-white/10 space-y-1">
          {!collapsed && (
            <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/10 mb-2">
              <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">G</div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">Admin User</p>
                <p className="text-xs text-white/50 truncate">madhavarora132005@gmail.com</p>
              </div>
            </div>
          )}
          <button onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-colors group">
            <LogOut size={16} className="flex-shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="text-sm font-medium">Logout</motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 lg:ml-[var(--sidebar-w)]"
        style={{ '--sidebar-w': collapsed ? '76px' : '256px' }}>
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-[#E8DDD0]/60 px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3 sm:gap-4 shadow-sm">
          <button onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-xl hover:bg-[#E8DDD0] transition-colors" style={{ color: '#111111' }}>
            <Menu size={20} />
          </button>
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-semibold text-[#1A1A1A] truncate" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {activeItem?.label || 'Dashboard'}
            </h2>
            <p className="text-[10px] sm:text-xs tracking-wider uppercase hidden sm:block" style={{ color: '#111111', opacity: 0.7 }}>
              Gurnaaz Ethnic Wear · Admin
            </p>
          </div>
          {/* Breadcrumb dot */}
          <div className="ml-4 hidden md:flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#111111' }} />
            <span className="text-xs text-[#9E9189] font-medium">{activeItem?.label}</span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2.5 rounded-xl px-4 py-2 border border-[#E8DDD0]" style={{ background: '#FAF9F6' }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                style={{ background: 'linear-gradient(135deg, #111111, #111111)' }}>G</div>
              <div>
                <p className="text-xs font-semibold text-[#1A1A1A]">Admin</p>
                <p className="text-xs text-[#9E9189]">Super Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div key={activePage}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}>
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
