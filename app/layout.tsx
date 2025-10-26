// layout.tsx
import { GlobalProvider } from '@/context/GlobalContext';
import './globals.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Stock Simulator',
  description: 'Stock trading simulation app',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground">
        <GlobalProvider>
          {children}
        </GlobalProvider>
      </body>
    </html>
  );
}