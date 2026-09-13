import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowRight, TrendingUp, Users, Award, BarChart3, Star, Leaf,
  Home, Car, Wifi, Building2, Search, CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { SEED_LISTINGS, CATEGORY_LABELS, type ListingCategory } from "@/lib/marketplace-data.ts";
import { useCartContext } from "@/components/providers/cart-provider.tsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const stats = [
  { value: "2,400+", label: "Active Listings", icon: BarChart3 },
  { value: "800+", label: "Verified Sellers", icon: Users },
  { value: "98%", label: "Client Satisfaction", icon: Award },
  { value: "R500M+", label: "Value Traded", icon: TrendingUp },
];

const categoryCards: { key: ListingCategory; icon: React.FC<{ className?: string }>; color: string; bg: string }[] = [
  { key: "digital_marketing", icon: TrendingUp, color: "text-primary", bg: "bg-primary/10" },
  { key: "property_sale", icon: Home, color: "text-accent-foreground", bg: "bg-accent/20" },
  { key: "property_rental", icon: Home, color: "text-primary", bg: "bg-primary/10" },
  { key: "apartment_sale", icon: Building2, color: "text-accent-foreground", bg: "bg-accent/20" },
  { key: "apartment_rental", icon: Building2, color: "text-primary", bg: "bg-primary/10" },
  { key: "transport", icon: Car, color: "text-accent-foreground", bg: "bg-accent/20" },
  { key: "communications", icon: Wifi, color: "text-primary", bg: "bg-primary/10" },
];

const testimonials = [
  { name: "Nomsa Dlamini", role: "Property Seller, Sandton", content: "I listed my property and had 12 serious inquiries within a week. The platform is professional and easy to use.", rating: 5, initials: "ND" },
  { name: "Sipho Mokoena", role: "Digital Marketing Agency", content: "My agency gained 30+ new clients through DigitalEdge. The seller dashboard makes managing orders effortless.", rating: 5, initials: "SM" },
  { name: "Aisha Patel", role: "Car Dealer, Pretoria", content: "Listed 5 vehicles and sold 3 in the first month. The exposure and buyer quality is unmatched.", rating: 5, initials: "AP" },
];

const featuredIds = ["ps-sandton-house", "tr-bmw-3series", "dm-seo-starter", "ar-ct-2bed"];

