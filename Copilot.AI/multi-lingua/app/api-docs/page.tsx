'use client';

import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';
import { openApiSpec } from '@/lib/swagger';
import Link from 'next/link';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gray-800 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="p-2 text-gray-300 hover:text-white transition-colors"
            title="Back to main page"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <h1 className="text-xl font-bold">Multi-Lingua API Documentation</h1>
        </div>
        <Link
          href="/settings"
          className="text-gray-300 hover:text-white transition-colors"
        >
          Settings
        </Link>
      </div>
      <SwaggerUI spec={openApiSpec} />
    </div>
  );
}
