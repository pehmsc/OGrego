import Link from "next/link";
import Image from "next/image";
import FeedbackForm from "@/app/ui/components/FeedbackForm";

export default function FeedbackPage() {
    return (
        <section className="grid gap-12">
            <header className="grid gap-4">
                <h1 className="text-4xl font-semibold tracking-tight text-[#1E3A8A] sm:text-5xl">
                    Feedback
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-zinc-600/90 dark:text-zinc-400/90">
                    Tem elogios, reclamações ou sugestões a fazer?
                </p>
            </header>

            <div className="rounded-3xl border border-[#1E3A8A]/10 bg-white/60 p-8 shadow-sm">
                <h2 className="text-2xl font-bold tracking-tight text-[#1E3A8A]">
                    Formulário de Feedback
                </h2>

                <p className="mt-3 leading-7 text-zinc-600/90 dark:text-zinc-400/90">
                    Diga-nos o que se passou de melhor ou pior. Agradecemos que
                    seja o mais específico possível.
                </p>

                <div className="mt-6">
                    <FeedbackForm />
                </div>
            </div>
        </section>
    );
}
