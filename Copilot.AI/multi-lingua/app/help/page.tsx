'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function HelpPage() {
  const [activeSection, setActiveSection] = useState('getting-started');

  const sections = [
    { id: 'getting-started', title: 'Getting Started' },
    { id: 'features', title: 'Features' },
    { id: 'setup-libretranslate', title: 'LibreTranslate Setup' },
    { id: 'setup-mymemory', title: 'MyMemory Setup' },
    { id: 'setup-google', title: 'Google Translate Setup' },
    { id: 'setup-deepl', title: 'DeepL Setup' },
    { id: 'setup-azure', title: 'Azure Translator Setup' },
    { id: 'usage', title: 'Using the App' },
    { id: 'api', title: 'API Reference' },
    { id: 'troubleshooting', title: 'Troubleshooting' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen sticky top-0">
          <div className="p-6">
            <Link href="/" className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              MultiLingua
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Help & Documentation</p>
          </div>
          <nav className="px-4 pb-6">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full text-left px-4 py-2 rounded-lg mb-1 transition-colors ${
                  activeSection === section.id
                    ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {section.title}
              </button>
            ))}
          </nav>
          <div className="px-4 pb-6 border-t border-gray-200 dark:border-gray-700 pt-6">
            <Link href="/" className="text-sm text-purple-600 dark:text-purple-400 hover:underline">
              ← Back to App
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 max-w-4xl">
          {activeSection === 'getting-started' && <GettingStarted />}
          {activeSection === 'features' && <Features />}
          {activeSection === 'setup-libretranslate' && <LibreTranslateSetup />}
          {activeSection === 'setup-mymemory' && <MyMemorySetup />}
          {activeSection === 'setup-google' && <GoogleSetup />}
          {activeSection === 'setup-deepl' && <DeepLSetup />}
          {activeSection === 'setup-azure' && <AzureSetup />}
          {activeSection === 'usage' && <Usage />}
          {activeSection === 'api' && <ApiReference />}
          {activeSection === 'troubleshooting' && <Troubleshooting />}
        </main>
      </div>
    </div>
  );
}

function GettingStarted() {
  return (
    <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-4">Getting Started with MultiLingua</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
        Welcome to MultiLingua - your comprehensive multi-provider translation management system.
      </p>
      
      <h2 className="text-2xl font-semibold mt-8 mb-4">What is MultiLingua?</h2>
      <p className="mb-4">
        MultiLingua is a powerful, self-hosted translation management application that allows you to translate 
        text between English, German, French, Italian, and Spanish using multiple translation providers. 
        It combines the best of free and commercial translation services with a user-friendly interface.
      </p>

      <h3 className="text-xl font-semibold mt-6 mb-3">Key Features</h3>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li><strong>Multi-Provider Support:</strong> 5 major translation providers with automatic fallback</li>
        <li><strong>Alternative Translations:</strong> Up to 10 translation suggestions per text</li>
        <li><strong>Text-to-Speech:</strong> Browser-based pronunciation for all languages</li>
        <li><strong>Persistent Storage:</strong> SQLite database for translation history</li>
        <li><strong>RESTful API:</strong> Full API access with OpenAPI/Swagger documentation</li>
        <li><strong>Docker-Ready:</strong> Complete containerized deployment with docker-compose</li>
        <li><strong>Self-Hosted:</strong> Complete privacy and control over your translation data</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Quick Start</h2>
      <ol className="list-decimal pl-6 space-y-3 mb-6">
        <li>
          <strong>Start the Application</strong>
          <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded mt-2"><code>docker compose up -d</code></pre>
        </li>
        <li>
          <strong>Access the Web Interface</strong>
          <p className="mt-2">Open your browser to <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">http://localhost:3456</code></p>
        </li>
        <li>
          <strong>Configure Providers</strong>
          <p className="mt-2">Click the settings icon (⚙️) to configure translation providers</p>
        </li>
        <li>
          <strong>Start Translating</strong>
          <p className="mt-2">Enter text in any language column and click the translate button (🔄)</p>
        </li>
      </ol>

      <h2 className="text-2xl font-semibold mt-8 mb-4">System Requirements</h2>
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold mt-0 mb-2">For Docker Deployment (Recommended)</h3>
        <ul className="list-disc pl-6 space-y-1 mb-0">
          <li>Docker Engine 20.10 or later</li>
          <li>Docker Compose v2.0 or later</li>
          <li>2GB RAM minimum (4GB recommended)</li>
          <li>Modern web browser (Chrome, Firefox, Safari, Edge)</li>
        </ul>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold mt-0 mb-2">For Local Development</h3>
        <ul className="list-disc pl-6 space-y-1 mb-0">
          <li>Node.js 18.0 or later</li>
          <li>npm 9.0 or later</li>
          <li>4GB RAM minimum</li>
        </ul>
      </div>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Architecture Overview</h2>
      <p className="mb-4">
        MultiLingua consists of three main components:
      </p>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li><strong>Next.js Web Application:</strong> React-based frontend with server-side API routes</li>
        <li><strong>LibreTranslate Service:</strong> Self-hosted open-source translation engine</li>
        <li><strong>SQLite Database:</strong> Lightweight database for storing translations</li>
      </ul>

      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mt-6">
        <h3 className="text-green-800 dark:text-green-200 mt-0 mb-2">💡 Pro Tip</h3>
        <p className="mb-0">
          Start with the default LibreTranslate provider (free, self-hosted) and add commercial providers 
          (Google, DeepL, Azure) as needed for improved translation quality or specific language pairs.
        </p>
      </div>
    </div>
  );
}

