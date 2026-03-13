import fs from 'fs';
import path from 'path';

const SRC_DIR = './client/src';

const rules = [
    // Text colors
    { find: /text-\[\#F4A06A\]/g, replace: 'text-neutral-900 dark:text-[#F5F5DC]' },
    { find: /text-\[\#D97B3A\]/g, replace: 'text-neutral-900 dark:text-[#F5F5DC]' },
    { find: /text-\[\#2D2A26\]/g, replace: 'text-neutral-900' },
    { find: /text-\[\#F5EDE6\]/g, replace: 'text-neutral-100' },
    { find: /text-\[\#9E8B7D\]/g, replace: 'text-neutral-500' },
    { find: /text-\[\#EDD9C8\]/g, replace: 'text-neutral-400' },
    { find: /hover:text-\[\#F4A06A\]/g, replace: 'hover:text-neutral-600 dark:hover:text-[#E5E5CB]' },
    { find: /hover:text-\[\#D97B3A\]/g, replace: 'hover:text-neutral-600 dark:hover:text-[#E5E5CB]' },
    { find: /dark:text-\[\#F4A06A\]/g, replace: 'dark:text-[#F5F5DC]' },
    { find: /dark:hover:text-\[\#FAD4B4\]/g, replace: 'dark:hover:text-[#E5E5CB]' },

    // Backgrounds
    { find: /bg-\[\#F4A06A\]/g, replace: 'bg-[#F5F5DC] text-neutral-900' },
    { find: /bg-\[\#FAD4B4\]/g, replace: 'bg-neutral-100 dark:bg-neutral-800' },
    { find: /bg-\[\#D97B3A\]/g, replace: 'bg-[#E5E5CB] text-neutral-900' },
    { find: /hover:bg-\[\#FAD4B4\]/g, replace: 'hover:bg-neutral-100 dark:hover:bg-neutral-800' },
    { find: /hover:bg-\[\#D97B3A\]/g, replace: 'hover:bg-[#E5E5CB] text-neutral-900' },
    { find: /dark:bg-\[\#2A2018\]/g, replace: 'dark:bg-neutral-900' },
    { find: /bg-\[\#2A2018\]/g, replace: 'bg-neutral-900' },
    { find: /dark:bg-\[\#1A1410\]/g, replace: 'dark:bg-neutral-950' },
    { find: /dark:hover:bg-\[\#3A3025\]/g, replace: 'dark:hover:bg-neutral-800' },
    { find: /bg-\[\#EDD9C8\]/g, replace: 'bg-neutral-200 dark:bg-neutral-800' },
    { find: /dark:bg-\[\#3A3025\]/g, replace: 'dark:bg-neutral-800' },

    // Borders
    { find: /border-\[\#F4A06A\]/g, replace: 'border-neutral-900 dark:border-[#F5F5DC]' },
    { find: /hover:border-\[\#F4A06A\]/g, replace: 'hover:border-neutral-900 dark:hover:border-[#F5F5DC]' },
    { find: /border-\[\#EDD9C8\]/g, replace: 'border-neutral-200' },
    { find: /dark:border-\[\#3A3025\]/g, replace: 'dark:border-neutral-800' },

    // Rings
    { find: /focus:ring-\[\#F4A06A\]/g, replace: 'focus:ring-neutral-900 dark:focus:ring-[#F5F5DC]' },

    // Specific Gradients
    { find: /from-rose-100 to-orange-50/g, replace: 'from-neutral-100 to-neutral-50' },
    { find: /dark:from-rose-900\/30 dark:to-orange-900\/20/g, replace: 'dark:from-neutral-800 dark:to-neutral-900' },
    { find: /from-yellow-100 to-amber-50/g, replace: 'from-[#F5F5DC] to-neutral-50' },
    { find: /dark:from-yellow-900\/30 dark:to-amber-900\/20/g, replace: 'dark:from-neutral-800 dark:to-neutral-900' },

    // Specific Hex colors without prefixes (e.g. in fill, stroke, plain text)
    { find: /fill-\[\#F4A06A\]/g, replace: 'fill-neutral-900 dark:fill-[#F5F5DC]' },
];

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;
            
            for (const rule of rules) {
                if (rule.find.test(content)) {
                    content = content.replace(rule.find, rule.replace);
                    modified = true;
                }
            }

            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated: ${fullPath}`);
            }
        }
    }
}

processDirectory(SRC_DIR);
console.log('Color replacement complete.');
