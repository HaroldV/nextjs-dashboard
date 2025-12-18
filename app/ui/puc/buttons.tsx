import { PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/app/ui/button';

export function ImportPuc() {
    return (
        <Button className="h-10 items-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
            <span className="hidden md:block">Importar PUC</span>{' '}
            <PlusIcon className="h-5 md:ml-4" />
        </Button>
    );
}
