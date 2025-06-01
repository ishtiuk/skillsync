import Providers from '@/components/providers';
import '../../../packages/ui/src/styles/globals.css';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata = {
  title: 'Pathways',
  metadataBase: new URL(defaultUrl),
  description: 'A job portal for the social impact sector'
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
