'use client';

import { useEffect } from 'react';

export default async function Index() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }, []);

  return null;
}
