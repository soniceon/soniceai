import '../styles/globals.css';
import { appWithTranslation } from 'next-i18next';
import nextI18NextConfig from '../../next-i18next.config.js';
import { AuthProvider } from '../context/AuthContext';
import { SearchProvider } from '../contexts/SearchContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import { useRouter } from 'next/router';
import { ThemeProvider } from 'next-themes';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const isHome = router.pathname === '/';
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <SearchProvider>
    <AuthProvider>
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
    </AuthProvider>
      </SearchProvider>
    </ThemeProvider>
  );
}

export default appWithTranslation(MyApp, nextI18NextConfig); 