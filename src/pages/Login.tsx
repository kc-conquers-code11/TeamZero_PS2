import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaf, Truck, Factory, Building2, Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

const roles = [
  { id: 'citizen', name: 'Citizen', icon: Leaf, color: 'bg-emerald-500' },
  { id: 'collector', name: 'Collector', icon: Truck, color: 'bg-blue-500' },
  { id: 'facility', name: 'Facility Manager', icon: Factory, color: 'bg-purple-500' },
  { id: 'authority', name: 'Authority', icon: Building2, color: 'bg-orange-500' },
];

export default function Login() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [selectedRole, setSelectedRole] = useState('citizen');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Attempting login with:', email);
      
      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Login successful:', user.uid);

      // Get the stored role from localStorage (set during signup)
      const storedUser = localStorage.getItem('tb_user');
      let userRole = selectedRole;
      
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.email === email) {
          userRole = parsedUser.role;
        }
      }

      // Verify role matches selected role
      if (userRole !== selectedRole) {
        setError(`This account is registered as a ${userRole}. Please select the correct role.`);
        setLoading(false);
        return;
      }

      // Update localStorage with latest user data
      localStorage.setItem('tb_user', JSON.stringify({
        uid: user.uid,
        name: user.displayName || email.split('@')[0],
        role: userRole,
        email: user.email
      }));

      // Redirect to role-specific dashboard
      navigate(`/${selectedRole}`);
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email. Please sign up first.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email format.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please try again later.');
      } else {
        setError('Failed to login. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
              <Leaf className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">TrackBin Portal</CardTitle>
          <CardDescription>
            Select your role and login to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedRole} onValueChange={handleRoleSelect} className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              {roles.map((role) => {
                const Icon = role.icon;
                return (
                  <TabsTrigger key={role.id} value={role.id} className="flex flex-col gap-1 py-2">
                    <Icon className="w-4 h-4" />
                    <span className="text-[10px] hidden sm:inline">{role.name}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {roles.map((role) => (
              <TabsContent key={role.id} value={role.id}>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="pl-10 pr-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full bg-[#1a2634] hover:bg-[#2d3a4a]"
                    disabled={loading}
                  >
                    {loading ? 'Logging in...' : `Login as ${role.name}`}
                  </Button>
                </form>
              </TabsContent>
            ))}
          </Tabs>

          <div className="mt-6 pt-6 border-t text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary hover:underline font-semibold">
                Sign up here
              </Link>
            </p>
            <div className="mt-4">
              <Link 
                to="/" 
                className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-3 h-3" />
                Back to Home
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}