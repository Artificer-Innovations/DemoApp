#!/bin/bash

# Generate TypeScript types from Supabase database schema
# This script uses the Supabase CLI to generate types from the local database

set -e

echo "🔧 Generating TypeScript types from database schema..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Please install it first:"
    echo "   brew install supabase/tap/supabase"
    exit 1
fi

# Check if Supabase is running
if ! supabase status &> /dev/null; then
    echo "❌ Supabase is not running. Please start it first:"
    echo "   supabase start"
    exit 1
fi

# Create types directories if they don't exist
mkdir -p apps/mobile/src/types
mkdir -p apps/web/src/types
mkdir -p packages/shared/src/types

# Generate types from local database
echo "📊 Generating types from local database..."
supabase gen types typescript --local > packages/shared/src/types/database.ts

# Copy types to mobile and web apps
echo "📱 Copying types to mobile app..."
cp packages/shared/src/types/database.ts apps/mobile/src/types/database.ts

echo "🌐 Copying types to web app..."
cp packages/shared/src/types/database.ts apps/web/src/types/database.ts

# Add export to shared package index
echo "📦 Adding types export to shared package..."
if ! grep -q "export.*database" packages/shared/src/index.ts; then
    echo "" >> packages/shared/src/index.ts
    echo "// Database types" >> packages/shared/src/index.ts
    echo "export * from './types/database';" >> packages/shared/src/index.ts
fi

echo "✅ TypeScript types generated successfully!"
echo "📁 Types available in:"
echo "   - packages/shared/src/types/database.ts"
echo "   - apps/mobile/src/types/database.ts"
echo "   - apps/web/src/types/database.ts"
