// src/pages/home/page.tsx
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight, TrendingUp, Users, BarChart3, Star, Leaf, Home as HomeIcon,
  Car, Wifi, Building2, ChevronDown, MapPin, Eye, MessageSquare, ChevronLeft,
  ChevronRight, Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import {
  SEED_LISTINGS, CATEGORY_LABELS, CAROUSEL_ITEMS, PROMO_BANNERS,
  type Listing, type ListingCategory,
} from "@/lib/marketplace-data.ts";
import { useLocationContext } from "@/components/providers/location-provider.tsx";
import { useState, useEffect, useMemo, useRef } from "react";
import { cn } from "@/lib/utils.ts";

const stats = [
  { value: "2,400+", label: "Active Listings", icon: BarChart3 },
  { value: "800+", label: "Verified Sellers", icon: Users },
];

const categoryCards: { key: ListingCategory; icon: React.FC<{ className?: string }>; color: string; bg: string }[] = [
  { key: "digital_marketing", icon: TrendingUp, color: "text-primary", bg: "bg-primary/10" },
  { key: "property_sale", icon: HomeIcon, color: "text-accent-foreground", bg: "bg-accent/20" },
  { key: "property_rental", icon: HomeIcon, color: "text-primary", bg: "bg-primary/10" },
  { key: "apartment_sale", icon: Building2, color: "text-accent-foreground", bg: "bg-accent/20" },
  { key: "apartment_rental", icon: Building2, color: "text-primary", bg: "bg-primary/10" },
  { key: "transport", icon: Car, color: "text-accent-foreground", bg: "bg-accent/20" },
  { key: "communications", icon: Wifi, color: "text-primary", bg: "bg-primary/10" },
];

/* ─────────────────────────────────────────────
   Graffiti-style background (WhatsApp-like doodles)
   ───────────────────────────────────────────── */
function GraffitiBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <svg className="w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="graffiti" x="0" y="0" width="240" height="240" patternUnits="userSpaceOnUse">
            {/* house outline */}
            <path d="M20 70 L45 45 L70 70 L70 100 L20 100 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <rect x="35" y="78" width="12" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" />
            {/* car outline */}
            <path d="M110 90 Q118 78 130 78 Q142 78 150 90 L155 92 L155 100 L110 100 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="120" cy="100" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="142" cy="100" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
            {/* wifi arcs */}
            <path d="M195 50 Q205 42 215 50" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M190 60 Q205 50 220 60" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="205" cy="70" r="2" fill="currentColor" />
            {/* shopping bag */}
            <rect x="30" y="170" width="30" height="30" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M38 170 Q45 155 52 170" fill="none" stroke="currentColor" strokeWidth="1.5" />
            {/* leaf */}
            <path d="M130 180 Q140 160 155 165 Q150 185 130 180 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
            {/* tag/price */}
            <path d="M190 150 L210 150 L220 165 L210 180 L190 180 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="198" cy="165" r="2" fill="currentColor" />
            {/* star */}
            <path d="M70 200 L75 190 L80 200 L90 200 L82 207 L85 217 L75 211 L65 217 L68 207 L60 200 Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#graffiti)" className="text-foreground" />
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Auto-scrolling carousel banner
   ───────────────────────────────────────────── */
