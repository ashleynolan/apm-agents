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
  sonnet: "anthropic/claude-sonnet-4-20250514",
  opus: "anthropic/claude-opus-4-20250514",
  haiku: "anthropic/claude-haiku-4-20250514",
};

function transformFrontmatter(frontmatter) {
  const lines = frontmatter.split("\n");
  const output = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Transform tools → permission
    if (line.match(/^tools:/)) {
      output.push("permission:");
      output.push("  edit: allow");
      output.push("  bash: allow");
      output.push("  read: allow");
      output.push("  glob: allow");
      output.push("  grep: allow");
      output.push("  list: allow");
      output.push("  task: allow");
      output.push("  webfetch: allow");
      output.push("  websearch: allow");
      output.push("  skill: allow");
      i++;
      continue;
    }

    // Transform color
    const colorMatch = line.match(/^color:\s*(.+)/);
    if (colorMatch) {
      const color = colorMatch[1].trim();
      const mapped = COLOR_MAP[color] || color;
      output.push(`color: ${mapped}`);
      i++;
      continue;
    }

    // Transform model alias
    const modelMatch = line.match(/^model:\s*(.+)/);
    if (modelMatch) {
      const model = modelMatch[1].trim();
      const mapped = MODEL_MAP[model] || model;
      output.push(`model: ${mapped}`);
      i++;
      continue;
    }

    // Remove memory field
    if (line.match(/^memory:/)) {
      i++;
      continue;
    }

    // Transform mcpServers array → map
    if (line.match(/^mcpServers:/)) {
      output.push(line);
      i++;

      while (i < lines.length) {
        const mcpLine = lines[i];

        // End of mcpServers block (non-indented, non-empty line)
        if (mcpLine !== "" && !mcpLine.startsWith(" ")) {
          break;
        }

        // "  - server-name:" → "  server-name:"
        const arrayItemMatch = mcpLine.match(/^  - ([a-zA-Z].*)$/);
        if (arrayItemMatch) {
          output.push(`  ${arrayItemMatch[1]}`);
          i++;
          continue;
        }

        // "      key: val" (6 spaces) → "    key: val" (4 spaces)
        if (mcpLine.startsWith("      ")) {
          output.push(`    ${mcpLine.slice(6)}`);
          i++;
          continue;
        }

        output.push(mcpLine);
        i++;
      }
      continue;
    }

    output.push(line);
    i++;
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
