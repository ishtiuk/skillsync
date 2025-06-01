'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

export default function OnboardingLayout({
  children // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <main className="h-full w-full flex flex-col mx-auto">
      <div className="flex flex-row h-full w-full">
        <div
          id="onboarding-info"
          className="relative grow basis-0 bg-white flex flex-col px-16 py-6 min-h-screen"
        >
          <div className="">
            <Image
              alt="Logo"
              width={172}
              height={49.9}
              src="/images/logo-full.png"
              style={{ marginBottom: '48px' }}
            />

            {children}
          </div>
        </div>

        <div className="grow basis-0 bg-neutral-n-100 flex flex-row justify-center">
          <Image
            width={278}
            height={335}
            alt="login-image"
            style={{ alignItems: 'center' }}
            src="/images/onboarding-right.svg"
          />
        </div>
      </div>
    </main>
  );
}
