import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";

export const createOrder = mutation({
  args: {
    listingId: v.id("listings"),
    quantity: v.number(),
    message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError({ code: "UNAUTHENTICATED", message: "Not authenticated" });
    const buyer = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
    if (!buyer) throw new ConvexError({ code: "NOT_FOUND", message: "User not found" });
    const listing = await ctx.db.get(args.listingId);
    if (!listing) throw new ConvexError({ code: "NOT_FOUND", message: "Listing not found" });

    const orderId = await ctx.db.insert("orders", {
      buyerId: buyer._id,
      sellerId: listing.sellerId,
      listingId: args.listingId,
      status: "pending",
      amount: listing.price * args.quantity,
      quantity: args.quantity,
      message: args.message,
      buyerName: buyer.name,
      buyerEmail: buyer.email,
    });

    // Notify the seller
    await ctx.db.insert("notifications", {
      userId: listing.sellerId,
      type: "new_order",
      title: "New Order Received",
      message: `${buyer.name ?? "A buyer"} ordered "${listing.title}"`,
      read: false,
      relatedId: orderId,
    });

    return orderId;
  },
});

export const updateOrderStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.union(
      v.literal("confirmed"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("cancelled"),
    ),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError({ code: "UNAUTHENTICATED", message: "Not authenticated" });
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
    if (!user) throw new ConvexError({ code: "NOT_FOUND", message: "User not found" });
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new ConvexError({ code: "NOT_FOUND", message: "Order not found" });
    if (order.sellerId !== user._id && order.buyerId !== user._id) {
      throw new ConvexError({ code: "FORBIDDEN", message: "Not your order" });
    }
    const updates: Record<string, string> = { status: args.status };
    if (args.note) updates.sellerNote = args.note;
    if (args.status === "completed") updates.completedAt = new Date().toISOString();
    if (args.status === "cancelled") updates.cancelledAt = new Date().toISOString();
    await ctx.db.patch(args.orderId, updates);

    // Notify the buyer
    await ctx.db.insert("notifications", {
      userId: order.buyerId,
      type: "order_update",
      title: "Order Status Updated",
      message: `Your order status changed to: ${args.status}`,
      read: false,
      relatedId: args.orderId,
    });
  },
});

export const getMyOrders = query({
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
      .query("orders")
      .withIndex("by_buyer", (q) => q.eq("buyerId", user._id))
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

export const getSellerOrders = query({
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
      .query("orders")
      .withIndex("by_seller", (q) => q.eq("sellerId", user._id))
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

export const getOrderWithListing = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args): Promise<{ order: { buyerId: import("./_generated/dataModel").Id<"users">; sellerId: import("./_generated/dataModel").Id<"users">; listingId: import("./_generated/dataModel").Id<"listings">; status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled" | "refunded"; amount: number; quantity: number; _id: import("./_generated/dataModel").Id<"orders">; _creationTime: number; message?: string; buyerName?: string; buyerEmail?: string; sellerNote?: string; completedAt?: string; cancelledAt?: string; } | null; listing: import("./_generated/dataModel").Doc<"listings"> | null } | null> => {
    const order = await ctx.db.get(args.orderId);
    if (!order) return null;
    const listing = await ctx.db.get(order.listingId);
    return { order, listing };
  },
});
