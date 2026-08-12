import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { discoverSkills, projectRoot, readJson } from './lib/skills.mjs';

const skills = discoverSkills();
const packageJson = readJson(join(projectRoot, 'package.json'));
const pluginName = packageJson.name || 'my-skills';
const skillPaths = skills.map((skill) => `./${skill.relDir}`);

const marketplace = {
  metadata: {
    pluginRoot: './'
  },
  plugins: [
    {
      name: pluginName,
      source: './',
      skills: skillPaths
    }
  ]
};

const skillsSh = {
  $schema: 'https://skills.sh/schemas/skills.sh.schema.json',
  notGrouped: 'bottom',
  groupings: [
    {
      title: 'Personal Skills',
      description: 'Skills maintained in this repository.',
      skills: skills.map((skill) => skill.name)
    }
  ]
};

writeJson(join(projectRoot, '.claude-plugin/marketplace.json'), marketplace);
writeJson(join(projectRoot, 'skills.sh.json'), skillsSh);

console.log(
  `Synced ${skills.length} skill${skills.length === 1 ? '' : 's'} to .claude-plugin/marketplace.json and skills.sh.json`
);

function writeJson(filePath, value) {
  mkdirSync(join(filePath, '..'), { recursive: true });
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}
