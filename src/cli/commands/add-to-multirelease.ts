import type { Command } from "commander";
import { InformCompiler } from "../../InformCompiler.js";
import { Project } from "../../Project.js";
import { MultiReleaser } from "../../MultiReleaser/index.js";

export function registerAddToMultiReleaseCommand(program: Command) {
  program
    .command("add-to-multirelease")
    .description(
      "Create a release and add it to the .materials/MultiRelease/ folder"
    )
    .argument("[project]", ".inform directory", "")
    .action((projectName: string) => {
      const project = Project.fromPath(projectName);

      const compiler = new InformCompiler({ project });
      const releaser = new MultiReleaser({ project });
      // We use a modified Release.blurb to include select-version.js
      const customBlurb = releaser.makeTempBlurb();
      compiler.compileI6().compileI7().release(customBlurb);
      releaser.removeTempBlurb();
      releaser.addToMultiRelease();
    });
}
