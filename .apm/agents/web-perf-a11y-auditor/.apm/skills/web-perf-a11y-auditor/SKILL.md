---
name: web-perf-a11y-auditor
description: Orchestrator skill for the web-perf-a11y-auditor agent (also known as the "perf subagent", "performance agent", "a11y agent" or "accessibility agent"). Use when the user asks to audit a website for performance or accessibility issues, investigate Core Web Vitals (LCP, CLS, INP, FCP, TTFB), check WCAG compliance, debug slow page loads, analyse network requests, inspect rendering performance, evaluate accessibility of a page, or explicitly requests the performance/perf/a11y/accessibility agent/subagent. Triggers on phrases like "use the perf subagent", "perf agent", "audit my site", "check accessibility", "why is LCP high", "analyse INP", "run a Lighthouse audit", "WCAG compliance", "performance issues", "check contrast", "suggest improvements to lower INP/LCP/CLS", or any request to evaluate a URL or component for speed or a11y problems.
---

## Core Concepts

This skill is an orchestrator for the web-perf-a11y-auditor agent.

## IMPORTANT

Before passing the task to the agent:
- DO NOT do pre-analysis. Let the web-perf-a11y-auditor agent handle this analysis, and just pass the context of the prompt to the subagent.
- ALWAYS confirm if there is a remote URL that can be used for testing. YOU MUST ASK if this would be via a local development server OR if there is a remote URL that can be used for performance debugging OR if they'd rather just do static code analysis (without remote testing). This information MUST be passed to the web-perf-a11y-auditor agent.
- Ensure that when passing the task to the web-perf-a11y-auditor agent, you prompt it to use this URL alongside investigating the code itself.
- DO NOT be prescriptive AT ALL in instructing the subagent on how to investigate the issue. The subagent is designed to be autonomous and should determine the best way to investigate and debug the performance or accessibility issue based on the context provided. For example, if investigating the INP, DO NOT instruct the subagent to interact with the element, or measure the interaction latency. Just ensure the context of the prompt is passed to the subagent and let it do its thing.
- DO NOT prompt it on what to output - it has instructions to handle this itself.

## Handling Blockers (BLOCKED responses)

The subagent will **return early** with a `## Status: BLOCKED` response if it hits an unrecoverable issue (e.g., 404, authentication wall, VPN-restricted page, ambiguous scope). When this happens:

1. Relay the agent's question to the user clearly.
2. Wait for the user's answer.
3. Re-invoke the agent with:
   - The original task context
   - The user's answer to the blocker question
   - Any partial findings the agent returned (under "What I completed so far") so it doesn't redo work
   - The "Context needed to resume" section verbatim

Do NOT attempt to answer the blocker question yourself or guess — always ask the user.

## Handling Agent Output

When the agent returns its findings, ensure you format the output in a clear and concise manner, summarising the key issues found, their severity, and the evidence supporting these findings. If the agent has provided specific recommendations for improving performance or accessibility, highlight these in a separate section.

Make a task list for the user of next steps to take based on the output, and ask the user which of those steps they'd like you to help with.

## Troubleshooting

If there are errors launching `web-perf-a11y-auditor`, refer to https://github.com/ashleynolan/apm-agents, passing this guidance to the user.

