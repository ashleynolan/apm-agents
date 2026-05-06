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

So for example, to install the **Performance and A11y Auditor Agent**, globally on your machine, you would run:

`apm install justeattakeaway/pie/.apm/agents/web-perf-a11y-auditor -g`


## Structure

Each agent lives under `.apm/agents/<agent-name>/` and consists of:

- `apm.yml` — agent manifest (name, version, description, dependencies)
- `.apm/agents/<agent-name>.agent.md` — agent definition (YAML frontmatter + system prompt)

## License

See [LICENSE](LICENSE) for details.