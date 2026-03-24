import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Recycle, User, Truck, Factory, Building2, Link2, LogOut, Menu, X, Search, Phone, Accessibility, Info, Database, LayoutDashboard, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import type { UserRole } from '@/lib/store';
import { useAccessibility } from './AccessibilityProvider';
import { useLanguage } from './LanguageProvider';

const navItems = [
  { path: '/citizen', label: 'Citizen', icon: User, role: 'citizen' as UserRole },
  { path: '/collector', label: 'Collector', icon: Truck, role: 'collector' as UserRole },
  { path: '/facility', label: 'Facility', icon: Factory, role: 'facility' as UserRole },
  { path: '/authority', label: 'Authority', icon: Building2, role: 'authority' as UserRole },
  { path: '/blockchain', label: 'Blockchain', icon: Link2 },
];

export default function DashboardLayout({ children, title }: { children: ReactNode; title: string }) {
  const { textSize, setTextSize } = useAccessibility();
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('tb_user') || '{"name":"Demo User","role":"citizen"}');

  return (
    <div className="min-h-screen bg-background flex flex-col" style={{ fontSize: `${textSize}%` }}>
      {/* UX4G Top Bar - Dark Navy */}
      <div className="bg-[#1a2634] text-white py-2 px-6">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between text-[11px] font-bold uppercase tracking-wider">
          <div className="flex items-center gap-6">
            <span className="opacity-80 hover:opacity-100 cursor-default">{t('govIndia')}</span>
            <span className="hidden md:inline opacity-30">|</span>
            <a href="#main-content" className="hidden md:inline opacity-80 hover:opacity-100 transition-opacity uppercase tracking-widest border-b border-transparent hover:border-white/50">Skip to Main Content</a>
            <span className="hidden md:inline opacity-30">|</span>
            <a href="#" className="hidden md:inline opacity-80 hover:opacity-100 transition-opacity uppercase tracking-widest flex items-center gap-1.5"><Accessibility className="w-3 h-3" /> Screen Reader Access</a>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-1.5 text-secondary">
              <Phone className="w-3 h-3" />
              <span>Helpline: 1800-11-0000</span>
            </div>
            <span className="hidden lg:inline opacity-30">|</span>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 font-black">
                <button onClick={() => setTextSize(Math.max(80, textSize - 10))} className="hover:text-secondary transition-colors px-1" title="Decrease Text Size">A-</button>
                <button onClick={() => setTextSize(100)} className="hover:text-secondary transition-colors px-1" title="Reset Text Size">A</button>
                <button onClick={() => setTextSize(Math.min(150, textSize + 10))} className="hover:text-secondary transition-colors px-1" title="Increase Text Size">A+</button>
              </div>
              <span className="opacity-30">|</span>
              <div className="flex items-center gap-2">
                {(['en', 'hi', 'mr'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-1.5 py-0.5 rounded transition-all ${language === lang ? 'bg-secondary text-[#1a2634]' : 'opacity-60 hover:opacity-100'}`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white text-accent h-24 border-b border-muted shadow-sm sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto h-full px-6 flex items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-4 group">
              <img src="/ashoka.svg" alt="Ashoka Pillar" className="h-14 w-auto drop-shadow-sm group-hover:scale-105 transition-transform" />
              <div className="h-12 w-[1px] bg-muted-foreground/30 hidden sm:block" />
              <div className="flex flex-col text-left">
                <h1 className="text-2xl font-[1000] tracking-tighter leading-none flex items-center">
                  <span className="text-[#1a2634]">TRACK</span>
                  <span className="text-secondary ml-0.5">BIN</span>
                </h1>
                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mt-1 opacity-70">Verified Waste Lifecycle Portal</span>
              </div>
            </Link>
          </div>

          <div className="flex-1 max-w-md hidden xl:block">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search audits, projects, reports..." 
                className="w-full h-11 pl-12 pr-4 bg-muted/30 border border-muted-foreground/20 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-8">
            <nav className="hidden lg:flex items-center gap-6 text-[11px] font-[900] uppercase tracking-[0.15em]">
              <Link to="/authority" className={`hover:text-primary transition-colors ${location.pathname === '/authority' ? 'text-primary' : ''}`}>Dashboard</Link>
              <nav className="flex items-center gap-6">
                <Link to="/blockchain" className={`hover:text-primary transition-colors ${location.pathname === '/blockchain' ? 'text-primary' : ''}`}>Public Audits</Link>
                <a href="#" className="hover:text-primary transition-colors">Open Data</a>
                <a href="#" className="hover:text-primary transition-colors">About Us</a>
              </nav>
            </nav>

            <div className="flex items-center gap-3">
              <Button variant="outline" className="hidden sm:flex rounded-lg border-[#ef4444] text-[#ef4444] hover:bg-[#ef4444] hover:text-white font-[800] uppercase tracking-wider text-[10px] h-10 px-4 gap-2 border-2">
                <AlertCircle className="w-4 h-4" /> Report Anomaly
              </Button>
              <Button onClick={() => navigate('/login')} className="bg-[#1e3a8a] hover:bg-[#1e40af] text-white rounded-lg font-[800] uppercase tracking-wider text-[10px] h-10 px-5 gap-2 shadow-lg shadow-blue-900/20 transition-all hover:-translate-y-0.5 active:translate-y-0">
                <User className="w-4 h-4" /> Citizen Login
              </Button>
            </div>
            
            <button 
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-accent"
            >
              {mobileOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      {/* Latest Updates Ticker */}
      <div className="bg-[#f8f9fa] border-b border-muted h-10 flex items-center overflow-hidden">
        <div className="bg-secondary text-white h-full px-6 flex items-center text-[10px] font-black uppercase tracking-widest shrink-0 shadow-lg relative z-10 whitespace-nowrap">
          Latest Updates
        </div>
        <div className="flex-1 overflow-hidden">
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: "-100%" }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="whitespace-nowrap px-8 text-[11px] font-bold text-muted-foreground italic"
          >
             TrackBin Deployment: Blockchain verification nodes are now active in Mumbai Zone 4. • New "Eco-Warrior" badges awarded to 1500+ citizens this month. • Integration with state infrastructure portal successful. • Weekly audit reports for Central Delhi are now public.
          </motion.div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-0 z-[60] lg:hidden"
            >
              <div className="absolute inset-0 bg-accent/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
              <div className="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-2xl p-6">
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-3">
                    <Recycle className="w-8 h-8 text-primary" />
                    <span className="text-xl font-black text-accent tracking-tighter">TrackBin</span>
                  </div>
                  <button onClick={() => setMobileOpen(false)} className="p-2 hover:bg-muted rounded-full">
                    <X />
                  </button>
                </div>
                <div className="space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-4 px-6 py-4 rounded-xl text-sm font-bold transition-all ${
                        location.pathname === item.path
                          ? 'bg-primary text-white shadow-lg shadow-primary/20'
                          : 'text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  ))}
                </div>
                <div className="absolute bottom-10 left-6 right-6">
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-center gap-2 border-primary text-primary hover:bg-primary hover:text-white h-12 rounded-xl font-bold"
                    onClick={() => {
                      localStorage.removeItem('tb_user');
                      navigate('/login');
                    }}
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Area */}
        <div className="flex-1 bg-muted/10 overflow-auto">
          <main className="max-w-[1600px] mx-auto p-6 md:p-8 lg:p-10">
            <div className="mb-10">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                <span>{t('home')}</span>
                <span>/</span>
                <span className="font-medium text-accent uppercase tracking-wider">{t(location.pathname.replace('/', '') as any)}</span>
              </div>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="text-left">
                  <h1 className="text-4xl font-extrabold text-accent tracking-tighter mb-2 italic">
                    {t(title.toLowerCase() as any) || title}
                  </h1>
                  <p className="text-muted-foreground text-sm max-w-2xl font-medium">{t('officialPortal')} {t(title.toLowerCase() as any) || title.toLowerCase()}.</p>
                </div>
                <div className="px-4 py-2 bg-secondary/10 border border-secondary/20 rounded-md">
                  <div className="text-[10px] uppercase font-bold text-secondary text-left">{t('systemStatus')}</div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                    <span className="text-sm font-bold text-accent">{t('operational')}</span>
                  </div>
                </div>
              </div>
            </div>

            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </main>

          {/* UX4G Footer */}
          <footer className="bg-[#1a2634] text-white border-t-8 border-secondary mt-20">
            <div className="max-w-[1600px] mx-auto px-10 py-16">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-16 text-left">
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <img src="/ashoka.svg" alt="Emblem" className="h-12 brightness-0 invert opacity-80" />
                    <div className="h-10 w-[1px] bg-white/20 mx-2" />
                    <span className="text-2xl font-black tracking-tight">TRACKBIN</span>
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed font-medium">
                    {t('footerText')}
                  </p>
                </div>
                <div>
                  <h4 className="font-black uppercase tracking-widest text-[10px] mb-8 text-secondary">{t('policyTerms')}</h4>
                  <ul className="space-y-4 text-[11px] font-bold uppercase tracking-widest text-white/60">
                    <li><a href="#" className="hover:text-secondary transition-colors">{t('privacyPolicy')}</a></li>
                    <li><a href="#" className="hover:text-secondary transition-colors">{t('termsOfService')}</a></li>
                    <li><a href="#" className="hover:text-secondary transition-colors">{t('wasteGuidelines')}</a></li>
                    <li><a href="#" className="hover:text-secondary transition-colors">{t('helpDesk')}</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-black uppercase tracking-widest text-[10px] mb-8 text-secondary">{t('quickLinks')}</h4>
                  <ul className="space-y-4 text-[11px] font-bold uppercase tracking-widest text-white/60">
                    <li><Link to="/" className="hover:text-secondary transition-colors">{t('homePortal')}</Link></li>
                    <li><Link to="/blockchain" className="hover:text-secondary transition-colors">{t('blockchainExplorer')}</Link></li>
                    <li><Link to="/authority" className="hover:text-secondary transition-colors">{t('centralAnalytics')}</Link></li>
                    <li><Link to="/login" className="hover:text-secondary transition-colors">{t('officerPortal')}</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-black uppercase tracking-widest text-[10px] mb-8 text-secondary">{t('connect')}</h4>
                  <div className="flex gap-4 mb-8">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 cursor-pointer hover:bg-secondary hover:text-[#1a2634] transition-all">
                      <Accessibility className="w-4 h-4" />
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 cursor-pointer hover:bg-secondary hover:text-[#1a2634] transition-all">
                      <Info className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-white/40 leading-relaxed">
                    {t('initiative')}
                  </p>
                </div>
              </div>
              <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-10">
                  <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Digital India</div>
                  <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Swachh Bharat</div>
                  <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Smart Cities</div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-40">{t('copyright')}</p>
                  <p className="text-[9px] font-medium opacity-30 mt-1 uppercase tracking-tighter">{t('developedBy')}</p>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
