'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/app/ui/button';
import { CalendarDaysIcon, MagnifyingGlassIcon, SparklesIcon, ClockIcon, EyeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { searchDocumentsForReport, analyzeDocumentsWithAI, getReportsHistory, getReportDetail } from '@/app/lib/actions-reports';
import clsx from 'clsx';

export default function AIReportsPage() {
    // Tabs
    const [activeTab, setActiveTab] = useState<'new' | 'history'>('new');
    const [viewingHistoryDetailId, setViewingHistoryDetailId] = useState<number | null>(null);

    // --- NEW REPORT STATE ---
    const [docType, setDocType] = useState('received');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [documents, setDocuments] = useState<any[]>([]);
    const [analysisResults, setAnalysisResults] = useState<any[]>([]);
    const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    // --- HISTORY STATE ---
    const [historyList, setHistoryList] = useState<any[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [historyDetail, setHistoryDetail] = useState<any[]>([]);

    // --- EFFECTS ---
    useEffect(() => {
        if (activeTab === 'history' && !viewingHistoryDetailId) {
            loadHistory();
        }
    }, [activeTab, viewingHistoryDetailId]);

    const loadHistory = async () => {
        setIsLoadingHistory(true);
        try {
            const data = await getReportsHistory();
            setHistoryList(data);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoadingHistory(false);
        }
    };

    // --- HANDLERS (NEW REPORT) ---
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setIsLoadingDocuments(true);
        setDocuments([]);
        setAnalysisResults([]);

        try {
            if (!startDate || !endDate) {
                setErrorMsg('Por favor seleccione fecha inicial y final.');
                setIsLoadingDocuments(false);
                return;
            }
            // Ensure YYYY-MM-DD format (input type date gives this usually, but good to be safe)
            const docs = await searchDocumentsForReport(startDate, endDate, docType);
            setDocuments(docs);
            if (docs.length === 0) {
                setErrorMsg('No se encontraron documentos en este rango.');
            }
        } catch (err) {
            console.error(err);
            setErrorMsg('Error al buscar documentos.');
        } finally {
            setIsLoadingDocuments(false);
        }
    };

    const handleAnalyze = async () => {
        setIsAnalyzing(true);
        setErrorMsg('');
        try {
            const ids = documents.map(d => d.id);
            const results = await analyzeDocumentsWithAI(ids, docType);
            setAnalysisResults(results);
            if (results.length === 0) {
                setErrorMsg('No se pudo generar el reporte o no se encontraron ítems en los XML.');
            }
        } catch (err) {
            console.error(err);
            setErrorMsg('Error durante el análisis de IA.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    // --- HANDLERS (HISTORY) ---
    const handleViewDetail = async (reportId: number) => {
        setViewingHistoryDetailId(reportId); // Switch view
        setHistoryDetail([]); // Clear previous
        try {
            const data = await getReportDetail(reportId);
            setHistoryDetail(data);
        } catch (e) {
            console.error(e);
        }
    };

    const handleBackToHistory = () => {
        setViewingHistoryDetailId(null);
        setHistoryDetail([]);
    };

    // --- RENDER HELPERS ---
    const renderResultsTable = (data: any[]) => (
        <div className="rounded-xl border bg-white shadow-lg overflow-hidden ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-300">
            <table className="min-w-full text-sm text-gray-900">
                <thead className="bg-blue-50 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                    <tr>
                        <th className="px-6 py-3">Factura</th>
                        <th className="px-6 py-3">Ítem / Descripción</th>
                        <th className="px-6 py-3">Cuenta PUC Sugerida</th>
                        <th className="px-6 py-3 text-right">Retención</th>
                        <th className="px-6 py-3 text-right">IVA</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                    {data.map((row, idx) => (
                        <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-600">{row.invoice_ref}</td>
                            <td className="px-6 py-4 max-w-[300px] truncate" title={row.item}>{row.item}</td>
                            <td className="px-6 py-4">
                                <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                                    {row.suggested_puc}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right text-gray-600">
                                ${row.retefuente.toLocaleString()} <span className="text-xs text-gray-400">({(row.suggested_retefuente_pct * 100).toFixed(1)}%)</span>
                            </td>
                            <td className="px-6 py-4 text-right text-gray-600">
                                ${row.iva.toLocaleString()} <span className="text-xs text-gray-400">({(row.suggested_iva_pct * 100).toFixed(0)}%)</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between mb-6">
                <h1 className={`${lusitana.className} text-2xl`}>Generación de Reportes con IA</h1>
            </div>

            {/* TABS */}
            <div className="flex space-x-4 border-b border-gray-200 mb-6">
                <button
                    onClick={() => setActiveTab('new')}
                    className={clsx(
                        "py-2 px-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2",
                        activeTab === 'new'
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    )}
                >
                    <SparklesIcon className="h-5 w-5" />
                    Generar Nuevo
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={clsx(
                        "py-2 px-4 text-sm font-medium border-b-2 transition-colors flex items-center gap-2",
                        activeTab === 'history'
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    )}
                >
                    <ClockIcon className="h-5 w-5" />
                    Historial
                </button>
            </div>

            {/* TAB CONTENT: NEW REPORT */}
            {activeTab === 'new' && (
                <div className="space-y-8">
                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                        <form onSubmit={handleSearch} className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">Tipo de Documento</label>
                                <select
                                    value={docType}
                                    onChange={(e) => setDocType(e.target.value)}
                                    className="block w-full rounded-lg border border-gray-200 py-2.5 px-4 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                >
                                    <option value="received">Documentos Recibidos</option>
                                    <option value="sent">Documentos Enviados</option>
                                </select>
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">Rango de Fechas</label>
                                <div className="flex gap-4">
                                    <div className="relative w-full">
                                        <input
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            className="block w-full rounded-lg border border-gray-200 py-2.5 pl-4 pr-4 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                        />
                                    </div>
                                    <div className="relative w-full">
                                        <input
                                            type="date"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="block w-full rounded-lg border border-gray-200 py-2.5 pl-4 pr-4 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-end">
                                <Button className="w-full bg-[#34d399] hover:bg-[#10b981]" disabled={isLoadingDocuments}>
                                    <MagnifyingGlassIcon className="mr-2 h-5 w-5" />
                                    {isLoadingDocuments ? 'Buscando...' : 'Buscar'}
                                </Button>
                            </div>
                        </form>
                        {errorMsg && <div className="mt-4 text-sm text-red-500">{errorMsg}</div>}
                    </div>

                    {/* RESULTS: DOCS FOUND */}
                    {documents.length > 0 && (
                        <div>
                            <h2 className={`${lusitana.className} mb-4 text-xl`}>Documentos Encontrados ({documents.length})</h2>
                            <div className="rounded-xl border bg-white shadow-sm overflow-hidden max-h-[400px] overflow-y-auto">
                                <table className="min-w-full text-sm text-gray-900">
                                    <thead className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0">
                                        <tr>
                                            <th className="px-6 py-3">Fecha</th>
                                            <th className="px-6 py-3">Número</th>
                                            <th className="px-6 py-3">Proveedor/Cliente</th>
                                            <th className="px-6 py-3">Total</th>
                                            <th className="px-6 py-3">XML</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {documents.map((doc) => (
                                            <tr key={doc.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">{new Date(doc.date).toLocaleDateString()}</td>
                                                <td className="px-6 py-4 whitespace-nowrap font-medium">{doc.number}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{doc.provider}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">${doc.total.toLocaleString()}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {doc.xml_content ? <span className="text-green-600 font-medium text-xs">OK</span> : <span className="text-red-400 text-xs">Missing</span>}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-6 flex justify-center">
                                <Button onClick={handleAnalyze} disabled={isAnalyzing} className="bg-blue-600 hover:bg-blue-500 px-8 py-3 text-base">
                                    <SparklesIcon className="mr-2 h-5 w-5" />
                                    {isAnalyzing ? 'Analizando (y guardando)...' : 'Generar Reporte con IA'}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* RESULTS: AI ANALYSIS */}
                    {analysisResults.length > 0 && (
                        <div className="mb-20">
                            <h2 className={`${lusitana.className} mb-4 text-xl flex items-center gap-2`}>
                                <SparklesIcon className="h-6 w-6 text-yellow-500" />
                                Reporte Generado
                            </h2>
                            {renderResultsTable(analysisResults)}
                        </div>
                    )}
                </div>
            )}

            {/* TAB CONTENT: HISTORY */}
            {activeTab === 'history' && !viewingHistoryDetailId && (
                <div className="animate-in fade-in duration-500">
                    <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                        <table className="min-w-full text-sm text-gray-900">
                            <thead className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-3">ID</th>
                                    <th className="px-6 py-3">Fecha Creación</th>
                                    <th className="px-6 py-3">Rango Analizado</th>
                                    <th className="px-6 py-3">Tipo</th>
                                    <th className="px-6 py-3">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {isLoadingHistory && (
                                    <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Cargando historial...</td></tr>
                                )}
                                {!isLoadingHistory && historyList.length === 0 && (
                                    <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No hay reportes guardados.</td></tr>
                                )}
                                {historyList.map((report) => (
                                    <tr key={report.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap font-medium">#{report.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                            {new Date(report.created_at).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {report.start_date} - {report.end_date}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={clsx(
                                                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                                                report.document_type === 'received' ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                                            )}>
                                                {report.document_type === 'received' ? 'Recibidos' : 'Enviados'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleViewDetail(report.id)}
                                                className="text-blue-600 hover:text-blue-900 flex items-center gap-1 font-medium"
                                            >
                                                <EyeIcon className="h-4 w-4" /> Ver Detalle
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: HISTORY DETAIL */}
            {activeTab === 'history' && viewingHistoryDetailId && (
                <div className="animate-in slide-in-from-right-10 duration-300">
                    <div className="mb-6 flex items-center gap-4">
                        <Button onClick={handleBackToHistory} className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                            <ArrowLeftIcon className="h-5 w-5 mr-1" /> Volver
                        </Button>
                        <h2 className={`${lusitana.className} text-xl`}>Detalle del Reporte #{viewingHistoryDetailId}</h2>
                    </div>
                    {historyDetail.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">Cargando detalles...</div>
                    ) : (
                        renderResultsTable(historyDetail)
                    )}
                </div>
            )}
        </div>
    );
}
