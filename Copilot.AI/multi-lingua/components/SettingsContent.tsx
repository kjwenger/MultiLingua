'use client';

import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';

export function SettingsContent() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-200">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg transition-colors duration-200">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200"
                title="Back to main page"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
            </div>
          </div>

          <div className="px-6 py-8">
            <div className="space-y-6">
              <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Appearance</h2>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-700 dark:text-gray-300 font-medium">Theme</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Switch between light and dark mode</p>
                  </div>
                  <ThemeToggle />
                </div>
              </div>

              <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">About</h2>
                <div className="space-y-2">
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Application:</span> Multi-Lingua Translation
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Version:</span> 1.0.0
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Description:</span> A translation app with LibreTranslate integration
                  </p>
                </div>
              </div>


            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
