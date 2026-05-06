import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import ShopOrder from "@/models/ShopOrder";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const {
            productId,
            paymentType,
            totalAmount,
            downPaymentAmount,
            monthlyPayment,
            financeTermMonths,
            variantName,
            shippingAddress,
            selectedCrypto,
            paymentProofUrl,
            shipmentFee,
        } = body;

        if (!productId || !paymentType || !totalAmount) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        await dbConnect();

        // Create the order
        const newOrder = new ShopOrder({
            userId: session.user.id,
            productId,
            paymentType,
            orderStatus: "PENDING",
            totalAmount,
            downPaymentAmount: downPaymentAmount || null,
            monthlyPayment: monthlyPayment || null,
            financeTermMonths: financeTermMonths || null,
            shippingAddress: shippingAddress || undefined,
            selectedCrypto: selectedCrypto || undefined,
            paymentProofUrl: paymentProofUrl || undefined,
            shipmentFee: shipmentFee ?? 0,
            notes: `Variant Selected: ${variantName || "Standard"}`
        });

        await newOrder.save();

        return NextResponse.json(
            { message: "Order placed successfully", orderId: newOrder._id },
            { status: 201 }
        );

    } catch (error: any) {
        console.error("Shop Order Error:", error);
        return NextResponse.json(
            { error: error.message || "An error occurred while placing the order" },
            { status: 500 }
        );
    }
}
