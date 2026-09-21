// src/lib/marketplace-data.ts (append/replace)
export type ListingCategory =
  | "digital_marketing"
  | "property_sale"
  | "property_rental"
  | "apartment_sale"
  | "apartment_rental"
  | "transport"
  | "communications";

export const CATEGORY_LABELS: Record<ListingCategory, string> = {
  digital_marketing: "Digital Marketing",
  property_sale: "Property for Sale",
  property_rental: "Property to Rent",
  apartment_sale: "Apartments for Sale",
  apartment_rental: "Apartments to Rent",
  transport: "Transport & Vehicles",
  communications: "Communications & Tech",
};

export interface Listing {
  id: string;
  title: string;
  description: string;
  category: ListingCategory;
  price: number;
  priceUnit?: string;
  images: string[];
  badge?: "featured" | "hot" | "new";
  city?: string;
  province?: string;
  lat?: number;
  lng?: number;
  viewCount: number;
  inquiryCount: number;
  sellerName: string;
  sellerLocation: string;
  negotiable?: boolean;
  bedrooms?: number;
  bathrooms?: number;
  garages?: number;
  erf?: number;
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  deliveryTime?: string;
  features?: string[];
  amenities?: string[];
}

// Image pools for variety
const IMG = {
  house1: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200",
  house2: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200",
  house3: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200",
  house4: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200",
  house5: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200",
  apt1: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200",
  apt2: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200",
  apt3: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200",
  apt4: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200",
  car1: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200",
  car2: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200",
  car3: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200",
  car4: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200",
  tech1: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200",
  tech2: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200",
  tech3: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1200",
  digital1: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200",
  digital2: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200",
  digital3: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=1200",
};

