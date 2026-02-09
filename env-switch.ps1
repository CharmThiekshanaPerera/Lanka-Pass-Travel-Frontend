# Switch between different environments easily (PowerShell)
# Usage: .\env-switch.ps1 -Env dev
# Or: .\env-switch.ps1 dev

param(
    [Parameter(Position=0)]
    [ValidateSet("dev", "development", "local", "prod", "production", "preview", "test-api", "test-env")]
    [string]$Env = "dev"
)

function Show-Help {
    Write-Host "Usage: .\env-switch.ps1 [command]" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Commands:" -ForegroundColor Yellow
    Write-Host "  dev           - Start dev server with development environment"
    Write-Host "  local         - Start dev server with local environment (.env.local)"
    Write-Host "  prod          - Build for production (.env.production)"
    Write-Host "  preview       - Preview the production build"
    Write-Host "  test-api      - Test API connectivity"
    Write-Host "  test-env      - Show all environment configurations"
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor Green
    Write-Host "  .\env-switch.ps1 dev"
    Write-Host "  .\env-switch.ps1 prod"
    Write-Host "  .\env-switch.ps1 preview"
}

switch ($Env) {
    "dev" {
        "development" {
            Write-Host "🔄 Switching to DEVELOPMENT environment..." -ForegroundColor Cyan
            Write-Host "- API URL: http://localhost:8000"
            Write-Host "- Debug Mode: true"
            Write-Host "- Database: Development"
            Write-Host ""
            Write-Host "Running: bun run dev" -ForegroundColor Green
            Write-Host ""
            & bun run dev
        }
    }
    
    "development" {
        Write-Host "🔄 Switching to DEVELOPMENT environment..." -ForegroundColor Cyan
        Write-Host "- API URL: http://localhost:8000"
        Write-Host "- Debug Mode: true"
        Write-Host "- Database: Development"
        Write-Host ""
        Write-Host "Running: bun run dev" -ForegroundColor Green
        Write-Host ""
        & bun run dev
    }
    
    "local" {
        Write-Host "🔄 Switching to LOCAL environment..." -ForegroundColor Cyan
        Write-Host "- API URL: http://localhost:8000 (or customized in .env.local)"
        Write-Host "- Debug Mode: true"
        Write-Host "- Profile: Your local machine"
        Write-Host ""
        Write-Host "Running: bun run dev --mode local" -ForegroundColor Green
        Write-Host ""
        & bun run dev --mode local
    }
    
    "prod" {
        "production" {
            Write-Host "🔄 Switching to PRODUCTION environment..." -ForegroundColor Cyan
            Write-Host "- API URL: https://13.212.50.145"
            Write-Host "- Debug Mode: false"
            Write-Host "- Database: Production"
            Write-Host ""
            Write-Host "Building production bundle..." -ForegroundColor Green
            Write-Host ""
            & bun run build
            Write-Host ""
            Write-Host "✅ Build complete! To preview:" -ForegroundColor Green
            Write-Host "   bun run preview"
        }
    }
    
    "production" {
        Write-Host "🔄 Switching to PRODUCTION environment..." -ForegroundColor Cyan
        Write-Host "- API URL: https://13.212.50.145"
        Write-Host "- Debug Mode: false"
        Write-Host "- Database: Production"
        Write-Host ""
        Write-Host "Building production bundle..." -ForegroundColor Green
        Write-Host ""
        & bun run build
        Write-Host ""
        Write-Host "✅ Build complete! To preview:" -ForegroundColor Green
        Write-Host "   bun run preview"
    }
    
    "preview" {
        Write-Host "🔄 Previewing PRODUCTION build..." -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Running: bun run preview" -ForegroundColor Green
        Write-Host "Access at: http://localhost:4173"
        Write-Host ""
        & bun run preview
    }
    
    "test-api" {
        Write-Host "🔄 Testing API connectivity..." -ForegroundColor Cyan
        $apiUrl = "http://localhost:8000"
        Write-Host "Testing: $apiUrl/api/health"
        Write-Host ""
        try {
            $response = Invoke-WebRequest -Uri "$apiUrl/api/health" -Method GET -ErrorAction Stop
            Write-Host "✅ API is reachable! Status: $($response.StatusCode)" -ForegroundColor Green
        } catch {
            Write-Host "❌ Connection failed: $_" -ForegroundColor Red
        }
    }
    
    "test-env" {
        Write-Host "🔄 Displaying current environment configuration..." -ForegroundColor Cyan
        Write-Host ""
        
        Write-Host "===== DEVELOPMENT (.env) =====" -ForegroundColor Yellow
        Get-Content .env | Where-Object { $_ -match "VITE_" } | Select-Object -First 10
        Write-Host ""
        
        if (Test-Path ".env.local") {
            Write-Host "===== LOCAL (.env.local) =====" -ForegroundColor Yellow
            Get-Content .env.local | Where-Object { $_ -match "VITE_" } | Select-Object -First 10
        } else {
            Write-Host "⚠️  .env.local not found" -ForegroundColor Yellow
        }
        Write-Host ""
        
        Write-Host "===== PRODUCTION (.env.production) =====" -ForegroundColor Yellow
        Get-Content .env.production | Where-Object { $_ -match "VITE_" } | Select-Object -First 10
    }
    
    default {
        Write-Host "❌ Unknown environment: $Env" -ForegroundColor Red
        Write-Host ""
        Show-Help
    }
}
