import fs from "node:fs";
import path from "node:path";

import { InvalidArgumentError } from "commander";

function exit(msg: string) {
  throw new InvalidArgumentError(msg);
}

export class Project {
  projectDir: string;
  projectName: string;

  static fromPath(possibleProjectPath: string) {
    /*
     * - is path ends with .inform, use it
     * - if path is "", use cwd as containing folder
     * - if path is folder, use as containing folder
     * - if using a containing folder, find one project inside
     */
    let projectPath = "";
    let parentFolder: string | null = null;
    if (possibleProjectPath === "") {
      parentFolder = process.cwd();
    } else if (!possibleProjectPath.endsWith(".inform")) {
      parentFolder = path.resolve(process.cwd(), possibleProjectPath);
    } else {
      projectPath = path.resolve(process.cwd(), possibleProjectPath);
    }

    if (parentFolder != null) {
      if (isDirectory(parentFolder)) {
        // Find project in parentFolder
        const files = fs.readdirSync(parentFolder);
        const candidates = files.filter((f) => f.endsWith(".inform"));
        if (candidates.length === 0) {
          exit("No project found in directory");
        } else if (candidates.length === 1) {
          // Use the only .inform that we found
          // We just checked the length, it's safe
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          projectPath = path.resolve(parentFolder, candidates[0]!);
        } else {
          exit("Multiple projects found in directory");
        }
      } else {
        exit("Not a directory or .inform project.");
      }
    }

    return new Project(projectPath);
  }

  constructor(projectPath: string) {
    this.projectDir = fs.realpathSync(projectPath);
    if (!fs.existsSync(this.projectDir)) {
      exit("Could not find project.");
    }
    this.projectName = path.basename(this.projectDir, ".inform");
  }

  get materialsDir() {
    return path.resolve(this.projectDir, "..", `${this.projectName}.materials`);
  }

  get materialsReleaseDir() {
    return path.resolve(this.materialsDir, "Release");
  }

  get buildDir() {
    return `${this.projectDir}/Build`;
  }

  get ulxPath() {
    return path.resolve(this.buildDir, "output.ulx");
  }

  get blurbPath() {
    return path.resolve(this.projectDir, "Release.blurb");
  }

  get sourcePath() {
    return path.resolve(this.projectDir, "Source/story.ni");
  }
}

function isDirectory(p: string) {
  try {
    return fs.statSync(p).isDirectory();
  } catch (e) {
    return false;
  }
}
