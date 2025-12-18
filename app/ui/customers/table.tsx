import { fetchFilteredCustomers } from '@/app/lib/data';
import CustomersTableClient from '@/app/ui/customers/table-client';

export default async function CustomersTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const customers = await fetchFilteredCustomers(query, currentPage);

  return <CustomersTableClient customers={customers} />;
}
