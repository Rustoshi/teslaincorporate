import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import ShopOrder from "@/models/ShopOrder";

export async function GET() {
    await dbConnect();
    const order = await ShopOrder.findOne().sort({ createdAt: -1 });
    return NextResponse.json(order);
}
