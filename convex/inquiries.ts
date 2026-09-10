import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createInquiry = mutation({
  args: {
    listingId: v.id("listings"),
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const listing = await ctx.db.get(args.listingId);
    if (!listing) throw new ConvexError({ code: "NOT_FOUND", message: "Listing not found" });

    const identity = await ctx.auth.getUserIdentity();
    let buyerId: import("./_generated/dataModel").Id<"users"> | undefined;
    if (identity) {
      const user = await ctx.db
        .query("users")
        .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
        .unique();
      buyerId = user?._id;
    }

    const inquiryId = await ctx.db.insert("inquiries", {
      listingId: args.listingId,
      sellerId: listing.sellerId,
      buyerId,
      name: args.name,
      email: args.email,
      phone: args.phone,
      message: args.message,
      responded: false,
    });

    // Increment inquiry count
    await ctx.db.patch(args.listingId, {
      inquiryCount: (listing.inquiryCount ?? 0) + 1,
    });

    // Notify the seller
    await ctx.db.insert("notifications", {
      userId: listing.sellerId,
      type: "new_inquiry",
      title: "New Inquiry",
      message: `${args.name} sent an inquiry about "${listing.title}"`,
      read: false,
      relatedId: inquiryId,
    });

    return inquiryId;
  },
});

export const getSellerInquiries = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
    if (!user) return [];
    return await ctx.db
      .query("inquiries")
      .withIndex("by_seller", (q) => q.eq("sellerId", user._id))
      .order("desc")
      .take(50);
  },
});

export const markInquiryResponded = mutation({
  args: { inquiryId: v.id("inquiries") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.inquiryId, { responded: true });
  },
});
