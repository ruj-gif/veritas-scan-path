import { QRScanner } from "@/components/scanner/QRScanner"

export default function Scanner() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            QR Code Scanner
          </h1>
          <p className="text-muted-foreground">
            Scan product QR codes to view their complete supply chain verification
          </p>
        </div>
        
        <QRScanner />
      </div>
    </div>
  )
}