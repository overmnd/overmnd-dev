import type { Metadata } from 'next';
import './globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

/**
 * Root layout that keeps brand continuity with the admin portal.
 */
export const metadata: Metadata = {
  title: 'Overmnd',
  description: 'Operational awareness, minus the guesswork.',
  icons: { icon: '/favicon.ico' }
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="min-h-[calc(100vh-64px)]">{props.children}</main>
        <Footer />
      </body>
    </html>
  );
}
