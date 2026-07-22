#!/usr/bin/env node
/**
 * Post CRUD helper for the bilingual blog.
 *
 * Commands:
 *   pnpm post:new [name] [--mdx]
 *       Creates a translation pair (en-US + pt-BR) under
 *       `src/content/blog/{locale}/<slug>.<ext>`. Both files start with
 *       `draft: true` so the coverage guard stays green until the author
 *       is ready to publish.
 *
 *   pnpm post:edit [slug]
 *       Marks the selected translation pair as `draft: true` on every
 *       locale it exists in (so you can safely rewrite without breaking
 *       the build). Slug prompt supports Tab autocompletion.
 *
 *   pnpm post:remove [slug]
 *       Deletes the pair. No confirmation — Git can revert.
 */

import { readdir, mkdir, writeFile, readFile, unlink } from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { join, relative, extname, basename } from "node:path";
import { createInterface } from "node:readline";
import slugify from "slugify";

const ROOT = process.cwd();
const BLOG = join(ROOT, "src/content/blog");
const LOCALES = ["en-US", "pt-BR"];
const EXTS = [".md", ".mdx"];

function usage(exitCode = 1) {
  console.error(
    [
      "Usage:",
      "  pnpm post:new [name] [--mdx]     # create a translation pair",
      "  pnpm post:edit [slug]            # mark the pair as draft",
      "  pnpm post:remove [slug]          # delete the pair",
    ].join("\n")
  );
  process.exit(exitCode);
}

function toSlug(input) {
  return slugify(String(input ?? ""), {
    lower: true,
    strict: true,
    trim: true,
  });
}