export default function HomePage() {
  const { addToCart, isInCart } = useCartContext();
  const featured = SEED_LISTINGS.filter((l) => featuredIds.includes(l.id));
  const [searchQ, setSearchQ] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQ.trim()) navigate(`/marketplace?q=${encodeURIComponent(searchQ.trim())}`);
  };

  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center bg-sidebar overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`, backgroundSize: "40px 40px" }} />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>
            <Badge className="mb-6 bg-accent/20 text-accent border-accent/40 text-xs font-semibold px-4 py-1.5">
              <Leaf className="w-3 h-3 mr-1.5" />
              Eswatini's Multi-Category Marketplace
            </Badge>

            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-sidebar-foreground leading-[1.05] text-balance mb-6">
              Buy, Sell & Grow
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                Everything You Need
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-sidebar-foreground/60 max-w-2xl mx-auto mb-10 text-balance">
              Properties, apartments, vehicles, digital marketing services, and communications — all in one trusted marketplace.
            </p>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mb-10">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sidebar-foreground/40" />
                <input
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                  placeholder="Search properties, vehicles, services..."
                  className="w-full h-14 pl-12 pr-4 rounded-xl bg-sidebar-accent border border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent text-base"
                />
              </div>
              <Button type="submit" size="lg" className="h-14 px-8 text-base bg-accent text-accent-foreground hover:bg-accent/90 cursor-pointer shrink-0">
                Search <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </form>

            <div className="flex flex-wrap gap-2 justify-center">
              {["Properties", "Apartments", "Vehicles", "Digital Marketing", "Fibre & Tech"].map((tag) => (
                <Link key={tag} to={`/marketplace?q=${tag}`} className="text-xs text-sidebar-foreground/50 hover:text-sidebar-foreground border border-sidebar-border hover:border-accent rounded-full px-3 py-1 transition-colors cursor-pointer">
                  {tag}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }} className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-5">
            {stats.map(({ value, label, icon: Icon }) => (
              <div key={label} className="bg-sidebar-accent/50 rounded-2xl p-5 border border-sidebar-border">
                <Icon className="w-5 h-5 text-accent mb-2 mx-auto" />
                <div className="text-2xl font-serif font-bold text-sidebar-foreground">{value}</div>
                <div className="text-xs text-sidebar-foreground/50 mt-1">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-3">Browse by Category</h2>
            <p className="text-muted-foreground">Find exactly what you need across all our categories</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            {categoryCards.map(({ key, icon: Icon, color, bg }) => (
              <motion.div key={key} whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300 }}>
                <Link to={`/marketplace?cat=${key}`} className="cursor-pointer">
                  <Card className="text-center p-4 hover:border-primary/40 hover:shadow-md transition-all h-full border-border">
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
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-2">Featured Listings</h2>
              <p className="text-muted-foreground">Hand-picked listings across all categories</p>
            </div>
            <Button variant="ghost" asChild className="hidden sm:flex cursor-pointer">
              <Link to="/marketplace">View all <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((listing) => (
              <motion.div key={listing.id} whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300 }}>
                <Card className="overflow-hidden h-full flex flex-col hover:shadow-xl transition-shadow border-border pt-0">
                  <Link to={`/listings/${listing.id}`} className="cursor-pointer">
                    <div className="relative h-44">
                      <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
                      {listing.badge && (
                        <Badge className={`absolute top-3 left-3 text-xs font-semibold capitalize ${listing.badge === "featured" ? "bg-accent text-accent-foreground" : listing.badge === "hot" ? "bg-red-500 text-white" : "bg-primary text-primary-foreground"}`}>
                          {listing.badge}
                        </Badge>
                      )}
                    </div>
                  </Link>
                  <CardContent className="flex-1 flex flex-col gap-2 p-4">
                    <div>
                      <Badge variant="secondary" className="text-xs mb-1">{CATEGORY_LABELS[listing.category]}</Badge>
                      <Link to={`/listings/${listing.id}`} className="cursor-pointer">
                        <h3 className="font-semibold text-sm hover:text-primary transition-colors line-clamp-2">{listing.title}</h3>
                      </Link>
                      {listing.city && <p className="text-xs text-muted-foreground mt-0.5">{listing.city}{listing.province ? `, ${listing.province}` : ""}</p>}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium text-foreground">4.8</span>
                      <span>({listing.inquiryCount} inquiries)</span>
                    </div>
                    <div className="mt-auto">
                      <div className="font-bold text-lg">
                        R{listing.price.toLocaleString()}
                        {listing.priceUnit && <span className="text-xs font-normal text-muted-foreground ml-1">{listing.priceUnit}</span>}
                      </div>
                      <Button size="sm" className="w-full mt-2 cursor-pointer" asChild>
                        <Link to={`/listings/${listing.id}`}>View Listing</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Become a Seller CTA */}
      <section className="py-20 bg-primary">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary-foreground mb-4 text-balance">
                Ready to start selling?
              </h2>
              <p className="text-primary-foreground/80 mb-6">
                Join 800+ verified sellers. List your services, properties, vehicles, or tech products and reach thousands of buyers across South Africa.
              </p>
              <ul className="space-y-2.5 mb-8">
                {["Free to create a seller account", "Manage orders and inquiries from your dashboard", "Real-time notifications", "Secure payment tracking"].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-primary-foreground/90">
                    <CheckCircle className="w-4 h-4 text-accent shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 cursor-pointer" asChild>
                <Link to="/become-seller">Become a Seller <ArrowRight className="ml-2 w-4 h-4" /></Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "List Properties", desc: "Residential & commercial" },
                { label: "Sell Vehicles", desc: "Cars, trucks, minibuses" },
                { label: "Offer Services", desc: "Digital marketing & more" },
                { label: "Tech & Comms", desc: "Fibre, CCTV, VoIP" },
              ].map(({ label, desc }) => (
                <div key={label} className="bg-primary-foreground/10 rounded-xl p-5 border border-primary-foreground/20">
                  <p className="font-semibold text-sm text-primary-foreground">{label}</p>
                  <p className="text-xs text-primary-foreground/60 mt-1">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4">Trusted by Thousands</h2>
            <p className="text-muted-foreground">Real results from real people</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <Card key={t.name} className="p-6 border-border">
                <CardContent className="pt-0 space-y-4">
                  <div className="flex gap-1">{Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}</div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{'"'}{t.content}{'"'}</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground">{t.initials}</div>
                    <div>
                      <p className="text-sm font-semibold">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
