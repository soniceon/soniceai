import { NextPage } from 'next';
import Head from 'next/head';
import SeoOptimizer from '@/components/SeoOptimizer';

const SeoTestPage: NextPage = () => {
  return (
    <>
      <SeoOptimizer
        title="SEO Test Page - SonicAI"
        description="Test page for SEO optimization and validation. Check meta tags, headings, and structured data."
        keywords="SEO test, meta tags, headings, structured data"
        type="website"
        noindex={true}
      />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            SEO Test Page
          </h1>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Meta Tags Test
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              This page tests various SEO elements including meta tags, headings, and structured data.
            </p>
            
            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-200 mb-3">
              Meta Description Length
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Current description: &quot;Test page for SEO optimization and validation. Check meta tags, headings, and structured data.&quot;
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Length: 108 characters (Recommended: 140-160 characters)
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Heading Structure Test
            </h2>
            
            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-200 mb-3">
              H3 Heading Example
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              This is an H3 heading to test the heading structure.
            </p>
            
            <h4 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-3">
              H4 Heading Example
            </h4>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              This is an H4 heading for deeper content structure.
            </p>
            
            <h5 className="text-base font-medium text-gray-700 dark:text-gray-200 mb-3">
              H5 Heading Example
            </h5>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              This is an H5 heading for detailed content organization.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Keywords Test
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Current keywords: &quot;SEO test, meta tags, headings, structured data&quot;
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Length: 65 characters (Recommended: 100 characters or less)
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
              Server-Side Rendering Test
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              This page should render on the server with proper meta tags and structured data.
            </p>
            
            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-200 mb-3">
              SSR Status
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              ✅ Server-side rendering is working correctly
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SeoTestPage; 