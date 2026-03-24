import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Truck, ScanLine, MapPin, CheckCircle2, Clock, Package,
  User2, Mail, Hash, Weight, Navigation, Camera, X,
  Check, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import DashboardLayout from '@/components/DashboardLayout';
import KPICard from '@/components/KPICard';
import StatusBadge from '@/components/StatusBadge';
import WasteTypeBadge from '@/components/WasteTypeBadge';
import MapComponent from '@/components/MapComponent';
import { getWasteSubmissions, updateWasteStatus, assignCollector } from '@/lib/wasteService';
import { WasteSubmission, WasteStatus, User } from '@/lib/types';

const statusFlow: WasteStatus[] = ['collected', 'in_transit', 'delivered'];

export default function CollectorDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [submissions, setSubmissions] = useState<WasteSubmission[]>([]);
  const [scannedSubmission, setScannedSubmission] = useState<WasteSubmission | null>(null);
  const [qrInput, setQrInput] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<WasteSubmission | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [collectorLocation, setCollectorLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('tb_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      
      const allSubmissions = getWasteSubmissions();
      const pendingSubmissions = allSubmissions.filter(s => 
        s.status !== 'processed' && (!s.collectorId || s.collectorId === parsedUser.uid)
      );
      setSubmissions(pendingSubmissions);
    }
    
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          setCollectorLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          setCollectorLocation({ lat: 19.0760, lng: 72.8777 });
        }
      );
    }
  }, []);

  const handleScanQR = (qrCode: string) => {
    try {
      const decoded = atob(qrCode);
      const data = JSON.parse(decoded);
      
      const submission = getWasteSubmissions().find(s => s.id === data.id);
      if (submission) {
        setScannedSubmission(submission);
        setShowScanner(false);
      } else {
        alert('Waste submission not found');
      }
    } catch (error) {
      console.error('Error scanning QR:', error);
      alert('Invalid QR code');
    }
  };

  const handleManualScan = () => {
    if (!qrInput) return;
    handleScanQR(qrInput);
    setQrInput('');
  };

  const handleUpdateStatus = (submission: WasteSubmission, newStatus: WasteStatus) => {
    if (!user) return;
    
    if (!submission.collectorId) {
      assignCollector(submission.id, user.uid);
    }
    
    updateWasteStatus(
      submission.id,
      newStatus,
      user.name,
      collectorLocation || undefined
    );
    
    const allSubmissions = getWasteSubmissions();
    const pendingSubmissions = allSubmissions.filter(s => 
      s.status !== 'processed' && (!s.collectorId || s.collectorId === user.uid)
    );
    setSubmissions(pendingSubmissions);
    setScannedSubmission(null);
  };

  const getRouteCoordinates = (submission: WasteSubmission): [number, number][] => {
    const coords: [number, number][] = [[submission.location.lat, submission.location.lng]];
    if (collectorLocation) {
      coords.push([collectorLocation.lat, collectorLocation.lng]);
    }
    if (submission.currentLocation) {
      coords.push([submission.currentLocation.lat, submission.currentLocation.lng]);
    }
    return coords;
  };

  const collectedCount = submissions.filter(s => s.status === 'collected').length;
  const deliveredCount = submissions.filter(s => s.status === 'delivered').length;
  const inTransitCount = submissions.filter(s => s.status === 'in_transit').length;

  // Prepare markers for map
  const mapMarkers = [
    ...(collectorLocation ? [{
      position: [collectorLocation.lat, collectorLocation.lng] as [number, number],
      popup: 'Your Location (Collector)'
    }] : []),
    ...submissions.map(sub => ({
      position: [sub.location.lat, sub.location.lng] as [number, number],
      popup: `ID: ${sub.id.slice(0, 12)}...\nCitizen: ${sub.citizenName}\nType: ${sub.wasteType}\nStatus: ${sub.status}\nWeight: ${sub.weight} kg`
    }))
  ];

  return (
    <DashboardLayout title="Collector Interface">
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-500/10 to-blue-500/5 rounded-2xl">
        <h2 className="text-xl font-bold text-accent">Welcome, {user?.name}! 🚛</h2>
        <p className="text-sm text-muted-foreground">Manage waste collection and track routes</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <KPICard title="Pending Pickups" value={submissions.filter(s => s.status === 'submitted').length} icon={Package} delay={0} />
        <KPICard title="Collected" value={collectedCount} icon={CheckCircle2} trend={5} delay={0.1} />
        <KPICard title="In Transit" value={inTransitCount} icon={Truck} delay={0.2} />
        <KPICard title="Delivered" value={deliveredCount} icon={MapPin} delay={0.3} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="gov-card p-4 bg-white">
            <h3 className="text-lg font-bold text-accent mb-4 flex items-center gap-2">
              <Navigation className="w-5 h-5 text-primary" /> Live Collection Map
            </h3>
            <div className="h-[400px] rounded-xl overflow-hidden border bg-gray-50">
              {collectorLocation && (
                <MapComponent
                  center={[collectorLocation.lat, collectorLocation.lng]}
                  zoom={13}
                  markers={mapMarkers}
                  polyline={selectedSubmission ? getRouteCoordinates(selectedSubmission) : undefined}
                />
              )}
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="gov-card p-6 bg-white">
            <h3 className="text-lg font-bold text-accent mb-4 flex items-center gap-2">
              <ScanLine className="w-5 h-5 text-primary" /> QR Scanner Terminal
            </h3>
            
            <Button 
              onClick={() => setShowScanner(true)} 
              className="w-full h-24 text-lg font-black uppercase tracking-widest bg-gradient-to-r from-primary to-primary/80"
            >
              <Camera className="w-6 h-6 mr-2" /> Launch Scanner
            </Button>
            
            <div className="mt-4">
              <div className="relative">
                <Input
                  value={qrInput}
                  onChange={(e) => setQrInput(e.target.value)}
                  placeholder="Or enter QR code manually"
                  className="pr-24"
                />
                <Button 
                  size="sm" 
                  className="absolute right-1 top-1"
                  onClick={handleManualScan}
                >
                  Verify
                </Button>
              </div>
            </div>
          </motion.div>

          {scannedSubmission && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="gov-card p-6 bg-white border-2 border-primary/20">
              <h3 className="text-lg font-bold text-accent mb-4">Scanned Waste Details</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Hash className="w-4 h-4 text-muted-foreground" />
                  <span className="font-mono">{scannedSubmission.id}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <User2 className="w-4 h-4 text-muted-foreground" />
                  <span>{scannedSubmission.citizenName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{scannedSubmission.citizenEmail}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Package className="w-4 h-4 text-muted-foreground" />
                  <WasteTypeBadge type={scannedSubmission.wasteType} />
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Weight className="w-4 h-4 text-muted-foreground" />
                  <span>{scannedSubmission.weight} kg</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="truncate">{scannedSubmission.location.address || 'Address provided'}</span>
                </div>
                {scannedSubmission.imageUrl && (
                  <div className="mt-2">
                    <img src={scannedSubmission.imageUrl} alt="Waste" className="max-h-32 rounded-lg mx-auto" />
                  </div>
                )}
                
                <div className="flex gap-2 mt-4">
                  {statusFlow.map((status) => (
                    <Button
                      key={status}
                      size="sm"
                      variant={scannedSubmission.status === status ? "default" : "outline"}
                      onClick={() => handleUpdateStatus(scannedSubmission, status)}
                      className="flex-1"
                      disabled={scannedSubmission.status === 'delivered'}
                    >
                      {status === 'collected' && <CheckCircle2 className="w-4 h-4 mr-1" />}
                      {status === 'in_transit' && <Truck className="w-4 h-4 mr-1" />}
                      {status === 'delivered' && <MapPin className="w-4 h-4 mr-1" />}
                      {status.replace('_', ' ')}
                    </Button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="gov-card p-6 bg-white">
            <h3 className="text-lg font-bold text-accent mb-4">Active Collection Queue</h3>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {submissions.map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-border/20 hover:border-border/40 transition-all"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <WasteTypeBadge type={sub.wasteType} />
                      <span className="text-xs font-mono text-muted-foreground">{sub.id.slice(0, 12)}...</span>
                      <StatusBadge status={sub.status} />
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User2 className="w-3 h-3" />
                        {sub.citizenName}
                      </span>
                      <span>{sub.weight} kg</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setSelectedSubmission(sub);
                      setScannedSubmission(sub);
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {submissions.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No pending collections. Great job!</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <Dialog open={showScanner} onOpenChange={setShowScanner}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Scan QR Code</DialogTitle>
          </DialogHeader>
          <div className="text-center p-6">
            <div className="border-2 border-dashed border-primary/30 rounded-xl p-8 mb-4 bg-primary/5">
              <ScanLine className="w-16 h-16 text-primary mx-auto mb-3 animate-pulse" />
              <p className="text-sm text-muted-foreground">Position QR code in front of camera</p>
            </div>
            <p className="text-xs text-muted-foreground mb-4">Simulated scanner - paste QR code below</p>
            <div className="flex gap-2">
              <Input
                placeholder="Paste QR code here"
                onChange={(e) => setQrInput(e.target.value)}
              />
              <Button onClick={() => {
                if (qrInput) handleScanQR(qrInput);
              }}>
                <Check className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}