import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Recycle, User, Truck, Factory, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { UserRole } from '@/lib/store';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { setUser } from '@/lib/auth';

const roles: { role: UserRole; label: string; icon: typeof User; desc: string }[] = [
  { role: 'citizen', label: 'Citizen', icon: User, desc: 'Track & submit waste' },
  { role: 'collector', label: 'Collector', icon: Truck, desc: 'Collect & transport' },
  { role: 'facility', label: 'Facility', icon: Factory, desc: 'Process & verify' },
  { role: 'authority', label: 'Authority', icon: Building2, desc: 'Monitor & govern' },
];

const dashboardRoutes: Record<UserRole, string> = {
  citizen: '/citizen',
  collector: '/collector',
  facility: '/facility',
  authority: '/authority',
};

export default function Login() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('citizen');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('demo@trackbin.io');
  const [password, setPassword] = useState('demo1234');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Try login
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      // If user doesn't exist → create
      try {
        await createUserWithEmailAndPassword(auth, email, password);
      } catch (error) {
        console.error(error);
        alert("Authentication failed");
        setLoading(false);
        return;
      }
    }

    // Store role locally
    setUser({
      name: name || roles.find(r => r.role === selectedRole)!.label + ' User',
      role: selectedRole,
    });

    setLoading(false);
    navigate(dashboardRoutes[selectedRole]);
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-6">
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Recycle className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">TrackBin</span>
          </Link>
          <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
          <p className="text-muted-foreground text-sm">Select your role to continue</p>
        </div>

        {/* Card */}
        <div className="gov-card p-10 bg-white">

          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {roles.map((r) => (
              <button
                key={r.role}
                onClick={() => setSelectedRole(r.role)}
                className={`p-6 rounded-xl border-2 text-left transition-all duration-300 ${
                  selectedRole === r.role
                    ? 'border-primary bg-primary/5 shadow-inner'
                    : 'border-border/40 hover:border-primary/20 bg-background'
                }`}
              >
                <r.icon className={`w-6 h-6 mb-3 ${
                  selectedRole === r.role ? 'text-primary' : 'text-muted-foreground'
                }`} />
                <p className="font-bold text-sm text-accent">{r.label}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1 leading-tight">
                  {r.desc}
                </p>
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                Identity Name
              </label>
              <Input
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 bg-muted/30 border-border/40 focus:bg-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                Email Address
              </label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="h-12 bg-muted/30 border-border/40 focus:bg-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                Secure Passkey
              </label>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="h-12 bg-muted/30 border-border/40 focus:bg-white"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 font-black uppercase tracking-widest text-sm mt-4"
            >
              {loading
                ? "Authenticating..."
                : `Authorized Sign In: ${roles.find(r => r.role === selectedRole)?.label}`}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Demo mode — Firebase Auth enabled
        </p>
      </motion.div>
    </div>
  );
}