import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { CheckCircle, Package, ArrowRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { motion } from "motion/react";

type Order = {
  id: string;
  date: string;
  items: Array<{ name: string; price: number; quantity: number }>;
  total: number;
  status: string;
  customer: { firstName: string; lastName: string; email: string };
};

export default function OrderConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const orders: Order[] = JSON.parse(localStorage.getItem("digitaledge_orders") ?? "[]");
    const found = orders.find((o) => o.id === orderId);
    setOrder(found ?? null);
  }, [orderId]);

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold mb-4">Order not found</h1>
        <Button asChild className="cursor-pointer">
          <Link to="/orders">View All Orders</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="text-center mb-10"
      >
        <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="font-serif text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-muted-foreground">
          Thank you, {order.customer.firstName}! We{"'"}ve received your order and will be in
          touch shortly.
        </p>
      </motion.div>

      <Card className="border-border mb-6">
        <CardContent className="p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Order ID</p>
              <p className="font-bold font-mono">{order.id}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-medium text-sm">
                {new Date(order.date).toLocaleDateString("en-ZA", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Package className="w-4 h-4" /> Services Ordered
            </h3>
            <div className="space-y-2">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {item.name} x{item.quantity}
                  </span>
                  <span className="font-medium">
                    R{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="flex justify-between font-bold text-lg">
            <span>Total Paid</span>
            <span>R{order.total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
          </div>
        </CardContent>
      </Card>

      <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 mb-8 text-sm space-y-1.5">
        <p className="font-semibold text-primary">{"What happens next?"}</p>
        <p className="text-muted-foreground">
          A confirmation will be sent to <strong>{order.customer.email}</strong>.
        </p>
        <p className="text-muted-foreground">
          Our team will reach out within 24 hours to kick off your project.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button asChild className="flex-1 cursor-pointer">
          <Link to="/shop">
            Browse More Services <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </Button>
        <Button variant="secondary" asChild className="flex-1 cursor-pointer">
          <Link to="/orders">
            <Download className="mr-2 w-4 h-4" /> My Orders
          </Link>
        </Button>
      </div>
    </div>
  );
}
