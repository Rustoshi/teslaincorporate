import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ContactMessage from '@/models/ContactMessage';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, email, subject, message } = body;

        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 });
        }

        await dbConnect();
        await ContactMessage.create({ name, email, subject: subject || 'General Enquiry', message });

        return NextResponse.json({ success: true }, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 });
    }
}
