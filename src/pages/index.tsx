import { useState } from 'react';
import ToolGrid from '@/components/ToolGrid';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import SEO from '@/components/SEO';

export default function Home() {
  return (
    <>
      <SEO 
        title="SoniceAI - Discover the Best AI Tools and Websites"
        description="Explore a comprehensive collection of AI tools, categorized and ranked, to help you find the perfect solution. From chatbots to image generation, from programming assistants to productivity tools, discover the AI tools that best suit your needs."
        keywords="AI tools, artificial intelligence, chatbot, image generation, coding assistant, productivity tools, machine learning, natural language processing"
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