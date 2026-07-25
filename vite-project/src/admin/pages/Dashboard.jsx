import { motion } from 'framer-motion';
import { Package, ShoppingBag, TrendingUp, Users, ArrowUpRight, ArrowRight, Star, Eye } from 'lucide-react';

const P = '#111111';
const PL = '#E8DDD0';

const stats = [
  { label: 'Total Products', value: '124', change: '+12', icon: Package, color: '#111111', bg: '#E8DDD0' },
  { label: 'Orders Today', value: '38', change: '+7', icon: ShoppingBag, color: '#10B981', bg: '#F0FDF8' },
  { label: 'Revenue (Month)', value: '₹2.4L', change: '+18%', icon: TrendingUp, color: '#6366F1', bg: '#F5F3FF' },
  { label: 'Active Customers', value: '892', change: '+34', icon: Users, color: '#F59E0B', bg: '#FFFBEB' },
];

const recentOrders = [
  { id: '#ORD-1042', customer: 'Priya Sharma', product: 'Banarasi Silk Suit', amount: '₹9,299', status: 'Delivered', date: 'Today, 2:30 PM' },
  { id: '#ORD-1041', customer: 'Anjali Mehta', product: 'Chikankari Suit Set', amount: '₹7,499', status: 'Shipped', date: 'Today, 11:10 AM' },
  { id: '#ORD-1040', customer: 'Ritu Verma', product: 'Anarkali Floral Suit', amount: '₹6,899', status: 'Processing', date: 'Yesterday' },
  { id: '#ORD-1039', customer: 'Sunita Joshi', product: 'Gota Patti Sharara', amount: '₹4,999', status: 'Pending', date: 'Yesterday' },
  { id: '#ORD-1038', customer: 'Deepa Gupta', product: 'Pakistani Straight Suit', amount: '₹4,799', status: 'Delivered', date: '2 days ago' },
];

const statusColors = {
  Delivered:  { bg: '#F0FDF8', text: '#10B981' },
  Shipped:    { bg: '#EFF6FF', text: '#3B82F6' },
  Processing: { bg: '#FFF7ED', text: '#F59E0B' },
  Pending:    { bg: '#FFF1F2', text: '#F43F5E' },
};

// ── Line Chart (Revenue 7 days) ──────────────────────────────
const revenueData = [18000, 24000, 19000, 32000, 27000, 41000, 38000];
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function LineChart() {
  const W = 460, H = 140, pad = { t: 10, b: 30, l: 10, r: 10 };
  const max = Math.max(...revenueData) * 1.15;
  const xs = revenueData.map((_, i) => pad.l + (i / (revenueData.length - 1)) * (W - pad.l - pad.r));
  const ys = revenueData.map(v => pad.t + (1 - v / max) * (H - pad.t - pad.b));

  const linePath = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x},${ys[i]}`).join(' ');
  const areaPath = `${linePath} L${xs[xs.length - 1]},${H - pad.b} L${xs[0]},${H - pad.b} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#111111" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#111111" stopOpacity="0.01" />
        </linearGradient>
      </defs>
      {/* Grid lines */}
      {[0.25, 0.5, 0.75, 1].map(t => (
        <line key={t} x1={pad.l} y1={pad.t + (1 - t) * (H - pad.t - pad.b)}
          x2={W - pad.r} y2={pad.t + (1 - t) * (H - pad.t - pad.b)}
          stroke="#E8DDD0" strokeWidth="1" />
      ))}
      {/* Area fill */}
      <path d={areaPath} fill="url(#lineGrad)" />
      {/* Line */}
      <motion.path d={linePath} fill="none" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: 'easeOut' }} />
      {/* Dots */}
      {xs.map((x, i) => (
        <motion.circle key={i} cx={x} cy={ys[i]} r="4" fill="white" stroke="#111111" strokeWidth="2.5"
          initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.9 + i * 0.08 }} />
      ))}
      {/* Day labels */}
      {xs.map((x, i) => (
        <text key={i} x={x} y={H - 6} textAnchor="middle" fontSize="9" fill="#9E9189">{days[i]}</text>
      ))}
    </svg>
  );
}

