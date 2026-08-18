# Personal Skills

这个仓库用于存放个人创建的 Agent Skills。它遵循共享的 [Agent Skills](https://agentskills.io/) 格式，因此可以被多个编码 Agent 识别和安装，包括 Claude Code、Codex、Cursor、OpenCode、Gemini CLI、GitHub Copilot 等。

## 目录结构

```text
.
├── README.md
├── AGENTS.md
├── LICENSE
├── package.json
├── scripts/
│   ├── lib/
│   │   └── skills.mjs
│   ├── validate-skills.mjs
│   ├── install-skills.mjs
│   └── sync-manifests.mjs
├── .claude-plugin/
│   └── marketplace.json
├── skills/
│   ├── example-skill/
│   │   ├── SKILL.md
│   │   └── agents/
│   │       └── openai.yaml
│   ├── skill-distiller/
│   │   ├── SKILL.md
│   │   └── agents/
│   │       └── openai.yaml
│   ├── skill-mentor/
│   │   ├── SKILL.md
│   │   └── agents/
│   │       └── openai.yaml
│   ├── smart-commit/
│   │   ├── SKILL.md
│   │   ├── references/
│   │   │   └── conventional-commits.md
│   │   └── agents/
│   │       └── openai.yaml
│   └── ...你的其他技能
└── .github/
    └── workflows/
        └── validate.yml
```

## 当前技能

| Skill | 用途 |
| --- | --- |
| `example-skill` | 最小化模板，用于创建或校验仓库中的技能结构 |
| `skill-distiller` | 把当前会话的主要工作流提炼成可复用技能 |
| `skill-mentor` | 根据会话中的 skill 执行情况提出优化方案，并确认后再写入 |
| `smart-commit` | 仅提交当前已暂存变更，匹配仓库提交风格；历史不足时询问提交语言，并深度优先处理子模块 |

核心约定：

- 每个技能是一个独立目录：`skills/<skill-name>/SKILL.md`
- `SKILL.md` 必须包含 YAML frontmatter：`name` 和 `description`
- `name` 使用小写字母、数字和连字符
- `scripts/`、`references/`、`assets/` 是可选的
- `agents/openai.yaml` 是 Codex UI 元数据，可选
- 不要在每个 skill 目录里放 `README.md`、`CHANGELOG.md` 等文档

## 用 Vercel skills CLI 安装

`npx skills` 会自动发现本仓库 `skills/` 下的所有技能，并安装到多个 Agent。

```bash
# 安装到检测到的所有 Agent
npx skills add Craun718/jineng

# 只列出仓库里的技能
npx skills add Craun718/jineng --list

# 只安装指定技能
npx skills add Craun718/jineng --skill example-skill

# 安装到指定 Agent
npx skills add Craun718/jineng -a codex -a claude-code -a cursor

# 全局安装，跳过交互
npx skills add Craun718/jineng --all -g -y
```

也支持 GitHub URL：

```bash
npx skills add https://github.com/Craun718/jineng
```

`vercel-labs/skills` 是 `npx skills` 的 CLI 仓库，`vercel-labs/agent-skills` 是它维护的技能集合仓库；两者都使用 `skills/<skill-name>/SKILL.md` 这个结构，因此本仓库兼容同一套发现规则。

## 本地多平台安装

仓库附带了一个不依赖 `npx` 的安装脚本，可以直接复制或软链接到常见 Agent 目录：

```bash
# 全局安装到 Codex、Claude Code、Cursor、OpenCode
npm run install:skills -- --scope global --agents codex,claude-code,cursor,opencode

# 项目级安装
npm run install:skills -- --scope project

# 只安装指定技能
npm run install:skills -- --skills example-skill

# 使用软链接而不是复制
npm run install:skills -- --link

# 只查看将要执行的安装，不写文件
npm run install:skills -- --dry-run
```

## 添加一个新技能

1. 创建 `skills/<skill-name>/SKILL.md`
2. 写清楚 `name` 和 `description`
3. 按需添加 `scripts/`、`references/`、`assets/`
4. 运行 `npm run validate`
5. 运行 `npm run sync` 更新 Claude 市场清单

也可以复制 `skills/example-skill/` 作为起点。

## 本地校验

```bash
npm run validate
npm run sync
```

`npm run sync` 会根据实际技能重新生成 `.claude-plugin/marketplace.json` 和 `skills.sh.json`，避免手工维护清单导致技能漏掉。

## License

MIT
