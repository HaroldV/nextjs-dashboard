import DianForm from '@/app/ui/invoices/dian-form';
import { lusitana } from '@/app/ui/fonts';

export default async function Page() {
    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className={`${lusitana.className} text-3xl font-bold text-gray-900`}>RPA Facturas Dian</h1>
            </div>
            <div className="mt-8">
                <DianForm />
            </div>
        </div>
    );
}
