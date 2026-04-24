import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// the translations
// (tip: move them in a JSON file and import them, or even better, manage them via a UI)
const resources = {
  en: {
    translation: {
      "explore": "Explore Weddings",
      "login": "Login",
      "logout": "Logout",
      "dashboard": "Dashboard",
      "welcome": "Welcome",
      "touristAccount": "Tourist Account",
      "hostAccount": "Host Account",
      "yourBookings": "Your Bookings",
      "noBookings": "You haven't booked any weddings yet.",
      "browseWeddings": "Browse Weddings",
      "loginRequired": "Please log in to view your dashboard",
      "homeHeroTitle": "Experience the Magic of an Authentic Indian Wedding",
      "homeHeroSubtitle": "Join families as an honored guest. Taste the food, dance to the music, and witness traditions that go back millennia.",
      "findWedding": "Find a Wedding"
    }
  },
  hi: {
    translation: {
      "explore": "शादियों का अन्वेषण करें",
      "login": "लॉग इन करें",
      "logout": "लॉग आउट करें",
      "dashboard": "डैशबोर्ड",
      "welcome": "स्वागत है",
      "touristAccount": "पर्यटक खाता",
      "hostAccount": "होस्ट खाता",
      "yourBookings": "आपकी बुकिंग",
      "noBookings": "आपने अभी तक किसी शादी की बुकिंग नहीं की है।",
      "browseWeddings": "शादियाँ ब्राउज़ करें",
      "loginRequired": "अपना डैशबोर्ड देखने के लिए कृपया लॉग इन करें",
      "homeHeroTitle": "एक प्रामाणिक भारतीय शादी के जादू का अनुभव करें",
      "homeHeroSubtitle": "एक सम्मानित अतिथि के रूप में परिवारों से जुड़ें। भोजन का स्वाद लें, संगीत पर नृत्य करें और सहस्राब्दियों पुरानी परंपराओं को देखें।",
      "findWedding": "एक शादी खोजें"
    }
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "en", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    fallbackLng: "en",
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
