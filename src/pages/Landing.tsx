import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Recycle, Shield, BarChart3, Link2, ArrowRight, Leaf, Truck, Factory, Building2, Search, Phone, Accessibility, Info, AlertCircle, User as UserIcon, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnimatedCounter from '@/components/AnimatedCounter';
import { useLanguage } from '@/components/LanguageProvider';
import { useNavigate } from 'react-router-dom';
import { useAccessibility } from '@/components/AccessibilityProvider';

const features = [
  { icon: Recycle, title: 'Track Every Gram', desc: 'Full lifecycle tracking from household to final processing with QR-based verification.' },
  { icon: Shield, title: 'Blockchain Verified', desc: 'Immutable records ensure no waste data can be tampered with or falsified.' },
  { icon: BarChart3, title: 'Smart Analytics', desc: 'AI-powered anomaly detection flags suspicious activities in real-time.' },
  { icon: Link2, title: 'Chain of Custody', desc: 'Every handoff is recorded, creating an unbreakable chain of accountability.' },
];

const roles = [
  { icon: Leaf, id: 'citizen', color: 'from-emerald-500 to-emerald-600' },
  { icon: Truck, id: 'collector', color: 'from-blue-500 to-blue-600' },
  { icon: Factory, id: 'facility', color: 'from-purple-500 to-purple-600' },
  { icon: Building2, id: 'authority', color: 'from-orange-500 to-orange-600' },
];