// ── Bar Chart (Orders 7 days) ────────────────────────────────
const orderData = [12, 19, 8, 24, 17, 31, 22];

function BarChart() {
  const W = 340, H = 130, pad = { t: 10, b: 28, l: 14, r: 14 };
  const max = Math.max(...orderData) * 1.2;
  const bw = (W - pad.l - pad.r) / orderData.length;
  const gap = bw * 0.3;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#111111" />
          <stop offset="100%" stopColor="#0A7A8C" />
        </linearGradient>
        <linearGradient id="barGradHover" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#BCA58A" />
          <stop offset="100%" stopColor="#111111" />
        </linearGradient>
      </defs>
      {[0.33, 0.66, 1].map(t => (
        <line key={t} x1={pad.l} y1={pad.t + (1 - t) * (H - pad.t - pad.b)}
          x2={W - pad.r} y2={pad.t + (1 - t) * (H - pad.t - pad.b)}
          stroke="#E8DDD0" strokeWidth="1" />
      ))}
      {orderData.map((v, i) => {
        const x = pad.l + i * bw + gap / 2;
        const barH = (v / max) * (H - pad.t - pad.b);
        const y = H - pad.b - barH;
        const isWeekend = i >= 5;
        return (
          <g key={i}>
            <motion.rect x={x} y={y} width={bw - gap} height={barH}
              rx="4" fill={isWeekend ? 'url(#barGradHover)' : 'url(#barGrad)'}
              initial={{ scaleY: 0, originY: 1 }} animate={{ scaleY: 1 }}
              style={{ transformOrigin: `${x}px ${H - pad.b}px` }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: 'backOut' }} />
            <text x={x + (bw - gap) / 2} y={H - 8} textAnchor="middle" fontSize="9" fill="#9E9189">{days[i]}</text>
            <motion.text x={x + (bw - gap) / 2} y={y - 4} textAnchor="middle" fontSize="9" fill="#111111" fontWeight="600"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 + i * 0.08 }}>{v}</motion.text>
          </g>
        );
      })}
    </svg>
  );
}

// ── Donut Chart (Categories) ──────────────────────────────────
const categoryData = [
  { label: 'Anarkali', value: 32, color: '#111111' },
  { label: 'Sharara', value: 24, color: '#0A7A8C' },
  { label: 'Banarasi', value: 18, color: '#BCA58A' },
  { label: 'Chikankari', value: 14, color: '#34A8B8' },
  { label: 'Others', value: 12, color: '#E5D5E7' },
];

