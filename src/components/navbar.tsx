// src/components/navbar.tsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ShoppingCart, X, Search, Bell, User, ChevronDown, Home, Store,
  Info, Mail, MoreVertical, LogIn, Briefcase, MapPin, Navigation,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { useCartContext } from "@/components/providers/cart-provider.tsx";
import { cn } from "@/lib/utils.ts";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { SignInButton } from "@/components/ui/signin.tsx";
import { useLocationContext } from "@/components/providers/location-provider";

const categories = [
  { key: "digital_marketing", label: "Digital Marketing" },
  { key: "property_sale", label: "Property for Sale" },
  { key: "property_rental", label: "Property to Rent" },
  { key: "apartment_sale", label: "Apartments for Sale" },
  { key: "apartment_rental", label: "Apartments to Rent" },
  { key: "transport", label: "Transport & Vehicles" },
  { key: "communications", label: "Communications & Tech" },
];

const bottomNavItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/marketplace", label: "Marketplace", icon: Store },
  { to: "/about", label: "About", icon: Info },
  { to: "/contact", label: "Contact", icon: Mail },
];

function NavbarInner() {
  const { totalItems } = useCartContext();
  const { location, requestLocation, locationLabel } = useLocationContext();
  const [catOpen, setCatOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const moreRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const locationHook = useLocation();
  const notifications = useQuery(api.notifications.getMyNotifications) ?? [];
  const unread = notifications.filter((n: any) => !n.read).length;
  const currentUser = useQuery(api.users.getCurrentUser);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
      if (locationRef.current && !locationRef.current.contains(e.target as Node)) setLocationOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/marketplace?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleLocationSort = () => {
    if (!location) {
      requestLocation();
    } else {
      navigate("/marketplace?sort=nearby");
    }
    setLocationOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-sidebar/97 backdrop-blur border-b border-sidebar-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                <img src="/icon/logo.png" alt="Eswa-Market" className="w-full h-full object-contain" />
              </div>
              <span className="font-serif font-bold text-xl text-sidebar-foreground tracking-tight">
                Eswa-Market
              </span>
            </Link>

            {/* Desktop nav links */}
            <nav className="hidden md:flex items-center gap-1">
              <div className="relative">
                <button
                  onClick={() => setCatOpen(!catOpen)}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors rounded-md hover:bg-sidebar-accent cursor-pointer"
                >
                  Marketplace <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {catOpen && (
                  <div
                    className="absolute top-full left-0 mt-1 w-56 bg-sidebar border border-sidebar-border rounded-xl shadow-2xl py-2 z-50"
                    onMouseLeave={() => setCatOpen(false)}
                  >
                    {categories.map(({ key, label }) => (
                      <Link
                        key={key}
                        to={`/marketplace?cat=${key}`}
                        onClick={() => setCatOpen(false)}
                        className="block px-4 py-2.5 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors cursor-pointer"
                      >
                        {label}
                      </Link>
                    ))}
                    <div className="border-t border-sidebar-border mt-1 pt-1">
                      <Link
                        to="/marketplace"
                        onClick={() => setCatOpen(false)}
                        className="block px-4 py-2.5 text-sm font-medium text-accent hover:bg-sidebar-accent transition-colors cursor-pointer"
                      >
                        View All Listings →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              <Link to="/about" className="px-3 py-2 text-sm font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors rounded-md hover:bg-sidebar-accent cursor-pointer">
                About
              </Link>
              <Link to="/contact" className="px-3 py-2 text-sm font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors rounded-md hover:bg-sidebar-accent cursor-pointer">
                Contact
              </Link>
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1">
              {/* Location sort */}
              <div className="relative" ref={locationRef}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setLocationOpen(!locationOpen)}
                  className={cn(
                    "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent",
                    location && "text-accent"
                  )}
                  title={locationLabel || "Sort by location"}
                >
                  {location ? <Navigation className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                </Button>
                {locationOpen && (
                  <div className="absolute top-full right-0 mt-1 w-64 bg-sidebar border border-sidebar-border rounded-xl shadow-2xl py-2 z-50">
                    <div className="px-4 py-2 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider">
                      Location
                    </div>
                    {!location ? (
                      <button
                        onClick={handleLocationSort}
                        className="w-full text-left px-4 py-2.5 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                      >
                        <MapPin className="w-3.5 h-3.5 inline mr-2" />
                        Enable location access
                      </button>
                    ) : (
                      <>
                        <div className="px-4 py-2 text-xs text-accent flex items-center gap-1.5">
                          <Navigation className="w-3 h-3" />
                          {locationLabel || "Current location active"}
                        </div>
                        <button
                          onClick={() => navigate("/marketplace?sort=nearby")}
                          className="w-full text-left px-4 py-2.5 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                        >
                          Sort by nearest
                        </button>
                        <button
                          onClick={() => navigate("/marketplace?sort=price-asc")}
                          className="w-full text-left px-4 py-2.5 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                        >
                          Sort by price: low to high
                        </button>
                        <button
                          onClick={() => navigate("/marketplace?sort=popular")}
                          className="w-full text-left px-4 py-2.5 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                        >
                          Sort by popularity
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Search */}
              {searchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center gap-2">
                  <input
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search listings..."
                    className="text-sm bg-sidebar-accent text-sidebar-foreground placeholder:text-sidebar-foreground/40 border border-sidebar-border rounded-lg px-3 py-1.5 w-36 sm:w-48 focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <Button type="button" variant="ghost" size="icon" onClick={() => setSearchOpen(false)} className="text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent">
                    <X className="w-4 h-4" />
                  </Button>
                </form>
              ) : (
                <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)} className="text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent">
                  <Search className="w-4 h-4" />
                </Button>
              )}

              {/* Notifications */}
              <Authenticated>
                <Link to="/dashboard/notifications" className="relative cursor-pointer">
                  <Button variant="ghost" size="icon" className="text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent">
                    <Bell className="w-4 h-4" />
                  </Button>
                  {unread > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-accent text-accent-foreground border-0">
                      {unread > 9 ? "9+" : unread}
                    </Badge>
                  )}
                </Link>
              </Authenticated>

              {/* Cart */}
              <Link to="/cart" className="relative cursor-pointer">
                <Button variant="ghost" size="icon" className="text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent">
                  <ShoppingCart className="w-4 h-4" />
                </Button>
                {totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-accent text-accent-foreground border-0">
                    {totalItems}
                  </Badge>
                )}
              </Link>

              {/* User (authenticated) */}
              <Authenticated>
                <Link to={currentUser?.role === "seller" ? "/dashboard" : "/account"} className="cursor-pointer">
                  <Button variant="ghost" size="icon" className="text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent">
                    <User className="w-4 h-4" />
                  </Button>
                </Link>
              </Authenticated>

              {/* More menu (replaces SignIn button) */}
              <Unauthenticated>
                <div className="relative" ref={moreRef}>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMoreOpen(!moreOpen)}
                    className="text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                    aria-label="More options"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                  {moreOpen && (
                    <div className="absolute top-full right-0 mt-1 w-52 bg-sidebar border border-sidebar-border rounded-xl shadow-2xl py-2 z-50">
                      <SignInButton
                        className="w-full justify-start text-left px-4 py-2.5 h-auto text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-none border-0 bg-transparent"
                      >
                        <LogIn className="w-4 h-4 mr-2" />
                        Sign In
                      </SignInButton>
                      <Link
                        to="/become-seller"
                        onClick={() => setMoreOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
                      >
                        <Briefcase className="w-4 h-4" />
                        Become a Seller
                      </Link>
                    </div>
                  )}
                </div>
              </Unauthenticated>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-sidebar border-t border-sidebar-border flex items-stretch h-16 safe-area-inset-bottom">
        {bottomNavItems.map(({ to, label, icon: Icon }) => {
          const isActive = to === "/" ? locationHook.pathname === "/" : locationHook.pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-0.5 py-2 transition-colors cursor-pointer",
                isActive ? "text-accent" : "text-sidebar-foreground/50 hover:text-sidebar-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium leading-none">{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}

export default function Navbar() {
  return <NavbarInner />;
}


// import { Link, useLocation, useNavigate } from "react-router-dom";
// import {
//   ShoppingCart,
//   X,
//   Leaf,
//   Search,
//   Bell,
//   User,
//   ChevronDown,
//   Home,
//   Store,
//   Info,
//   Mail,
// } from "lucide-react";
// import { useState } from "react";
// import { Button } from "@/components/ui/button.tsx";
// import { Badge } from "@/components/ui/badge.tsx";
// import { useCartContext } from "@/components/providers/cart-provider.tsx";
// import { cn } from "@/lib/utils.ts";
// import { Authenticated, Unauthenticated } from "convex/react";
// import { useQuery } from "convex/react";
// import { api } from "@/convex/_generated/api.js";
// import { SignInButton } from "@/components/ui/signin.tsx";
// import { CATEGORY_LABELS, type ListingCategory } from "@/lib/marketplace-data.ts";

// const categories: { key: ListingCategory; label: string }[] = [
//   { key: "digital_marketing", label: "Digital Marketing" },
//   { key: "property_sale", label: "Property for Sale" },
//   { key: "property_rental", label: "Property to Rent" },
//   { key: "apartment_sale", label: "Apartments for Sale" },
//   { key: "apartment_rental", label: "Apartments to Rent" },
//   { key: "transport", label: "Transport & Vehicles" },
//   { key: "communications", label: "Communications & Tech" },
// ];

// const bottomNavItems = [
//   { to: "/", label: "Home", icon: Home },
//   { to: "/marketplace", label: "Marketplace", icon: Store },
//   { to: "/about", label: "About", icon: Info },
//   { to: "/contact", label: "Contact", icon: Mail },
// ];

// function NavbarInner() {
//   const { totalItems } = useCartContext();
//   const [catOpen, setCatOpen] = useState(false);
//   const [searchOpen, setSearchOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const navigate = useNavigate();
//   const location = useLocation();
//   const notifications = useQuery(api.notifications.getMyNotifications) ?? [];
//   const unread = notifications.filter((n: any) => !n.read).length;
//   const currentUser = useQuery(api.users.getCurrentUser);

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       navigate(`/marketplace?q=${encodeURIComponent(searchQuery.trim())}`);
//       setSearchOpen(false);
//       setSearchQuery("");
//     }
//   };

//   return (
//     <>
//       {/* ── Top Header ── */}
//       <header className="sticky top-0 z-50 bg-sidebar/97 backdrop-blur border-b border-sidebar-border">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-14 md:h-16">
//             {/* Logo */}
//             <Link to="/" className="flex items-center gap-2 shrink-0">
//               <div className="w-8 h-8 rounded-lg flex items-center justify-center">
//                 {/* <Leaf className="w-4 h-4 text-accent-foreground" /> */}
//                 <img src="/icon/logo.png" alt="" />
//               </div>
//               <span className="font-serif font-bold text-xl text-sidebar-foreground tracking-tight">
//                 Eswa-Market
//               </span>
//             </Link>

//             {/* Desktop nav links */}
//             <nav className="hidden md:flex items-center gap-1">
//               {/* Categories dropdown */}
//               <div className="relative">
//                 <button
//                   onClick={() => setCatOpen(!catOpen)}
//                   className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors rounded-md hover:bg-sidebar-accent cursor-pointer"
//                 >
//                   Marketplace <ChevronDown className="w-3.5 h-3.5" />
//                 </button>
//                 {catOpen && (
//                   <div
//                     className="absolute top-full left-0 mt-1 w-56 bg-sidebar border border-sidebar-border rounded-xl shadow-2xl py-2 z-50"
//                     onMouseLeave={() => setCatOpen(false)}
//                   >
//                     {categories.map(({ key, label }) => (
//                       <Link
//                         key={key}
//                         to={`/marketplace?cat=${key}`}
//                         onClick={() => setCatOpen(false)}
//                         className="block px-4 py-2.5 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors cursor-pointer"
//                       >
//                         {label}
//                       </Link>
//                     ))}
//                     <div className="border-t border-sidebar-border mt-1 pt-1">
//                       <Link
//                         to="/marketplace"
//                         onClick={() => setCatOpen(false)}
//                         className="block px-4 py-2.5 text-sm font-medium text-accent hover:bg-sidebar-accent transition-colors cursor-pointer"
//                       >
//                         View All Listings →
//                       </Link>
//                     </div>
//                   </div>
//                 )}
//               </div>
//               <Link
//                 to="/about"
//                 className="px-3 py-2 text-sm font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors rounded-md hover:bg-sidebar-accent cursor-pointer"
//               >
//                 About
//               </Link>
//               <Link
//                 to="/contact"
//                 className="px-3 py-2 text-sm font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors rounded-md hover:bg-sidebar-accent cursor-pointer"
//               >
//                 Contact
//               </Link>
//             </nav>

//             {/* Right actions — always visible */}
//             <div className="flex items-center gap-1">
//               {/* Search */}
//               {searchOpen ? (
//                 <form onSubmit={handleSearch} className="flex items-center gap-2">
//                   <input
//                     autoFocus
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     placeholder="Search listings..."
//                     className="text-sm bg-sidebar-accent text-sidebar-foreground placeholder:text-sidebar-foreground/40 border border-sidebar-border rounded-lg px-3 py-1.5 w-36 sm:w-48 focus:outline-none focus:ring-2 focus:ring-accent"
//                   />
//                   <Button
//                     type="button"
//                     variant="ghost"
//                     size="icon"
//                     onClick={() => setSearchOpen(false)}
//                     className="text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
//                   >
//                     <X className="w-4 h-4" />
//                   </Button>
//                 </form>
//               ) : (
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => setSearchOpen(true)}
//                   className="text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
//                 >
//                   <Search className="w-4 h-4" />
//                 </Button>
//               )}

//               {/* Notifications */}
//               <Authenticated>
//                 <Link to="/dashboard/notifications" className="relative cursor-pointer">
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
//                   >
//                     <Bell className="w-4 h-4" />
//                   </Button>
//                   {unread > 0 && (
//                     <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-accent text-accent-foreground border-0">
//                       {unread > 9 ? "9+" : unread}
//                     </Badge>
//                   )}
//                 </Link>
//               </Authenticated>

//               {/* Cart */}
//               <Link to="/cart" className="relative cursor-pointer">
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
//                 >
//                   <ShoppingCart className="w-4 h-4" />
//                 </Button>
//                 {totalItems > 0 && (
//                   <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-accent text-accent-foreground border-0">
//                     {totalItems}
//                   </Badge>
//                 )}
//               </Link>

//               {/* Auth */}
//               <Authenticated>
//                 <Link
//                   to={currentUser?.role === "seller" ? "/dashboard" : "/account"}
//                   className="cursor-pointer"
//                 >
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
//                   >
//                     <User className="w-4 h-4" />
//                   </Button>
//                 </Link>
//               </Authenticated>

//               {/* Signin */}
//               <Unauthenticated>
//                 <SignInButton className="h-8 text-xs px-3 bg-accent text-accent-foreground hover:bg-accent/90 border-0" />
//               </Unauthenticated>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* ── Mobile Bottom Navigation Bar ── */}
//       <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-sidebar border-t border-sidebar-border flex items-stretch h-16 safe-area-inset-bottom">
//         {bottomNavItems.map(({ to, label, icon: Icon }) => {
//           const isActive =
//             to === "/"
//               ? location.pathname === "/"
//               : location.pathname.startsWith(to);
//           return (
//             <Link
//               key={to}
//               to={to}
//               className={cn(
//                 "flex-1 flex flex-col items-center justify-center gap-0.5 py-2 transition-colors cursor-pointer",
//                 isActive
//                   ? "text-accent"
//                   : "text-sidebar-foreground/50 hover:text-sidebar-foreground"
//               )}
//             >
//               <Icon className="w-5 h-5" />
//               <span className="text-[10px] font-medium leading-none">{label}</span>
//             </Link>
//           );
//         })}
//       </nav>
//     </>
//   );
// }

// export default function Navbar() {
//   return <NavbarInner />;
// }