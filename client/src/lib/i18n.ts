export type Locale = "en" | "tr" | "de";

const supportedLocales: Locale[] = ["en", "tr", "de"];

export function getLocaleFromPath(pathname: string): Locale {
  const first = pathname.split("/").filter(Boolean)[0]?.toLowerCase();
  if (supportedLocales.includes(first as Locale)) return first as Locale;
  return "en";
}

export function buildLocalizedPath(locale: Locale, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${normalized === "/" ? "" : normalized}`;
}

export function replaceLocaleInPath(pathname: string, newLocale: Locale): string {
  const parts = pathname.split("/");
  const first = parts.filter(Boolean)[0];
  if (first && supportedLocales.includes(first as Locale)) {
    // replace first non-empty segment
    let replaced = pathname.replace(new RegExp(`^/${first}`), `/${newLocale}`);
    return replaced === "" ? `/${newLocale}` : replaced;
  }
  // no locale prefix, add it
  return `/${newLocale}${pathname === "/" ? "" : pathname}`;
}

type Dictionary = Record<string, string>;

const dictionaries: Record<Locale, Dictionary> = {
  en: {
    hero_title: "Your Sun Specialist",
    hero_tagline_1: "Discover amazing destinations with SunExpress",
    hero_tagline_2: "From Europe to Turkey and beyond",
    tab_flights: "Flights",
    tab_hotels: "Hotels",
    tab_packages: "Packages",
    offers_title: "Early Bird Special",
    offers_subtitle: "Book now and save up to 25% on selected routes to Turkey",
    offers_view_all: "View All Offers",
    popular_title: "Popular Destinations",
    popular_subtitle: "Discover our most loved destinations",
    destinations_view_all: "View All Destinations",
    why_title: "Why Choose SunExpress?",
    why_subtitle: "Your comfort and satisfaction are our priority",
    feature_safety: "Safety First",
    feature_otp: "On-Time Performance",
    feature_service: "Exceptional Service",
    feature_service_desc: "Warm Turkish hospitality combined with European service standards for an unforgettable journey.",
    service_baggage: "Baggage",
    service_baggage_desc: "Generous baggage allowances",
    service_seats: "Seat Selection",
    service_seats_desc: "Choose your perfect seat",
    service_meals: "Meals",
    service_meals_desc: "Delicious onboard dining",
    service_wifi: "Wi-Fi",
    service_wifi_desc: "Stay connected in the sky",
    newsletter_title: "Stay Updated",
    newsletter_subtitle: "Get the latest deals and travel inspiration delivered to your inbox",
    newsletter_placeholder: "Enter your email",
    newsletter_subscribe: "Subscribe",
    header_book: "Book",
    header_checkin: "Check-in",
    header_destinations: "Destinations",
    header_offers: "Offers",
    header_my_booking: "My Booking",
    lang_label: "Language",
    confirm_book_another: "Book Another Flight",
  },
  tr: {
    hero_title: "Güneş Uzmanınız",
    hero_tagline_1: "SunExpress ile harika destinasyonları keşfedin",
    hero_tagline_2: "Avrupa'dan Türkiye'ye ve ötesine",
    tab_flights: "Uçuşlar",
    tab_hotels: "Oteller",
    tab_packages: "Paketler",
    offers_title: "Erken Rezervasyon Fırsatı",
    offers_subtitle: "Şimdi rezervasyon yapın ve seçili rotalarda %25'e varan tasarruf edin",
    offers_view_all: "Tüm Fırsatları Gör",
    popular_title: "Popüler Destinasyonlar",
    popular_subtitle: "En sevilen destinasyonlarımızı keşfedin",
    destinations_view_all: "Tüm Destinasyonları Gör",
    why_title: "Neden SunExpress?",
    why_subtitle: "Konforunuz ve memnuniyetiniz önceliğimizdir",
    feature_safety: "Önce Güvenlik",
    feature_otp: "Zamanında Performans",
    feature_service: "Üstün Hizmet",
    feature_service_desc: "Unutulmaz bir yolculuk için sıcak Türk misafirperverliği ve Avrupa hizmet standartları.",
    service_baggage: "Bagaj",
    service_baggage_desc: "Cömert bagaj hakları",
    service_seats: "Koltuk Seçimi",
    service_seats_desc: "Mükemmel koltuğunuzu seçin",
    service_meals: "Yemekler",
    service_meals_desc: "Lezzetli uçak içi ikram",
    service_wifi: "Wi‑Fi",
    service_wifi_desc: "Gökyüzünde bağlantıda kalın",
    newsletter_title: "Güncel Kalın",
    newsletter_subtitle: "En yeni fırsatları ve seyahat ilhamını e‑postanıza alın",
    newsletter_placeholder: "E‑postanızı girin",
    newsletter_subscribe: "Abone Ol",
    header_book: "Rezervasyon",
    header_checkin: "Check‑in",
    header_destinations: "Rotalar",
    header_offers: "Fırsatlar",
    header_my_booking: "Rezervasyonum",
    lang_label: "Dil",
    confirm_book_another: "Yeni Uçuş Rezervasyonu",
  },
  de: {
    hero_title: "Ihr Sonnenspezialist",
    hero_tagline_1: "Entdecken Sie tolle Reiseziele mit SunExpress",
    hero_tagline_2: "Von Europa in die Türkei und darüber hinaus",
    tab_flights: "Flüge",
    tab_hotels: "Hotels",
    tab_packages: "Pakete",
    offers_title: "Frühbucher‑Spezial",
    offers_subtitle: "Jetzt buchen und bis zu 25% auf ausgewählten Strecken sparen",
    offers_view_all: "Alle Angebote anzeigen",
    popular_title: "Beliebte Reiseziele",
    popular_subtitle: "Entdecken Sie unsere beliebtesten Ziele",
    destinations_view_all: "Alle Reiseziele anzeigen",
    why_title: "Warum SunExpress?",
    why_subtitle: "Ihr Komfort und Ihre Zufriedenheit stehen an erster Stelle",
    feature_safety: "Sicherheit zuerst",
    feature_otp: "Pünktlichkeit",
    feature_service: "Exzellenter Service",
    feature_service_desc: "Warme türkische Gastfreundschaft trifft europäische Servicestandards für eine unvergessliche Reise.",
    service_baggage: "Gepäck",
    service_baggage_desc: "Großzügige Gepäckregelungen",
    service_seats: "Sitzplatzwahl",
    service_seats_desc: "Wählen Sie Ihren perfekten Sitz",
    service_meals: "Mahlzeiten",
    service_meals_desc: "Leckeres Bordessen",
    service_wifi: "WLAN",
    service_wifi_desc: "Bleiben Sie in der Luft verbunden",
    newsletter_title: "Bleiben Sie informiert",
    newsletter_subtitle: "Die besten Angebote und Reiseinspiration per E‑Mail",
    newsletter_placeholder: "E‑Mail eingeben",
    newsletter_subscribe: "Abonnieren",
    header_book: "Buchen",
    header_checkin: "Check‑in",
    header_destinations: "Ziele",
    header_offers: "Angebote",
    header_my_booking: "Meine Buchung",
    lang_label: "Sprache",
    confirm_book_another: "Weiteren Flug buchen",
  },
};

export function t(key: string): string {
  const pathname = typeof window !== "undefined" && window.location ? window.location.pathname : "/";
  const locale = getLocaleFromPath(pathname);
  const dict = dictionaries[locale] || dictionaries.en;
  return dict[key] ?? dictionaries.en[key] ?? key;
}

export function useI18n() {
  const pathname = typeof window !== "undefined" && window.location ? window.location.pathname : "/";
  const locale = getLocaleFromPath(pathname);
  const href = (path: string) => buildLocalizedPath(locale, path);
  const switchLocale = (newLocale: Locale) => {
    if (typeof window === "undefined" || !window.location) return;
    const next = replaceLocaleInPath(window.location.pathname + window.location.search + window.location.hash, newLocale);
    window.location.assign(next);
  };
  return { locale, t, href, switchLocale };
}

