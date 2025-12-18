import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image';

export default function AcmeLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white w-full`}
    >
      <Image
        src="/devcont-logo.png"
        width={500}
        height={250}
        alt="DevCont Logo"
        className="w-full h-auto object-contain"
        priority
      />
    </div>
  );
}
