const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function replaceInFile(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  
  const replacements = [
    // Backgrounds
    { regex: /bg-white(?! dark:bg-)/g, replacement: 'bg-white dark:bg-gray-800' },
    { regex: /bg-\[#F8FAF9\](?! dark:bg-)/gi, replacement: 'bg-[#F8FAF9] dark:bg-gray-900' },
    { regex: /bg-\[#ECFDF5\](?! dark:bg-)/gi, replacement: 'bg-[#ECFDF5] dark:bg-gray-800' },
    { regex: /bg-\[#022C22\](?! dark:bg-)/gi, replacement: 'bg-[#022C22] dark:bg-gray-950' },
    { regex: /bg-\[#D1FAE5\](?! dark:bg-)/gi, replacement: 'bg-[#D1FAE5] dark:bg-gray-700' },
    
    // Texts
    { regex: /text-\[#1A2E1A\](?! dark:text-)/gi, replacement: 'text-[#1A2E1A] dark:text-gray-100' },
    { regex: /text-\[#4A5D4A\](?! dark:text-)/gi, replacement: 'text-[#4A5D4A] dark:text-gray-300' },
    { regex: /text-\[#6B7E6B\](?! dark:text-)/gi, replacement: 'text-[#6B7E6B] dark:text-gray-400' },
    { regex: /text-\[#064E3B\](?! dark:text-)/gi, replacement: 'text-[#064E3B] dark:text-emerald-300' },
    { regex: /text-\[#059669\](?! dark:text-)/gi, replacement: 'text-[#059669] dark:text-emerald-400' },
    { regex: /text-\[#047857\](?! dark:text-)/gi, replacement: 'text-[#047857] dark:text-emerald-400' },
    
    // Borders
    { regex: /border-\[#E5EBE5\](?! dark:border-)/gi, replacement: 'border-[#E5EBE5] dark:border-gray-700' },
    { regex: /border-\[#C8D5C8\](?! dark:border-)/gi, replacement: 'border-[#C8D5C8] dark:border-gray-600' },
    
    // Hovers
    { regex: /hover:bg-\[#ECFDF5\](?! dark:hover:bg-)/gi, replacement: 'hover:bg-[#ECFDF5] dark:hover:bg-gray-700' },
    { regex: /hover:text-\[#064E3B\](?! dark:hover:text-)/gi, replacement: 'hover:text-[#064E3B] dark:hover:text-emerald-200' },
    
    // Group hovers
    { regex: /group-hover:text-\[#059669\](?! dark:group-hover:text-)/gi, replacement: 'group-hover:text-[#059669] dark:group-hover:text-emerald-400' },
    { regex: /group-hover:text-\[#064E3B\](?! dark:group-hover:text-)/gi, replacement: 'group-hover:text-[#064E3B] dark:group-hover:text-emerald-300' },
    
    // Hero Banners specific
    { regex: /bg-gradient-to-r from-\[#064E3B\] via-\[#047857\] to-\[#10B981\](?! dark:from-)/gi, replacement: 'bg-gradient-to-r from-[#064E3B] via-[#047857] to-[#10B981] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900' },
    
    // Focus rings
    { regex: /focus:border-\[#10B981\](?! dark:focus:border-)/gi, replacement: 'focus:border-[#10B981] dark:focus:border-emerald-500' },
    { regex: /focus:ring-\[#10B981\](?! dark:focus:ring-)/gi, replacement: 'focus:ring-[#10B981] dark:focus:ring-emerald-500' }
  ];
  
  replacements.forEach(r => {
    content = content.replace(r.regex, r.replacement);
  });
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

walkDir('src/app/(public)', replaceInFile);
walkDir('src/components/public', replaceInFile);
