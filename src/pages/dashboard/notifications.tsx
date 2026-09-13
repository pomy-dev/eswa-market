import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { Bell, CheckCheck, Package, MessageSquare, Star, CreditCard, Award, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { toast } from "sonner";
import type { Id } from "@/convex/_generated/dataModel.js";

const typeIcon: Record<string, React.FC<{ className?: string }>> = {
  new_order: Package,
  order_update: Package,
  new_inquiry: MessageSquare,
  listing_approved: Award,
  listing_rejected: AlertCircle,
  payment_received: CreditCard,
  review_received: Star,
};

export default function DashboardNotifications() {
  const notifications = useQuery(api.notifications.getMyNotifications) ?? [];
  const markRead = useMutation(api.notifications.markRead);
  const markAllRead = useMutation(api.notifications.markAllRead);
  const unread = notifications.filter((n: any) => !n.read).length;

  const handleMarkRead = async (id: Id<"notifications">) => {
    try { await markRead({ notificationId: id }); } catch { /* silent */ }
  };

  const handleMarkAll = async () => {
    try {
      await markAllRead({});
      toast.success("All notifications marked as read");
    } catch {
      toast.error("Failed to update notifications");
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold flex items-center gap-2">
            Notifications
            {unread > 0 && <Badge className="bg-accent text-accent-foreground border-0">{unread} unread</Badge>}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Stay on top of orders, inquiries, and updates</p>
        </div>
        {unread > 0 && (
          <Button variant="secondary" size="sm" onClick={handleMarkAll} className="cursor-pointer">
            <CheckCheck className="w-4 h-4 mr-2" /> Mark all read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card className="border-border">
          <CardContent className="p-12 text-center">
            <Bell className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-30" />
            <p className="text-muted-foreground">No notifications yet. They'll appear here when you receive orders or inquiries.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {notifications.map((n: any) => {
            const Icon = typeIcon[n.type] ?? Bell;
            return (
              <Card
                key={n._id}
                className={`border-border cursor-pointer transition-colors ${!n.read ? "border-primary/30 bg-primary/5" : ""}`}
                onClick={() => !n.read && handleMarkRead(n._id)}
              >
                <CardContent className="p-4 flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${!n.read ? "bg-primary/10" : "bg-muted"}`}>
                    <Icon className={`w-5 h-5 ${!n.read ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm">{n.title}</p>
                      {!n.read && <div className="w-2 h-2 bg-primary rounded-full" />}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{n.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(n._creationTime).toLocaleDateString("en-ZA", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
