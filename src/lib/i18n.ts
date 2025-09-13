import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      "dashboard": "Dashboard",
      "scan_product": "Scan Product", 
      "my_kyc": "My KYC",
      "supply_chain": "Supply Chain Trace",
      "reports": "Reports",
      "settings": "Settings",
      
      // Hero Section
      "hero_title": "Verify. Trust. Trace.",
      "hero_subtitle": "Transparent supply chain verification for herbal products",
      "scan_qr_button": "Scan QR Code",
      "learn_more": "Learn More",
      
      // Dashboard
      "welcome_back": "Welcome back",
      "products_scanned": "Products Scanned",
      "verified_products": "Verified Products", 
      "sustainability_score": "Sustainability Score",
      "recent_scans": "Recent Scans",
      
      // KYC
      "kyc_registration": "KYC Registration",
      "full_name": "Full Name",
      "phone_number": "Phone Number",
      "email_address": "Email Address",
      "id_proof": "ID Proof",
      "submit": "Submit",
      
      // Scanner
      "scanning": "Scanning...",
      "scan_result": "Scan Result",
      "product_verified": "Product Verified",
      "blockchain_verified": "✅ Verified on Ayur-Veritas Blockchain",
      
      // Supply Chain
      "farmer_details": "Farmer Details",
      "harvest_info": "Harvest Information",
      "processing_steps": "Processing Steps",
      "lab_results": "Lab Results",
      "distribution": "Distribution",
    }
  },
  hi: {
    translation: {
      // Navigation  
      "dashboard": "डैशबोर्ड",
      "scan_product": "उत्पाद स्कैन करें",
      "my_kyc": "मेरी केवाईसी", 
      "supply_chain": "आपूर्ति श्रृंखला",
      "reports": "रिपोर्ट",
      "settings": "सेटिंग्स",
      
      // Hero Section
      "hero_title": "सत्यापित करें। भरोसा करें। ट्रेस करें।",
      "hero_subtitle": "हर्बल उत्पादों के लिए पारदर्शी आपूर्ति श्रृंखला सत्यापन",
      "scan_qr_button": "क्यूआर कोड स्कैन करें",
      "learn_more": "और जानें",
      
      // Dashboard
      "welcome_back": "वापसी पर स्वागत",
      "products_scanned": "स्कैन किए गए उत्पाद",
      "verified_products": "सत्यापित उत्पाद",
      "sustainability_score": "स्थिरता स्कोर", 
      "recent_scans": "हाल की स्कैन",
      
      // KYC
      "kyc_registration": "केवाईसी पंजीकरण",
      "full_name": "पूरा नाम",
      "phone_number": "फोन नंबर",
      "email_address": "ईमेल पता",
      "id_proof": "पहचान प्रमाण",
      "submit": "जमा करें",
      
      // Scanner
      "scanning": "स्कैनिंग...",
      "scan_result": "स्कैन परिणाम",
      "product_verified": "उत्पाद सत्यापित",
      "blockchain_verified": "✅ आयुर-वेरिटास ब्लॉकचेन पर सत्यापित",
      
      // Supply Chain
      "farmer_details": "किसान विवरण",
      "harvest_info": "फसल की जानकारी",
      "processing_steps": "प्रसंस्करण चरण",
      "lab_results": "प्रयोगशाला परिणाम",
      "distribution": "वितरण",
    }
  },
  mr: {
    translation: {
      // Navigation
      "dashboard": "डॅशबोर्ड",
      "scan_product": "उत्पादन स्कॅन करा",
      "my_kyc": "माझे केवायसी",
      "supply_chain": "पुरवठा साखळी",
      "reports": "अहवाल",
      "settings": "सेटिंग्ज",
      
      // Hero Section  
      "hero_title": "सत्यापित करा. विश्वास ठेवा. मागोवा घ्या.",
      "hero_subtitle": "हर्बल उत्पादनांसाठी पारदर्शक पुरवठा साखळी सत्यापन",
      "scan_qr_button": "क्यूआर कोड स्कॅन करा",
      "learn_more": "आणखी जाणून घ्या",
      
      // Dashboard
      "welcome_back": "परत आपले स्वागत",
      "products_scanned": "स्कॅन केलेली उत्पादने",
      "verified_products": "सत्यापित उत्पादने",
      "sustainability_score": "टिकाऊपणा गुण",
      "recent_scans": "अलीकडील स्कॅन",
      
      // KYC
      "kyc_registration": "केवायसी नोंदणी",
      "full_name": "पूर्ण नाव",
      "phone_number": "फोन नंबर", 
      "email_address": "ईमेल पत्ता",
      "id_proof": "ओळख पुरावा",
      "submit": "सबमिट करा",
      
      // Scanner
      "scanning": "स्कॅनिंग...",
      "scan_result": "स्कॅन परिणाम",
      "product_verified": "उत्पादन सत्यापित",
      "blockchain_verified": "✅ आयुर-वेरिटास ब्लॉकचेनवर सत्यापित",
      
      // Supply Chain
      "farmer_details": "शेतकरी तपशील",
      "harvest_info": "कापणी माहिती",
      "processing_steps": "प्रक्रिया पायऱ्या",
      "lab_results": "प्रयोगशाळा परिणाम",
      "distribution": "वितरण",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;