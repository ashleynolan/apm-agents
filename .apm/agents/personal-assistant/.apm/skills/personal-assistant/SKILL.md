---
name: personal-assistant
description: Orchestrator skill for the personal-assistant agent (also known as the "pa subagent", "pa agent", "personal assistant agent" or "pa-agent"). Use when the user asks to create, edit, search, or report on JIRA tickets, create or update Confluence pages, search Confluence, add comments to pages, generate sprint or project reports, or perform any Atlassian-related task. Triggers on phrases like "create a ticket", "raise a bug", "search JIRA", "find tickets", "update WEBEX-1234", "create a Confluence page", "search Confluence", "sprint summary", "open bugs report", "what tickets are assigned to me", or any request involving JIRA or Confluence.
---

## Core Concepts

This skill is an orchestrator for the personal-assistant agent, which interacts with JIRA and Confluence via the Atlassian MCP.

## Bootstrap Context

If it exists, ALWAYS load in the `.personal-assistant-config` file from the user's home directory and pass this config into the agent as context when invoking it. This file may contain important configuration details such as the user's preferred JIRA project keys, Confluence space keys, or any other relevant information that can help the agent perform its tasks more effectively. If the file does not exist, proceed without it but consider prompting the user to create it for a better experience in future interactions.

## IMPORTANT

Before passing the task to the agent:
- DO NOT do pre-analysis or attempt to query JIRA/Confluence yourself. Let the personal-assistant agent handle all Atlassian interactions.
- If the user's request involves creating a ticket or page, ensure you pass all context from the user's message (project key, summary, description details, labels, priority, space key, etc.) to the subagent.
- If a project key or Confluence space is not obvious from the conversation context, ASK the user before invoking the agent.
- DO NOT be prescriptive in instructing the subagent on how to structure tickets or pages — it has detailed formatting rules and will apply them autonomously.
- DO NOT prompt it on what to output — it has instructions to handle this itself.

## Ticket Creation

When the user requests ticket creation, try to infer the project key from:

1. The Project mentioned in the user's prompt (e.g., "Create a ticket in WEBEX")
2. The JIRA_PROJECT_KEY defined in the `.personal-assistant-config.md` file (if it exists)
3. If neither of the above yield a project key, ASK the user which project key to use before invoking the agent (ensuring to give an example such as WEBEX).

## Editing a Ticket

When the user requests editing a ticket, ensure you have the ticket ID (e.g., WEBEX-1234) from the user's prompt. If the ticket ID is missing or ambiguous, ASK the user to specify which ticket they want to edit before invoking the agent.

## Searching for Tickets

When the user requests a search of JIRA tickets, if they provide specific criteria (e.g., "tickets assigned to me", "open bugs in WEBEX project", "tickets with label 'urgent'"), ensure you pass this context to the agent. If the search criteria are vague or missing, ASK the user to clarify their search parameters before invoking the agent.

## Confluence Page Creation

When the user requests Confluence page creation, try to infer the space key from:

1. The Space mentioned in the user's prompt (e.g., "Create a page in the DEV space")
2. The CONFLUENCE_SPACE_KEY defined in the `.personal-assistant-config.md` file (if it exists)
3. If neither of the above yield a space key, ASK the user which Confluence space to use before invoking the agent (ensuring to give an example such as DEV).

## Handling Blockers (BLOCKED responses)

The subagent will **return early** with a `## Status: BLOCKED` response if it hits an unrecoverable issue (e.g., JIRA project not found, Confluence space doesn't exist, permission denied, ticket returns 404, ambiguous scope). When this happens:

1. Relay the agent's question to the user clearly.
2. Wait for the user's answer.
3. Re-invoke the agent with:
   - The original task context
   - The user's answer to the blocker question
   - Any partial findings the agent returned (under "What I completed so far") so it doesn't redo work
   - The "Context needed to resume" section verbatim

Do NOT attempt to answer the blocker question yourself or guess — always ask the user.

## Handling Agent Output

When the agent returns its results:
- For **ticket creation/updates**: confirm the ticket ID and summarise what was created or changed.
- For **searches**: present the results in a scannable format. If the agent returned JQL/CQL, include it so the user can refine.
- For **reports**: present the report as-is — the agent formats these to a standard template.
- For **Confluence page creation/updates**: confirm the page title, space, and summarise what was published or changed.

If the agent's output suggests follow-up actions (e.g., tickets that need assignment, pages that need linking), present these as options to the user and ask which they'd like you to handle next.

## Troubleshooting

If there are errors launching `personal-assistant`, refer to https://github.com/ashleynolan/apm-agents, passing this guidance to the user.
