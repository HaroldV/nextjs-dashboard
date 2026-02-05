'use client';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DocumentQueryForm({ type = 'received' }: { type?: 'received' | 'sent' }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const [startDate, setStartDate] = useState(searchParams.get('startDate') || '');
    const [endDate, setEndDate] = useState(searchParams.get('endDate') || '');
    const [codigoUnico, setCodigoUnico] = useState(searchParams.get('codigoUnico') || '');
    const [prefijoFolio, setPrefijoFolio] = useState(searchParams.get('prefijoFolio') || '');
    const [nitEmisor, setNitEmisor] = useState(searchParams.get('nitEmisor') || '');
    const [nitReceptor, setNitReceptor] = useState(searchParams.get('nitReceptor') || '');

    const handleSearch = () => {
        const params = new URLSearchParams(searchParams);

        if (startDate) params.set('startDate', startDate);
        else params.delete('startDate');

        if (endDate) params.set('endDate', endDate);
        else params.delete('endDate');

        // Add other fields if needed for API (currently API only takes dates, but good to keep in URL)
        if (codigoUnico) params.set('codigoUnico', codigoUnico);
        else params.delete('codigoUnico');

        if (prefijoFolio) params.set('prefijoFolio', prefijoFolio);
        else params.delete('prefijoFolio');

        if (type === 'received') {
            if (nitEmisor) params.set('nitEmisor', nitEmisor);
            else params.delete('nitEmisor');
            params.delete('nitReceptor');
        } else {
            if (nitReceptor) params.set('nitReceptor', nitReceptor);
            else params.delete('nitReceptor');
            params.delete('nitEmisor');
        }

        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* Código único */}
                <div>
                    <label htmlFor="codigoUnico" className="mb-2 block text-sm font-medium text-gray-700">
                        Código único
                    </label>
                    <input
                        id="codigoUnico"
                        type="text"
                        value={codigoUnico}
                        onChange={(e) => setCodigoUnico(e.target.value)}
                        placeholder="Código único"
                        className="block w-full rounded-lg border border-gray-200 py-2.5 px-4 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                </div>

                {/* Prefijo y folio */}
                <div>
                    <label htmlFor="prefijoFolio" className="mb-2 block text-sm font-medium text-gray-700">
                        Prefijo y folio
                    </label>
                    <input
                        id="prefijoFolio"
                        type="text"
                        value={prefijoFolio}
                        onChange={(e) => setPrefijoFolio(e.target.value)}
                        placeholder="Prefijo y folio"
                        className="block w-full rounded-lg border border-gray-200 py-2.5 px-4 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                </div>

                {/* NIT Dynamic Field */}
                <div>
                    <label htmlFor="nitField" className="mb-2 block text-sm font-medium text-gray-700">
                        {type === 'received' ? 'NIT emisor' : 'NIT Receptor'}
                    </label>
                    <input
                        id="nitField"
                        type="text"
                        value={type === 'received' ? nitEmisor : nitReceptor}
                        onChange={(e) => type === 'received' ? setNitEmisor(e.target.value) : setNitReceptor(e.target.value)}
                        placeholder={type === 'received' ? 'NIT emisor' : 'NIT Receptor'}
                        className="block w-full rounded-lg border border-gray-200 py-2.5 px-4 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                </div>

                {/* Rango de fechas (Dos Inputs) */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Rango de fechas
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="block w-full rounded-lg border border-gray-200 py-2.5 px-3 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        />
                        <span className="self-center text-gray-400">-</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="block w-full rounded-lg border border-gray-200 py-2.5 px-3 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>
                </div>
            </div>

            <div className="mt-8 flex justify-center">
                <Button
                    onClick={handleSearch}
                    className="px-8 h-10 bg-[#34d399] hover:bg-[#10b981] text-white font-semibold rounded-lg shadow-sm transition-colors"
                >
                    <MagnifyingGlassIcon className="mr-2 h-5 w-5" />
                    Buscar
                </Button>
            </div>
        </div>
    );
}