function Features() {
  return (
    <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-6">Features</h1>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Multi-Provider Translation Support</h2>
      <p className="mb-4">
        Choose from 5 professional translation providers with automatic failover. MultiLingua intelligently 
        routes requests to available providers based on your configuration priority.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">🌍 LibreTranslate</h3>
          <p className="text-sm mb-2">Free, open-source, self-hosted translation engine</p>
          <ul className="text-sm list-disc pl-5 space-y-1">
            <li>Completely free</li>
            <li>Privacy-focused (self-hosted)</li>
            <li>No API limits</li>
            <li>Included in Docker setup</li>
          </ul>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">💾 MyMemory</h3>
          <p className="text-sm mb-2">World&apos;s largest translation memory</p>
          <ul className="text-sm list-disc pl-5 space-y-1">
            <li>10,000 words/day free</li>
            <li>30,000 words/day with email</li>
            <li>No API key required</li>
            <li>Good for common phrases</li>
          </ul>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">🔵 DeepL</h3>
          <p className="text-sm mb-2">Premium quality neural translations</p>
          <ul className="text-sm list-disc pl-5 space-y-1">
            <li>500,000 chars/month free</li>
            <li>Best quality for EU languages</li>
            <li>Natural-sounding output</li>
            <li>Pro plans available</li>
          </ul>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">🔴 Google Translate</h3>
          <p className="text-sm mb-2">Industry-leading translation service</p>
          <ul className="text-sm list-disc pl-5 space-y-1">
            <li>$10/month free credit</li>
            <li>Excellent language coverage</li>
            <li>Fast and reliable</li>
            <li>Pay-as-you-go pricing</li>
          </ul>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:col-span-2">
          <h3 className="text-lg font-semibold mb-2">🔷 Azure Translator</h3>
          <p className="text-sm mb-2">Microsoft&apos;s enterprise translation service</p>
          <ul className="text-sm list-disc pl-5 space-y-1">
            <li>2 million chars/month free</li>
            <li>Enterprise-grade reliability</li>
            <li>Global availability</li>
            <li>Flexible pricing tiers</li>
          </ul>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Translation Management</h2>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li><strong>Bidirectional Translation:</strong> Translate from any language to all others</li>
        <li><strong>Alternative Suggestions:</strong> View up to 10 alternative translations per text</li>
        <li><strong>Click-to-Use Alternatives:</strong> Replace current translation with one click</li>
        <li><strong>Manual Override:</strong> Edit any translation manually</li>
        <li><strong>Persistent Storage:</strong> All translations saved to SQLite database</li>
        <li><strong>Alphabetical Sorting:</strong> Sort translations by English column</li>
        <li><strong>Bulk Operations:</strong> Add and delete multiple translation entries</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Text-to-Speech</h2>
      <p className="mb-4">
        Listen to any translation with browser-based text-to-speech using native voices for each language.
        Perfect for learning pronunciation or verifying translations sound natural.
      </p>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li>Native pronunciation for each language</li>
        <li>One-click playback from any cell</li>
        <li>Powered by browser&apos;s Web Speech API</li>
        <li>No additional setup required</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Developer Features</h2>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li><strong>RESTful API:</strong> Full CRUD operations via HTTP endpoints</li>
        <li><strong>OpenAPI/Swagger:</strong> Interactive API documentation at <code>/api-docs</code></li>
        <li><strong>Structured Logging:</strong> Color-coded logs in browser and server</li>
        <li><strong>Docker Compose:</strong> One-command deployment</li>
        <li><strong>Environment Configuration:</strong> Flexible .env configuration</li>
        <li><strong>TypeScript:</strong> Full type safety throughout codebase</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">User Interface</h2>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li><strong>Dark Mode:</strong> Automatic dark mode based on system preferences</li>
        <li><strong>Responsive Design:</strong> Works on desktop, tablet, and mobile</li>
        <li><strong>Real-time Updates:</strong> Instant UI updates without page refresh</li>
        <li><strong>Keyboard Shortcuts:</strong> Tab, Enter, Esc navigation</li>
        <li><strong>Visual Feedback:</strong> Loading states and animations</li>
        <li><strong>Provider Display:</strong> See which provider handled each translation</li>
      </ul>

      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 mt-6">
        <h3 className="text-purple-800 dark:text-purple-200 mt-0 mb-2">🚀 Coming Soon</h3>
        <ul className="list-disc pl-6 space-y-1 mb-0">
          <li>Export translations to JSON/CSV</li>
          <li>Import existing translation files</li>
          <li>Translation history and versioning</li>
          <li>Custom terminology/glossaries</li>
          <li>Batch translation upload</li>
        </ul>
      </div>
    </div>
  );
}

function LibreTranslateSetup() {
  return (
    <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-6">LibreTranslate Setup</h1>
      
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
        <h3 className="text-green-800 dark:text-green-200 mt-0 mb-2">✅ Already Configured!</h3>
        <p className="mb-0">
          LibreTranslate is included and pre-configured in the Docker Compose setup. It starts automatically 
          when you run <code>docker compose up -d</code>.
        </p>
      </div>

      <h2 className="text-2xl font-semibold mt-8 mb-4">What is LibreTranslate?</h2>
      <p className="mb-4">
        LibreTranslate is a free and open-source machine translation API that you can self-host. It provides 
        translation capabilities without requiring API keys, internet connectivity (after model download), or 
        paying per-character fees.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Default Configuration</h2>
      <p className="mb-4">
        The MultiLingua Docker Compose setup includes LibreTranslate with the following configuration:
      </p>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li><strong>Service Port:</strong> 5432 (mapped to container port 5000)</li>
        <li><strong>From App Container:</strong> <code>http://libretranslate:5000</code></li>
        <li><strong>From Host Machine:</strong> <code>http://localhost:5432</code></li>
        <li><strong>Data Persistence:</strong> Docker volume <code>lt-local</code></li>
        <li><strong>No API Key Required:</strong> Self-hosted instance</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">First Startup</h2>
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
        <h3 className="text-yellow-800 dark:text-yellow-200 mt-0 mb-2">⏱️ Initial Setup Time</h3>
        <p className="mb-2">
          On first startup, LibreTranslate downloads translation models for all language pairs. This can take:
        </p>
        <ul className="list-disc pl-6 space-y-1 mb-0">
          <li><strong>5-10 minutes</strong> on fast internet connections</li>
          <li><strong>Up to 30 minutes</strong> on slower connections</li>
          <li><strong>~2-3 GB</strong> total download size</li>
        </ul>
      </div>

      <p className="mb-4">Monitor the download progress:</p>
      <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded mb-6"><code>docker compose logs -f libretranslate</code></pre>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Using an External LibreTranslate Instance</h2>
      <p className="mb-4">
        If you want to use a different LibreTranslate instance (e.g., the official public API or another 
        self-hosted instance):
      </p>
      <ol className="list-decimal pl-6 space-y-3 mb-6">
        <li>Open MultiLingua and click the Settings icon (⚙️)</li>
        <li>Find the LibreTranslate section</li>
        <li>Enter the API URL:
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Official API: <code>https://libretranslate.com</code></li>
            <li>Custom instance: <code>https://your-instance.com</code></li>
          </ul>
        </li>
        <li>If the instance requires an API key, enter it</li>
        <li>Click &quot;Save Settings&quot;</li>
      </ol>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Advantages of Self-Hosting</h2>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li><strong>Privacy:</strong> All translations happen locally - no data sent to third parties</li>
        <li><strong>No Costs:</strong> Unlimited translations without per-character fees</li>
        <li><strong>No Rate Limits:</strong> Translate as much as you want</li>
        <li><strong>Offline Capable:</strong> Works without internet (after initial model download)</li>
        <li><strong>Full Control:</strong> Configure and customize as needed</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Limitations</h2>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li><strong>Translation Quality:</strong> Good but not as high as DeepL or Google for some language pairs</li>
        <li><strong>Speed:</strong> Slower than cloud services, especially on first request (model loading)</li>
        <li><strong>Resource Usage:</strong> Requires ~2GB disk space and significant RAM during operation</li>
        <li><strong>Updates:</strong> Manual updates required for improved models</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Troubleshooting</h2>
      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4">
        <h3 className="text-lg font-semibold mt-0 mb-2">Container Not Starting</h3>
        <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded text-sm mb-2"><code>docker compose ps
docker compose logs libretranslate</code></pre>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4">
        <h3 className="text-lg font-semibold mt-0 mb-2">Translations Timeout</h3>
        <p className="mb-2">Wait for initial model download to complete. Check logs:</p>
        <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded text-sm mb-0"><code>docker compose logs -f libretranslate | grep -i "download"</code></pre>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold mt-0 mb-2">Reset/Clean Install</h3>
        <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded text-sm mb-0"><code>docker compose down
docker volume rm lt-local
docker compose up -d</code></pre>
      </div>
    </div>
  );
}

