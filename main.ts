// Loading Screen Gold — a single sharp, funny tip for stressed developers
// and the AI coding agents pairing with them.
//
// The program writes exactly one line to <output-dir>/entry.txt and does
// nothing else: no network, no secrets, no input files. The tip itself is
// a string literal below, chosen so it lands in a glance on a loading
// screen and speaks to both sides of the keyboard at once.

import { chmodSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The tip. Written to make a tired developer laugh and then feel seen:
// the agent is winging it too, it just never sweats — and the punchline
// is that it still has to ask the human what the code was supposed to do.
// No coffee, no deadline, no compile joke: the joke is the partnership.
const TIP =
  "Tip: the AI agent rewriting your code is winging it too — it just never sweats, never sleeps, and still has to ask you what the function was supposed to do. Breathe.";

// The gate in the competition rules: entry.txt must be UTF-8 text of
// 1 to 200 characters, not only white space. Keep the cap here so a
// future edit to TIP fails loudly instead of shipping an invalid entry.
const MAX_CHARS = 200;

function validateTip(tip: string): void {
  const length = [...tip].length;
  if (length < 1 || length > MAX_CHARS) {
    throw new Error(`tip is ${length} characters, must be 1–${MAX_CHARS}`);
  }
  if (tip.trim().length === 0) {
    throw new Error("tip must not be only white space");
  }
  if (tip.includes("\n")) {
    throw new Error("tip must be a single line");
  }
}

// The grader sets MAKEFUN_OUTPUT_DIR; locally it defaults to ./output so
// the entry can be run and inspected without any setup. It is always
// treated as a directory, never as a file path.
function resolveOutputDir(): string {
  const dir = process.env.MAKEFUN_OUTPUT_DIR?.trim();
  return dir && dir.length > 0 ? dir : join(process.cwd(), "output");
}

// Write the tip as entry.txt inside the output directory. The file is
// created with mode 0644 so the grader can read it, and written with a
// trailing newline: the newline is cosmetic for humans reading the file,
// the tip itself is the single line above it.
function writeEntry(outputDir: string, tip: string): string {
  mkdirSync(outputDir, { recursive: true });
  const target = join(outputDir, "entry.txt");
  writeFileSync(target, tip + "\n", { encoding: "utf8", mode: 0o644 });
  // writeFileSync's mode is masked by the process umask, so set the mode
  // explicitly: the grader must be able to read the file.
  chmodSync(target, 0o644);
  return target;
}

function main(): void {
  validateTip(TIP);
  const outputDir = resolveOutputDir();
  const target = writeEntry(outputDir, TIP);
  const length = [...TIP].length;
  console.log(`wrote ${length}-character tip to ${target}`);
}

main();
