import { readFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { discoverSkills } from './lib/skills.mjs';

const errors = [];
const seen = new Set();
const skills = discoverSkills();

for (const skill of skills) {
  const dirName = basename(skill.dir);

  if (!skill.name) {
    errors.push(`${skill.relDir}: frontmatter "name" is required`);
  } else if (!/^[a-z0-9][a-z0-9-]{0,63}$/.test(skill.name)) {
    errors.push(`${skill.relDir}: "name" must be lowercase ASCII with digits and hyphens`);
  }

  if (!skill.description) {
    errors.push(`${skill.relDir}: frontmatter "description" is required`);
  }

  if (skill.name && seen.has(skill.name)) {
    errors.push(`duplicate skill name: ${skill.name}`);
  }
  seen.add(skill.name);

  if (skill.name && skill.name !== dirName) {
    errors.push(
      `${skill.relDir}: frontmatter name "${skill.name}" does not match directory name "${dirName}"`
    );
  }

  if (!skill.body) {
    errors.push(`${skill.relDir}: SKILL.md body must not be empty`);
  }

  const openaiYaml = join(skill.dir, 'agents/openai.yaml');
  if (fileExists(openaiYaml)) {
    const defaultPrompt = readDefaultPrompt(openaiYaml);
    if (defaultPrompt && skill.name && !defaultPrompt.includes(`$${skill.name}`)) {
      errors.push(
        `${skill.relDir}: agents/openai.yaml default_prompt should mention $${skill.name}`
      );
    }
  }
}

if (skills.length === 0) {
  errors.push('no skills found under skills/');
}

if (errors.length > 0) {
  for (const error of errors) {
    console.error(`error: ${error}`);
  }
  process.exit(1);
}

console.log(`validated ${skills.length} skill${skills.length === 1 ? '' : 's'}`);

function readDefaultPrompt(fileUrl) {
  try {
    const content = readFileSync(fileUrl, 'utf8');
    const match = content.match(/default_prompt:\s*("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|[^\r\n]*)/);
    if (!match) return '';
    const raw = match[1].trim();
    if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
      return raw.slice(1, -1);
    }
    return raw;
  } catch {
    return '';
  }
}

function fileExists(filePath) {
  try {
    readFileSync(filePath);
    return true;
  } catch {
    return false;
  }
}