const stats = [
  { label: 'Waste Tracked', value: 24500, suffix: ' kg' },
  { label: 'Recycling Rate', value: 82, suffix: '%' },
  { label: 'Active Citizens', value: 1240, suffix: '+' },
  { label: 'Anomalies Caught', value: 47, suffix: '' },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Landing() {
  const { t, language, setLanguage } = useLanguage();
  const { textSize, setTextSize } = useAccessibility();
  const navigate = useNavigate();

  const handleLogin = (role: string) => {
    localStorage.setItem('tb_user', JSON.stringify({
      name: role === 'citizen' ? 'Krishna S Choudhary' : role === 'authority' ? 'Chief Officer' : 'Demo Facility Manager',
      role
    }));
    navigate(`/${role}`);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans" style={{ fontSize: `${textSize}%` }}>
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
              <a href="#features" className="hover:text-primary transition-colors">{t('howItWorks')}</a>
              <a href="#how" className="hover:text-primary transition-colors">Ecosystem</a>
              <a href="#stats" className="hover:text-primary transition-colors">Impact</a>
              <a href="#" className="hover:text-primary transition-colors">About Us</a>
            </nav>

            <div className="flex items-center gap-3">
              <Button variant="outline" className="hidden sm:flex rounded-lg border-[#ef4444] text-[#ef4444] hover:bg-[#ef4444] hover:text-white font-[800] uppercase tracking-wider text-[10px] h-10 px-4 gap-2 border-2">
                <AlertCircle className="w-4 h-4" /> Report Anomaly
              </Button>
              <Button onClick={() => navigate('/login')} className="bg-[#1e3a8a] hover:bg-[#1e40af] text-white rounded-lg font-[800] uppercase tracking-wider text-[10px] h-10 px-5 gap-2 shadow-lg shadow-blue-900/20 transition-all hover:-translate-y-0.5 active:translate-y-0">
                <UserIcon className="w-4 h-4" /> Citizen Login
              </Button>
            </div>
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

      <main className="w-full max-w-[1400px] px-6 py-20 mx-auto">
        <div className="flex flex-col items-center text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-10"
          >
            <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center shadow-2xl">
              <Recycle className="w-12 h-12 text-primary-foreground" />
            </div>
            <div className="text-left">
              <h1 className="text-6xl font-[1000] text-accent tracking-tight leading-none">
                <span className="text-[#1a2634]">TRACK</span>
                <span className="text-secondary ml-1">BIN</span>
              </h1>
              <p className="text-sm font-bold text-secondary uppercase tracking-[0.3em] mt-1">{t('subtitle')}</p>
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-7xl font-black text-[#1a2634] tracking-tighter max-w-5xl mb-10 leading-[0.9]"
          >
            {t('landingTitle')}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mb-16 font-medium leading-relaxed"
          >
            {t('landingSubtitle')}
          </motion.p>

          <div className="flex gap-4">
            <Button size="lg" className="h-16 px-10 text-lg font-black rounded-full shadow-xl hover:scale-105 transition-all bg-[#1a2634]">
              {t('trackWaste')} <ArrowRight className="ml-3 w-6 h-6" />
            </Button>
            <Button size="lg" variant="outline" className="h-16 px-10 text-lg font-bold rounded-full border-2 hover:bg-muted/50 transition-all border-[#1a2634] text-[#1a2634]">
              {t('howItWorks')}
            </Button>
          </div>
        </div>

        {/* Numeric Insights - Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border border-muted p-10 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all text-center group"
            >
              <div className="text-5xl font-black text-[#1a2634] tracking-tighter mb-2 flex items-center justify-center">
                <AnimatedCounter value={stat.value} />
                <span className="text-secondary ml-1">{stat.suffix}</span>
              </div>
              <div className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground group-hover:text-secondary transition-colors">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Platform Features - The Four Pillars */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-[#1a2634] tracking-tighter mb-4">Unbreakable Chain of Accountability</h2>
            <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">Four core pillars of the TrackBin ecosystem</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <div key={feature.title} className="flex items-start gap-8 p-10 bg-[#f8f9fa] border border-border/50 rounded-[2.5rem] hover:bg-white hover:shadow-2xl transition-all group">
                <div className="w-16 h-16 rounded-2xl bg-[#1a2634] text-white flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                  <feature.icon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-[#1a2634] mb-3 tracking-tighter">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm font-medium leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Access Portal Grid */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-[#1a2634] tracking-tighter mb-4">Unified Handoff Protocol</h2>
          <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs">Access specific nodes in the waste lifecycle</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {roles.map((role) => (
            <PortalCard
              key={role.id}
              icon={role.icon}
              title={t(role.id + 'Portal' as any)}
              desc={t(role.id + 'Desc' as any)}
              onClick={() => handleLogin(role.id)}
              accent={role.id === 'citizen' ? 'bg-blue-600' : role.id === 'authority' ? 'bg-red-600' : 'bg-green-600'}
            />
          ))}
          <PortalCard
            icon={Database}
            title={t('blockchainExplorerTitle')}
            desc={t('blockchainExplorerDesc')}
            onClick={() => navigate('/blockchain')}
            accent="bg-purple-600"
          />

          <div className="bg-[#f8f9fa] border-2 border-dashed border-border/50 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center">
            <Info className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{t('loginToAccess')}</p>
          </div>
        </div>
      </main>

      {/* Official Footer */}
      <footer className="bg-[#1a2634] text-white border-t-8 border-secondary pt-24 pb-12">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-20 text-left">
            <div>
              <div className="flex items-center gap-4 mb-8">
                <img src="/ashoka.svg" alt="Emblem" className="h-14 brightness-0 invert opacity-80" />
                <div className="h-12 w-[1px] bg-white/20 mx-2" />
                <span className="text-3xl font-black tracking-tighter leading-none">TRACKBIN</span>
              </div>
              <p className="text-sm font-medium text-white/50 leading-relaxed italic border-l-2 border-secondary pl-4">
                "{t('footerText')}"
              </p>
            </div>
            <div>
              <h4 className="text-secondary font-black uppercase tracking-[0.2em] text-[10px] mb-8">{t('policyTerms')}</h4>
              <ul className="space-y-4 text-[11px] font-bold uppercase tracking-widest text-white/40">
                <li><a href="#" className="hover:text-secondary transition-colors">{t('privacyPolicy')}</a></li>
                <li><a href="#" className="hover:text-secondary transition-colors">{t('termsOfService')}</a></li>
                <li><a href="#" className="hover:text-secondary transition-colors">{t('wasteGuidelines')}</a></li>
                <li><a href="#" className="hover:text-secondary transition-colors">{t('helpDesk')}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-secondary font-black uppercase tracking-[0.2em] text-[10px] mb-8">{t('quickLinks')}</h4>
              <ul className="space-y-4 text-[11px] font-bold uppercase tracking-widest text-white/40">
                <li><Link to="/blockchain" className="hover:text-secondary transition-colors">{t('blockchainExplorer')}</Link></li>
                <li><a href="#" className="hover:text-secondary transition-colors">{t('centralAnalytics')}</a></li>
                <li><a href="#" className="hover:text-secondary transition-colors">{t('officerPortal')}</a></li>
              </ul>
            </div>
            <div className="flex flex-col items-start text-left">
              <h4 className="text-secondary font-black uppercase tracking-[0.2em] text-[10px] mb-8">{t('connect')}</h4>
              <div className="flex gap-4 mb-8">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-secondary hover:text-[#1a2634] transition-all cursor-pointer">
                  <Accessibility className="w-4 h-4" />
                </div>
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-secondary hover:text-[#1a2634] transition-all cursor-pointer">
                  <Info className="w-4 h-4" />
                </div>
              </div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-white/30 leading-relaxed">
                {t('initiative')}
              </p>
            </div>
          </div>
          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">
              © 2026 TRACKBIN SYSTEM • OFFICIAL AUDIT PORTAL
            </div>
            <div className="flex gap-8 opacity-40">
              <span className="text-[10px] font-bold uppercase tracking-widest">Digital India</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">Swachh Bharat</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function PortalCard({ icon: Icon, title, desc, onClick, accent }: any) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      onClick={onClick}
      className={`bg-white border border-muted p-10 rounded-[2.5rem] cursor-pointer hover:shadow-2xl transition-all group relative overflow-hidden text-left`}
    >
      <div className={`absolute top-0 right-0 w-32 h-32 ${accent} opacity-5 group-hover:opacity-10 transition-opacity rounded-bl-full`} />
      <div className={`w-16 h-16 rounded-2xl ${accent} text-white flex items-center justify-center mb-10 shadow-lg group-hover:scale-110 transition-transform`}>
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-2xl font-black text-[#1a2634] mb-4 tracking-tighter">{title}</h3>
      <p className="text-muted-foreground text-sm font-medium leading-relaxed mb-8">{desc}</p>
      <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-[#1a2634]/40 group-hover:text-secondary transition-colors">
        System Access <ArrowRight className="w-4 h-4" />
      </div>
    </motion.div>
  );
}
