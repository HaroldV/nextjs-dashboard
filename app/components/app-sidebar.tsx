'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Receipt,
    Users,
    Settings,
    LogOut,
    Package2,
    Inbox,
    Send,
    UploadCloud,
    Download,
    Sparkles,
} from 'lucide-react';
import { cn } from '@/app/lib/utils';
import { Button } from '@/app/components/ui/button';
import { logout } from '@/app/lib/actions';

const sidebarLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Facturas DIAN', href: '/dashboard/invoicesDian', icon: Download },
    { name: 'Documentos Recibidos', href: '/dashboard/documentos-recibidos', icon: Inbox },
    { name: 'Documentos Enviados', href: '/dashboard/documentos-enviados', icon: Send },
    { name: 'Reportes AI', href: '/dashboard/reportes-ia', icon: Sparkles },
    { name: 'Clientes', href: '/dashboard/customers', icon: Users },
    { name: 'Carga de listado PUC', href: '/dashboard/carga-listado-puc', icon: UploadCloud },
];

export function AppSidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-full w-64 flex-col border-r bg-card">
            <div className="flex h-14 items-center border-b px-6">
                <Link href="/" className="flex items-center gap-2 font-semibold">
                    <Package2 className="h-6 w-6" />
                    <span>Acme Corp</span>
                </Link>
            </div>
            <div className="flex-1 overflow-auto py-4">
                <nav className="grid items-start px-4 text-sm font-medium">
                    {sidebarLinks.map((link) => {
                        const LinkIcon = link.icon;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    'flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary',
                                    pathname === link.href
                                        ? 'bg-muted text-primary'
                                        : 'text-muted-foreground'
                                )}
                            >
                                <LinkIcon className="h-4 w-4" />
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>
            <div className="mt-auto p-4 border-t">
                <Button variant="ghost" className="w-full justify-start gap-3 px-3">
                    <Settings className="h-4 w-4" />
                    Settings
                </Button>
                <form
                    action={async () => {
                        await logout();
                    }}
                >
                    <Button variant="ghost" className="w-full justify-start gap-3 px-3 text-muted-foreground hover:text-destructive">
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </Button>
                </form>
            </div>
        </div>
    );
}
