import { notFound } from "next/navigation";
import { Metadata } from "next";
import ShopNavbar from "@/components/shop/ShopNavbar";
import ShopFooter from "@/components/shop/ShopFooter";
import OrderConfigurator from "@/components/shop/OrderConfigurator";
import dbConnect from "@/lib/mongodb";
import ShopProduct from "@/models/ShopProduct";
import VehicleDetails from "@/models/VehicleDetails";
import EnergyDetails from "@/models/EnergyDetails";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    await dbConnect();
    const product = await ShopProduct.findOne({ slug }).lean();
    if (!product) return { title: "Product Not Found" };
    return {
        title: `Design Your ${product.name} | Musk Capital Inc`,
        description: product.description,
    };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    await dbConnect();
    const product = await ShopProduct.findOne({ slug }).lean();

    if (!product || !product.isActive) {
        notFound();
    }

    let details = null;

    if (product.category === 'VEHICLE') {
        details = await VehicleDetails.findOne({ productId: product._id }).lean();
    } else if (product.category === 'ENERGY') {
        details = await EnergyDetails.findOne({ productId: product._id }).lean();
    }

    if (!details) {
        // Technically an error state in DB, but we handle it gracefully by just passing null details
        details = { variants: [] };
    }

    // Convert ObjectIds to strings for Client Component serialization
    const safeProduct = JSON.parse(JSON.stringify(product));
    const safeDetails = JSON.parse(JSON.stringify(details));

    return (
        <div className="bg-[#F4F4F4] min-h-screen flex flex-col">
            <ShopNavbar />

            <main className="flex-1 w-full pt-[60px]">
                <OrderConfigurator product={safeProduct} details={safeDetails} />
            </main>

            <ShopFooter />
        </div>
    );
}
