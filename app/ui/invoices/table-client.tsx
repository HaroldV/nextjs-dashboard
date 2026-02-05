'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { UpdateInvoice, DeleteInvoice } from '@/app/ui/invoices/buttons';
import InvoiceStatus from '@/app/ui/invoices/status';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { InvoicesTable as InvoicesTableType } from '@/app/lib/definitions';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/app/components/ui/table';
import { Card, CardContent } from '@/app/components/ui/card';
// I probably need a checkbox component too, but for now standard input is fine or I create one.
// Actually standard input is fine for now to save time, or I can quickly create a checkbox. 
// I'll stick to native checkbox for speed unless requested, but styled with tailwind forms plugin it should look ok.

export default function InvoicesTableClient({
    invoices,
}: {
    invoices: InvoicesTableType[];
}) {
    const [selectedInvoices, setSelectedInvoices] = useState<Set<string>>(new Set());

    const allSelected = useMemo(() => {
        return invoices.length > 0 && selectedInvoices.size === invoices.length;
    }, [invoices.length, selectedInvoices.size]);

    const toggleAll = () => {
        if (allSelected) {
            setSelectedInvoices(new Set());
        } else {
            setSelectedInvoices(new Set(invoices.map((invoice) => invoice.id)));
        }
    };

    const toggleOne = (id: string) => {
        const newSelected = new Set(selectedInvoices);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedInvoices(newSelected);
    };

    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg md:pt-0">
                    <div className="md:hidden space-y-4">
                        {invoices?.map((invoice) => (
                            <Card key={invoice.id}>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between border-b pb-4">
                                        <div>
                                            <div className="mb-2 flex items-center">
                                                <Image
                                                    src={invoice.image_url}
                                                    className="mr-2 rounded-full"
                                                    width={28}
                                                    height={28}
                                                    alt={`${invoice.name}'s profile picture`}
                                                />
                                                <p className="font-medium text-sm">{invoice.name}</p>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{invoice.email}</p>
                                        </div>
                                        <InvoiceStatus status={invoice.status} />
                                    </div>
                                    <div className="flex w-full items-center justify-between pt-4">
                                        <div>
                                            <p className="text-xl font-medium">
                                                {formatCurrency(invoice.amount)}
                                            </p>
                                            <p className="text-sm text-muted-foreground">{formatDateToLocal(invoice.date)}</p>
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            <UpdateInvoice id={invoice.id} />
                                            <DeleteInvoice id={invoice.id} />
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
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invoices?.map((invoice) => (
                                    <TableRow key={invoice.id}>
                                        <TableCell>
                                            <input
                                                type="checkbox"
                                                className="translate-y-0.5 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                checked={selectedInvoices.has(invoice.id)}
                                                onChange={() => toggleOne(invoice.id)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Image
                                                    src={invoice.image_url}
                                                    className="rounded-full"
                                                    width={28}
                                                    height={28}
                                                    alt={`${invoice.name}'s profile picture`}
                                                />
                                                <p className="font-medium">{invoice.name}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">{invoice.email}</TableCell>
                                        <TableCell className="font-medium">{formatCurrency(invoice.amount)}</TableCell>
                                        <TableCell className="text-muted-foreground">{formatDateToLocal(invoice.date)}</TableCell>
                                        <TableCell>
                                            <InvoiceStatus status={invoice.status} />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-3">
                                                <UpdateInvoice id={invoice.id} />
                                                <DeleteInvoice id={invoice.id} />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    );
}
