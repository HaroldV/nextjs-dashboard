'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { DianDocument } from '@/app/lib/definitions';
import { formatCurrency } from '@/app/lib/utils';
import { useMemo } from 'react';
import { DocumentTextIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'; // Alternativa para descarga

// Date formatter
const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A';
    // Assuming backend returns ISO string or similar. Adjust if needed.
    // If backend returns 'dd-mm-yyyy', we might leave it.
    // But usually it's best to parse and format.
    try {
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat('es-CO', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(date);
    } catch (e) {
        return dateStr;
    }
};

export default function DianDocumentsTable({
    documents,
    type = 'received'
}: {
    documents: DianDocument[],
    type?: 'received' | 'sent'
}) {

    // Memoize if needed, though simple rendering is fast enough.
    // documents passed from server component are already sorted by date in fetchDianDocuments

    const handleDownload = async (doc: DianDocument, fileType: 'pdf' | 'xml') => {
        // En un entorno real, la URL base vendría de una env var o configuración.
        // Asumimos que el backend está en proceso.env.NEXT_PUBLIC_API_URL o similar, 
        // pero dado que estamos en el cliente, usamos una server action o llamamos directo si tenemos la URL publica.
        // Dado que hemos configurado un proxy o similar, o llamamos al backend directo:
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8001/api/v1';

        // Determinar si es received o sent
        // El modelo actual no tiene explícito el tipo "received" o "sent", 
        // pero la tabla se usa para ambos. ¿Cómo distinguimos?
        // Opción A: Pasar una prop extra a la tabla `type="received" | "sent"`
        // Opción B: Inferir del documento si tuviera el campo.

        // CORRECCIÓN: Para que funcione correctamente, necesitamos saber si mostramos recibidos o enviados.
        // Por ahora asumiremos "received" por defecto o intentaremos ambos, pero lo ideal es pasar la prop.
        // Vamos a asumir que el componente padre debería pasar el tipo. 
        // Como no puedo cambiar la firma del componente padre fácilmente sin ver dónde se usa,
        // intentaré inferir o usar un prop opcional si se pasara, pero por ahora useremos "received" como fallback,
        // o mejor, añadiremos una prop opcional `documentType` a la tabla.

        // Sin embargo, para no romper nada, intentemos usar la URL de descarga directa si el ID existe.
        if (!doc.id) return;

        // NOTA IMPORTANTE: Necesitamos saber si es 'received' o 'sent'.
        // Voy a modificar el componente para aceptar `type`.
        // Pero primero, añadamos la lógica genérica.

        // Temporalmente hardcodeado a 'received' si no se puede determinar, o usa una lógica basada en el path actual si pudiéramos.
        // Pero espera, el usuario pidió "documentos recibidos y enviados".
        // Asumiremos que la tabla se usa en contextos donde sabemos el tipo.
        // Voy a inyectar el tipo basado en una prop nueva que añadiré.
    };

    const getDownloadUrl = (doc: DianDocument, fileType: 'pdf' | 'xml', docType: 'received' | 'sent') => {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8001/api/v1';
        return `${API_BASE_URL}/dian-documents/download/${docType}/${doc.id}?file_type=${fileType}`;
    }

    return (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle>Resultados de búsqueda ({documents.length} encontrados)</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-gray-50">
                                <th className="px-4 py-3 text-left font-medium text-gray-700">Fecha Emisión</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">Prefijo</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">N° documento</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">Tipo</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">NIT Emisor</th>
                                {/* <th className="px-4 py-3 text-left font-medium text-gray-700">Emisor</th> */} {/* Missing in simple model */}
                                <th className="px-4 py-3 text-left font-medium text-gray-700">NIT Receptor</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">Receptor</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">Resultado</th>
                                {/* <th className="px-4 py-3 text-left font-medium text-gray-700">Estado RADIAN</th> */}
                                <th className="px-4 py-3 text-left font-medium text-gray-700">Valor Total</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">Tipo Documento</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">Descargas</th>
                            </tr>
                        </thead>
                        <tbody>
                            {documents.map((doc, index) => (
                                <tr key={doc.id || index} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-3 whitespace-nowrap">{formatDate(doc.issue_date)}</td>
                                    <td className="px-4 py-3">{doc.prefix || '-'}</td>
                                    <td className="px-4 py-3">{doc.number}</td>
                                    <td className="px-4 py-3">{doc.document_type}</td>
                                    <td className="px-4 py-3">{doc.issuer_nit}</td>
                                    {/* <td className="px-4 py-3">{'N/A'}</td> */}
                                    <td className="px-4 py-3">{doc.receiver_nit}</td>
                                    <td className="px-4 py-3 max-w-xs truncate" title={doc.receiver_name}>{doc.receiver_name}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${(doc.result || '').toLowerCase().includes('aprobado') || (doc.result || '').includes('PROCESADO')
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {doc.result || 'Procesado'}
                                        </span>
                                    </td>
                                    {/* <td className="px-4 py-3">{doc.radian_status || 'No Aplica'}</td> */}
                                    <td className="px-4 py-3 whitespace-nowrap">{formatCurrency(doc.total_amount)}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                            // Heuristic based on description or source
                                            // The fetch function combines endpoint source, but doc doesn't explicitly store "SENT" vs "RECEIVED" type in the model shown?
                                            // Actually `document_type` is like "Invoice". 
                                            // We might infer from NITs if we knew the user's NIT.
                                            // Or we can assume the API model might return context.
                                            // For now, let's just show what we have.
                                            'bg-gray-100 text-gray-800'
                                            }`}>
                                            {/* doc.document_type is UBL type like Invoice. */}
                                            {doc.document_type}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex space-x-2">
                                            {doc.file_path_pdf && (
                                                <a
                                                    href={getDownloadUrl(doc, 'pdf', type)}
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
                                                    href={getDownloadUrl(doc, 'xml', type)}
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
                            ))}
                        </tbody>
                    </table>
                </div>
                {documents.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        No se encontraron documentos
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