// Eswatini / South Africa coords for proximity
export const SEED_LISTINGS: Listing[] = [
  // Property sale
  { id: "ps-sandton-house", title: "Modern 4-Bed House in Sandton", description: "Stunning contemporary home with pool, double garage, and landscaped garden. Perfect for a growing family.", category: "property_sale", price: 3450000, images: [IMG.house1, IMG.house3, IMG.house5], badge: "featured", city: "Sandton", province: "Gauteng", lat: -26.1076, lng: 28.0567, viewCount: 1240, inquiryCount: 38, sellerName: "Thandi M.", sellerLocation: "Sandton", negotiable: true, bedrooms: 4, bathrooms: 3, garages: 2, erf: 850 },
  { id: "ps-pretoria-villa", title: "Luxury Villa in Waterkloof", description: "Exclusive villa with panoramic views, 5 bedrooms, and a private cinema room.", category: "property_sale", price: 6200000, images: [IMG.house2, IMG.house4], badge: "hot", city: "Pretoria", province: "Gauteng", lat: -25.7867, lng: 28.2356, viewCount: 890, inquiryCount: 22, sellerName: "Pieter v.", sellerLocation: "Pretoria", bedrooms: 5, bathrooms: 4, garages: 3, erf: 1200 },
  { id: "ps-mbabane-home", title: "Family Home in Mbabane", description: "Charming 3-bedroom home close to schools and shopping centres.", category: "property_sale", price: 1850000, images: [IMG.house3], city: "Mbabane", province: "Hhohho", lat: -26.3054, lng: 31.1367, viewCount: 560, inquiryCount: 14, sellerName: "Sipho D.", sellerLocation: "Mbabane", bedrooms: 3, bathrooms: 2, garages: 1, erf: 600 },
  { id: "ps-manzini-estate", title: "Estate Living in Manzini", description: "Secure estate home with communal pool and 24/7 security.", category: "property_sale", price: 2100000, images: [IMG.house4], city: "Manzini", province: "Manzini", lat: -26.4988, lng: 31.3800, viewCount: 420, inquiryCount: 9, sellerName: "Nomsa K.", sellerLocation: "Manzini", bedrooms: 4, bathrooms: 2, garages: 2, erf: 700 },
  { id: "ps-ct-apartment", title: "Sea Point Apartment", description: "Two-bedroom apartment with ocean views, walking distance to promenade.", category: "property_sale", price: 2950000, images: [IMG.apt1, IMG.apt2], city: "Cape Town", province: "Western Cape", lat: -33.9249, lng: 18.4241, viewCount: 1530, inquiryCount: 45, sellerName: "Aisha P.", sellerLocation: "Cape Town", bedrooms: 2, bathrooms: 2, erf: 95 },

  // Property rental
  { id: "pr-rosebank-loft", title: "Modern Loft in Rosebank", description: "Stylish loft apartment available immediately. Fully furnished.", category: "property_rental", price: 18500, priceUnit: "/month", images: [IMG.apt3, IMG.apt4], badge: "featured", city: "Johannesburg", province: "Gauteng", lat: -26.1445, lng: 28.0417, viewCount: 980, inquiryCount: 31, sellerName: "Lerato M.", sellerLocation: "Rosebank", bedrooms: 2, bathrooms: 2, garages: 1 },
  { id: "pr-mbabane-cottage", title: "Cosy Cottage in Mbabane", description: "Furnished one-bedroom cottage with garden access.", category: "property_rental", price: 6500, priceUnit: "/month", images: [IMG.house5], city: "Mbabane", province: "Hhohho", lat: -26.3100, lng: 31.1400, viewCount: 340, inquiryCount: 8, sellerName: "Bongani S.", sellerLocation: "Mbabane", bedrooms: 1, bathrooms: 1 },
  { id: "pr-pretoria-townhouse", title: "Townhouse in Centurion", description: "Three-bedroom townhouse in secure complex.", category: "property_rental", price: 12500, priceUnit: "/month", images: [IMG.house1], city: "Centurion", province: "Gauteng", lat: -25.8603, lng: 28.1894, viewCount: 610, inquiryCount: 19, sellerName: "Johan R.", sellerLocation: "Centurion", bedrooms: 3, bathrooms: 2, garages: 2 },
  { id: "pr-manzini-flat", title: "Manzini City Flat", description: "Close to CBD, secure parking included.", category: "property_rental", price: 4800, priceUnit: "/month", images: [IMG.apt2], city: "Manzini", province: "Manzini", lat: -26.5000, lng: 31.3850, viewCount: 280, inquiryCount: 6, sellerName: "Zanele N.", sellerLocation: "Manzini", bedrooms: 2, bathrooms: 1 },

  // Apartments sale
  { id: "as-umhlanga-2bed", title: "2-Bed Apartment in Umhlanga", description: "Beachfront apartment with balcony and sea views.", category: "apartment_sale", price: 2450000, images: [IMG.apt1, IMG.apt3], badge: "hot", city: "Umhlanga", province: "KwaZulu-Natal", lat: -29.7264, lng: 31.0860, viewCount: 1120, inquiryCount: 28, sellerName: "Priya N.", sellerLocation: "Umhlanga", bedrooms: 2, bathrooms: 2, erf: 110 },
  { id: "as-mbabane-1bed", title: "1-Bed Apartment Mbabane", description: "Newly renovated apartment in quiet neighbourhood.", category: "apartment_sale", price: 750000, images: [IMG.apt4], city: "Mbabane", province: "Hhohho", lat: -26.3080, lng: 31.1330, viewCount: 400, inquiryCount: 11, sellerName: "Sibusiso M.", sellerLocation: "Mbabane", bedrooms: 1, bathrooms: 1, erf: 65 },
  { id: "as-joburg-loft", title: "Industrial Loft in Maboneng", description: "Trendy loft in the heart of Johannesburg's art district.", category: "apartment_sale", price: 1350000, images: [IMG.apt2], city: "Johannesburg", province: "Gauteng", lat: -26.2041, lng: 28.0473, viewCount: 760, inquiryCount: 21, sellerName: "Karabo T.", sellerLocation: "Johannesburg", bedrooms: 1, bathrooms: 1, erf: 80 },

  // Apartments rental
  { id: "ar-ct-2bed", title: "2-Bed Apartment in Cape Town CBD", description: "Modern apartment with city views and gym access.", category: "apartment_rental", price: 14500, priceUnit: "/month", images: [IMG.apt1, IMG.apt2, IMG.apt3], badge: "featured", city: "Cape Town", province: "Western Cape", lat: -33.9249, lng: 18.4241, viewCount: 1320, inquiryCount: 40, sellerName: "Aisha P.", sellerLocation: "Cape Town", bedrooms: 2, bathrooms: 2, garages: 1 },
  { id: "ar-sandton-studio", title: "Studio Apartment in Sandton", description: "Compact furnished studio ideal for young professionals.", category: "apartment_rental", price: 8500, priceUnit: "/month", images: [IMG.apt4], city: "Sandton", province: "Gauteng", lat: -26.1076, lng: 28.0567, viewCount: 540, inquiryCount: 15, sellerName: "Thandi M.", sellerLocation: "Sandton", bedrooms: 0, bathrooms: 1 },
  { id: "ar-mbabane-2bed", title: "2-Bed Apartment in Mbabane", description: "Walking distance to government offices.", category: "apartment_rental", price: 7200, priceUnit: "/month", images: [IMG.apt2], city: "Mbabane", province: "Hhohho", lat: -26.3054, lng: 31.1367, viewCount: 310, inquiryCount: 9, sellerName: "Nomsa K.", sellerLocation: "Mbabane", bedrooms: 2, bathrooms: 1 },
  { id: "ar-pretoria-studio", title: "Studio in Hatfield", description: "Near university, ideal for students.", category: "apartment_rental", price: 5500, priceUnit: "/month", images: [IMG.apt3], city: "Pretoria", province: "Gauteng", lat: -25.7479, lng: 28.2293, viewCount: 470, inquiryCount: 12, sellerName: "Pieter v.", sellerLocation: "Pretoria", bedrooms: 0, bathrooms: 1 },

  // Transport
  { id: "tr-bmw-3series", title: "2019 BMW 3 Series 320i", description: "Excellent condition, full service history, low mileage.", category: "transport", price: 385000, images: [IMG.car1, IMG.car2, IMG.car4], badge: "featured", city: "Sandton", province: "Gauteng", lat: -26.1076, lng: 28.0567, viewCount: 2100, inquiryCount: 62, sellerName: "Sipho M.", sellerLocation: "Sandton", make: "BMW", model: "320i", year: 2019, mileage: 45000, negotiable: true },
  { id: "tr-toyota-hilux", title: "2021 Toyota Hilux 2.8 GD-6", description: "Double cab bakkie, 4x4, perfect for work and play.", category: "transport", price: 620000, images: [IMG.car3, IMG.car2], badge: "hot", city: "Pretoria", province: "Gauteng", lat: -25.7479, lng: 28.2293, viewCount: 1780, inquiryCount: 51, sellerName: "Johan R.", sellerLocation: "Pretoria", make: "Toyota", model: "Hilux", year: 2021, mileage: 32000 },
  { id: "tr-mercedes-c200", title: "2020 Mercedes-Benz C200", description: "Luxury sedan with AMG styling package.", category: "transport", price: 495000, images: [IMG.car4], city: "Mbabane", province: "Hhohho", lat: -26.3054, lng: 31.1367, viewCount: 980, inquiryCount: 27, sellerName: "Bongani S.", sellerLocation: "Mbabane", make: "Mercedes-Benz", model: "C200", year: 2020, mileage: 38000 },
  { id: "tr-ford-ranger", title: "2018 Ford Ranger XLT", description: "Reliable bakkie with canopy and tow bar.", category: "transport", price: 420000, images: [IMG.car2], city: "Manzini", province: "Manzini", lat: -26.4988, lng: 31.3800, viewCount: 760, inquiryCount: 18, sellerName: "Zanele N.", sellerLocation: "Manzini", make: "Ford", model: "Ranger", year: 2018, mileage: 78000 },
  { id: "tr-vw-golf", title: "2019 VW Golf 7 GTI", description: "Hot hatch in pristine condition, sunroof, leather.", category: "transport", price: 465000, images: [IMG.car1], city: "Cape Town", province: "Western Cape", lat: -33.9249, lng: 18.4241, viewCount: 1450, inquiryCount: 39, sellerName: "Aisha P.", sellerLocation: "Cape Town", make: "Volkswagen", model: "Golf GTI", year: 2019, mileage: 52000 },

  // Communications
  { id: "cm-fibre-install", title: "Fibre Internet Installation", description: "Professional fibre installation with 24-month contract.", category: "communications", price: 0, images: [IMG.tech1, IMG.tech2], badge: "new", city: "Mbabane", province: "Hhohho", lat: -26.3054, lng: 31.1367, viewCount: 420, inquiryCount: 12, sellerName: "FibreLink", sellerLocation: "Mbabane", features: ["Free router", "Installation included", "24-month contract"] },
  { id: "cm-phone-contract", title: "Premium Phone Contract Deal", description: "Latest smartphone with unlimited data plan.", category: "communications", price: 899, priceUnit: "/month", images: [IMG.tech3], city: "Sandton", province: "Gauteng", lat: -26.1076, lng: 28.0567, viewCount: 680, inquiryCount: 19, sellerName: "TechTalk SA", sellerLocation: "Sandton", features: ["Unlimited data", "Latest device", "24-month plan"] },
  { id: "cm-lte-router", title: "LTE Router Bundle", description: "High-speed LTE router with 100GB monthly data.", category: "communications", price: 1499, images: [IMG.tech2], city: "Manzini", province: "Manzini", lat: -26.4988, lng: 31.3800, viewCount: 340, inquiryCount: 8, sellerName: "ConnectU", sellerLocation: "Manzini", features: ["100GB data", "No installation", "Portable"] },

  // Digital marketing
  { id: "dm-seo-starter", title: "SEO Starter Package", description: "Complete SEO setup for small businesses. Keyword research, on-page optimisation, monthly reports.", category: "digital_marketing", price: 4500, priceUnit: "/month", images: [IMG.digital1, IMG.digital2], badge: "featured", city: "Johannesburg", province: "Gauteng", lat: -26.2041, lng: 28.0473, viewCount: 890, inquiryCount: 24, sellerName: "DigitalEdge", sellerLocation: "Johannesburg", deliveryTime: "7 days", features: ["Keyword research", "On-page SEO", "Monthly reports", "Google Analytics setup"] },
  { id: "dm-social-media", title: "Social Media Management", description: "Full social media management for 3 platforms, 20 posts/month.", category: "digital_marketing", price: 6800, priceUnit: "/month", images: [IMG.digital2, IMG.digital3], badge: "hot", city: "Cape Town", province: "Western Cape", lat: -33.9249, lng: 18.4241, viewCount: 1230, inquiryCount: 33, sellerName: "SocialBoost", sellerLocation: "Cape Town", deliveryTime: "ongoing", features: ["3 platforms", "20 posts/month", "Community management", "Monthly analytics"] },
  { id: "dm-google-ads", title: "Google Ads Campaign Setup", description: "Professional Google Ads setup and 1-month management.", category: "digital_marketing", price: 3500, images: [IMG.digital3], city: "Pretoria", province: "Gauteng", lat: -25.7479, lng: 28.2293, viewCount: 560, inquiryCount: 14, sellerName: "AdPro", sellerLocation: "Pretoria", deliveryTime: "5 days", features: ["Campaign setup", "Keyword research", "Ad copywriting", "1-month management"] },
  { id: "dm-brand-identity", title: "Brand Identity Package", description: "Logo design, brand guidelines, and stationery design.", category: "digital_marketing", price: 12000, images: [IMG.digital1], city: "Mbabane", province: "Hhohho", lat: -26.3054, lng: 31.1367, viewCount: 430, inquiryCount: 11, sellerName: "BrandLab", sellerLocation: "Mbabane", deliveryTime: "14 days", features: ["Logo design", "Brand guidelines", "Business cards", "Letterhead"] },
];

