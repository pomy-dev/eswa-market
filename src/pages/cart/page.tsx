import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { useCartContext } from "@/components/providers/cart-provider.tsx";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, subtotal, totalItems } = useCartContext();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto mb-6 text-muted-foreground opacity-30" />
        <h1 className="font-serif text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8">
          Explore our digital marketing packages and start growing your business.
        </p>
        <Button asChild className="cursor-pointer">
          <Link to="/shop">
            Browse Services <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </Button>
      </div>
    );
  }

  const tax = subtotal * 0.15;
  const total = subtotal + tax;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-serif text-3xl font-bold mb-8">
        Shopping Cart
        <span className="text-muted-foreground text-lg font-normal ml-3">
          ({totalItems} item{totalItems !== 1 ? "s" : ""})
        </span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => (
            <Card key={product.id} className="overflow-hidden border-border pt-0">
              <CardContent className="p-0">
                <div className="flex gap-4 p-4">
                  <div className="w-24 h-20 rounded-lg overflow-hidden shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/shop/${product.slug}`}
                      className="font-semibold text-sm hover:text-primary transition-colors line-clamp-2 cursor-pointer"
                    >
                      {product.name}
                    </Link>
                    <p className="text-xs text-muted-foreground mt-0.5">{product.category}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Delivery: {product.deliveryTime}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-7 w-7 cursor-pointer"
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="text-sm font-medium w-6 text-center">{quantity}</span>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-7 w-7 cursor-pointer"
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-bold">
                          R{(product.price * quantity).toLocaleString()}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive cursor-pointer"
                          onClick={() => removeFromCart(product.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary */}
        <div>
          <Card className="border-border sticky top-24">
            <CardContent className="p-6 space-y-4">
              <h2 className="font-semibold text-lg">Order Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>R{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">VAT (15%)</span>
                  <span>R{tax.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>R{total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
              </div>
              <Button size="lg" className="w-full cursor-pointer" asChild>
                <Link to="/checkout">
                  Proceed to Checkout <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="sm" className="w-full cursor-pointer" asChild>
                <Link to="/shop">Continue Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
