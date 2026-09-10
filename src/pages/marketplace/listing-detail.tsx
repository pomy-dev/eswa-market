import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, MapPin, Eye, MessageSquare, Clock, CheckCircle, Star, BedDouble, Bath, Car, Maximize2, Fuel, Calendar, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { SEED_LISTINGS, CATEGORY_LABELS } from "@/lib/marketplace-data.ts";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const inquirySchema = z.object({
  name: z.string().min(2, "Required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  message: z.string().min(10, "Please write a message"),
});
type InquiryForm = z.infer<typeof inquirySchema>;

export default function ListingDetailPage() {
  const { listingId } = useParams<{ listingId: string }>();
  const listing = SEED_LISTINGS.find((l) => l.id === listingId);
  const [inquirySent, setInquirySent] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<InquiryForm>({ resolver: zodResolver(inquirySchema) });

  if (!listing) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Listing not found</h1>
        <Button asChild className="cursor-pointer"><Link to="/marketplace">Back to Marketplace</Link></Button>
      </div>
    );
  }

  const onSubmit = async (data: InquiryForm) => {
    await new Promise((r) => setTimeout(r, 1000));
    setInquirySent(true);
    toast.success("Inquiry sent! The seller will contact you shortly.");
  };

  const related = SEED_LISTINGS.filter((l) => l.category === listing.category && l.id !== listing.id).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Button variant="ghost" asChild className="mb-6 cursor-pointer -ml-2">
        <Link to="/marketplace"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Marketplace</Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-16">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image */}
          <div className="rounded-2xl overflow-hidden aspect-video">
            <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
          </div>

          {/* Title & Badges */}
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <Badge variant="secondary">{CATEGORY_LABELS[listing.category]}</Badge>
              {listing.badge && (
                <Badge className={`capitalize ${listing.badge === "featured" ? "bg-accent text-accent-foreground" : listing.badge === "hot" ? "bg-red-500 text-white" : "bg-primary text-primary-foreground"}`}>
                  {listing.badge}
                </Badge>
              )}
              {listing.negotiable && <Badge variant="outline">Negotiable</Badge>}
            </div>
            <h1 className="font-serif text-3xl font-bold mb-2">{listing.title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
              {listing.city && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{listing.city}{listing.province ? `, ${listing.province}` : ""}</span>}
              <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{listing.viewCount} views</span>
              <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" />{listing.inquiryCount} inquiries</span>
              {listing.deliveryTime && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{listing.deliveryTime}</span>}
            </div>
          </div>

          {/* Property specs */}
          {(listing.bedrooms !== undefined || listing.bathrooms !== undefined || listing.garages !== undefined || listing.erf !== undefined) && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {listing.bedrooms !== undefined && (
                <div className="flex flex-col items-center gap-1 p-3 bg-secondary rounded-xl">
                  <BedDouble className="w-5 h-5 text-primary" />
                  <span className="font-bold">{listing.bedrooms === 0 ? "Studio" : listing.bedrooms}</span>
                  <span className="text-xs text-muted-foreground">Bedrooms</span>
                </div>
              )}
              {listing.bathrooms !== undefined && (
                <div className="flex flex-col items-center gap-1 p-3 bg-secondary rounded-xl">
                  <Bath className="w-5 h-5 text-primary" />
                  <span className="font-bold">{listing.bathrooms}</span>
                  <span className="text-xs text-muted-foreground">Bathrooms</span>
                </div>
              )}
              {listing.garages !== undefined && (
                <div className="flex flex-col items-center gap-1 p-3 bg-secondary rounded-xl">
                  <Car className="w-5 h-5 text-primary" />
                  <span className="font-bold">{listing.garages}</span>
                  <span className="text-xs text-muted-foreground">Garages</span>
                </div>
              )}
              {listing.erf !== undefined && (
                <div className="flex flex-col items-center gap-1 p-3 bg-secondary rounded-xl">
                  <Maximize2 className="w-5 h-5 text-primary" />
                  <span className="font-bold">{listing.erf}m²</span>
                  <span className="text-xs text-muted-foreground">Erf Size</span>
                </div>
              )}
            </div>
          )}

          {/* Vehicle specs */}
          {listing.make && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex flex-col items-center gap-1 p-3 bg-secondary rounded-xl"><Car className="w-5 h-5 text-primary" /><span className="font-bold text-sm">{listing.make}</span><span className="text-xs text-muted-foreground">Make</span></div>
              <div className="flex flex-col items-center gap-1 p-3 bg-secondary rounded-xl"><Car className="w-5 h-5 text-primary" /><span className="font-bold text-sm">{listing.model}</span><span className="text-xs text-muted-foreground">Model</span></div>
              {listing.year && <div className="flex flex-col items-center gap-1 p-3 bg-secondary rounded-xl"><Calendar className="w-5 h-5 text-primary" /><span className="font-bold">{listing.year}</span><span className="text-xs text-muted-foreground">Year</span></div>}
              {listing.mileage && <div className="flex flex-col items-center gap-1 p-3 bg-secondary rounded-xl"><Fuel className="w-5 h-5 text-primary" /><span className="font-bold text-sm">{listing.mileage.toLocaleString()}km</span><span className="text-xs text-muted-foreground">Mileage</span></div>}
            </div>
          )}

          {/* Description */}
          <div>
            <h2 className="font-semibold text-lg mb-3">Description</h2>
            <p className="text-muted-foreground leading-relaxed">{listing.description}</p>
          </div>

          {/* Features / Amenities */}
          {(listing.features?.length || listing.amenities?.length) && (
            <div>
              <h2 className="font-semibold text-lg mb-3">{listing.features ? "What's Included" : "Amenities"}</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(listing.features ?? listing.amenities ?? []).map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Seller info */}
          <Card className="border-border">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-lg font-bold text-primary-foreground">
                {listing.sellerName.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{listing.sellerName}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />{listing.sellerLocation}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />)}
                  <span className="text-xs text-muted-foreground ml-1">Verified Seller</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div>
          <Card className="border-border sticky top-24">
            <CardContent className="p-6 space-y-4">
              <div>
                <p className="text-2xl font-bold">R{listing.price.toLocaleString()}</p>
                {listing.priceUnit && <p className="text-sm text-muted-foreground">{listing.priceUnit}</p>}
              </div>

              {inquirySent ? (
                <div className="text-center py-4">
                  <CheckCircle className="w-10 h-10 text-primary mx-auto mb-2" />
                  <p className="font-semibold">Inquiry Sent!</p>
                  <p className="text-xs text-muted-foreground mt-1">The seller will contact you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                  <p className="font-semibold text-sm">Send an Inquiry</p>
                  <div className="space-y-1">
                    <Label className="text-xs">Your Name</Label>
                    <Input placeholder="John Smith" {...register("name")} className="h-9 text-sm" />
                    {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Email</Label>
                    <Input placeholder="example@gmail.com" {...register("email")} className="h-9 text-sm" />
                    {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Phone (optional)</Label>
                    <Input placeholder="+27 82 123 4567" {...register("phone")} className="h-9 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Message</Label>
                    <textarea rows={3} placeholder={`I'm interested in ${listing.title}...`} {...register("message")} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
                    {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
                  </div>
                  <Button type="submit" size="lg" className="w-full cursor-pointer" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send Inquiry"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div>
          <h2 className="font-serif text-2xl font-bold mb-6">Similar Listings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {related.map((l) => (
              <Card key={l.id} className="overflow-hidden hover:shadow-lg transition-shadow border-border pt-0">
                <Link to={`/listings/${l.id}`} className="cursor-pointer">
                  <div className="h-36"><img src={l.images[0]} alt={l.title} className="w-full h-full object-cover" /></div>
                </Link>
                <CardContent className="p-4">
                  <Link to={`/listings/${l.id}`} className="cursor-pointer">
                    <h3 className="font-semibold text-sm hover:text-primary transition-colors">{l.title}</h3>
                  </Link>
                  <p className="font-bold mt-2">R{l.price.toLocaleString()}{l.priceUnit ? ` ${l.priceUnit}` : ""}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
