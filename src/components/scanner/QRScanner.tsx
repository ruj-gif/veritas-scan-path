import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { QrCode, Camera, ArrowLeft, Check } from 'lucide-react';

export default function QRScanner() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [qrCode, setQrCode] = useState('');
  const [verifying, setVerifying] = useState(false);

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

      await supabase
        .from('verifications')
        .insert({
          batch_id: qrData.batch_id,
          consumer_id: null,
          qr_code: qrCode,
          scan_location: 'QR Scanner'
        });

      toast({
        title: "Product Verified!",
        description: `Successfully verified ${qrData.batches.products.name}`,
      });

      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-hero">
      <div className="w-full max-w-md mb-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="text-white hover:bg-white/20"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
      </div>

      <Card className="w-full max-w-md shadow-elegant">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <QrCode className="h-16 w-16 text-primary animate-pulse-slow" />
          </div>
          <CardTitle className="text-2xl font-bold text-primary">
            QR Code Scanner
          </CardTitle>
          <p className="text-muted-foreground">
            Scan or enter the QR code on your Ayurvedic product to verify its authenticity
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-muted rounded-lg p-8 text-center">
            <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Camera scanning feature coming soon
            </p>
            <div className="space-y-3">
              <Input
                placeholder="Enter QR code manually"
                value={qrCode}
                onChange={(e) => setQrCode(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && verifyQRCode()}
                className="text-center"
              />
              <Button 
                onClick={verifyQRCode}
                disabled={verifying || !qrCode.trim()}
                className="w-full bg-gradient-to-r from-primary to-secondary text-white"
              >
                {verifying ? 'Verifying...' : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Verify Product
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Need an account to track your verifications?
            </p>
            <Button 
              variant="link" 
              className="text-primary"
              onClick={() => navigate('/auth')}
            >
              Sign up or Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}