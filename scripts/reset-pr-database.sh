#!/bin/bash

# Reset PR Testing Database Script
# This script safely resets the PR testing database to a target branch state

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

TARGET_BRANCH=${1:-develop}
PR_NUMBER=${2:-manual}

echo ""
print_warning "🧹 Resetting PR testing database to '$TARGET_BRANCH' state..."
print_warning "⚠️  This will DROP ALL TABLES in the PR testing database!"
echo ""
print_warning "Press CTRL+C to cancel, or wait 5 seconds to continue..."
sleep 5

# Check if PR_TESTING_SUPABASE_PROJECT_REF is set
if [ -z "$PR_TESTING_SUPABASE_PROJECT_REF" ]; then
    print_error "PR_TESTING_SUPABASE_PROJECT_REF environment variable is not set"
    echo "Please set it in your .env.local file or export it:"
    echo "  export PR_TESTING_SUPABASE_PROJECT_REF=your-project-ref"
    exit 1
fi

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    print_error "Supabase CLI not found. Please install it first:"
    echo "   npm install -g supabase"
    exit 1
fi

# Checkout target branch
print_status "📥 Checking out $TARGET_BRANCH branch..."
git fetch origin
CURRENT_BRANCH=$(git branch --show-current)
git checkout origin/$TARGET_BRANCH 2>/dev/null || {
    print_error "Failed to checkout $TARGET_BRANCH branch"
    exit 1
}

# Link to PR testing database
print_status "🔗 Linking to PR testing database..."
if supabase link --project-ref "$PR_TESTING_SUPABASE_PROJECT_REF" 2>/dev/null; then
    print_success "Linked to PR testing database"
else
    print_warning "Database may already be linked, continuing..."
fi

# Reset database
print_status "🗑️  Dropping all tables and reapplying migrations..."
if supabase db reset --linked; then
    print_success "Database reset complete"
else
    print_error "Failed to reset database"
    git checkout "$CURRENT_BRANCH" 2>/dev/null || true
    exit 1
fi

# Seed test data
print_status "🌱 Seeding test data..."
if supabase db seed --linked; then
    print_success "Test data seeded"
else
    print_warning "Failed to seed test data (this may be expected if seed.sql doesn't exist)"
fi

# Generate types
print_status "📝 Generating TypeScript types..."
mkdir -p apps/mobile/src/types
mkdir -p apps/web/src/types
mkdir -p packages/shared/src/types

if supabase gen types typescript --linked > packages/shared/src/types/database.ts; then
    cp packages/shared/src/types/database.ts apps/mobile/src/types/database.ts
    cp packages/shared/src/types/database.ts apps/web/src/types/database.ts
    print_success "TypeScript types generated"
else
    print_warning "Failed to generate types"
fi

# Restore original branch if we changed it
if [ "$CURRENT_BRANCH" != "" ] && [ "$CURRENT_BRANCH" != "HEAD" ]; then
    print_status "Restoring original branch: $CURRENT_BRANCH"
    git checkout "$CURRENT_BRANCH" 2>/dev/null || true
fi

echo ""
print_success "✅ PR testing database reset complete!"
print_status "📊 Database is now at '$TARGET_BRANCH' state"
print_status "🎯 Ready for PR #$PR_NUMBER migrations (if applicable)"
echo ""
echo "Next steps:"
echo "  1. Checkout your PR branch: git checkout your-feature-branch"
echo "  2. Apply PR migrations: supabase db push"
echo "  3. Deploy your changes"
echo ""

