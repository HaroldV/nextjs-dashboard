import { AppSidebar } from '@/app/components/app-sidebar';
import { AppHeader } from '@/app/components/app-header';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen overflow-hidden bg-background font-sans antialiased">
            <AppSidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
                <AppHeader />
                <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-muted/40">
                    {children}
                </main>
            </div>
        </div>
    );
}