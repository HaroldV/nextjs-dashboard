'use client';

import {
  DocumentArrowUpIcon,
  PresentationChartBarIcon,
  DocumentCurrencyDollarIcon,
  DocumentDuplicateIcon,
  UserIcon,
  BoltIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  {
    name: 'Home',
    href: '/dashboard',
    icon: PresentationChartBarIcon
  },
  {
    name: 'Descarga de Facturas DIAN',
    href: '/dashboard/invoicesDian',
    icon: ArrowDownTrayIcon
  },
  {
    name: 'Facturas de Venta',
    href: '/dashboard/invoices',
    icon: DocumentCurrencyDollarIcon
  },
  {
    name: 'Facturas de Compra',
    href: '/dashboard/customers',
    icon: DocumentCurrencyDollarIcon
  },
  {
    name: 'Clientes',
    href: '/dashboard/clients',
    icon: UserIcon
  },
  {
    name: 'Carga de PUC',
    href: '/dashboard/carga-listado-puc',
    icon: DocumentArrowUpIcon
  },
  {
    name: 'Aplicativo Estado de RUT',
    href: '#',
    icon: DocumentDuplicateIcon
  },
  {
    name: 'Reportes AI',
    href: '/dashboard/reportes-ia',
    icon: BoltIcon
  }
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex h-[48px] grow items-center justify-center gap-2 rounded-xl p-3 text-sm font-medium transition-all duration-300 md:flex-none md:justify-start md:p-2 md:px-3",
              {
                "bg-blue-50 text-blue-600 shadow-sm": pathname === link.href,
                "text-gray-700 hover:bg-gray-100 hover:text-blue-600": pathname !== link.href,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
