import NextAuth, { DefaultSession } from "next-auth";

// Define the custom fields we are adding to the session and token
declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            id: string;
            firstName: string;
            lastName: string;
            tierLevel: number;
            kycStatus: string;
        } & DefaultSession["user"];
    }

    interface User {
        id: string;
        firstName: string;
        lastName: string;
        tierLevel: number;
        kycStatus: string;
    }
}

declare module "next-auth/jwt" {
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    interface JWT {
        id: string;
        firstName: string;
        lastName: string;
        tierLevel: number;
        kycStatus: string;
    }
}
