import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Leaf, Upload, Clock, Trophy, Star, Flame, Award, AlertCircle,
  MapPin, Camera, X, CheckCircle, Truck, Factory,
  Navigation, Package, Mail, Hash, Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import DashboardLayout from '@/components/DashboardLayout';
import KPICard from '@/components/KPICard';
import StatusBadge from '@/components/StatusBadge';
import WasteTypeBadge from '@/components/WasteTypeBadge';
import WasteProgress from '@/components/WasteProgress';
import MapComponent from '@/components/MapComponent';
import { saveWasteSubmission, getWasteByCitizen, generateUniqueId } from '@/lib/wasteService';
import { WasteSubmission, WasteType, WasteStatus, User } from '@/lib/types';

const wasteOptions: { type: WasteType; label: string; icon: React.ElementType }[] = [
  { type: 'wet', label: 'Wet Waste', icon: Leaf },
  { type: 'dry', label: 'Dry Waste', icon: Package },
  { type: 'plastic', label: 'Plastic', icon: Package },
  { type: 'hazardous', label: 'Hazardous', icon: AlertCircle },
  { type: 'ewaste', label: 'E-Waste', icon: Package },
];

const statusColors: Record<WasteStatus, string> = {
  submitted: 'text-yellow-600 bg-yellow-50',
  collected: 'text-blue-600 bg-blue-50',
  in_transit: 'text-purple-600 bg-purple-50',
  delivered: 'text-green-600 bg-green-50',
  processed: 'text-gray-600 bg-gray-50',
};

const badges = [
  { name: 'First Submit', icon: Star, earned: true },
  { name: '7-Day Streak', icon: Flame, earned: true },
  { name: 'Eco Warrior', icon: Award, earned: true },
  { name: '100 Submissions', icon: Trophy, earned: false },
];

