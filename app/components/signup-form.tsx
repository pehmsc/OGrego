// app/components/signup-form.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignUp } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { Button } from "@/app/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/app/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "@/app/components/ui/field";
import { Input } from "@/app/components/ui/input";
import { AFTER_AUTH_REDIRECT } from "@/lib/route";

type ClerkError = {
    errors?: Array<{
        longMessage?: string;
        message?: string;
    }>;
};

function getClerkError(err: unknown): string {
    const e = err as ClerkError;
    return (
        e?.errors?.[0]?.longMessage ||
        e?.errors?.[0]?.message ||
        "Não foi possível criar conta. Tenta novamente."
    );
}

export function SignupForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const router = useRouter();
    const { isLoaded, signUp, setActive } = useSignUp();

    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");

    const [code, setCode] = React.useState("");
    const [needsVerification, setNeedsVerification] = React.useState(false);

    const [error, setError] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(false);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!isLoaded) return;

        setError(null);

        if (password !== confirmPassword) {
            setError(
                "As passwords não coincidem. Dá ali um check antes de continuar.",
            );
            return;
        }

        setLoading(true);

        try {
            await signUp.create({
                emailAddress: email,
                password,
            });

            const parts = name.trim().split(/\s+/).filter(Boolean);
            const firstName = parts[0] || "";
            const lastName = parts.slice(1).join(" ");

            if (firstName) {
                await signUp.update({ firstName, lastName });
            }

            await signUp.prepareEmailAddressVerification({
                strategy: "email_code",
            });

            setNeedsVerification(true);
        } catch (err) {
            setError(getClerkError(err));
        } finally {
            setLoading(false);
        }
    }

    async function onVerify(e: React.FormEvent) {
        e.preventDefault();
        if (!isLoaded) return;

        setLoading(true);
        setError(null);

        try {
            const res = await signUp.attemptEmailAddressVerification({ code });

            if (res.status === "complete") {
                await setActive({ session: res.createdSessionId });
                router.push(AFTER_AUTH_REDIRECT);
                router.refresh();
                return;
            }

            setError(
                "Não deu para concluir a verificação. Confirme o código e tente outra vez.",
            );
        } catch (err) {
            setError(getClerkError(err));
        } finally {
            setLoading(false);
        }
    }

    async function signUpWithProvider(
        provider: "oauth_google" | "oauth_apple",
    ) {
        if (!isLoaded) return;

        setLoading(true);
        setError(null);

        try {
            await signUp.authenticateWithRedirect({
                strategy: provider,
                redirectUrl: "/sso-callback",
                redirectUrlComplete: "/user/profile",
            });
        } catch (err) {
            setError(getClerkError(err));
            setLoading(false);
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Criar conta</CardTitle>
                    <CardDescription>
                        Introduz o teu email para criares a tua conta
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {!needsVerification ? (
                        <form onSubmit={onSubmit}>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="name">
                                        Nome completo
                                    </FieldLabel>
                                    <Input
                                        className="rounded-full"
                                        id="name"
                                        type="text"
                                        placeholder="João Silva"
                                        required
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        autoComplete="name"
                                    />
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="email">
                                        Email
                                    </FieldLabel>
                                    <Input
                                        className="rounded-full"
                                        id="email"
                                        type="email"
                                        placeholder="exemplo@email.com"
                                        required
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        autoComplete="email"
                                    />
                                </Field>

                                <Field>
                                    <Field className="grid grid-cols-2 gap-4">
                                        <Field>
                                            <FieldLabel htmlFor="password">
                                                Password
                                            </FieldLabel>
                                            <Input
                                                className="rounded-full"
                                                id="password"
                                                type="password"
                                                required
                                                value={password}
                                                onChange={(e) =>
                                                    setPassword(e.target.value)
                                                }
                                                autoComplete="new-password"
                                            />
                                        </Field>

                                        <Field>
                                            <FieldLabel htmlFor="confirm-password">
                                                Confirmar password
                                            </FieldLabel>
                                            <Input
                                                className="rounded-full"
                                                id="confirm-password"
                                                type="password"
                                                required
                                                value={confirmPassword}
                                                onChange={(e) =>
                                                    setConfirmPassword(
                                                        e.target.value,
                                                    )
                                                }
                                                autoComplete="new-password"
                                            />
                                        </Field>
                                    </Field>

                                    <FieldDescription>
                                        Deve ter pelo menos 8 caracteres.
                                    </FieldDescription>
                                </Field>

                                {error ? (
                                    <Field>
                                        <FieldDescription className="text-center text-red-500">
                                            {error}
                                        </FieldDescription>
                                    </Field>
                                ) : null}

                                <Field>
                                    <div
                                        id="clerk-captcha"
                                        className="mt-2 min-h-[44px] w-full"
                                    />

                                    <Button
                                        className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#1E3A8A] px-5 text-white shadow-sm transition-all duration-200 ease-out hover:bg-[#162F73] hover:shadow-md hover:-translate-y-[1px] active:translate-y-0 active:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A8A]/30 focus-visible:ring-offset-2 sm:w-[158px] dark:bg-white dark:text-[#1E3A8A] dark:hover:bg-[#F4F7FB] dark:focus-visible:ring-[#F4F7FB]/30"
                                        type="submit"
                                        disabled={loading}
                                    >
                                        {loading ? "A criar..." : "Criar conta"}
                                    </Button>

                                    <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                                        Ou continua com
                                    </FieldSeparator>

                                    <Field className="grid grid-cols-2 gap-4">
                                        <Button
                                            className="rounded-full"
                                            variant="outline"
                                            type="button"
                                            disabled={loading}
                                            onClick={() =>
                                                signUpWithProvider(
                                                    "oauth_apple",
                                                )
                                            }
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                                                    fill="currentColor"
                                                />
                                            </svg>
                                            <span className="sr-only">
                                                Registar com Apple
                                            </span>
                                        </Button>

                                        <Button
                                            className="rounded-full"
                                            variant="outline"
                                            type="button"
                                            disabled={loading}
                                            onClick={() =>
                                                signUpWithProvider(
                                                    "oauth_google",
                                                )
                                            }
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                                    fill="currentColor"
                                                />
                                            </svg>
                                            <span className="sr-only">
                                                Registar com Google
                                            </span>
                                        </Button>
                                    </Field>

                                    <FieldDescription className="text-center">
                                        Já tens conta?{" "}
                                        <Link
                                            href="/entrar"
                                            className="underline"
                                        >
                                            Entrar
                                        </Link>
                                    </FieldDescription>
                                </Field>
                            </FieldGroup>
                        </form>
                    ) : (
                        <form onSubmit={onVerify}>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="code">
                                        Código de verificação
                                    </FieldLabel>
                                    <Input
                                        className="rounded-full"
                                        id="code"
                                        type="text"
                                        placeholder="123456"
                                        required
                                        value={code}
                                        onChange={(e) =>
                                            setCode(e.target.value)
                                        }
                                        inputMode="numeric"
                                    />
                                    <FieldDescription>
                                        Enviámos um código para o teu email.
                                        Mete-o aqui e acabou-se.
                                    </FieldDescription>
                                </Field>

                                {error ? (
                                    <Field>
                                        <FieldDescription className="text-center text-red-500">
                                            {error}
                                        </FieldDescription>
                                    </Field>
                                ) : null}

                                <Field>
                                    <div
                                        id="clerk-captcha"
                                        className="mt-2 min-h-[44px] w-full"
                                    />

                                    <Button
                                        className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#1E3A8A] px-5 text-white shadow-sm transition-all duration-200 ease-out hover:bg-[#162F73] hover:shadow-md hover:-translate-y-[1px] active:translate-y-0 active:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A8A]/30 focus-visible:ring-offset-2 sm:w-[158px] dark:bg-white dark:text-[#1E3A8A] dark:hover:bg-[#F4F7FB] dark:focus-visible:ring-[#F4F7FB]/30"
                                        type="submit"
                                        disabled={loading}
                                    >
                                        {loading
                                            ? "A confirmar..."
                                            : "Confirmar"}
                                    </Button>

                                    <FieldDescription className="text-center">
                                        Voltar atrás?{" "}
                                        <button
                                            type="button"
                                            className="underline"
                                            onClick={() => {
                                                setNeedsVerification(false);
                                                setCode("");
                                                setError(null);
                                            }}
                                        >
                                            Editar dados
                                        </button>
                                    </FieldDescription>
                                </Field>
                            </FieldGroup>
                        </form>
                    )}
                </CardContent>
            </Card>

            <FieldDescription className="px-6 text-center">
                Ao continuar, concordas com os{" "}
                <Link href="/terms" className="underline">
                    Termos de Serviço
                </Link>{" "}
                e a{" "}
                <Link href="/privacy" className="underline">
                    Política de Privacidade
                </Link>
                .
            </FieldDescription>
        </div>
    );
}
