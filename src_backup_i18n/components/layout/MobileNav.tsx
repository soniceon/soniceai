import React from 'react';
import Link from 'next/link';
import { FiHome, FiGrid, FiSearch, FiMenu } from 'react-icons/fi';
interface MobileNavProps {
  onSidebarToggle: () => void;
}
const MobileNav = ({
  onSidebarToggle
}: MobileNavProps) => {
  return <nav className={t("auto_fixed_bottom_0_inset_x_0_bg_gr_8c2620")}>
      <div className={t("auto_grid_grid_cols_4_h_16_2737fb")}>
        <Link href="/" className={t("auto_flex_flex_col_items_center_jus_252e83")}>
          <FiHome className="h-6 w-6" />
          <span className={t("auto_text_xs_mt_1_7d7ebe")}>{t('auto_home_8cf04a')}</span>
        </Link>

        <Link href="/search" className={t("auto_flex_flex_col_items_center_jus_252e83")}>
          <FiSearch className="h-6 w-6" />
          <span className={t("auto_text_xs_mt_1_7d7ebe")}>{t('auto_search_133484')}</span>
        </Link>

        <Link href="/categories" className={t("auto_flex_flex_col_items_center_jus_252e83")}>
          <FiGrid className="h-6 w-6" />
          <span className={t("auto_text_xs_mt_1_7d7ebe")}>{t('auto_categories_af1b98')}</span>
        </Link>

        <button onClick={onSidebarToggle} className={t("auto_flex_flex_col_items_center_jus_d3d7b6")}>
          <FiMenu className="h-6 w-6" />
          <span className={t("auto_text_xs_mt_1_7d7ebe")}>{t('auto_menu_b61541')}</span>
        </button>
      </div>
    </nav>;
};
export default MobileNav;