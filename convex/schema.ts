import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// ── Listing categories ────────────────────────────────────────────
// Digital marketing services, properties (buy/rent), transport, communications
const listingCategory = v.union(
  v.literal("digital_marketing"),
  v.literal("property_sale"),
  v.literal("property_rental"),
  v.literal("apartment_sale"),
  v.literal("apartment_rental"),
  v.literal("transport"),
  v.literal("communications"),
);

const listingStatus = v.union(
  v.literal("active"),
  v.literal("pending"),
  v.literal("sold"),
  v.literal("rented"),
  v.literal("inactive"),
);

const orderStatus = v.union(
  v.literal("pending"),
  v.literal("confirmed"),
  v.literal("in_progress"),
  v.literal("completed"),
  v.literal("cancelled"),
  v.literal("refunded"),
);

export default defineSchema({
  // ── Users (buyers + sellers share this table; role field distinguishes) ──
  users: defineTable({
    tokenIdentifier: v.string(),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    avatar: v.optional(v.string()),
    role: v.optional(v.union(v.literal("buyer"), v.literal("seller"), v.literal("admin"))),
    // Seller-only fields
    businessName: v.optional(v.string()),
    businessDescription: v.optional(v.string()),
    businessCategory: v.optional(v.string()),
    phone: v.optional(v.string()),
    location: v.optional(v.string()),
    website: v.optional(v.string()),
    isVerified: v.optional(v.boolean()),
    sellerSince: v.optional(v.string()),
  })
    .index("by_token", ["tokenIdentifier"])
    .index("by_role", ["role"]),

  // ── Listings (all categories in one table, extra fields as optional) ──
  listings: defineTable({
    sellerId: v.id("users"),
    title: v.string(),
    description: v.string(),
    category: listingCategory,
    price: v.number(),
    priceUnit: v.optional(v.string()), // "per month", "per day", "once-off", etc.
    negotiable: v.optional(v.boolean()),
    status: listingStatus,
    images: v.array(v.string()),
    tags: v.optional(v.array(v.string())),
    // Location for physical listings
    location: v.optional(v.string()),
    city: v.optional(v.string()),
    province: v.optional(v.string()),
    // Property-specific
    bedrooms: v.optional(v.number()),
    bathrooms: v.optional(v.number()),
    garages: v.optional(v.number()),
    erf: v.optional(v.number()), // m²
    floor: v.optional(v.number()),
    petFriendly: v.optional(v.boolean()),
    furnished: v.optional(v.boolean()),
    amenities: v.optional(v.array(v.string())),
    // Transport-specific
    make: v.optional(v.string()),
    model: v.optional(v.string()),
    year: v.optional(v.number()),
    mileage: v.optional(v.number()),
    fuelType: v.optional(v.string()),
    // Digital marketing / communications
    deliveryTime: v.optional(v.string()),
    features: v.optional(v.array(v.string())),
    // Metrics
    viewCount: v.optional(v.number()),
    inquiryCount: v.optional(v.number()),
  })
    .index("by_seller", ["sellerId"])
    .index("by_category", ["category"])
    .index("by_status", ["status"])
    .index("by_seller_and_status", ["sellerId", "status"]),

  // ── Orders ─────────────────────────────────────────────────────────
  orders: defineTable({
    buyerId: v.id("users"),
    sellerId: v.id("users"),
    listingId: v.id("listings"),
    status: orderStatus,
    amount: v.number(),
    quantity: v.number(),
    message: v.optional(v.string()),
    buyerName: v.optional(v.string()),
    buyerEmail: v.optional(v.string()),
    sellerNote: v.optional(v.string()),
    completedAt: v.optional(v.string()),
    cancelledAt: v.optional(v.string()),
  })
    .index("by_buyer", ["buyerId"])
    .index("by_seller", ["sellerId"])
    .index("by_listing", ["listingId"])
    .index("by_seller_and_status", ["sellerId", "status"]),

  // ── Notifications ───────────────────────────────────────────────
  notifications: defineTable({
    userId: v.id("users"),
    type: v.union(
      v.literal("new_order"),
      v.literal("order_update"),
      v.literal("new_inquiry"),
      v.literal("listing_approved"),
      v.literal("listing_rejected"),
      v.literal("payment_received"),
      v.literal("review_received"),
    ),
    title: v.string(),
    message: v.string(),
    read: v.boolean(),
    relatedId: v.optional(v.string()), // orderId or listingId
  })
    .index("by_user", ["userId"])
    .index("by_user_and_read", ["userId", "read"]),

  // ── Inquiries (for properties / non-instant-buy listings) ────────
  inquiries: defineTable({
    listingId: v.id("listings"),
    sellerId: v.id("users"),
    buyerId: v.optional(v.id("users")),
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    message: v.string(),
    responded: v.boolean(),
  })
    .index("by_listing", ["listingId"])
    .index("by_seller", ["sellerId"]),

  // ── Reviews ─────────────────────────────────────────────────────
  reviews: defineTable({
    listingId: v.id("listings"),
    sellerId: v.id("users"),
    reviewerId: v.id("users"),
    reviewerName: v.string(),
    rating: v.number(),
    comment: v.string(),
  })
    .index("by_listing", ["listingId"])
    .index("by_seller", ["sellerId"]),
});
