import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Sprout, 
  Plus, 
  Package, 
  TrendingUp, 
  Calendar,
  MapPin,
  QrCode,
  Award
} from 'lucide-react';
import BatchRegistrationModal from '@/components/farmer/BatchRegistrationModal';
import FarmManagementModal from '@/components/farmer/FarmManagementModal';

interface Batch {
  id: string;
  batch_number: string;
  product_id: string;
  products: { name: string; category: string };
  quantity_kg: number;
  harvest_date: string;
  status: string;
  quality_score: number;
  organic_certified: boolean;
  farms: { name: string; location: string };
}

interface Farm {
  id: string;
  name: string;
  location: string;
  area_hectares: number;
  certification_type: string;
}

interface DashboardStats {
  totalBatches: number;
  totalQuantity: number;
  activeBatches: number;
  avgQualityScore: number;
}

export default function FarmerDashboard() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [batches, setBatches] = useState<Batch[]>([]);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalBatches: 0,
    totalQuantity: 0,
    activeBatches: 0,
    avgQualityScore: 0
  });
  const [loading, setLoading] = useState(true);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [showFarmModal, setShowFarmModal] = useState(false);

  useEffect(() => {
    if (profile) {
      fetchFarmerData();
    }
  }, [profile]);

  const fetchFarmerData = async () => {
    if (!profile) return;

    try {
      // Fetch batches
      const { data: batchesData, error: batchesError } = await supabase
        .from('batches')
        .select(`
          *,
          products (name, category),
          farms (name, location)
        `)
        .eq('farmer_id', profile.id)
        .order('created_at', { ascending: false });

      if (batchesError) throw batchesError;

      // Fetch farms
      const { data: farmsData, error: farmsError } = await supabase
        .from('farms')
        .select('*')
        .eq('farmer_id', profile.id);

      if (farmsError) throw farmsError;

      setBatches(batchesData || []);
      setFarms(farmsData || []);

      // Calculate stats
      const totalBatches = batchesData?.length || 0;
      const totalQuantity = batchesData?.reduce((sum, batch) => sum + batch.quantity_kg, 0) || 0;
      const activeBatches = batchesData?.filter(batch => batch.status !== 'delivered').length || 0;
      const avgQualityScore = batchesData?.length 
        ? batchesData.reduce((sum, batch) => sum + (batch.quality_score || 0), 0) / batchesData.length 
        : 0;

      setStats({
        totalBatches,
        totalQuantity,
        activeBatches,
        avgQualityScore: Math.round(avgQualityScore * 10) / 10
      });

    } catch (error: any) {
      toast({
        title: "Error loading data",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
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

  const generateQRCode = async (batchId: string) => {
    try {
      const qrCode = `AV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const { error } = await supabase
        .from('qr_codes')
        .insert({ batch_id: batchId, qr_code: qrCode });

      if (error) throw error;

      toast({
        title: "QR Code Generated",
        description: `QR Code: ${qrCode}`,
      });

      fetchFarmerData(); // Refresh data
    } catch (error: any) {
      toast({
        title: "Error generating QR code",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Farmer Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {profile?.full_name}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowFarmModal(true)} variant="outline">
            <MapPin className="h-4 w-4 mr-2" />
            Manage Farms
          </Button>
          <Button onClick={() => setShowBatchModal(true)} className="bg-gradient-to-r from-primary to-secondary">
            <Plus className="h-4 w-4 mr-2" />
            Register Harvest
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Batches</p>
                <p className="text-2xl font-bold text-primary">{stats.totalBatches}</p>
              </div>
              <Package className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Quantity</p>
                <p className="text-2xl font-bold text-primary">{stats.totalQuantity}kg</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Batches</p>
                <p className="text-2xl font-bold text-primary">{stats.activeBatches}</p>
              </div>
              <Sprout className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Quality Score</p>
                <p className="text-2xl font-bold text-primary">{stats.avgQualityScore}/10</p>
              </div>
              <Award className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Batches */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Recent Batches
          </CardTitle>
        </CardHeader>
        <CardContent>
          {batches.length === 0 ? (
            <div className="text-center py-8">
              <Sprout className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No batches registered yet</p>
              <Button 
                onClick={() => setShowBatchModal(true)} 
                className="mt-4 bg-gradient-to-r from-primary to-secondary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Register Your First Harvest
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {batches.map((batch) => (
                <div key={batch.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-primary">{batch.products.name}</h3>
                      <p className="text-sm text-muted-foreground">Batch #{batch.batch_number}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${getStatusColor(batch.status)} text-white`}>
                        {batch.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                      {batch.organic_certified && (
                        <Badge variant="outline" className="border-green-500 text-green-500">
                          ORGANIC
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Quantity</p>
                      <p className="font-medium">{batch.quantity_kg}kg</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Harvest Date</p>
                      <p className="font-medium">{new Date(batch.harvest_date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Quality Score</p>
                      <p className="font-medium">{batch.quality_score}/10</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Farm</p>
                      <p className="font-medium">{batch.farms.name}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => generateQRCode(batch.id)}
                    >
                      <QrCode className="h-4 w-4 mr-2" />
                      Generate QR Code
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <BatchRegistrationModal 
        open={showBatchModal} 
        onClose={() => setShowBatchModal(false)}
        onSuccess={fetchFarmerData}
        farms={farms}
      />
      
      <FarmManagementModal 
        open={showFarmModal} 
        onClose={() => setShowFarmModal(false)}
        onSuccess={fetchFarmerData}
        farms={farms}
      />
    </div>
  );
}