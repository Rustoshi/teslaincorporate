import dbConnect from "@/lib/mongodb";
import ShopProduct from "@/models/ShopProduct";
import InventoryClient from "@/components/admin/InventoryClient";

export default async function AdminInventoryPage() {
    await dbConnect();

    const rawProducts = await ShopProduct.find().sort({ createdAt: -1 }).lean();

    const serializedProducts = rawProducts.map((p: any) => ({
        _id: p._id.toString(),
        name: p.name || "",
        slug: p.slug || "",
        category: p.category || "VEHICLE",
        description: p.description || "",
        baseCashPrice: p.baseCashPrice || 0,
        heroImage: p.heroImage || "",
        isActive: p.isActive ?? true,
        createdAt: p.createdAt?.toISOString() || "",
    }));

    return <InventoryClient products={serializedProducts} />;
}
