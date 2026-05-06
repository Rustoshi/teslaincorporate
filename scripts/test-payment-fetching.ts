import dbConnect from "@/lib/mongodb";
import PaymentOption from "@/models/PaymentOption";
import dotenv from "dotenv";

dotenv.config();

async function testFetch() {
    try {
        console.log("Connecting to DB...");
        await dbConnect();
        console.log("Connected.");

        const options = await PaymentOption.find({ isActive: true }).lean();
        console.log("Active Payment Options found:", options.length);
        
        options.forEach((opt: any) => {
            console.log(`- ${opt.ticker} (${opt.network}): ${opt.walletAddress}`);
        });

        process.exit(0);
    } catch (err) {
        console.error("Test failed:", err);
        process.exit(1);
    }
}

testFetch();
