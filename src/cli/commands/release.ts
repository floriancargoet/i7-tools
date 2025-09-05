import type { Command } from "commander";

import { InformCompiler } from "../../InformCompiler.js";
import { Project } from "../../Project.js";

type ReleaseOptions = {
  testing: boolean;
  silent: boolean;
};

export function registerReleaseCommand(program: Command) {
  program
    .command("release")
    .description("Releases the Inform project")
    .argument("[project]", ".inform directory", "")
    .option("-t, --testing", "Testing mode", false)
    .option("--silent", "Silent mode", false)
    .action((projectName: string, options: ReleaseOptions) => {
      const project = Project.fromPath(projectName);
      const compiler = new InformCompiler({
        project,
        testing: options.testing,
        silent: options.silent,
      });
      compiler.compileAndRelease();
    });
}
