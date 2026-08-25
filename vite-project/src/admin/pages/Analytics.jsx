import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye, Clock, ShoppingCart, CreditCard, TrendingUp, Users,
  BarChart3, CheckCircle2, XCircle, RefreshCw, Search,
  Activity, Zap, Target, Percent, MapPin, ArrowRight,
  ChevronDown, ChevronRight, AlertTriangle, Route, MousePointerClick, Minus
} from 'lucide-react';
import { fetchAnalyticsFromFirestore, getStoredEvents, getSessionJourneysFromStorage } from '../../utils/analytics';

const P = '#111111';

function StatCard({ icon: Icon, label, value, sub, color = P }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-[#E8DDD0]/60 p-5 flex items-start gap-4 shadow-sm">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}12` }}>
        <Icon size={20} style={{ color }} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-widest font-bold" style={{ color: '#9E9189' }}>{label}</p>
        <p className="text-2xl font-bold mt-0.5" style={{ fontFamily: "'Cormorant Garamond', serif", color: P }}>{value}</p>
        {sub && <p className="text-[10px] mt-0.5" style={{ color: '#9E9189' }}>{sub}</p>}
      </div>
    </motion.div>
  );
}

function FunnelBar({ label, count, total, color, badge }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-medium w-32 text-right shrink-0" style={{ color: '#6B6B6B' }}>{label}</span>
      <div className="flex-1 h-8 bg-[#F6F3F8] rounded-lg overflow-hidden relative">
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-lg flex items-center justify-end px-3" style={{ background: color }}>
          <span className="text-[10px] font-bold text-white">{count}</span>
        </motion.div>
      </div>
      <span className="text-xs font-bold w-12 text-right" style={{ color: P }}>{pct}%</span>
      {badge && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: badge.bg, color: badge.text }}>{badge.label}</span>}
    </div>
  );
}

const typeColors = {
  page_view: { bg: '#EFF6FF', text: '#3B82F6' }, time_on_page: { bg: '#F0FDF4', text: '#10B981' },
  scroll_depth: { bg: '#FFF7ED', text: '#F59E0B' }, scroll_milestone: { bg: '#FFF7ED', text: '#D97706' },
  add_to_cart: { bg: '#FDF2F8', text: '#EC4899' }, cart_view: { bg: '#F5F3FF', text: '#8B5CF6' },
  cart_item_remove: { bg: '#FEF2F2', text: '#EF4444' }, cart_item_qty_change: { bg: '#FEF3C7', text: '#D97706' },
  checkout_click: { bg: '#ECFDF5', text: '#059669' },
  checkout_start: { bg: '#ECFDF5', text: '#10B981' }, checkout_step: { bg: '#EFF6FF', text: '#3B82F6' },
  checkout_abandon: { bg: '#FEF2F2', text: '#EF4444' },
  form_focus: { bg: '#F0FDFA', text: '#14B8A6' }, form_fill: { bg: '#FFFBEB', text: '#D97706' },
  form_blur: { bg: '#F9FAFB', text: '#9CA3AF' }, form_submit: { bg: '#EFF6FF', text: '#3B82F6' },
  payment_attempt: { bg: '#F0FDF4', text: '#059669' }, payment_success: { bg: '#F0FDF4', text: '#10B981' },
  payment_fail: { bg: '#FEF2F2', text: '#EF4444' }, payment_abandon: { bg: '#FEF2F2', text: '#DC2626' },
  product_click: { bg: '#FDF2F8', text: '#EC4899' }, product_interaction: { bg: '#FDF2F8', text: '#DB2777' },
  wishlist_toggle: { bg: '#FFF1F2', text: '#F43F5E' }, back_navigation: { bg: '#FFF7ED', text: '#EA580C' },
  session_end: { bg: '#F3F4F6', text: '#6B7280' }, search: { bg: '#EFF6FF', text: '#2563EB' },
};

