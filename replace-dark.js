const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function replaceInFile(filePath) {
  if (!filePath.endsWith('.tsx')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  const replacements = [
    { regex: /bg-white(?! dark:bg-gray)/g, replacement: 'bg-white dark:bg-gray-800' },
    { regex: /bg-gray-50(?! dark:bg-gray)/g, replacement: 'bg-gray-50 dark:bg-gray-900' },
    { regex: /bg-surface-secondary(?! dark:bg-gray)/g, replacement: 'bg-surface-secondary dark:bg-gray-900' },
    { regex: /bg-surface-tertiary(?! dark:bg-gray)/g, replacement: 'bg-surface-tertiary dark:bg-gray-800' },
    
    { regex: /text-gray-800(?! dark:text-gray)/g, replacement: 'text-gray-800 dark:text-gray-100' },
    { regex: /text-gray-900(?! dark:text-gray)/g, replacement: 'text-gray-900 dark:text-gray-100' },
    { regex: /text-gray-700(?! dark:text-gray)/g, replacement: 'text-gray-700 dark:text-gray-200' },
    { regex: /text-gray-600(?! dark:text-gray)/g, replacement: 'text-gray-600 dark:text-gray-300' },
    { regex: /text-gray-500(?! dark:text-gray)/g, replacement: 'text-gray-500 dark:text-gray-400' },
    
    { regex: /text-primary-900(?! dark:text-primary)/g, replacement: 'text-primary-900 dark:text-primary-100' },
    { regex: /text-primary-800(?! dark:text-primary)/g, replacement: 'text-primary-800 dark:text-primary-200' },
    
    { regex: /border-gray-100(?! dark:border-gray)/g, replacement: 'border-gray-100 dark:border-gray-700' },
    { regex: /border-gray-200(?! dark:border-gray)/g, replacement: 'border-gray-200 dark:border-gray-700' },
  ];
  
  let original = content;
  replacements.forEach(r => {
    content = content.replace(r.regex, r.replacement);
  });
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

walkDir('src/app/(public)', replaceInFile);
if (fs.existsSync('src/components/public')) {
  walkDir('src/components/public', replaceInFile);
}
