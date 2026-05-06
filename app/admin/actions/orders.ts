"use server";

import dbConnect from "@/lib/mongodb";
import ShopOrder from "@/models/ShopOrder";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(
    orderId: string,
    status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED" | "CANCELLED"
) {
    try {
        await dbConnect();
        await ShopOrder.findByIdAndUpdate(orderId, { orderStatus: status });
        revalidatePath("/admin/orders");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updateOrderNotes(orderId: string, notes: string) {
    try {
        await dbConnect();
        await ShopOrder.findByIdAndUpdate(orderId, { notes });
        revalidatePath("/admin/orders");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
