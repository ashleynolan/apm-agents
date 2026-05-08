#!/usr/bin/env node
/**
 * Post-install script: transforms Claude Code agent .md frontmatter into opencode format.
 *
 * Usage:
 *   node scripts/transform-opencode-agent.js <path-to-agent.md>
 *
 * Transforms:
 *   - tools (comma-separated string) → permission map
 *   - color (named) → opencode theme color or hex
 *   - model (alias) → full provider/model-id
 *   - memory → removed (not supported in opencode agent md)
 *   - mcpServers (array of named objects) → map of objects
 */

const fs = require("fs");
const path = require("path");

const COLOR_MAP = {
  blue: "info",
  red: "error",
  green: "success",
  yellow: "warning",
  purple: "accent",
  orange: "warning",
  pink: '"#FF69B4"',
  cyan: "info",
};

const MODEL_MAP = {
  sonnet: "github-copilot/claude-sonnet-4.6",
  opus: "github-copilot/claude-opus-4.6",
  haiku: "github-copilot/claude-haiku-4.6",
};

function extractMcpServerNames(lines) {
  const names = [];
  let inMcpBlock = false;
  for (const line of lines) {
    if (line.match(/^mcpServers:/)) {
      inMcpBlock = true;
      continue;
    }
    if (inMcpBlock) {
      if (line !== "" && !line.startsWith(" ")) {
        break;
      }
      const match = line.match(/^  - ([a-zA-Z][a-zA-Z0-9-]*):/);
      if (match) {
        names.push(match[1]);
      }
    }
  }
  return names;
}

function extractMcpServersFromTools(toolsLine) {
  const names = [];
  const seen = new Set();
  const re = /mcp__([a-zA-Z][a-zA-Z0-9-]*)__/g;
  let m;
  while ((m = re.exec(toolsLine)) !== null) {
    if (!seen.has(m[1])) {
      seen.add(m[1]);
      names.push(m[1]);
    }
  }
  return names;
}

function transformFrontmatter(frontmatter) {
  const lines = frontmatter.split("\n");
  const mcpBlockNames = extractMcpServerNames(lines);
  const fields = {};
  let i = 0;

  // First pass: collect all fields
  while (i < lines.length) {
    const line = lines[i];

    if (line.match(/^name:/)) { i++; continue; }

    if (line.match(/^description:/)) {
      fields.description = line.replace(/\\\\n\\\\n<example>[\s\S]*"$/, '"');
      i++; continue;
    }

    if (line.match(/^tools:/)) {
      // Extract MCP server names from tools for ordering
      fields.toolsMcpServers = extractMcpServersFromTools(line);
      i++; continue;
    }

    const colorMatch = line.match(/^color:\s*(.+)/);
    if (colorMatch) {
      const color = colorMatch[1].trim();
      fields.color = COLOR_MAP[color] || color;
      i++; continue;
    }

    const modelMatch = line.match(/^model:\s*(.+)/);
    if (modelMatch) {
      const model = modelMatch[1].trim();
      fields.model = MODEL_MAP[model] || model;
      i++; continue;
    }

    if (line.match(/^memory:/)) { i++; continue; }

    if (line.match(/^mcpServers:/)) {
      i++;
      while (i < lines.length) {
        const mcpLine = lines[i];
        if (mcpLine !== "" && !mcpLine.startsWith(" ")) break;
        i++;
      }
      continue;
    }

    i++;
  }

  // Merge MCP server names: tools order first, then any extras from mcpServers block
  const toolsServers = fields.toolsMcpServers || [];
  const seen = new Set(toolsServers);
  const allMcpServers = [...toolsServers];
  for (const name of mcpBlockNames) {
    if (!seen.has(name)) {
      allMcpServers.push(name);
    }
  }

  // Second pass: output in desired order
  const output = [];
  if (fields.description) output.push(fields.description);
  output.push("mode: subagent");
  if (fields.model) output.push(`model: ${fields.model}`);
  if (fields.color) output.push(`color: ${fields.color}`);
  output.push("permission:");
  output.push("  read: allow");
  output.push("  edit: deny");
  output.push("  bash: allow");
  output.push("  glob: allow");
  output.push("  grep: allow");
  output.push("  list: allow");
  output.push("  webfetch: allow");
  output.push("  websearch: allow");
  output.push("  skill: allow");
  for (const name of allMcpServers) {
    output.push(`  ${name}_*: allow`);
  }

  return output.join("\n");
}

function transform(filePath) {
  const content = fs.readFileSync(filePath, "utf8");

  // Split on frontmatter delimiters
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) {
    console.error("Error: Could not find frontmatter boundaries in", filePath);
    process.exit(1);
  }

  const frontmatter = fmMatch[1];
  const body = content.slice(fmMatch[0].length);

  const transformed = transformFrontmatter(frontmatter);
  const result = `---\n${transformed}\n---${body}`;

  fs.writeFileSync(filePath, result, "utf8");
  console.log(`Transformed: ${filePath}`);
}

// Main
const filePath = process.argv[2];
if (!filePath) {
  console.error("Usage: node transform-opencode-agent.js <agent-file.md>");
  process.exit(1);
}

const resolved = path.resolve(filePath);
if (!fs.existsSync(resolved)) {
  console.error(`Error: File not found: ${resolved}`);
  process.exit(1);
}

transform(resolved);
