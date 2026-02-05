import AcmeLogo from '@/app/ui/acme-logo';
import ResetPasswordForm from '@/app/ui/reset-password-form';
import { Suspense } from 'react';
import Link from 'next/link';

export default function ResetPasswordPage({
    searchParams,
}: {
    searchParams?: {
        token?: string;
    };
}) {
    const token = searchParams?.token;

    if (!token) {
        return (
            <main className="flex items-center justify-center md:h-screen">
                <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32 text-center">
                    <p className="text-red-500">Invalid or missing reset token.</p>
                    <Link href="/login" className="text-blue-500 hover:underline">
                        Return to Login
                    </Link>
                </div>
            </main>
        )
    }

    return (
        <main className="flex items-center justify-center md:h-screen">
            <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
                <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
                    <div className="text-white">
                        <AcmeLogo />
                    </div>
                </div>
                <Suspense>
                    <ResetPasswordForm token={token} />
                </Suspense>
            </div>
        </main>
    );
}
