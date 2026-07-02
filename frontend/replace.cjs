const fs = require('fs');
const path = require('path');

const targetDirs = [
  'a:/New project/SDC_Portal/frontend/src/pages',
  'a:/New project/SDC_Portal/frontend/src/layouts',
  'a:/New project/SDC_Portal/frontend/src/components'
];

const replaceRules = [
  { regex: /emerald/g, replacement: 'sky' },
  { regex: /orange/g, replacement: 'cyan' },
  { regex: /red/g, replacement: 'blue' },
  { regex: /yellow/g, replacement: 'indigo' },
  { regex: /purple/g, replacement: 'sky' },
  { regex: /teal/g, replacement: 'cyan' },
  { regex: /gray-500/g, replacement: 'slate-500' },
  { regex: /gray-400/g, replacement: 'slate-400' },
];

function processDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      let original = content;
      for (const rule of replaceRules) {
        content = content.replace(rule.regex, rule.replacement);
      }
      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf-8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

targetDirs.forEach(processDirectory);
console.log('Color replacement complete.');
