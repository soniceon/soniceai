import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { SearchProvider } from '@/contexts/SearchContext';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isHome = router.pathname === '/';

  // 默认深色模式
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <LanguageProvider>
      <SearchProvider>
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#181825] transition-colors">
          <Navbar />
          {isHome && <Hero />}
          <div className="flex flex-1">
            <Sidebar />
            <div className="flex-1 ml-20 md:ml-56">
              <main className="max-w-7xl mx-auto w-full px-4">
                <Component {...pageProps} />
              </main>
            </div>
          </div>
          <Footer />
        </div>
      </SearchProvider>
    </LanguageProvider>
  );
}