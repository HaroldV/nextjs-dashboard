import { ArrowPathIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Image from 'next/image';
import { fetchLatestInvoices } from '@/app/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';

export default async function LatestInvoices() {
  const latestInvoices = await fetchLatestInvoices();
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Ultimas Facturas Descargadas</CardTitle>
        <CardDescription>Recent transaction details</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-white">
          {latestInvoices.map((invoice, i) => {
            return (
              <div
                key={invoice.id}
                className={clsx(
                  'flex flex-row items-center justify-between py-4',
                  {
                    'border-t': i !== 0,
                  },
                )}
              >
                <div className="flex items-center">
                  <Image
                    src={invoice.image_url}
                    alt={`${invoice.name}'s profile picture`}
                    className="mr-4 rounded-full"
                    width={32}
                    height={32}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold md:text-base">
                      {invoice.name}
                    </p>
                    <p className="hidden text-sm text-gray-500 sm:block">
                      {invoice.email}
                    </p>
                  </div>
                </div>
                <div className="font-medium text-sm md:text-base">
                  {invoice.amount}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
