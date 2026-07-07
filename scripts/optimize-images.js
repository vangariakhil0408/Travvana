#!/usr/bin/env node
/* ============================================
   TRAVVANA — Image Optimization Build Script
   Converts PNG/JPG images to optimized WebP format
   during Vercel build. Reduces ~2MB PNGs to ~50-100KB WebP.
   ============================================ */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const ASSETS_DIR = 'assets/images';

// Image optimization settings
const MAX_WIDTH = 800;       // Max width for card images
const WEBP_QUALITY = 78;     // WebP quality (0-100)
const HERO_MAX_WIDTH = 1200; // Hero/banner images
const CONCURRENCY = 10;      // Parallel conversions

// Files/dirs to copy (non-image assets)
const COPY_PATTERNS = [
  '*.html',
  'styles/**',
  'js/**',
  'data/**',
  'vercel.json',
  'assets/images/logo.png',  // Keep logo as PNG
];

/**
 * Recursively find all files matching extensions in a directory
 */
function findFiles(dir, extensions) {
  const results = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findFiles(fullPath, extensions));
    } else if (extensions.some(ext => entry.name.toLowerCase().endsWith(ext))) {
      results.push(fullPath);
    }
  }
  return results;
}

/**
 * Copy a file, creating directories as needed
 */
function copyFile(src, dest) {
  const destDir = path.dirname(dest);
  fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync(src, dest);
}

/**
 * Recursively copy a directory
 */
function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFile(srcPath, destPath);
    }
  }
}

/**
 * Check if a file is an LFS pointer (not a real image)
 */
function isLFSPointer(filePath) {
  try {
    const fd = fs.openSync(filePath, 'r');
    const buf = Buffer.alloc(44);
    fs.readSync(fd, buf, 0, 44, 0);
    fs.closeSync(fd);
    return buf.toString('utf8').startsWith('version https://git-lfs');
  } catch {
    return false;
  }
}

/**
 * Convert a single image to WebP
 */
async function convertImage(srcPath, destPath) {
  try {
    // Skip LFS pointers
    if (isLFSPointer(srcPath)) {
      // Just copy the pointer file as-is
      copyFile(srcPath, destPath);
      return { status: 'skipped-lfs', src: srcPath };
    }

    const stat = fs.statSync(srcPath);
    // Skip very small files (likely broken or placeholder)
    if (stat.size < 100) {
      copyFile(srcPath, destPath);
      return { status: 'skipped-small', src: srcPath };
    }

    // Determine max width based on whether it's a hero image
    const isHero = srcPath.includes('hero') || srcPath.includes('banner');
    const maxWidth = isHero ? HERO_MAX_WIDTH : MAX_WIDTH;

    // Change extension to .webp
    const webpDest = destPath.replace(/\.(png|jpg|jpeg)$/i, '.webp');
    const webpDir = path.dirname(webpDest);
    fs.mkdirSync(webpDir, { recursive: true });

    await sharp(srcPath)
      .resize(maxWidth, null, { 
        withoutEnlargement: true,
        fit: 'inside'
      })
      .webp({ quality: WEBP_QUALITY, effort: 4 })
      .toFile(webpDest);

    // Also create a compressed fallback in original format
    const ext = path.extname(srcPath).toLowerCase();
    if (ext === '.png') {
      await sharp(srcPath)
        .resize(maxWidth, null, { withoutEnlargement: true, fit: 'inside' })
        .png({ quality: 80, compressionLevel: 9 })
        .toFile(destPath);
    } else {
      await sharp(srcPath)
        .resize(maxWidth, null, { withoutEnlargement: true, fit: 'inside' })
        .jpeg({ quality: 75, mozjpeg: true })
        .toFile(destPath);
    }

    const origSize = stat.size;
    const webpSize = fs.statSync(webpDest).size;
    const savings = ((1 - webpSize / origSize) * 100).toFixed(0);

    return { status: 'converted', src: srcPath, origSize, webpSize, savings };
  } catch (err) {
    // If sharp fails (corrupt file, etc.), just copy the original
    try { copyFile(srcPath, destPath); } catch {}
    return { status: 'error', src: srcPath, error: err.message };
  }
}

/**
 * Process images in batches for controlled concurrency
 */
async function processBatch(items, fn, concurrency) {
  const results = [];
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    const batchResults = await Promise.all(batch.map(fn));
    results.push(...batchResults);
    
    // Progress reporting
    const done = Math.min(i + concurrency, items.length);
    const pct = ((done / items.length) * 100).toFixed(0);
    process.stdout.write(`\r  Progress: ${done}/${items.length} (${pct}%)`);
  }
  process.stdout.write('\n');
  return results;
}

