import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // 1. Double check session (middleware also handles this)
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role === 'user') {
        redirect("/admin/login");
    }

    return (
        <div className="flex min-h-screen bg-black text-white font-sans overflow-hidden">
            {/* Sidebar Navigation */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 md:ml-64 relative">

                {/* Subtle Grid Background for main content area */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none z-0" />

                {/* Topbar sticky header */}
                <div className="relative z-40">
                    <Topbar title="Admin Dashboard" />
                </div>

                {/* Scrollable Page Content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative z-10 w-full max-w-[1600px] mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
