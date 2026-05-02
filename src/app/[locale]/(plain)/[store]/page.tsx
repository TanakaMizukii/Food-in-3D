'use client';

import { useRouter } from "next/navigation";
import { catchStoreName, catchLocale } from "@/lib/catchPathname";
import { useState } from "react";
import "./App.css";
import StoreStartPanel from "@/components/StartPanel/StoreStartPanel";
import { getMobileOS } from "@/lib/detectOS";

export default function LandingPage() {
  const router = useRouter();
  const currentStore = catchStoreName();
  const locale = catchLocale();
  const [loading, setLoading] = useState(false);

  const handleARStart = async () => {
    setLoading(true);
    const os = getMobileOS();
    if (os === 'other') {
      router.push(`/${locale}/${currentStore}/viewer`);
    } else {
      router.push(`/${locale}/${currentStore}/8thWallAR`);
    }
    setLoading(false);
  }

  return (
    <StoreStartPanel onUpdate={handleARStart} loading={loading} store={currentStore}/>
  );
}
