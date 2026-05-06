"use server";

import dbConnect from "@/lib/mongodb";
import PaymentOption from "@/models/PaymentOption";
import BankPaymentOption from "@/models/BankPaymentOption";
import WireTransferOption from "@/models/WireTransferOption";
import DirectPaymentOption from "@/models/DirectPaymentOption";

export interface PaymentOptionData {
    id: string;
    network: string;
    ticker: string;
    walletAddress: string;
}

export interface WireTransferOptionData {
    id: string;
    beneficiaryName: string;
    beneficiaryAddress?: string;
    bankName: string;
    bankAddress?: string;
    swiftCode: string;
    accountNumber: string;
    accountType?: string;
    routingNumber?: string;
    iban?: string;
    currency: string;
    referenceNote?: string;
    instructions?: string;
}

export interface DirectPaymentOptionData {
    id: string;
    type: 'paypal' | 'cashapp' | 'zelle';
    identifier: string;
    displayName?: string;
    instructions?: string;
}

export interface BankPaymentOptionData {
    id: string;
    bankName: string;
    accountName: string;
    accountNumber: string;
    accountType?: string;
    routingNumber?: string;
    iban?: string;
    swiftCode?: string;
    currency: string;
    instructions?: string;
}

export async function getPaymentOptions(): Promise<PaymentOptionData[]> {
    try {
        await dbConnect();
        const options = await PaymentOption.find({ isActive: true }).lean();

        return options.map((opt: any) => ({
            id: opt._id.toString(),
            network: opt.network,
            ticker: opt.ticker,
            walletAddress: opt.walletAddress,
        }));
    } catch (error) {
        console.error("Failed to fetch payment options:", error);
        return [];
    }
}

export async function getBankPaymentOptions(): Promise<BankPaymentOptionData[]> {
    try {
        await dbConnect();
        const options = await BankPaymentOption.find({ isActive: true }).lean();

        return options.map((opt: any) => ({
            id: opt._id.toString(),
            bankName: opt.bankName,
            accountName: opt.accountName,
            accountNumber: opt.accountNumber,
            accountType: opt.accountType,
            routingNumber: opt.routingNumber,
            iban: opt.iban,
            swiftCode: opt.swiftCode,
            currency: opt.currency,
            instructions: opt.instructions,
        }));
    } catch (error) {
        console.error("Failed to fetch bank payment options:", error);
        return [];
    }
}

export async function getDirectPaymentOptions(): Promise<DirectPaymentOptionData[]> {
    try {
        await dbConnect();
        const options = await DirectPaymentOption.find({ isActive: true }).lean();

        return options.map((opt: any) => ({
            id: opt._id.toString(),
            type: opt.type,
            identifier: opt.identifier,
            displayName: opt.displayName,
            instructions: opt.instructions,
        }));
    } catch (error) {
        console.error("Failed to fetch direct payment options:", error);
        return [];
    }
}

export async function getWireTransferOptions(): Promise<WireTransferOptionData[]> {
    try {
        await dbConnect();
        const options = await WireTransferOption.find({ isActive: true }).lean();

        return options.map((opt: any) => ({
            id: opt._id.toString(),
            beneficiaryName: opt.beneficiaryName,
            beneficiaryAddress: opt.beneficiaryAddress,
            bankName: opt.bankName,
            bankAddress: opt.bankAddress,
            swiftCode: opt.swiftCode,
            accountNumber: opt.accountNumber,
            accountType: opt.accountType,
            routingNumber: opt.routingNumber,
            iban: opt.iban,
            currency: opt.currency,
            referenceNote: opt.referenceNote,
            instructions: opt.instructions,
        }));
    } catch (error) {
        console.error("Failed to fetch wire transfer options:", error);
        return [];
    }
}
