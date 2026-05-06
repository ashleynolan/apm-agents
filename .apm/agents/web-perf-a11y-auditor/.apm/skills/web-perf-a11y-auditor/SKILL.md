---
name: web-perf-a11y-auditor
description: Orchestrator skill for the web-perf-a11y-auditor agent (also known as the "perf subagent", "performance agent", "a11y agent" or "accessibility agent"). Use when the user asks to audit a website for performance or accessibility issues, investigate Core Web Vitals (LCP, CLS, INP, FCP, TTFB), check WCAG compliance, debug slow page loads, analyse network requests, inspect rendering performance, evaluate accessibility of a page, or explicitly requests the performance/perf/a11y/accessibility agent/subagent. Triggers on phrases like "use the perf subagent", "perf agent", "audit my site", "check accessibility", "why is LCP high", "analyse INP", "run a Lighthouse audit", "WCAG compliance", "performance issues", "check contrast", "suggest improvements to lower INP/LCP/CLS", or any request to evaluate a URL or component for speed or a11y problems.
---

## Core Concepts

This skill is an orchestrator for the web-perf-a11y-auditor agent.

Before passing a task to the agent, it should be confirmed if a dev server is running, to be used for Chrome Devtools MCP for debugging. If not, the user MUST be asked if they want to start a dev server OR if there is a remote URL that can be used for performance debugging. This information MUST be passed to the subagent.

Before passing the task to the sub-agent, do not do pre-analysis. Let the sub-agent handle this and take the evaluation steps it needs to, passing the context of the prompt to the subagent.


## Troubleshooting

If there are errors launching `web-perf-a11y-auditor`, refer to https://github.com/ashleynolan/apm-agents, passing this guidance to the user.

