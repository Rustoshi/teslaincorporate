import dbConnect from "@/lib/mongodb";
import ContactMessage from "@/models/ContactMessage";
import ContactMessagesClient from "@/components/admin/ContactMessagesClient";

export default async function AdminMessagesPage() {
    await dbConnect();

    const raw = await ContactMessage.find({}).sort({ createdAt: -1 }).lean();

    const messages = raw.map((m: any) => ({
        _id: m._id.toString(),
        name: m.name || "",
        email: m.email || "",
        subject: m.subject || "",
        message: m.message || "",
        status: m.status || "unread",
        createdAt: m.createdAt?.toISOString() || "",
    }));

    return <ContactMessagesClient messages={messages} />;
}