function MyMemorySetup() {
  return (
    <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-6">MyMemory Setup</h1>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <h3 className="text-blue-800 dark:text-blue-200 mt-0 mb-2">🆓 Completely Free</h3>
        <p className="mb-0">
          MyMemory is a free translation service powered by the world&apos;s largest translation memory. 
          No registration, no credit card, no API key required.
        </p>
      </div>

      <h2 className="text-2xl font-semibold mt-8 mb-4">What is MyMemory?</h2>
      <p className="mb-4">
        MyMemory is the world&apos;s largest collaborative translation memory, containing over 10 billion 
        translated segments. It combines human translations with machine translation to provide high-quality 
        results for common phrases and sentences.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Quick Setup (No Email)</h2>
      <ol className="list-decimal pl-6 space-y-3 mb-6">
        <li>Open MultiLingua and click the Settings icon (⚙️)</li>
        <li>Find the MyMemory section</li>
        <li>Toggle the switch to enable MyMemory</li>
        <li>Click &quot;Save Settings&quot;</li>
      </ol>
      <p className="mb-4">
        <strong>Daily Limit:</strong> 10,000 words per day
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Increased Quota Setup (With Email)</h2>
      <p className="mb-4">
        To triple your daily quota from 10,000 to 30,000 words, simply add your email address:
      </p>
      <ol className="list-decimal pl-6 space-y-3 mb-6">
        <li>Open MultiLingua Settings (⚙️)</li>
        <li>Find the MyMemory section</li>
        <li>Enter your email address in the &quot;Email&quot; field</li>
        <li>Toggle the switch to enable MyMemory</li>
        <li>Click &quot;Save Settings&quot;</li>
      </ol>

      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
        <h3 className="text-green-800 dark:text-green-200 mt-0 mb-2">📧 Why Email?</h3>
        <p className="mb-0">
          MyMemory uses your email only to identify your requests and provide the higher quota. 
          No verification required, no spam, no marketing emails.
        </p>
      </div>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Alternative: Environment Variable</h2>
      <p className="mb-4">You can also configure the email via environment variable:</p>
      <ol className="list-decimal pl-6 space-y-3 mb-6">
        <li>Edit the <code>.env.local</code> file in your MultiLingua directory</li>
        <li>Add or update the line:
          <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded mt-2 mb-2"><code>MYMEMORY_EMAIL=your-email@example.com</code></pre>
        </li>
        <li>Restart the application:
          <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded mt-2 mb-2"><code>docker compose restart multi-lingua</code></pre>
        </li>
      </ol>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Pricing & Limits</h2>
      <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-700 mb-6">
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            <th className="border border-gray-300 dark:border-gray-700 p-2">Tier</th>
            <th className="border border-gray-300 dark:border-gray-700 p-2">Daily Limit</th>
            <th className="border border-gray-300 dark:border-gray-700 p-2">Cost</th>
            <th className="border border-gray-300 dark:border-gray-700 p-2">Requirements</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 dark:border-gray-700 p-2">Anonymous</td>
            <td className="border border-gray-300 dark:border-gray-700 p-2">10,000 words</td>
            <td className="border border-gray-300 dark:border-gray-700 p-2">Free</td>
            <td className="border border-gray-300 dark:border-gray-700 p-2">None</td>
          </tr>
          <tr>
            <td className="border border-gray-300 dark:border-gray-700 p-2">With Email</td>
            <td className="border border-gray-300 dark:border-gray-700 p-2">30,000 words</td>
            <td className="border border-gray-300 dark:border-gray-700 p-2">Free</td>
            <td className="border border-gray-300 dark:border-gray-700 p-2">Email address</td>
          </tr>
        </tbody>
      </table>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Advantages</h2>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li><strong>Completely Free:</strong> No credit card or payment required</li>
        <li><strong>No API Key:</strong> Simplest setup of all providers</li>
        <li><strong>Good for Common Phrases:</strong> Leverages human translation memory</li>
        <li><strong>Generous Quota:</strong> 30,000 words/day is sufficient for most personal use</li>
        <li><strong>No Registration:</strong> Just provide an email for higher quota</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Limitations</h2>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li><strong>Variable Quality:</strong> Quality depends on available translation memory matches</li>
        <li><strong>Daily Limits:</strong> Resets every 24 hours</li>
        <li><strong>No Control:</strong> Cannot self-host or customize</li>
        <li><strong>Rate Limiting:</strong> May throttle requests during high usage</li>
      </ul>

      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 mt-6">
        <h3 className="text-purple-800 dark:text-purple-200 mt-0 mb-2">💡 Best Use Cases</h3>
        <ul className="list-disc pl-6 space-y-1 mb-0">
          <li>Personal projects with moderate translation needs</li>
          <li>Backup provider when LibreTranslate is slow</li>
          <li>Testing and development</li>
          <li>Common phrases and sentences (better matches in translation memory)</li>
        </ul>
      </div>
    </div>
  );
}

