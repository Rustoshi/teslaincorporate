import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import UserPlan from "@/models/UserPlan";
import Transaction from "@/models/Transaction";
import ProjectStake from "@/models/ProjectStake";
import DashboardClient from "@/components/dashboard/DashboardClient";

export default async function DashboardPage() {
    // 1. Get the active session
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        redirect("/invest/login");
    }

    // 2. Fetch the user's fresh database record
    await dbConnect();

    // Fetch user totals and currency
    const user = await User.findById(session.user.id).select(
        "totalBalance totalProfit totalInvested activePlans currency"
    ).lean();

    if (!user) {
        redirect("/invest/login");
    }

    // Fetch user's active plans
    const activePlansDocs = await UserPlan.find({
        userId: session.user.id,
        status: 'active'
    }).sort({ createdAt: -1 }).lean();

    // Fetch user's recent transactions
    const transactionsDocs = await Transaction.find({
        userId: session.user.id
    }).sort({ createdAt: -1 }).limit(5).lean();

    // Fetch user's active project stakes
    const projectStakesDocs = await ProjectStake.find({
        userId: session.user.id,
        status: 'active',
    })
        .populate("projectId", "name company slug heroBgColor")
        .sort({ investedAt: -1 })
        .lean() as any[];

    // Fetch user's shop orders
    const shopOrdersDocs = await import("@/models/ShopOrder").then(m => m.default).then(ShopOrder => ShopOrder.find({
        userId: session.user.id
    }).populate("productId", "name heroImage").sort({ createdAt: -1 }).lean());

    // 3. Prepare the data payload for the client component
    const userData = {
        totalBalance: user.totalBalance || 0,
        totalProfits: user.totalProfit || 0,
        totalInvested: user.totalInvested || 0,
        activePlansCount: user.activePlans || 0,
        currency: user.currency || "$",
    };

    const formattedPlans = activePlansDocs.map((plan: any) => ({
        id: plan.planId,
        name: plan.name,
        capital: `${user.currency}${plan.capital.toLocaleString(undefined, { minimumFractionDigits: 0 })}`,
        cycle: plan.cycle,
        target: plan.target,
        currentPnL: plan.currentPnL >= 0
            ? `+${user.currency}${plan.currentPnL.toLocaleString()}`
            : `-${user.currency}${Math.abs(plan.currentPnL).toLocaleString()}`
    }));

    const formattedActivities = transactionsDocs.map((tx: any) => {
        let title = "Transaction";
        let typeStr = "Transfer";
        let positive = true;

        switch (tx.type) {
            case "deposit":
                title = tx.paymentMethod ? `Deposit (${tx.paymentMethod})` : "Deposit";
                typeStr = "Deposit";
                break;
            case "withdrawal":
                title = tx.paymentMethod ? `Withdrawal (${tx.paymentMethod})` : "Withdrawal";
                typeStr = "Withdrawal";
                positive = false;
                break;
            case "investment":
                title = "Plan Subscription";
                typeStr = "Shopping"; // Reuse shopping icon
                positive = false;
                break;
            case "profit":
                title = "Yield Payout";
                typeStr = "Yield";
                break;
            case "transfer":
                title = "Fund Transfer";
                typeStr = "Transfer";
                break;
        }

        return {
            id: tx._id.toString(),
            type: typeStr,
            title,
            date: new Date(tx.createdAt || tx.date).toLocaleDateString("en-US", { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
            amount: `${positive ? '+' : '-'}${user.currency}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
            status: tx.status.charAt(0).toUpperCase() + tx.status.slice(1),
            positive
        };
    });

    const formattedProjectStakes = projectStakesDocs.map((s: any) => {
        const pnlPositive = s.currentPnL >= 0;
        const cur = user.currency || "$";
        return {
            stakeId:            s._id.toString(),
            projectName:        s.projectId?.name        ?? "Unknown Project",
            projectCompany:     s.projectId?.company     ?? "",
            projectSlug:        s.projectId?.slug        ?? "",
            projectHeroBgColor: s.projectId?.heroBgColor ?? "#ffffff",
            trancheName:        s.trancheName,
            investedAmount:     `${cur}${s.investedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            currentValue:       `${cur}${s.currentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            currentPnL:         `${pnlPositive ? "+" : "-"}${cur}${Math.abs(s.currentPnL).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            pnlPositive,
            yieldRange:         `${s.yieldLow}%${s.yieldHigh ? `–${s.yieldHigh}%` : "+"}`,
            status:             s.status,
        };
    });

    const formattedShopOrders = shopOrdersDocs.map((order: any) => ({
        id: order._id.toString(),
        model: order.productId ? order.productId.name : "Unknown Item",
        heroImage: order.productId ? order.productId.heroImage : null,
        date: new Date(order.createdAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' }),
        status: order.orderStatus,
        delivery: order.orderStatus === 'COMPLETED' ? "Delivered" : "Pending Allocation",
        totalAmount: order.totalAmount,
        paymentProgress: order.paymentType === 'CASH' ? 100 : 20, // Example logic, full payment assumed for cash, 20% down for finance
    }));

    // Fetch active vehicles for the shop section
    const activeProducts = await import("@/models/ShopProduct").then(m => m.default).then(ShopProduct => ShopProduct.find({ isActive: true, category: "VEHICLE" }).sort({ baseCashPrice: 1 }).lean());

    const formattedVehicles = activeProducts.map((v: any) => ({
        id: v._id.toString(),
        slug: v.slug,
        name: v.name,
        tagline: v.description || "Experience the Future",
        price: `From $${v.baseCashPrice?.toLocaleString() || "99,990"}`,
        range: v.specs?.range || "340 mi",
        acceleration: v.specs?.acceleration || "2.6s",
        img: v.heroImage || "",
    }));

    return <DashboardClient userData={userData} activePlans={formattedPlans} projectStakes={formattedProjectStakes} recentActivities={formattedActivities} shopOrders={formattedShopOrders} vehicles={formattedVehicles} currency={user.currency || "$"} />;
}
