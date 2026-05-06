import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
                source: { type: "text" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing email or password");
                }

                await dbConnect();

                const user = await User.findOne({ email: credentials.email });

                if (!user) {
                    throw new Error("No user found with this email");
                }

                // WARNING: The user explicitly requested plain-text password comparison.
                // This is highly insecure and not recommended for production.
                const isPasswordValid = user.password === credentials.password;

                if (!isPasswordValid) {
                    throw new Error("Invalid password");
                }

                // Block suspended or blocked accounts
                if (user.accountStatus === 'suspended') {
                    throw new Error("Your account has been suspended. Please contact support.");
                }

                if (user.accountStatus === 'blocked') {
                    throw new Error("Your account has been blocked. Please contact support.");
                }

                // If logging in from the Admin Portal, ensure they have an admin role
                if (credentials?.source === "admin" && user.role === "user") {
                    throw new Error("Access denied. Admin privileges required.");
                }

                return {
                    id: user._id.toString(),
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    tierLevel: user.tierLevel,
                    kycStatus: user.kycStatus,
                    role: user.role
                };
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }: any) {
            // Append custom fields from the authorize return block into the JWT token
            if (user) {
                token.id = user.id;
                token.firstName = user.firstName;
                token.lastName = user.lastName;
                token.tierLevel = user.tierLevel;
                token.kycStatus = user.kycStatus;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }: any) {
            // Transfer JWT fields to the active client session object
            if (session.user) {
                session.user.id = token.id as string;
                session.user.firstName = token.firstName as string;
                session.user.lastName = token.lastName as string;
                session.user.tierLevel = token.tierLevel as number;
                session.user.kycStatus = token.kycStatus as string;
                session.user.role = token.role as string;
            }
            return session;
        }
    },
    session: {
        strategy: "jwt" as const,
        // The user explicitly requested "no expiry". We simulate this with an absurdly long maxAge 
        // 365 Days * 24 Hours * 60 Minutes * 60 Seconds
        maxAge: 365 * 24 * 60 * 60,
    },
    pages: {
        signIn: '/invest/login',
        newUser: '/invest/signup'
    },
    secret: process.env.NEXTAUTH_SECRET || "default_development_secret_do_not_use_in_production",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
