import fs from 'fs/promises';
import path from 'path';

const SRC_DIR = path.join(process.cwd(), 'src');

async function processDirectory(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      await processDirectory(fullPath);
    } else if (entry.isFile() && (fullPath.endsWith('.jsx') || fullPath.endsWith('.js') || fullPath.endsWith('.css'))) {
      let content = await fs.readFile(fullPath, 'utf8');
      let updated = false;
      
      if (content.includes('pc-emerald')) {
        content = content.replace(/pc-emerald/g, 'pc-green');
        updated = true;
      }
      
      if (content.includes('pc-gold')) {
        content = content.replace(/pc-gold/g, 'pc-purple');
        updated = true;
      }
      
      if (updated) {
        await fs.writeFile(fullPath, content, 'utf8');
        console.log(`Updated colors: ${fullPath}`);
      }
    }
  }
}

async function main() {
  await processDirectory(SRC_DIR);
  console.log('Rebrand colors search & replace complete.');
}

main().catch(console.error);
