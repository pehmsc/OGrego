import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function EntrarPage() {
  return (
    <div className="mx-auto w-full max-w-md">
      <Card className="rounded-3xl border-[#1E3A8A]/10 bg-white/70 shadow-sm">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-bold tracking-tight text-[#1E3A8A]">
            Entrar
          </CardTitle>
          <CardDescription className="text-zinc-600/90">
            Aceda à sua área para ver pedidos, deixar feedback e atualizar o
            perfil.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-6">
          <form className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="nome@exemplo.com" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Palavra-passe</Label>
              <Input id="password" type="password" placeholder="••••••••" />
            </div>

            <Button
              type="submit"
              className="h-11 rounded-full bg-[#1E3A8A] text-white hover:bg-[#162F73]"
            >
              Entrar
            </Button>
          </form>

          <Separator />

          <div className="grid gap-2 text-sm text-zinc-600/90">
            <p>
              Ainda não tem conta?{" "}
              <Link
                href="/auth/criar-conta"
                className="font-semibold text-[#1E3A8A] underline-offset-4 hover:underline"
              >
                Criar conta
              </Link>
            </p>
            <p>
              Esqueceu-se da palavra-passe?{" "}
              <a
                className="font-semibold text-[#1E3A8A] underline-offset-4 hover:underline"
                href="#"
              >
                Recuperar
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
