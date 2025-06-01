import Providers from '@/components/providers';
import '../../../packages/ui/src/styles/globals.css';

const defaultUrl = process.env.HOST_NAME
  ? `https://${process.env.HOST_NAME}`
  : 'http://localhost:3000';

export const metadata = {
  title: 'Candid',
  metadataBase: new URL(defaultUrl),
  description: 'A platform for employers to find diverse talent'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <Providers>
          <main className="h-full max-w-[1440px] w-full flex flex-col mx-auto">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
