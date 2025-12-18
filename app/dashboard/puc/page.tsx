import { lusitana } from '@/app/ui/fonts';
import { ImportPuc } from '@/app/ui/puc/buttons';
import PucTable from '@/app/ui/puc/table';
import Search from '@/app/ui/search';

export default function Page() {
    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className={`${lusitana.className} text-3xl font-bold text-gray-900`}>Carga de PUC</h1>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <Search placeholder="Buscar PUC..." />
                <ImportPuc />
            </div>
            <PucTable />
        </div>
    );
}
