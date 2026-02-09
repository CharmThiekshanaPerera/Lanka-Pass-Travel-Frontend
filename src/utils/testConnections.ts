/**
 * API and Service Connection Testing Utilities
 * Test frontend connectivity to backend and other services
 */

export interface ConnectionTestResult {
  service: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  duration: number;
  timestamp: string;
}

export interface HealthCheckResponse {
  status: string;
  message?: string;
  version?: string;
  timestamp?: string;
}

// ============================================
// API CONNECTION TESTS
// ============================================

/**
 * Test basic API health check
 */
export const testApiHealth = async (): Promise<ConnectionTestResult> => {
  const startTime = Date.now();
  const apiUrl = import.meta.env.VITE_API_URL;

  try {
    if (!apiUrl) {
      return {
        service: 'API',
        status: 'error',
        message: 'VITE_API_URL not configured',
        duration: 0,
        timestamp: new Date().toISOString(),
      };
    }

    const controller = new AbortController();
    const timeoutMs = Number(import.meta.env.VITE_API_TIMEOUT) || 30000;
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch(`${apiUrl}/api/health`, {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const duration = Date.now() - startTime;

    if (response.ok) {
      try {
        const data: HealthCheckResponse = await response.json();
        return {
          service: 'API Health Check',
          status: 'success',
          message: `API is healthy | Status: ${data.status} | Response: ${JSON.stringify(data)}`,
          duration,
          timestamp: new Date().toISOString(),
        };
      } catch {
        return {
          service: 'API Health Check',
          status: 'success',
          message: `API responded with status ${response.status}`,
          duration,
          timestamp: new Date().toISOString(),
        };
      }
    } else {
      return {
        service: 'API Health Check',
        status: 'error',
        message: `API returned status ${response.status}: ${response.statusText}`,
        duration,
        timestamp: new Date().toISOString(),
      };
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    return {
      service: 'API Health Check',
      status: 'error',
      message: `Connection failed: ${error instanceof Error ? error.message : String(error)}`,
      duration,
      timestamp: new Date().toISOString(),
    };
  }
};

/**
 * Test login endpoint
 */
export const testLoginEndpoint = async (
  email: string = 'test@example.com',
  password: string = 'test'
): Promise<ConnectionTestResult> => {
  const startTime = Date.now();
  const apiUrl = import.meta.env.VITE_API_URL;

  try {
    if (!apiUrl) {
      return {
        service: 'Login Endpoint',
        status: 'error',
        message: 'VITE_API_URL not configured',
        duration: 0,
        timestamp: new Date().toISOString(),
      };
    }

    const response = await fetch(`${apiUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const duration = Date.now() - startTime;

    if (response.status === 401 || response.status === 400) {
      return {
        service: 'Login Endpoint',
        status: 'success',
        message: `Login endpoint is working (test credentials invalid, which is expected)`,
        duration,
        timestamp: new Date().toISOString(),
      };
    } else if (response.ok) {
      return {
        service: 'Login Endpoint',
        status: 'success',
        message: `Login endpoint is working`,
        duration,
        timestamp: new Date().toISOString(),
      };
    } else {
      return {
        service: 'Login Endpoint',
        status: 'error',
        message: `Login endpoint returned status ${response.status}`,
        duration,
        timestamp: new Date().toISOString(),
      };
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    return {
      service: 'Login Endpoint',
      status: 'error',
      message: `Connection failed: ${error instanceof Error ? error.message : String(error)}`,
      duration,
      timestamp: new Date().toISOString(),
    };
  }
};

// ============================================
// SUPABASE CONNECTION TESTS
// ============================================

/**
 * Test Supabase configuration
 */
export const testSupabaseConfig = (): ConnectionTestResult => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    return {
      service: 'Supabase Configuration',
      status: 'error',
      message: 'VITE_SUPABASE_URL not configured',
      duration: 0,
      timestamp: new Date().toISOString(),
    };
  }

  if (!anonKey) {
    return {
      service: 'Supabase Configuration',
      status: 'error',
      message: 'VITE_SUPABASE_ANON_KEY not configured',
      duration: 0,
      timestamp: new Date().toISOString(),
    };
  }

  if (anonKey.includes('placeholder') || anonKey.includes('your-')) {
    return {
      service: 'Supabase Configuration',
      status: 'warning',
      message: 'Supabase key appears to be a placeholder',
      duration: 0,
      timestamp: new Date().toISOString(),
    };
  }

  return {
    service: 'Supabase Configuration',
    status: 'success',
    message: `Supabase configured: ${supabaseUrl}`,
    duration: 0,
    timestamp: new Date().toISOString(),
  };
};

// ============================================
// ENVIRONMENT VARIABLE TESTS
// ============================================

/**
 * Test all required environment variables
 */
export const testEnvironmentVariables = (): ConnectionTestResult[] => {
  const results: ConnectionTestResult[] = [];
  const requiredVars = [
    'VITE_API_URL',
    'VITE_ENVIRONMENT',
    'VITE_APP_NAME',
    'VITE_SUPABASE_URL',
  ];

  requiredVars.forEach((varName) => {
    const value = import.meta.env[`${varName}`];

    if (!value) {
      results.push({
        service: `Environment: ${varName}`,
        status: 'error',
        message: `${varName} is not configured`,
        duration: 0,
        timestamp: new Date().toISOString(),
      });
    } else {
      const maskedValue =
        varName.includes('KEY') || varName.includes('SECRET')
          ? '***' + String(value).slice(-4)
          : String(value);

      results.push({
        service: `Environment: ${varName}`,
        status: 'success',
        message: `${varName} = ${maskedValue}`,
        duration: 0,
        timestamp: new Date().toISOString(),
      });
    }
  });

  return results;
};

/**
 * Get all environment variables for debugging
 */
export const getEnvironmentInfo = (): Record<string, string | undefined> => {
  return {
    API_URL: import.meta.env.VITE_API_URL,
    ENVIRONMENT: import.meta.env.VITE_ENVIRONMENT,
    APP_NAME: import.meta.env.VITE_APP_NAME,
    APP_VERSION: import.meta.env.VITE_APP_VERSION,
    DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE,
    SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    SMS_SENDER_ID: import.meta.env.VITE_SMS_SENDER_ID,
    SECURE_COOKIES: import.meta.env.VITE_SECURE_COOKIES,
    VITE_MODE: import.meta.env.MODE,
  };
};

// ============================================
// COMPREHENSIVE TEST SUITE
// ============================================

/**
 * Run all connection tests
 */
export const runAllTests = async (): Promise<ConnectionTestResult[]> => {
  const results: ConnectionTestResult[] = [];

  console.log('🧪 Starting comprehensive connection tests...\n');

  // Environment variable tests
  console.log('📋 Testing environment variables...');
  results.push(...testEnvironmentVariables());

  // Supabase config test
  console.log('🔌 Testing Supabase configuration...');
  results.push(testSupabaseConfig());

  // API health test
  console.log('🏥 Testing API health...');
  results.push(await testApiHealth());

  // Login endpoint test
  console.log('🔐 Testing login endpoint...');
  results.push(await testLoginEndpoint());

  return results;
};

/**
 * Log test results in a formatted way
 */
export const logTestResults = (results: ConnectionTestResult[]): void => {
  console.log('\n' + '='.repeat(80));
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('='.repeat(80) + '\n');

  const grouped = {
    success: results.filter((r) => r.status === 'success'),
    warning: results.filter((r) => r.status === 'warning'),
    error: results.filter((r) => r.status === 'error'),
  };

  // Success
  if (grouped.success.length > 0) {
    console.log('✅ PASSED (' + grouped.success.length + ')\n');
    grouped.success.forEach((r) => {
      console.log(`  ${r.service}: ${r.message}`);
      if (r.duration > 0) console.log(`    Duration: ${r.duration}ms`);
    });
    console.log();
  }

  // Warnings
  if (grouped.warning.length > 0) {
    console.log('⚠️  WARNINGS (' + grouped.warning.length + ')\n');
    grouped.warning.forEach((r) => {
      console.log(`  ${r.service}: ${r.message}`);
    });
    console.log();
  }

  // Errors
  if (grouped.error.length > 0) {
    console.log('❌ FAILED (' + grouped.error.length + ')\n');
    grouped.error.forEach((r) => {
      console.log(`  ${r.service}: ${r.message}`);
    });
    console.log();
  }

  console.log('='.repeat(80) + '\n');

  // Summary
  const totalTests = results.length;
  const passedTests = grouped.success.length;
  const passPercentage = ((passedTests / totalTests) * 100).toFixed(1);

  console.log(
    `Tests: ${passedTests}/${totalTests} passed (${passPercentage}%)`
  );
  console.log(
    `Status: ${grouped.error.length > 0 ? '❌ FAILED' : '✅ PASSED'}\n`
  );
};

/**
 * Export results as JSON for logging/debugging
 */
export const exportTestResultsAsJSON = (results: ConnectionTestResult[]): string => {
  return JSON.stringify(
    {
      timestamp: new Date().toISOString(),
      summary: {
        total: results.length,
        passed: results.filter((r) => r.status === 'success').length,
        warnings: results.filter((r) => r.status === 'warning').length,
        failed: results.filter((r) => r.status === 'error').length,
      },
      environment: getEnvironmentInfo(),
      results,
    },
    null,
    2
  );
};
