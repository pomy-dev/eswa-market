import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { Star, ShoppingCart, SlidersHorizontal, X, CheckCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import { PRODUCTS, CATEGORIES, type Category } from "@/lib/data.ts";
import { useCartContext } from "@/components/providers/cart-provider.tsx";

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterOpen, setFilterOpen] = useState(false);

  const q = searchParams.get("q") ?? "";
  const cat = searchParams.get("cat") ?? "";
  const sort = searchParams.get("sort") ?? "default";

  const setParam = (key: string, value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set(key, value);
      else next.delete(key);
      return next;
    });
  };

  const { addToCart, isInCart } = useCartContext();

  const filtered = useMemo(() => {
    let result = [...PRODUCTS];
    if (q) {
      const lower = q.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(lower) ||
          p.description.toLowerCase().includes(lower) ||
          p.category.toLowerCase().includes(lower),
      );
    }
    if (cat) result = result.filter((p) => p.category === cat);

    if (sort === "price-asc") result.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") result.sort((a, b) => b.price - a.price);
    else if (sort === "rating") result.sort((a, b) => b.rating - a.rating);

    return result;
  }, [q, cat, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-2">
          {cat ? `${cat} Services` : "All Services"}
        </h1>
        <p className="text-muted-foreground">
          {filtered.length} package{filtered.length !== 1 ? "s" : ""} available
        </p>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search packages..."
            value={q}
            onChange={(e) => setParam("q", e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => setParam("sort", e.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
        >
          <option value="default">Sort: Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>

        <Button
          variant="secondary"
          onClick={() => setFilterOpen(!filterOpen)}
          className="sm:hidden cursor-pointer"
        >
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Category filters */}
      <div className={`mb-8 ${filterOpen ? "block" : "hidden sm:block"}`}>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={!cat ? "default" : "secondary"}
            onClick={() => setParam("cat", "")}
            className="cursor-pointer h-8 text-xs"
          >
            All
          </Button>
          {CATEGORIES.map((c) => (
            <Button
              key={c}
              size="sm"
              variant={cat === c ? "default" : "secondary"}
              onClick={() => setParam("cat", cat === c ? "" : c)}
              className="cursor-pointer h-8 text-xs"
            >
              {c}
              {cat === c && <X className="w-3 h-3 ml-1" />}
            </Button>
          ))}
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">No packages found</p>
          <p className="text-sm mt-1">Try adjusting your search or filters</p>
          <Button className="mt-6 cursor-pointer" onClick={() => { setParam("q", ""); setParam("cat", ""); }}>
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04, ease: "easeOut" }}
            >
              <Card className="overflow-hidden h-full flex flex-col hover:shadow-xl transition-shadow border-border pt-0">
                <Link to={`/shop/${product.slug}`} className="cursor-pointer">
                  <div className="relative h-44">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {product.badge && (
                      <Badge
                        className={`absolute top-3 left-3 text-xs font-semibold capitalize ${
                          product.badge === "bestseller"
                            ? "bg-accent text-accent-foreground"
                            : product.badge === "sale"
                              ? "bg-destructive text-white"
                              : "bg-primary text-primary-foreground"
                        }`}
                      >
                        {product.badge}
                      </Badge>
                    )}
                  </div>
                </Link>
                <CardContent className="flex-1 flex flex-col gap-3 p-4">
                  <div>
                    <Badge variant="secondary" className="text-xs mb-2">
                      {product.category}
                    </Badge>
                    <Link to={`/shop/${product.slug}`} className="cursor-pointer">
                      <h3 className="font-semibold text-foreground text-sm leading-tight hover:text-primary transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{product.rating}</span>
                    <span className="text-muted-foreground">({product.reviewCount})</span>
                    <span className="text-muted-foreground ml-auto">{product.deliveryTime}</span>
                  </div>
                  <div className="mt-auto">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-bold text-foreground text-lg">
                        R{product.price.toLocaleString()}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          R{product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <Button
                      size="sm"
                      className="w-full cursor-pointer"
                      onClick={() => addToCart(product)}
                      disabled={isInCart(product.id)}
                    >
                      {isInCart(product.id) ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" /> In Cart
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
                        </>
                      )}
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
