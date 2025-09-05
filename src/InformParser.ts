import fs from "node:fs";
import { Project } from "./Project.js";

type Token = {
  type: "comment" | "string";
  start: number;
  end: number;
  value: string;
  comment?: Token;
};

/* This only parses strings & comments are required by the pull-texts command */
export class InformParser {
  project: Project;
  private _source: string | null = null;
  constructor(project: Project) {
    this.project = project;
  }

  get source() {
    if (this._source == null) {
      this._source = fs.readFileSync(this.project.sourcePath, "utf-8");
    }
    return this._source;
  }

  parse() {
    const tokens: Array<Token> = [];
    let currentToken: Token | undefined;
    let i = 0;
    let inComment = 0; // Number to track nesting.
    let inString = false;
    let inSubstitution = false;
    const source = this.source;

    function startToken(type: "string" | "comment", attachComment = false) {
      if (currentToken) throw new Error("token still in progress");
      currentToken = {
        type,
        start: i,
        end: source.length,
        value: "",
      };
      // attach previous comment if just before
      if (attachComment) {
        const lastToken = tokens[tokens.length - 1];
        if (lastToken?.type === "comment" && lastToken.end === i) {
          currentToken.comment = lastToken;
        }
      }
    }
    function endToken() {
      if (!currentToken) throw new Error("token missing");
      currentToken.end = i + 1;
      currentToken.value = source.slice(currentToken.start, currentToken.end);
      tokens.push(currentToken);
      currentToken = undefined;
    }
    for (i = 0; i < source.length; i++) {
      const c = source.charAt(i);
      switch (c) {
        case "[": {
          if (inComment > 0) {
            // nested comment
            inComment++;
          } else if (inString) {
            // substitution
            inSubstitution = true;
          } else {
            inComment = 1;
            startToken("comment");
          }
          break;
        }
        case "]": {
          if (inComment > 0) {
            inComment--;
            if (inComment === 0) {
              endToken();
            }
          } else if (inString) {
            // substitution
            inSubstitution = false;
          }
          break;
        }
        case '"': {
          if (inString) {
            inString = false;
            endToken();
          } else if (inComment > 0) {
            // still in comment
          } else {
            inString = true;
            startToken("string", true);
          }
          break;
        }
      }
      if (inComment < 0) {
        throw new Error("Syntax error: Too many closing comments.");
      }
    }
    return tokens;
  }

  getNamedStrings() {
    const tokens = this.parse();
    const namedStringsTokens = tokens.filter(
      (t) => t.type === "string" && t.comment
    );
    const namedStrings: Record<string, Token> = {};
    for (const t of namedStringsTokens) {
      const name = t.comment?.value.slice(1, -1) ?? "";
      namedStrings[name] = t;
    }
    return namedStrings;
  }
}
