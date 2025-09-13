import { useState } from "react"
import { User, Upload, CheckCircle } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export default function KYC() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    idProof: null as File | null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Mock API call
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "KYC Submitted Successfully",
        description: "Your KYC details have been submitted for verification. You'll receive an update within 24 hours.",
        duration: 5000,
      })
    }, 2000)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, idProof: file }))
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground flex items-center justify-center gap-2">
            <User className="h-8 w-8" />
            {t('kyc_registration')}
          </h1>
          <p className="text-muted-foreground">
            Complete your KYC to access all features and track your verified products
          </p>
        </div>

        {/* KYC Form */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">{t('full_name')}</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">{t('phone_number')}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t('email_address')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="idProof">{t('id_proof')}</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                  <input
                    id="idProof"
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="idProof" className="cursor-pointer">
                    <div className="space-y-2">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {formData.idProof ? formData.idProof.name : "Click to upload ID proof (Aadhaar, PAN, Passport)"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Supported formats: JPG, PNG, PDF (Max 5MB)
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    {t('submit')}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Benefits Card */}
        <Card className="bg-gradient-subtle">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4">KYC Benefits</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                Access to complete supply chain tracking
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                Personalized sustainability reports
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                Priority customer support
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                Exclusive access to verified products
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}