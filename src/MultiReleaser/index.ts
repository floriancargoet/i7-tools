import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { Project } from "../Project.js";

const selectVersionSource = fs.readFileSync(
  fileURLToPath(import.meta.resolve("./browser-select-version.js")),
  "utf-8"
);

type Map = {
  releases: Array<{
    date: string;
    signature: string;
    version: number;
    name: string;
    game: string;
  }>;
};

type MandatoryOptions = {
  project: Project;
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type OptionalOptions = {};
type Options = MandatoryOptions & OptionalOptions;

const defaultOptions: OptionalOptions = {};

export class MultiReleaser {
  options: Options;

  project: Project;

  releaseDir: string;
  releasesDir: string;
  releasesJSONPath: string;
  scriptJSPath: string;
  tempDir: string | null = null;

  constructor(options: MandatoryOptions & Partial<OptionalOptions>) {
    this.options = Object.assign({}, defaultOptions, options);
    this.project = options.project;

    this.releaseDir = path.resolve(this.project.materialsDir, "MultiRelease");
    this.releasesDir = path.resolve(this.releaseDir, "releases");
    this.releasesJSONPath = path.resolve(this.releaseDir, "releases.json");
    this.scriptJSPath = path.resolve(this.releaseDir, "select-version.js");
  }

  makeTempBlurb() {
    this.tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "i7-tools-"));
    const blurbPath = path.join(this.tempDir, "Release.blurb");
    // Copy blurb from project
    let blurbContents = fs.readFileSync(this.project.blurbPath, "utf-8");
    // Modify it
    blurbContents = blurbContents
      .replace(
        /placeholder \[ENCODEDSTORYFILE\] = "[^"]+\.gblorb.js"/,
        'placeholder [ENCODEDSTORYFILE] = "../select-version.js"'
      )
      .replace(/base64 "[^"]+" to "[^"]+\.gblorb\.js"/, "");
    // Write it
    fs.writeFileSync(blurbPath, blurbContents);
    return blurbPath;
  }

  removeTempBlurb() {
    if (this.tempDir != null) {
      fs.rmSync(this.tempDir, { recursive: true });
      this.tempDir = null;
    }
  }

  computeQuixeSignature(ulxFilepath: string) {
    // Compute the game signature (as done by quixe, 64 first bytes as hexa string)
    const file = fs.openSync(ulxFilepath, "r");
    const buf = Buffer.alloc(64);
    fs.readSync(file, buf, 0, 64, null);
    fs.closeSync(file);
    return buf.toString("hex");
  }

  addToMultiRelease() {
    // Take the current build from the Build directory
    const signature = this.computeQuixeSignature(this.project.ulxPath);
    console.log("Game signature:", signature);

    // Ensure directories exist
    if (!fs.existsSync(this.releaseDir)) fs.mkdirSync(this.releaseDir);
    if (!fs.existsSync(this.releasesDir)) fs.mkdirSync(this.releasesDir);

    // Update Release/releases.json
    let map: Map = {
      releases: [],
    };
    if (fs.existsSync(this.releasesJSONPath)) {
      try {
        map = JSON.parse(
          fs.readFileSync(this.releasesJSONPath, "utf-8")
        ) as Map;
      } catch (e) {
        console.log("Invalid releases.json");
      }
    }

    let lastVersion = 0;
    for (const release of map.releases) {
      if (signature === release.signature) {
        console.warn(
          `Signature already exists in releases.json: ${JSON.stringify(
            release,
            null,
            2
          )}`
        );
      }
      lastVersion = Math.max(lastVersion, release.version ?? -1);
    }
    const version = lastVersion + 1;
    const date = new Date();
    const name = `v${version}-${date.toISOString().slice(0, 10)}`;
    const game = `releases/${name}.ulx`;
    const gamePath = path.resolve(this.releaseDir, game);
    map.releases.push({
      date: date.toISOString(),
      signature,
      version,
      name,
      game,
    });

    fs.writeFileSync(this.releasesJSONPath, JSON.stringify(map, null, 2));
    fs.writeFileSync(
      this.scriptJSPath,
      selectVersionSource.replace(
        "const map = {}",
        `const map = ${JSON.stringify(map, null, 2)}`
      )
    );

    fs.copyFileSync(this.project.ulxPath, gamePath);

    // Copy the rest of the generated site
    for (const name of fs.readdirSync(this.project.materialsReleaseDir)) {
      const source = path.resolve(this.project.materialsReleaseDir, name);
      const target = path.resolve(this.releaseDir, name);
      fs.cpSync(source, target, { recursive: true });
    }
  }
}
