import DianForm from '@/app/ui/invoices/dian-form';
import DianDocumentsTable from '@/app/ui/invoices/dian-documents-table';
import { lusitana } from '@/app/ui/fonts';
import { fetchDianDocuments } from '@/app/lib/data';

export default async function Page() {
    const documents = await fetchDianDocuments();

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className={`${lusitana.className} text-3xl font-bold text-gray-900`}>Descarga de Documentos DIAN</h1>
            </div>
            <div className="mt-8">
                <DianForm />
            </div>
            <div className="mt-8">
                <DianDocumentsTable documents={documents} type="received" />
            </div>
        </div>
    );
}