export default function CitizenDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [submissions, setSubmissions] = useState<WasteSubmission[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedType, setSelectedType] = useState<WasteType>('wet');
  const [weight, setWeight] = useState('');
  const [address, setAddress] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [qrData, setQrData] = useState<WasteSubmission | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<WasteSubmission | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('tb_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      
      const userSubmissions = getWasteByCitizen(parsedUser.uid);
      setSubmissions(userSubmissions);
    }
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          setUserLocation({ lat: 19.0760, lng: 72.8777 });
        }
      );
    }
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!user || !userLocation || !imageFile || !weight) return;

    const id = generateUniqueId();
    
    const qrDataString = JSON.stringify({
      id,
      citizen: user.name,
      type: selectedType,
      weight: parseFloat(weight),
      timestamp: Date.now()
    });

    const submission: WasteSubmission = {
      id,
      qrCode: btoa(qrDataString.slice(0, 500)),
      citizenId: user.uid,
      citizenName: user.name,
      citizenEmail: user.email,
      location: {
        lat: userLocation.lat,
        lng: userLocation.lng,
        address: address || 'Current Location',
      },
      wasteType: selectedType,
      weight: parseFloat(weight),
      imageUrl: imagePreview!,
      timestamp: new Date().toISOString(),
      status: 'submitted',
      currentLocation: {
        lat: userLocation.lat,
        lng: userLocation.lng,
        updatedAt: new Date().toISOString(),
      },
      timeline: [{
        status: 'submitted',
        timestamp: new Date().toISOString(),
        by: user.name,
        location: userLocation,
      }],
    };

    saveWasteSubmission(submission);
    setQrData(submission);
    setSubmissions([submission, ...submissions]);
    
    setShowUpload(false);
    setImagePreview(null);
    setImageFile(null);
    setWeight('');
    setAddress('');
  };

  const getRouteCoordinates = (submission: WasteSubmission): [number, number][] => {
    const coords: [number, number][] = [[submission.location.lat, submission.location.lng]];
    if (submission.currentLocation) {
      coords.push([submission.currentLocation.lat, submission.currentLocation.lng]);
    }
    return coords;
  };

  const getStatusIcon = (status: WasteStatus): React.ReactNode => {
    switch (status) {
      case 'submitted': return <Clock className="w-4 h-4" />;
      case 'collected': return <CheckCircle className="w-4 h-4" />;
      case 'in_transit': return <Truck className="w-4 h-4" />;
      case 'delivered': return <Factory className="w-4 h-4" />;
      case 'processed': return <Leaf className="w-4 h-4" />;
    }
  };

  const mapMarkers = [
    ...(userLocation ? [{
      position: [userLocation.lat, userLocation.lng] as [number, number],
      popup: 'Your Location',
      type: 'user'
    }] : []),
    ...submissions.map(sub => ({
      position: [sub.currentLocation.lat, sub.currentLocation.lng] as [number, number],
      popup: `ID: ${sub.id.slice(0, 12)}...\nType: ${sub.wasteType}\nStatus: ${sub.status}\nWeight: ${sub.weight} kg`,
      type: 'waste'
    }))
  ];

  return (
    <DashboardLayout title="Citizen Dashboard">
      <div className="mb-6 p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl">
        <h2 className="text-xl font-bold text-accent">Welcome back, {user?.name}! 🌱</h2>
        <p className="text-sm text-muted-foreground">Track your waste contributions and earn rewards</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <KPICard title="Green Score" value={725} icon={Leaf} trend={12} delay={0} />
        <KPICard title="Total Submissions" value={submissions.length} icon={Upload} trend={8} delay={0.1} />
        <KPICard title="Active Waste" value={submissions.filter(s => s.status !== 'processed').length} icon={Clock} delay={0.2} />
        <KPICard title="Badges Earned" value={3} icon={Trophy} delay={0.3} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="gov-card p-4 bg-white">
            <h3 className="text-lg font-bold text-accent mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" /> Live Waste Tracking
            </h3>
            <div className="h-[400px] rounded-xl overflow-hidden border bg-gray-50">
              {userLocation && (
                <MapComponent
                  center={[userLocation.lat, userLocation.lng]}
                  zoom={13}
                  markers={mapMarkers}
                  polyline={selectedSubmission ? getRouteCoordinates(selectedSubmission) : undefined}
                  showNearbyLocations={true}
                />
              )}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="gov-card p-6 bg-white">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-primary" /> Badges Earned
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {badges.map((b) => (
                <div key={b.name} className={`p-3 rounded-xl text-center ${b.earned ? 'bg-primary/10' : 'bg-muted/50 opacity-50'}`}>
                  <b.icon className={`w-6 h-6 mx-auto mb-1 ${b.earned ? 'text-primary' : 'text-muted-foreground'}`} />
                  <p className="text-xs font-medium">{b.name}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
          {!showUpload ? (
            <Button 
              onClick={() => setShowUpload(true)} 
              className="w-full h-24 text-lg font-black uppercase tracking-widest bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
            >
              <Upload className="w-6 h-6 mr-2" /> Report New Waste
            </Button>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="gov-card p-6 bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-accent">New Waste Submission</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowUpload(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label>Waste Type</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {wasteOptions.map((w) => {
                      const IconComponent = w.icon;
                      return (
                        <button
                          key={w.type}
                          onClick={() => setSelectedType(w.type)}
                          className={`p-2 rounded-lg border text-center transition-all ${selectedType === w.type ? 'border-primary bg-primary/10' : 'border-border/30'}`}
                        >
                          <IconComponent className="w-5 h-5 mx-auto mb-1" />
                          <p className="text-xs">{w.label}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <Label>Weight (kg)</Label>
                  <Input
                    type="number"
                    placeholder="Enter weight in kg"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>

                <div>
                  <Label>Collection Address</Label>
                  <Textarea
                    placeholder="Enter your address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={2}
                  />
                </div>

                <div>
                  <Label>Upload Waste Image</Label>
                  <div 
                    className="mt-2 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="max-h-32 mx-auto rounded-lg" />
                    ) : (
                      <>
                        <Camera className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Click to upload image</p>
                      </>
                    )}
                  </div>
                </div>

                <Button onClick={handleSubmit} className="w-full" disabled={!imageFile || !weight}>
                  Generate QR & Submit
                </Button>
              </div>
            </motion.div>
          )}

          {qrData && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="gov-card p-6 bg-white text-center border-2 border-primary/20">
              <h3 className="text-lg font-bold text-accent mb-4">Waste QR Code Generated</h3>
              <div className="bg-muted p-4 rounded-xl inline-block mb-4">
                <QRCodeSVG value={qrData.qrCode.slice(0, 1000)} size={160} />
              </div>
              <p className="text-xs text-muted-foreground font-mono break-all">{qrData.id}</p>
              <p className="text-xs text-green-600 mt-2">✓ Waste recorded. Collector will be assigned soon.</p>
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="gov-card p-6 bg-white">
            <h3 className="text-lg font-bold text-accent mb-4">My Waste Submissions</h3>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {submissions.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubmission(sub)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${selectedSubmission?.id === sub.id ? 'border-primary bg-primary/5' : 'border-border/20 hover:border-border/50'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <WasteTypeBadge type={sub.wasteType} />
                      <span className="text-xs font-mono text-muted-foreground">{sub.id.slice(0, 12)}...</span>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${statusColors[sub.status]}`}>
                      {getStatusIcon(sub.status)}
                      <span>{sub.status.replace('_', ' ')}</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{sub.weight} kg</span>
                    <span>{new Date(sub.timestamp).toLocaleDateString()}</span>
                  </div>
                </button>
              ))}
              {submissions.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No waste submissions yet. Start by reporting waste above!</p>
              )}
            </div>
          </motion.div>

          {/* Waste Progress Section */}
          {selectedSubmission && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="gov-card p-6 bg-white mt-4"
            >
              <h3 className="text-lg font-bold text-accent mb-4">Waste Journey Progress</h3>
              <WasteProgress 
                status={selectedSubmission.status}
                timeline={selectedSubmission.timeline}
                onStepClick={(status) => {
                  console.log('Step clicked:', status);
                }}
              />
              
              <div className="mt-4 pt-4 border-t">
                <h4 className="text-sm font-semibold mb-2">Status Timeline</h4>
                <div className="space-y-2 text-sm">
                  {selectedSubmission.timeline.slice().reverse().map((event, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs">
                      <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                      <div>
                        <p className="font-medium capitalize">
                          {event.status.replace('_', ' ')}
                        </p>
                        <p className="text-muted-foreground">
                          {new Date(event.timestamp).toLocaleString()} by {event.by}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedSubmission.collectorId && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="text-sm font-semibold mb-2">Assigned Collector</h4>
                  <p className="text-xs text-muted-foreground">
                    ID: {selectedSubmission.collectorId}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}