function DonutChart() {
  const r = 52, cx = 80, cy = 75, stroke = 22;
  const circumference = 2 * Math.PI * r;
  let cumulative = 0;
  const total = categoryData.reduce((a, b) => a + b.value, 0);

  return (
    <div className="flex items-center gap-4">
      <svg width="160" height="150" viewBox="0 0 160 150">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#E8DDD0" strokeWidth={stroke} />
        {categoryData.map((d, i) => {
          const pct = d.value / total;
          const offset = circumference * (1 - pct);
          const rotation = -90 + (cumulative / total) * 360;
          cumulative += d.value;
          return (
            <motion.circle key={i} cx={cx} cy={cy} r={r} fill="none"
              stroke={d.color} strokeWidth={stroke}
              strokeDasharray={`${circumference * pct - 2} ${circumference * (1 - pct) + 2}`}
              strokeDashoffset={-circumference * (cumulative - d.value) / total + circumference * 0.25}
              style={{ transform: `rotate(${rotation}deg)`, transformOrigin: `${cx}px ${cy}px` }}
              strokeLinecap="butt"
              initial={{ strokeDasharray: `0 ${circumference}` }}
              animate={{ strokeDasharray: `${circumference * pct - 2} ${circumference * (1 - pct) + 2}` }}
              transition={{ delay: 0.3 + i * 0.15, duration: 0.7, ease: 'easeOut' }} />
          );
        })}
        <text x={cx} y={cy - 8} textAnchor="middle" fontSize="18" fontWeight="700" fill="#111111">{total}</text>
        <text x={cx} y={cy + 8} textAnchor="middle" fontSize="9" fill="#9E9189">Products</text>
      </svg>
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        {categoryData.map(d => (
          <div key={d.label} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
            <span className="text-xs text-[#6B6B6B] flex-1 truncate">{d.label}</span>
            <span className="text-xs font-bold text-[#1A1A1A]">{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Radial Progress (Satisfaction) ───────────────────────────
function RadialProgress({ value, label, color }) {
  const r = 28, cx = 36, cy = 36, circ = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#E8DDD0" strokeWidth="6" />
        <motion.circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="6"
          strokeLinecap="round" strokeDasharray={`${circ * value / 100} ${circ * (1 - value / 100)}`}
          strokeDashoffset={circ * 0.25}
          style={{ transform: 'rotate(-90deg)', transformOrigin: `${cx}px ${cy}px` }}
          initial={{ strokeDasharray: `0 ${circ}` }}
          animate={{ strokeDasharray: `${circ * value / 100} ${circ * (1 - value / 100)}` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }} />
        <text x={cx} y={cy + 5} textAnchor="middle" fontSize="12" fontWeight="700" fill={color}>{value}%</text>
      </svg>
      <p className="text-xs text-[#9E9189] text-center leading-tight">{label}</p>
    </div>
  );
}

export default function Dashboard({ setActivePage }) {
  return (
    <div className="space-y-5">
      {/* Welcome Banner */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-7 text-white relative overflow-hidden shadow-lg"
        style={{ background: 'linear-gradient(135deg, #111111 0%, #111111 60%, #002830 100%)' }}>
        <div className="absolute right-0 top-0 w-56 h-full opacity-10 pointer-events-none">
          <svg viewBox="0 0 200 200" className="w-full h-full"><circle cx="160" cy="60" r="100" fill="white" /><circle cx="40" cy="170" r="70" fill="white" /></svg>
        </div>
        <div className="absolute bottom-4 right-6 text-white/5 pointer-events-none select-none"
          style={{ fontSize: 80, fontFamily: "'Cormorant Garamond', serif", lineHeight: 1 }}>G</div>
        <div className="relative z-10">
          <p className="text-white/60 text-xs tracking-widest uppercase mb-1">Welcome back</p>
          <h1 className="text-2xl font-light mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Good Evening, Admin 👋</h1>
          <p className="text-white/70 text-sm mb-5">Here's what's happening with your store today.</p>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Today Revenue', val: '₹1.2L' },
              { label: 'New Orders', val: '38' },
              { label: 'Pending', val: '7' },
            ].map(({ label, val }) => (
              <div key={label} className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/10">
                <p className="text-white/60 text-xs uppercase tracking-wider">{label}</p>
                <p className="text-white font-bold text-lg">{val}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(17,17,17,0.12)' }}
              className="bg-white rounded-2xl p-5 border border-[#E8DDD0]/60 transition-all duration-300 cursor-default">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.bg }}>
                  <Icon size={20} style={{ color: s.color }} />
                </div>
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <ArrowUpRight size={11} />{s.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-[#1A1A1A] mb-0.5">{s.value}</p>
              <p className="text-xs text-[#9E9189]">{s.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue Line Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-white rounded-2xl border border-[#E8DDD0]/60 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-[#1A1A1A]">Revenue Trend</h3>
              <p className="text-xs text-[#9E9189]">Last 7 days · Total ₹1,99,000</p>
            </div>
            <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: '#E8DDD0', color: '#111111' }}>
              +18% vs last week
            </span>
          </div>
          <div className="h-36">
            <LineChart />
          </div>
        </motion.div>

        {/* Donut Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="bg-white rounded-2xl border border-[#E8DDD0]/60 p-5">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-[#1A1A1A]">Product Mix</h3>
            <p className="text-xs text-[#9E9189]">By suit category</p>
          </div>
          <DonutChart />
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Bar Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl border border-[#E8DDD0]/60 p-5">
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-[#1A1A1A]">Daily Orders</h3>
            <p className="text-xs text-[#9E9189]">This week · 133 total</p>
          </div>
          <div className="h-32">
            <BarChart />
          </div>
        </motion.div>

        {/* Satisfaction Radials */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
          className="bg-white rounded-2xl border border-[#E8DDD0]/60 p-5">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-[#1A1A1A]">Performance</h3>
            <p className="text-xs text-[#9E9189]">Key metrics at a glance</p>
          </div>
          <div className="flex justify-around">
            <RadialProgress value={94} label="Satisfaction" color="#111111" />
            <RadialProgress value={78} label="Delivery Rate" color="#10B981" />
            <RadialProgress value={86} label="Return Rate" color="#F59E0B" />
          </div>
        </motion.div>

        {/* Recent Orders */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl border border-[#E8DDD0]/60 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-[#E8DDD0]">
            <div>
              <h3 className="text-lg font-semibold text-[#1A1A1A]">Recent Orders</h3>
              <p className="text-xs text-[#9E9189]">Latest transactions</p>
            </div>
            <button onClick={() => setActivePage('orders')}
              className="flex items-center gap-1 text-xs font-semibold transition-colors"
              style={{ color: '#111111' }}>
              View all <ArrowRight size={13} />
            </button>
          </div>
          <div className="divide-y divide-[#FAF6FB]">
            {recentOrders.slice(0, 4).map((o, i) => {
              const sc = statusColors[o.status];
              return (
                <motion.div key={o.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 + i * 0.05 }}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-[#FAF9F6] transition-colors">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #111111, #0A7A8C)' }}>
                    {o.customer.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#1A1A1A] truncate">{o.customer}</p>
                    <p className="text-xs text-[#9E9189] truncate">{o.product}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-bold text-[#1A1A1A]">{o.amount}</p>
                    <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: sc.bg, color: sc.text }}>
                      {o.status}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
          <div className="p-4">
            <button onClick={() => setActivePage('add-product')}
              className="w-full py-2.5 rounded-xl text-xs font-semibold border-2 border-dashed transition-all"
              style={{ borderColor: 'rgba(17,17,17,0.3)', color: '#111111' }}
              onMouseEnter={e => { e.target.style.background = '#E8DDD0'; e.target.style.borderColor = '#111111'; }}
              onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.borderColor = 'rgba(17,17,17,0.3)'; }}>
              + Add New Product
            </button>
          </div>
        </motion.div>
      </div>

      {/* Top Products */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
        className="bg-white rounded-2xl border border-[#E8DDD0]/60 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-[#E8DDD0]">
          <div>
            <h3 className="text-lg font-semibold text-[#1A1A1A]">Top Selling Products</h3>
            <p className="text-xs text-[#9E9189]">This month by revenue</p>
          </div>
          <button onClick={() => setActivePage('products')}
            className="text-xs font-semibold flex items-center gap-1 transition-colors" style={{ color: '#111111' }}>
            View all <ArrowRight size={13} />
          </button>
        </div>
        <div className="p-5">
          <div className="space-y-4">
            {[
              { name: 'Banarasi Brocade Suit Set', sales: 48, revenue: '₹4.46L', pct: 90 },
              { name: 'Chikankari Handloom Suit Set', sales: 39, revenue: '₹2.92L', pct: 72 },
              { name: 'Royal Sharara Suit Set', sales: 31, revenue: '₹3.56L', pct: 58 },
              { name: 'Embroidered Silk Suit Set', sales: 27, revenue: '₹1.16L', pct: 48 },
            ].map((p, i) => (
              <motion.div key={p.name} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 + i * 0.07 }}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #111111, #0A7A8C)' }}>{i + 1}</span>
                    <span className="text-sm font-medium text-[#1A1A1A]">{p.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#9E9189]">{p.sales} sold</span>
                    <span className="text-sm font-bold" style={{ color: '#111111' }}>{p.revenue}</span>
                  </div>
                </div>
                <div className="h-2 bg-[#E8DDD0] rounded-full overflow-hidden">
                  <motion.div className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, #111111, #0A7A8C)' }}
                    initial={{ width: 0 }} animate={{ width: `${p.pct}%` }}
                    transition={{ delay: 0.7 + i * 0.1, duration: 0.8, ease: 'easeOut' }} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
