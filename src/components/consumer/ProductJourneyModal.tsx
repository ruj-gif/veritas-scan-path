import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  MapPin, 
  Calendar, 
  User, 
  Package, 
  Award,
  Truck,
  CheckCircle
} from 'lucide-react';

interface BatchDetails {
  id: string;
  batch_number: string;
  quantity_kg: number;
  harvest_date: string;
  status: string;
  quality_score: number;
  organic_certified: boolean;
  products: { name: string; category: string; description: string };
  farms: { name: string; location: string; area_hectares: number; certification_type: string };
  profiles: { full_name: string; email: string };
}

interface SupplyChainEvent {
  id: string;
  event_type: string;
  status: string;
  location: string;
  notes: string;
  timestamp: string;
  profiles: { full_name: string };
}

interface ProductJourneyModalProps {
  open: boolean;
  onClose: () => void;
  batchId: string | null;
}

export default function ProductJourneyModal({ open, onClose, batchId }: ProductJourneyModalProps) {
  const { toast } = useToast();
  const [batch, setBatch] = useState<BatchDetails | null>(null);
  const [events, setEvents] = useState<SupplyChainEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open && batchId) {
      fetchBatchDetails();
      fetchSupplyChainEvents();
    }
  }, [open, batchId]);

  const fetchBatchDetails = async () => {
    if (!batchId) return;

    try {
      const { data, error } = await supabase
        .from('batches')
        .select(`
          *,
          products (name, category, description),
          farms (name, location, area_hectares, certification_type),
          profiles (full_name, email)
        `)
        .eq('id', batchId)
        .single();

      if (error) throw error;
      setBatch(data);
    } catch (error: any) {
      toast({
        title: "Error loading batch details",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const fetchSupplyChainEvents = async () => {
    if (!batchId) return;

    try {
      const { data, error } = await supabase
        .from('supply_chain_events')
        .select(`
          *,
          profiles (full_name)
        `)
        .eq('batch_id', batchId)
        .order('timestamp', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading supply chain events",
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

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'harvest_registered': return Package;
      case 'quality_checked': return Award;
      case 'processed': return Package;
      case 'shipped': return Truck;
      case 'delivered': return CheckCircle;
      default: return Package;
    }
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center p-8">
            Loading product journey...
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!batch) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
          <div className="text-center p-8">
            Product details not found
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-primary text-2xl">Product Journey</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Overview */}
          <Card className="border-2 border-primary/20">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-primary">{batch.products.name}</h2>
                  <p className="text-muted-foreground">{batch.products.category}</p>
                  <p className="text-sm mt-2">{batch.products.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`${getStatusColor(batch.status)} text-white`}>
                    {batch.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                  {batch.organic_certified && (
                    <Badge variant="outline" className="border-green-500 text-green-500">
                      <Award className="h-3 w-3 mr-1" />
                      ORGANIC
                    </Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Batch Number</p>
                  <p className="font-semibold">{batch.batch_number}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Quantity</p>
                  <p className="font-semibold">{batch.quantity_kg}kg</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Quality Score</p>
                  <p className="font-semibold">{batch.quality_score}/10</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Harvest Date</p>
                  <p className="font-semibold">{new Date(batch.harvest_date).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Farm & Farmer Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-primary mb-3 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Farmer Information
                </h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{batch.profiles.full_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Contact</p>
                    <p className="font-medium">{batch.profiles.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-primary mb-3 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Farm Details
                </h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Farm Name</p>
                    <p className="font-medium">{batch.farms.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{batch.farms.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Area</p>
                    <p className="font-medium">{batch.farms.area_hectares} hectares</p>
                  </div>
                  {batch.farms.certification_type && (
                    <div>
                      <p className="text-sm text-muted-foreground">Certification</p>
                      <p className="font-medium flex items-center gap-1">
                        <Award className="h-4 w-4 text-green-500" />
                        {batch.farms.certification_type}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Supply Chain Timeline */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-primary mb-4 flex items-center gap-2">
                <Package className="h-5 w-5" />
                Supply Chain Journey
              </h3>
              
              {events.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No supply chain events recorded yet
                </div>
              ) : (
                <div className="space-y-4">
                  {events.map((event, index) => {
                    const EventIcon = getEventIcon(event.event_type);
                    return (
                      <div key={event.id} className="flex items-start gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`p-2 rounded-full ${getStatusColor(event.status)} bg-opacity-20`}>
                            <EventIcon className={`h-4 w-4 text-current`} />
                          </div>
                          {index < events.length - 1 && (
                            <div className="w-px h-8 bg-border mt-2" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-medium capitalize">
                              {event.event_type.replace('_', ' ')}
                            </h4>
                            <Badge className={`${getStatusColor(event.status)} text-white text-xs`}>
                              {event.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            {event.notes}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(event.timestamp).toLocaleString()}
                            </span>
                            {event.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {event.location}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {event.profiles.full_name}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}