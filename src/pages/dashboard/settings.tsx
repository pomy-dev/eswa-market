import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api.js";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().min(2, "Name required"),
  phone: z.string().optional(),
  location: z.string().optional(),
  businessName: z.string().optional(),
  businessDescription: z.string().optional(),
  website: z.string().url("Enter a valid URL").optional().or(z.literal("")),
});
type FormData = z.infer<typeof schema>;

export default function DashboardSettings() {
  const user = useQuery(api.users.getCurrentUser);
  const updateProfile = useMutation(api.users.updateProfile);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    values: {
      name: user?.name ?? "",
      phone: user?.phone ?? "",
      location: user?.location ?? "",
      businessName: user?.businessName ?? "",
      businessDescription: user?.businessDescription ?? "",
      website: user?.website ?? "",
    },
  });

  if (user === undefined) return <div className="p-8"><Skeleton className="h-10 w-full" /></div>;

  const onSubmit = async (data: FormData) => {
    try {
      await updateProfile({
        name: data.name,
        phone: data.phone || undefined,
        location: data.location || undefined,
        businessName: data.businessName || undefined,
        businessDescription: data.businessDescription || undefined,
        website: data.website || undefined,
      });
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-2xl space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your seller profile and preferences</p>
      </div>

      {/* Profile */}
      <Card className="border-border">
        <CardContent className="p-6">
          <h2 className="font-semibold mb-4">Personal Details</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Full Name</Label>
              <Input {...register("name")} placeholder="John Smith" />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Phone</Label>
                <Input {...register("phone")} placeholder="+27 82 123 4567" />
              </div>
              <div className="space-y-1.5">
                <Label>Location</Label>
                <Input {...register("location")} placeholder="Sandton, JHB" />
              </div>
            </div>
            <div className="border-t border-border pt-4 mt-2">
              <h3 className="text-sm font-semibold mb-3">Business Details</h3>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label>Business Name</Label>
                  <Input {...register("businessName")} placeholder="Your business name" />
                </div>
                <div className="space-y-1.5">
                  <Label>Business Description</Label>
                  <textarea rows={3} {...register("businessDescription")} placeholder="What does your business do?" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
                </div>
                <div className="space-y-1.5">
                  <Label>Website <span className="text-muted-foreground text-xs">(optional)</span></Label>
                  <Input {...register("website")} placeholder="https://yourbusiness.co.za" />
                  {errors.website && <p className="text-xs text-destructive">{errors.website.message}</p>}
                </div>
              </div>
            </div>
            <Button type="submit" className="cursor-pointer" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Account info */}
      <Card className="border-border">
        <CardContent className="p-6 space-y-3">
          <h2 className="font-semibold">Account Information</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Email</span>
              <span>{user?.email ?? "—"}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Role</span>
              <span className="capitalize">{user?.role ?? "—"}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Member Since</span>
              <span>{user?.sellerSince ? new Date(user.sellerSince).toLocaleDateString("en-ZA", { month: "long", year: "numeric" }) : "—"}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Business Category</span>
              <span>{user?.businessCategory ?? "—"}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