function EventRow({ event }) {
  const time = new Date(event.timestamp).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  const c = typeColors[event.type] || { bg: '#F3F4F6', text: '#6B7280' };

  const detail = [];
  if (event.productName) detail.push(event.productName);
  if (event.seconds !== undefined) detail.push(`${event.seconds}s`);
  if (event.maxScrollDepth !== undefined) detail.push(`max scroll ${event.maxScrollDepth}%`);
  if (event.depth !== undefined) detail.push(`${event.depth}% scroll`);
  if (event.milestone) detail.push(`milestone ${event.milestone}%`);
  if (event.amount) detail.push(`₹${event.amount}`);
  if (event.step) detail.push(`step ${event.step}`);
  if (event.field) detail.push(`field: ${event.field}`);
  if (event.method) detail.push(event.method);
  if (event.reason) detail.push(event.reason);
  if (event.fromPage && event.toPage) detail.push(`${event.fromPage} → ${event.toPage}`);
  if (event.lastStep) detail.push(`last step: ${event.lastStep}`);
  if (event.oldQty !== undefined && event.newQty !== undefined) detail.push(`${event.oldQty} → ${event.newQty}`);
  if (event.action) detail.push(event.action);

  return (
    <div className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-[#FAF9F6] transition-colors text-xs border-b border-[#E8DDD0]/30 last:border-0">
      <span className="px-2 py-0.5 rounded-full font-bold text-[9px] uppercase tracking-wider whitespace-nowrap" style={{ background: c.bg, color: c.text }}>
        {event.type?.replace(/_/g, ' ')}
      </span>
      <span className="text-[#6B6B6B] flex-1 truncate">
        {event.url || event.page || '—'}
        {detail.length > 0 && <span className="text-[#1A0008] font-medium"> · {detail.join(' · ')}</span>}
      </span>
      <span className="text-[#9E9189] whitespace-nowrap">{time}</span>
    </div>
  );
}

function SessionRow({ session, isExpanded, onToggle }) {
  const startTime = session.startTime ? new Date(session.startTime).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—';
  const dur = session.duration ? Math.round(session.duration / 1000) : 0;
  const durStr = dur > 60 ? `${Math.floor(dur / 60)}m ${dur % 60}s` : `${dur}s`;
  const status = session.hasPaymentSuccess ? 'Converted' : session.hasCheckout ? 'Checkout Abandoned' : session.hasAddToCart ? 'Cart Abandoned' : 'Browsing';

  const statusStyle = {
    'Converted': { bg: '#F0FDF4', text: '#10B981' },
    'Checkout Abandoned': { bg: '#FEF2F2', text: '#EF4444' },
    'Cart Abandoned': { bg: '#FFF7ED', text: '#F59E0B' },
    'Browsing': { bg: '#F6F3F8', text: '#9E9189' },
  }[status] || { bg: '#F3F4F6', text: '#6B7280' };

  return (
    <div className="border-b border-[#E8DDD0]/30 last:border-0">
      <button onClick={onToggle} className="w-full flex items-center gap-3 py-3 px-3 hover:bg-[#FAF9F6] transition-colors text-left">
        <span className="text-[#9E9189]">{isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</span>
        <span className="text-[10px] font-mono font-bold w-20 truncate" style={{ color: P }}>{session.sessionId?.slice(0, 12)}...</span>
        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold" style={{ background: statusStyle.bg, color: statusStyle.text }}>{status}</span>
        <span className="text-[10px] flex-1" style={{ color: '#9E9189' }}>{startTime}</span>
        <span className="text-[10px] font-medium" style={{ color: P }}>{session.eventCount} events</span>
        <span className="text-[10px]" style={{ color: '#9E9189' }}>{durStr}</span>
        <span className="text-[10px] font-medium" style={{ color: P }}>{session.pages?.length || 0} pages</span>
      </button>
      <AnimatePresence>
        {isExpanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-[#FAF9F6] border-t border-[#E8DDD0]/30">
            <div className="p-4 space-y-3">
              <div className="flex flex-wrap gap-1.5 mb-3">
                {session.pages?.map((page, i) => (
                  <span key={i} className="text-[9px] px-2 py-0.5 rounded-full bg-white border border-[#E8DDD0]/60 font-medium" style={{ color: P }}>
                    {page}
                  </span>
                ))}
              </div>
              <div className="max-h-[250px] overflow-y-auto space-y-1">
                {session.events?.map((event, i) => (
                  <div key={i} className="flex items-center gap-2 text-[10px] py-1.5 px-2 rounded-lg">
                    <span className="px-1.5 py-0.5 rounded-full font-bold text-[8px] uppercase whitespace-nowrap"
                      style={{ background: (typeColors[event.type] || { bg: '#F3F4F6' }).bg, color: (typeColors[event.type] || { text: '#6B7280' }).text }}>
                      {event.type?.replace(/_/g, ' ')}
                    </span>
                    <span style={{ color: P }}>{event.url || event.page || '—'}</span>
                    {event.productName && <span style={{ color: '#9E9189' }}>· {event.productName}</span>}
                    {event.field && <span style={{ color: '#9E9189' }}>· {event.field}</span>}
                    {event.seconds !== undefined && <span style={{ color: '#9E9189' }}>· {event.seconds}s</span>}
                    {event.step && <span style={{ color: '#9E9189' }}>· step {event.step}</span>}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Analytics() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('7d');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedSession, setExpandedSession] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const days = timeFilter === '24h' ? 1 : timeFilter === '7d' ? 7 : timeFilter === '30d' ? 30 : 90;
      const firestoreEvents = await fetchAnalyticsFromFirestore({ days, maxResults: 2000 });
      setEvents(firestoreEvents.length > 0 ? firestoreEvents : getStoredEvents());
    } catch (e) {
      setEvents(getStoredEvents());
    }
    setLoading(false);
  };

  useEffect(() => { loadData(); }, [timeFilter]);

  const filteredEvents = useMemo(() => {
    let result = [...events];
    if (typeFilter !== 'all') result = result.filter(e => e.type === typeFilter);
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(e =>
        (e.url || '').toLowerCase().includes(term) || (e.page || '').toLowerCase().includes(term) ||
        (e.productName || '').toLowerCase().includes(term) || (e.type || '').toLowerCase().includes(term)
      );
    }
    return result.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  }, [events, typeFilter, searchTerm]);

  const sessions = useMemo(() => getSessionJourneysFromStorage(), [events]);

  const stats = useMemo(() => {
    const pageViews = events.filter(e => e.type === 'page_view');
    const timeEvents = events.filter(e => e.type === 'time_on_page');
    const scrollEvents = events.filter(e => e.type === 'scroll_depth');
    const addCartEvents = events.filter(e => e.type === 'add_to_cart');
    const cartViews = events.filter(e => e.type === 'cart_view');
    const cartRemoves = events.filter(e => e.type === 'cart_item_remove');
    const cartQtyChanges = events.filter(e => e.type === 'cart_item_qty_change');
    const checkoutClicks = events.filter(e => e.type === 'checkout_click');
    const checkoutStarts = events.filter(e => e.type === 'checkout_start');
    const checkoutSteps = events.filter(e => e.type === 'checkout_step');
    const checkoutAbandons = events.filter(e => e.type === 'checkout_abandon');
    const paymentAttempts = events.filter(e => e.type === 'payment_attempt');
    const paymentSuccesses = events.filter(e => e.type === 'payment_success');
    const paymentFails = events.filter(e => e.type === 'payment_fail');
    const paymentAbandons = events.filter(e => e.type === 'payment_abandon');
    const formFills = events.filter(e => e.type === 'form_fill');
    const formFocuses = events.filter(e => e.type === 'form_focus');
    const formSubmits = events.filter(e => e.type === 'form_submit');
    const productClicks = events.filter(e => e.type === 'product_click');
    const productInteractions = events.filter(e => e.type === 'product_interaction');
    const backNavs = events.filter(e => e.type === 'back_navigation');
    const scrollMilestones = events.filter(e => e.type === 'scroll_milestone');
    const sessionEnds = events.filter(e => e.type === 'session_end');

    const uniqueVisitors = new Set(events.map(e => e.visitorId).filter(Boolean)).size;
    const uniqueSessions = new Set(events.map(e => e.sessionId).filter(Boolean)).size;
    const avgTime = timeEvents.length > 0 ? Math.round(timeEvents.reduce((s, e) => s + (e.seconds || 0), 0) / timeEvents.length) : 0;
    const avgScroll = scrollEvents.length > 0 ? Math.round(scrollEvents.reduce((s, e) => s + (e.depth || 0), 0) / scrollEvents.length) : 0;

    const pageViewsByPage = {};
    pageViews.forEach(e => { const p = e.page || e.url || 'unknown'; pageViewsByPage[p] = (pageViewsByPage[p] || 0) + 1; });

    const timeByPage = {};
    timeEvents.forEach(e => { const p = e.page || e.url || 'unknown'; if (!timeByPage[p]) timeByPage[p] = []; timeByPage[p].push(e.seconds || 0); });
    const avgTimeByPage = Object.entries(timeByPage).map(([page, times]) => ({ page, avg: Math.round(times.reduce((s, t) => s + t, 0) / times.length), count: times.length })).sort((a, b) => b.avg - a.avg);

    const scrollByPage = {};
    scrollEvents.forEach(e => { const p = e.page || e.url || 'unknown'; if (!scrollByPage[p]) scrollByPage[p] = []; scrollByPage[p].push(e.depth || 0); });
    const avgScrollByPage = Object.entries(scrollByPage).map(([page, depths]) => ({ page, avg: Math.round(depths.reduce((s, d) => s + d, 0) / depths.length) })).sort((a, b) => b.avg - a.avg);

    const productClickCounts = {};
    productClicks.forEach(e => { if (e.productId) { if (!productClickCounts[e.productId]) productClickCounts[e.productId] = { name: e.productName || e.productId, clicks: 0, addToCarts: 0 }; productClickCounts[e.productId].clicks++; } });
    addCartEvents.forEach(e => { if (e.productId && productClickCounts[e.productId]) productClickCounts[e.productId].addToCarts++; });
    const topProducts = Object.values(productClickCounts).sort((a, b) => b.clicks - a.clicks).slice(0, 10);

    const funnel = {
      pageViews: pageViews.length, productClicks: productClicks.length, addToCarts: addCartEvents.length,
      cartViews: cartViews.length, checkoutClicks: checkoutClicks.length, checkoutStarts: checkoutStarts.length,
      reachedPayment: checkoutSteps.filter(e => e.step === 2).length,
      paymentAttempts: paymentAttempts.length, paymentSuccesses: paymentSuccesses.length,
      paymentFails: paymentFails.length, checkoutAbandons: checkoutAbandons.length + paymentAbandons.length,
    };

    const fieldCounts = {};
    formFills.forEach(e => { if (e.field) fieldCounts[e.field] = (fieldCounts[e.field] || 0) + 1; });

    const fieldFocusCounts = {};
    formFocuses.forEach(e => { if (e.field) fieldFocusCounts[e.field] = (fieldFocusCounts[e.field] || 0) + 1; });

    const paymentSuccessRate = paymentAttempts.length > 0 ? Math.round((paymentSuccesses.length / paymentAttempts.length) * 100) : 0;

    const now = Date.now();
    const dailyEvents = {};
    for (let i = 6; i >= 0; i--) { const d = new Date(now - i * 24 * 60 * 60 * 1000); const key = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }); dailyEvents[key] = 0; }
    events.forEach(e => { if (e.timestamp) { const d = new Date(e.timestamp); const key = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }); if (key in dailyEvents) dailyEvents[key]++; } });

    // Back navigation stats
    const backNavPages = {};
    backNavs.forEach(e => { const from = e.fromPage || 'unknown'; backNavPages[from] = (backNavPages[from] || 0) + 1; });

    // Scroll milestones
    const milestoneCounts = { 25: 0, 50: 0, 75: 0, 100: 0 };
    scrollMilestones.forEach(e => { if (e.milestone in milestoneCounts) milestoneCounts[e.milestone]++; });

    return {
      uniqueVisitors, uniqueSessions, totalPageViews: pageViews.length,
      avgTime, avgScroll, totalAddToCarts: addCartEvents.length,
      totalCheckouts: checkoutStarts.length, totalPayments: paymentSuccesses.length,
      paymentSuccessRate, pageViewsByPage, avgTimeByPage, avgScrollByPage,
      topProducts, funnel, fieldCounts, fieldFocusCounts, dailyEvents,
      paymentFails: paymentFails.length, cartRemoves: cartRemoves.length,
      cartQtyChanges: cartQtyChanges.length, checkoutAbandons: checkoutAbandons.length + paymentAbandons.length,
      backNavs: backNavs.length, backNavPages, milestoneCounts,
      totalFormFills: formFills.length, totalFormSubmits: formSubmits.length,
    };
  }, [events]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'funnel', label: 'Checkout Funnel', icon: Target },
    { id: 'journeys', label: 'Session Journeys', icon: Route },
    { id: 'events', label: 'Event Log', icon: Zap },
  ];

  const eventTypes = [
    { value: 'all', label: 'All Events' },
    ...Object.entries(typeColors).map(([value]) => ({ value, label: value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) })),
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Cormorant Garamond', serif", color: P }}>User Behavior Analytics</h1>
          <p className="text-xs mt-1" style={{ color: '#9E9189' }}>Every click, scroll, form fill, payment — fully tracked</p>
        </div>
        <button onClick={loadData} disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E8DDD0] rounded-xl text-xs font-bold hover:bg-[#FAF9F6] transition-colors"
          style={{ color: P }}>
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* Tab Bar */}
      <div className="flex bg-white border border-[#E8DDD0]/60 rounded-xl overflow-hidden">
        {tabs.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-colors ${activeTab === t.id ? 'text-white' : 'hover:bg-[#FAF9F6]'}`}
              style={activeTab === t.id ? { background: P } : { color: '#6B6B6B' }}>
              <Icon size={14} /> {t.label}
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex bg-white border border-[#E8DDD0]/60 rounded-xl overflow-hidden">
          {['24h', '7d', '30d', '90d'].map(f => (
            <button key={f} onClick={() => setTimeFilter(f)}
              className={`px-4 py-2 text-[11px] font-bold uppercase tracking-wider transition-colors ${timeFilter === f ? 'text-white' : 'hover:bg-[#FAF9F6]'}`}
              style={timeFilter === f ? { background: P } : { color: '#6B6B6B' }}>{f}</button>
          ))}
        </div>
        {(activeTab === 'events') && (
          <>
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
              className="px-4 py-2 bg-white border border-[#E8DDD0]/60 rounded-xl text-xs font-medium cursor-pointer" style={{ color: P }}>
              {eventTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#9E9189' }} />
              <input type="text" placeholder="Search events..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-[#E8DDD0]/60 rounded-xl text-xs" style={{ color: P }} />
            </div>
          </>
        )}
      </div>

      {/* ═══ OVERVIEW TAB ═══ */}
      {activeTab === 'overview' && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={Users} label="Unique Visitors" value={stats.uniqueVisitors} sub={`${stats.uniqueSessions} sessions`} />
            <StatCard icon={Eye} label="Page Views" value={stats.totalPageViews} sub={`${Object.keys(stats.pageViewsByPage).length} pages`} color="#3B82F6" />
            <StatCard icon={Clock} label="Avg Time" value={`${stats.avgTime}s`} sub={`Avg scroll: ${stats.avgScroll}%`} color="#F59E0B" />
            <StatCard icon={ShoppingCart} label="Add to Carts" value={stats.totalAddToCarts} sub={`${stats.cartRemoves} removed, ${stats.cartQtyChanges} qty changes`} color="#10B981" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={Target} label="Checkouts" value={stats.totalCheckouts} sub={`${stats.checkoutAbandons} abandoned`} color="#EC4899" />
            <StatCard icon={CreditCard} label="Payments" value={stats.totalPayments} sub={`${stats.paymentSuccessRate}% success`} color="#059669" />
            <StatCard icon={AlertTriangle} label="Abandoned" value={stats.checkoutAbandons} sub="cart + checkout" color="#EF4444" />
            <StatCard icon={MousePointerClick} label="Form Fills" value={stats.totalFormFills} sub={`${stats.totalFormSubmits} submits`} color="#8B5CF6" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pages by Views */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-[#E8DDD0]/60 p-6 shadow-sm">
              <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: P }}><BarChart3 size={16} /> Pages by Views</h3>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {Object.entries(stats.pageViewsByPage).sort((a, b) => b[1] - a[1]).slice(0, 15).map(([page, count]) => {
                  const maxV = Math.max(...Object.values(stats.pageViewsByPage), 1);
                  return (
                    <div key={page} className="flex items-center gap-3">
                      <span className="text-[11px] font-medium flex-1 truncate" style={{ color: P }}>{page}</span>
                      <div className="w-24 h-2 bg-[#F6F3F8] rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${Math.round((count / maxV) * 100)}%` }} transition={{ duration: 0.6 }} className="h-full rounded-full" style={{ background: P }} />
                      </div>
                      <span className="text-[10px] font-bold w-8 text-right" style={{ color: P }}>{count}</span>
                    </div>
                  );
                })}
                {Object.keys(stats.pageViewsByPage).length === 0 && <p className="text-xs text-center py-6" style={{ color: '#9E9189' }}>No data yet.</p>}
              </div>
            </motion.div>

            {/* Top Products */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border border-[#E8DDD0]/60 p-6 shadow-sm">
              <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: P }}><TrendingUp size={16} /> Top Products</h3>
              <div className="space-y-3">
                {stats.topProducts.map((prod, i) => (
                  <div key={i} className="flex items-center gap-3 py-2 px-3 rounded-xl bg-[#FAF9F6]">
                    <span className="text-[10px] font-bold w-5 text-center rounded-full bg-white border border-[#E8DDD0] py-0.5" style={{ color: P }}>{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate" style={{ color: P }}>{prod.name}</p>
                      <p className="text-[10px]" style={{ color: '#9E9189' }}>{prod.clicks} clicks · {prod.addToCarts} carts</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: prod.addToCarts > 0 ? '#F0FDF4' : '#F6F3F8', color: prod.addToCarts > 0 ? '#10B981' : '#9E9189' }}>
                      {prod.clicks > 0 ? Math.round((prod.addToCarts / prod.clicks) * 100) : 0}% CTR
                    </span>
                  </div>
                ))}
                {stats.topProducts.length === 0 && <p className="text-xs text-center py-6" style={{ color: '#9E9189' }}>No product data yet.</p>}
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Time on Page */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="bg-white rounded-2xl border border-[#E8DDD0]/60 p-6 shadow-sm">
              <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: P }}><Clock size={16} /> Avg Time per Page</h3>
              <div className="space-y-2">
                {stats.avgTimeByPage.map(({ page, avg, count }) => (
                  <div key={page} className="flex items-center gap-3 text-xs">
                    <span className="flex-1 truncate font-medium" style={{ color: P }}>{page}</span>
                    <span style={{ color: '#9E9189' }}>{count}×</span>
                    <span className="font-bold px-2 py-0.5 rounded-full bg-[#FFF7ED]" style={{ color: '#F59E0B' }}>{avg}s</span>
                  </div>
                ))}
                {stats.avgTimeByPage.length === 0 && <p className="text-xs text-center py-6" style={{ color: '#9E9189' }}>No data.</p>}
              </div>
            </motion.div>

            {/* Scroll Depth */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl border border-[#E8DDD0]/60 p-6 shadow-sm">
              <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: P }}><Percent size={16} /> Scroll Depth</h3>
              <div className="space-y-3">
                {stats.avgScrollByPage.map(({ page, avg }) => (
                  <div key={page}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium truncate flex-1" style={{ color: P }}>{page}</span>
                      <span className="font-bold" style={{ color: P }}>{avg}%</span>
                    </div>
                    <div className="w-full h-2 bg-[#F6F3F8] rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${avg}%` }} transition={{ duration: 0.8 }}
                        className="h-full rounded-full" style={{ background: avg > 75 ? '#10B981' : avg > 50 ? '#F59E0B' : '#EF4444' }} />
                    </div>
                  </div>
                ))}
                {stats.avgScrollByPage.length === 0 && <p className="text-xs text-center py-6" style={{ color: '#9E9189' }}>No data.</p>}
              </div>
            </motion.div>
          </div>

          {/* Back Nav & Scroll Milestones & Daily Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              className="bg-white rounded-2xl border border-[#E8DDD0]/60 p-6 shadow-sm">
              <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: P }}><ArrowRight size={16} className="rotate-180" /> Back Navigations</h3>
              {Object.keys(stats.backNavPages).length > 0 ? (
                <div className="space-y-2">
                  {Object.entries(stats.backNavPages).sort((a, b) => b[1] - a[1]).map(([page, count]) => (
                    <div key={page} className="flex items-center justify-between text-xs">
                      <span className="font-medium truncate flex-1" style={{ color: P }}>{page}</span>
                      <span className="font-bold px-2 py-0.5 rounded-full bg-[#FFF7ED]" style={{ color: '#EA580C' }}>{count}×</span>
                    </div>
                  ))}
                </div>
              ) : <p className="text-xs text-center py-6" style={{ color: '#9E9189' }}>No back navigations tracked.</p>}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl border border-[#E8DDD0]/60 p-6 shadow-sm">
              <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: P }}><Percent size={16} /> Scroll Milestones</h3>
              <div className="space-y-3">
                {[25, 50, 75, 100].map(m => (
                  <div key={m} className="flex items-center gap-3">
                    <span className="text-xs font-medium w-16 text-right" style={{ color: '#6B6B6B' }}>{m}%</span>
                    <div className="flex-1 h-5 bg-[#F6F3F8] rounded-lg overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${stats.totalPageViews > 0 ? Math.round((stats.milestoneCounts[m] / stats.totalPageViews) * 100) : 0}%` }}
                        transition={{ duration: 0.6 }} className="h-full rounded-lg" style={{ background: m === 100 ? '#10B981' : m === 75 ? '#3B82F6' : m === 50 ? '#F59E0B' : '#9E9189' }} />
                    </div>
                    <span className="text-[10px] font-bold w-8" style={{ color: P }}>{stats.milestoneCounts[m]}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
              className="bg-white rounded-2xl border border-[#E8DDD0]/60 p-6 shadow-sm">
              <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: P }}><Activity size={16} /> Events (7 Days)</h3>
              <div className="flex items-end gap-2 h-28">
                {Object.entries(stats.dailyEvents).map(([day, count], i) => {
                  const maxVal = Math.max(...Object.values(stats.dailyEvents), 1);
                  const h = Math.max((count / maxVal) * 100, 4);
                  return (
                    <div key={day} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[8px] font-bold" style={{ color: P }}>{count || ''}</span>
                      <motion.div initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: 0.3 + i * 0.05, duration: 0.5 }}
                        className="w-full rounded-t-md" style={{ background: `linear-gradient(180deg, ${P} 0%, ${P}99 100%)`, minHeight: 4 }} />
                      <span className="text-[8px]" style={{ color: '#9E9189' }}>{day.split(' ')[0]}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </>
      )}

      {/* ═══ FUNNEL TAB ═══ */}
      {activeTab === 'funnel' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-[#E8DDD0]/60 p-6 shadow-sm">
            <h3 className="text-sm font-bold mb-5 flex items-center gap-2" style={{ color: P }}><Target size={16} /> Full Funnel</h3>
            <div className="space-y-3">
              <FunnelBar label="Page Views" count={stats.funnel.pageViews} total={stats.funnel.pageViews} color="#3B82F6" />
              <FunnelBar label="Product Clicks" count={stats.funnel.productClicks} total={stats.funnel.pageViews} color="#8B5CF6" />
              <FunnelBar label="Add to Cart" count={stats.funnel.addToCarts} total={stats.funnel.pageViews} color="#EC4899" />
              <FunnelBar label="Cart Views" count={stats.funnel.cartViews} total={stats.funnel.pageViews} color="#A855F7" />
              <FunnelBar label="Checkout Click" count={stats.funnel.checkoutClicks} total={stats.funnel.pageViews} color="#F59E0B" />
              <FunnelBar label="Checkout Start" count={stats.funnel.checkoutStarts} total={stats.funnel.pageViews} color="#10B981" />
              <FunnelBar label="Reached Payment" count={stats.funnel.reachedPayment} total={stats.funnel.pageViews} color="#0EA5E9" />
              <FunnelBar label="Payment Attempted" count={stats.funnel.paymentAttempts} total={stats.funnel.pageViews} color="#059669" />
              <FunnelBar label="Payment Success" count={stats.funnel.paymentSuccesses} total={stats.funnel.pageViews} color="#047857"
                badge={{ bg: '#F0FDF4', text: '#10B981', label: `${stats.paymentSuccessRate}%` }} />
              <FunnelBar label="Payment Failed" count={stats.funnel.paymentFails} total={stats.funnel.pageViews || 1} color="#EF4444" />
              <FunnelBar label="Abandoned" count={stats.funnel.checkoutAbandons} total={stats.funnel.pageViews || 1} color="#DC2626"
                badge={{ bg: '#FEF2F2', text: '#EF4444', label: 'drop-off' }} />
            </div>
          </motion.div>

          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border border-[#E8DDD0]/60 p-6 shadow-sm">
              <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: P }}><CreditCard size={16} /> Payment</h3>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-4 rounded-xl bg-[#F0FDF4]">
                  <CheckCircle2 size={20} className="mx-auto mb-1" style={{ color: '#10B981' }} />
                  <p className="text-xl font-bold" style={{ fontFamily: "'Cormorant Garamond', serif", color: P }}>{stats.paymentSuccessRate}%</p>
                  <p className="text-[9px] uppercase font-bold" style={{ color: '#9E9189' }}>Success</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-[#FEF2F2]">
                  <XCircle size={20} className="mx-auto mb-1" style={{ color: '#EF4444' }} />
                  <p className="text-xl font-bold" style={{ fontFamily: "'Cormorant Garamond', serif", color: P }}>{stats.paymentFails}</p>
                  <p className="text-[9px] uppercase font-bold" style={{ color: '#9E9189' }}>Failed</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-[#FFF7ED]">
                  <AlertTriangle size={20} className="mx-auto mb-1" style={{ color: '#F59E0B' }} />
                  <p className="text-xl font-bold" style={{ fontFamily: "'Cormorant Garamond', serif", color: P }}>{stats.checkoutAbandons}</p>
                  <p className="text-[9px] uppercase font-bold" style={{ color: '#9E9189' }}>Abandoned</p>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="bg-white rounded-2xl border border-[#E8DDD0]/60 p-6 shadow-sm">
              <h3 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: P }}><MousePointerClick size={16} /> Form Fields</h3>
              <div className="space-y-2">
                {['name', 'phone', 'email', 'address', 'city', 'state', 'zip'].map(field => (
                  <div key={field} className="flex items-center gap-3 text-xs">
                    <span className="w-16 text-right font-medium" style={{ color: P }}>{field}</span>
                    <div className="flex-1 h-3 bg-[#F6F3F8] rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }}
                        animate={{ width: `${Math.max((stats.fieldCounts[field] || 0) / Math.max(stats.totalFormFills || 1, 1) * 100, 0)}%` }}
                        transition={{ duration: 0.6 }} className="h-full rounded-full" style={{ background: '#F59E0B' }} />
                    </div>
                    <span className="text-[10px] font-bold w-10 text-right" style={{ color: P }}>{stats.fieldCounts[field] || 0}×</span>
                  </div>
                ))}
              </div>
              <p className="text-[9px] mt-3" style={{ color: '#9E9189' }}>Tracks which fields users actually typed in during checkout</p>
            </motion.div>
          </div>
        </div>
      )}

      {/* ═══ SESSION JOURNEYS TAB ═══ */}
      {activeTab === 'journeys' && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-[#E8DDD0]/60 p-6 shadow-sm">
          <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: P }}><Route size={16} /> Session Journeys ({sessions.length})</h3>
          <p className="text-[10px] mb-4" style={{ color: '#9E9189' }}>Click any session to see the full user path — every page, click, scroll, form fill, and payment attempt</p>
          <div className="max-h-[500px] overflow-y-auto">
            {sessions.slice(0, 50).map((s, i) => (
              <SessionRow key={s.sessionId || i} session={s}
                isExpanded={expandedSession === s.sessionId}
                onToggle={() => setExpandedSession(expandedSession === s.sessionId ? null : s.sessionId)} />
            ))}
            {sessions.length === 0 && (
              <div className="text-center py-12">
                <Route size={32} className="mx-auto mb-3" style={{ color: '#E8DDD0' }} />
                <p className="text-xs" style={{ color: '#9E9189' }}>No session journeys recorded yet. Browse the site to start tracking.</p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* ═══ EVENT LOG TAB ═══ */}
      {activeTab === 'events' && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-[#E8DDD0]/60 p-6 shadow-sm">
          <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: P }}>
            <Zap size={16} /> Event Log <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-[#F6F3F8]" style={{ color: '#9E9189' }}>{filteredEvents.length} events</span>
          </h3>
          <div className="max-h-[500px] overflow-y-auto space-y-0">
            {filteredEvents.slice(0, 150).map((event, i) => <EventRow key={event.id || i} event={event} />)}
            {filteredEvents.length === 0 && (
              <div className="text-center py-12">
                <BarChart3 size={32} className="mx-auto mb-3" style={{ color: '#E8DDD0' }} />
                <p className="text-xs" style={{ color: '#9E9189' }}>No events found.</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
