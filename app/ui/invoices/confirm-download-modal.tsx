'use client';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface ConfirmDownloadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    month: string;
    year: string;
    documentType: string;
    isLoading?: boolean;
}

const MONTH_NAMES: { [key: string]: string } = {
    '01': 'Enero',
    '02': 'Febrero',
    '03': 'Marzo',
    '04': 'Abril',
    '05': 'Mayo',
    '06': 'Junio',
    '07': 'Julio',
    '08': 'Agosto',
    '09': 'Septiembre',
    '10': 'Octubre',
    '11': 'Noviembre',
    '12': 'Diciembre',
};

export default function ConfirmDownloadModal({
    isOpen,
    onClose,
    onConfirm,
    month,
    year,
    documentType,
    isLoading = false
}: ConfirmDownloadModalProps) {
    const monthName = MONTH_NAMES[month] || month;
    const docTypeLabel = documentType === 'enviados' ? 'Documentos Enviados' : 'Documentos Recibidos';

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-blue-600" />
                        Confirmar Descarga de Facturas
                    </DialogTitle>
                    <DialogDescription>
                        Por favor confirme los detalles de la descarga
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="rounded-lg bg-blue-50 p-4 space-y-2">
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Período:</span>
                            <span className="text-gray-900">{monthName} {year}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Tipo:</span>
                            <span className="text-gray-900">{docTypeLabel}</span>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600">
                        Se inicializará el proceso de descarga de facturas para el período seleccionado.
                        Este proceso puede tomar varios minutos dependiendo de la cantidad de documentos.
                    </p>
                </div>
                <DialogFooter className="gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Iniciando...' : 'Confirmar Descarga'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