function GoogleSetup() {
  return (
    <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-6">Google Translate API Setup</h1>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <h3 className="text-blue-800 dark:text-blue-200 mt-0 mb-2">📚 Official Documentation</h3>
        <p className="mb-2">This guide is based on:</p>
        <ul className="list-disc pl-6 space-y-1 mb-0">
          <li>
            <a 
              href="https://translatepress.com/docs/automatic-translation/generate-google-api-key/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              TranslatePress: Generate Google API Key Guide
            </a>
          </li>
          <li>
            <a 
              href="https://console.cloud.google.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Google Cloud Console
            </a>
          </li>
        </ul>
      </div>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Overview</h2>
      <p className="mb-4">
        Google Translate API offers high-quality, fast translations powered by Google&apos;s neural machine 
        translation technology. It supports over 100 languages and provides excellent accuracy for most 
        language pairs.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Step 1: Create a Google Cloud Project</h2>
      <ol className="list-decimal pl-6 space-y-3 mb-6">
        <li>
          Go to the{' '}
          <a 
            href="https://console.cloud.google.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Google Cloud Console
          </a>
        </li>
        <li>Sign in with your Google account</li>
        <li>Click on the project dropdown at the top of the page</li>
        <li>Click <strong>&quot;New Project&quot;</strong></li>
        <li>Enter a project name (e.g., &quot;MultiLingua Translations&quot;)</li>
        <li>Click <strong>&quot;Create&quot;</strong></li>
        <li>Wait for the project to be created (usually takes a few seconds)</li>
      </ol>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Step 2: Enable the Cloud Translation API</h2>
      <ol className="list-decimal pl-6 space-y-3 mb-6">
        <li>Make sure your new project is selected in the project dropdown</li>
        <li>In the left sidebar, go to <strong>&quot;APIs & Services&quot;</strong> → <strong>&quot;Library&quot;</strong></li>
        <li>In the search box, type <strong>&quot;Cloud Translation API&quot;</strong></li>
        <li>Click on <strong>&quot;Cloud Translation API&quot;</strong> from the results</li>
        <li>Click the <strong>&quot;Enable&quot;</strong> button</li>
        <li>Wait for the API to be enabled</li>
      </ol>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Step 3: Create API Credentials</h2>
      <ol className="list-decimal pl-6 space-y-3 mb-6">
        <li>Go to <strong>&quot;APIs & Services&quot;</strong> → <strong>&quot;Credentials&quot;</strong></li>
        <li>Click <strong>&quot;Create Credentials&quot;</strong> at the top</li>
        <li>Select <strong>&quot;API key&quot;</strong> from the dropdown</li>
        <li>Your API key will be created and displayed in a popup</li>
        <li><strong>Copy the API key</strong> immediately and store it securely</li>
      </ol>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
        <h3 className="text-yellow-800 dark:text-yellow-200 mt-0 mb-2">⚠️ Important: Restrict Your API Key</h3>
        <p className="mb-2">
          <strong>Never use an unrestricted API key in production!</strong> Always restrict your key to prevent 
          unauthorized use and unexpected charges.
        </p>
      </div>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Step 4: Restrict the API Key (Recommended)</h2>
      <ol className="list-decimal pl-6 space-y-3 mb-6">
        <li>In the API key popup, click <strong>&quot;Edit API key&quot;</strong> (or find your key in the Credentials list)</li>
        <li>Under <strong>&quot;API restrictions&quot;</strong>, select <strong>&quot;Restrict key&quot;</strong></li>
        <li>From the dropdown, select <strong>&quot;Cloud Translation API&quot;</strong></li>
        <li>Optionally, under <strong>&quot;Application restrictions&quot;</strong>:
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li><strong>IP addresses:</strong> Restrict to your server&apos;s IP</li>
            <li><strong>HTTP referrers:</strong> Restrict to your domain</li>
          </ul>
        </li>
        <li>Click <strong>&quot;Save&quot;</strong></li>
      </ol>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Step 5: Enable Billing</h2>
      <p className="mb-4">
        Google Cloud Translation API requires billing to be enabled, but don&apos;t worry - there&apos;s a generous free tier!
      </p>
      <ol className="list-decimal pl-6 space-y-3 mb-6">
        <li>Go to <strong>&quot;Billing&quot;</strong> in the left sidebar</li>
        <li>Click <strong>&quot;Link a billing account&quot;</strong></li>
        <li>Either select an existing billing account or create a new one</li>
        <li>Enter your payment information (required even for free tier)</li>
        <li>Click <strong>&quot;Set account&quot;</strong></li>
      </ol>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Step 6: Configure MultiLingua</h2>
      <ol className="list-decimal pl-6 space-y-3 mb-6">
        <li>Open MultiLingua in your browser</li>
        <li>Click the Settings icon (⚙️) in the top-right corner</li>
        <li>Scroll to the <strong>&quot;Google Translate&quot;</strong> section</li>
        <li>Paste your API key in the <strong>&quot;API Key&quot;</strong> field</li>
        <li>Toggle the switch to <strong>enable</strong> Google Translate</li>
        <li>Click <strong>&quot;Save Settings&quot;</strong></li>
      </ol>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Pricing (as of 2024)</h2>
      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold mt-0 mb-3">Free Tier</h3>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li><strong>$300 credit</strong> for new Google Cloud accounts (90-day trial)</li>
          <li><strong>$10/month</strong> free credit for Cloud Translation API (≈500,000 characters)</li>
          <li>No charges until you exceed free tier limits</li>
        </ul>

        <h3 className="text-lg font-semibold mt-4 mb-3">Paid Tier (Pay-as-you-go)</h3>
        <ul className="list-disc pl-6 space-y-2 mb-0">
          <li><strong>Standard Edition:</strong> $20 per million characters</li>
          <li><strong>Advanced Edition:</strong> $30 per million characters (with custom models)</li>
          <li>Billed monthly based on usage</li>
        </ul>
      </div>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Monitoring Usage</h2>
      <p className="mb-4">To monitor your API usage and costs:</p>
      <ol className="list-decimal pl-6 space-y-2 mb-6">
        <li>Go to <strong>&quot;APIs & Services&quot;</strong> → <strong>&quot;Dashboard&quot;</strong></li>
        <li>Click on <strong>&quot;Cloud Translation API&quot;</strong></li>
        <li>View your usage metrics and quotas</li>
        <li>Set up billing alerts in <strong>&quot;Billing&quot;</strong> → <strong>&quot;Budgets & alerts&quot;</strong></li>
      </ol>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Advantages</h2>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li><strong>High Quality:</strong> Powered by Google&apos;s neural machine translation</li>
        <li><strong>Fast:</strong> Low latency, global infrastructure</li>
        <li><strong>Reliable:</strong> 99.95% uptime SLA for paid tier</li>
        <li><strong>Generous Free Tier:</strong> $10/month free credit</li>
        <li><strong>Wide Language Support:</strong> 100+ languages</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Limitations</h2>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li><strong>Billing Required:</strong> Must have payment method on file</li>
        <li><strong>Costs:</strong> Can become expensive for high-volume usage</li>
        <li><strong>Data Privacy:</strong> Translations processed by Google servers</li>
        <li><strong>Rate Limits:</strong> Default quota limits apply (can request increases)</li>
      </ul>

      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mt-6">
        <h3 className="text-green-800 dark:text-green-200 mt-0 mb-2">💡 Pro Tips</h3>
        <ul className="list-disc pl-6 space-y-1 mb-0">
          <li>Set up billing alerts to avoid unexpected charges</li>
          <li>Always restrict your API key to prevent unauthorized use</li>
          <li>Use the free tier for development and testing</li>
          <li>Consider using a separate project for production vs. development</li>
          <li>Monitor your usage regularly in the Google Cloud Console</li>
        </ul>
      </div>
    </div>
  );
}

