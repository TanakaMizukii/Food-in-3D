'use client';

import { useRouter } from "next/navigation";
import { catchStoreName, catchLocale } from "@/lib/catchPathname";
import { useState } from "react";
import { getMobileOS } from "@/lib/detectOS";
import { checkImmersiveARSupport } from "@/lib/checkWebXR";
import './App.css';
import StoreStartPanel from "@/components/StartPanel/StoreStartPanel";

export default function LandingPage() {
  const router = useRouter();
  const currentStore = catchStoreName();
  const locale = catchLocale();
  const [loading, setLoading] = useState(false);

  const handleARStart = async () => {
    setLoading(true);
    const os = getMobileOS();
    const xr = await checkImmersiveARSupport();
    if (os === 'android' || os === 'ios') {
      router.push(xr === 'supported' ? `/${locale}/${currentStore}/viewer` : `/${locale}/${currentStore}/viewer`);
    } else {
      router.push(`/${locale}/${currentStore}/viewer`);
    }
    setLoading(false);
  }

  return (
    <StoreStartPanel onUpdate={handleARStart} loading={loading} store={currentStore}/>
  );
}
