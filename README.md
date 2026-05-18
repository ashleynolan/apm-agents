# APM Agents

A collection of agent packages defined using the APM (Agent Package Manager) format.

## Table of Contents

- [Installation](#installation)
  - [Installing APM](#installing-apm)
  - [Installing an APM Agent Package (A General Guide)](#installing-an-apm-agent-package-a-general-guide)
- [Using agents across different harnesses](#using-agents-across-different-harnesses)
- [`web-perf-a11y-auditor` Agent](#web-perf-a11y-auditor-agent)
  - [Installation](#installation-1)
    - [Usage with OpenCode](#usage-with-opencode)
    - [Usage with Kiro](#usage-with-kiro)
  - [Prompting the web-perf-a11y-auditor subagent](#prompting-the-web-perf-a11y-auditor-subagent)
- [`personal-assistant` Agent](#personal-assistant-agent)
  - [Installation](#installation-2)
  - [Configuration](#configuration)
  - [Prompting the personal-assistant subagent](#prompting-the-personal-assistant-subagent)
- [Structure](#structure)
- [License](#license)

## Installation

### Installing APM

To install an agent package from this repo, you'll need to install APM on your machine.

You can do this by following the [official documentation on the APM website](https://microsoft.github.io/apm/getting-started/installation/).

### Installing an APM Agent Package (A General Guide)

Once you have APM installed you can then install an Agent from this repo. Here is a general APM installation guide – specific agent installation instructions can be found later in the README.

To install an APM package, you can run the following command:

`apm install {agent_package_path}`

By default, agents are installed **local to the project you run this command from**, but you can choose to install these agents **globally** (so that it's available in all projects on your machine) via the `-g` flag:

```bash
# global install
apm install {agent_package_path} -g

# local project install
apm install {agent_package_path}
```

When installing an APM package, you can either let the install command auto-detect your agent-harness (or harnesses) – which will happen by default based on the folders it detects, such as `.claude/` or `./opencode` – or you can add `--target {harness_id}` to target a particular Agent harness. Currently, APM supports `claude`, `copilot`, `cursor`, `codex`, `gemini`, `opencode` and `windsurf` as potential targets.

E.g.

```bash
# Install APM package, targetting Claude
apm install {agent_package_path} --target claude
```

---

## Using agents across different harnesses

APM aims to enable the sharing of Agents, Skills, MCPs, and Slash Commands to any Agent Harness.

Currently, APM supports:

- Claude
- Copilot
- Cursor
- Codex
- Gemini
- OpenCode
- Windsurf

Although it does it's best to support these harnesses, there are sometimes slight differences that it can't handle – a good example is Agent Configuration YML, which is defined slightly differently in OpenCode to Copilot and Claude.

Where relevant, the Agent installation instructions will detail any extra steps needed for these harnesses.

THe APM packages in this repo support Claude, Copilot and Opencode – they haven't been tested in the other tools, but would be happy to accept contributions to help support them!

---

## `web-perf-a11y-auditor` Agent

The `web-perf-a11y-auditor` Agent can be used to evaluate websites for performance bottlenecks and accessibility issues.

It uses the Chrome Devtools MCP (and associated official Chrome Devtools Skills) to investigate specific metrics like LCP, CLS, and INP. It can also run more general performance or a11y audits, run Lighthouse audits, and evaluate sites with respect to WCAG 2.1 AA compliance.

### Installation

Like any APM package, you can choose to install this agent **locally** to the project you are working in or **globally** to your user config (so that it's available in all projects on your machine) via the `-g` flag:

To install the **Performance and A11y Auditor Agent**, run the following commands in your terminal:

```bash
# ===== GLOBAL INSTALL ======
# First install the agent
apm install -g ashleynolan/apm-agents/.apm/agents/web-perf-a11y-auditor

# …and then once that has finished run the following to ensure any transitive skills are also installed
apm install


# ===== LOCAL INSTALL ======
# First install the agent
apm install ashleynolan/apm-agents/.apm/agents/web-perf-a11y-auditor
# …and then once that has finished run the following to ensure any transitive skills are also installed
apm install
```

Once installed, you can now open your agent harness such as Claude, or Copilot and start prompting it to use the agent! (see [Prompting the web-perf-a11y-auditor subagent](#prompting-the-web-perf-a11y-auditor-subagent) for example prompts).

#### Usage with OpenCode

Usefully, OpenCode agent definition format is different to those used by other agent harnesses like Claude or Copilot. YML settings like `mcpServers` and `color` will cause errors when trying to load the agent straight from an `apm install`.

To use the agent with OpenCode, you will need to run the transformation script which can be found at `skills/web-perf-a11y-auditor/scripts/transform-opencode-agent.js`.

```
 node ./agents/skills/scripts/transform-opencode-agent.js <path-to-agent.md>
```

As OpenCode doesn't support Subagent isolation of MCP servers (yet), you will also need to ensure that you add the following config to setup the `Chrome Devtools` and `a11y-mcp` MCP servers to your `opencode.json` config file:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "chrome-devtools": {
      "type": "local",
      "command": [
        "npx", "chrome-devtools-mcp@latest",
        "--isolated=true",
        "--headless=false",
        "--no-usage-statistics",
        "--no-performance-crux",
        "--chromeArg=--deny-permission-prompts",
        "--chromeArg=--use-fake-ui-for-media-stream",
        "--chromeArg=--disable-notifications"
      ],
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

N.b. It's worth making sure you only enable these MCP servers when using them, as adding this in your global OpenCode config will add the MCP tools to your global context window for all conversations otherwise.

#### Usage with Kiro

I have no idea yet what Kiro support for subagents is. APM have an open feature request to support Kiro, so hopefully this will be solved once that feature is implemented.

In the meantime, if anyone would like to help create a script for Kiro support, please let me know!


### Prompting the web-perf-a11y-auditor subagent

Once installed, the subagent can be prompted by writing terms such as the following:


```bash
# General performance audit
❯ Use the performance agent to do an audit of {url_to_test}

# Specifically look into performance of INP (or other metrics/core vitals)
❯ Use the perf subagent to analyse the INP of {element_to_query}

# Lighthouse audit
❯ Run a lighthouse audit on {url_to_test} using the perf agent

# General a11y audit
❯ Use the a11y agent to run an a11y audit on {url_to_test}

# Direct call to the agent
❯ /web-perf-a11y-agent Do a performance audit of {url_to_test}
```

---

## `personal-assistant` Agent

The `personal-assistant` Agent is an expert JIRA project manager and Confluence curator. It can create, edit, search, and report on JIRA tickets and Confluence pages via the Atlassian MCP.

### Installation

Like any APM package, you can choose to install this agent **locally** to the project you are working in or **globally** to your user config (so that it's available in all projects on your machine) via the `-g` flag:

```bash
# ===== GLOBAL INSTALL ======
# First install the agent
apm install -g ashleynolan/apm-agents/.apm/agents/personal-assistant

# …and then once that has finished run the following to ensure any transitive skills are also installed
apm install


# ===== LOCAL INSTALL ======
# First install the agent
apm install ashleynolan/apm-agents/.apm/agents/personal-assistant
# …and then once that has finished run the following to ensure any transitive skills are also installed
apm install
```

#### Usage with OpenCode

Out of the box this subagent won't currently work with OpenCode. I am working on a script to help with this, but if you can't wait for that, you can get your own agent to transform the Agent YML in `/.apm/agents/personal-assistant/.apm/agents/personal-assistant.agent.md` into OpenCode format and it should take care of that for you.

As OpenCode doesn't support Subagent isolation of MCP servers (yet), you will also need to ensure that you add the following config to setup the `Atlassian` MCP server to your `opencode.json` config file:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "atlassian": {
      "type": "http",
      "url": "https://mcp.atlassian.com/v1/mcp",
      "enabled": true
    }
  }
}
```

### Authenticating the Atlassian MCP

Once installed, you will need to authenticate the Atlassian MCP for your subagent to use. This is different per agent harness but it should provide you with authentication instructions (for example, in Claude, if you run `/mcp`, you will be able to authenticate it through the prompts displayed).


### Configuration

The agent optionally loads a config file from `~/.personal-assistant-config.md`. This file can contain:

```
JIRA_PROJECT_KEY=DEMO # so you don't have to specify it in every prompt
JIRA_PROJECT_KEY=EXP
DEFAULT_TICKET_TYPE=Story # Setting this overrides the `Story` default. Can be Story|Bug|Task|Epic|Sub-task|Spike)
DEFAULT_TICKET_PRIORITY=Normal # overrides the `Normal` default. Can be Trivial|Minor|Normal|Major|Critical|Blocker
TICKET_LABELS=label1,label2 # project-specific labels to apply consistently
```

If the file doesn't exist, the agent proceeds normally using defaults and information from your prompt.

### Prompting the personal-assistant subagent

Once installed, the subagent can be prompted by writing terms such as the following:

```bash
# Create a JIRA ticket
❯ Create a JIRA ticket for adding dark mode support

# Search JIRA
❯ Show me all open tickets assigned to me in the current sprint

# Create a Confluence page
❯ Create a Confluence page in the DEMO space documenting our new authentication flow

# Search Confluence
❯ Search Confluence for any pages about our deployment process

# Generate a report
❯ Give me a sprint completion summary for DEMO

# Direct call to the agent
❯ /personal-assistant Create a bug ticket for the broken checkout flow on mobile
```

---

## Structure

Each agent lives under `.apm/agents/<agent-name>/` and consists of:

- `apm.yml` — agent manifest (name, version, description, dependencies)
- `.apm/agents/<agent-name>.agent.md` — agent definition (YAML frontmatter + system prompt)

## License

See [LICENSE](LICENSE) for details.