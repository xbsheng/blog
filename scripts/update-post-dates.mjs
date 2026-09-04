import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

const postPath = 'src/content/posts';
const stagedFiles = execFileSync(
  'git',
  ['diff', '--cached', '--name-only', '--diff-filter=ACMR', '--', postPath],
  { encoding: 'utf8' },
)
  .split('\n')
  .filter((file) => /\.mdx?$/.test(file));

if (stagedFiles.length === 0) process.exit(0);

const now = new Date();
const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

function updateField(frontmatter, field, value, newline) {
  const fieldPattern = new RegExp(`^${field}:.*$`, 'm');
  if (fieldPattern.test(frontmatter)) {
    return frontmatter.replace(fieldPattern, `${field}: ${value}`);
  }
  return `${frontmatter}${frontmatter.endsWith(newline) ? '' : newline}${field}: ${value}`;
}

for (const file of stagedFiles) {
  try {
    execFileSync('git', ['diff', '--quiet', '--', file]);
  } catch {
    console.error(
      `\n${file} has unstaged changes. Stage or stash them before committing so its automatic dates can be updated safely.`,
    );
    process.exit(1);
  }

  const source = readFileSync(file, 'utf8');
  const newline = source.includes('\r\n') ? '\r\n' : '\n';
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(\r?\n)/);
  if (!match) {
    console.error(`\n${file} must start with YAML frontmatter for automatic dates.`);
    process.exit(1);
  }

  let frontmatter = match[1];
  if (!/^pubDate:/m.test(frontmatter)) {
    frontmatter = updateField(frontmatter, 'pubDate', today, newline);
  }

  const existsInHead = (() => {
    try {
      execFileSync('git', ['cat-file', '-e', `HEAD:${file}`], { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  })();

  if (existsInHead) {
    frontmatter = updateField(frontmatter, 'updatedDate', today, newline);
  }

  const updated = `---${newline}${frontmatter}${newline}---${match[2]}${source.slice(match[0].length)}`;
  if (updated !== source) {
    writeFileSync(file, updated);
    execFileSync('git', ['add', '--', file]);
    console.log(`Updated dates in ${file}`);
  }
}
