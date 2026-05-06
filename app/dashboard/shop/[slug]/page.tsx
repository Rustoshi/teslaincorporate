import { notFound } from "next/navigation";
import { Metadata } from "next";
import OrderConfigurator from "@/components/shop/OrderConfigurator";
import dbConnect from "@/lib/mongodb";
import ShopProduct from "@/models/ShopProduct";
import VehicleDetails from "@/models/VehicleDetails";
import EnergyDetails from "@/models/EnergyDetails";
import PaymentOption from "@/models/PaymentOption";
import BankPaymentOption from "@/models/BankPaymentOption";
import WireTransferOption from "@/models/WireTransferOption";

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

    const [cryptoWallets, bankOptions, wireOptions] = await Promise.all([
        PaymentOption.find({ isActive: true }).lean(),
        BankPaymentOption.find({ isActive: true }).lean(),
        WireTransferOption.find({ isActive: true }).lean(),
    ]);

    // Convert ObjectIds to strings for Client Component serialization
    const safeProduct = JSON.parse(JSON.stringify(product));
    const safeDetails = JSON.parse(JSON.stringify(details));
    const safeCryptoWallets = JSON.parse(JSON.stringify(cryptoWallets));
    const safeBankOptions = JSON.parse(JSON.stringify(bankOptions));
    const safeWireOptions = JSON.parse(JSON.stringify(wireOptions));

    return (
        <div className="w-full flex-1">
            <OrderConfigurator
                product={safeProduct}
                details={safeDetails}
                cryptoWallets={safeCryptoWallets}
                bankOptions={safeBankOptions}
                wireOptions={safeWireOptions}
                isDashboard={true}
            />
        </div>
    );
}
