import { Outlet } from "react-router-dom";
import Navbar from "@/components/navbar.tsx";
import Footer from "@/components/footer.tsx";

export default function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {/* pb-16 on mobile to clear the fixed bottom nav bar */}
      <main className="flex-1 pb-16 md:pb-0">
        <Outlet />
      </main>
      {/* Hide footer on mobile since bottom nav replaces it for navigation */}
      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
}
