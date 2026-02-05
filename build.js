import fs from 'node:fs/promises';
import path from 'node:path';

const DIST_DIR = './dist';
const SRC_DIR = './src';
const OUTPUT_FILE = './index.html'; // Излазни фајл у корену

async function build() {
  try {
    const htmlTemplate = await fs.readFile(
      path.join(SRC_DIR, 'index.html'),
      'utf-8'
    );
    const cssContent = await fs.readFile(
      path.join(SRC_DIR, 'styles.css'),
      'utf-8'
    );

    // Читамо све компајлиране JS фајлове
    // Редослед је битан због зависности (dependency graph)
    const jsFiles = ['types.js', 'data.js', 'qr-lib.js', 'utils.js', 'main.js'];
    let jsBundle = '';

    for (const file of jsFiles) {
      const filePath = path.join(DIST_DIR, file);

      try {
        await fs.access(filePath, fs.constants.F_OK);
        let content = await fs.readFile(filePath, 'utf-8');
        // Уклањамо export/import изразе јер спајамо све у један фајл
        content = content.replace(/export\s+default/g, '');
        content = content.replace(/export\s+/g, '');
        content = content.replace(/import\s+.*?;/g, '');
        jsBundle += `\n// --- ${file} ---\n${content}\n`;
      } catch {
        console.warn(`Warning: ${file} not found inside dist/`);
      }
    }

    // Убацивање CSS-а и JS-а у HTML
    let finalHtml = htmlTemplate
      .replace('</head>', () => `<style>${cssContent}</style></head>`)
      .replace('</body>', () => `<script>\n${jsBundle}\n</script></body>`);

    await fs.writeFile(OUTPUT_FILE, finalHtml);
    console.log(`Successfully built to ${OUTPUT_FILE}`);

    // Копирај PWA фајлове и иконице
    const pwaFiles = [
      'manifest.json',
      'sw.js',
      'icon-192.svg',
      'icon-512.svg',
      'favicon.svg',
      '.nojekyll',
    ];

    for (const file of pwaFiles) {
      try {
        await fs.copyFile(path.join(SRC_DIR, file), path.join('.', file));
        console.log(`Copied ${file}`);
      } catch (err) {
        console.warn(`Warning: Could not copy ${file}`);
      }
    }

    console.log('\n✓ Build complete! Ready for GitHub Pages deployment.');
    console.log('  All files are in the root directory.');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build();
