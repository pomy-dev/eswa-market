import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DefaultProviders } from "./components/providers/default.tsx";
import { LocationProvider } from "./components/providers/location-provider.tsx";
import { CartProvider } from "./components/providers/cart-provider.tsx";
import { useServiceWorker } from "./hooks/use-service-worker.ts";
import AuthCallback from "./pages/auth/Callback.tsx";
import AuthPage from "./pages/auth/page.tsx";
import AppLayout from "./components/app-layout.tsx";
// Public pages
import HomePage from "./pages/home/page.tsx";
import MarketplacePage from "./pages/marketplace/page.tsx";
import ListingDetailPage from "./pages/marketplace/listing-detail.tsx";
import CartPage from "./pages/cart/page.tsx";
import CheckoutPage from "./pages/checkout/page.tsx";
import OrderConfirmationPage from "./pages/order-confirmation/page.tsx";
import OrdersPage from "./pages/orders/page.tsx";
import AboutPage from "./pages/about/page.tsx";
import ContactPage from "./pages/contact/page.tsx";
import BecomeSellerPage from "./pages/become-seller/page.tsx";
// Seller dashboard
import DashboardLayout from "./pages/dashboard/layout.tsx";
import DashboardOverview from "./pages/dashboard/overview.tsx";
import DashboardListings from "./pages/dashboard/listings.tsx";
import NewListingPage from "./pages/dashboard/new-listing.tsx";
import DashboardOrders from "./pages/dashboard/orders.tsx";
import DashboardNotifications from "./pages/dashboard/notifications.tsx";
import DashboardPayments from "./pages/dashboard/payments.tsx";
import DashboardSettings from "./pages/dashboard/settings.tsx";
import NotFound from "./pages/NotFound.tsx";

function AppInner() {
  useServiceWorker();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/auth" element={<AuthPage />} />

        {/* Seller Dashboard (no main layout) */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardOverview />} />
          <Route path="listings" element={<DashboardListings />} />
          <Route path="listings/new" element={<NewListingPage />} />
          <Route path="orders" element={<DashboardOrders />} />
          <Route path="notifications" element={<DashboardNotifications />} />
          <Route path="payments" element={<DashboardPayments />} />
          <Route path="settings" element={<DashboardSettings />} />
        </Route>

        {/* Public marketplace */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/listings/:listingId" element={<ListingDetailPage />} />
          <Route path="/become-seller" element={<BecomeSellerPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <DefaultProviders>
      <LocationProvider>
        <CartProvider>
          <AppInner />
        </CartProvider>
      </LocationProvider>
    </DefaultProviders>
  );
}
