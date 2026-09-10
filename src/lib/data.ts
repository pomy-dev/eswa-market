export type Category =
  | "SEO"
  | "Social Media"
  | "Content Marketing"
  | "Email Marketing"
  | "PPC Advertising"
  | "Web Design"
  | "Analytics"
  | "Branding";

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: Category;
  price: number;
  originalPrice?: number;
  description: string;
  longDescription: string;
  features: string[];
  image: string;
  badge?: "bestseller" | "new" | "sale";
  deliveryTime: string;
  rating: number;
  reviewCount: number;
};

export const PRODUCTS: Product[] = [
  {
    id: "seo-starter",
    name: "SEO Starter Package",
    slug: "seo-starter",
    category: "SEO",
    price: 499,
    description: "Boost your organic search rankings with foundational SEO work.",
    longDescription:
      "Our SEO Starter Package is designed for businesses looking to establish a strong organic search presence. We conduct comprehensive keyword research, on-page optimization, and technical SEO audits to set the foundation for long-term growth.",
    features: [
      "Keyword research (50 keywords)",
      "On-page optimization (10 pages)",
      "Technical SEO audit",
      "Google Search Console setup",
      "Monthly performance report",
    ],
    image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=600&h=400&fit=crop",
    badge: "bestseller",
    deliveryTime: "2–3 weeks",
    rating: 4.8,
    reviewCount: 124,
  },
  {
    id: "seo-pro",
    name: "SEO Pro Package",
    slug: "seo-pro",
    category: "SEO",
    price: 1299,
    originalPrice: 1599,
    description: "Full-scale SEO campaign to dominate search rankings.",
    longDescription:
      "The SEO Pro Package is a comprehensive 3-month SEO campaign covering all aspects of search optimization. From deep technical audits to authority link building, we'll propel your site to page one.",
    features: [
      "Keyword research (200 keywords)",
      "Full site on-page optimization",
      "Technical SEO remediation",
      "Link building (20 backlinks/month)",
      "Competitor analysis",
      "Bi-weekly reporting",
    ],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
    badge: "sale",
    deliveryTime: "3 months",
    rating: 4.9,
    reviewCount: 87,
  },
  {
    id: "social-media-management",
    name: "Social Media Management",
    slug: "social-media-management",
    category: "Social Media",
    price: 799,
    description: "Expert social media management across all major platforms.",
    longDescription:
      "We manage your brand's social media presence with a strategic content calendar, engaging posts, community management, and growth hacking techniques. Focus on your business while we grow your audience.",
    features: [
      "4 platforms (IG, FB, X, LinkedIn)",
      "20 posts per month",
      "Community management",
      "Story creation",
      "Monthly analytics report",
    ],
    image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=600&h=400&fit=crop",
    badge: "bestseller",
    deliveryTime: "Ongoing",
    rating: 4.7,
    reviewCount: 203,
  },
  {
    id: "social-ads",
    name: "Social Media Advertising",
    slug: "social-ads",
    category: "Social Media",
    price: 1099,
    description: "High-converting paid social campaigns that drive real ROI.",
    longDescription:
      "Our paid social specialists design, launch, and optimize ad campaigns on Facebook, Instagram, and LinkedIn. We use data-driven targeting and creative testing to maximize your return on ad spend.",
    features: [
      "Campaign strategy & setup",
      "Audience research & targeting",
      "Ad creative (5 variations)",
      "A/B testing",
      "Weekly optimization",
      "Detailed ROI reporting",
    ],
    image: "https://images.unsplash.com/photo-1562577309-2592ab84b1bc?w=600&h=400&fit=crop",
    badge: "new",
    deliveryTime: "1 week setup",
    rating: 4.6,
    reviewCount: 65,
  },
  {
    id: "content-marketing",
    name: "Content Marketing Bundle",
    slug: "content-marketing",
    category: "Content Marketing",
    price: 699,
    description: "High-quality content that attracts, engages, and converts.",
    longDescription:
      "Content is king — and our Content Marketing Bundle delivers a steady stream of SEO-optimized blogs, landing page copy, and social captions that position your brand as an industry authority.",
    features: [
      "4 long-form blog posts/month",
      "SEO-optimized copywriting",
      "Social media captions",
      "Content calendar",
      "Performance analytics",
    ],
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&h=400&fit=crop",
    deliveryTime: "Ongoing",
    rating: 4.7,
    reviewCount: 91,
  },
  {
    id: "email-marketing",
    name: "Email Marketing Automation",
    slug: "email-marketing",
    category: "Email Marketing",
    price: 549,
    description: "Automated email sequences that nurture leads and drive sales.",
    longDescription:
      "Turn your email list into a revenue machine. We design beautiful, conversion-focused email sequences — from welcome flows to abandoned cart recovery — fully automated so you earn while you sleep.",
    features: [
      "Email strategy & planning",
      "5-email welcome sequence",
      "Abandoned cart recovery",
      "Newsletter template design",
      "List segmentation",
      "A/B subject line testing",
    ],
    image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=600&h=400&fit=crop",
    badge: "new",
    deliveryTime: "1–2 weeks",
    rating: 4.8,
    reviewCount: 58,
  },
  {
    id: "google-ads",
    name: "Google Ads Management",
    slug: "google-ads",
    category: "PPC Advertising",
    price: 899,
    originalPrice: 1099,
    description: "Dominate Google search results with expertly managed PPC campaigns.",
    longDescription:
      "Our certified Google Ads specialists build and manage high-performing campaigns targeting your ideal customers. From search to display to shopping ads, we optimize every dollar for maximum conversions.",
    features: [
      "Account setup & audit",
      "Keyword research & bidding",
      "Ad copy creation (10 variants)",
      "Landing page recommendations",
      "Negative keyword management",
      "Weekly performance reports",
    ],
    image: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=600&h=400&fit=crop",
    badge: "sale",
    deliveryTime: "1 week setup",
    rating: 4.9,
    reviewCount: 112,
  },
  {
    id: "brand-identity",
    name: "Brand Identity Package",
    slug: "brand-identity",
    category: "Branding",
    price: 1499,
    description: "A complete brand identity that makes you unforgettable.",
    longDescription:
      "From logo design to brand guidelines, our Brand Identity Package gives your business a professional, cohesive visual identity that resonates with your target audience and stands out from competitors.",
    features: [
      "Logo design (3 concepts, 2 revisions)",
      "Color palette & typography",
      "Brand style guide",
      "Business card design",
      "Social media kit",
      "Brand strategy document",
    ],
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop",
    badge: "bestseller",
    deliveryTime: "2–3 weeks",
    rating: 4.9,
    reviewCount: 78,
  },
  {
    id: "website-landing-page",
    name: "Landing Page Design",
    slug: "website-landing-page",
    category: "Web Design",
    price: 849,
    description: "Conversion-optimized landing pages that turn visitors into customers.",
    longDescription:
      "A great landing page can transform your marketing ROI. Our design team creates stunning, mobile-first landing pages with compelling copy, strategic CTAs, and seamless conversion funnels.",
    features: [
      "Custom responsive design",
      "Conversion copywriting",
      "Mobile optimization",
      "2 revision rounds",
      "Speed optimization",
      "Analytics integration",
    ],
    image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&h=400&fit=crop",
    deliveryTime: "1–2 weeks",
    rating: 4.7,
    reviewCount: 94,
  },
  {
    id: "analytics-setup",
    name: "Analytics & Reporting Setup",
    slug: "analytics-setup",
    category: "Analytics",
    price: 399,
    description: "Full-stack analytics setup to track, measure, and grow smarter.",
    longDescription:
      "Stop flying blind. Our analytics setup service configures Google Analytics 4, Tag Manager, Search Console, and a custom dashboard so you always know what's working and what needs attention.",
    features: [
      "GA4 setup & configuration",
      "Google Tag Manager setup",
      "Custom dashboard creation",
      "Conversion tracking",
      "Monthly automated reports",
    ],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
    badge: "new",
    deliveryTime: "3–5 days",
    rating: 4.6,
    reviewCount: 43,
  },
  {
    id: "full-digital-suite",
    name: "Full Digital Marketing Suite",
    slug: "full-digital-suite",
    category: "SEO",
    price: 2999,
    originalPrice: 4200,
    description: "The complete package — every digital marketing channel, fully managed.",
    longDescription:
      "For businesses serious about digital dominance, our Full Digital Marketing Suite combines SEO, social media, content, email, PPC, and analytics into one integrated strategy. This is how brands scale fast.",
    features: [
      "Everything in SEO Pro",
      "Social media management (4 platforms)",
      "Google & social ads management",
      "Content marketing (4 blogs/month)",
      "Email marketing automation",
      "Brand strategy consultation",
      "Weekly strategy calls",
      "Dedicated account manager",
    ],
    image: "https://images.unsplash.com/photo-1553484771-371a605b060b?w=600&h=400&fit=crop",
    badge: "bestseller",
    deliveryTime: "Ongoing",
    rating: 5.0,
    reviewCount: 35,
  },
  {
    id: "influencer-outreach",
    name: "Influencer Outreach Campaign",
    slug: "influencer-outreach",
    category: "Social Media",
    price: 1199,
    description: "Connect your brand with the right influencers to amplify your reach.",
    longDescription:
      "Leverage the power of social proof. We identify, vet, and manage partnerships with influencers who genuinely align with your brand values, crafting campaigns that generate authentic engagement and real sales.",
    features: [
      "Influencer research & vetting",
      "Outreach & negotiation",
      "Campaign brief creation",
      "Content approval workflow",
      "Performance tracking",
      "ROI analysis report",
    ],
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=400&fit=crop",
    badge: "new",
    deliveryTime: "2–4 weeks",
    rating: 4.5,
    reviewCount: 29,
  },
];

export const CATEGORIES: Category[] = [
  "SEO",
  "Social Media",
  "Content Marketing",
  "Email Marketing",
  "PPC Advertising",
  "Web Design",
  "Analytics",
  "Branding",
];
