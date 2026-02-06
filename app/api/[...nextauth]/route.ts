import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { JWT } from "next-auth/jwt";
import type { Session, User } from "next-auth";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials) return null;

                if (
                    credentials.email === "admin@ogrego.pt" &&
                    credentials.password === "admin123"
                ) {
                    const user: User = {
                        id: "1",
                        name: "Admin",
                        email: "admin@ogrego.pt",
                        role: "admin",
                    };

                    return user;
                }

                return null;
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({
            token,
            user,
        }: {
            token: JWT;
            user?: User | null;
        }): Promise<JWT> {
            if (user && user.role) {
                token.role = user.role;
            }
            return token;
        },
        async session({
            session,
            token,
        }: {
            session: Session;
            token: JWT;
        }): Promise<Session> {
            if (session.user) {
                session.user.role = token.role;
            }
            return session;
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
