import { Link } from "react-router-dom";
import { Leaf, Mail, Phone, MapPin } from "lucide-react";
import { CATEGORY_LABELS, type ListingCategory } from "@/lib/marketplace-data.ts";

const categories = Object.entries(CATEGORY_LABELS) as [ListingCategory, string][];

export default function Footer() {
  return (
    <footer className="bg-sidebar text-sidebar-foreground border-t border-sidebar-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <Leaf className="w-4 h-4 text-accent-foreground" />
              </div>
              <span className="font-serif font-bold text-xl tracking-tight">DigitalEdge</span>
            </Link>
            <p className="text-sm text-sidebar-foreground/60 leading-relaxed mb-4">
              South Africa's marketplace for digital marketing, properties, transport, and communications.
            </p>
            <div className="flex items-center gap-3">
              {["X", "in", "IG", "f"].map((label, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-lg bg-sidebar-accent flex items-center justify-center text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer text-xs font-bold">
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Marketplace */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-sidebar-foreground">Marketplace</h4>
            <ul className="space-y-2.5 text-sm text-sidebar-foreground/60">
              {categories.slice(0, 6).map(([key, label]) => (
                <li key={key}>
                  <Link to={`/marketplace?cat=${key}`} className="hover:text-sidebar-foreground transition-colors cursor-pointer">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Sellers */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-sidebar-foreground">For Sellers</h4>
            <ul className="space-y-2.5 text-sm text-sidebar-foreground/60">
              {[
                { label: "Become a Seller", to: "/become-seller" },
                { label: "Seller Dashboard", to: "/dashboard" },
                { label: "My Listings", to: "/dashboard/listings" },
                { label: "Manage Orders", to: "/dashboard/orders" },
                { label: "Notifications", to: "/dashboard/notifications" },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="hover:text-sidebar-foreground transition-colors cursor-pointer">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-sidebar-foreground">Get In Touch</h4>
            <ul className="space-y-3 text-sm text-sidebar-foreground/60">
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 shrink-0 text-accent" />
                <span>hello@digitaledge.co.za</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 shrink-0 text-accent" />
                <span>+27 (0)11 123 4567</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 shrink-0 text-accent mt-0.5" />
                <span>Sandton, Johannesburg, South Africa</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-sidebar-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-sidebar-foreground/40">
          <p>&copy; {new Date().getFullYear()} DigitalEdge by Mduduzi Ngwenya. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-sidebar-foreground transition-colors cursor-pointer">Privacy Policy</a>
            <a href="#" className="hover:text-sidebar-foreground transition-colors cursor-pointer">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
