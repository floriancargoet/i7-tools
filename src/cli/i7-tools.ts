#!/usr/bin/env node
import { Command } from "commander";
import { registerReleaseCommand } from "./commands/release.js";
import { registerAddToMultiReleaseCommand } from "./commands/add-to-multirelease.js";
import { registerPullTextsCommand } from "./commands/pull-texts.js";

const program = new Command();

program.name("i7-tools");

registerReleaseCommand(program);
registerAddToMultiReleaseCommand(program);
registerPullTextsCommand(program);

program.parse();