function toTitle(input) {
  const s = String(input ?? "").trim();
  if (!s) return "";
  if (/[A-Z]/.test(s) || /\s/.test(s)) return s;
  return s
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map(w => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

async function listSlugs() {
  const slugs = new Set();
  for (const loc of LOCALES) {
    const dir = join(BLOG, loc);
    if (!existsSync(dir)) continue;
    for (const name of await readdir(dir)) {
      const ext = extname(name);
      if (!EXTS.includes(ext)) continue;
      if (name.startsWith("_")) continue;
      slugs.add(basename(name, ext));
    }
  }
  return [...slugs].sort();
}

async function findPair(slug) {
  const hits = [];
  for (const loc of LOCALES) {
    for (const ext of EXTS) {
      const p = join(BLOG, loc, `${slug}${ext}`);
      if (existsSync(p)) hits.push(p);
    }
  }
  return hits;
}

function readDefaultAuthor() {
  try {
    const src = readFileSync(join(ROOT, "astro-paper.config.ts"), "utf8");
    const m = src.match(/author:\s*["'`]([^"'`]+)["'`]/);
    if (m) return m[1];
  } catch {
    // fall through
  }
  return "LuzTech Development";
}

function getAuthor() {
  try {
    const name = execSync("git config user.name", {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    if (name) return name;
  } catch {
    // git missing or key unset — fall through
  }
  return readDefaultAuthor();
}

function makePrompt(question, choices) {
  return new Promise(resolve => {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true,
      completer: line => {
        if (!choices || !choices.length) return [[], line];
        const hits = choices.filter(c => c.startsWith(line));
        return [hits.length ? hits : choices, line];
      },
    });
    rl.question(question, answer => {
      rl.close();
      resolve(answer);
    });
  });
}

function frontmatter({ title, description, pubDatetime, author, tags = ["others"] }) {
  const tagLines = tags.map(t => `  - ${t}`).join("\n");
  return [
    "---",
    `title: ${title}`,
    `description: ${description}`,
    `pubDatetime: ${pubDatetime}`,
    `author: ${author}`,
    "tags:",
    tagLines,
    "draft: true",
    "---",
    "",
  ].join("\n");
}

async function cmdNew(args) {
  const mdx = args.includes("--mdx");
  const positional = args.filter(a => !a.startsWith("--"));
  let raw = positional[0];
  if (!raw) raw = await makePrompt("Post name: ");
  raw = String(raw).trim();
  if (!raw) {
    console.error("Empty post name.");
    process.exit(1);
  }
  const slug = toSlug(raw);
  if (!slug) {
    console.error(`Could not derive a slug from "${raw}".`);
    process.exit(1);
  }
  const title = toTitle(raw);
  const ext = mdx ? "mdx" : "md";
  const pubDatetime = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
  const author = getAuthor();

  const existing = await findPair(slug);
  if (existing.length) {
    console.error("Refusing to overwrite existing files:");
    for (const p of existing) console.error("  " + relative(ROOT, p));
    process.exit(1);
  }

  const bodies = {
    "en-US": [
      frontmatter({
        title,
        description: "TODO: short summary shown in listings and OG cards.",
        pubDatetime,
        author,
      }),
      `Write the English version of "${title}" here.`,
      "",
      "Remove `draft: true` from the frontmatter once both translations are ready to publish.",
      "",
    ].join("\n"),
    "pt-BR": [
      frontmatter({
        title,
        description: "TODO: descrição curta mostrada nas listagens e OG cards.",
        pubDatetime,
        author,
      }),
      `Escreva a versão em português de "${title}" aqui.`,
      "",
      "Remova `draft: true` do frontmatter quando as duas traduções estiverem prontas para publicar.",
      "",
    ].join("\n"),
  };

  const created = [];
  for (const loc of LOCALES) {
    const dir = join(BLOG, loc);
    await mkdir(dir, { recursive: true });
    const path = join(dir, `${slug}.${ext}`);
    await writeFile(path, bodies[loc], "utf8");
    created.push(path);
  }

  console.log(`Created ${ext.toUpperCase()} pair for slug "${slug}" (draft):`);
  for (const p of created) console.log("  " + relative(ROOT, p));
}

async function setDraft(path, value) {
  const src = await readFile(path, "utf8");
  const match = src.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    throw new Error(`No frontmatter block found in ${relative(ROOT, path)}`);
  }
  const block = match[1];
  const lines = block.split(/\r?\n/);
  let found = false;
  const updated = lines.map(line => {
    if (/^draft\s*:/.test(line)) {
      found = true;
      return `draft: ${value}`;
    }
    return line;
  });
  if (!found) updated.push(`draft: ${value}`);
  const newBlock = updated.join("\n");
  const rest = src.slice(match[0].length);
  await writeFile(path, `---\n${newBlock}\n---${rest}`, "utf8");
}

async function resolveSlugArg(args, action) {
  const slugs = await listSlugs();
  const positional = args.filter(a => !a.startsWith("--"));
  let slug = positional[0];
  if (!slug) {
    if (!slugs.length) {
      console.error("No posts found under src/content/blog/**.");
      process.exit(1);
    }
    const answer = await makePrompt(
      `Slug to ${action} (${slugs.length} available, Tab = autocomplete): `,
      slugs
    );
    slug = answer;
  }
  slug = String(slug).trim();
  if (!slug) {
    console.error("No slug provided.");
    process.exit(1);
  }
  const pair = await findPair(slug);
  if (!pair.length) {
    console.error(`No files found for slug "${slug}".`);
    if (slugs.length) {
      console.error("Known slugs:");
      for (const s of slugs) console.error("  " + s);
    }
    process.exit(1);
  }
  return { slug, pair };
}

async function cmdEdit(args) {
  const { slug, pair } = await resolveSlugArg(args, "mark as draft");
  for (const p of pair) {
    await setDraft(p, true);
    console.log(`draft: true  ${relative(ROOT, p)}`);
  }
  console.log(`\nMarked "${slug}" as draft in ${pair.length} file(s).`);
}

async function cmdRemove(args) {
  const { slug, pair } = await resolveSlugArg(args, "remove");
  for (const p of pair) {
    await unlink(p);
    console.log(`removed  ${relative(ROOT, p)}`);
  }
  console.log(`\nDeleted "${slug}" (${pair.length} file(s)). Git can revert.`);
}

const [, , subcommand, ...rest] = process.argv;
switch (subcommand) {
  case "new":
  case "create":
    await cmdNew(rest);
    break;
  case "edit":
  case "draft":
    await cmdEdit(rest);
    break;
  case "remove":
  case "rm":
  case "delete":
    await cmdRemove(rest);
    break;
  default:
    usage();
}
