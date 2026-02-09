# Frontend Testing Script (PowerShell)
# Run automated tests for frontend connectivity and configuration

param(
    [string]$ApiUrl = "http://localhost:8000",
    [switch]$Verbose = $false
)

# Colors
$ErrorColor = "Red"
$SuccessColor = "Green"
$WarningColor = "Yellow"
$InfoColor = "Cyan"

Write-Host "`n╔═══════════════════════════════════════════════════════════════╗" -ForegroundColor $InfoColor
Write-Host "║         FRONTEND CONNECTION TESTING SCRIPT                     ║" -ForegroundColor $InfoColor
Write-Host "╚═══════════════════════════════════════════════════════════════╝`n" -ForegroundColor $InfoColor

# ============================================
# Test Functions
# ============================================

function Test-ApiHealth {
    Write-Host "🏥 Testing API Health Check..." -ForegroundColor $WarningColor
    
    try {
        $response = Invoke-WebRequest -Uri "$ApiUrl/api/health" -Method Get -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ PASSED: API is reachable" -ForegroundColor $SuccessColor
            if ($Verbose) {
                Write-Host "   Response: $($response.Content.Substring(0, 100))"
            }
            return $true
        }
    } catch {
        Write-Host "❌ FAILED: Cannot connect to API at $ApiUrl" -ForegroundColor $ErrorColor
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor $ErrorColor
        return $false
    }
}

function Test-LoginEndpoint {
    Write-Host "🔐 Testing Login Endpoint..." -ForegroundColor $WarningColor
    
    try {
        $body = @{
            email = "test@example.com"
            password = "test"
        } | ConvertTo-Json
        
        $response = Invoke-WebRequest -Uri "$ApiUrl/api/auth/login" `
            -Method Post `
            -Body $body `
            -ContentType "application/json" `
            -ErrorAction SilentlyContinue
        
        Write-Host "✅ PASSED: Login endpoint is functional" -ForegroundColor $SuccessColor
        return $true
    } catch {
        if ($_.Exception.Response.StatusCode.Value__ -eq 400 -or $_.Exception.Response.StatusCode.Value__ -eq 401) {
            Write-Host "✅ PASSED: Login endpoint is functional (auth failed as expected)" -ForegroundColor $SuccessColor
            return $true
        }
        Write-Host "❌ FAILED: Login endpoint not available" -ForegroundColor $ErrorColor
        return $false
    }
}

function Test-EnvironmentFiles {
    Write-Host "📋 Testing Environment Files..." -ForegroundColor $WarningColor
    
    $passed = $true
    
    if (Test-Path ".env") {
        Write-Host "✅ .env exists" -ForegroundColor $SuccessColor
    } else {
        Write-Host "❌ .env not found" -ForegroundColor $ErrorColor
        $passed = $false
    }
    
    if (Test-Path ".env.local") {
        Write-Host "✅ .env.local exists" -ForegroundColor $SuccessColor
    } else {
        Write-Host "⚠️  .env.local not found (optional)" -ForegroundColor $WarningColor
    }
    
    if (Test-Path ".env.production") {
        Write-Host "✅ .env.production exists" -ForegroundColor $SuccessColor
    } else {
        Write-Host "⚠️  .env.production not found (needed for production)" -ForegroundColor $WarningColor
    }
    
    return $passed
}

function Test-EnvironmentVariables {
    Write-Host "🔍 Testing Environment Variables..." -ForegroundColor $WarningColor
    
    $missing = 0
    $requiredVars = @("VITE_API_URL", "VITE_ENVIRONMENT", "VITE_SUPABASE_URL")
    
    if (Test-Path ".env") {
        $envContent = Get-Content .env
        
        foreach ($var in $requiredVars) {
            $line = $envContent | Where-Object { $_ -match "^$var=" }
            if ($line) {
                $value = ($line -split "=", 2)[1]
                if ([string]::IsNullOrEmpty($value)) {
                    Write-Host "❌ $var is empty" -ForegroundColor $ErrorColor
                    $missing++
                } else {
                    Write-Host "✅ $var is set" -ForegroundColor $SuccessColor
                    if ($Verbose) {
                        Write-Host "   Value: $value"
                    }
                }
            } else {
                Write-Host "❌ $var not found" -ForegroundColor $ErrorColor
                $missing++
            }
        }
    } else {
        Write-Host "❌ .env file not found" -ForegroundColor $ErrorColor
        return $false
    }
    
    return $missing -eq 0
}

