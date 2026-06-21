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
      const content = await fs.readFile(fullPath, 'utf8');
      
      // Replace all instances of 'elevated-' with 'pc-'
      if (content.includes('elevated-')) {
        const newContent = content.replace(/elevated-/g, 'pc-');
        await fs.writeFile(fullPath, newContent, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
      
      // Also update any specific component class names or imports if necessary
      // For example, in Navbar.jsx, we will handle the logo replacement manually next.
    }
  }
}

async function main() {
  await processDirectory(SRC_DIR);
  console.log('Rebrand search & replace complete.');
}

main().catch(console.error);