function DeepLSetup() {
  return (
    <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-6">DeepL API Setup</h1>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <h3 className="text-blue-800 dark:text-blue-200 mt-0 mb-2">📚 Official Documentation</h3>
        <p className="mb-2">This guide is based on:</p>
        <ul className="list-disc pl-6 space-y-1 mb-0">
          <li>
            <a 
              href="https://support.deepl.com/hc/en-us/articles/360020695820-API-key-for-DeepL-API" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              DeepL Support: API Key Guide
            </a>
          </li>
          <li>
            <a 
              href="https://www.deepl.com/pro-api" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              DeepL API Official Page
            </a>
          </li>
        </ul>
      </div>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Overview</h2>
      <p className="mb-4">
        DeepL is renowned for producing the most natural-sounding translations, especially for European languages. 
        Many translators and language professionals prefer DeepL for its nuanced understanding of context and 
        idiomatic expressions.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Step 1: Choose Your Plan</h2>
      <p className="mb-4">DeepL offers two API tiers:</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">🆓 DeepL API Free</h3>
          <ul className="text-sm list-disc pl-5 space-y-1 mb-3">
            <li>500,000 characters/month</li>
            <li>Completely free forever</li>
            <li>No credit card required</li>
            <li>Perfect for personal projects</li>
          </ul>
          <a 
            href="https://www.deepl.com/pro-api?cta=header-pro-api/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
          >
            Sign up for Free →
          </a>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">💼 DeepL API Pro</h3>
          <ul className="text-sm list-disc pl-5 space-y-1 mb-3">
            <li>Pay-as-you-go or subscription</li>
            <li>€20/million characters</li>
            <li>Volume discounts available</li>
            <li>Priority support</li>
          </ul>
          <a 
            href="https://www.deepl.com/pro-api" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
          >
            View Pro Plans →
          </a>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Step 2: Create a DeepL Account</h2>
      <ol className="list-decimal pl-6 space-y-3 mb-6">
        <li>
          Go to the{' '}
          <a 
            href="https://www.deepl.com/pro-api" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            DeepL API page
          </a>
        </li>
        <li>Click <strong>&quot;Sign up for free&quot;</strong> or choose a Pro plan</li>
        <li>Enter your email address and create a password</li>
        <li>Verify your email address by clicking the link sent to your inbox</li>
        <li>Complete your profile information</li>
        <li>For the Free API, no payment method is required</li>
        <li>For Pro API, you&apos;ll need to add payment information</li>
      </ol>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Step 3: Get Your API Key</h2>
      <ol className="list-decimal pl-6 space-y-3 mb-6">
        <li>
          Log in to your{' '}
          <a 
            href="https://www.deepl.com/account" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            DeepL Account
          </a>
        </li>
        <li>Click on your name in the top-right corner</li>
        <li>Go to <strong>&quot;Account&quot;</strong></li>
        <li>Scroll down to the <strong>&quot;Authentication Key for DeepL API&quot;</strong> section</li>
        <li>Your API key will be displayed (or click <strong>&quot;Create new key&quot;</strong> if needed)</li>
        <li><strong>Copy the authentication key</strong> - you&apos;ll need it for MultiLingua</li>
      </ol>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
        <h3 className="text-yellow-800 dark:text-yellow-200 mt-0 mb-2">⚠️ Important: API Type Matters!</h3>
        <p className="mb-2">
          DeepL Free and Pro API keys use <strong>different endpoints</strong>:
        </p>
        <ul className="list-disc pl-6 space-y-1 mb-0">
          <li><strong>Free API:</strong> api-free.deepl.com</li>
          <li><strong>Pro API:</strong> api.deepl.com</li>
        </ul>
        <p className="mt-2 mb-0">
          Using the wrong endpoint will result in authentication errors!
        </p>
      </div>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Step 4: Configure MultiLingua</h2>
      <ol className="list-decimal pl-6 space-y-3 mb-6">
        <li>Open MultiLingua in your browser</li>
        <li>Click the Settings icon (⚙️) in the top-right corner</li>
        <li>Scroll to the <strong>&quot;DeepL&quot;</strong> section</li>
        <li>Paste your API key in the <strong>&quot;API Key&quot;</strong> field</li>
        <li><strong>Important:</strong> Select the correct API type:
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>If you signed up for <strong>DeepL API Free</strong>, MultiLingua will use api-free.deepl.com</li>
            <li>If you have <strong>DeepL API Pro</strong>, MultiLingua will use api.deepl.com</li>
          </ul>
        </li>
        <li>Toggle the switch to <strong>enable</strong> DeepL</li>
        <li>Click <strong>&quot;Save Settings&quot;</strong></li>
      </ol>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Pricing Details</h2>
      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold mt-0 mb-3">DeepL API Free</h3>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li><strong>500,000 characters/month</strong> completely free</li>
          <li>No credit card required</li>
          <li>No expiration date</li>
          <li>Same translation quality as Pro</li>
          <li>Perfect for individual developers and small projects</li>
        </ul>

        <h3 className="text-lg font-semibold mt-4 mb-3">DeepL API Pro (Pay-as-you-go)</h3>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li><strong>Starter:</strong> €4.99/month + €20 per million characters</li>
          <li><strong>Advanced:</strong> €29.99/month + €15 per million characters</li>
          <li><strong>Ultimate:</strong> €89.99/month + €10 per million characters</li>
          <li>Volume discounts for higher usage</li>
        </ul>

        <h3 className="text-lg font-semibold mt-4 mb-3">Character Counting</h3>
        <ul className="list-disc pl-6 space-y-1 mb-0">
          <li>Only source text is counted (not translations)</li>
          <li>Whitespace and special characters count</li>
          <li>HTML tags are counted</li>
        </ul>
      </div>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Monitoring Usage</h2>
      <ol className="list-decimal pl-6 space-y-2 mb-6">
        <li>Log in to your <a href="https://www.deepl.com/account" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">DeepL Account</a></li>
        <li>Go to <strong>&quot;Account&quot;</strong> → <strong>&quot;Usage&quot;</strong></li>
        <li>View your current usage and remaining quota</li>
        <li>Monitor historical usage patterns</li>
        <li>Set up email notifications for usage thresholds</li>
      </ol>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Supported Languages</h2>
      <p className="mb-4">
        DeepL supports all languages used in MultiLingua with exceptional quality:
      </p>
      <ul className="list-disc pl-6 space-y-1 mb-6">
        <li><strong>English</strong> - British and American variants</li>
        <li><strong>German</strong> - Excellent quality (DeepL is German-based)</li>
        <li><strong>French</strong> - Very high quality</li>
        <li><strong>Italian</strong> - Very high quality</li>
        <li><strong>Spanish</strong> - Very high quality</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Advantages</h2>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li><strong>Best Quality:</strong> Widely regarded as producing the most natural translations</li>
        <li><strong>Context-Aware:</strong> Excellent at understanding nuance and idioms</li>
        <li><strong>Generous Free Tier:</strong> 500,000 characters/month is very generous</li>
        <li><strong>No Credit Card for Free:</strong> Easy to get started</li>
        <li><strong>European Languages:</strong> Exceptional quality for EU language pairs</li>
        <li><strong>Fast:</strong> Low latency with global infrastructure</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Limitations</h2>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li><strong>Language Coverage:</strong> Fewer languages than Google (but high quality for supported ones)</li>
        <li><strong>Free Tier Limit:</strong> 500K chars/month may not be enough for heavy users</li>
        <li><strong>Pro Costs:</strong> Can be expensive for very high volumes</li>
        <li><strong>API Type Confusion:</strong> Must use correct endpoint for Free vs Pro</li>
      </ul>

      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 mt-6">
        <h3 className="text-purple-800 dark:text-purple-200 mt-0 mb-2">✨ Why Choose DeepL?</h3>
        <p className="mb-2">
          DeepL is the best choice if you prioritize <strong>translation quality over cost</strong>. 
          It&apos;s particularly excellent for:
        </p>
        <ul className="list-disc pl-6 space-y-1 mb-0">
          <li>Professional translations that will be read by humans</li>
          <li>European language pairs (especially German, French, Spanish, Italian)</li>
          <li>Content where natural language and context matter</li>
          <li>Marketing materials, customer-facing content, documentation</li>
          <li>Projects where the free tier limit (500K chars/month) is sufficient</li>
        </ul>
      </div>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Troubleshooting</h2>
      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4">
        <h3 className="text-lg font-semibold mt-0 mb-2">Authentication Error 403</h3>
        <p className="mb-2"><strong>Problem:</strong> &quot;Authorization failed&quot; or &quot;Invalid authentication key&quot;</p>
        <p className="mb-2"><strong>Solution:</strong></p>
        <ul className="list-disc pl-6 space-y-1 mb-0">
          <li>Verify you&apos;re using the correct API key from your DeepL account</li>
          <li>Check if you&apos;re using Free or Pro API - they have different endpoints</li>
          <li>Remove any extra spaces when copying/pasting the key</li>
        </ul>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4">
        <h3 className="text-lg font-semibold mt-0 mb-2">Quota Exceeded Error 456</h3>
        <p className="mb-2"><strong>Problem:</strong> &quot;Quota exceeded&quot;</p>
        <p className="mb-2"><strong>Solution:</strong></p>
        <ul className="list-disc pl-6 space-y-1 mb-0">
          <li>Check your usage in the DeepL Account dashboard</li>
          <li>Wait until next month for Free tier reset</li>
          <li>Upgrade to Pro for higher limits</li>
          <li>Consider using an alternative provider temporarily</li>
        </ul>
      </div>
    </div>
  );
}

