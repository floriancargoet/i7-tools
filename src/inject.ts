#!/usr/bin/env node
import fs from "fs";
// @ts-expect-error Not typed
import Diff from "text-diff";
import chalk from "chalk";
import { Project } from "./Project.js";
import { InformParser } from "./InformParser.js";

export function inject(project: Project, texts: Record<string, string>) {
  const parser = new InformParser(project);
  const namedStrings = parser.getNamedStrings();

  let offset = 0;
  let modifiedCount = 0;
  let newSource = parser.source;
  let needsSeparator = false;
  console.log("-----");
  // Print external texts which are not found in the source.
  for (const id in texts) {
    if (!(id in namedStrings)) {
      console.log(`${id}: not in source.`);
      needsSeparator = true;
    }
  }
  if (needsSeparator) {
    needsSeparator = false;
    console.log("-----");
  }
  for (const [id, token] of Object.entries(namedStrings)) {
    needsSeparator = true;
    const start = token.start + 1;
    const end = token.end - 1;
    const existing = token.value.slice(1, -1);
    let newText: string;
    if (!(id in texts)) {
      newText = existing;
      console.log(`${id}: not in external document.`);
    } else {
      newText = texts[id]!;
      if (existing !== newText) {
        modifiedCount++;
        console.log(`${id}: ${coloredDiff(computeDiff(existing, newText))}`);
      } else {
        console.log(`${id}: up-to-date.`);
      }
    }
    newSource = replace(newSource, start + offset, end + offset, newText);
    offset += newText.length - (end - start);
  }
  fs.writeFileSync(project.sourcePath, newSource);

  if (needsSeparator) {
    needsSeparator = false;
    console.log("-----");
  }
  console.log(`Modified: ${modifiedCount}`);
}

function computeDiff(str1: string, str2: string) {
  const diff = new Diff();
  const result = diff.main(str1, str2);
  diff.cleanupSemantic(result);
  return result;
}

function coloredDiff(diffs: Array<[number, string]>) {
  return diffs
    .map(([op, text]) => {
      switch (op) {
        case 1:
          return chalk.green(text);
        case -1:
          return chalk.strikethrough.red(text);
        case 0:
          return text;
      }
    })
    .join("");
}

function replace(str: string, start: number, end: number, newStr: string) {
  const first = str.slice(0, start);
  const last = str.slice(end);
  return first + newStr + last;
}
