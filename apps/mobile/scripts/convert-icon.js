const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Source SVG is in the root assets directory
const sourceSvgPath = path.join(__dirname, '../../../assets/demo-flask-icon.svg');
// Copy to mobile assets for Expo to use
const mobileSvgPath = path.join(__dirname, '../assets/demo-flask-icon.svg');
const pngPath = path.join(__dirname, '../assets/icon.png');

async function convertIcon() {
  try {
    // Copy source SVG to mobile assets directory (for Expo)
    if (!fs.existsSync(mobileSvgPath) || 
        fs.statSync(sourceSvgPath).mtime > fs.statSync(mobileSvgPath).mtime) {
      fs.copyFileSync(sourceSvgPath, mobileSvgPath);
      console.log(`✓ Copied source icon from ${sourceSvgPath} to ${mobileSvgPath}`);
    }
    
    // Convert SVG to 1024x1024 PNG (Expo requires 1024x1024 for app icon)
    await sharp(sourceSvgPath)
      .resize(1024, 1024, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 } // Transparent background
      })
      .png()
      .toFile(pngPath);
    
    console.log(`✓ Successfully converted ${sourceSvgPath} to ${pngPath}`);
    console.log(`  Icon size: 1024x1024 pixels`);
  } catch (error) {
    console.error('Error converting icon:', error);
    process.exit(1);
  }
}

convertIcon();

