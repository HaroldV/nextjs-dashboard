'use server';

import { fetchData } from './data';

export async function searchDocumentsForReport(start_date: string, end_date: string, doc_type: string) {
    try {
        const data = await fetchData<any[]>(`/api/v1/reports/documents?start_date=${start_date}&end_date=${end_date}&doc_type=${doc_type}`);
        return data || [];
    } catch (error) {
        console.error('Error searching documents:', error);
        return [];
    }
}

export async function analyzeDocumentsWithAI(invoice_ids: number[], doc_type: string) {
    if (!invoice_ids.length) return [];

    try {
        const data = await fetchData<any[]>('/api/v1/reports/analyze', {
            method: 'POST',
            body: JSON.stringify({
                invoice_ids: invoice_ids,
                doc_type: doc_type
            })
        });
        return data || [];
    } catch (error) {
        console.error('Error analyzing documents:', error);
        return [];
    }
}

export async function getReportsHistory() {
    try {
        const data = await fetchData<any[]>('/api/v1/reports/history?limit=50');
        return data || [];
    } catch (error) {
        console.error('Error fetching reports history:', error);
        return [];
    }
}

export async function getReportDetail(reportId: number) {
    try {
        const data = await fetchData<any[]>(`/api/v1/reports/history/${reportId}`);
        return data || [];
    } catch (error) {
        console.error('Error fetching report detail:', error);
        return [];
    }
}
