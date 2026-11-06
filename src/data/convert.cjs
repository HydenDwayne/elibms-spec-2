const fs = require("fs");

const text = fs.readFileSync("dummy_data.json", "utf8");

const start = text.indexOf('"patrons"');
if (start === -1) throw new Error('Could not find "patrons" in dummy_data.json');
const open = text.indexOf("[", start);

let depth = 0, end = -1, inStr = false;
for (let i = open; i < text.length; i++) {
  const c = text[i];
  if (inStr) {
    if (c === "\\") i++;
    else if (c === '"') inStr = false;
  } else if (c === '"') inStr = true;
  else if (c === "[") depth++;
  else if (c === "]") {
    depth--;
    if (depth === 0) { end = i; break; }
  }
}

const arr = JSON.parse(text.slice(open, end + 1));
const out = Object.fromEntries(arr.map((p) => [p.id, p]));

fs.writeFileSync("patrons-import.json", JSON.stringify(out, null, 2));
console.log(`Converted ${arr.length} patrons`);