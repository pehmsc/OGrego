import { ReactNode } from "react";

interface UserPageLayoutProps {
    children: ReactNode;
    sidebar?: ReactNode;
}

export default function UserPageLayout({
    children,
    sidebar,
}: UserPageLayoutProps) {
    return (
        <div className="grid gap-8 lg:grid-cols-3">
            {/* Conteúdo principal */}
            <div className={sidebar ? "lg:col-span-2" : "lg:col-span-3"}>
                {children}
            </div>

            {/* Sidebar (opcional) */}
            {sidebar && <div className="lg:col-span-1">{sidebar}</div>}
        </div>
    );
}
