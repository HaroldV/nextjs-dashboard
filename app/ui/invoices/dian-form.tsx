'use client';

import { triggerDianRpa } from '@/app/lib/actions';
import { Button } from '@/app/ui/button';
import {
    CalendarDaysIcon,
    KeyIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import Link from 'next/link';

export default function DianForm() {
    const [message, setMessage] = useState<string | null>(null);
    const [isError, setIsError] = useState(false);

    async function handleSubmit(formData: FormData) {
        const result = await triggerDianRpa(formData);
        if (result?.message) {
            setMessage(result.message);
            setIsError(false);
        }
    }

    return (
        <form action={handleSubmit}>
            <div className="rounded-md bg-gray-50 p-4 md:p-6 center">
                {/* Date Range Group */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mb-4">
                    <div>
                        <label htmlFor="startDate" className="mb-2 block text-sm font-medium">
                            Desde:
                        </label>
                        <div className="relative">
                            <input
                                id="startDate"
                                name="startDate"
                                type="date"
                                required
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            />
                            <CalendarDaysIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="endDate" className="mb-2 block text-sm font-medium">
                            Hasta:
                        </label>
                        <div className="relative">
                            <input
                                id="endDate"
                                name="endDate"
                                type="date"
                                required
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            />
                            <CalendarDaysIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                        </div>
                    </div>
                </div>

                {/* Token Input */}
                <div className="mb-4">
                    <label htmlFor="token" className="mb-2 block text-sm font-medium">
                        Token Dian
                    </label>
                    <div className="relative">
                        <input
                            id="token"
                            name="token"
                            type="text"
                            placeholder="Enter your actuator token"
                            required
                            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                        />
                        <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                    </div>
                </div>

                {/* Feedback Message */}
                {message && (
                    <div className={`mb-4 p-4 rounded-md text-sm font-medium ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {message}
                    </div>
                )}
            </div>

            <div className="center mt-6 flex justify-center gap-4">
                <Button type="submit">
                    Descargar Facturas
                </Button>
            </div>
        </form>
    );
}
