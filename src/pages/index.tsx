import { useState } from 'react';
import ToolGrid from '@/components/ToolGrid';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import SEO from '@/components/SEO';

export default function Home() {
  return (
    <>
      <SEO 
        title="SoniceAI - 发现最佳 AI 工具和网站"
        description="探索全面的 AI 工具集合，分类和排名，帮助您找到完美的解决方案。从聊天机器人到图像生成，从编程助手到生产力工具，发现最适合您需求的AI工具。"
        keywords="AI 工具, 人工智能, 聊天机器人, 图像生成, 编程助手, 生产力工具, 机器学习, 自然语言处理"
        ogImage="/og-image.jpg"
        ogType="website"
      />
      <ToolGrid />
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}