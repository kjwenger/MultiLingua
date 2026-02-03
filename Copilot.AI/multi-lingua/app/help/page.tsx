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
  return <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200"><h1>Google Translate API Setup - Coming Soon</h1><p>Detailed setup instructions will be added.</p></div>;
}

function DeepLSetup() {
  return <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200"><h1>DeepL API Setup - Coming Soon</h1><p>Detailed setup instructions will be added.</p></div>;
}

function AzureSetup() {
  return <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200"><h1>Azure Translator Setup - Coming Soon</h1><p>Detailed setup instructions will be added.</p></div>;
}

function Usage() {
  return <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200"><h1>Using MultiLingua - Coming Soon</h1><p>Detailed usage instructions will be added.</p></div>;
}

function ApiReference() {
  return <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200"><h1>API Reference - Coming Soon</h1><p>Detailed API documentation will be added.</p></div>;
}

function Troubleshooting() {
  return <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200"><h1>Troubleshooting - Coming Soon</h1><p>Troubleshooting guide will be added.</p></div>;
}
