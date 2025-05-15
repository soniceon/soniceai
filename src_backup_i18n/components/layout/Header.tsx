import React from 'react';
import Link from 'next/link';
import { FiMenu, FiMoon, FiSun } from 'react-icons/fi';
import { useTheme } from 'next-themes';
interface HeaderProps {
  onMenuClick: () => void;
}
const Header = ({
  onMenuClick
}: HeaderProps) => {
  const {
    theme,
    setTheme
  } = useTheme();
  return <header className="bg-gray-900 border-b border-gray-800">
      <div className={t("auto_max_w_7xl_mx_auto_px_4_sm_px_6_bd7f11")}>
        <div className={t("auto_flex_items_center_justify_betw_45a9d6")}>
          {/* Left section */}
          <div className={t("auto_flex_items_center_e67c92")}>
            <button onClick={onMenuClick} className={t("auto_md_hidden_inline_flex_items_ce_c90e0f")}>
              <FiMenu className="h-6 w-6" />
            </button>
            <Link href="/" className={t("auto_flex_items_center_space_x_3_af9a4f")}>
              <span className={t("auto_text_xl_font_bold_text_white_7f7644")}>{t('auto_soniceai_3c5c91')}</span>
            </Link>
          </div>

          {/* Right section */}
          <div className={t("auto_flex_items_center_space_x_4_af8878")}>
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className={t("auto_inline_flex_items_center_justi_60e54a")}>
              {theme === 'dark' ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
    </header>;
};
export default Header;