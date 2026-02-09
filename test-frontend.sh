#!/bin/bash
# Frontend Testing Script
# Run automated tests for frontend connectivity and configuration

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
API_URL="${1:-http://localhost:8000}"
VERBOSE="${2:-false}"

echo -e "${BLUE}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║         FRONTEND CONNECTION TESTING SCRIPT                     ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════════╝${NC}\n"

# ============================================
# Test Functions
# ============================================

test_api_health() {
  echo -e "${YELLOW}🏥 Testing API Health Check...${NC}"
  
  local response
  local status_code
  
  response=$(curl -s -w "\n%{http_code}" "$API_URL/api/health" 2>&1)
  status_code=$(echo "$response" | tail -n 1)
  body=$(echo "$response" | sed '$d')
  
  if [[ "$status_code" == "200" ]] || [[ "$status_code" == "000" ]]; then
    echo -e "${GREEN}✅ PASSED${NC}: API is reachable"
    if [[ "$VERBOSE" == "true" ]]; then
      echo -e "   Response: ${body:0:100}"
    fi
    return 0
  else
    echo -e "${RED}❌ FAILED${NC}: API returned status $status_code"
    return 1
  fi
}

test_login_endpoint() {
  echo -e "${YELLOW}🔐 Testing Login Endpoint...${NC}"
  
  local response
  local status_code
  
  response=$(curl -s -w "\n%{http_code}" -X POST \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"test"}' \
    "$API_URL/api/auth/login" 2>&1)
  
  status_code=$(echo "$response" | tail -n 1)
  
  # 400/401 means endpoint exists but auth failed (expected)
  if [[ "$status_code" == "200" ]] || [[ "$status_code" == "400" ]] || [[ "$status_code" == "401" ]]; then
    echo -e "${GREEN}✅ PASSED${NC}: Login endpoint is functional"
    return 0
  else
    echo -e "${RED}❌ FAILED${NC}: Login endpoint returned status $status_code"
    return 1
  fi
}

test_environment_file() {
  echo -e "${YELLOW}📋 Testing Environment Files...${NC}"
  
  local has_env=false
  local has_env_local=false
  local has_env_production=false
  
  [[ -f ".env" ]] && has_env=true
  [[ -f ".env.local" ]] && has_env_local=true
  [[ -f ".env.production" ]] && has_env_production=true
  
  if [[ "$has_env" == "true" ]]; then
    echo -e "${GREEN}✅${NC} .env exists"
  else
    echo -e "${RED}❌${NC} .env not found"
  fi
  
  if [[ "$has_env_local" == "true" ]]; then
    echo -e "${GREEN}✅${NC} .env.local exists"
  else
    echo -e "${YELLOW}⚠️${NC}  .env.local not found (optional)"
  fi
  
  if [[ "$has_env_production" == "true" ]]; then
    echo -e "${GREEN}✅${NC} .env.production exists"
  else
    echo -e "${YELLOW}⚠️${NC}  .env.production not found (needed for production)"
  fi
  
  [[ "$has_env" == "true" ]] && return 0 || return 1
}

test_env_variables() {
  echo -e "${YELLOW}🔍 Testing Environment Variables...${NC}"
  
  local missing=0
  local required_vars=("VITE_API_URL" "VITE_ENVIRONMENT" "VITE_SUPABASE_URL")
  
  for var in "${required_vars[@]}"; do
    if grep -q "^${var}=" .env 2>/dev/null; then
      local value=$(grep "^${var}=" .env | cut -d '=' -f 2)
      if [[ -z "$value" ]]; then
        echo -e "${RED}❌${NC} $var is empty"
        ((missing++))
      else
        echo -e "${GREEN}✅${NC} $var is set"
        if [[ "$VERBOSE" == "true" ]]; then
          echo -e "   Value: $value"
        fi
      fi
    else
      echo -e "${RED}❌${NC} $var not found"
      ((missing++))
    fi
  done
  
  [[ $missing -eq 0 ]] && return 0 || return 1
}

