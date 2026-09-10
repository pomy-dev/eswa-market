import { Outlet, Link, useLocation, Navigate } from "react-router-dom";
import { LayoutDashboard, ListOrdered, ShoppingBag, Bell, CreditCard, Settings, Plus, Leaf, LogOut, User } from "lucide-react";
import { Authenticated, Unauthenticated } from "convex/react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { SignInButton } from "@/components/ui/signin.tsx";
import { cn } from "@/lib/utils.ts";
import { Badge } from "@/components/ui/badge.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { useAuth } from "@/hooks/use-auth.ts";

const navItems = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/dashboard/listings", label: "My Listings", icon: ListOrdered },
  { to: "/dashboard/orders", label: "Orders", icon: ShoppingBag },
  { to: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { to: "/dashboard/payments", label: "Payments", icon: CreditCard },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
];

function DashboardSidebar({ unreadCount }: { unreadCount: number }) {
  const location = useLocation();
  const { signout } = useAuth();

  return (
    <aside className="hidden md:flex md:w-64 flex-col bg-sidebar border-r border-sidebar-border min-h-screen">
      {/* Logo */}
      <div className="p-5 border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
            <Leaf className="w-3.5 h-3.5 text-accent-foreground" />
          </div>
          <span className="font-serif font-bold text-base text-sidebar-foreground">DigitalEdge</span>
        </Link>
        <p className="text-xs text-sidebar-foreground/50 mt-1 ml-9">Seller Dashboard</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ to, label, icon: Icon, exact }) => {
          const active = exact ? location.pathname === to : location.pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent",
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
              {label === "Notifications" && unreadCount > 0 && (
                <Badge className="ml-auto h-5 min-w-5 px-1.5 text-xs bg-accent text-accent-foreground border-0">
                  {unreadCount}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border space-y-1">
        <Link
          to="/dashboard/listings/new"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" /> New Listing
        </Link>
        <Link
          to="/account"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors cursor-pointer"
        >
          <User className="w-4 h-4" /> My Account
        </Link>
        <button
          onClick={() => signout()}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </aside>
  );
}

function DashboardBottomNav({ unreadCount }: { unreadCount: number }) {
  const location = useLocation();
  return (
    <nav className="fixed bottom-0 left-0 right-0 flex justify-around border-t border-sidebar-border bg-sidebar md:hidden z-40">
      {navItems.slice(0, 5).map(({ to, label, icon: Icon, exact }) => {
        const active = exact ? location.pathname === to : location.pathname.startsWith(to);
        return (
          <Link key={to} to={to} className={cn("flex flex-col items-center gap-0.5 py-2 px-2 text-xs transition-colors cursor-pointer relative", active ? "text-accent" : "text-sidebar-foreground/50 hover:text-sidebar-foreground")}>
            <Icon className="w-5 h-5" />
            <span>{label}</span>
            {label === "Notifications" && unreadCount > 0 && (
              <span className="absolute top-1 right-2 w-2 h-2 bg-accent rounded-full" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

function DashboardGuard() {
  const user = useQuery(api.users.getCurrentUser);
  const notifications = useQuery(api.notifications.getMyNotifications) ?? [];
  const unreadCount = notifications.filter((n) => !n.read).length;

  if (user === undefined) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Skeleton className="h-10 w-48" />
      </div>
    );
  }

  if (user?.role !== "seller") {
    return <Navigate to="/become-seller" replace />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar unreadCount={unreadCount} />
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        <Outlet />
      </div>
      <DashboardBottomNav unreadCount={unreadCount} />
    </div>
  );
}

export default function DashboardLayout() {
  return (
    <>
      <Authenticated>
        <DashboardGuard />
      </Authenticated>
      <Unauthenticated>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-4">
            <Leaf className="w-12 h-12 text-primary mx-auto" />
            <h2 className="font-semibold text-xl">Sign in to access your dashboard</h2>
            <SignInButton className="h-11 px-6" />
          </div>
        </div>
      </Unauthenticated>
    </>
  );
}
