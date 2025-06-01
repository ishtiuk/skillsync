'use client';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { GOOGLE_CLIENT_ID } from '@/lib/constants/urls';
import { usePathname, useRouter } from 'next/navigation';
import { GoogleOAuthProvider } from '@react-oauth/google';
import SegmentedControl from '@workspace/ui/components/segmented-controller/SegmentedController';

export default function AuthorizationLayout({
  children // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathName = usePathname();
  const pathNameSplit = pathName.split('/');
  const initialPath = pathNameSplit[pathNameSplit.length - 1];
  const initialToggle = initialPath === 'new-user' ? 0 : 1;
  const toggleLogin = (value: any, index: any) => {
    console.log(index);

    router.push(`/login/${value}`);
  };
  useEffect(() => {
    console.log('prefetch');
    router.prefetch(
      `/login/${initialPath === 'new-user' ? 'existing-user' : 'new-user'}`
    );
  }, [initialPath, router]);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID || ''}>
      <div className="flex flex-row h-full">
        <div
          id="login-left"
          className="grow basis-0 bg-white flex flex-col px-16 py-6 min-h-screen"
        >
          <div className="">
            <Image
              alt="Logo"
              width={172}
              height={49.9}
              src="/images/logo-full.png"
              style={{ marginBottom: '48px' }}
            />
            <div id="login-toggle" className="mb-6">
              <SegmentedControl
                name={'login-toggle'}
                callback={toggleLogin}
                segments={[
                  {
                    label: 'Sign Up',
                    value: 'new-user',
                    ref: useRef()
                  },
                  {
                    label: 'Log In',
                    value: 'existing-user',
                    ref: useRef()
                  }
                ]}
                defaultIndex={initialToggle}
              />
            </div>
            {children}
          </div>
        </div>

        <div className="grow basis-0 bg-neutral-n-100 p-12 center flex flex-row justify-center">
          <Image
            width={514}
            height={570}
            alt="login-image"
            src="/images/login.svg"
            style={{ alignItems: 'center' }}
          />
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
