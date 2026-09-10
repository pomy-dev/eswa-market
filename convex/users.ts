import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const updateCurrentUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({ code: "UNAUTHENTICATED", message: "User not logged in" });
    }
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
    if (user !== null) return user._id;
    return await ctx.db.insert("users", {
      name: identity.name,
      email: identity.email,
      tokenIdentifier: identity.tokenIdentifier,
      role: "buyer",
    });
  },
});

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    return await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
  },
});

export const becomeSeller = mutation({
  args: {
    businessName: v.string(),
    businessDescription: v.string(),
    businessCategory: v.string(),
    phone: v.string(),
    location: v.string(),
    website: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError({ code: "UNAUTHENTICATED", message: "Not authenticated" });
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
    if (!user) throw new ConvexError({ code: "NOT_FOUND", message: "User not found" });
    await ctx.db.patch(user._id, {
      role: "seller",
      businessName: args.businessName,
      businessDescription: args.businessDescription,
      businessCategory: args.businessCategory,
      phone: args.phone,
      location: args.location,
      website: args.website,
      sellerSince: new Date().toISOString(),
    });
    return user._id;
  },
});

export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    location: v.optional(v.string()),
    businessName: v.optional(v.string()),
    businessDescription: v.optional(v.string()),
    website: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError({ code: "UNAUTHENTICATED", message: "Not authenticated" });
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
    if (!user) throw new ConvexError({ code: "NOT_FOUND", message: "User not found" });
    const patch: Record<string, string> = {};
    if (args.name !== undefined) patch.name = args.name;
    if (args.phone !== undefined) patch.phone = args.phone;
    if (args.location !== undefined) patch.location = args.location;
    if (args.businessName !== undefined) patch.businessName = args.businessName;
    if (args.businessDescription !== undefined) patch.businessDescription = args.businessDescription;
    if (args.website !== undefined) patch.website = args.website;
    await ctx.db.patch(user._id, patch);
  },
});

export const getSellerById = query({
  args: { sellerId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.sellerId);
  },
});
