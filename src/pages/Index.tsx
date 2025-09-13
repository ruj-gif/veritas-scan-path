// Update this page (the content is just a fallback if you fail to update the page)

import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"

const Index = () => {
  const { t } = useTranslation()
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-hero">
      <div className="text-center text-primary-foreground space-y-6 animate-fade-in">
        <h1 className="mb-4 text-5xl font-bold">{t('hero_title')}</h1>
        <p className="text-xl opacity-90 max-w-2xl">{t('hero_subtitle')}</p>
        <Button variant="secondary" size="lg">
          {t('scan_qr_button')}
        </Button>
      </div>
    </div>
  );
};

export default Index;
