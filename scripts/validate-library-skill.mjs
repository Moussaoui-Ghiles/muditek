import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { extname, relative, resolve, sep } from "node:path";

const [sourceArg, exampleArg] = process.argv.slice(2);

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}

if (!sourceArg || !exampleArg) {
  fail("Usage: node scripts/validate-library-skill.mjs <source-directory> <example-path>");
}

const root = process.cwd();
const source = resolve(root, sourceArg);
const allowedRoots = [resolve(root, "content/skills"), resolve(root, "content/public-skills")];
const insideAllowedRoot = allowedRoots.some((allowed) => source === allowed || source.startsWith(`${allowed}${sep}`));
if (!insideAllowedRoot) fail("Skill source is outside the approved publication directories.");
if (!existsSync(source) || !statSync(source).isDirectory()) fail(`Missing skill source: ${sourceArg}`);

const skillPath = resolve(source, "SKILL.md");
if (!existsSync(skillPath)) fail(`Missing SKILL.md in ${sourceArg}`);

const skillText = readFileSync(skillPath, "utf8");
if (!/^#\s+\S+/m.test(skillText) || !/^##\s+\S+/m.test(skillText)) {
  fail(`${sourceArg}/SKILL.md has no usable title and sections.`);
}

const examplePath = resolve(source, exampleArg);
if (examplePath !== source && !examplePath.startsWith(`${source}${sep}`)) {
  fail("Declared example is outside the skill bundle.");
}
if (!existsSync(examplePath) || !statSync(examplePath).isFile()) {
  fail(`Missing declared example: ${sourceArg}/${exampleArg}`);
}

const excluded = new Set([".DS_Store", ".env", ".git", "__pycache__", "node_modules"]);
const files = [];
const walk = (directory) => {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (excluded.has(entry.name) || entry.name.endsWith(".pyc") || entry.name.startsWith(".env.")) continue;
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) walk(path);
    else if (entry.isFile()) files.push(path);
  }
};
walk(source);

if (files.length < 2) fail(`${sourceArg} has no bundle value beyond SKILL.md.`);

for (const file of files) {
  if (statSync(file).size === 0) fail(`Empty bundle file: ${relative(root, file)}`);
  const extension = extname(file).toLowerCase();
  if (extension === ".json") {
    try {
      JSON.parse(readFileSync(file, "utf8"));
    } catch {
      fail(`Invalid JSON: ${relative(root, file)}`);
    }
  }
  if (extension === ".csv") {
    const rows = readFileSync(file, "utf8").trim().split(/\r?\n/);
    if (rows.length < 2) fail(`CSV example has no data row: ${relative(root, file)}`);
  }
}

process.stdout.write(`Validated ${sourceArg} (${files.length} files, example ${exampleArg}).\n`);
