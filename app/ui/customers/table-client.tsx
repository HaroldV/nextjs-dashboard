'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { FormattedCustomersTable } from '@/app/lib/definitions';

export default function CustomersTableClient({
    customers,
}: {
    customers: FormattedCustomersTable[];
}) {
    const [selectedCustomers, setSelectedCustomers] = useState<Set<string>>(new Set());

    const allSelected = useMemo(() => {
        return customers.length > 0 && selectedCustomers.size === customers.length;
    }, [customers.length, selectedCustomers.size]);

    const toggleAll = () => {
        if (allSelected) {
            setSelectedCustomers(new Set());
        } else {
            setSelectedCustomers(new Set(customers.map((customer) => customer.id)));
        }
    };

    const toggleOne = (id: string) => {
        const newSelected = new Set(selectedCustomers);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedCustomers(newSelected);
    };

    return (
        <div className="w-full">
            <div className="mt-6 flow-root">
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
                            <div className="md:hidden">
                                {customers?.map((customer) => (
                                    <div
                                        key={customer.id}
                                        className="mb-2 w-full rounded-md bg-white p-4"
                                    >
                                        <div className="flex items-center justify-between border-b pb-4">
                                            <div>
                                                <div className="mb-2 flex items-center">
                                                    <div className="flex items-center gap-3">
                                                        <Image
                                                            src={customer.image_url}
                                                            className="rounded-full"
                                                            alt={`${customer.name}'s profile picture`}
                                                            width={28}
                                                            height={28}
                                                        />
                                                        <p>{customer.name}</p>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-500">
                                                    {customer.email}
                                                </p>
                                            </div>
                                        </div>
                                        {/* Mobile view details adapted to new columns */}
                                        <div className="border-b py-2 text-sm text-gray-500">
                                            <p>NIT: {customer.id.substring(0, 8)}...</p>
                                        </div>
                                        <div className="flex w-full items-center justify-between border-b py-5">
                                            <div className="flex w-1/3 flex-col">
                                                <p className="text-xs">Pagado</p>
                                                <p className="font-medium">{customer.total_paid}</p>
                                            </div>
                                            <div className="flex w-1/3 flex-col items-center">
                                                <p className="text-xs">Facturas</p>
                                                <p className="font-medium">{customer.total_invoices}</p>
                                            </div>
                                            <div className="flex w-1/3 flex-col items-end">
                                                <p className="text-xs">Pendiente</p>
                                                <p className="font-medium">{customer.total_pending}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <table className="hidden min-w-full rounded-md text-gray-900 md:table">
                                <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                                    <tr>
                                        <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                checked={allSelected}
                                                onChange={toggleAll}
                                            />
                                        </th>
                                        <th scope="col" className="px-4 py-5 font-medium">
                                            Nombre
                                        </th>
                                        <th scope="col" className="px-3 py-5 font-medium">
                                            Email
                                        </th>
                                        <th scope="col" className="px-3 py-5 font-medium">
                                            NIT
                                        </th>
                                        <th scope="col" className="px-3 py-5 font-medium">
                                            Total Pagado
                                        </th>
                                        <th scope="col" className="px-3 py-5 font-medium">
                                            Total de Facturas
                                        </th>
                                        <th scope="col" className="px-4 py-5 font-medium">
                                            Total Pendiente
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-200 text-gray-900">
                                    {customers.map((customer) => (
                                        <tr key={customer.id} className="group">
                                            <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    checked={selectedCustomers.has(customer.id)}
                                                    onChange={() => toggleOne(customer.id)}
                                                />
                                            </td>
                                            <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black">
                                                <div className="flex items-center gap-3">
                                                    <Image
                                                        src={customer.image_url}
                                                        className="rounded-full"
                                                        alt={`${customer.name}'s profile picture`}
                                                        width={28}
                                                        height={28}
                                                    />
                                                    <p>{customer.name}</p>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                                                {customer.email}
                                            </td>
                                            <td className="whitespace-nowrap bg-white px-4 py-5 text-sm text-gray-500">
                                                {customer.id}
                                            </td>
                                            <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                                                {customer.total_paid}
                                            </td>
                                            <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                                                {customer.total_invoices}
                                            </td>
                                            <td className="whitespace-nowrap bg-white px-4 py-5 text-sm group-first-of-type:rounded-md group-last-of-type:rounded-md">
                                                {customer.total_pending}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
