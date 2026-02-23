'use client';

import { useRouter } from "next/navigation";
import { catchStoreName, catchLocale } from "@/lib/catchPathname";
import { useState } from "react";
import './App.css';
import StoreStartPanel from "@/components/StartPanel/StoreStartPanel";

export default function LandingPage() {
  const router = useRouter();
  const currentStore = catchStoreName();
  const locale = catchLocale();
  const [loading, setLoading] = useState(false);

  const handleARStart = async () => {
    setLoading(true);
    router.push(`/${locale}/${currentStore}/viewer`);
    setLoading(false);
  }

  return (
    <StoreStartPanel onUpdate={handleARStart} loading={loading} store={currentStore}/>
  );
}
