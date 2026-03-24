// src/components/DashboardLayout.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Menu, X, LogOut, User, Settings, Database, 
  ChevronDown, Leaf, Truck, Factory, Building2,
  AlertCircle, Phone, Accessibility, Info, Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useLanguage } from '@/components/LanguageProvider';
import { useAccessibility } from '@/components/AccessibilityProvider';
import { User as UserType } from '@/lib/types';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguage();
  const { textSize, setTextSize } = useAccessibility();
  const [user, setUser] = useState<UserType | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('tb_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse user data:', error);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('tb_user');
    navigate('/');
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'citizen': return <Leaf className="w-4 h-4" />;
      case 'collector': return <Truck className="w-4 h-4" />;
      case 'facility': return <Factory className="w-4 h-4" />;
      case 'authority': return <Building2 className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getRoleDisplay = (role: string): string => {
    switch (role) {
      case 'citizen': return 'Citizen';
      case 'collector': return 'Collector';
      case 'facility': return 'Facility Manager';
      case 'authority': return 'Authority';
      default: return role;
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans" style={{ fontSize: `${textSize}%` }}>
      {/* Top Bar */}
      <div className="bg-[#1a2634] text-white py-2 px-6">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between text-[11px] font-bold uppercase tracking-wider">
          <div className="flex items-center gap-6">
            <span className="opacity-80 hover:opacity-100 cursor-default">{t('govIndia')}</span>
            <span className="hidden md:inline opacity-30">|</span>
            <a href="#main-content" className="hidden md:inline opacity-80 hover:opacity-100 transition-opacity">Skip to Main Content</a>
            <span className="hidden md:inline opacity-30">|</span>
            <a href="#" className="hidden md:inline opacity-80 hover:opacity-100 transition-opacity flex items-center gap-1.5">
              <Accessibility className="w-3 h-3" /> Screen Reader Access
            </a>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-1.5 text-secondary">
              <Phone className="w-3 h-3" />
              <span>Helpline: 1800-11-0000</span>
            </div>
            <span className="hidden lg:inline opacity-30">|</span>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 font-black">
                <button onClick={() => setTextSize(Math.max(80, textSize - 10))} className="hover:text-secondary transition-colors px-1">A-</button>
                <button onClick={() => setTextSize(100)} className="hover:text-secondary transition-colors px-1">A</button>
                <button onClick={() => setTextSize(Math.min(150, textSize + 10))} className="hover:text-secondary transition-colors px-1">A+</button>
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
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
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
            <div className="flex items-center gap-3">
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-3 hover:bg-muted/50 rounded-full transition-all px-3 py-1.5">
                      <Avatar className="h-9 w-9 bg-gradient-to-br from-secondary to-secondary/70">
                        <AvatarFallback className="bg-secondary text-white font-bold text-sm">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden md:block text-left">
                        <p className="text-sm font-bold text-[#1a2634] leading-tight">{user.name}</p>
                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                          {getRoleIcon(user.role)}
                          <span>{getRoleDisplay(user.role)}</span>
                        </p>
                      </div>
                      <ChevronDown className="w-4 h-4 text-muted-foreground hidden md:block" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 z-[100]">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {getRoleDisplay(user.role)} Portal
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate(`/${user.role}`)} className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/blockchain')} className="cursor-pointer">
                      <Database className="mr-2 h-4 w-4" />
                      <span>Blockchain Explorer</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-[1400px] px-6 py-8 mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#1a2634]">{title}</h1>
        </div>
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#1a2634] text-white border-t-8 border-secondary mt-12 pt-12 pb-6">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
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