function CarouselBanner() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % CAROUSEL_ITEMS.length), 4000);
    return () => clearInterval(t);
  }, [paused]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const child = el.children[index] as HTMLElement | undefined;
    if (child) {
      el.scrollTo({ left: child.offsetLeft - 16, behavior: "smooth" });
    }
  }, [index]);

  return (
    <section className="relative py-3 bg-sidebar">
      <div
        ref={scrollerRef}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory px-4 sm:px-6 lg:px-8 no-scrollbar"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {CAROUSEL_ITEMS.map((item) => (
          <Link
            key={item.id}
            to={item.link}
            className="relative shrink-0 w-[85vw] sm:w-[60vw] lg:w-[42vw] xl:w-[32vw] h-44 sm:h-56 rounded-2xl overflow-hidden snap-center group"
          >
            <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h3 className="text-white font-serif font-bold text-xl sm:text-2xl leading-tight">{item.title}</h3>
              <p className="text-white/70 text-sm mt-1">{item.subtitle}</p>
              <span className="inline-flex items-center gap-1 text-accent text-xs font-semibold mt-3">
                View listing <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 mt-4">
        <button
          onClick={() => setIndex((i) => (i - 1 + CAROUSEL_ITEMS.length) % CAROUSEL_ITEMS.length)}
          className="w-8 h-8 rounded-full bg-sidebar-accent text-sidebar-foreground/70 hover:text-sidebar-foreground flex items-center justify-center"
          aria-label="Previous"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex gap-1.5">
          {CAROUSEL_ITEMS.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === index ? "w-6 bg-accent" : "w-1.5 bg-sidebar-foreground/30"
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        <button
          onClick={() => setIndex((i) => (i + 1) % CAROUSEL_ITEMS.length)}
          className="w-8 h-8 rounded-full bg-sidebar-accent text-sidebar-foreground/70 hover:text-sidebar-foreground flex items-center justify-center"
          aria-label="Next"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Collapsible categories
   ───────────────────────────────────────────── */
function CollapsibleCategories() {
  const [open, setOpen] = useState(true);
  return (
    <section className="py-8 bg-background/80 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center justify-between w-full mb-4 group"
        >
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-left">Browse Categories</h2>
          <ChevronDown className={cn("w-5 h-5 text-muted-foreground transition-transform", open && "rotate-180")} />
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 pt-2">
                {categoryCards.map(({ key, icon: Icon, color, bg }) => (
                  <motion.div key={key} whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Link to={`/marketplace?cat=${key}`} className="cursor-pointer">
                      <Card className="text-center p-3 hover:border-primary/40 hover:shadow-md transition-all h-full border-border">
                        <CardContent className="pt-0 flex flex-col items-center gap-2">
                          <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                            <Icon className={`w-5 h-5 ${color}`} />
                          </div>
                          <p className="text-xs font-medium text-foreground leading-tight text-center">
                            {CATEGORY_LABELS[key]}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Hero overlay card (zooming background)
   ───────────────────────────────────────────── */
function HeroOverlayCard({ listing }: { listing: Listing }) {
  const { distanceTo } = useLocationContext();
  const dist = listing.lat && listing.lng ? distanceTo(listing.lat, listing.lng) : null;
  return (
    <Link
      to={`/listings/${listing.id}`}
      className="relative shrink-0 w-[78vw] sm:w-[340px] h-[380px] sm:h-[420px] rounded-2xl overflow-hidden group snap-start"
    >
      <img
        src={listing.images[0]}
        alt={listing.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[8000ms] ease-out group-hover:scale-125 animate-kenburns"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
      {listing.badge && (
        <Badge className={cn(
          "absolute top-3 left-3 text-xs font-semibold capitalize",
          listing.badge === "featured" ? "bg-accent text-accent-foreground" :
            listing.badge === "hot" ? "bg-red-500 text-white" : "bg-primary text-primary-foreground"
        )}>
          {listing.badge}
        </Badge>
      )}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <Badge variant="secondary" className="text-[10px] mb-2">{CATEGORY_LABELS[listing.category]}</Badge>
        <h3 className="font-semibold text-base leading-tight line-clamp-2">{listing.title}</h3>
        <div className="flex items-center gap-2 text-[11px] text-white/70 mt-1.5">
          {listing.city && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{listing.city}</span>}
          {dist !== null && <span className="flex items-center gap-1">· {dist.toFixed(1)} km</span>}
        </div>
        <div className="font-bold text-lg mt-2">
          R{listing.price.toLocaleString()}
          {listing.priceUnit && <span className="text-xs font-normal text-white/70 ml-1">{listing.priceUnit}</span>}
        </div>
      </div>
    </Link>
  );
}

/* ─────────────────────────────────────────────
   ListTile card (small, vertical)
   ───────────────────────────────────────────── */
function ListTile({ listing }: { listing: Listing }) {
  const { distanceTo } = useLocationContext();
  const dist = listing.lat && listing.lng ? distanceTo(listing.lat, listing.lng) : null;
  return (
    <Link
      to={`/listings/${listing.id}`}
      className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:border-primary/40 hover:shadow-md transition-all group"
    >
      <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0">
        <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">{listing.title}</h3>
        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{listing.description}</p>
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-1">
          {listing.city && <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" />{listing.city}</span>}
          {dist !== null && <span>· {dist.toFixed(1)} km away</span>}
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <span className="font-bold text-sm">R{listing.price.toLocaleString()}{listing.priceUnit && <span className="text-[10px] font-normal text-muted-foreground ml-0.5">{listing.priceUnit}</span>}</span>
          <span className="text-[11px] text-primary font-medium flex items-center gap-0.5">View <ArrowRight className="w-3 h-3" /></span>
        </div>
      </div>
    </Link>
  );
}

/* ─────────────────────────────────────────────
   Wide card (full-width, image flipping)
   ───────────────────────────────────────────── */
function WideFlipCard({ listing }: { listing: Listing }) {
  const [imgIndex, setImgIndex] = useState(0);
  const images = listing.images.length > 1 ? listing.images : [...listing.images, listing.images[0]];
  const { distanceTo } = useLocationContext();
  const dist = listing.lat && listing.lng ? distanceTo(listing.lat, listing.lng) : null;

  useEffect(() => {
    if (images.length < 2) return;
    const t = setInterval(() => setImgIndex((i) => (i + 1) % images.length), 3500);
    return () => clearInterval(t);
  }, [images.length]);

  return (
    <Link
      to={`/listings/${listing.id}`}
      className={cn(
        // Half-width on phones → grows on larger screens
        "relative block shrink-0 snap-start rounded-2xl overflow-hidden group",
        "w-[48vw] sm:w-[360px] md:w-[420px] lg:w-[480px]",
        "h-44 sm:h-52 md:h-56"
      )}
    >
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={listing.title}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-700",
            i === imgIndex ? "opacity-100" : "opacity-0"
          )}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
      {listing.badge && (
        <Badge
          className={cn(
            "absolute top-2.5 left-2.5 text-[10px] sm:text-xs font-semibold capitalize",
            listing.badge === "featured"
              ? "bg-accent text-accent-foreground"
              : listing.badge === "hot"
                ? "bg-red-500 text-white"
                : "bg-primary text-primary-foreground"
          )}
        >
          {listing.badge}
        </Badge>
      )}

      {/* Image dots */}
      {images.length > 1 && (
        <div className="absolute top-2.5 right-2.5 flex gap-1">
          {images.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === imgIndex ? "w-4 bg-white" : "w-1.5 bg-white/50"
              )}
            />
          ))}
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white flex items-end justify-between gap-2">
        <div className="min-w-0">
          <Badge variant="secondary" className="text-[9px] sm:text-[10px] mb-1.5">
            {CATEGORY_LABELS[listing.category]}
          </Badge>
          <h3 className="font-semibold text-sm sm:text-base leading-tight line-clamp-2">
            {listing.title}
          </h3>
          <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-white/70 mt-1">
            {listing.city && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {listing.city}
              </span>
            )}
            {dist !== null && <span>· {dist.toFixed(1)} km</span>}
            <span className="hidden sm:flex items-center gap-1">
              · <Eye className="w-3 h-3" />
              {listing.viewCount}
            </span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="font-bold text-sm sm:text-lg leading-tight">
            R{listing.price.toLocaleString()}
          </div>
          {listing.priceUnit && (
            <div className="text-[9px] sm:text-[10px] text-white/70">{listing.priceUnit}</div>
          )}
        </div>
      </div>
    </Link>
  );
}

/* ─────────────────────────────────────────────
   Flicking promo banner (random colour)
   ───────────────────────────────────────────── */
function FlickingPromo() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % PROMO_BANNERS.length), 5000);
    return () => clearInterval(t);
  }, []);
  const promo = PROMO_BANNERS[active];
  return (
    <div className="sticky top-[56px] md:top-[64px] z-40">
      <AnimatePresence mode="wait">
        <motion.div
          key={promo.id}
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <Link
            to={promo.link}
            className={cn(
              "block py-2.5 px-4 text-center text-white text-sm font-medium shadow-lg",
              promo.color
            )}
          >
            {promo.text}
          </Link>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Category section
   ───────────────────────────────────────────── */
function CategorySection({
  category, layout, nearby,
}: {
  category: ListingCategory;
  layout: "overlay" | "list" | "wide";
  nearby?: boolean;
}) {
  const { distanceTo } = useLocationContext();
  let items = SEED_LISTINGS.filter((l) => l.category === category);
  if (nearby && distanceTo) {
    items = [...items].sort((a, b) => {
      const da = a.lat && a.lng ? distanceTo(a.lat, a.lng) ?? Infinity : Infinity;
      const db = b.lat && b.lng ? distanceTo(b.lat, b.lng) ?? Infinity : Infinity;
      return da - db;
    });
  }
  items = items.slice(0, 5);
  if (items.length === 0) return null;

  return (
    <section className="py-8 bg-background/70 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold">
            {CATEGORY_LABELS[category]}
            {nearby && <span className="text-sm font-sans font-normal text-accent ml-2">· nearby</span>}
          </h2>
          <Button variant="ghost" size="sm" asChild className="cursor-pointer">
            <Link to={`/marketplace?cat=${category}`}>
              View all <ArrowRight className="ml-1.5 w-4 h-4" />
            </Link>
          </Button>
        </div>

        {layout === "overlay" && (
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 snap-x snap-mandatory">
            {items.map((l) => <HeroOverlayCard key={l.id} listing={l} />)}
          </div>
        )}

        {layout === "list" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {items.slice(0, 4).map((l) => <ListTile key={l.id} listing={l} />)}
          </div>
        )}

        {layout === "wide" && (
          <div className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar pb-2 snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0">
            {items.slice(0, 5).map((l) => (
              <WideFlipCard key={l.id} listing={l} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Main Home Page
   ───────────────────────────────────────────── */
export default function HomePage() {
  const navigate = useNavigate();
  const { location } = useLocationContext();

  // Determine which categories are "nearby" (closest overall)
  const nearbyCategory = useMemo<ListingCategory | null>(() => {
    if (!location) return null;
    let best: { cat: ListingCategory; d: number } | null = null;
    for (const l of SEED_LISTINGS) {
      if (!l.lat || !l.lng) continue;
      const dx = l.lat - location.lat;
      const dy = l.lng - location.lng;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (!best || d < best.d) best = { cat: l.category, d };
    }
    return best?.cat ?? null;
  }, [location]);

  const layouts: ("overlay" | "list" | "wide")[] = ["overlay", "list", "wide"];

  return (
    <div className="overflow-x-hidden relative">
      <GraffitiBackground />

      <CarouselBanner />
      <CollapsibleCategories />

      {/* Hero stats */}
      <section className="relative bg-sidebar/95 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-accent/20 text-accent border-accent/40 text-xs font-semibold px-4 py-1.5">
            <Leaf className="w-3 h-3 mr-1.5" />
            Eswatini's Multi-Category Marketplace
          </Badge>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-5 max-w-md mx-auto">
            {stats.map(({ value, label, icon: Icon }) => (
              <div key={label} className="bg-sidebar-accent/50 rounded-2xl p-5 border border-sidebar-border">
                <Icon className="w-5 h-5 text-accent mb-2 mx-auto" />
                <div className="text-2xl font-serif font-bold text-sidebar-foreground">{value}</div>
                <div className="text-xs text-sidebar-foreground/50 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FlickingPromo />

      {/* Featured / category sections */}
      <CategorySection category="property_sale" layout="overlay" nearby={nearbyCategory === "property_sale"} />
      <CategorySection category="transport" layout="wide" nearby={nearbyCategory === "transport"} />
      <CategorySection category="apartment_rental" layout="list" nearby={nearbyCategory === "apartment_rental"} />
      <CategorySection category="digital_marketing" layout="overlay" nearby={nearbyCategory === "digital_marketing"} />
      <CategorySection category="property_rental" layout="list" nearby={nearbyCategory === "property_rental"} />
      <CategorySection category="communications" layout="wide" nearby={nearbyCategory === "communications"} />
      <CategorySection category="apartment_sale" layout="overlay" nearby={nearbyCategory === "apartment_sale"} />

      {/* Become a seller CTA */}
      <section className="py-14 bg-sidebar/95">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-sidebar-foreground mb-3">
            Ready to grow your business?
          </h2>
          <p className="text-sidebar-foreground/60 mb-6">
            Join hundreds of verified sellers reaching thousands of buyers across Eswatini and South Africa.
          </p>
          <Button size="lg" className="h-14 px-8 text-base bg-accent text-accent-foreground hover:bg-accent/90 cursor-pointer" asChild>
            <Link to="/become-seller">Become a Seller <ArrowRight className="ml-2 w-4 h-4" /></Link>
          </Button>
        </div>
      </section>
    </div>
  );
}