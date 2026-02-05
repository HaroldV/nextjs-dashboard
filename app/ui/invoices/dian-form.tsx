'use client';

import { Button } from '@/app/ui/button';
import {
    KeyIcon,
} from '@heroicons/react/24/outline';
import { useState, useEffect, useRef } from 'react';
import ConfirmDownloadModal from './confirm-download-modal';
import { triggerDianRpa, getRPATaskStatus } from '@/app/lib/actions';
import { useRouter } from 'next/navigation';

const MONTHS = [
    { value: '01', label: 'Enero' },
    { value: '02', label: 'Febrero' },
    { value: '03', label: 'Marzo' },
    { value: '04', label: 'Abril' },
    { value: '05', label: 'Mayo' },
    { value: '06', label: 'Junio' },
    { value: '07', label: 'Julio' },
    { value: '08', label: 'Agosto' },
    { value: '09', label: 'Septiembre' },
    { value: '10', label: 'Octubre' },
    { value: '11', label: 'Noviembre' },
    { value: '12', label: 'Diciembre' },
];

const YEARS = Array.from({ length: 40 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: year.toString(), label: year.toString() };
});

const DOCUMENT_TYPES = [
    { value: 'recibidos', label: 'Documentos Recibidos' },
    { value: 'enviados', label: 'Documentos Enviados' },
];

// Helper function to calculate start and end dates for a given month/year
function getMonthDateRange(month: string, year: string) {
    const startDate = `${year}-${month}-01`;

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // 0-indexed

    let lastDay: number;

    // Check if selected month/year is the current one
    if (parseInt(year) === currentYear && parseInt(month) === currentMonth) {
        lastDay = now.getDate();
    } else {
        const nextMonth = parseInt(month) === 12 ? 1 : parseInt(month) + 1;
        const nextYear = parseInt(month) === 12 ? parseInt(year) + 1 : parseInt(year);
        lastDay = new Date(nextYear, nextMonth - 1, 0).getDate();
    }

    const endDate = `${year}-${month}-${lastDay.toString().padStart(2, '0')}`;
    return { startDate, endDate };
}


interface TaskStatus {
    id: number;
    status: string;
    progress_message: string | null;
    files_downloaded: number;
    total_files_to_download: number;
    progress_percent: number;
}