async function main() {
  console.log('🔧 Travvana Image Optimization Build');
  console.log('====================================\n');

  const startTime = Date.now();

  // 1. Clean dist directory
  if (fs.existsSync(DIST)) {
    fs.rmSync(DIST, { recursive: true });
  }
  fs.mkdirSync(DIST, { recursive: true });
  console.log('✅ Created dist/ directory\n');

  // 2. Copy non-image files
  console.log('📁 Copying non-image files...');
  
  // Copy HTML files
  const htmlFiles = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));
  htmlFiles.forEach(f => copyFile(path.join(ROOT, f), path.join(DIST, f)));
  console.log(`  ${htmlFiles.length} HTML files`);

  // Copy directories
  ['styles', 'js', 'data'].forEach(dir => {
    const src = path.join(ROOT, dir);
    if (fs.existsSync(src)) {
      copyDir(src, path.join(DIST, dir));
      console.log(`  ${dir}/`);
    }
  });

  // Copy vercel.json
  const vercelJson = path.join(ROOT, 'vercel.json');
  if (fs.existsSync(vercelJson)) {
    copyFile(vercelJson, path.join(DIST, 'vercel.json'));
  }

  // Copy logo as-is (keep as PNG)
  const logoSrc = path.join(ROOT, 'assets/images/logo.png');
  if (fs.existsSync(logoSrc)) {
    const logoDest = path.join(DIST, 'assets/images/logo.png');
    fs.mkdirSync(path.dirname(logoDest), { recursive: true });
    copyFile(logoSrc, logoDest);
    console.log('  logo.png (kept as PNG)');
  }
  console.log('');

  // 3. Find all images to optimize
  const imagesDir = path.join(ROOT, ASSETS_DIR);
  const imageFiles = findFiles(imagesDir, ['.png', '.jpg', '.jpeg'])
    .filter(f => !f.endsWith('logo.png')); // Skip logo (already copied)

  console.log(`🖼️  Found ${imageFiles.length} images to optimize`);
  console.log(`  Max width: ${MAX_WIDTH}px (hero: ${HERO_MAX_WIDTH}px)`);
  console.log(`  WebP quality: ${WEBP_QUALITY}`);
  console.log(`  Concurrency: ${CONCURRENCY}\n`);

  // 4. Convert images
  console.log('🔄 Converting images to WebP...');
  const results = await processBatch(
    imageFiles,
    (srcPath) => {
      const relPath = path.relative(ROOT, srcPath);
      const destPath = path.join(DIST, relPath);
      return convertImage(srcPath, destPath);
    },
    CONCURRENCY
  );

  // 5. Summary
  const converted = results.filter(r => r.status === 'converted');
  const skippedLFS = results.filter(r => r.status === 'skipped-lfs');
  const skippedSmall = results.filter(r => r.status === 'skipped-small');
  const errors = results.filter(r => r.status === 'error');

  const totalOrigSize = converted.reduce((s, r) => s + r.origSize, 0);
  const totalWebpSize = converted.reduce((s, r) => s + r.webpSize, 0);
  const totalSavings = totalOrigSize > 0 ? ((1 - totalWebpSize / totalOrigSize) * 100).toFixed(1) : 0;

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log('\n📊 Build Summary');
  console.log('================');
  console.log(`  Converted:    ${converted.length} images`);
  console.log(`  Skipped (LFS): ${skippedLFS.length}`);
  console.log(`  Skipped (small): ${skippedSmall.length}`);
  console.log(`  Errors:       ${errors.length}`);
  console.log(`  Original:     ${(totalOrigSize / 1024 / 1024).toFixed(1)} MB`);
  console.log(`  WebP:         ${(totalWebpSize / 1024 / 1024).toFixed(1)} MB`);
  console.log(`  Savings:      ${totalSavings}%`);
  console.log(`  Time:         ${elapsed}s`);

  if (errors.length > 0) {
    console.log('\n⚠️  Errors:');
    errors.slice(0, 10).forEach(e => console.log(`  - ${path.relative(ROOT, e.src)}: ${e.error}`));
    if (errors.length > 10) console.log(`  ... and ${errors.length - 10} more`);
  }

  console.log('\n✅ Build complete! Output in dist/');
}

main().catch(err => {
  console.error('❌ Build failed:', err);
  process.exit(1);
});
