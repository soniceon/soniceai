import React from 'react';
import { motion } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
const HeroSection: React.FC = () => {
  const {
    t
  } = useTranslation('common');
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState('');
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };
  return <div className={t("auto_bg_gradient_to_b_from_gray_900_d56c20")}>
      <div className={t("auto_max_w_7xl_mx_auto_px_4_sm_px_6_bd7f11")}>
        <div className="text-center">
          <h1 className={t("auto_text_4xl_font_bold_sm_text_5xl_b74bd8")}>{t("auto_discover_ai_tools_12b1ad")}</h1>
          <p className={t("auto_mt_3_max_w_md_mx_auto_text_bas_e93905")}>{t("auto_find_the_perfect_ai_tools_for__448c3a")}</p>
          
          <div className={t("auto_mt_8_max_w_2xl_mx_auto_2b3ea8")}>
            <div className="relative">
              <div className={t("auto_absolute_inset_y_0_left_0_pl_3_9213ce")}>
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input type="text" className={t("auto_block_w_full_pl_10_pr_3_py_3_b_c09313")} placeholder={t('auto_search_ai_tools_f4f243')} />
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default HeroSection;