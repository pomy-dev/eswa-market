import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { TrendingUp, ShoppingBag, ListOrdered, Bell, Plus, ArrowRight, Eye, MessageSquare, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Link } from "react-router-dom";
import { CATEGORY_LABELS, type ListingCategory } from "@/lib/marketplace-data.ts";

export default function DashboardOverview() {
  const user = useQuery(api.users.getCurrentUser);
  const listingsResult = useQuery(api.listings.getMyListings, { paginationOpts: { numItems: 20, cursor: null } });
  const ordersResult = useQuery(api.orders.getSellerOrders, { paginationOpts: { numItems: 20, cursor: null } });
  const notifications = useQuery(api.notifications.getMyNotifications) ?? [];

  const listings = listingsResult?.page ?? [];
  const orders = ordersResult?.page ?? [];
  const unread = notifications.filter((n: any) => !n.read).length;
  const totalRevenue = orders.filter((o: any) => o.status === "completed").reduce((s: any, o: any) => s + o.amount, 0);
  const pendingOrders = orders.filter((o: any) => o.status === "pending").length;

  const stats = [
    { label: "Active Listings", value: listings.filter((l: any) => l.status === "active").length.toString(), icon: ListOrdered, color: "text-primary", bg: "bg-primary/10" },
    { label: "Total Orders", value: orders.length.toString(), icon: ShoppingBag, color: "text-accent-foreground", bg: "bg-accent/20" },
    { label: "Pending Orders", value: pendingOrders.toString(), icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-900/20" },
    { label: "Total Revenue", value: `R${totalRevenue.toLocaleString()}`, icon: DollarSign, color: "text-green-600", bg: "bg-green-50 dark:bg-green-900/20" },
  ];

  // if (user === undefined) return <div className="p-8"><Skeleton className="h-10 w-full" /></div>;

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold">Good day, {user?.name?.split(" ")[0] ?? "Seller"} 👋</h1>
          <p className="text-muted-foreground text-sm mt-1">{user?.businessName ?? "Your Business"} · Dashboard Overview</p>
        </div>
        <Button asChild className="cursor-pointer hidden sm:flex">
          <Link to="/dashboard/listings/new"><Plus className="w-4 h-4 mr-2" /> New Listing</Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label} className="border-border">
            <CardContent className="p-5">
              <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Notifications & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent notifications */}
        <Card className="border-border">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold flex items-center gap-2">
                <Bell className="w-4 h-4" /> Notifications
                {unread > 0 && <Badge className="bg-accent text-accent-foreground border-0 text-xs">{unread}</Badge>}
              </h2>
              <Button variant="ghost" size="sm" asChild className="cursor-pointer text-xs">
                <Link to="/dashboard/notifications">View all</Link>
              </Button>
            </div>
            {notifications.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No notifications yet</p>
            ) : (
              <div className="space-y-3">
                {notifications.slice(0, 5).map((n: any) => (
                  <div key={n._id} className={`flex items-start gap-3 p-3 rounded-lg ${!n.read ? "bg-primary/5 border border-primary/10" : "bg-muted/30"}`}>
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.read ? "bg-muted-foreground/30" : "bg-primary"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1">{n.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{n.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent orders */}
        <Card className="border-border">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold flex items-center gap-2"><ShoppingBag className="w-4 h-4" /> Recent Orders</h2>
              <Button variant="ghost" size="sm" asChild className="cursor-pointer text-xs">
                <Link to="/dashboard/orders">View all</Link>
              </Button>
            </div>
            {orders.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No orders yet</p>
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 5).map((o: any) => (
                  <div key={o._id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">{o.buyerName ?? "A buyer"}</p>
                      <p className="text-sm font-medium">R{o.amount.toLocaleString()}</p>
                    </div>
                    <Badge variant={o.status === "completed" ? "default" : o.status === "pending" ? "secondary" : "destructive"} className="text-xs capitalize">
                      {o.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* My Listings quick list */}
      <Card className="border-border">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2"><ListOrdered className="w-4 h-4" /> My Listings</h2>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" asChild className="cursor-pointer text-xs">
                <Link to="/dashboard/listings">View all <ArrowRight className="w-3.5 h-3.5 ml-1" /></Link>
              </Button>
              <Button size="sm" asChild className="cursor-pointer text-xs">
                <Link to="/dashboard/listings/new"><Plus className="w-3.5 h-3.5 mr-1" /> Add</Link>
              </Button>
            </div>
          </div>
          {listings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground text-sm mb-3">No listings yet</p>
              <Button asChild className="cursor-pointer">
                <Link to="/dashboard/listings/new"><Plus className="w-4 h-4 mr-2" /> Create your first listing</Link>
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {listings.slice(0, 5).map((l: any) => (
                <div key={l._id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1">{l.title}</p>
                    <p className="text-xs text-muted-foreground">{CATEGORY_LABELS[l.category as ListingCategory]} · R{l.price.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0">
                    <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{l.viewCount ?? 0}</span>
                    <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" />{l.inquiryCount ?? 0}</span>
                    <Badge variant={l.status === "active" ? "default" : "secondary"} className="text-xs capitalize">{l.status}</Badge>
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