export default function DianForm() {
    const [message, setMessage] = useState<string | null>(null);
    const [isError, setIsError] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isPolling, setIsPolling] = useState(false);
    const [taskId, setTaskId] = useState<number | null>(null);
    const [taskStatus, setTaskStatus] = useState<TaskStatus | null>(null);

    // Form state
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [documentType, setDocumentType] = useState('');
    const [token, setToken] = useState('');

    const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const router = useRouter();

    useEffect(() => {
        return () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
            }
        };
    }, []);

    async function pollTaskStatus(currentTaskId: number) {
        try {
            const status = await getRPATaskStatus(currentTaskId);

            if (!status) return;

            setTaskStatus(status);

            if (status.status === 'COMPLETED') {
                if (status.files_downloaded === 0) {
                    setMessage(`⚠️ Proceso terminado. No se encontraron nuevas facturas para descargar.`);
                } else {
                    setMessage(`✅ Descarga completada: ${status.files_downloaded} archivos descargados`);
                }
                setIsError(false);
                setIsPolling(false);
                if (pollingIntervalRef.current) {
                    clearInterval(pollingIntervalRef.current);
                }
                router.refresh(); // Refresh page data
            } else if (status.status === 'FAILED') {
                setMessage(`❌ Error en la descarga: ${status.progress_message || 'Error desconocido'}. Intente nuevamente.`);
                setIsError(true);
                setIsPolling(false);
                if (pollingIntervalRef.current) {
                    clearInterval(pollingIntervalRef.current);
                }
            } else {
                // In progress
                const progressMsg = status.progress_message ||
                    `Descargando... ${status.files_downloaded}/${status.total_files_to_download} archivos (${status.progress_percent.toFixed(0)}%)`;
                setMessage(progressMsg);
                setIsError(false);
            }

        } catch (error) {
            console.error('Error polling task status:', error);
        }
    }

    function handleFormSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!month || !year || !documentType || !token) {
            setMessage('Por favor complete todos los campos');
            setIsError(true);
            return;
        }
        setIsModalOpen(true);
    }

    async function handleConfirmDownload() {
        setIsLoading(true);
        setMessage(null);

        try {
            const { startDate, endDate } = getMonthDateRange(month, year);
            const formData = new FormData();
            formData.append('startDate', startDate);
            formData.append('endDate', endDate);
            formData.append('typeDocument', documentType);
            formData.append('token', token);

            const result = await triggerDianRpa(formData);

            if (!result.taskId) {
                throw new Error(result.message || 'No se recibió ID de tarea');
            }

            setTaskId(result.taskId);

            const monthName = MONTHS.find(m => m.value === month)?.label;
            const docTypeLabel = DOCUMENT_TYPES.find(d => d.value === documentType)?.label;
            setMessage(`📥 Descarga iniciada para ${monthName} ${year} - ${docTypeLabel}`);
            setIsError(false);
            setIsModalOpen(false);

            setIsPolling(true);

            // Poll immediately
            await pollTaskStatus(result.taskId);

            // Poll every 5 seconds (User requested 5-7 seconds)
            pollingIntervalRef.current = setInterval(() => {
                pollTaskStatus(result.taskId);
            }, 5000);

        } catch (error) {
            console.error('Error:', error);
            setMessage(error instanceof Error ? error.message : 'Error al procesar la solicitud');
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <form onSubmit={handleFormSubmit}>
                <div className="rounded-md bg-gray-50 p-4 md:p-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-4">
                        <div>
                            <label htmlFor="month" className="mb-2 block text-sm font-medium">Mes</label>
                            <select
                                id="month"
                                name="month"
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                                required
                                disabled={isPolling}
                                className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 disabled:opacity-50"
                            >
                                <option value="">Seleccionar mes...</option>
                                {MONTHS.map((m) => (
                                    <option key={m.value} value={m.value}>{m.label}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="year" className="mb-2 block text-sm font-medium">Año</label>
                            <select
                                id="year"
                                name="year"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                required
                                disabled={isPolling}
                                className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 disabled:opacity-50"
                            >
                                <option value="">Seleccionar año...</option>
                                {YEARS.map((y) => (
                                    <option key={y.value} value={y.value}>{y.label}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="documentType" className="mb-2 block text-sm font-medium">Tipo de Documento</label>
                            <select
                                id="documentType"
                                name="documentType"
                                value={documentType}
                                onChange={(e) => setDocumentType(e.target.value)}
                                required
                                disabled={isPolling}
                                className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 disabled:opacity-50"
                            >
                                <option value="">Seleccionar tipo...</option>
                                {DOCUMENT_TYPES.map((type) => (
                                    <option key={type.value} value={type.value}>{type.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="token" className="mb-2 block text-sm font-medium">Token Dian</label>
                        <div className="relative">
                            <input
                                id="token"
                                name="token"
                                type="text"
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                placeholder="Ingrese su token DIAN"
                                required
                                disabled={isPolling}
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500 disabled:opacity-50"
                            />
                            <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                        </div>
                    </div>

                    {message && (
                        <div className={`mb-4 p-4 rounded-md text-sm font-medium ${isError
                            ? 'bg-red-100 text-red-700'
                            : isPolling
                                ? 'bg-blue-100 text-blue-700 animate-pulse'
                                : message && message.includes('⚠️')
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-green-100 text-green-700'
                            }`}>
                            <div className="flex items-center gap-2">
                                {isPolling && (
                                    <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                                )}
                                <span>{message}</span>
                            </div>
                            {taskStatus && isPolling && (
                                <div className="mt-4 text-xs">
                                    <div className="mb-2 font-medium text-blue-800 text-center">
                                        {taskStatus.progress_message || 'Procesando...'}
                                    </div>
                                    <div className="w-full bg-blue-200 rounded-full h-2.5 mb-2 overflow-hidden">
                                        <div
                                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                                            style={{ width: `${taskStatus.progress_percent}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-blue-700 font-medium">
                                        <span>Descargados: {taskStatus.files_downloaded} / {taskStatus.total_files_to_download}</span>
                                        <span>{taskStatus.progress_percent.toFixed(0)}%</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="mt-6 flex justify-center gap-4">
                    <Button type="submit" disabled={isPolling || isLoading}>
                        {isLoading ? 'Iniciando...' : isPolling ? 'Procesando...' : 'Descargar Facturas'}
                    </Button>
                </div>
            </form>

            <ConfirmDownloadModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmDownload}
                month={month}
                year={year}
                documentType={documentType}
                isLoading={isLoading}
            />
        </>
    );
}

