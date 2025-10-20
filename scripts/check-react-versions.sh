#!/bin/bash

echo "Checking React versions across the monorepo..."
echo ""

echo "Root:"
npm list react --depth=0 2>/dev/null || echo "Not found"
echo ""

echo "Mobile app:"
cd apps/mobile && npm list react --depth=0 2>/dev/null || echo "Not found"
cd ../..
echo ""

echo "Web app:"
cd apps/web && npm list react --depth=0 2>/dev/null || echo "Not found"
cd ../..
echo ""

echo "Shared package:"
cd packages/shared && npm list react --depth=0 2>/dev/null || echo "Not found"
cd ../..