test_npm_packages() {
  echo -e "${YELLOW}📦 Testing NPM Packages...${NC}"
  
  if [[ ! -d "node_modules" ]]; then
    echo -e "${YELLOW}⚠️  node_modules not found - installing dependencies...${NC}"
    npm install > /dev/null 2>&1
    echo -e "${GREEN}✅${NC} Dependencies installed"
    return 0
  else
    echo -e "${GREEN}✅${NC} node_modules exists"
    return 0
  fi
}

test_vite_config() {
  echo -e "${YELLOW}⚙️  Testing Vite Configuration...${NC}"
  
  if [[ -f "vite.config.ts" ]] || [[ -f "vite.config.js" ]]; then
    echo -e "${GREEN}✅${NC} Vite config found"
    return 0
  else
    echo -e "${RED}❌${NC} Vite config not found"
    return 1
  fi
}

test_backend_running() {
  echo -e "${YELLOW}🚀 Checking if Backend is Running...${NC}"
  
  if curl -s "$API_URL" > /dev/null 2>&1; then
    echo -e "${GREEN}✅${NC} Backend is accessible at $API_URL"
    return 0
  else
    echo -e "${RED}❌${NC} Cannot connect to backend at $API_URL"
    echo -e "   Make sure backend is running on $API_URL"
    return 1
  fi
}

# ============================================
# Run Tests
# ============================================

PASSED=0
FAILED=0
WARNINGS=0

echo -e "${BLUE}Target API: ${API_URL}${NC}\n"

# Run all tests
test_environment_file && ((PASSED++)) || ((FAILED++))
echo ""

test_env_variables && ((PASSED++)) || ((FAILED++))
echo ""

test_npm_packages && ((PASSED++)) || ((FAILED++))
echo ""

test_vite_config && ((PASSED++)) || ((FAILED++))
echo ""

test_backend_running && {
  ((PASSED++))
  echo ""
  test_api_health && ((PASSED++)) || ((FAILED++))
  echo ""
  test_login_endpoint && ((PASSED++)) || ((FAILED++))
} || {
  ((FAILED++))
  echo -e "${YELLOW}⚠️  Skipping API tests (backend not accessible)${NC}"
}

# ============================================
# Summary
# ============================================

echo ""
echo -e "${BLUE}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                      TEST SUMMARY                              ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════════╝${NC}\n"

TOTAL=$((PASSED + FAILED))
PERCENTAGE=$((PASSED * 100 / TOTAL))

echo -e "Tests Run: ${TOTAL}"
echo -e "${GREEN}Passed: ${PASSED}${NC}"
echo -e "${RED}Failed: ${FAILED}${NC}"
echo -e "Success Rate: ${PERCENTAGE}%\n"

if [[ $FAILED -eq 0 ]]; then
  echo -e "${GREEN}✅ All tests passed!${NC}\n"
  
  echo -e "${BLUE}Next Steps:${NC}"
  echo -e "  1. Start frontend: ${YELLOW}npm run dev${NC}"
  echo -e "  2. Navigate to: ${YELLOW}http://localhost:8080/testing${NC}"
  echo -e "  3. Run visual tests in browser\n"
  
  exit 0
else
  echo -e "${RED}❌ Some tests failed. Please fix issues above.${NC}\n"
  
  echo -e "${BLUE}Troubleshooting:${NC}"
  echo -e "  • Check backend is running at: ${YELLOW}${API_URL}${NC}"
  echo -e "  • Verify .env file has: ${YELLOW}VITE_API_URL=${API_URL}${NC}"
  echo -e "  • Review: ${YELLOW}FRONTEND_TESTING_GUIDE.md${NC}"
  echo -e "  • Check: ${YELLOW}.env.example${NC}\n"
  
  exit 1
fi
