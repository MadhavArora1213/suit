import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Eye, EyeOff, Globe, Mail, Phone, Upload, Shield, Palette, Database, Save, Lock, Store, AtSign } from 'lucide-react';

const Instagram = ({ size = 16, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const P = '#111111';
const PD = '#111111';

const SectionCard = ({ title, subtitle, icon: Icon, children }) => (
  <div className="bg-white rounded-2xl border border-[#E8DDD0]/60 overflow-hidden shadow-sm">
    <div className="flex items-center gap-3 px-6 py-4 border-b border-[#E8DDD0]" style={{ background: '#FAF9F6' }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#E8DDD0' }}>
        <Icon size={18} style={{ color: P }} />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-[#1A1A1A]">{title}</h3>
        {subtitle && <p className="text-xs text-[#6B7A7C] mt-0.5">{subtitle}</p>}
      </div>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const FieldRow = ({ label, hint, children }) => (
  <div className="flex flex-col sm:flex-row sm:items-start gap-3 py-4 border-b border-[#F0FAFB] last:border-0">
    <div className="sm:w-36 flex-shrink-0 pt-1">
      <p className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wide" style={{ fontSize: 11 }}>{label}</p>
      {hint && <p className="text-xs text-[#9EA8A9] mt-0.5 leading-snug">{hint}</p>}
    </div>
    <div className="flex-1">{children}</div>
  </div>
);

const StyledInput = ({ value, onChange, placeholder, type = 'text', icon: Icon, suffix }) => (
  <div className="relative">
    {Icon && <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: P }} />}
    <input type={type} value={value} onChange={onChange} placeholder={placeholder}
      className="w-full py-3 pr-4 bg-[#FAF9F6] border border-[#E8DDD0] rounded-xl text-sm text-[#1A1A1A] placeholder-[#A8BCBE] transition-all focus:outline-none"
      style={{ paddingLeft: Icon ? '2.5rem' : '1rem' }}
      onFocus={e => { e.target.style.borderColor = P; e.target.style.boxShadow = `0 0 0 3px rgba(17,17,17,0.1)`; e.target.style.background = '#fff'; }}
      onBlur={e => { e.target.style.borderColor = '#E8DDD0'; e.target.style.boxShadow = 'none'; e.target.style.background = '#FAF9F6'; }}
    />
    {suffix}
  </div>
);

const SaveBtn = ({ section, savedSection, onSave }) => (
  <div className="flex justify-end mt-5 pt-4 border-t border-[#E8DDD0]">
    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => onSave(section)}
      className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
      style={{ background: savedSection === section ? '#10B981' : `linear-gradient(135deg, ${P}, ${PD})`, boxShadow: savedSection === section ? '0 4px 16px rgba(16,185,129,0.3)' : `0 4px 16px rgba(17,17,17,0.25)` }}>
      {savedSection === section ? <><Check size={15} /> Saved!</> : <><Save size={15} /> Save Changes</>}
    </motion.button>
  </div>
);

export default function Settings() {
  const [general, setGeneral] = useState({
    siteName: 'Gurnaaz Ethnic Wear',
    tagline: 'Heritage Craftsmanship · Modern Luxury',
    email: 'madhavarora132005@gmail.com',
    phone: '+91 98765 43210',
    instagram: '@gurnaazethnicwear',
    website: 'https://gurnaaz.com',
  });

  const [firebase, setFirebase] = useState({
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
  });

  const [security, setSecurity] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPasswords, setShowPasswords] = useState({});
  const [logoPreview, setLogoPreview] = useState(null);
  const [savedSection, setSavedSection] = useState(null);

  // Load saved configurations on mount
  useEffect(() => {
    try {
      const savedFirebase = localStorage.getItem('gurnaaz_firebase_config');
      if (savedFirebase) {
        setFirebase(JSON.parse(savedFirebase));
      }
      
      const savedGeneral = localStorage.getItem('gurnaaz_general_config');
      if (savedGeneral) {
        setGeneral(JSON.parse(savedGeneral));
      }
    } catch (e) {
      console.error('Error loading settings from localStorage:', e);
    }
  }, []);

  const handleSave = (section) => {
    try {
      if (section === 'firebase') {
        localStorage.setItem('gurnaaz_firebase_config', JSON.stringify(firebase));
        // Dispatch event so other parts of the app know Firebase config updated
        window.dispatchEvent(new CustomEvent('gurnaaz-firebase-updated'));
      } else if (section === 'branding' || section === 'contact') {
        localStorage.setItem('gurnaaz_general_config', JSON.stringify(general));
      }
    } catch (e) {
      console.error('Error saving settings to localStorage:', e);
    }
    setSavedSection(section);
    setTimeout(() => setSavedSection(null), 2200);
  };

  const togglePass = (key) => setShowPasswords(prev => ({ ...prev, [key]: !prev[key] }));
  const handleLogo = (e) => { const f = e.target.files[0]; if (f) setLogoPreview(URL.createObjectURL(f)); };

  return (
    <div className="space-y-1">
      {/* Page header */}
      <div className="mb-4 sm:mb-5">
        <h2 className="text-xl sm:text-2xl font-semibold text-[#1A1A1A]">Settings</h2>
        <p className="text-xs sm:text-sm text-[#6B7A7C] mt-1">Manage your store configuration and admin preferences</p>
      </div>

      {/* TWO-COLUMN GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-5">

        {/* LEFT COLUMN */}
        <div className="space-y-4 sm:space-y-5">

          {/* Branding */}
          <SectionCard title="Branding" subtitle="Logo and site identity" icon={Palette}>
            {/* Logo */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5 mb-5 pb-5 border-b border-[#E8DDD0]">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-dashed border-[#E8DDD0] flex items-center justify-center overflow-hidden flex-shrink-0 bg-[#FAF9F6]">
                {logoPreview
                  ? <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                  : <span className="text-2xl sm:text-3xl font-bold" style={{ fontFamily: "'Cormorant Garamond', serif", color: P }}>G</span>
                }
              </div>
              <div className="text-center sm:text-left">
                <p className="text-base sm:text-lg font-semibold text-[#1A1A1A] mb-1">Store Logo</p>
                <p className="text-xs sm:text-sm text-[#6B7A7C] mb-3">PNG or SVG · transparent bg · 200×200px</p>
                <label className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold px-4 py-2 sm:py-2.5 rounded-xl cursor-pointer border transition-colors"
                  style={{ background: '#E8DDD0', color: P, borderColor: '#E8DDD0' }}>
                  <Upload size={13} /> Upload Logo
                  <input type="file" accept="image/*" onChange={handleLogo} className="hidden" />
                </label>
              </div>
            </div>

            <FieldRow label="Site Name">
              <StyledInput icon={Store} value={general.siteName} onChange={e => setGeneral(p => ({ ...p, siteName: e.target.value }))} placeholder="Your store name" />
            </FieldRow>
            <FieldRow label="Tagline">
              <StyledInput value={general.tagline} onChange={e => setGeneral(p => ({ ...p, tagline: e.target.value }))} placeholder="Your tagline" />
            </FieldRow>

            <SaveBtn section="branding" savedSection={savedSection} onSave={handleSave} />
          </SectionCard>

          {/* Contact Information */}
          <SectionCard title="Contact Information" subtitle="Shown in footer and contact sections" icon={Phone}>
            <FieldRow label="Email">
              <StyledInput icon={Mail} type="email" value={general.email} onChange={e => setGeneral(p => ({ ...p, email: e.target.value }))} placeholder="admin@yourstore.com" />
            </FieldRow>
            <FieldRow label="Phone">
              <StyledInput icon={Phone} value={general.phone} onChange={e => setGeneral(p => ({ ...p, phone: e.target.value }))} placeholder="+91 XXXXX XXXXX" />
            </FieldRow>
            <FieldRow label="Instagram">
              <StyledInput icon={Instagram} value={general.instagram} onChange={e => setGeneral(p => ({ ...p, instagram: e.target.value }))} placeholder="@yourhandle" />
            </FieldRow>
            <FieldRow label="Website">
              <StyledInput icon={Globe} value={general.website} onChange={e => setGeneral(p => ({ ...p, website: e.target.value }))} placeholder="https://yourstore.com" />
            </FieldRow>
            <SaveBtn section="contact" savedSection={savedSection} onSave={handleSave} />
          </SectionCard>

        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-4 sm:space-y-5">

          {/* Firebase Config */}
          <SectionCard title="Firebase Configuration" subtitle="Database and authentication keys" icon={Database}>
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5 flex items-start gap-2.5">
              <Shield size={15} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-700">Keep these keys private. Never commit them to version control.</p>
            </div>
            <div className="space-y-3">
              {[
                { key: 'apiKey', label: 'API Key', placeholder: 'AIza...' },
                { key: 'authDomain', label: 'Auth Domain', placeholder: 'your-app.firebaseapp.com' },
                { key: 'projectId', label: 'Project ID', placeholder: 'your-project-id' },
                { key: 'storageBucket', label: 'Storage Bucket', placeholder: 'your-app.appspot.com' },
                { key: 'messagingSenderId', label: 'Messaging Sender ID', placeholder: '123456789' },
                { key: 'appId', label: 'App ID', placeholder: '1:123:web:abc...' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">{label}</label>
                  <input value={firebase[key]} onChange={e => setFirebase(p => ({ ...p, [key]: e.target.value }))}
                    placeholder={placeholder} type="text"
                    className="w-full px-4 py-2.5 bg-[#FAF9F6] border border-[#E8DDD0] rounded-xl text-sm text-[#1A1A1A] font-mono placeholder-[#A8BCBE] focus:outline-none transition-all"
                    onFocus={e => { e.target.style.borderColor = P; e.target.style.boxShadow = `0 0 0 3px rgba(17,17,17,0.1)`; }}
                    onBlur={e => { e.target.style.borderColor = '#E8DDD0'; e.target.style.boxShadow = 'none'; }} />
                </div>
              ))}
            </div>
            <SaveBtn section="firebase" savedSection={savedSection} onSave={handleSave} />
          </SectionCard>

          {/* Change Password */}
          <SectionCard title="Change Password" subtitle="Update your admin login credentials" icon={Shield}>
            <div className="space-y-4">
              {[
                { label: 'Current Password', key: 'currentPassword' },
                { label: 'New Password', key: 'newPassword' },
                { label: 'Confirm New Password', key: 'confirmPassword' },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">{label}</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: P }} />
                    <input type={showPasswords[key] ? 'text' : 'password'}
                      value={security[key]} onChange={e => setSecurity(p => ({ ...p, [key]: e.target.value }))}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-11 py-3 bg-[#FAF9F6] border border-[#E8DDD0] rounded-xl text-sm text-[#1A1A1A] placeholder-[#A8BCBE] focus:outline-none transition-all"
                      onFocus={e => { e.target.style.borderColor = P; e.target.style.boxShadow = `0 0 0 3px rgba(17,17,17,0.1)`; }}
                      onBlur={e => { e.target.style.borderColor = '#E8DDD0'; e.target.style.boxShadow = 'none'; }} />
                    <button type="button" onClick={() => togglePass(key)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                      style={{ color: showPasswords[key] ? P : '#9EA8A9' }}>
                      {showPasswords[key] ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <SaveBtn section="password" savedSection={savedSection} onSave={handleSave} />
          </SectionCard>

          {/* Danger Zone */}
          <div className="bg-red-50 rounded-2xl border border-red-200 p-4 sm:p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield size={16} className="text-red-500" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-red-700">Danger Zone</h3>
                <p className="text-xs sm:text-sm text-red-400 mt-0.5">Irreversible actions. Proceed with caution.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <button className="py-2.5 sm:py-3 border border-red-300 text-red-600 rounded-xl text-xs sm:text-sm font-semibold hover:bg-red-100 transition-colors">
                Clear All Orders
              </button>
              <button className="py-2.5 sm:py-3 border border-red-300 text-red-600 rounded-xl text-xs sm:text-sm font-semibold hover:bg-red-100 transition-colors">
                Reset All Products
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
