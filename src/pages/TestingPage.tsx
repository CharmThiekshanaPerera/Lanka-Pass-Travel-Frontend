import React from 'react';
import ConnectionTestPanel from '@/components/testing/ConnectionTestPanel';

/**
 * Frontend Testing Page
 * Access at: /testing or /test
 * 
 * Use this page to test:
 * - API connectivity
 * - Supabase configuration
 * - Environment variables
 * - Backend endpoints
 */
const TestingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            🧪 Frontend Testing Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Test connectivity, APIs, and environment configuration
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto">
        <ConnectionTestPanel />
      </div>

      {/* Footer with Instructions */}
      <div className="bg-white border-t mt-8">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Local Development */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg text-blue-600">
                🖥️ Local Development
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                <p className="font-mono">
                  VITE_API_URL=http://localhost:8000
                </p>
                <p className="text-gray-600">
                  Ensure your backend is running on localhost:8000
                </p>
                <div className="bg-blue-100 p-2 rounded text-blue-800 text-xs mt-2">
                  Expected: ✅ API Health Check passes
                </div>
              </div>
            </div>

            {/* Staging/Testing */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg text-yellow-600">
                🧪 Staging Server
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                <p className="font-mono">
                  VITE_API_URL=http://staging-api.example.com
                </p>
                <p className="text-gray-600">
                  Test with staging environment API
                </p>
                <div className="bg-yellow-100 p-2 rounded text-yellow-800 text-xs mt-2">
                  Update .env.local with staging URL
                </div>
              </div>
            </div>

            {/* Production */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg text-green-600">
                📦 Production
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                <p className="font-mono">
                  VITE_API_URL=https://13.212.50.145
                </p>
                <p className="text-gray-600">
                  Production API configured
                </p>
                <div className="bg-green-100 p-2 rounded text-green-800 text-xs mt-2">
                  Build: npm run build
                </div>
              </div>
            </div>
          </div>

          {/* Testing Guide */}
          <div className="mt-8 space-y-4">
            <h3 className="font-semibold text-lg">📖 Testing Guide</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 space-y-2">
                <h4 className="font-semibold text-blue-900">
                  ✅ What Gets Tested
                </h4>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>API health check endpoint</li>
                  <li>Login endpoint availability</li>
                  <li>Supabase configuration</li>
                  <li>Environment variables</li>
                  <li>API response times</li>
                  <li>CORS configuration</li>
                </ul>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 space-y-2">
                <h4 className="font-semibold text-purple-900">
                  🚀 Quick Start
                </h4>
                <ol className="text-sm text-purple-800 space-y-1 list-decimal list-inside">
                  <li>Click "Run All Tests" button</li>
                  <li>Check results for errors</li>
                  <li>View environment info tab</li>
                  <li>Download JSON report if needed</li>
                  <li>Check browser console for details</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Troubleshooting */}
          <div className="mt-8 space-y-4">
            <h3 className="font-semibold text-lg">🔧 Troubleshooting</h3>
            <div className="space-y-3">
              <div className="bg-red-50 p-4 rounded-lg border border-red-200 space-y-2">
                <h4 className="font-semibold text-red-900">
                  ❌ API Health Check fails
                </h4>
                <ul className="text-sm text-red-800 space-y-1">
                  <li>✓ Ensure backend is running</li>
                  <li>✓ Check VITE_API_URL is correct</li>
                  <li>✓ Verify CORS is configured on backend</li>
                  <li>✓ Check network tab for blocked requests</li>
                </ul>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 space-y-2">
                <h4 className="font-semibold text-orange-900">
                  ⚠️ Supabase warning
                </h4>
                <ul className="text-sm text-orange-800 space-y-1">
                  <li>✓ Verify VITE_SUPABASE_URL in .env</li>
                  <li>✓ Check VITE_SUPABASE_ANON_KEY is valid</li>
                  <li>✓ Ensure it's a public ANON key (not service role)</li>
                  <li>✓ Check Supabase project is active</li>
                </ul>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 space-y-2">
                <h4 className="font-semibold text-yellow-900">
                  📋 Missing environment variables
                </h4>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>✓ Create or update .env file</li>
                  <li>✓ Reference .env.example for template</li>
                  <li>✓ Restart dev server after changes</li>
                  <li>✓ Hard refresh browser (Ctrl+Shift+R)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Additional Resources */}
          <div className="mt-8 bg-gray-100 p-6 rounded-lg space-y-3">
            <h3 className="font-semibold text-lg">📚 Additional Resources</h3>
            <ul className="text-sm space-y-2">
              <li>
                📖 Check{' '}
                <span className="font-mono bg-white px-2 py-1">
                  ENVIRONMENT_TESTING_GUIDE.md
                </span>{' '}
                for detailed testing instructions
              </li>
              <li>
                📖 Check{' '}
                <span className="font-mono bg-white px-2 py-1">
                  QUICK_COMMANDS.md
                </span>{' '}
                for command reference
              </li>
              <li>
                📖 Check{' '}
                <span className="font-mono bg-white px-2 py-1">
                  ENV_SETUP.md
                </span>{' '}
                for environment setup
              </li>
              <li>
                🔗 Open browser DevTools Console (F12) to see detailed logs
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestingPage;
