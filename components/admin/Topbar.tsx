"use client";

import { useSession, signOut } from "next-auth/react";

interface TopbarProps {
    title: string;
}

export default function Topbar({ title }: TopbarProps) {
    const { data: session } = useSession();

    const roleMap: Record<string, string> = {
        'super_admin': 'Super Admin',
        'manager': 'Manager',
        'support': 'Support Tech'
    };

    const displayRole = (session?.user as any)?.role ? roleMap[(session?.user as any).role] : 'Admin';
    const initials = session?.user?.firstName && session?.user?.lastName
        ? `${session.user.firstName[0]}${session.user.lastName[0]}`
        : "AD";

    return (
        <header className="h-16 flex items-center justify-between px-6 bg-white/[0.02] border-b border-white/10 backdrop-blur-md sticky top-0 z-40">
            {/* Left Box: Page Title */}
            <div className="pl-12 md:pl-0">
                <h1
                    className="text-sm font-bold tracking-[0.2em] uppercase text-white"
                    style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
                >
                    {title}
                </h1>
            </div>

            {/* Right Box: Identity & Logout */}
            <div className="flex items-center gap-6">

                {/* User Info */}
                <div className="hidden sm:flex items-center gap-3">
                    <div className="flex flex-col items-end">
                        <span className="text-xs font-bold text-white tracking-wider">
                            {session?.user?.firstName} {session?.user?.lastName}
                        </span>
                        <span className="text-[9px] font-bold text-red-500 tracking-widest uppercase">
                            {displayRole}
                        </span>
                    </div>
                    {/* Minimal Avatar */}
                    <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-white uppercase tracking-wider">
                        {initials}
                    </div>
                </div>

                {/* Vertical Divider */}
                <div className="w-px h-6 bg-white/10 hidden sm:block"></div>

                {/* Logout Button */}
                <button
                    onClick={() => signOut({ callbackUrl: '/admin/login' })}
                    className="text-[10px] font-bold tracking-widest uppercase text-white/40 hover:text-white transition-colors flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="hidden sm:inline">Sign Out</span>
                </button>
            </div>
        </header>
    );
}
