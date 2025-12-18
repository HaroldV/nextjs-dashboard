import { lusitana } from '@/app/ui/fonts';

// Mock data type for PUC
type PucItem = {
    id: string;
    code: string;
    description: string;
    date: string;
    status: 'active' | 'inactive';
};

// Mock data
const mockPucs: PucItem[] = [
    { id: '1', code: '1105', description: 'Caja', date: '2023-10-01', status: 'active' },
    { id: '2', code: '1110', description: 'Bancos', date: '2023-10-02', status: 'active' },
    { id: '3', code: '1305', description: 'Clientes', date: '2023-10-05', status: 'active' },
    { id: '4', code: '2205', description: 'Proveedores Nacionales', date: '2023-10-10', status: 'inactive' },
    { id: '5', code: '4135', description: 'Comercio al por mayor y al por menor', date: '2023-10-15', status: 'active' },
];

export default function PucTable() {
    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                    <div className="md:hidden">
                        {mockPucs.map((puc) => (
                            <div key={puc.id} className="mb-2 w-full rounded-md bg-white p-4">
                                <div className="flex items-center justify-between border-b pb-4">
                                    <div>
                                        <div className="mb-2 flex items-center">
                                            <p className="font-medium">{puc.code}</p>
                                        </div>
                                        <p className="text-sm text-gray-500">{puc.description}</p>
                                    </div>
                                    <div className={`px-2 py-1 rounded text-xs ${puc.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                        {puc.status === 'active' ? 'Activo' : 'Inactivo'}
                                    </div>
                                </div>
                                <div className="flex w-full items-center justify-between pt-4">
                                    <div>
                                        <p>{puc.date}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <table className="hidden min-w-full text-gray-900 md:table">
                        <thead className="rounded-lg text-left text-sm font-normal">
                            <tr>
                                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                                    Código
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Descripción
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Fecha de Carga
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Estado
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {mockPucs.map((puc) => (
                                <tr
                                    key={puc.id}
                                    className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                                >
                                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                        <p className="font-medium">{puc.code}</p>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {puc.description}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {puc.date}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${puc.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                                            }`}>
                                            {puc.status === 'active' ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
