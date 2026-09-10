import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Star, Clock, CheckCircle, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { PRODUCTS } from "@/lib/data.ts";
import { useCartContext } from "@/components/providers/cart-provider.tsx";
import { toast } from "sonner";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const product = PRODUCTS.find((p) => p.slug === slug);
  const { addToCart, isInCart } = useCartContext();

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Package not found</h1>
        <Button asChild className="cursor-pointer">
          <Link to="/shop">Back to Services</Link>
        </Button>
      </div>
    );
  }

  const related = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id,
  ).slice(0, 3);

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`, {
      action: { label: "View Cart", onClick: () => (window.location.href = "/cart") },
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back */}
      <Button variant="ghost" asChild className="mb-6 cursor-pointer -ml-2">
        <Link to="/shop">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Services
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        {/* Image */}
        <div className="rounded-2xl overflow-hidden aspect-video lg:aspect-auto lg:h-96">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="text-xs">
                {product.category}
              </Badge>
              {product.badge && (
                <Badge
                  className={`text-xs capitalize ${
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
            <h1 className="font-serif text-3xl font-bold mb-3">{product.name}</h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-sm text-muted-foreground">
                ({product.reviewCount} reviews)
              </span>
            </div>
          </div>

          <p className="text-muted-foreground leading-relaxed">{product.longDescription}</p>

          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Clock className="w-4 h-4 text-primary" />
            <span>
              Delivery: <strong className="text-foreground">{product.deliveryTime}</strong>
            </span>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-semibold mb-3">{"What's"} included:</h3>
            <ul className="space-y-2">
              {product.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Price + CTA */}
          <div className="border-t border-border pt-5 flex items-center justify-between gap-4">
            <div>
              <div className="text-3xl font-bold">R{product.price.toLocaleString()}</div>
              {product.originalPrice && (
                <div className="text-sm text-muted-foreground line-through">
                  R{product.originalPrice.toLocaleString()}
                </div>
              )}
            </div>
            <Button
              size="lg"
              className="cursor-pointer px-8"
              onClick={handleAddToCart}
              disabled={isInCart(product.id)}
            >
              {isInCart(product.id) ? (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" /> In Cart
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div>
          <h2 className="font-serif text-2xl font-bold mb-6">Related Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {related.map((p) => (
              <Card key={p.id} className="overflow-hidden hover:shadow-lg transition-shadow border-border pt-0">
                <Link to={`/shop/${p.slug}`} className="cursor-pointer">
                  <div className="h-36">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                </Link>
                <CardContent className="p-4">
                  <Link to={`/shop/${p.slug}`} className="cursor-pointer">
                    <h3 className="font-semibold text-sm hover:text-primary transition-colors">
                      {p.name}
                    </h3>
                  </Link>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold">R{p.price.toLocaleString()}</span>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => addToCart(p)}
                      disabled={isInCart(p.id)}
                      className="text-xs cursor-pointer"
                    >
                      {isInCart(p.id) ? "Added" : "Add"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
