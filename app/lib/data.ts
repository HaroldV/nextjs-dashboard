import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
} from './definitions';
import { formatCurrency } from './utils';
import { customers, invoices, revenue, users } from './placeholder-data';

// const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
const API_BASE_URL = process.env.API_BASE_URL;

import { auth } from '@/app/auth';

export async function fetchData<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  if (!API_BASE_URL) {
    console.warn('API_BASE_URL not set in environment variables.');
    return null;
  }

  const session = await auth();
  const token = (session?.user as any)?.accessToken;

  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: headers,
      cache: 'no-store',
      ...options
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      console.error(`API call failed for ${endpoint}: ${response.status} ${response.statusText}`);
      // throw new Error(`API call failed: ${response.statusText}`); 
      // Return null instead of throwing to avoid crashing the page if just one component fails
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('Fetch Error:', error);
    // In a real scenario, we might throw here or return null depending on resilience needs
    return null;
  }
}


export async function fetchRevenue() {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    console.log('Fetching revenue data...');
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Backend Integration Placeholder:
    // const data = await fetchData<Revenue[]>('/revenue');
    // if (data) return data;

    // const data = await sql<Revenue[]>`SELECT * FROM revenue`;
    const data = revenue;

    console.log('Data fetch completed after 3 seconds.');

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  try {
    // Backend Integration Placeholder:
    // const data = await fetchData<LatestInvoiceRaw[]>('/invoices/latest');
    // if (data) {
    //   return data.map((invoice) => ({
    //     ...invoice,
    //     amount: formatCurrency(invoice.amount),
    //   }));
    // }

    // const data = await sql<LatestInvoiceRaw[]>`
    //   SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
    //   FROM invoices
    //   JOIN customers ON invoices.customer_id = customers.id
    //   ORDER BY invoices.date DESC
    //   LIMIT 5`;

    const latestInvoices = invoices
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
      .map((invoice, i) => {
        const customer = customers.find((c) => c.id === invoice.customer_id);
        return {
          id: `invoice-${i}`,
          amount: formatCurrency(invoice.amount),
          name: customer?.name || '',
          image_url: customer?.image_url || '',
          email: customer?.email || '',
        };
      });

    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  try {
    const data = await fetchData<{
      sent_count: number;
      received_count: number;
      total_documents: number;
      customers_count: number;
    }>('/api/v1/dashboard/stats');

    if (!data) {
      return {
        numberOfCustomers: 0,
        numberOfInvoices: 0,
        totalPaidInvoices: 0,
        totalPendingInvoices: 0,
      };
    }

    return {
      numberOfCustomers: data.customers_count,
      numberOfInvoices: data.total_documents,
      totalPaidInvoices: data.sent_count, // Documentos Enviados (Mapping concept)
      totalPendingInvoices: data.received_count, // Documentos Recibidos (Mapping concept)
    };
  } catch (error) {
    console.error('Database Error:', error);
    return {
      numberOfCustomers: 0,
      numberOfInvoices: 0,
      totalPaidInvoices: 0,
      totalPendingInvoices: 0,
    };
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    // Backend Integration Placeholder:
    // const data = await fetchData<InvoicesTable[]>(`/invoices?query=${query}&page=${currentPage}&limit=${ITEMS_PER_PAGE}`);
    // if (data) return data;

    // const invoices = await sql<InvoicesTable[]>`
    //   SELECT
    //     invoices.id,
    //     invoices.amount,
    //     invoices.date,
    //     invoices.status,
    //     customers.name,
    //     customers.email,
    //     customers.image_url
    //   FROM invoices
    //   JOIN customers ON invoices.customer_id = customers.id
    //   WHERE
    //     customers.name ILIKE ${`%${query}%`} OR
    //     customers.email ILIKE ${`%${query}%`} OR
    //     invoices.amount::text ILIKE ${`%${query}%`} OR
    //     invoices.date::text ILIKE ${`%${query}%`} OR
    //     invoices.status ILIKE ${`%${query}%`}
    //   ORDER BY invoices.date DESC
    //   LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    // `;

    const lowerQuery = query.toLowerCase();

    // We need to construct the full invoice object first to filter it
    const allInvoices = invoices.map((invoice, index) => {
      const customer = customers.find(c => c.id === invoice.customer_id);
      return {
        id: `invoice-${index}`, // generating ID as placeholder lacks it
        amount: invoice.amount,
        date: invoice.date,
        status: invoice.status,
        name: customer?.name || '',
        email: customer?.email || '',
        image_url: customer?.image_url || '',
        customer_id: invoice.customer_id
      };
    });

    const filteredInvoices = allInvoices.filter((invoice) => {
      return (
        invoice.name.toLowerCase().includes(lowerQuery) ||
        invoice.email.toLowerCase().includes(lowerQuery) ||
        invoice.amount.toString().includes(lowerQuery) ||
        invoice.date.includes(lowerQuery) ||
        invoice.status.includes(lowerQuery)
      );
    });

    // Sort by date DESC
    filteredInvoices.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const paginatedInvoices = filteredInvoices.slice(offset, offset + ITEMS_PER_PAGE);

    return paginatedInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    // Backend Integration Placeholder:
    // const data = await fetchData<{ totalPages: number }>(`/invoices/pages?query=${query}&limit=${ITEMS_PER_PAGE}`);
    // if (data) return data.totalPages;

    // const count = await sql`SELECT COUNT(*)
    // FROM invoices
    // JOIN customers ON invoices.customer_id = customers.id
    // WHERE
    //   customers.name ILIKE ${`%${query}%`} OR
    //   customers.email ILIKE ${`%${query}%`} OR
    //   invoices.amount::text ILIKE ${`%${query}%`} OR
    //   invoices.date::text ILIKE ${`%${query}%`} OR
    //   invoices.status ILIKE ${`%${query}%`}
    // `;

    const lowerQuery = query.toLowerCase();
    const allInvoices = invoices.map((invoice) => {
      const customer = customers.find(c => c.id === invoice.customer_id);
      return {
        amount: invoice.amount,
        date: invoice.date,
        status: invoice.status,
        name: customer?.name || '',
        email: customer?.email || '',
      };
    });

    const filteredCount = allInvoices.filter((invoice) => {
      return (
        invoice.name.toLowerCase().includes(lowerQuery) ||
        invoice.email.toLowerCase().includes(lowerQuery) ||
        invoice.amount.toString().includes(lowerQuery) ||
        invoice.date.includes(lowerQuery) ||
        invoice.status.includes(lowerQuery)
      );
    }).length;

    const totalPages = Math.ceil(filteredCount / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchCustomersPages(query: string) {
  try {
    // Backend Integration Placeholder:
    // const data = await fetchData<{ totalPages: number }>(`/customers/pages?query=${query}&limit=${ITEMS_PER_PAGE}`);
    // if (data) return data.totalPages;

    // const count = await sql`SELECT COUNT(*)
    // FROM customers
    // WHERE
    //   customers.name ILIKE ${`%${query}%`} OR
    //   customers.email ILIKE ${`%${query}%`}
    // `;
    const lowerQuery = query.toLowerCase();
    const filteredCount = customers.filter(customer =>
      customer.name.toLowerCase().includes(lowerQuery) ||
      customer.email.toLowerCase().includes(lowerQuery)
    ).length;

    const totalPages = Math.ceil(filteredCount / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of customers.');
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    // Backend Integration Placeholder:
    // const data = await fetchData<InvoiceForm>(`/invoices/${id}`);
    // if (data) {
    //     return {
    //       ...data,
    //       amount: data.amount / 100 // assuming API returns cents
    //     };
    // }

    // const data = await sql<InvoiceForm[]>`
    //   SELECT
    //     invoices.id,
    //     invoices.customer_id,
    //     invoices.amount,
    //     invoices.status
    //   FROM invoices
    //   WHERE invoices.id = ${id};
    // `;

    // Since we generate IDs on the fly in the list view, this might tricky if we don't have consistent IDs.
    // However, for this exercise, we will assume we can find strict matches or we might need to change how we act.
    // Wait, the standard placeholder invoices don't have IDs. 
    // If the app tries to fetch by ID (e.g. edit page url /dashboard/invoices/[id]/edit), it sends an ID.
    // In my `fetchFilteredInvoices`, I generated IDs like `invoice-0`.
    // So here I should probably try to parse the index from the ID or just search blindly if real IDs were used.
    // But since I control the ID generation in `fetchFilteredInvoices`, I should expect `invoice-{index}`.

    // Let's rely on finding by matching properties if possible, OR, if the user clicks "Edit" on the list, the URL will have `invoice-X`.
    // So let's parse that.

    let foundInvoice: any = null;
    if (id.startsWith('invoice-')) {
      const index = parseInt(id.split('-')[1]);
      if (!isNaN(index) && invoices[index]) {
        foundInvoice = invoices[index];
        // We need to attach the ID back to it so the form works
        foundInvoice = { ...foundInvoice, id: id };
      }
    } else {
      // Fallback or maybe it's a UUID from a real DB remnant?
      // Let's search just in case we add real IDs later.
      // For now, nothing.
    }

    if (!foundInvoice) return null; // Or throw? Original code returns invoice[0] which might be undefined? No, existing code assumes it exists.

    const invoice = {
      ...foundInvoice,
      // Convert amount from cents to dollars
      amount: foundInvoice.amount / 100,
    };

    return invoice;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  try {
    // Backend Integration Placeholder:
    // const data = await fetchData<CustomerField[]>('/customers/all');
    // if (data) return data;

    // const customers = await sql<CustomerField[]>`
    //   SELECT
    //     id,
    //     name
    //   FROM customers
    //   ORDER BY name ASC
    // `;

    const sortedCustomers = [...customers].sort((a, b) => a.name.localeCompare(b.name));
    return sortedCustomers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    // Backend Integration Placeholder:
    // const data = await fetchData<CustomersTableType[]>(`/customers?query=${query}&page=${currentPage}&limit=${ITEMS_PER_PAGE}`);
    // if (data) return data; // assuming API returns properly formatted data

    // const data = await sql<CustomersTableType[]>`
    // 	SELECT
    // 	  customers.id,
    // 	  customers.name,
    // 	  customers.email,
    // 	  customers.image_url,
    // 	  COUNT(invoices.id) AS total_invoices,
    // 	  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
    // 	  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
    // 	FROM customers
    // 	LEFT JOIN invoices ON customers.id = invoices.customer_id
    // 	WHERE
    // 	  customers.name ILIKE ${`%${query}%`} OR
    //     customers.email ILIKE ${`%${query}%`}
    // 	GROUP BY customers.id, customers.name, customers.email, customers.image_url
    // 	ORDER BY customers.name ASC
    // LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    //   `;

    const lowerQuery = query.toLowerCase();

    const filteredCustomers = customers.filter(customer =>
      customer.name.toLowerCase().includes(lowerQuery) ||
      customer.email.toLowerCase().includes(lowerQuery)
    );

    const customersWithData = filteredCustomers.map(customer => {
      const customerInvoices = invoices.filter(inv => inv.customer_id === customer.id);
      const total_invoices = customerInvoices.length;
      const total_pending = customerInvoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + inv.amount, 0);
      const total_paid = customerInvoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0);

      return {
        ...customer,
        total_invoices,
        total_pending,
        total_paid
      };
    });

    customersWithData.sort((a, b) => a.name.localeCompare(b.name));

    const paginatedCustomers = customersWithData.slice(offset, offset + ITEMS_PER_PAGE);

    const formattedCustomers = paginatedCustomers.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return formattedCustomers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}


export async function fetchTotalCustomers(): Promise<number> {
  try {
    // Backend Integration Placeholder:
    // const data = await fetchData<{count: number}>('/customers/count');
    // if (data) return data.count;

    return customers.length;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total customers.');
  }
}

export async function fetchDianDocuments() {
  try {
    const [receivedDocs, sentDocs] = await Promise.all([
      fetchData<any[]>('/api/v1/documents/received?limit=50'),
      fetchData<any[]>('/api/v1/documents/sent?limit=50')
    ]);

    const received = receivedDocs || [];
    const sent = sentDocs || [];

    // Combine and sort by date descending
    const allDocs = [...received, ...sent].sort((a, b) => {
      const dateA = new Date(a.issue_date || 0).getTime();
      const dateB = new Date(b.issue_date || 0).getTime();
      return dateB - dateA;
    });

    return allDocs;

  } catch (error) {
    console.error('Error fetching DIAN documents:', error);
    return [];
  }
}

export async function fetchReceivedDocuments(searchParams?: { startDate?: string; endDate?: string; prefijoFolio?: string; nitEmisor?: string }) {
  try {
    const params = new URLSearchParams();
    params.append('limit', '500');
    if (searchParams?.startDate) params.append('start_date', searchParams.startDate);
    if (searchParams?.endDate) params.append('end_date', searchParams.endDate);
    if (searchParams?.prefijoFolio) params.append('prefijoFolio', searchParams.prefijoFolio);
    if (searchParams?.nitEmisor) params.append('nitEmisor', searchParams.nitEmisor);

    const receivedDocs = await fetchData<any[]>(`/api/v1/documents/received?${params.toString()}`);
    return receivedDocs || [];
  } catch (error) {
    console.error('Error fetching received documents:', error);
    return [];
  }
}

export async function fetchSentDocuments(searchParams?: { startDate?: string; endDate?: string; prefijoFolio?: string; nitEmisor?: string; nitReceptor?: string }) {
  try {
    const params = new URLSearchParams();
    params.append('limit', '500');
    if (searchParams?.startDate) params.append('start_date', searchParams.startDate);
    if (searchParams?.endDate) params.append('end_date', searchParams.endDate);
    if (searchParams?.prefijoFolio) params.append('prefijoFolio', searchParams.prefijoFolio);
    // Be careful here: frontend sends 'nitReceptor'. API maps 'nitReceptor' to receiver_nit filter.
    // We append 'nitReceptor' param for the backend to consume.
    if (searchParams?.nitReceptor) params.append('nitReceptor', searchParams.nitReceptor);
    // Keep nitEmisor if needed for completeness, though sent docs page uses nitReceptor field now.
    if (searchParams?.nitEmisor) params.append('nitEmisor', searchParams.nitEmisor);

    const sentDocs = await fetchData<any[]>(`/api/v1/documents/sent?${params.toString()}`);
    return sentDocs || [];
  } catch (error) {
    console.error('Error fetching sent documents:', error);
    return [];
  }
}

export async function fetchPucAccounts() {
  try {
    const pucAccounts = await fetchData<any[]>('/api/v1/puc/?limit=1000'); // Fetch all or paginated
    return pucAccounts || [];
  } catch (error) {
    console.error('Error fetching PUC accounts:', error);
    return [];
  }
}
