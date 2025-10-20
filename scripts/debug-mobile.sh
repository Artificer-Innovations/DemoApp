#!/bin/bash
# scripts/debug-mobile.sh

echo "=== Debugging Mobile App Setup ==="
echo ""

echo "1. Checking Node version:"
node --version
echo ""

echo "2. Checking Expo version:"
npx expo --version
echo ""

echo "3. Checking if @babel/runtime is installed:"
cd apps/mobile
npm list @babel/runtime 2>/dev/null || echo "❌ NOT FOUND"
echo ""

echo "4. Checking if it's in node_modules:"
if [ -d "node_modules/@babel/runtime" ]; then
    echo "✅ Found in apps/mobile/node_modules"
else
    echo "❌ Not found in apps/mobile/node_modules"
fi
echo ""

echo "5. Checking if it's in root node_modules:"
cd ../..
if [ -d "node_modules/@babel/runtime" ]; then
    echo "✅ Found in root node_modules"
else
    echo "❌ Not found in root node_modules"
fi
echo ""

echo "6. Checking React version:"
cd apps/mobile
npm list react 2>/dev/null | grep react@
echo ""

echo "7. Checking babel-preset-expo:"
npm list babel-preset-expo 2>/dev/null | grep babel-preset-expo@
echo ""

echo "Done! Check for any ❌ marks above."
