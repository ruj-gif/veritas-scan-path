import { useState, useEffect } from "react"
import { QrCode, Camera, CheckCircle, AlertCircle } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ScanResult {
  batchId: string
  productName: string
  verified: boolean
  farmerName: string
  harvestDate: string
  location: string
}

export function QRScanner() {
  const { t } = useTranslation()
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Mock scanning function - replace with actual camera integration
  const startScan = () => {
    setIsScanning(true)
    setError(null)
    setScanResult(null)

    // Simulate scanning process
    setTimeout(() => {
      // Mock scan result
      const mockResult: ScanResult = {
        batchId: "AV2024-TUR-001",
        productName: "Organic Turmeric Powder",
        verified: true,
        farmerName: "Rajesh Kumar",
        harvestDate: "2024-08-15",
        location: "Kerala, India"
      }
      
      setScanResult(mockResult)
      setIsScanning(false)
    }, 3000)
  }

  return (
    <div className="space-y-6">
      {/* Scanner Interface */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-subtle">
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            {t('scan_product')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            {/* Camera Preview Placeholder */}
            <div className="mx-auto w-80 h-80 bg-muted rounded-lg border-2 border-dashed border-border flex items-center justify-center">
              {isScanning ? (
                <div className="text-center space-y-4">
                  <div className="animate-pulse">
                    <Camera className="h-16 w-16 mx-auto text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {t('scanning')}
                  </p>
                  <div className="w-32 h-32 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
              ) : scanResult ? (
                <div className="text-center space-y-4">
                  <CheckCircle className="h-16 w-16 mx-auto text-success" />
                  <p className="text-sm text-muted-foreground">
                    {t('product_verified')}
                  </p>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <QrCode className="h-16 w-16 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Position QR code within the frame
                  </p>
                </div>
              )}
            </div>

            {/* Scan Button */}
            <Button
              variant={isScanning ? "secondary" : "scan"}
              size="lg"
              onClick={startScan}
              disabled={isScanning}
              className="w-full"
            >
              {isScanning ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  {t('scanning')}
                </>
              ) : (
                <>
                  <Camera className="mr-2 h-4 w-4" />
                  {t('scan_qr_button')}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Scan Results */}
      {scanResult && (
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{t('scan_result')}</span>
              <Badge variant="secondary" className="bg-success text-success-foreground">
                {t('blockchain_verified')}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Product Name</p>
                <p className="font-semibold">{scanResult.productName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Batch ID</p>
                <p className="font-semibold font-mono">{scanResult.batchId}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('farmer_details')}</p>
                <p className="font-semibold">{scanResult.farmerName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-semibold">{scanResult.location}</p>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <Button variant="outline" className="w-full">
                View Full Supply Chain
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-destructive">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}