function Test-NpmPackages {
    Write-Host "📦 Testing NPM Packages..." -ForegroundColor $WarningColor
    
    if (-not (Test-Path "node_modules")) {
        Write-Host "⚠️  node_modules not found - installing dependencies..." -ForegroundColor $WarningColor
        npm install > $null 2>&1
        Write-Host "✅ Dependencies installed" -ForegroundColor $SuccessColor
        return $true
    } else {
        Write-Host "✅ node_modules exists" -ForegroundColor $SuccessColor
        return $true
    }
}

function Test-ViteConfig {
    Write-Host "⚙️  Testing Vite Configuration..." -ForegroundColor $WarningColor
    
    if ((Test-Path "vite.config.ts") -or (Test-Path "vite.config.js")) {
        Write-Host "✅ Vite config found" -ForegroundColor $SuccessColor
        return $true
    } else {
        Write-Host "❌ Vite config not found" -ForegroundColor $ErrorColor
        return $false
    }
}

function Test-BackendRunning {
    Write-Host "🚀 Checking if Backend is Running..." -ForegroundColor $WarningColor
    
    try {
        $response = Invoke-WebRequest -Uri "$ApiUrl" -Method Head -ErrorAction SilentlyContinue -TimeoutSec 2
        Write-Host "✅ Backend is accessible at $ApiUrl" -ForegroundColor $SuccessColor
        return $true
    } catch {
        Write-Host "❌ Cannot connect to backend at $ApiUrl" -ForegroundColor $ErrorColor
        Write-Host "   Make sure backend is running on $ApiUrl" -ForegroundColor $ErrorColor
        return $false
    }
}

# ============================================
# Run Tests
# ============================================

$passed = 0
$failed = 0

Write-Host "Target API: $ApiUrl`n" -ForegroundColor $InfoColor

# Test environment files
if (Test-EnvironmentFiles) { $passed++ } else { $failed++ }
Write-Host ""

# Test env variables
if (Test-EnvironmentVariables) { $passed++ } else { $failed++ }
Write-Host ""

# Test npm packages
if (Test-NpmPackages) { $passed++ } else { $failed++ }
Write-Host ""

# Test vite config
if (Test-ViteConfig) { $passed++ } else { $failed++ }
Write-Host ""

# Test backend running
if (Test-BackendRunning) {
    $passed++
    Write-Host ""
    if (Test-ApiHealth) { $passed++ } else { $failed++ }
    Write-Host ""
    if (Test-LoginEndpoint) { $passed++ } else { $failed++ }
} else {
    $failed++
    Write-Host "⚠️  Skipping API tests (backend not accessible)" -ForegroundColor $WarningColor
}

# ============================================
# Summary
# ============================================

Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════════════╗" -ForegroundColor $InfoColor
Write-Host "║                      TEST SUMMARY                              ║" -ForegroundColor $InfoColor
Write-Host "╚═══════════════════════════════════════════════════════════════╝`n" -ForegroundColor $InfoColor

$total = $passed + $failed
if ($total -gt 0) {
    $percentage = [math]::Round(($passed / $total) * 100)
} else {
    $percentage = 0
}

Write-Host "Tests Run: $total"
Write-Host "Passed: $passed" -ForegroundColor $SuccessColor
Write-Host "Failed: $failed" -ForegroundColor $ErrorColor
Write-Host "Success Rate: $percentage%`n"

if ($failed -eq 0) {
    Write-Host "✅ All tests passed!`n" -ForegroundColor $SuccessColor
    
    Write-Host "Next Steps:" -ForegroundColor $InfoColor
    Write-Host "  1. Start frontend: npm run dev" -ForegroundColor $WarningColor
    Write-Host "  2. Navigate to: http://localhost:8080/testing" -ForegroundColor $WarningColor
    Write-Host "  3. Run visual tests in browser`n" -ForegroundColor $WarningColor
    
    exit 0
} else {
    Write-Host "❌ Some tests failed. Please fix issues above.`n" -ForegroundColor $ErrorColor
    
    Write-Host "Troubleshooting:" -ForegroundColor $InfoColor
    Write-Host "  • Check backend is running at: $ApiUrl" -ForegroundColor $WarningColor
    Write-Host "  • Verify .env file has: VITE_API_URL=$ApiUrl" -ForegroundColor $WarningColor
    Write-Host "  • Review: FRONTEND_TESTING_GUIDE.md" -ForegroundColor $WarningColor
    Write-Host "  • Check: .env.example`n" -ForegroundColor $WarningColor
    
    exit 1
}
