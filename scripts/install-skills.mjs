import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, symlinkSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';
import { discoverSkills } from './lib/skills.mjs';

const AGENTS = {
  'claude-code': { project: '.claude/skills', global: '.claude/skills' },
  codex: { project: '.agents/skills', global: '.codex/skills' },
  cursor: { project: '.agents/skills', global: '.cursor/skills' },
  opencode: { project: '.agents/skills', global: '.config/opencode/skills' },
  'gemini-cli': { project: '.agents/skills', global: '.gemini/skills' },
  'github-copilot': { project: '.agents/skills', global: '.copilot/skills' },
  roo: { project: '.roo/skills', global: '.roo/skills' },
  windsurf: { project: '.windsurf/skills', global: '.codeium/windsurf/skills' },
  universal: { project: '.agents/skills', global: '.config/agents/skills' }
};

const args = parseArgs(process.argv.slice(2));
const projectRoot = resolve(args.projectRoot || process.cwd());
const homeRoot = resolve(args.home || homedir());
const scope = args.scope === 'project' ? 'project' : 'global';
const requestedAgents = args.agents.length > 0 ? args.agents : Object.keys(AGENTS);
const requestedSkills = new Set(args.skills);

const skills = discoverSkills().filter(
  (skill) => requestedSkills.size === 0 || requestedSkills.has(skill.name)
);

if (skills.length === 0) {
  console.error('No matching skills found.');
  process.exit(1);
}

let count = 0;

for (const agent of requestedAgents) {
  const config = AGENTS[agent];
  if (!config) {
    console.error(`Unknown agent: ${agent}`);
    process.exit(1);
  }

  const destinationRoot = scope === 'global' ? join(homeRoot, config.global) : join(projectRoot, config.project);

  for (const skill of skills) {
    const destination = join(destinationRoot, skill.name);
    const action = args.link ? 'link' : 'copy';

    console.log(
      `${args.dryRun ? '[dry-run] ' : ''}${action} ${skill.name} -> ${destination}`
    );

    if (args.dryRun) continue;

    mkdirSync(destinationRoot, { recursive: true });
    rmSync(destination, { recursive: true, force: true });

    if (args.link) {
      symlinkSync(resolve(skill.dir), destination, process.platform === 'win32' ? 'junction' : 'dir');
    } else {
      copyDirectory(skill.dir, destination);
    }

    count += 1;
  }
}

console.log(`Installed ${count} skill link(s) to ${scope} scope.`);

function copyDirectory(source, destination) {
  mkdirSync(destination, { recursive: true });

  for (const entry of readdirSync(source, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;

    const sourcePath = join(source, entry.name);
    const destinationPath = join(destination, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(sourcePath, destinationPath);
    } else if (entry.isFile() || entry.isSymbolicLink()) {
      copyFileSync(sourcePath, destinationPath);
    }
  }
}

function parseArgs(argv) {
  const options = {
    agents: [],
    skills: [],
    scope: 'global',
    link: false,
    dryRun: false,
    projectRoot: '',
    home: ''
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = () => argv[++i];

    switch (arg) {
      case '--agents':
        options.agents = next().split(',').map((value) => value.trim()).filter(Boolean);
        break;
      case '--skills':
        options.skills = next().split(',').map((value) => value.trim()).filter(Boolean);
        break;
      case '--scope':
        options.scope = next();
        break;
      case '--link':
        options.link = true;
        break;
      case '--dry-run':
        options.dryRun = true;
        break;
      case '--project-root':
        options.projectRoot = next();
        break;
      case '--home':
        options.home = next();
        break;
      default:
        console.error(`Unknown option: ${arg}`);
        process.exit(1);
    }
  }

  return options;
}