function AzureSetup() {
  return (
    <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-6">Azure Translator Setup</h1>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <h3 className="text-blue-800 dark:text-blue-200 mt-0 mb-2">📚 Official Documentation</h3>
        <p className="mb-2">This guide is based on:</p>
        <ul className="list-disc pl-6 space-y-1 mb-0">
          <li>
            <a 
              href="https://medium.com/data-science/how-to-integrate-the-microsoft-translator-api-in-your-code-89bad979028e" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Medium: Microsoft Translator API Integration Guide
            </a>
          </li>
          <li>
            <a 
              href="https://azure.microsoft.com/en-us/services/cognitive-services/translator/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Azure Translator Official Page
            </a>
          </li>
          <li>
            <a 
              href="https://portal.azure.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Azure Portal
            </a>
          </li>
        </ul>
      </div>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Overview</h2>
      <p className="mb-4">
        Azure Translator is Microsoft&apos;s cloud-based neural machine translation service, offering enterprise-grade 
        reliability, security, and scalability. It&apos;s particularly well-suited for business applications requiring 
        high availability and compliance.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Step 1: Create an Azure Account</h2>
      <ol className="list-decimal pl-6 space-y-3 mb-6">
        <li>
          Go to{' '}
          <a 
            href="https://azure.microsoft.com/free/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Azure Free Account
          </a>
        </li>
        <li>Click <strong>&quot;Start free&quot;</strong></li>
        <li>Sign in with your Microsoft account (or create one)</li>
        <li>Provide your phone number for verification</li>
        <li>Enter your credit card details (required even for free tier - won&apos;t be charged unless you upgrade)</li>
        <li>Complete identity verification</li>
        <li>Click <strong>&quot;Sign up&quot;</strong></li>
      </ol>

      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
        <h3 className="text-green-800 dark:text-green-200 mt-0 mb-2">🎁 Free Tier Benefits</h3>
        <ul className="list-disc pl-6 space-y-1 mb-0">
          <li><strong>$200 credit</strong> valid for 30 days</li>
          <li><strong>12 months</strong> of popular free services</li>
          <li><strong>2 million characters/month</strong> free for Translator (always free)</li>
          <li>No automatic charges - you must explicitly upgrade</li>
        </ul>
      </div>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Step 2: Create a Translator Resource</h2>
      <ol className="list-decimal pl-6 space-y-3 mb-6">
        <li>
          Log in to the{' '}
          <a 
            href="https://portal.azure.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Azure Portal
          </a>
        </li>
        <li>Click <strong>&quot;Create a resource&quot;</strong> (+ icon in the top-left)</li>
        <li>Search for <strong>&quot;Translator&quot;</strong> in the marketplace</li>
        <li>Select <strong>&quot;Translator&quot;</strong> from the results</li>
        <li>Click <strong>&quot;Create&quot;</strong></li>
        <li>Fill in the resource details:
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li><strong>Subscription:</strong> Select your Azure subscription</li>
            <li><strong>Resource group:</strong> Create new (e.g., &quot;multilingu-resources&quot;) or select existing</li>
            <li><strong>Region:</strong> Choose a region close to you (e.g., East US, West Europe)</li>
            <li><strong>Name:</strong> Enter a unique name (e.g., &quot;multilingua-translator&quot;)</li>
            <li><strong>Pricing tier:</strong> Select <strong>&quot;Free F0&quot;</strong> (2M chars/month) or <strong>&quot;Standard S1&quot;</strong> (pay-as-you-go)</li>
          </ul>
        </li>
        <li>Click <strong>&quot;Review + create&quot;</strong></li>
        <li>Review your settings and click <strong>&quot;Create&quot;</strong></li>
        <li>Wait for deployment to complete (usually 1-2 minutes)</li>
      </ol>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Step 3: Get Your API Key and Region</h2>
      <ol className="list-decimal pl-6 space-y-3 mb-6">
        <li>Once deployment is complete, click <strong>&quot;Go to resource&quot;</strong></li>
        <li>In the left sidebar, click <strong>&quot;Keys and Endpoint&quot;</strong> under Resource Management</li>
        <li>You&apos;ll see two items you need:
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li><strong>KEY 1</strong> or <strong>KEY 2</strong> - Copy either one (both work the same)</li>
            <li><strong>Location/Region</strong> - Note this value (e.g., &quot;eastus&quot;, &quot;westeurope&quot;)</li>
          </ul>
        </li>
        <li>Store both the key and region securely - you&apos;ll need both for MultiLingua</li>
      </ol>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
        <h3 className="text-yellow-800 dark:text-yellow-200 mt-0 mb-2">⚠️ Important: Region Required!</h3>
        <p className="mb-0">
          Unlike other APIs, Azure Translator requires <strong>both an API key AND a region</strong>. 
          Make sure to note the region where you created your resource - you&apos;ll need it in MultiLingua settings.
        </p>
      </div>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Step 4: Configure MultiLingua</h2>
      <ol className="list-decimal pl-6 space-y-3 mb-6">
        <li>Open MultiLingua in your browser</li>
        <li>Click the Settings icon (⚙️) in the top-right corner</li>
        <li>Scroll to the <strong>&quot;Azure Translator&quot;</strong> section</li>
        <li>Paste your API key in the <strong>&quot;API Key&quot;</strong> field</li>
        <li>Enter your region in the <strong>&quot;Region&quot;</strong> field (e.g., &quot;eastus&quot;, &quot;westeurope&quot;)</li>
        <li>Toggle the switch to <strong>enable</strong> Azure Translator</li>
        <li>Click <strong>&quot;Save Settings&quot;</strong></li>
      </ol>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Common Azure Regions</h2>
      <p className="mb-4">Choose a region close to your users for better performance:</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Americas</h3>
          <ul className="list-disc pl-6 space-y-1 text-sm">
            <li><code>eastus</code> - East US (Virginia)</li>
            <li><code>eastus2</code> - East US 2 (Virginia)</li>
            <li><code>westus</code> - West US (California)</li>
            <li><code>westus2</code> - West US 2 (Washington)</li>
            <li><code>centralus</code> - Central US (Iowa)</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Europe</h3>
          <ul className="list-disc pl-6 space-y-1 text-sm">
            <li><code>westeurope</code> - West Europe (Netherlands)</li>
            <li><code>northeurope</code> - North Europe (Ireland)</li>
            <li><code>uksouth</code> - UK South (London)</li>
            <li><code>francecentral</code> - France Central (Paris)</li>
            <li><code>germanywestcentral</code> - Germany West Central</li>
          </ul>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Pricing (as of 2024)</h2>
      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold mt-0 mb-3">Free Tier (F0)</h3>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li><strong>2 million characters/month</strong> - Always free</li>
          <li>Text Translation included</li>
          <li>No credit card charged</li>
          <li>Perfect for personal projects and testing</li>
        </ul>

        <h3 className="text-lg font-semibold mt-4 mb-3">Standard Tier (S1)</h3>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li><strong>$10 per million characters</strong> for Text Translation</li>
          <li>Pay only for what you use</li>
          <li>No monthly commitment</li>
          <li>Volume discounts available for higher tiers</li>
        </ul>

        <h3 className="text-lg font-semibold mt-4 mb-3">Character Counting</h3>
        <ul className="list-disc pl-6 space-y-1 mb-0">
          <li>Spaces, punctuation, and special characters count</li>
          <li>Only source text is counted (not translation output)</li>
          <li>Minimum charge: 1 character</li>
        </ul>
      </div>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Monitoring Usage</h2>
      <ol className="list-decimal pl-6 space-y-2 mb-6">
        <li>Log in to the <a href="https://portal.azure.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Azure Portal</a></li>
        <li>Navigate to your Translator resource</li>
        <li>Click <strong>&quot;Metrics&quot;</strong> in the left sidebar</li>
        <li>View real-time usage charts</li>
        <li>Set up alerts in <strong>&quot;Alerts&quot;</strong> to monitor spending</li>
        <li>Check detailed billing in <strong>&quot;Cost Management + Billing&quot;</strong></li>
      </ol>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Advantages</h2>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li><strong>Generous Free Tier:</strong> 2 million chars/month is very generous</li>
        <li><strong>Enterprise-Grade:</strong> 99.9% uptime SLA</li>
        <li><strong>Global Infrastructure:</strong> Available in 60+ regions worldwide</li>
        <li><strong>Compliance:</strong> SOC, ISO, HIPAA, and other certifications</li>
        <li><strong>Microsoft Ecosystem:</strong> Integrates well with other Azure services</li>
        <li><strong>Customization:</strong> Support for custom translation models (higher tiers)</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Limitations</h2>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li><strong>Credit Card Required:</strong> Even for free tier</li>
        <li><strong>Region Dependency:</strong> Must configure correct region with API key</li>
        <li><strong>Azure Portal Complexity:</strong> Steeper learning curve than simpler APIs</li>
        <li><strong>Paid Tier Costs:</strong> $10/million can add up for high volume</li>
      </ul>

      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 mt-6">
        <h3 className="text-purple-800 dark:text-purple-200 mt-0 mb-2">🏢 Best Use Cases</h3>
        <p className="mb-2">Azure Translator is ideal for:</p>
        <ul className="list-disc pl-6 space-y-1 mb-0">
          <li>Business applications requiring enterprise SLAs</li>
          <li>Projects already using Azure infrastructure</li>
          <li>Applications needing compliance certifications</li>
          <li>Global applications with users in multiple regions</li>
          <li>High-availability requirements (99.9% uptime)</li>
          <li>Projects benefiting from the generous 2M chars/month free tier</li>
        </ul>
      </div>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Troubleshooting</h2>
      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4">
        <h3 className="text-lg font-semibold mt-0 mb-2">Authentication Error 401</h3>
        <p className="mb-2"><strong>Problem:</strong> &quot;Access denied&quot; or &quot;Invalid credentials&quot;</p>
        <p className="mb-2"><strong>Solution:</strong></p>
        <ul className="list-disc pl-6 space-y-1 mb-0">
          <li>Verify your API key is correct (no extra spaces)</li>
          <li>Ensure the Translator resource is active in Azure Portal</li>
          <li>Check that you&apos;ve selected the correct subscription</li>
        </ul>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4">
        <h3 className="text-lg font-semibold mt-0 mb-2">Invalid Region Error</h3>
        <p className="mb-2"><strong>Problem:</strong> &quot;Invalid region&quot; or &quot;Resource not found&quot;</p>
        <p className="mb-2"><strong>Solution:</strong></p>
        <ul className="list-disc pl-6 space-y-1 mb-0">
          <li>Region must match where you created the Translator resource</li>
          <li>Check region in Azure Portal under &quot;Keys and Endpoint&quot;</li>
          <li>Use lowercase region code (e.g., &quot;eastus&quot; not &quot;East US&quot;)</li>
        </ul>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4">
        <h3 className="text-lg font-semibold mt-0 mb-2">Quota Exceeded</h3>
        <p className="mb-2"><strong>Problem:</strong> &quot;Quota exceeded&quot; on free tier</p>
        <p className="mb-2"><strong>Solution:</strong></p>
        <ul className="list-disc pl-6 space-y-1 mb-0">
          <li>Check usage in Azure Portal Metrics</li>
          <li>Wait until next month for quota reset</li>
          <li>Upgrade to Standard (S1) tier for pay-as-you-go</li>
          <li>Use an alternative provider temporarily</li>
        </ul>
      </div>
    </div>
  );
}

