import MembershipTier from "@/models/MembershipTier";

const SEED_TIERS = [
    {
        name: "Silver",
        slug: "silver",
        description: "The entry point into the Musk Space Membership Programme. Designed for emerging investors seeking premium access and portfolio support.",
        benefits: [
            "Priority customer support (48h response)",
            "Exclusive member-only market insights",
            "Early access to new investment plans",
            "Monthly performance report",
            "5% fee discount on all transactions",
        ],
        colorFrom: "#1a1a2e",
        colorTo: "#16213e",
        accentColor: "#a8b2c1",
        annualFee: 199,
        requirements: "Minimum account balance of $5,000 or cumulative investment of $10,000.",
        sortOrder: 1,
        isActive: true,
    },
    {
        name: "Gold",
        slug: "gold",
        description: "For the discerning investor. Gold membership unlocks dedicated advisors, enhanced yields, and premium concierge services.",
        benefits: [
            "Dedicated account manager",
            "Priority support (24h response)",
            "Enhanced yield on select plans (+0.5%)",
            "Quarterly strategy consultation",
            "10% fee discount on all transactions",
            "Access to Gold-tier Tesla vehicle financing rates",
            "Invitations to exclusive investor webinars",
        ],
        colorFrom: "#1c1400",
        colorTo: "#2e2200",
        accentColor: "#c9a84c",
        annualFee: 499,
        requirements: "Minimum cumulative investment of $50,000 or total portfolio value of $75,000.",
        sortOrder: 2,
        isActive: true,
    },
    {
        name: "Platinum",
        slug: "platinum",
        description: "Platinum status represents mastery. Reserved for high-net-worth members who demand the finest in service, returns, and access.",
        benefits: [
            "Personal wealth manager assigned",
            "VIP support (4h response, 24/7)",
            "Enhanced yield on all plans (+1.25%)",
            "Bespoke investment portfolio structuring",
            "15% fee discount on all transactions",
            "Premium Tesla vehicle financing (0% processing fee)",
            "Access to pre-IPO project tranches",
            "Monthly 1-on-1 portfolio review call",
            "Invitations to Musk Space private events",
        ],
        colorFrom: "#0d0d1a",
        colorTo: "#1a1a35",
        accentColor: "#8b9fd4",
        annualFee: 1999,
        requirements: "Minimum portfolio value of $250,000 or cumulative investment exceeding $500,000.",
        sortOrder: 3,
        isActive: true,
    },
    {
        name: "Black",
        slug: "black",
        description: "The pinnacle of Musk Space membership. Black Card holders are our most valued partners — ultra-exclusive, invitation-only, with unparalleled privileges.",
        benefits: [
            "Dedicated senior private banker",
            "Instant priority support (1h response, 24/7/365)",
            "Maximum yield enhancement on all plans (+2.5%)",
            "Zero transaction fees across the platform",
            "Fully bespoke investment strategy",
            "First access to all new products and vehicles",
            "Tesla vehicle acquisition concierge service",
            "Quarterly private dinner with the investment team",
            "Global lounge access partnership",
            "Personalised engraved Black Card issued",
        ],
        colorFrom: "#050505",
        colorTo: "#111111",
        accentColor: "#e8c97a",
        annualFee: 9999,
        requirements: "By invitation only. Minimum portfolio value of $1,000,000 or exceptional contribution to the Musk Space community.",
        sortOrder: 4,
        isActive: true,
    },
];

export async function seedMembershipTiers(): Promise<void> {
    await MembershipTier.bulkWrite(
        SEED_TIERS.map((tier) => ({
            updateOne: {
                filter: { slug: tier.slug },
                update: { $set: tier },
                upsert: true,
            },
        }))
    );
}
