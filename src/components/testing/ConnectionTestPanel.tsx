import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  runAllTests,
  logTestResults,
  exportTestResultsAsJSON,
  testApiHealth,
  testLoginEndpoint,
  testSupabaseConfig,
  testEnvironmentVariables,
  getEnvironmentInfo,
  type ConnectionTestResult,
} from '@/utils/testConnections';

/**
 * Connection Testing Component
 * Test frontend connectivity to backend and services
 */
export const ConnectionTestPanel: React.FC = () => {
  const [results, setResults] = useState<ConnectionTestResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'results' | 'env'>('results');

  const handleRunAllTests = useCallback(async () => {
    setLoading(true);
    try {
      const testResults = await runAllTests();
      setResults(testResults);
      logTestResults(testResults);
    } catch (error) {
      console.error('Test failed:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleTestApi = useCallback(async () => {
    setLoading(true);
    try {
      const result = await testApiHealth();
      setResults([result]);
      console.log('API Test Result:', result);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleTestLogin = useCallback(async () => {
    setLoading(true);
    try {
      const result = await testLoginEndpoint();
      setResults([result]);
      console.log('Login Test Result:', result);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleTestSupabase = useCallback(() => {
    const result = testSupabaseConfig();
    setResults([result]);
    console.log('Supabase Test Result:', result);
  }, []);

  const handleTestEnv = useCallback(() => {
    const results = testEnvironmentVariables();
    setResults(results);
    console.log('Environment Test Results:', results);
  }, []);

  const handleExportResults = useCallback(() => {
    const json = exportTestResultsAsJSON(results);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `test-results-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [results]);

  const handleCopyToConsole = useCallback(() => {
    const json = exportTestResultsAsJSON(results);
    navigator.clipboard.writeText(json);
    alert('Test results copied to clipboard!');
  }, [results]);

  const successCount = results.filter((r) => r.status === 'success').length;
  const errorCount = results.filter((r) => r.status === 'error').length;
  const warningCount = results.filter((r) => r.status === 'warning').length;

  const envInfo = getEnvironmentInfo();

  return (
    <div className="w-full space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>🧪 Frontend Connection Testing</CardTitle>
          <CardDescription>
            Test connectivity to backend API, Supabase, and verify environment configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Quick Actions */}
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Tests</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
              <Button
                onClick={handleRunAllTests}
                disabled={loading}
                className="w-full"
                variant="default"
              >
                {loading ? 'Running...' : '▶️ Run All Tests'}
              </Button>
              <Button
                onClick={handleTestApi}
                disabled={loading}
                className="w-full"
                variant="outline"
              >
                🏥 Test API Health
              </Button>
              <Button
                onClick={handleTestLogin}
                disabled={loading}
                className="w-full"
                variant="outline"
              >
                🔐 Test Login
              </Button>
              <Button
                onClick={handleTestSupabase}
                disabled={loading}
                className="w-full"
                variant="outline"
              >
                🔌 Test Supabase
              </Button>
              <Button
                onClick={handleTestEnv}
                disabled={loading}
                className="w-full"
                variant="outline"
              >
                📋 Test Environment
              </Button>
              <Button
                onClick={() => setActiveTab('env')}
                className="w-full"
                variant="outline"
              >
                ⚙️ View Env Vars
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="space-y-4">
            <div className="flex gap-2 border-b">
              <button
                onClick={() => setActiveTab('results')}
                className={`px-4 py-2 font-semibold ${
                  activeTab === 'results'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-600'
                }`}
              >
                Test Results
              </button>
              <button
                onClick={() => setActiveTab('env')}
                className={`px-4 py-2 font-semibold ${
                  activeTab === 'env'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-600'
                }`}
              >
                Environment Info
              </button>
            </div>

            {/* Results Tab */}
            {activeTab === 'results' && (
              <div className="space-y-4">
                {results.length > 0 ? (
                  <>
                    {/* Summary Stats */}
                    <div className="grid grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="pt-6 text-center">
                          <div className="text-3xl font-bold text-green-600">
                            {successCount}
                          </div>
                          <div className="text-sm text-gray-600">Passed</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6 text-center">
                          <div className="text-3xl font-bold text-yellow-600">
                            {warningCount}
                          </div>
                          <div className="text-sm text-gray-600">Warnings</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6 text-center">
                          <div className="text-3xl font-bold text-red-600">
                            {errorCount}
                          </div>
                          <div className="text-sm text-gray-600">Failed</div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Results List */}
                    <div className="space-y-2">
                      {results.map((result, idx) => (
                        <div
                          key={idx}
                          className={`p-4 border rounded-lg ${
                            result.status === 'success'
                              ? 'bg-green-50 border-green-200'
                              : result.status === 'warning'
                                ? 'bg-yellow-50 border-yellow-200'
                                : 'bg-red-50 border-red-200'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant={
                                    result.status === 'success'
                                      ? 'default'
                                      : result.status === 'warning'
                                        ? 'secondary'
                                        : 'destructive'
                                  }
                                >
                                  {result.status === 'success' &&
                                    '✅ PASS'}
                                  {result.status === 'warning' &&
                                    '⚠️ WARNING'}
                                  {result.status === 'error' && '❌ FAIL'}
                                </Badge>
                                <span className="font-semibold">
                                  {result.service}
                                </span>
                              </div>
                              <p className="mt-2 text-sm text-gray-700">
                                {result.message}
                              </p>
                              {result.duration > 0 && (
                                <p className="mt-1 text-xs text-gray-500">
                                  Response time: {result.duration}ms
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Export Options */}
                    <div className="flex gap-2 pt-4">
                      <Button
                        onClick={handleExportResults}
                        className="flex-1"
                        variant="outline"
                      >
                        📥 Download JSON
                      </Button>
                      <Button
                        onClick={handleCopyToConsole}
                        className="flex-1"
                        variant="outline"
                      >
                        📋 Copy to Clipboard
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No tests run yet. Click a button above to start testing.</p>
                  </div>
                )}
              </div>
            )}

            {/* Environment Info Tab */}
            {activeTab === 'env' && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h4 className="font-semibold mb-4">Environment Variables</h4>
                  <div className="space-y-2 font-mono text-sm">
                    {Object.entries(envInfo).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between items-center p-2 bg-white border rounded"
                      >
                        <span className="font-semibold text-blue-600">
                          {key}:
                        </span>
                        <span className="text-gray-700">
                          {typeof value === 'string' && value.length > 50
                            ? value.substring(0, 50) + '...'
                            : value || '(not set)'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">Tips:</h4>
                  <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                    <li>Check VITE_API_URL matches your backend</li>
                    <li>Verify VITE_ENVIRONMENT matches your setup</li>
                    <li>Ensure VITE_SUPABASE_URL is configured</li>
                    <li>For production: DEBUG_MODE should be false</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Browser Console Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">📝 Browser Console Testing</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2 font-mono bg-gray-900 text-green-400 p-4 rounded overflow-auto max-h-64">
          <div>// Run all tests programmatically</div>
          <div>
            import {'{'}runAllTests, logTestResults{'}'}
            from './utils/testConnections'
          </div>
          <div>
            <br />
            const results = await runAllTests()
          </div>
          <div>logTestResults(results)</div>
          <div>
            <br />
            // Check current environment
          </div>
          <div>
            import {'{'}getEnvironmentInfo{'}'}
            from './utils/testConnections'
          </div>
          <div>console.log(getEnvironmentInfo())</div>
          <div>
            <br />
            // Test specific endpoint
          </div>
          <div>
            import {'{'}testApiHealth{'}'}
            from './utils/testConnections'
          </div>
          <div>const result = await testApiHealth()</div>
          <div>console.log(result)</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConnectionTestPanel;
