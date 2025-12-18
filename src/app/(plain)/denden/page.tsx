'use client';

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getMobileOS } from "@/lib/detectOS";
import { checkImmersiveARSupport } from "@/lib/checkWebXR";
import './App.css';
import DendenStartPanel from "@/components/DenDenStartPanel";

export default function LandingPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  const handleARStart = async () => {
    setLoading(true);
    const os = getMobileOS();
    const xr = await checkImmersiveARSupport();
    if (os === 'android' || os === 'ios') {
      router.push(xr === 'supported' ? `${pathname}/arView` : `${pathname}/arJS`);
    } else {
      router.push(`${pathname}/viewer`);
    }
    setLoading(false);
  }

  return (
    <DendenStartPanel onUpdate={handleARStart} loading={loading} />
  );
}
