'use client';

import { PlusIcon } from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { useRef, useState } from 'react';
import { uploadPuc } from '@/app/lib/actions';

export function ImportPuc() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const result = await uploadPuc(formData);
            if (result.success) {
                alert(result.message);
                // Opcional: Recargar página o actualizar estado global
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error(error);
            alert('Error inesperado al cargar el archivo.');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = ''; // Reset input
            }
        }
    };

    return (
        <>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".xlsx, .xls"
            />
            <Button
                onClick={handleButtonClick}
                disabled={isUploading}
                className={`h-10 items-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                <span className="hidden md:block">{isUploading ? 'Subiendo...' : 'Importar PUC'}</span>{' '}
                <PlusIcon className="h-5 md:ml-4" />
            </Button>
        </>
    );
}
