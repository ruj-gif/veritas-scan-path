import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, MapPin, Award } from 'lucide-react';

interface Farm {
  id: string;
  name: string;
  location: string;
  area_hectares: number;
  certification_type: string;
}

interface FarmManagementModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  farms: Farm[];
}

export default function FarmManagementModal({ open, onClose, onSuccess, farms }: FarmManagementModalProps) {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingFarm, setEditingFarm] = useState<Farm | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    areaHectares: '',
    certificationType: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      areaHectares: '',
      certificationType: ''
    });
    setEditingFarm(null);
    setShowForm(false);
  };

  const handleAddFarm = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEditFarm = (farm: Farm) => {
    setFormData({
      name: farm.name,
      location: farm.location,
      areaHectares: farm.area_hectares.toString(),
      certificationType: farm.certification_type || ''
    });
    setEditingFarm(farm);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setLoading(true);

    try {
      const farmData = {
        name: formData.name,
        location: formData.location,
        area_hectares: parseFloat(formData.areaHectares),
        certification_type: formData.certificationType || null,
        farmer_id: profile.id
      };

      let error;
      if (editingFarm) {
        ({ error } = await supabase
          .from('farms')
          .update(farmData)
          .eq('id', editingFarm.id));
      } else {
        ({ error } = await supabase
          .from('farms')
          .insert(farmData));
      }

      if (error) throw error;

      toast({
        title: editingFarm ? "Farm updated successfully!" : "Farm added successfully!",
        description: `${formData.name} has been ${editingFarm ? 'updated' : 'added'}.`,
      });

      onSuccess();
      resetForm();

    } catch (error: any) {
      toast({
        title: `Error ${editingFarm ? 'updating' : 'adding'} farm`,
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-primary flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Farm Management
          </DialogTitle>
        </DialogHeader>

        {!showForm ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Your Farms</h3>
              <Button onClick={handleAddFarm} className="bg-gradient-to-r from-primary to-secondary">
                <Plus className="h-4 w-4 mr-2" />
                Add Farm
              </Button>
            </div>

            {farms.length === 0 ? (
              <div className="text-center py-8">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No farms registered yet</p>
                <Button onClick={handleAddFarm} className="bg-gradient-to-r from-primary to-secondary">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Farm
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {farms.map((farm) => (
                  <Card key={farm.id}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{farm.name}</CardTitle>
                          <p className="text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {farm.location}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditFarm(farm)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Area</p>
                          <p className="font-medium">{farm.area_hectares} hectares</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Certification</p>
                          <p className="font-medium flex items-center gap-1">
                            {farm.certification_type ? (
                              <>
                                <Award className="h-4 w-4 text-green-500" />
                                {farm.certification_type}
                              </>
                            ) : (
                              <span className="text-muted-foreground">None</span>
                            )}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="farmName">Farm Name</Label>
              <Input
                id="farmName"
                placeholder="Enter farm name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Enter farm location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="area">Area (Hectares)</Label>
              <Input
                id="area"
                type="number"
                step="0.1"
                min="0"
                placeholder="Enter area in hectares"
                value={formData.areaHectares}
                onChange={(e) => handleInputChange('areaHectares', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="certification">Certification Type (Optional)</Label>
              <Input
                id="certification"
                placeholder="e.g., Organic, Fair Trade, etc."
                value={formData.certificationType}
                onChange={(e) => handleInputChange('certificationType', e.target.value)}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading || !formData.name || !formData.location || !formData.areaHectares}
                className="flex-1 bg-gradient-to-r from-primary to-secondary"
              >
                {loading ? 'Saving...' : (editingFarm ? 'Update Farm' : 'Add Farm')}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}