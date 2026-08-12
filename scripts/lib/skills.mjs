import { readFileSync, readdirSync, statSync } from 'node:fs';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
export const skillsRoot = join(projectRoot, 'skills');

export function findSkillDirectories(dir = skillsRoot) {
  const results = [];
  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory() || SKIP_DIRS.has(entry.name)) continue;

    const child = join(dir, entry.name);
    const skillFile = join(child, 'SKILL.md');

    if (isFile(skillFile)) {
      results.push(child);
    } else {
      results.push(...findSkillDirectories(child));
    }
  }

  return results;
}

const SKIP_DIRS = new Set(['.git', 'node_modules', 'dist', 'build', '__pycache__']);

function isFile(filePath) {
  try {
    return statSync(filePath).isFile();
  } catch {
    return false;
  }
}

export function parseFrontmatter(content) {
  const lines = content.replace(/^\uFEFF/, '').split(/\r?\n/);
  if (lines[0]?.trim() !== '---') {
    throw new Error('missing leading --- frontmatter delimiter');
  }

  let end = -1;
  for (let i = 1; i < lines.length; i += 1) {
    if (lines[i].trim() === '---') {
      end = i;
      break;
    }
  }

  if (end === -1) {
    throw new Error('missing closing --- frontmatter delimiter');
  }

  const data = parseTopLevelYaml(lines.slice(1, end).join('\n'));
  const body = lines.slice(end + 1).join('\n').trim();
  return { data, body };
}

function parseTopLevelYaml(source) {
  const data = {};
  const lines = source.split(/\r?\n/);

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) continue;

    const key = match[1];
    let value = match[2].trim();

    if (value === '' || value === '|' || value === '>') {
      const block = collectBlock(lines, i + 1);
      if (block) {
        value = value === '|' ? block : block.replace(/\n+/g, ' ');
        i += countIndentedLines(lines, i + 1);
      }
    }

    data[key] = parseScalar(value);
  }

  return data;
}

function collectBlock(lines, start) {
  const blockLines = [];
  for (let i = start; i < lines.length; i += 1) {
    if (!/^\s+\S/.test(lines[i])) break;
    blockLines.push(lines[i].trim());
  }
  return blockLines.join('\n');
}

function countIndentedLines(lines, start) {
  let count = 0;
  for (let i = start; i < lines.length; i += 1) {
    if (!/^\s+\S/.test(lines[i])) break;
    count += 1;
  }
  return count;
}

function parseScalar(value) {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return trimmed.slice(1, -1);
    }
  }
  if (trimmed.startsWith("'") && trimmed.endsWith("'")) {
    return trimmed.slice(1, -1).replace(/''/g, "'");
  }
  return trimmed;
}

export function readSkill(skillDir) {
  const skillFile = join(skillDir, 'SKILL.md');
  const content = readFileSync(skillFile, 'utf8');
  const { data, body } = parseFrontmatter(content);
  return {
    name: typeof data.name === 'string' ? data.name : '',
    description: typeof data.description === 'string' ? data.description : '',
    dir: skillDir,
    skillFile,
    body,
    relDir: relative(projectRoot, skillDir).split('\\').join('/')
  };
}

export function discoverSkills() {
  return findSkillDirectories().map(readSkill);
}

export function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf8'));
}
