'use client';

import { useRouter } from "next/navigation";
import { catchStorename } from "@/lib/catchStoreInfo";
import { useState } from "react";
import { getMobileOS } from "@/lib/detectOS";
import { checkImmersiveARSupport } from "@/lib/checkWebXR";
import './App.css';
import StoreStartPanel from "@/components/StoreStartPanel";

export default function LandingPage() {
  const router = useRouter();
  const store = catchStorename();
  const [loading, setLoading] = useState(false);

  const handleARStart = async () => {
    setLoading(true);
    const os = getMobileOS();
    const xr = await checkImmersiveARSupport();
    if (os === 'android' || os === 'ios') {
      router.push(xr === 'supported' ? `/${store}/arView` : `/${store}/arJS`);
    } else {
      router.push(`/${store}/viewer`);
    }
    setLoading(false);
  }

  return (
    <StoreStartPanel onUpdate={handleARStart} loading={loading} store={store}/>
  );
}
