import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";

export const createListing = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    category: v.union(
      v.literal("digital_marketing"),
      v.literal("property_sale"),
      v.literal("property_rental"),
      v.literal("apartment_sale"),
      v.literal("apartment_rental"),
      v.literal("transport"),
      v.literal("communications"),
    ),
    price: v.number(),
    priceUnit: v.optional(v.string()),
    negotiable: v.optional(v.boolean()),
    images: v.array(v.string()),
    tags: v.optional(v.array(v.string())),
    location: v.optional(v.string()),
    city: v.optional(v.string()),
    province: v.optional(v.string()),
    bedrooms: v.optional(v.number()),
    bathrooms: v.optional(v.number()),
    garages: v.optional(v.number()),
    erf: v.optional(v.number()),
    floor: v.optional(v.number()),
    petFriendly: v.optional(v.boolean()),
    furnished: v.optional(v.boolean()),
    amenities: v.optional(v.array(v.string())),
    make: v.optional(v.string()),
    model: v.optional(v.string()),
    year: v.optional(v.number()),
    mileage: v.optional(v.number()),
    fuelType: v.optional(v.string()),
    deliveryTime: v.optional(v.string()),
    features: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError({ code: "UNAUTHENTICATED", message: "Not authenticated" });
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
    if (!user) throw new ConvexError({ code: "NOT_FOUND", message: "User not found" });
    if (user.role !== "seller") throw new ConvexError({ code: "FORBIDDEN", message: "Only sellers can create listings" });
    return await ctx.db.insert("listings", {
      ...args,
      sellerId: user._id,
      status: "active",
      viewCount: 0,
      inquiryCount: 0,
    });
  },
});

export const updateListing = mutation({
  args: {
    listingId: v.id("listings"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    price: v.optional(v.number()),
    priceUnit: v.optional(v.string()),
    negotiable: v.optional(v.boolean()),
    status: v.optional(v.union(
      v.literal("active"), v.literal("pending"), v.literal("sold"),
      v.literal("rented"), v.literal("inactive"),
    )),
    images: v.optional(v.array(v.string())),
    tags: v.optional(v.array(v.string())),
    location: v.optional(v.string()),
    city: v.optional(v.string()),
    bedrooms: v.optional(v.number()),
    bathrooms: v.optional(v.number()),
    features: v.optional(v.array(v.string())),
    deliveryTime: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError({ code: "UNAUTHENTICATED", message: "Not authenticated" });
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
    if (!user) throw new ConvexError({ code: "NOT_FOUND", message: "User not found" });
    const listing = await ctx.db.get(args.listingId);
    if (!listing) throw new ConvexError({ code: "NOT_FOUND", message: "Listing not found" });
    if (listing.sellerId !== user._id) throw new ConvexError({ code: "FORBIDDEN", message: "Not your listing" });
    const { listingId, ...updates } = args;
    await ctx.db.patch(listingId, updates);
  },
});

export const deleteListing = mutation({
  args: { listingId: v.id("listings") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError({ code: "UNAUTHENTICATED", message: "Not authenticated" });
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
    if (!user) throw new ConvexError({ code: "NOT_FOUND", message: "User not found" });
    const listing = await ctx.db.get(args.listingId);
    if (!listing) throw new ConvexError({ code: "NOT_FOUND", message: "Listing not found" });
    if (listing.sellerId !== user._id) throw new ConvexError({ code: "FORBIDDEN", message: "Not your listing" });
    await ctx.db.delete(args.listingId);
  },
});

export const getMyListings = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return { page: [], isDone: true, continueCursor: "" };
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
    if (!user) return { page: [], isDone: true, continueCursor: "" };
    return await ctx.db
      .query("listings")
      .withIndex("by_seller", (q) => q.eq("sellerId", user._id))
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

export const getListings = query({
  args: {
    paginationOpts: paginationOptsValidator,
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.category) {
      return await ctx.db
        .query("listings")
        .withIndex("by_category", (q) =>
          q.eq("category", args.category as "digital_marketing" | "property_sale" | "property_rental" | "apartment_sale" | "apartment_rental" | "transport" | "communications")
        )
        .filter((q) => q.eq(q.field("status"), "active"))
        .order("desc")
        .paginate(args.paginationOpts);
    }
    return await ctx.db
      .query("listings")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

export const getListing = query({
  args: { listingId: v.id("listings") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.listingId);
  },
});

export const incrementView = mutation({
  args: { listingId: v.id("listings") },
  handler: async (ctx, args) => {
    const listing = await ctx.db.get(args.listingId);
    if (!listing) return;
    await ctx.db.patch(args.listingId, { viewCount: (listing.viewCount ?? 0) + 1 });
  },
});
