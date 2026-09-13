import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { CreditCard, TrendingUp, DollarSign, CheckCircle, Clock, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";

export default function DashboardPayments() {
  const ordersResult = useQuery(api.orders.getSellerOrders, { paginationOpts: { numItems: 50, cursor: null } });
  const orders = ordersResult?.page ?? [];

  const completed = orders.filter((o: any) => o.status === "completed");
  const pending = orders.filter((o: any) => ["pending", "confirmed", "in_progress"].includes(o.status));
  const cancelled = orders.filter((o: any) => o.status === "cancelled");
  const totalEarned = completed.reduce((s: any, o: any) => s + o.amount, 0);
  const pendingAmount = pending.reduce((s: any, o: any) => s + o.amount, 0);

  // if (ordersResult === undefined) return <div className="p-8"><Skeleton className="h-10 w-full" /></div>;

  const stats = [
    { label: "Total Earned", value: `R${totalEarned.toLocaleString()}`, icon: DollarSign, color: "text-green-600", bg: "bg-green-50 dark:bg-green-900/20" },
    { label: "Pending Payments", value: `R${pendingAmount.toLocaleString()}`, icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50 dark:bg-yellow-900/20" },
    { label: "Completed Orders", value: completed.length.toString(), icon: CheckCircle, color: "text-primary", bg: "bg-primary/10" },
    { label: "Cancelled Orders", value: cancelled.length.toString(), icon: XCircle, color: "text-destructive", bg: "bg-destructive/10" },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold">Payments</h1>
        <p className="text-muted-foreground text-sm mt-1">Track your earnings and payment history</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label} className="border-border">
            <CardContent className="p-5">
              <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <p className="text-xl font-bold">{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payment history */}
      <Card className="border-border">
        <CardContent className="p-5">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <CreditCard className="w-4 h-4" /> Payment History
          </h2>
          {orders.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No payment history yet.</p>
          ) : (
            <div className="divide-y divide-border">
              {orders.map((order: any) => (
                <div key={order._id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{order.buyerName ?? "Anonymous"}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order._creationTime).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-semibold">R{order.amount.toLocaleString()}</span>
                    <Badge
                      className={`text-xs capitalize ${order.status === "completed" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-0"
                        : order.status === "cancelled" ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-0"
                          : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-0"
                        }`}
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
