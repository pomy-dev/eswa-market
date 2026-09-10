import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { Star, SlidersHorizontal, X, MapPin, Eye, MessageSquare, Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import { SEED_LISTINGS, CATEGORY_LABELS, type ListingCategory } from "@/lib/marketplace-data.ts";

const categories = Object.entries(CATEGORY_LABELS) as [ListingCategory, string][];

export default function MarketplacePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterOpen, setFilterOpen] = useState(false);

  const q = searchParams.get("q") ?? "";
  const cat = searchParams.get("cat") ?? "";
  const sort = searchParams.get("sort") ?? "default";
  const minPrice = searchParams.get("min") ? Number(searchParams.get("min")) : 0;
  const maxPrice = searchParams.get("max") ? Number(searchParams.get("max")) : Infinity;

  const setParam = (key: string, value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set(key, value); else next.delete(key);
      return next;
    });
  };

  const filtered = useMemo(() => {
    let result = [...SEED_LISTINGS];
    if (q) {
      const lower = q.toLowerCase();
      result = result.filter((l) =>
        l.title.toLowerCase().includes(lower) ||
        l.description.toLowerCase().includes(lower) ||
        l.category.toLowerCase().includes(lower) ||
        l.city?.toLowerCase().includes(lower) ||
        CATEGORY_LABELS[l.category].toLowerCase().includes(lower)
      );
    }
    if (cat) result = result.filter((l) => l.category === cat);
    if (minPrice) result = result.filter((l) => l.price >= minPrice);
    if (maxPrice !== Infinity) result = result.filter((l) => l.price <= maxPrice);
    if (sort === "price-asc") result.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") result.sort((a, b) => b.price - a.price);
    else if (sort === "popular") result.sort((a, b) => b.viewCount - a.viewCount);
    return result;
  }, [q, cat, sort, minPrice, maxPrice]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-2">
          {cat ? CATEGORY_LABELS[cat as ListingCategory] : "All Listings"}
        </h1>
        <p className="text-muted-foreground">{filtered.length} listing{filtered.length !== 1 ? "s" : ""} found</p>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search listings..." value={q} onChange={(e) => setParam("q", e.target.value)} className="pl-9" />
        </div>
        <select value={sort} onChange={(e) => setParam("sort", e.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer">
          <option value="default">Sort: Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="popular">Most Popular</option>
        </select>
        <Button variant="secondary" onClick={() => setFilterOpen(!filterOpen)} className="sm:hidden cursor-pointer">
          <SlidersHorizontal className="w-4 h-4 mr-2" /> Filter
        </Button>
      </div>

      {/* Category filters */}
      <div className="mb-8 flex flex-wrap gap-2">
        <Button size="sm" variant={!cat ? "default" : "secondary"} onClick={() => setParam("cat", "")} className="cursor-pointer h-8 text-xs">All</Button>
        {categories.map(([key, label]) => (
          <Button key={key} size="sm" variant={cat === key ? "default" : "secondary"} onClick={() => setParam("cat", cat === key ? "" : key)} className="cursor-pointer h-8 text-xs">
            {label}{cat === key && <X className="w-3 h-3 ml-1" />}
          </Button>
        ))}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">No listings found</p>
          <Button className="mt-6 cursor-pointer" onClick={() => { setParam("q", ""); setParam("cat", ""); }}>Clear filters</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((listing, i) => (
            <motion.div key={listing.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.04, ease: "easeOut" }}>
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
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{listing.description}</p>
                  </div>
                  {listing.city && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3 shrink-0" />
                      {listing.city}{listing.province ? `, ${listing.province}` : ""}
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{listing.viewCount}</span>
                    <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{listing.inquiryCount}</span>
                  </div>
                  <div className="mt-auto">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-lg">R{listing.price.toLocaleString()}</span>
                      {listing.priceUnit && <span className="text-xs text-muted-foreground">{listing.priceUnit}</span>}
                      {listing.negotiable && <Badge variant="secondary" className="text-xs">Negotiable</Badge>}
                    </div>
                    <Button size="sm" className="w-full cursor-pointer" asChild>
                      <Link to={`/listings/${listing.id}`}>
                        View Listing <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
