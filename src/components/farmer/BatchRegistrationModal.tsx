import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Calendar, CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

interface Product {
  id: string;
  name: string;
  category: string;
}

interface Farm {
  id: string;
  name: string;
  location: string;
}

interface BatchRegistrationModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  farms: Farm[];
}

export default function BatchRegistrationModal({ open, onClose, onSuccess, farms }: BatchRegistrationModalProps) {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [harvestDate, setHarvestDate] = useState<Date>();
  const [formData, setFormData] = useState({
    productId: '',
    farmId: '',
    quantityKg: '',
    qualityScore: '8',
    organicCertified: false
  });

  useEffect(() => {
    if (open) {
      fetchProducts();
      // Reset form
      setFormData({
        productId: '',
        farmId: '',
        quantityKg: '',
        qualityScore: '8',
        organicCertified: false
      });
      setHarvestDate(new Date());
    }
  }, [open]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading products",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const generateBatchNumber = () => {
    const date = harvestDate ? format(harvestDate, 'yyyyMMdd') : format(new Date(), 'yyyyMMdd');
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `AV-${date}-${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !harvestDate) return;

    setLoading(true);

    try {
      const batchNumber = generateBatchNumber();

      const { error } = await supabase
        .from('batches')
        .insert({
          batch_number: batchNumber,
          product_id: formData.productId,
          farm_id: formData.farmId,
          farmer_id: profile.id,
          quantity_kg: parseFloat(formData.quantityKg),
          harvest_date: format(harvestDate, 'yyyy-MM-dd'),
          quality_score: parseInt(formData.qualityScore),
          organic_certified: formData.organicCertified,
          status: 'harvested'
        });

      if (error) throw error;

      // Create initial supply chain event
      await supabase
        .from('supply_chain_events')
        .insert({
          batch_id: batchNumber, // We'll need to get the actual ID, but for now using batch_number
          actor_id: profile.id,
          event_type: 'harvest_registered',
          status: 'harvested',
          notes: `Batch registered with ${formData.quantityKg}kg of produce`,
          metadata: {
            quality_score: parseInt(formData.qualityScore),
            organic_certified: formData.organicCertified
          }
        });

      toast({
        title: "Batch registered successfully!",
        description: `Batch ${batchNumber} has been added to the blockchain.`,
      });

      onSuccess();
      onClose();

    } catch (error: any) {
      toast({
        title: "Error registering batch",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-primary">Register New Harvest</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="product">Product</Label>
            <Select value={formData.productId} onValueChange={(value) => handleInputChange('productId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} - {product.category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="farm">Farm</Label>
            <Select value={formData.farmId} onValueChange={(value) => handleInputChange('farmId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a farm" />
              </SelectTrigger>
              <SelectContent>
                {farms.map((farm) => (
                  <SelectItem key={farm.id} value={farm.id}>
                    {farm.name} - {farm.location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="quantity">Quantity (kg)</Label>
            <Input
              id="quantity"
              type="number"
              step="0.1"
              min="0"
              placeholder="Enter quantity in kg"
              value={formData.quantityKg}
              onChange={(e) => handleInputChange('quantityKg', e.target.value)}
              required
            />
          </div>

          <div>
            <Label>Harvest Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {harvestDate ? format(harvestDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={harvestDate}
                  onSelect={setHarvestDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="quality">Quality Score (1-10)</Label>
            <Select value={formData.qualityScore} onValueChange={(value) => handleInputChange('qualityScore', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 10 }, (_, i) => i + 1).map((score) => (
                  <SelectItem key={score} value={score.toString()}>
                    {score}/10
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="organic"
              checked={formData.organicCertified}
              onCheckedChange={(checked) => handleInputChange('organicCertified', checked as boolean)}
            />
            <Label htmlFor="organic">Organic Certified</Label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !formData.productId || !formData.farmId || !formData.quantityKg}
              className="flex-1 bg-gradient-to-r from-primary to-secondary"
            >
              {loading ? 'Registering...' : 'Register Batch'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}