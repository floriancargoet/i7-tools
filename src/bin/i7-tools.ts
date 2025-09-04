#!/usr/bin/env node
import { Command } from "commander";
import { InformCompiler } from "../InformCompiler.js";
import { MultiReleaser } from "../MultiReleaser/index.js";
import { Project } from "../Project.js";

const program = new Command();

program.name("i7-tools");

program
  .command("release")
  .description("Releases the Inform project")
  .argument("[project]", ".inform directory")
  .option("-t, --testing", "Testing mode", false)
  .option("--silent", "Silent mode", false)
  .action(
    (
      projectPath: string = "",
      options: { testing: boolean; silent: boolean }
    ) => {
      const project = Project.fromPath(projectPath);
      const compiler = new InformCompiler({
        project,
        testing: options.testing,
        silent: options.silent,
      });
      compiler.compileAndRelease();
    }
  );

program
  .command("add-to-multirelease")
  .description("Add the current release to the .materials/MultiRelease/ folder")
  .argument("[project]", ".inform directory")
  .action((projectPath: string = "") => {
    // TODO: do a custom release with a special blurb file (replacing [ENCODEDFILE])
    const project = Project.fromPath(projectPath);
    const compiler = new InformCompiler({ project });
    const releaser = new MultiReleaser({ project });
    const customBlurb = releaser.makeTempBlurb();
    compiler.compileI6().compileI7().release(customBlurb);
    releaser.removeTempBlurb();
    releaser.addToMultiRelease();
  });

program.parse();
