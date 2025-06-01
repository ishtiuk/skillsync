'use client';

import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      {...props}
      visibleToasts={1}
      toastOptions={{}}
      position="top-center"
    />
  );
};

export { Toaster };
