const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

/**
 * Expo config plugin to ensure splashscreen_background color is always present
 * This fixes the issue where clean prebuilds don't include the color resource
 */
const withSplashScreenColor = (config) => {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const backgroundColor = config.splash?.backgroundColor || config.android?.splash?.backgroundColor || '#ffffff';
      
      // Path to colors.xml
      const colorsPath = path.join(
        config.modRequest.platformProjectRoot,
        'app/src/main/res/values/colors.xml'
      );
      
      // Path to values-night/colors.xml
      const colorsNightPath = path.join(
        config.modRequest.platformProjectRoot,
        'app/src/main/res/values-night/colors.xml'
      );
      
      // Ensure directories exist
      const colorsDir = path.dirname(colorsPath);
      const colorsNightDir = path.dirname(colorsNightPath);
      if (!fs.existsSync(colorsDir)) {
        fs.mkdirSync(colorsDir, { recursive: true });
      }
      if (!fs.existsSync(colorsNightDir)) {
        fs.mkdirSync(colorsNightDir, { recursive: true });
      }
      
      // Helper function to add color to a colors.xml file
      const addColorToFile = (filePath, colorValue) => {
        // Ensure the directory exists
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        
        let content = '';
        if (fs.existsSync(filePath)) {
          content = fs.readFileSync(filePath, 'utf8');
        } else {
          content = '<resources>\n</resources>';
        }
        
        // Check if splashscreen_background already exists
        if (content.includes('name="splashscreen_background"')) {
          return; // Already exists, no need to add
        }
        
        // Handle self-closing <resources/> tag (with or without whitespace)
        const trimmedContent = content.trim();
        if (trimmedContent === '<resources/>' || trimmedContent.match(/^<resources\s*\/>$/)) {
          content = `<resources>\n  <color name="splashscreen_background">${colorValue}</color>\n</resources>`;
        } else if (content.includes('</resources>')) {
          // Handle normal <resources>...</resources> tag
          content = content.replace(
            '</resources>',
            `  <color name="splashscreen_background">${colorValue}</color>\n</resources>`
          );
        } else {
          // Fallback: create new file
          content = `<resources>\n  <color name="splashscreen_background">${colorValue}</color>\n</resources>`;
        }
        
        fs.writeFileSync(filePath, content, 'utf8');
      };
      
      // Add color to both files
      addColorToFile(colorsPath, backgroundColor);
      addColorToFile(colorsNightPath, backgroundColor);
      
      // Ensure night mode file has the color (handle case where file is created after our plugin runs)
      // Read the file again to check if it was modified by another plugin
      if (fs.existsSync(colorsNightPath)) {
        const finalContent = fs.readFileSync(colorsNightPath, 'utf8');
        if (!finalContent.includes('name="splashscreen_background"')) {
          // File exists but doesn't have our color - add it
          addColorToFile(colorsNightPath, backgroundColor);
        }
      }
      
      return config;
    },
  ]);
};

module.exports = withSplashScreenColor;