// Banner ads for flicking promos
export const PROMO_BANNERS = [
  { id: "p1", text: "🔥 50% OFF Featured Listings this week!", color: "bg-gradient-to-r from-orange-500 to-red-500", link: "/become-seller" },
  { id: "p2", text: "🏠 New properties added daily in Mbabane", color: "bg-gradient-to-r from-emerald-600 to-teal-500", link: "/marketplace?cat=property_sale" },
  { id: "p3", text: "🚗 Certified pre-owned vehicles — shop now", color: "bg-gradient-to-r from-indigo-600 to-purple-500", link: "/marketplace?cat=transport" },
  { id: "p4", text: "📶 Fibre deals from E299/month", color: "bg-gradient-to-r from-sky-500 to-cyan-400", link: "/marketplace?cat=communications" },
  { id: "p5", text: "💼 Grow your business with DigitalEdge", color: "bg-gradient-to-r from-fuchsia-600 to-pink-500", link: "/marketplace?cat=digital_marketing" },
  { id: "p6", text: "🎯 Verified sellers only — shop with confidence", color: "bg-gradient-to-r from-amber-500 to-yellow-400", link: "/about" },
  { id: "p7", text: "🏢 Apartments to rent in Sandton from R8,500", color: "bg-gradient-to-r from-rose-500 to-red-400", link: "/marketplace?cat=apartment_rental" },
];

// Carousel premium items
export const CAROUSEL_ITEMS = [
  { id: "c1", title: "Luxury Villa in Waterkloof", subtitle: "R6,200,000 · Pretoria", image: IMG.house2, link: "/listings/ps-pretoria-villa" },
  { id: "c2", title: "2021 Toyota Hilux 4x4", subtitle: "R620,000 · Pretoria", image: IMG.car3, link: "/listings/tr-toyota-hilux" },
  { id: "c3", title: "Sea Point Apartment", subtitle: "R2,950,000 · Cape Town", image: IMG.apt1, link: "/listings/ps-ct-apartment" },
  { id: "c4", title: "SEO Starter Package", subtitle: "R4,500/month · Johannesburg", image: IMG.digital1, link: "/listings/dm-seo-starter" },
  { id: "c5", title: "2-Bed Apartment Umhlanga", subtitle: "R2,450,000 · KwaZulu-Natal", image: IMG.apt3, link: "/listings/as-umhlanga-2bed" },
];