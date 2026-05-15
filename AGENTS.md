# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## What this repo is

A collection of agents defined using the APM (Agent Package Manager) format. Each agent lives under `.apm/agents/<agent-name>/` and consists of two files:

- **`apm.yml`** — the agent manifest (name, version, description, dependencies on MCP servers and APM plugins)
- **`.apm/agents/<agent-name>.agent.md`** — the agent definition, which is a Markdown file with YAML frontmatter followed by the system prompt

## Agent file structure

### `apm.yml` fields

```yaml
name: <agent-name>
version: 1.0.0
description: >-
  Short description of what the agent does.
target: all  # or a specific target

dependencies:
  apm:
    - Owner/plugin-name   # pulls in MCP server + skills + .mcp.json auto-discovery
  mcp:
    - name: <server-name>
      registry: false
      transport: stdio
      command: npx
      args: ["<package-name>"]
```

### `.agent.md` frontmatter fields

```yaml
---
name: "agent-name"
description: "Used as the agent's description in the Claude Code Agent tool. Include examples with <example> blocks."
tools: Tool1, Tool2, mcp__<server-name>__<tool-name>   # comma-separated list
model: sonnet   # or opus, haiku
color: blue     # display colour
memory: user    # memory scope (user, project, etc.)
---
```

The body after the frontmatter is the full system prompt for the agent.

## Adding a new agent

1. Create `.apm/agents/<agent-name>/apm.yml`
2. Create `.apm/agents/<agent-name>/.apm/agents/<agent-name>.agent.md`
3. The `description` field in the `.agent.md` frontmatter is what Claude Code surfaces when deciding whether to invoke the agent — make it precise and include `<example>` blocks showing invocation scenarios.

## Conventions

- MCP tools in the `tools` frontmatter use the format `mcp__<server-name>__<tool-name>`
- The `target: all` field in `apm.yml` means the agent is available regardless of project context
- Artifacts produced during agent runs (screenshots, traces) should be saved to a subfolder named after the current git branch within a dedicated directory in the repo root
