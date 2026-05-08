# APM Agents

A collection of agent packages defined using the APM (Agent Package Manager) format.

## Installation

### Installing APM

To install an agent package from this repo, you'll need to install APM on your machine.

You can do this by following the [official documentation on the APM website](https://microsoft.github.io/apm/getting-started/installation/))

### Installing an APM Agent Package

Once you have APM installed you can then install an Agent from this repo.

To do this, you run the following command:

`apm install {agent_package_path}`

By default, agents are installed **local to the project you run this command from**, but you can choose to install these agents **globally** (so that it's available in all projects on your machine) via the `-g` flag:

```
# global install
apm install {agent_package_path} -g

# local project install
apm install {agent_package_path}
```

Specific agent installation instructions can be found below.


## web-perf-a11y-auditor Subagent

### Installation

To install the **Performance and A11y Auditor Agent**, globally on your machine, run the following commands:

```bash
# First install the agent
apm install -g justeattakeaway/pie/.apm/agents/web-perf-a11y-auditor

# …and then once that has finished run the following to ensure any transitive skills are also installed
apm install
```

### Usage with OpenCode

Usefully, OpenCode agent definition format is different to those used by other agent harnesses like Claude or Copilot. YML settings like `mcpServers` and `color` will cause errors when trying to load the agent straight from an `apm install`.

To use the agent with OpenCode, you will need to run the transformation script which can be found at `skills/web-perf-a11y-auditor/scripts/transform-opencode-agent.js`.

As OpenCode also cannot gate MCP config to a subagent (yet), you will also need to ensure that you add the following config to setup the `Chrome Devtools` and `a11y-mcp` MCP servers to your `opencode.json` config file:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "chrome-devtools": {
      "type": "local",
      "command": ["npx", "chrome-devtools-mcp@latest"],
      "enabled": true
    },
    "a11y": {
      "type": "local",
      "command": ["npx", "a11y-mcp"],
      "enabled": true
    }
  }
}
```

### Usage with Kiro

I have no idea yet what Kiro support for subagents is. APM have an open feature request to support Kiro, so hopefully this will be solved once that feature is implemented.

In the meantime, if anyone would like to help create a script for Kiro support, please let me know!


## Structure

Each agent lives under `.apm/agents/<agent-name>/` and consists of:

- `apm.yml` — agent manifest (name, version, description, dependencies)
- `.apm/agents/<agent-name>.agent.md` — agent definition (YAML frontmatter + system prompt)

## License

See [LICENSE](LICENSE) for details.