import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dir = path.join(__dirname, 'courseData');

let total = 0;
const files = fs.readdirSync(dir).filter(f => f.startsWith('stage') && f.endsWith('.js'));
for (const f of files) {
    const code = fs.readFileSync(path.join(dir, f), 'utf8');
    const func = new Function('return ' + code.replace(/export const \w+ = /, ''));
    const data = func();
    const count = data.chapters.reduce((sum, c) => sum + c.lessons.length, 0);
    console.log(`${f}: ${count} concepts`);
    total += count;
}
console.log(`Total: ${total} concepts`);
