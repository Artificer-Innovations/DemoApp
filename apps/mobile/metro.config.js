const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Completely minimal config - no custom watch folders or resolvers
// This should work like the standalone app

module.exports = config;
