import { lusitana } from '@/app/ui/fonts';
import DocumentQueryForm from '@/app/ui/documents/query-form';
import DocumentTable from '@/app/ui/documents/table';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { fetchSentDocuments } from '@/app/lib/data';

export default async function Page(props: {
    searchParams?: Promise<{
        startDate?: string;
        endDate?: string;
        prefijoFolio?: string;
        nitEmisor?: string;
        nitReceptor?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const documents = await fetchSentDocuments(searchParams);

    return (
        <div className="w-full">
            <div className="mb-8 flex items-center gap-4">
                <Link
                    href="/dashboard"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                >
                    <ArrowLeftIcon className="h-5 w-5" />
                </Link>
                <h1 className={`${lusitana.className} text-3xl font-bold text-gray-900`}>
                    Consultar documentos enviados
                </h1>
            </div>

            <div className="space-y-8">
                <DocumentQueryForm type="sent" />
                <DocumentTable documents={documents} type="sent" />
            </div>
        </div>
    );
}
