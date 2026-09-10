import { usePaginatedQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { Plus, Eye, MessageSquare, Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Link } from "react-router-dom";
import { CATEGORY_LABELS, type ListingCategory } from "@/lib/marketplace-data.ts";
import { toast } from "sonner";
import type { Id } from "@/convex/_generated/dataModel.js";

export default function DashboardListings() {
  const { results, status, loadMore } = usePaginatedQuery(api.listings.getMyListings, {}, { initialNumItems: 20 });
  const deleteListing = useMutation(api.listings.deleteListing);
  const updateListing = useMutation(api.listings.updateListing);

  const handleDelete = async (id: Id<"listings">, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await deleteListing({ listingId: id });
      toast.success("Listing deleted");
    } catch {
      toast.error("Failed to delete listing");
    }
  };

  const handleToggle = async (id: Id<"listings">, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      await updateListing({ listingId: id, status: newStatus as "active" | "inactive" });
      toast.success(`Listing ${newStatus}`);
    } catch {
      toast.error("Failed to update listing");
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold">My Listings</h1>
          <p className="text-muted-foreground text-sm mt-1">{results.length} listing{results.length !== 1 ? "s" : ""}</p>
        </div>
        <Button asChild className="cursor-pointer">
          <Link to="/dashboard/listings/new"><Plus className="w-4 h-4 mr-2" /> New Listing</Link>
        </Button>
      </div>

      {status === "LoadingFirstPage" ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
        </div>
      ) : results.length === 0 ? (
        <Card className="border-border">
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground mb-4">You haven't created any listings yet.</p>
            <Button asChild className="cursor-pointer">
              <Link to="/dashboard/listings/new"><Plus className="w-4 h-4 mr-2" /> Create your first listing</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {results.map((listing) => (
            <Card key={listing._id} className="border-border hover:shadow-sm transition-shadow">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-sm line-clamp-1">{listing.title}</p>
                    <Badge variant={listing.status === "active" ? "default" : "secondary"} className="text-xs capitalize">{listing.status}</Badge>
                    <Badge variant="outline" className="text-xs">{CATEGORY_LABELS[listing.category as ListingCategory]}</Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-1.5 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">R{listing.price.toLocaleString()}{listing.priceUnit ? ` ${listing.priceUnit}` : ""}</span>
                    <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{listing.viewCount ?? 0} views</span>
                    <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" />{listing.inquiryCount ?? 0} inquiries</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 cursor-pointer text-muted-foreground hover:text-foreground"
                    onClick={() => handleToggle(listing._id, listing.status)}
                    title={listing.status === "active" ? "Deactivate" : "Activate"}
                  >
                    {listing.status === "active" ? <ToggleRight className="w-4 h-4 text-primary" /> : <ToggleLeft className="w-4 h-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer text-muted-foreground hover:text-foreground" asChild>
                    <Link to={`/dashboard/listings/${listing._id}/edit`}><Pencil className="w-4 h-4" /></Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 cursor-pointer text-destructive hover:text-destructive"
                    onClick={() => handleDelete(listing._id, listing.title)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
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
