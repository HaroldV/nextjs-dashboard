import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  InboxIcon,
} from '@heroicons/react/24/outline';
import { fetchCardData } from '@/app/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';

const iconMap = {
  collected: BanknotesIcon,
  customers: UserGroupIcon,
  pending: ClockIcon,
  invoices: InboxIcon,
};

export default async function CardWrapper() {
  const {
    totalPaidInvoices,
    totalPendingInvoices,
    numberOfInvoices,
    numberOfCustomers
  } = await fetchCardData();

  return (
    <>
      <DashboardCard title="Documentos Enviados" value={totalPaidInvoices} type="collected" />
      <DashboardCard title="Documentos Recibidos" value={totalPendingInvoices} type="pending" />
      <DashboardCard title="Total de Facturas" value={numberOfInvoices} type="invoices" />
      <DashboardCard
        title="Total de Clientes"
        value={numberOfCustomers}
        type="customers"
      />
    </>
  );
}

export function DashboardCard({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: 'invoices' | 'customers' | 'pending' | 'collected';
}) {
  const Icon = iconMap[type];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon ? <Icon className="h-4 w-4 text-muted-foreground" /> : null}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">
          {/* Placeholder for "% change" if we had it */}
          +20.1% from last month
        </p>
      </CardContent>
    </Card>
  );
}
