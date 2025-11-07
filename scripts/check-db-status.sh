#!/bin/bash

# Database Status Check Script
# Check which migrations are applied across all environments

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check migration status for an environment
check_environment() {
    local env_name=$1
    local project_ref=$2
    
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "  $env_name"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    if [ -z "$project_ref" ]; then
        print_warning "Environment variable not set, skipping..."
        return
    fi
    
    if ! command -v supabase &> /dev/null; then
        print_error "Supabase CLI not found"
        return
    fi
    
    if supabase link --project-ref "$project_ref" >/dev/null 2>&1; then
        print_status "Linked to $env_name database"
        if supabase migration list >/dev/null 2>&1; then
            supabase migration list
        else
            print_warning "Failed to list migrations"
        fi
    else
        print_warning "Failed to link to $env_name database"
    fi
}

# Function to check local Supabase
check_local() {
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "  🏠 LOCAL"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    if ! command -v supabase &> /dev/null; then
        print_error "Supabase CLI not found"
        return
    fi
    
    # Check if Supabase is running locally
    if ! supabase status >/dev/null 2>&1; then
        print_warning "Local Supabase is not running. Start it with: supabase start"
        return
    fi
    
    print_status "Local Supabase is running"
    
    # For local, we can list migrations from the filesystem or use db remote commands
    # Try to get the local project ref from status
    local project_ref=$(supabase status --output json 2>/dev/null | grep -o '"project_ref":"[^"]*"' | cut -d'"' -f4 || echo "")
    
    if [ -n "$project_ref" ] && [ "$project_ref" != "null" ]; then
        # Link using the local project ref
        if supabase link --project-ref "$project_ref" >/dev/null 2>&1; then
            if supabase migration list >/dev/null 2>&1; then
                supabase migration list
            else
                print_warning "Failed to list migrations"
            fi
        else
            # Fallback: just show migration files
            if [ -d "supabase/migrations" ] && [ "$(ls -A supabase/migrations 2>/dev/null)" ]; then
                print_status "Migration files in supabase/migrations:"
                ls -1 supabase/migrations/*.sql 2>/dev/null | xargs -n1 basename || print_warning "No migration files found"
            else
                print_warning "No migrations directory or migration files found"
            fi
        fi
    else
        # Fallback: just show migration files
        if [ -d "supabase/migrations" ] && [ "$(ls -A supabase/migrations 2>/dev/null)" ]; then
            print_status "Migration files in supabase/migrations:"
            ls -1 supabase/migrations/*.sql 2>/dev/null | xargs -n1 basename || print_warning "No migration files found"
        else
            print_warning "Could not determine local project status"
        fi
    fi
}

echo ""
print_status "📊 Checking database status across all environments..."
echo ""

# Check LOCAL (special handling - no linking required)
check_local

# Check PR TESTING
check_environment "🧪 PR TESTING" "$PR_TESTING_SUPABASE_PROJECT_REF"

# Check STAGING
check_environment "🎭 STAGING" "$STAGING_SUPABASE_PROJECT_REF"

# Check PRODUCTION
check_environment "🚀 PRODUCTION" "$PRODUCTION_SUPABASE_PROJECT_REF"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
print_success "Database status check complete!"
echo ""

