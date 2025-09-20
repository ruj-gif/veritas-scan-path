import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  QrCode, 
  Shield, 
  Award,
  MapPin,
  Calendar,
  User,
  Sprout,
  Package
} from 'lucide-react';
import ProductJourneyModal from '@/components/consumer/ProductJourneyModal';

interface Verification {
  id: string;
  batch_id: string;
  qr_code: string;
  verified_at: string;
  batches: {
    id: string;
    batch_number: string;
    quantity_kg: number;
    harvest_date: string;
    status: string;
    quality_score: number;
    organic_certified: boolean;
    products: { name: string; category: string };
    farms: { name: string; location: string };
    profiles: { full_name: string };
  };
}

export default function ConsumerDashboard() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);
  const [qrCode, setQrCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      fetchVerifications();
    }
  }, [profile]);

  const fetchVerifications = async () => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('verifications')
        .select(`
          *,
          batches (
            *,
            products (name, category),
            farms (name, location),
            profiles (full_name)
          )
        `)
        .eq('consumer_id', profile.id)
        .order('verified_at', { ascending: false });

      if (error) throw error;
      setVerifications(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading verifications",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyQRCode = async () => {
    if (!qrCode.trim()) {
      toast({
        title: "Invalid QR Code",
        description: "Please enter a QR code to verify",
        variant: "destructive"
      });
      return;
    }

    setVerifying(true);

    try {
      // Check if QR code exists
      const { data: qrData, error: qrError } = await supabase
        .from('qr_codes')
        .select(`
          *,
          batches (
            *,
            products (name, category),
            farms (name, location),
            profiles (full_name)
          )
        `)
        .eq('qr_code', qrCode)
        .single();

      if (qrError) {
        toast({
          title: "Invalid QR Code",
          description: "This QR code is not valid or doesn't exist in our system",
          variant: "destructive"
        });
        return;
      }

      // Record the verification
      const { error: verificationError } = await supabase
        .from('verifications')
        .insert({
          batch_id: qrData.batch_id,
          consumer_id: profile?.id || null,
          qr_code: qrCode,
          scan_location: 'Manual Entry'
        });

      if (verificationError) throw verificationError;

      toast({
        title: "Product Verified!",
        description: `Successfully verified ${qrData.batches.products.name}`,
      });

      setQrCode('');
      fetchVerifications();
      setSelectedBatch(qrData.batch_id);

    } catch (error: any) {
      toast({
        title: "Error verifying product",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setVerifying(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'harvested': return 'bg-primary';
      case 'processed': return 'bg-blue-500';
      case 'in_transit': return 'bg-yellow-500';
      case 'delivered': return 'bg-green-500';
      case 'verified': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">Product Verification</h1>
        <p className="text-muted-foreground">
          Verify the authenticity of your Ayurvedic products and trace their complete journey
        </p>
      </div>

      {/* QR Verification Section */}
      <Card className="border-2 border-primary/20">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-primary">
            <Shield className="h-6 w-6" />
            Verify Product Authenticity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Enter QR code or scan using camera"
                value={qrCode}
                onChange={(e) => setQrCode(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && verifyQRCode()}
              />
            </div>
            <Button 
              onClick={() => navigate('/scanner')}
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white"
            >
              <QrCode className="h-4 w-4 mr-2" />
              Scan
            </Button>
            <Button 
              onClick={verifyQRCode}
              disabled={verifying || !qrCode.trim()}
              className="bg-gradient-to-r from-primary to-secondary"
            >
              {verifying ? 'Verifying...' : 'Verify'}
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            Scan the QR code on your product packaging or enter it manually above
          </div>
        </CardContent>
      </Card>

      {/* Recent Verifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Recent Verifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          {verifications.length === 0 ? (
            <div className="text-center py-8">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No products verified yet</p>
              <p className="text-sm text-muted-foreground">
                Start by scanning a QR code on your Ayurvedic product
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {verifications.map((verification) => (
                <div key={verification.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-primary text-lg">
                        {verification.batches.products.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Verified on {new Date(verification.verified_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${getStatusColor(verification.batches.status)} text-white`}>
                        {verification.batches.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                      {verification.batches.organic_certified && (
                        <Badge variant="outline" className="border-green-500 text-green-500">
                          <Award className="h-3 w-3 mr-1" />
                          ORGANIC
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Farmer</p>
                        <p className="font-medium">{verification.batches.profiles.full_name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Farm</p>
                        <p className="font-medium">{verification.batches.farms.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Harvest Date</p>
                        <p className="font-medium">
                          {new Date(verification.batches.harvest_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span>Batch #{verification.batches.batch_number}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="h-4 w-4 text-muted-foreground" />
                        <span>Quality: {verification.batches.quality_score}/10</span>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setSelectedBatch(verification.batches.id)}
                      className="border-primary text-primary hover:bg-primary hover:text-white"
                    >
                      View Journey
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Product Journey Modal */}
      <ProductJourneyModal 
        open={!!selectedBatch}
        onClose={() => setSelectedBatch(null)}
        batchId={selectedBatch}
      />
    </div>
  );
}