#!/bin/bash
# Switch between different environments easily
# Usage: ./env-switch.sh [dev|local|prod]

ENV=${1:-dev}

case $ENV in
  dev|development)
    echo "🔄 Switching to DEVELOPMENT environment..."
    echo "- API URL: http://localhost:8000"
    echo "- Debug Mode: true"
    echo "- Database: Development"
    echo ""
    echo "Running: bun run dev"
    bun run dev
    ;;
    
  local)
    echo "🔄 Switching to LOCAL environment..."
    echo "- API URL: http://localhost:8000 (or customized in .env.local)"
    echo "- Debug Mode: true"
    echo "- Profile: Your local machine"
    echo ""
    echo "Running: bun run dev --mode local"
    bun run dev --mode local
    ;;
    
  prod|production)
    echo "🔄 Switching to PRODUCTION environment..."
    echo "- API URL: https://13.212.50.145"
    echo "- Debug Mode: false"
    echo "- Database: Production"
    echo ""
    echo "Building production bundle..."
    bun run build
    echo ""
    echo "✅ Build complete! To preview:"
    echo "   bun run preview"
    ;;
    
  preview)
    echo "🔄 Previewing PRODUCTION build..."
    echo ""
    echo "Running: bun run preview"
    echo "Access at: http://localhost:4173"
    bun run preview
    ;;
    
  test-api)
    echo "🔄 Testing API connectivity..."
    API_URL=${2:-http://localhost:8000}
    echo "Testing: $API_URL/api/health"
    curl -v "$API_URL/api/health" || echo "❌ Connection failed"
    ;;
    
  test-env)
    echo "🔄 Displaying current environment configuration..."
    echo ""
    echo "===== DEVELOPMENT (.env) ====="
    grep "VITE_" .env | head -10
    echo ""
    if [ -f .env.local ]; then
      echo "===== LOCAL (.env.local) ====="
      grep "VITE_" .env.local | head -10
    else
      echo "⚠️  .env.local not found"
    fi
    echo ""
    echo "===== PRODUCTION (.env.production) ====="
    grep "VITE_" .env.production | head -10
    ;;
    
  *)
    echo "❌ Unknown environment: $ENV"
    echo ""
    echo "Usage: ./env-switch.sh [command]"
    echo ""
    echo "Commands:"
    echo "  dev           - Start dev server with development environment"
    echo "  local         - Start dev server with local environment (.env.local)"
    echo "  prod          - Build for production (.env.production)"
    echo "  preview       - Preview the production build"
    echo "  test-api      - Test API connectivity (usage: test-api [url])"
    echo "  test-env      - Show all environment configurations"
    echo ""
    echo "Examples:"
    echo "  ./env-switch.sh dev"
    echo "  ./env-switch.sh prod"
    echo "  ./env-switch.sh test-api http://localhost:8000"
    echo "  ./env-switch.sh preview"
    ;;
esac
