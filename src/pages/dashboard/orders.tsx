import { usePaginatedQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { toast } from "sonner";
import type { Id } from "@/convex/_generated/dataModel.js";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
  confirmed: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  in_progress: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
  completed: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  cancelled: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
};

const nextStatuses: Record<string, string[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["in_progress", "cancelled"],
  in_progress: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};

export default function DashboardOrders() {
  const { results, status, loadMore } = usePaginatedQuery(api.orders.getSellerOrders, {}, { initialNumItems: 20 });
  const updateStatus = useMutation(api.orders.updateOrderStatus);

  const handleStatusChange = async (orderId: Id<"orders">, newStatus: string) => {
    try {
      await updateStatus({ orderId, status: newStatus as "confirmed" | "in_progress" | "completed" | "cancelled" });
      toast.success(`Order marked as ${newStatus}`);
    } catch {
      toast.error("Failed to update order");
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold">Orders</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage incoming orders from buyers</p>
      </div>

      {
        // status === "LoadingFirstPage" ? (
        //   <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}</div>
        // ) : 
        results.length === 0 ? (
          <Card className="border-border">
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">No orders yet. Share your listings to start receiving orders!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {results.map((order) => (
              <Card key={order._id} className="border-border">
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-mono text-xs text-muted-foreground">{order._id.slice(-8).toUpperCase()}</span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusColors[order.status] ?? ""}`}>
                          {order.status.replace("_", " ")}
                        </span>
                      </div>
                      <p className="font-semibold text-sm">
                        {order.buyerName ?? "Anonymous"} · <span className="text-primary">R{order.amount.toLocaleString()}</span>
                      </p>
                      {order.buyerEmail && <p className="text-xs text-muted-foreground">{order.buyerEmail}</p>}
                      {order.message && <p className="text-xs text-muted-foreground mt-1 italic">"{order.message}"</p>}
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(order._creationTime).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    </div>
                    {nextStatuses[order.status]?.length > 0 && (
                      <div className="shrink-0">
                        <Select onValueChange={(v) => handleStatusChange(order._id, v)}>
                          <SelectTrigger className="w-40 h-9 text-xs cursor-pointer">
                            <SelectValue placeholder="Update status" />
                          </SelectTrigger>
                          <SelectContent>
                            {nextStatuses[order.status].map((s) => (
                              <SelectItem key={s} value={s} className="text-xs capitalize cursor-pointer">
                                Mark as {s.replace("_", " ")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            {status === "CanLoadMore" && (
              <Button variant="secondary" onClick={() => loadMore(20)} className="w-full cursor-pointer">Load more</Button>
            )}
          </div>
        )}
    </div>
  );
}