function Usage() {
  return <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200"><h1>Using MultiLingua - Coming Soon</h1><p>Detailed usage instructions will be added.</p></div>;
}

function ApiReference() {
  return (
    <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-6">API Reference</h1>

      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 mb-6">
        <h3 className="text-purple-800 dark:text-purple-200 mt-0 mb-2">📖 Interactive API Documentation</h3>
        <p className="mb-3">
          MultiLingua provides complete, interactive API documentation using OpenAPI/Swagger.
        </p>
        <Link 
          href="/api-docs"
          className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          Open API Documentation
        </Link>
      </div>

      <h2 className="text-2xl font-semibold mt-8 mb-4">What You&apos;ll Find in the API Docs</h2>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li><strong>Complete Endpoint Reference:</strong> All available API endpoints with detailed descriptions</li>
        <li><strong>Request/Response Examples:</strong> See exactly what to send and what you&apos;ll receive</li>
        <li><strong>Try It Out:</strong> Test API calls directly from your browser</li>
        <li><strong>Schema Definitions:</strong> Detailed object models and data types</li>
        <li><strong>Authentication Details:</strong> How to authenticate (if required in future versions)</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Quick Overview</h2>
      <p className="mb-4">
        MultiLingua provides a RESTful API for programmatic access to all translation features.
      </p>

      <h3 className="text-xl font-semibold mt-6 mb-3">Base URL</h3>
      <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded mb-6"><code>http://localhost:3456/api</code></pre>

      <h3 className="text-xl font-semibold mt-6 mb-3">Main Endpoints</h3>
      <div className="space-y-4 mb-6">
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-mono rounded">POST</span>
            <code className="text-sm">/api/translate</code>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-0">
            Translate text from one language to multiple target languages
          </p>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-mono rounded">GET</span>
            <code className="text-sm">/api/translations</code>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-0">
            Retrieve all saved translation entries
          </p>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-mono rounded">POST</span>
            <code className="text-sm">/api/translations</code>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-0">
            Create a new translation entry
          </p>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs font-mono rounded">PUT</span>
            <code className="text-sm">/api/translations</code>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-0">
            Update an existing translation entry
          </p>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs font-mono rounded">DELETE</span>
            <code className="text-sm">/api/translations?id=&#123;id&#125;</code>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-0">
            Delete a translation entry by ID
          </p>
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-mono rounded">GET</span>
            <code className="text-sm">/api/providers</code>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-0">
            Get list of configured translation providers and active provider
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Example: Translate Text</h2>
      <p className="mb-4">Here&apos;s a quick example of how to use the translation API:</p>
      
      <h3 className="text-lg font-semibold mt-4 mb-2">Request</h3>
      <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded mb-4"><code>{`POST /api/translate
Content-Type: application/json

{
  "text": "Hello world",
  "sourceLanguage": "en"
}`}</code></pre>

      <h3 className="text-lg font-semibold mt-4 mb-2">Response</h3>
      <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded mb-6"><code>{`{
  "provider": "LibreTranslate",
  "german": {
    "translation": "Hallo Welt",
    "alternatives": ["Hallo zusammen", "Grüß Gott"]
  },
  "french": {
    "translation": "Bonjour le monde",
    "alternatives": ["Salut le monde"]
  },
  "italian": {
    "translation": "Ciao mondo",
    "alternatives": ["Buongiorno mondo"]
  },
  "spanish": {
    "translation": "Hola mundo",
    "alternatives": ["Hola a todos"]
  }
}`}</code></pre>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Response Features</h2>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li><strong>provider:</strong> Shows which translation service was used (LibreTranslate, DeepL, Google, etc.)</li>
        <li><strong>translation:</strong> The primary translation result</li>
        <li><strong>alternatives:</strong> Array of up to 10 alternative translations</li>
        <li><strong>Multiple languages:</strong> Get translations for all supported languages in one request</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Authentication</h2>
      <p className="mb-4">
        Currently, the MultiLingua API does not require authentication. This may change in future versions 
        to add API key support for better security and rate limiting.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Error Handling</h2>
      <p className="mb-4">All endpoints return appropriate HTTP status codes:</p>
      <ul className="list-disc pl-6 space-y-1 mb-6">
        <li><code>200</code> - Success</li>
        <li><code>400</code> - Bad Request (invalid parameters)</li>
        <li><code>404</code> - Not Found</li>
        <li><code>500</code> - Internal Server Error</li>
      </ul>

      <p className="mb-4">Error responses include a JSON object with an error message:</p>
      <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded mb-6"><code>{`{
  "error": "Text is required"
}`}</code></pre>

      <h2 className="text-2xl font-semibold mt-8 mb-4">CORS Support</h2>
      <p className="mb-4">
        The API supports Cross-Origin Resource Sharing (CORS), allowing you to make requests from 
        web applications hosted on different domains.
      </p>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-8">
        <h3 className="text-blue-800 dark:text-blue-200 mt-0 mb-2">📚 Full Documentation</h3>
        <p className="mb-3">
          For complete, interactive API documentation with the ability to test endpoints directly:
        </p>
        <Link 
          href="/api-docs"
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
        >
          Visit the API Documentation Page →
        </Link>
      </div>
    </div>
  );
}

function Troubleshooting() {
  return <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200"><h1>Troubleshooting - Coming Soon</h1><p>Troubleshooting guide will be added.</p></div>;
}
