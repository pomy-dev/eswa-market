import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { toast } from "sonner";
import { CATEGORY_LABELS, type ListingCategory } from "@/lib/marketplace-data.ts";

const categories = Object.entries(CATEGORY_LABELS) as [ListingCategory, string][];

const schema = z.object({
  title: z.string().min(5, "Title required (min 5 chars)"),
  description: z.string().min(20, "Description required (min 20 chars)"),
  category: z.enum(["digital_marketing", "property_sale", "property_rental", "apartment_sale", "apartment_rental", "transport", "communications"]),
  price: z.coerce.number().min(1, "Price required"),
  priceUnit: z.string().optional(),
  negotiable: z.boolean().optional(),
  location: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  bedrooms: z.coerce.number().optional(),
  bathrooms: z.coerce.number().optional(),
  garages: z.coerce.number().optional(),
  erf: z.coerce.number().optional(),
  furnished: z.boolean().optional(),
  petFriendly: z.boolean().optional(),
  make: z.string().optional(),
  model: z.string().optional(),
  year: z.coerce.number().optional(),
  mileage: z.coerce.number().optional(),
  fuelType: z.string().optional(),
  deliveryTime: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const SA_PROVINCES = ["Gauteng", "Western Cape", "KwaZulu-Natal", "Eastern Cape", "Limpopo", "Mpumalanga", "North West", "Free State", "Northern Cape"];

export default function NewListingPage() {
  const navigate = useNavigate();
  const createListing = useMutation(api.listings.createListing);
  const [images, setImages] = useState<string[]>([""]);
  const [features, setFeatures] = useState<string[]>([""]);
  const [amenities, setAmenities] = useState<string[]>([""]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resolver = zodResolver(schema) as any;
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver });
  const category = watch("category");

  const addField = (setter: React.Dispatch<React.SetStateAction<string[]>>) => setter((prev) => [...prev, ""]);
  const removeField = (setter: React.Dispatch<React.SetStateAction<string[]>>, i: number) => setter((prev) => prev.filter((_, idx) => idx !== i));
  const updateField = (setter: React.Dispatch<React.SetStateAction<string[]>>, i: number, val: string) => setter((prev) => prev.map((v, idx) => idx === i ? val : v));

  const onSubmit = async (data: FormData) => {
    const validImages = images.filter((u) => u.trim());
    if (validImages.length === 0) {
      toast.error("Please add at least one image URL");
      return;
    }
    try {
      await createListing({
        ...data,
        images: validImages,
        features: features.filter((f) => f.trim()) || undefined,
        amenities: amenities.filter((a) => a.trim()) || undefined,
      });
      toast.success("Listing created!");
      navigate("/dashboard/listings");
    } catch {
      toast.error("Failed to create listing. Make sure you're a verified seller.");
    }
  };

  const isProperty = ["property_sale", "property_rental", "apartment_sale", "apartment_rental"].includes(category);
  const isTransport = category === "transport";
  const isService = ["digital_marketing", "communications"].includes(category);

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <Button variant="ghost" asChild className="mb-6 cursor-pointer -ml-2">
        <Link to="/dashboard/listings"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Listings</Link>
      </Button>
      <h1 className="font-serif text-2xl font-bold mb-6">Create New Listing</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic */}
        <Card className="border-border">
          <CardContent className="p-6 space-y-4">
            <h2 className="font-semibold">Basic Information</h2>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <select {...register("category")} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer">
                <option value="">Select a category...</option>
                {categories.map(([key, label]) => <option key={key} value={key}>{label}</option>)}
              </select>
              {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input placeholder="e.g. 3 Bed House in Sandton" {...register("title")} />
              {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <textarea rows={4} placeholder="Describe your listing in detail..." {...register("description")} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
              {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Price (R)</Label>
                <Input type="number" placeholder="e.g. 2500000" {...register("price")} />
                {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Price Unit <span className="text-muted-foreground text-xs">(optional)</span></Label>
                <Input placeholder="e.g. per month, once-off" {...register("priceUnit")} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="negotiable" {...register("negotiable")} className="cursor-pointer" />
              <label htmlFor="negotiable" className="text-sm cursor-pointer">Price is negotiable</label>
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card className="border-border">
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Images</h2>
              <Button type="button" variant="secondary" size="sm" onClick={() => addField(setImages)} className="cursor-pointer"><Plus className="w-3.5 h-3.5 mr-1" /> Add Image</Button>
            </div>
            <p className="text-xs text-muted-foreground">Paste image URLs (e.g. from Unsplash or your CDN)</p>
            {images.map((url, i) => (
              <div key={i} className="flex gap-2">
                <Input value={url} onChange={(e) => updateField(setImages, i, e.target.value)} placeholder="https://example.com/image.jpg" className="flex-1" />
                {images.length > 1 && <Button type="button" variant="ghost" size="icon" className="h-10 w-10 cursor-pointer text-destructive" onClick={() => removeField(setImages, i)}><X className="w-4 h-4" /></Button>}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Location */}
        <Card className="border-border">
          <CardContent className="p-6 space-y-4">
            <h2 className="font-semibold">Location</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label>Address / Area</Label>
                <Input placeholder="e.g. Sandton City Centre" {...register("location")} />
              </div>
              <div className="space-y-1.5">
                <Label>City</Label>
                <Input placeholder="e.g. Johannesburg" {...register("city")} />
              </div>
              <div className="space-y-1.5">
                <Label>Province</Label>
                <select {...register("province")} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer">
                  <option value="">Select...</option>
                  {SA_PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Property details */}
        {isProperty && (
          <Card className="border-border">
            <CardContent className="p-6 space-y-4">
              <h2 className="font-semibold">Property Details</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-1.5"><Label>Bedrooms</Label><Input type="number" min="0" {...register("bedrooms")} /></div>
                <div className="space-y-1.5"><Label>Bathrooms</Label><Input type="number" min="0" {...register("bathrooms")} /></div>
                <div className="space-y-1.5"><Label>Garages</Label><Input type="number" min="0" {...register("garages")} /></div>
                <div className="space-y-1.5"><Label>Erf (m²)</Label><Input type="number" min="0" {...register("erf")} /></div>
              </div>
              <div className="flex gap-6">
                <div className="flex items-center gap-2"><input type="checkbox" id="furnished" {...register("furnished")} className="cursor-pointer" /><label htmlFor="furnished" className="text-sm cursor-pointer">Furnished</label></div>
                <div className="flex items-center gap-2"><input type="checkbox" id="petFriendly" {...register("petFriendly")} className="cursor-pointer" /><label htmlFor="petFriendly" className="text-sm cursor-pointer">Pet Friendly</label></div>
              </div>
              {/* Amenities */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Amenities</Label>
                  <Button type="button" variant="secondary" size="sm" onClick={() => addField(setAmenities)} className="cursor-pointer"><Plus className="w-3 h-3 mr-1" /> Add</Button>
                </div>
                {amenities.map((a, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <Input value={a} onChange={(e) => updateField(setAmenities, i, e.target.value)} placeholder="e.g. Pool, Garden, Fibre" className="flex-1" />
                    {amenities.length > 1 && <Button type="button" variant="ghost" size="icon" className="h-10 w-10 cursor-pointer text-destructive" onClick={() => removeField(setAmenities, i)}><X className="w-4 h-4" /></Button>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Vehicle details */}
        {isTransport && (
          <Card className="border-border">
            <CardContent className="p-6 space-y-4">
              <h2 className="font-semibold">Vehicle Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5"><Label>Make</Label><Input placeholder="e.g. Toyota" {...register("make")} /></div>
                <div className="space-y-1.5"><Label>Model</Label><Input placeholder="e.g. Hilux" {...register("model")} /></div>
                <div className="space-y-1.5"><Label>Year</Label><Input type="number" placeholder="e.g. 2022" {...register("year")} /></div>
                <div className="space-y-1.5"><Label>Mileage (km)</Label><Input type="number" placeholder="e.g. 45000" {...register("mileage")} /></div>
              </div>
              <div className="space-y-1.5">
                <Label>Fuel Type</Label>
                <select {...register("fuelType")} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer">
                  <option value="">Select...</option>
                  {["Petrol", "Diesel", "Hybrid", "Electric", "LPG"].map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Service details */}
        {isService && (
          <Card className="border-border">
            <CardContent className="p-6 space-y-4">
              <h2 className="font-semibold">Service Details</h2>
              <div className="space-y-1.5">
                <Label>Delivery Time</Label>
                <Input placeholder="e.g. 2–3 weeks, Ongoing, 1–2 business days" {...register("deliveryTime")} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Features / Inclusions</Label>
                  <Button type="button" variant="secondary" size="sm" onClick={() => addField(setFeatures)} className="cursor-pointer"><Plus className="w-3 h-3 mr-1" /> Add</Button>
                </div>
                {features.map((f, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <Input value={f} onChange={(e) => updateField(setFeatures, i, e.target.value)} placeholder="e.g. 50 keywords, Monthly report" className="flex-1" />
                    {features.length > 1 && <Button type="button" variant="ghost" size="icon" className="h-10 w-10 cursor-pointer text-destructive" onClick={() => removeField(setFeatures, i)}><X className="w-4 h-4" /></Button>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Button type="submit" size="lg" className="w-full cursor-pointer" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Listing"}
        </Button>
      </form>
    </div>
  );
}
