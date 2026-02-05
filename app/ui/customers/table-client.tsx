'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { FormattedCustomersTable } from '@/app/lib/definitions';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/app/components/ui/table';
import { Card, CardContent } from '@/app/components/ui/card';

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
                        <div className="overflow-hidden rounded-md md:pt-0">
                            <div className="md:hidden space-y-4">
                                {customers?.map((customer) => (
                                    <Card key={customer.id}>
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between border-b pb-4">
                                                <div>
                                                    <div className="mb-2 flex items-center gap-3">
                                                        <Image
                                                            src={customer.image_url}
                                                            className="rounded-full"
                                                            alt={`${customer.name}'s profile picture`}
                                                            width={28}
                                                            height={28}
                                                        />
                                                        <p className="font-medium">{customer.name}</p>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">
                                                        {customer.email}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex w-full items-center justify-between border-b py-5">
                                                <div className="flex w-1/3 flex-col">
                                                    <p className="text-xs text-muted-foreground">Pagado</p>
                                                    <p className="font-medium">{customer.total_paid}</p>
                                                </div>
                                                <div className="flex w-1/3 flex-col items-center">
                                                    <p className="text-xs text-muted-foreground">Facturas</p>
                                                    <p className="font-medium">{customer.total_invoices}</p>
                                                </div>
                                                <div className="flex w-1/3 flex-col items-end">
                                                    <p className="text-xs text-muted-foreground">Pendiente</p>
                                                    <p className="font-medium">{customer.total_pending}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                            <div className="hidden md:block rounded-lg border bg-card">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[50px]">
                                                <input
                                                    type="checkbox"
                                                    className="translate-y-0.5 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                    checked={allSelected}
                                                    onChange={toggleAll}
                                                />
                                            </TableHead>
                                            <TableHead>Nombre</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>NIT</TableHead>
                                            <TableHead>Total Pagado</TableHead>
                                            <TableHead>Total de Facturas</TableHead>
                                            <TableHead>Total Pendiente</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {customers.map((customer) => (
                                            <TableRow key={customer.id}>
                                                <TableCell>
                                                    <input
                                                        type="checkbox"
                                                        className="translate-y-0.5 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                        checked={selectedCustomers.has(customer.id)}
                                                        onChange={() => toggleOne(customer.id)}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Image
                                                            src={customer.image_url}
                                                            className="rounded-full"
                                                            alt={`${customer.name}'s profile picture`}
                                                            width={28}
                                                            height={28}
                                                        />
                                                        <p className="font-medium">{customer.name}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">{customer.email}</TableCell>
                                                <TableCell className="text-muted-foreground">{customer.id.substring(0, 8)}...</TableCell>
                                                <TableCell>{customer.total_paid}</TableCell>
                                                <TableCell>{customer.total_invoices}</TableCell>
                                                <TableCell>{customer.total_pending}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
