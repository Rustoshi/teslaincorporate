import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import CompanyDetails from "@/models/CompanyDetails";
import PaymentOption from "@/models/PaymentOption";
import BankPaymentOption from "@/models/BankPaymentOption";
import InvestmentPlan from "@/models/InvestmentPlan";
import SupportSettings from "@/models/SupportSettings";
import WireTransferOption from "@/models/WireTransferOption";
import DirectPaymentOption from "@/models/DirectPaymentOption";
import SettingsTabs from "@/components/admin/SettingsTabs";

export default async function AdminSettingsPage() {
    await getServerSession(authOptions);
    await dbConnect();

    // Fetch or create default Company Details
    let companyDetails = await CompanyDetails.findOne().lean();
    if (!companyDetails) {
        const defaultDetails = await CompanyDetails.create({});
        companyDetails = defaultDetails.toObject();
    }

    // Fetch Crypto Payment Options
    const rawPaymentOptions = await PaymentOption.find().sort({ createdAt: -1 }).lean();
    const paymentOptions = rawPaymentOptions.map(p => ({
        ...p,
        _id: p._id?.toString(),
        createdAt: p.createdAt?.toISOString(),
        updatedAt: p.updatedAt?.toISOString()
    }));

    // Fetch Bank Payment Options
    const rawBankOptions = await BankPaymentOption.find().sort({ createdAt: -1 }).lean();
    const bankPaymentOptions = rawBankOptions.map((p: any) => ({
        ...p,
        _id: p._id?.toString(),
        createdAt: p.createdAt?.toISOString(),
        updatedAt: p.updatedAt?.toISOString()
    }));

    // Fetch Wire Transfer Options
    const rawWireOptions = await WireTransferOption.find().sort({ createdAt: -1 }).lean();
    const wireTransferOptions = rawWireOptions.map((p: any) => ({
        ...p,
        _id: p._id?.toString(),
        createdAt: p.createdAt?.toISOString(),
        updatedAt: p.updatedAt?.toISOString()
    }));

    // Fetch Direct Payment Options (PayPal, CashApp, Zelle)
    const rawDirectOptions = await DirectPaymentOption.find().sort({ createdAt: -1 }).lean();
    const directPaymentOptions = rawDirectOptions.map((p: any) => ({
        ...p,
        _id: p._id?.toString(),
        createdAt: p.createdAt?.toISOString(),
        updatedAt: p.updatedAt?.toISOString()
    }));

    // Fetch Investment Plans
    const rawInvestmentPlans = await InvestmentPlan.find().sort({ createdAt: -1 }).lean();
    const investmentPlans = rawInvestmentPlans.map(p => ({
        ...p,
        _id: p._id?.toString(),
        createdAt: p.createdAt?.toISOString(),
        updatedAt: p.updatedAt?.toISOString(),
        // Ensure features have their own IDs strings if needed by React, though they should have _id from Mongo
        features: p.features.map((f: any) => ({ ...f, _id: f._id?.toString() }))
    }));

    // Fetch or create default Support Settings
    let rawSupport = await SupportSettings.findOne().lean() as any;
    if (!rawSupport) {
        rawSupport = { mode: 'smartsupp', telegramUsername: '' };
    }
    const supportSettings = {
        mode: rawSupport.mode ?? 'smartsupp',
        telegramUsername: rawSupport.telegramUsername ?? '',
    };

    // Serialize Company Details
    const serializedCompanyDetails = {
        ...companyDetails,
        _id: companyDetails._id?.toString(),
        createdAt: companyDetails.createdAt?.toISOString(),
        updatedAt: companyDetails.updatedAt?.toISOString()
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-black uppercase tracking-[0.1em] text-white" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>Platform Settings</h1>
                <p className="text-sm text-white/50 tracking-wider">Manage global application configurations, deposit gateways, and capital programs.</p>
            </div>

            {/* Interactive Tabs */}
            <SettingsTabs
                companyDetails={serializedCompanyDetails}
                paymentOptions={paymentOptions}
                bankPaymentOptions={bankPaymentOptions}
                wireTransferOptions={wireTransferOptions}
                directPaymentOptions={directPaymentOptions}
                investmentPlans={investmentPlans}
                supportSettings={supportSettings}
            />
        </div>
    );
}
