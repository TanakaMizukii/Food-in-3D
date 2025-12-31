'use client';

import { useRouter } from "next/navigation";
import { catchPathname } from "@/lib/catchPathname";
import { useState } from "react";
import { getMobileOS } from "@/lib/detectOS";
import { checkImmersiveARSupport } from "@/lib/checkWebXR";
import './App.css';
import StoreStartPanel from "@/components/StoreStartPanel";

export default function LandingPage() {
  const router = useRouter();
  const currentStore = catchPathname();
  const [loading, setLoading] = useState(false);

  const handleARStart = async () => {
    setLoading(true);
    const os = getMobileOS();
    const xr = await checkImmersiveARSupport();
    if (os === 'android' || os === 'ios') {
      router.push(xr === 'supported' ? `/${currentStore}/arView` : `/${currentStore}/arJS`);
    } else {
      router.push(`/${currentStore}/viewer`);
    }
    setLoading(false);
  }

  return (
    <StoreStartPanel onUpdate={handleARStart} loading={loading} store={currentStore}/>
  );
}
