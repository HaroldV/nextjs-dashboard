import { fetchPucAccounts } from '@/app/lib/data';

export default async function PucTable() {
    const pucAccounts = await fetchPucAccounts();

    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                    <div className="md:hidden">
                        {pucAccounts.map((puc) => (
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
                                        {/* <p>{puc.date}</p> */}
                                        {/* Date field logic if needed, backend has created_at */}
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
                                    Nivel
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Tipo
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Estado
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {pucAccounts.map((puc) => (
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
                                        {puc.level}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {puc.type}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${puc.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                                            }`}>
                                            {puc.status === 'active' ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {pucAccounts.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-10 text-center text-gray-500">
                                        No hay cuentas PUC cargadas. Importa un archivo para comenzar.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
