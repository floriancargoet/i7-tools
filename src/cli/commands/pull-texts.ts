import { InvalidArgumentError, type Command } from "commander";

import { Project } from "../../Project.js";
import { getTextsFromGoogleDocs } from "../../google-docs.js";
import { inject } from "../../inject.js";

type PullTextsOptions = {
  googleDoc: string;
  heading: Uppercase<string>;
};

export function registerPullTextsCommand(program: Command) {
  program
    .command("pull-texts")
    .description(
      "Pull texts from a source and inject them in the Inform 7 source"
    )
    .argument("[project]", ".inform directory", "")
    .requiredOption(
      "--google-doc <URL_OR_ID>",
      "URL to a Google Doc or ID",
      extractID
    )
    .option(
      "--heading <HEADING>",
      "Heading tag to identify texts",
      parseHeading,
      "H2"
    )
    .action(async (projectName: string, options: PullTextsOptions) => {
      const project = Project.fromPath(projectName);
      const textsMap = await getTextsFromGoogleDocs(options.googleDoc, {
        headingTag: options.heading,
      });
      inject(project, textsMap);
    });
}

function parseHeading(h: string) {
  if (!/^h[1-6]$/.test(h))
    throw new InvalidArgumentError("Invalid heading (H1, H2,… H6).");
  return h.toUpperCase();
}

function extractID(urlOrId: string) {
  let id: string | undefined;
  if (URL.canParse(urlOrId)) {
    // We just checked canParse, it's safe
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const url = URL.parse(urlOrId)!;
    if (
      url.hostname !== "docs.google.com" ||
      !url.pathname.startsWith("/document/d/")
    ) {
      throw new InvalidArgumentError(`Not a Google Doc URL: ${url}.`);
    }
    const parts = url.pathname.split("/");
    id = parts[3]; // ["", "document", "d", "<ID>"]
  } else {
    id = urlOrId;
  }
  if (id == null || !/^[\w]+$/.test(id)) {
    throw new InvalidArgumentError(`Not a Google Doc ID: ${id}.`);
  }
  return id;
}
