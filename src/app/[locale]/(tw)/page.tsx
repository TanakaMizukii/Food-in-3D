'use client';

import { useState, useEffect } from 'react';
import storeNames from "@/data/storeInfo";
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import LanguageSelector from "@/components/Common/LanguageSelector";
import { getMobileOS } from '@/lib/detectOS';

export default function Home() {
  const t = useTranslations('home');
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    if (getMobileOS() === 'ios') {
      setIsIOS(true);
    }
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-gray-100 font-sans relative">
      {/* Language Selector */}
      <div className="absolute top-8 left-8">
        <LanguageSelector />
      </div>

      <main className="flex flex-col items-center justify-center text-center w-full max-w-4xl p-6 md:p-12 gap-8 md:gap-12">
        <div className="animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter">
            {t('title')}
          </h1>
        </div>
        <div className="animate-fade-in-up animation-delay-300">
          <p className="max-w-2xl text-lg md:text-xl text-gray-400">
            {t('description')}
            <br />
            {t('selectStore')}
          </p>
        </div>
        <div className="w-full max-w-sm animate-fade-in-up animation-delay-600">
          <div className="grid grid-cols-1 gap-4">
            {storeNames.map((storeName) => (
              <div key={storeName.id}>
                <Link href={`/${storeName.use_name}`}
                  className="flex items-center justify-center w-full h-16 px-6 rounded-lg bg-gray-900 border border-gray-800 text-lg font-medium text-gray-100 transition-all duration-200 ease-in-out hover:bg-gray-800 hover:border-gray-700 hover:-translate-y-0.5 cursor-pointer">
                    {storeName.true_name}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

