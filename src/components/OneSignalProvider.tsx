'use client'

import { useEffect } from 'react';
import { initializeOneSignal } from '@/lib/onesignal';

export default function OneSignalProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== 'undefined' &&
        process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID &&
        process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID !== 'placeholder_app_id') {
      initializeOneSignal();
    }
  }, []);

  return <>{children}</>;
}