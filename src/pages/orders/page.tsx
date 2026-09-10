import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Badge } from "@/components/ui/badge.tsx";

type OrderItem = { name: string; price: number; quantity: number };
type Order = {
  id: string;
  date: string;
  items: OrderItem[];
  total: number;
  status: string;
  customer: { firstName: string; lastName: string; email: string };
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const stored: Order[] = JSON.parse(localStorage.getItem("digitaledge_orders") ?? "[]");
    setOrders(stored);
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-serif text-3xl font-bold mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingBag className="w-14 h-14 mx-auto mb-4 text-muted-foreground opacity-30" />
          <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
          <p className="text-muted-foreground mb-6">
            You haven{"'"}t placed any orders. Browse our services to get started!
          </p>
          <Button asChild className="cursor-pointer">
            <Link to="/shop">
              Browse Services <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="border-border">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Package className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold font-mono text-sm">{order.id}</span>
                        <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-0 text-xs">
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(order.date).toLocaleDateString("en-ZA", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      <div className="mt-2 space-y-0.5">
                        {order.items.map((item, i) => (
                          <p key={i} className="text-xs text-muted-foreground">
                            {item.name} x{item.quantity}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold">
                      R{order.total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </p>
                    <Link
                      to={`/order-confirmation/${order.id}`}
                      className="text-xs text-primary hover:underline cursor-pointer"
                    >
                      View details
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
