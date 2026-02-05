'use client';

import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, DocumentTextIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { formatCurrency } from '@/app/lib/utils';
import { DianDocument } from '@/app/lib/definitions';

const TABLE_HEADERS = [
    'Recepción', 'Fecha', 'Prefijo', 'N° documento', 'Tipo',
    'NIT Emisor', 'Emisor', 'NIT Receptor', 'Receptor',
    'Resultado', 'Valor Total', 'Descargas'
];

interface DocumentTableProps {
    documents: any[];
    type?: 'received' | 'sent';
}

export default function DocumentTable({ documents, type = 'received' }: DocumentTableProps) {
    const [rowsPerPage, setRowsPerPage] = useState(50);
    const [currentPage, setCurrentPage] = useState(1);

    // Pagination logic could be added here or server-side. 
    // For now, we'll just display the passed documents as is, or slice them client-side if needed.
    // Given the requirement "supports 50 records per page", let's implement simple client-side pagination for the passed list.

    const totalPages = Math.ceil(documents.length / rowsPerPage);
    const paginatedDocuments = documents.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const handlePrevious = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };

    const getDownloadUrl = (doc: DianDocument, fileType: 'pdf' | 'xml', docType: 'received' | 'sent') => {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8001/api/v1';
        return `${API_BASE_URL}/dian-documents/download/${docType}/${doc.id}?file_type=${fileType}`;
    }

    return (
        <div className="mt-8">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">Resultados de búsqueda</h2>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Mostrar</span>
                    <select
                        value={rowsPerPage}
                        onChange={(e) => {
                            setRowsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                        className="rounded border border-gray-300 px-2 py-1 outline-none"
                    >
                        <option value={10}>10 registros</option>
                        <option value={25}>25 registros</option>
                        <option value={50}>50 registros</option>
                        <option value={100}>100 registros</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead>
                        <tr className="bg-[#f1f5f9] border-b text-gray-500 font-medium">
                            {TABLE_HEADERS.map((header) => (
                                <th key={header} className="px-4 py-4 uppercase tracking-wider">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {paginatedDocuments.length > 0 ? (
                            paginatedDocuments.map((doc, idx) => (
                                <tr key={doc.id || idx} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-4 text-gray-600">
                                        {doc.reception_date ? new Date(doc.reception_date).toLocaleDateString() : '-'}
                                    </td>
                                    <td className="px-4 py-4 text-gray-600">
                                        {doc.issue_date ? new Date(doc.issue_date).toLocaleDateString() : '-'}
                                    </td>
                                    <td className="px-4 py-4 text-gray-600">{doc.prefix || '-'}</td>
                                    <td className="px-4 py-4 font-semibold text-gray-900">{doc.number}</td>
                                    <td className="px-4 py-4 text-gray-600 italic">{doc.document_type}</td>
                                    <td className="px-4 py-4 text-gray-600">{doc.issuer_nit}</td>
                                    <td className="px-4 py-4 text-gray-600 truncate max-w-[200px]" title={doc.issuer_name}>
                                        {/* Assuming issuer_name might not exist in backend response based on logs, fallback to empty or check 'receiver_name' usage logic */}
                                        {/* Based on logs: received_documents has issuer_nit, receiver_nit, receiver_name. Sent docs similar. */}
                                        {/* The previous mock had 'emisor' and 'receptor'. */}
                                        {/* For received docs: Emisor is technically the other party. */}
                                        {/* For sent docs: Emisor is us (company). */}
                                        {/* Let's try to display what we have. API returns 'issuer_nit', 'receiver_nit', 'receiver_name'. Does it return issuer_name? */}
                                        {/* Looking at logs Step 767: received_documents table content query didn't select issuer_name. It selected receiver_name. */}
                                        {/* We might need to adjust based on available data. */}
                                        {doc.issuer_name || '-'}
                                    </td>
                                    <td className="px-4 py-4 text-gray-600">{doc.receiver_nit}</td>
                                    <td className="px-4 py-4 text-gray-600 truncate max-w-[200px]" title={doc.receiver_name}>
                                        {doc.receiver_name || '-'}
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium border ${doc.result === 'PROCESADO' || doc.result === 'Aprobado'
                                            ? 'bg-green-50 text-green-700 border-green-200'
                                            : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                            }`}>
                                            {doc.result}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 font-medium text-gray-900">
                                        {doc.total_amount ? formatCurrency(doc.total_amount) : '$0.00'}
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex space-x-2">
                                            {doc.file_path_pdf && (
                                                <a
                                                    href={getDownloadUrl(doc, 'pdf', type || 'received')}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    title="Descargar PDF"
                                                    className="text-red-600 hover:text-red-800 transition-colors"
                                                >
                                                    <DocumentTextIcon className="h-5 w-5" />
                                                </a>
                                            )}
                                            {doc.file_path_xml && (
                                                <a
                                                    href={getDownloadUrl(doc, 'xml', type || 'received')}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    title="Descargar XML"
                                                    className="text-blue-600 hover:text-blue-800 transition-colors"
                                                >
                                                    <ArrowDownTrayIcon className="h-5 w-5" />
                                                </a>
                                            )}
                                            {!doc.file_path_pdf && !doc.file_path_xml && (
                                                <span className="text-gray-300 text-xs">No disponible</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={TABLE_HEADERS.length} className="px-4 py-8 text-center text-gray-500">
                                    No se encontraron documentos.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                    Mostrando <span className="font-semibold">{paginatedDocuments.length}</span> de <span className="font-semibold">{documents.length}</span> registros
                </p>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handlePrevious}
                        disabled={currentPage === 1}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                        <ChevronLeftIcon className="h-4 w-4" />
                    </button>
                    <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-semibold">
                        {currentPage}
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={currentPage >= totalPages}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                        <ChevronRightIcon className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
