import os from "node:os";
import fs from "node:fs";
import cp from "node:child_process";
import path from "node:path";

import { Project } from "./Project.js";

const MACOS_APP_CONTENTS = "/Applications/Inform.app/Contents";
const PATHS = {
  darwin: {
    NI_BIN: `${MACOS_APP_CONTENTS}/MacOS/6L38/ni`,
    I6_BIN: `${MACOS_APP_CONTENTS}/MacOS/inform6`,
    CBLORB_BIN: `${MACOS_APP_CONTENTS}/MacOS/cBlorb`,

    INTERNAL: `${MACOS_APP_CONTENTS}/Resources/retrospective/6L38`,
    EXTERNAL: `${os.homedir()}/Library/Inform`,
    LIBRARY: `${MACOS_APP_CONTENTS}/Resources/Library/6.11`,
  },
};

function getPath(key: keyof (typeof PATHS)["darwin"]) {
  const platform = process.platform;
  if (platform in PATHS) {
    return PATHS[platform as keyof typeof PATHS][key];
  }
  throw new Error("Unsupported platform: " + platform);
}

type MandatoryOptions = {
  project: Project;
};

type OptionalOptions = {
  testing: boolean;
  silent: boolean;
};
type Options = MandatoryOptions & OptionalOptions;

const defaultOptions: OptionalOptions = {
  testing: false,
  silent: false,
};

export class InformCompiler {
  options: Options;
  project: Project;

  constructor(options: MandatoryOptions & Partial<OptionalOptions>) {
    this.options = Object.assign({}, defaultOptions, options);

    this.project = options.project;
  }

  exec(command: string, args: Array<string>) {
    // remove empty args, always execute in BUILD_DIR
    const result = cp.spawnSync(command, args.filter(Boolean), {
      stdio: ["inherit", this.options.silent ? "ignore" : "inherit", "inherit"],
      cwd: this.project.buildDir,
    });
    if (result.status !== 0) {
      process.exit(result.status);
    }
  }

  compileI7() {
    // Compile I7 to I6
    this.exec(getPath("NI_BIN"), [
      "-internal",
      getPath("INTERNAL"),
      "-external",
      getPath("EXTERNAL"),
      "-project",
      this.project.projectDir,
      "-format=ulx",
      "-noprogress",
      this.options.testing ? "" : "-release",
    ]);

    return this;
  }

  compileI6() {
    // Compile I6 to ULX
    this.exec(getPath("I6_BIN"), [
      // Flags (we use the same flags as the IDE on OSX)
      // k = output Infix debugging information to "gameinfo.dbg" (and switch -D on)
      // E2 = Macintosh MPW-style error messages
      // S = compile strict error-checking at run-time
      // D = insert "Constant DEBUG;" automatically
      // w = disable warning messages
      // G = compile a Glulx game file
      this.options.testing ? "-kE2SDwG" : "-kE2~S~DwG", // disable S & D but keep k in non-testing mode
      `+include_path=${getPath("LIBRARY")},.,../Source`,
      `${this.project.buildDir}/auto.inf`,
      this.project.ulxPath,
    ]);

    return this;
  }

  release(blurbPath = this.project.blurbPath) {
    // In testing mode on OSX, the blurb file doesn't contain release instructions
    // Let's add them
    if (this.options.testing && process.platform === "darwin") {
      // In the blurb file, we insert this missing line
      const insert = `release to "${this.project.materialsDir}/Release"\n`;
      // after this existing line
      const match = "project folder";

      let contents = fs.readFileSync(blurbPath, "utf8");
      if (!contents.includes(insert)) {
        const index = contents.indexOf(match);
        contents = [
          contents.slice(0, index),
          insert,
          contents.slice(index),
        ].join("");
        fs.writeFileSync(blurbPath, contents);
      }
    }

    // Release the story
    this.exec(getPath("CBLORB_BIN"), [
      blurbPath,
      path.resolve(this.project.buildDir, "output.gblorb"),
    ]);

    return this;
  }

  compileAndRelease() {
    return this.compileI7().compileI6().release();
  }
}
