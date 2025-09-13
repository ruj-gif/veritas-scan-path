import { useTranslation } from "react-i18next"
import { Package, CheckCircle, TrendingUp, Clock } from "lucide-react"

import { StatsCard } from "@/components/dashboard/StatsCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import heroFarming from "@/assets/hero-farming.jpg"

export default function Dashboard() {
  const { t } = useTranslation()

  // Mock data
  const stats = [
    {
      title: t('products_scanned'),
      value: 12,
      change: "+3 this week",
      icon: Package,
    },
    {
      title: t('verified_products'),
      value: 11,
      change: "91% success rate",
      icon: CheckCircle,
    },
    {
      title: t('sustainability_score'),
      value: "95%",
      change: "+5% this month",
      icon: TrendingUp,
    },
  ]

  const recentScans = [
    {
      id: "AV2024-TUR-001",
      product: "Organic Turmeric Powder",
      farmer: "Rajesh Kumar",
      date: "2024-09-10",
      verified: true,
    },
    {
      id: "AV2024-ASH-002", 
      product: "Ashwagandha Root Extract",
      farmer: "Priya Sharma",
      date: "2024-09-08",
      verified: true,
    },
    {
      id: "AV2024-GIN-003",
      product: "Ginger Essential Oil",
      farmer: "Kumar Patel",
      date: "2024-09-05",
      verified: true,
    },
  ]

  return (
    <div className="space-y-8 p-6">
      {/* Hero Section */}
      <div className="relative rounded-xl overflow-hidden">
        <div 
          className="h-64 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${heroFarming})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/60"></div>
          <div className="relative z-10 h-full flex items-center justify-center text-center text-primary-foreground">
            <div className="space-y-4 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold">
                {t('hero_title')}
              </h1>
              <p className="text-lg md:text-xl opacity-90 max-w-2xl">
                {t('hero_subtitle')}
              </p>
              <div className="flex gap-4 justify-center">
                <Button variant="hero" size="xl">
                  {t('scan_qr_button')}
                </Button>
                <Button variant="secondary" size="xl">
                  {t('learn_more')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="animate-slide-up">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {t('welcome_back')}
        </h2>
        <p className="text-muted-foreground">
          Track your verified products and sustainability impact
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            icon={stat.icon}
            className="animate-scale-in"
          />
        ))}
      </div>

      {/* Recent Scans */}
      <Card className="animate-slide-up">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {t('recent_scans')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentScans.map((scan, index) => (
              <div
                key={scan.id}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{scan.product}</p>
                    <Badge variant="secondary" className="bg-success text-success-foreground">
                      ✅ Verified
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Farmer: {scan.farmer} • {scan.date}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {scan.id}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}