import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle, ArrowRight, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Authenticated, Unauthenticated } from "convex/react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { SignInButton } from "@/components/ui/signin.tsx";
import { toast } from "sonner";

const schema = z.object({
  businessName: z.string().min(2, "Business name required"),
  businessDescription: z.string().min(20, "Please provide a description (min 20 chars)"),
  businessCategory: z.string().min(2, "Select a category"),
  phone: z.string().min(10, "Valid phone number required"),
  location: z.string().min(3, "Location required"),
  website: z.string().url("Enter a valid URL").optional().or(z.literal("")),
});
type FormData = z.infer<typeof schema>;

const perks = [
  "Free to list — no hidden fees",
  "Manage orders, inquiries & payments in one dashboard",
  "Real-time notifications for every order",
  "Reach thousands of buyers across South Africa",
  "Verified seller badge for trust",
  "Analytics to track your listing performance",
];

const bizCategories = [
  "Digital Marketing", "Real Estate", "Property Rental",
  "Motor Vehicles", "Transport Services", "Telecommunications",
  "IT & Technology", "Other",
];

function SellerForm() {
  const navigate = useNavigate();
  const becomeSeller = useMutation(api.users.becomeSeller);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await becomeSeller({
        businessName: data.businessName,
        businessDescription: data.businessDescription,
        businessCategory: data.businessCategory,
        phone: data.phone,
        location: data.location,
        website: data.website || undefined,
      });
      toast.success("Welcome! Your seller account is ready.");
      navigate("/dashboard");
    } catch {
      toast.error("Failed to create seller account. Please try again.");
    }
  };

  return (
    <Card className="border-border">
      <CardContent className="p-6">
        <h2 className="font-semibold text-xl mb-5">Set Up Your Seller Profile</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Business Name</Label>
            <Input placeholder="Acme Properties" {...register("businessName")} />
            {errors.businessName && <p className="text-xs text-destructive">{errors.businessName.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Business Category</Label>
            <select {...register("businessCategory")} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer">
              <option value="">Select a category...</option>
              {bizCategories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.businessCategory && <p className="text-xs text-destructive">{errors.businessCategory.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Business Description</Label>
            <textarea rows={3} placeholder="Describe your business and what you offer..." {...register("businessDescription")} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
            {errors.businessDescription && <p className="text-xs text-destructive">{errors.businessDescription.message}</p>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Phone Number</Label>
              <Input placeholder="+27 82 123 4567" {...register("phone")} />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Location</Label>
              <Input placeholder="Sandton, Johannesburg" {...register("location")} />
              {errors.location && <p className="text-xs text-destructive">{errors.location.message}</p>}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Website <span className="text-muted-foreground text-xs">(optional)</span></Label>
            <Input placeholder="https://yourbusiness.co.za" {...register("website")} />
            {errors.website && <p className="text-xs text-destructive">{errors.website.message}</p>}
          </div>
          <Button type="submit" size="lg" className="w-full cursor-pointer" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : <>Create Seller Account <ArrowRight className="ml-2 w-4 h-4" /></>}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function BecomeSellerPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Leaf className="w-7 h-7 text-primary" />
        </div>
        <h1 className="font-serif text-4xl font-bold mb-4">Become a Seller</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          List your properties, vehicles, digital marketing services, and tech products to thousands of South African buyers — all from one powerful dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Perks */}
        <div>
          <h2 className="font-semibold text-xl mb-6">Why sell on DigitalEdge?</h2>
          <ul className="space-y-4 mb-8">
            {perks.map((perk) => (
              <li key={perk} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">{perk}</span>
              </li>
            ))}
          </ul>
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
            <p className="font-semibold text-sm text-primary mb-1">Already a seller?</p>
            <p className="text-sm text-muted-foreground mb-3">Access your dashboard to manage listings, orders, and payments.</p>
            <Button variant="secondary" asChild className="cursor-pointer">
              <Link to="/dashboard">Go to Dashboard <ArrowRight className="ml-2 w-4 h-4" /></Link>
            </Button>
          </div>
        </div>

        {/* Form / Auth gate */}
        <div>
          <Authenticated>
            <SellerForm />
          </Authenticated>
          <Unauthenticated>
            <Card className="border-border">
              <CardContent className="p-8 text-center">
                <Leaf className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-xl mb-2">Sign in first</h3>
                <p className="text-muted-foreground mb-6">You need to sign in before creating a seller account.</p>
                <SignInButton className="w-full h-11" />
              </CardContent>
            </Card>
          </Unauthenticated>
        </div>
      </div>
    </div>
  );
}
