import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, CreditCard, Lock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { useCartContext } from "@/components/providers/cart-provider.tsx";
import { toast } from "sonner";

const schema = z.object({
  firstName: z.string().min(2, "Required"),
  lastName: z.string().min(2, "Required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(10, "Enter a valid phone number"),
  company: z.string().optional(),
  // Billing
  address: z.string().min(5, "Required"),
  city: z.string().min(2, "Required"),
  province: z.string().min(2, "Required"),
  postalCode: z.string().min(4, "Required"),
  country: z.string().min(1, "Required"),
  // Payment (demo only)
  cardNumber: z
    .string()
    .regex(/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/, "Enter a valid card number"),
  cardName: z.string().min(3, "Required"),
  expiry: z.string().regex(/^\d{2}\/\d{2}$/, "MM/YY format"),
  cvv: z.string().regex(/^\d{3,4}$/, "3 or 4 digits"),
});

type FormData = z.infer<typeof schema>;

type SavedOrder = {
  id: string;
  date: string;
  items: Array<{ name: string; price: number; quantity: number }>;
  total: number;
  status: string;
  customer: { firstName: string; lastName: string; email: string };
};

function saveOrder(order: SavedOrder) {
  const existing: SavedOrder[] = JSON.parse(
    localStorage.getItem("digitaledge_orders") ?? "[]",
  );
  existing.unshift(order);
  localStorage.setItem("digitaledge_orders", JSON.stringify(existing));
}

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCartContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h1 className="font-serif text-2xl font-bold mb-2">Nothing to checkout</h1>
        <Button asChild className="mt-4 cursor-pointer">
          <Link to="/shop">Browse Services</Link>
        </Button>
      </div>
    );
  }

  const tax = subtotal * 0.15;
  const total = subtotal + tax;

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    // Simulate payment processing
    await new Promise((r) => setTimeout(r, 1800));

    const orderId = `DE-${Date.now().toString(36).toUpperCase()}`;
    saveOrder({
      id: orderId,
      date: new Date().toISOString(),
      items: items.map((i) => ({
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
      })),
      total,
      status: "Confirmed",
      customer: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      },
    });

    clearCart();
    toast.success("Order placed successfully!");
    navigate(`/order-confirmation/${orderId}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Button variant="ghost" asChild className="mb-6 cursor-pointer -ml-2">
        <Link to="/cart">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Cart
        </Link>
      </Button>

      <h1 className="font-serif text-3xl font-bold mb-8">Checkout</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact */}
            <Card className="border-border">
              <CardContent className="p-6 space-y-4">
                <h2 className="font-semibold text-lg">Contact Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="John" {...register("firstName")} />
                    {errors.firstName && (
                      <p className="text-xs text-destructive">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Smith" {...register("lastName")} />
                    {errors.lastName && (
                      <p className="text-xs text-destructive">{errors.lastName.message}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@gmail.com"
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-xs text-destructive">{errors.email.message}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" placeholder="+27 82 123 4567" {...register("phone")} />
                    {errors.phone && (
                      <p className="text-xs text-destructive">{errors.phone.message}</p>
                    )}
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="company">
                      Company{" "}
                      <span className="text-muted-foreground text-xs">(optional)</span>
                    </Label>
                    <Input id="company" placeholder="Acme Corp" {...register("company")} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Billing */}
            <Card className="border-border">
              <CardContent className="p-6 space-y-4">
                <h2 className="font-semibold text-lg">Billing Address</h2>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="address">Street Address</Label>
                    <Input id="address" placeholder="123 Main Street" {...register("address")} />
                    {errors.address && (
                      <p className="text-xs text-destructive">{errors.address.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" placeholder="Johannesburg" {...register("city")} />
                      {errors.city && (
                        <p className="text-xs text-destructive">{errors.city.message}</p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="province">Province</Label>
                      <Input id="province" placeholder="Gauteng" {...register("province")} />
                      {errors.province && (
                        <p className="text-xs text-destructive">{errors.province.message}</p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input id="postalCode" placeholder="2196" {...register("postalCode")} />
                      {errors.postalCode && (
                        <p className="text-xs text-destructive">{errors.postalCode.message}</p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        defaultValue="South Africa"
                        {...register("country")}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment */}
            <Card className="border-border">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-lg">Payment</h2>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Lock className="w-3.5 h-3.5" />
                    Demo mode — no real charges
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      {...register("cardNumber")}
                    />
                    {errors.cardNumber && (
                      <p className="text-xs text-destructive">{errors.cardNumber.message}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="cardName">Name on Card</Label>
                    <Input id="cardName" placeholder="John Smith" {...register("cardName")} />
                    {errors.cardName && (
                      <p className="text-xs text-destructive">{errors.cardName.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="expiry">Expiry</Label>
                      <Input id="expiry" placeholder="MM/YY" maxLength={5} {...register("expiry")} />
                      {errors.expiry && (
                        <p className="text-xs text-destructive">{errors.expiry.message}</p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" maxLength={4} {...register("cvv")} />
                      {errors.cvv && (
                        <p className="text-xs text-destructive">{errors.cvv.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary */}
          <div>
            <Card className="border-border sticky top-24">
              <CardContent className="p-6 space-y-4">
                <h2 className="font-semibold text-lg">Order Summary</h2>
                <div className="space-y-3">
                  {items.map(({ product, quantity }) => (
                    <div key={product.id} className="flex justify-between text-sm gap-2">
                      <span className="text-muted-foreground line-clamp-2">
                        {product.name} x{quantity}
                      </span>
                      <span className="shrink-0 font-medium">
                        R{(product.price * quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                <Separator />
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
                <Button
                  type="submit"
                  size="lg"
                  className="w-full cursor-pointer"
                  disabled={loading}
                >
                  {loading ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" /> Place Order
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
