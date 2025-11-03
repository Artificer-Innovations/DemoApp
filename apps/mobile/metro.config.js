const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Prioritize platform-specific extensions for proper resolution
// When importing '@shared/components/forms/FormInput', Metro will try extensions in order:
// 1. FormInput.native.tsx (if .native.tsx is first in sourceExts)
// 2. FormInput.tsx
// This ensures platform-specific files are found first
const { sourceExts } = config.resolver;

// Remove any existing .native extensions to reorder them
const otherExts = sourceExts.filter(ext => !ext.includes('.native'));
const nativeExts = sourceExts.filter(ext => ext.includes('.native'));

// Put .native extensions first, then other extensions
config.resolver.sourceExts = [
  '.native.tsx',
  '.native.ts',
  ...nativeExts.filter(ext => ext !== '.native.tsx' && ext !== '.native.ts'),
  ...otherExts,
];

// Ensure Metro can resolve node_modules from workspace root
// This fixes issues with expo-constants and other dependencies
config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

module.exports = config;
