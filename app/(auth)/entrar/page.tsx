// app/(auth)/entrar/page.tsx
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { currentUserApp } from "@/app/lib/current-user";
import { LoginForm } from "@/app/components/login-form";

export default async function LoginPage() {
    const { userId } = await auth();

    if (userId) {
        const user = await currentUserApp();

        // Admin → /admin | User normal → /welcome
        if (user?.role === "admin") {
            redirect("/admin");
        } else {
            redirect("/welcome");
        }
    }

    return (
        <div className="bg-[var(--background)] flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <Link href="/" className="self-center">
                    <div className="relative h-12 w-40">
                        <Image
                            src="/logodark.svg"
                            alt="O Grego"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </Link>

                <LoginForm />
            </div>
        </div>
    );
}
