import "server-only"

import { readFile } from "node:fs/promises"
import path from "node:path"

export type DesignToken = {
  key: string
  path: string
  value: string
}

export type DesignTokenSection = {
  id: string
  title: string
  tokens: DesignToken[]
}

export type DesignNarrativeBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] }

export type DesignNarrativeSection = {
  id: string
  title: string
  blocks: DesignNarrativeBlock[]
}

function stripInlineComment(value: string) {
  let quote: '"' | "'" | null = null

  for (let index = 0; index < value.length; index += 1) {
    const character = value[index]

    if ((character === '"' || character === "'") && value[index - 1] !== "\\") {
      quote = quote === character ? null : (quote ?? character)
    }

    if (character === "#" && quote === null) {
      return value.slice(0, index).trim()
    }
  }

  return value.trim()
}

function cleanYamlText(value: string) {
  const withoutComment = stripInlineComment(value)

  if (
    (withoutComment.startsWith('"') && withoutComment.endsWith('"')) ||
    (withoutComment.startsWith("'") && withoutComment.endsWith("'"))
  ) {
    return withoutComment.slice(1, -1)
  }

  return withoutComment
}

function titleFromKey(key: string) {
  return key
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

function idFromTitle(title: string) {
  return title
    .toLowerCase()
    .replaceAll("&", "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function tableCells(line: string) {
  return line
    .slice(1, -1)
    .split("|")
    .map((cell) => cell.trim())
}

function parseNarrativeBlocks(source: string) {
  const lines = source.trim().split("\n")
  const blocks: DesignNarrativeBlock[] = []
  let index = 0

  while (index < lines.length) {
    const line = lines[index].trim()
    if (!line || line === "---") {
      index += 1
      continue
    }

    if (line.startsWith("|")) {
      const tableLines: string[] = []
      while (index < lines.length && lines[index].trim().startsWith("|")) {
        tableLines.push(lines[index].trim())
        index += 1
      }

      const [headerLine, , ...rowLines] = tableLines
      if (headerLine) {
        blocks.push({
          type: "table",
          headers: tableCells(headerLine),
          rows: rowLines.map(tableCells),
        })
      }
      continue
    }

    if (line.startsWith("- ")) {
      const items: string[] = []

      while (index < lines.length) {
        const itemLine = lines[index].trim()
        if (!itemLine.startsWith("- ")) break

        let item = itemLine.slice(2)
        index += 1
        while (
          index < lines.length &&
          lines[index].trim() &&
          !lines[index].trim().startsWith("- ") &&
          !lines[index].trim().startsWith("|")
        ) {
          item += ` ${lines[index].trim()}`
          index += 1
        }
        items.push(item)
      }

      blocks.push({ type: "list", items })
      continue
    }

    let paragraph = line
    index += 1
    while (
      index < lines.length &&
      lines[index].trim() &&
      !lines[index].trim().startsWith("- ") &&
      !lines[index].trim().startsWith("|")
    ) {
      paragraph += ` ${lines[index].trim()}`
      index += 1
    }
    blocks.push({ type: "paragraph", text: paragraph })
  }

  return blocks
}

async function getDesignSource() {
  return readFile(path.join(process.cwd(), "DESIGN.md"), "utf8")
}

export async function getDesignTokenSections() {
  const source = await getDesignSource()
  const frontmatter = source.match(/^---\n([\s\S]*?)\n---/)?.[1]

  if (!frontmatter) {
    throw new Error("DESIGN.md is missing its YAML token snapshot")
  }

  const sections = new Map<string, DesignToken[]>()
  const keyStack: Array<{ indent: number; key: string }> = []
  const listIndexes = new Map<string, number>()

  for (const line of frontmatter.split("\n")) {
    if (!line.trim() || line.trimStart().startsWith("#")) continue

    const listMatch = line.match(/^(\s*)-\s+(.+)$/)
    if (listMatch && keyStack.length > 0) {
      const fullPath = keyStack.map((entry) => entry.key)
      const sectionKey = fullPath[0]!
      const parentPath = fullPath.slice(1).join(".")
      const listKey = fullPath.join(".")
      const index = listIndexes.get(listKey) ?? 0
      const tokens = sections.get(sectionKey) ?? []

      tokens.push({
        key: String(index),
        path: `${parentPath}.${index}`,
        value: cleanYamlText(listMatch[2]),
      })
      sections.set(sectionKey, tokens)
      listIndexes.set(listKey, index + 1)
      continue
    }

    const match = line.match(/^(\s*)("[^"]+"|'[^']+'|[^:]+):(?:\s*(.*))?$/)
    if (!match) continue

    const indent = match[1].length
    const key = cleanYamlText(match[2].trim())
    const value = cleanYamlText(match[3] ?? "")

    while (
      keyStack.length > 0 &&
      keyStack[keyStack.length - 1]!.indent >= indent
    ) {
      keyStack.pop()
    }

    const parentPath = keyStack.map((entry) => entry.key)
    const fullPath = [...parentPath, key]

    if (!value) {
      keyStack.push({ indent, key })
      if (indent === 0 && !sections.has(key)) sections.set(key, [])
      continue
    }

    const sectionKey = fullPath[0]!
    const tokenPath = fullPath.slice(1).join(".") || key
    const tokens = sections.get(sectionKey) ?? []

    tokens.push({ key, path: tokenPath, value })
    sections.set(sectionKey, tokens)
  }

  return Array.from(sections, ([id, tokens]) => ({
    id,
    title: titleFromKey(id),
    tokens,
  })).filter((section) => section.tokens.length > 0)
}

export async function getDesignNarrativeSections() {
  const source = await getDesignSource()
  const markdown = source.replace(/^---\n[\s\S]*?\n---\n/, "")
  const matches = Array.from(markdown.matchAll(/^## (.+)$/gm))

  return matches.map((match, index) => {
    const title = match[1].trim()
    const contentStart = (match.index ?? 0) + match[0].length
    const contentEnd = matches[index + 1]?.index ?? markdown.length

    return {
      id: idFromTitle(title),
      title,
      blocks: parseNarrativeBlocks(markdown.slice(contentStart, contentEnd)),
    }
  })
}
