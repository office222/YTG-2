/**
 * ============================================================
 * TubeGenerator landing page configuration
 * ============================================================
 * THIS IS THE ONE PLACE TO EDIT CHECKOUT DESTINATIONS.
 *
 * Both Founding Member "RESERVE" buttons and the header /
 * hero "BECOME A FOUNDING MEMBER" button read from here.
 *
 * While `checkoutUrl` is null, the buttons scroll to the
 * Founding Member offer section (#founding-offer) instead of
 * leaving the site. Paste a WooCommerce checkout URL into a
 * tier's `checkoutUrl` and that tier's RESERVE button becomes
 * a real link — no other code changes required.
 * ============================================================
 */

export type FoundingTier = {
  id: string;
  name: string;
  price: string;
  billingNote: string;
  summary: string;
  includes: string[];
  /** Paste the WooCommerce checkout URL here when it exists. */
  checkoutUrl: string | null;
  highlighted: boolean;
};

export const FOUNDING_TIERS: FoundingTier[] = [
  {
    id: "founding-creator",
    name: "FOUNDING CREATOR",
    price: "$459",
    billingNote: "ONE TIME",
    summary:
      "For the creator who wants the full AI army pointed at one channel.",
    includes: [
      "Founding Member access to the working demo as it ships",
      "Every stage of the pipeline: research, create, publish, monitor, optimize",
      "Niche Navigator and the Niche Opportunity Report",
      "My Videos and My Playlists organisation tools",
      "Channel Guardian monitoring and repair directives",
      "Founding Member feedback channel that shapes the build order",
    ],
    checkoutUrl: null,
    highlighted: false,
  },
  {
    id: "founding-business",
    name: "FOUNDING BUSINESS",
    price: "$549",
    billingNote: "ONE TIME",
    summary:
      "For the creator building a business around the channel, not just uploads.",
    includes: [
      "Everything in Founding Creator",
      "Landing Page Generator and shopping cart tooling",
      "Sell-beyond-ad-revenue funnel builder",
      "Multi-channel workspace organisation",
      "Head Start Channel Marketplace access when it launches",
      "Priority position in the Founding Member feature queue",
    ],
    checkoutUrl: null,
    highlighted: true,
  },
];

/** Where the "explore the working demo" buttons send people. */
export const DEMO_ENTRY_PATH = "/auth" as const;

/** Anchor used by every founding-member call to action. */
export const OFFER_ANCHOR = "#founding-offer";

/**
 * Footer legal/support links.
 * PLACEHOLDER: each `href` is "#" until the real page exists.
 */
export const FOOTER_LINKS = [
  { label: "Terms", href: "#" },
  { label: "Privacy", href: "#" },
  { label: "Beta Agreement", href: "#" },
  { label: "Refund Policy", href: "#" },
  { label: "Contact", href: "#" },
  { label: "Support", href: "#" },
];
