import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import FeaturedSection from './FeaturedSection';
import MobileNav from './MobileNav';
import { useTheme } from 'next-themes';
interface LayoutProps {
  children: React.ReactNode;
}
const Layout: React.FC<LayoutProps> = ({
  children
}) => {
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {
    theme
  } = useTheme();

  // After mounting, we can safely show the UI that depends on the theme
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return null;
  }
  return <div className={`flex min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Sidebar - Hidden on mobile, shown on larger screens */}
      <div className={t("auto_hidden_md_block_d58f63")}>
        <Sidebar isOpen={true} />
      </div>
      
      {/* Mobile Sidebar - Shown only when toggled */}
      {sidebarOpen && <div className={t("auto_md_hidden_fixed_inset_0_z_50_b_1d67d0")}>
          <div className={t("auto_w_64_h_full_bg_white_dark_bg_g_ea9b9c")}>
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          </div>
        </div>}
      
      {/* Main Content */}
      <div className={t("auto_flex_1_flex_flex_col_008b48")}>
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className={t("auto_flex_1_flex_flex_col_md_flex_r_eb09f4")}>
          <div className="flex-1 p-4 md:p-6 overflow-y-auto">
            {children}
          </div>
          
          {/* Featured Section - Hidden on mobile, shown on larger screens */}
          <div className={t("auto_hidden_lg_block_w_80_p_4_borde_8fc996")}>
            <FeaturedSection />
          </div>
        </main>
        
        {/* Mobile Navigation */}
        <div className="md:hidden">
          <MobileNav onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} />
        </div>
      </div>
    </div>;
};
export default Layout;