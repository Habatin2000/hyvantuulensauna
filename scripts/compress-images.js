const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images');
const MAX_WIDTH = 1920;
const JPEG_QUALITY = 80;

async function compressImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const statBefore = fs.statSync(filePath);
  const kbBefore = (statBefore.size / 1024).toFixed(1);

  let pipeline = sharp(filePath);
  const metadata = await pipeline.metadata();

  // Resize if wider than MAX_WIDTH
  if (metadata.width > MAX_WIDTH) {
    pipeline = pipeline.resize(MAX_WIDTH, null, { withoutEnlargement: true });
  }

  if (ext === '.jpg' || ext === '.jpeg') {
    pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, progressive: true, mozjpeg: true });
  } else if (ext === '.png') {
    // Try palette-based PNG, fallback to compressed non-palette if it gets bigger
    const bufPalette = await pipeline.clone().png({ compressionLevel: 9, palette: true }).toBuffer();
    const bufNormal = await pipeline.clone().png({ compressionLevel: 9, palette: false }).toBuffer();
    const outputBuffer = bufPalette.length <= bufNormal.length ? bufPalette : bufNormal;
    fs.writeFileSync(filePath, outputBuffer);
    const kbAfter = (fs.statSync(filePath).size / 1024).toFixed(1);
    return { kbBefore, kbAfter, resized: metadata.width > MAX_WIDTH };
  } else {
    // Skip other formats
    return null;
  }

  await pipeline.toFile(filePath + '.tmp');
  fs.renameSync(filePath + '.tmp', filePath);
  const kbAfter = (fs.statSync(filePath).size / 1024).toFixed(1);
  return { kbBefore, kbAfter, resized: metadata.width > MAX_WIDTH };
}

async function main() {
  const files = fs.readdirSync(IMAGES_DIR).filter(f => {
    const ext = path.extname(f).toLowerCase();
    return ext === '.jpg' || ext === '.jpeg' || ext === '.png';
  });

  let totalBefore = 0;
  let totalAfter = 0;
  let processed = 0;

  for (const file of files) {
    const filePath = path.join(IMAGES_DIR, file);
    try {
      const result = await compressImage(filePath);
      if (!result) continue;
      processed++;
      totalBefore += parseFloat(result.kbBefore);
      totalAfter += parseFloat(result.kbAfter);
      const saved = ((1 - result.kbAfter / result.kbBefore) * 100).toFixed(1);
      const resizeTag = result.resized ? ' [resized]' : '';
      console.log(`${file}: ${result.kbBefore} KB → ${result.kbAfter} KB (${saved}% saved)${resizeTag}`);
    } catch (err) {
      console.error(`ERROR processing ${file}:`, err.message);
    }
  }

  const overallSaved = ((1 - totalAfter / totalBefore) * 100).toFixed(1);
  console.log(`\n=== Summary ===`);
  console.log(`Processed: ${processed} images`);
  console.log(`Before: ${(totalBefore / 1024).toFixed(2)} MB`);
  console.log(`After: ${(totalAfter / 1024).toFixed(2)} MB`);
  console.log(`Saved: ${overallSaved}%`);
}

main().catch(console.error);
