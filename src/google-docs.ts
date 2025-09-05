import { type DOMWindow, JSDOM } from "jsdom";

type StyleMap = Record<string, (styles: CSSStyleDeclaration) => boolean>;

type Options = {
  headingTag: Uppercase<string>;
  styleMap: StyleMap;
};

const defaultOptions: Options = {
  headingTag: "H2",
  styleMap: {
    b: (styles) => styles.fontWeight === "700",
    i: (styles) => styles.fontStyle === "italic",
  },
};

export async function getTextsFromGoogleDocs(
  id: string,
  options?: Partial<Options>
) {
  const doc = await getGoogleDocHTML(id);
  const parser = new HTMLDocParser(doc, {
    ...defaultOptions,
    ...options,
  });
  return parser.getTexts();
}

async function getGoogleDocHTML(id: string) {
  const url = `https://docs.google.com/document/d/${id}/export?format=html`;
  const resp = await fetch(url);
  const html = await resp.text();
  return html;
}

class HTMLDocParser {
  window: DOMWindow;
  options: Options;

  constructor(source: string, options: Options) {
    this.options = options;
    const jsdom = new JSDOM(source);
    this.window = jsdom.window;
  }

  getTexts(): Record<string, string> {
    const texts: Record<string, string> = {};
    const document = this.window.document;
    // Start at the first heading.
    let node = document.querySelector<HTMLElement>(this.options.headingTag);
    let currentText: Array<string> = [];
    let currentID = "";
    function commit() {
      if (currentID) {
        texts[currentID] = convertLineBreaksToInform(currentText.join("\n"));
      }
      currentText = [];
    }
    // And read all siblings.
    while (node) {
      // Any heading closes the current text.
      if (isHeading(node.tagName)) {
        // Commit previous text.
        commit();
        // Fast forward to next correct heading.
        while (node && node.tagName !== this.options.headingTag) {
          node = node.nextElementSibling as HTMLElement;
        }
        // We found a suitable heading.
        if (node) {
          // Start a text with that ID.
          currentID = node.textContent ?? "";
        } else {
          currentID = "";
          // End of doc, abort.
          break;
        }
      } else {
        currentText.push(this.parseParagraph(node));
      }
      // Get next sibling for the next loop turn.
      node = node.nextElementSibling as HTMLElement;
    }

    // Commit pending text.
    commit();

    return texts;
  }

  parseParagraph(el: HTMLElement): string {
    let text = "";
    let node = el.firstElementChild as HTMLElement;
    while (node) {
      text += this.formatSpan(node);
      node = node.nextElementSibling as HTMLElement;
    }
    return text;
  }

  formatSpan(el: Element) {
    const text = el.textContent ?? "";
    const computedStyles = this.window.getComputedStyle(el);
    for (const [tag, test] of Object.entries(this.options.styleMap)) {
      if (test(computedStyles)) {
        return `[${tag}]${text}[/${tag}]`;
      }
    }
    return text;
  }
}

function convertLineBreaksToInform(str: string) {
  // Runs of multiple \n are respected by Inform,
  // but if there's only one \n, it's interpreted as a space.
  // We add an explicit [line break] to lonely \n.
  // Regexp matches a \n neither preceded nor followed by another \n.
  return str.replaceAll(/(?<!\n)\n(?!\n)/g, "\n[line break]");
}

function isHeading(tagName: string) {
  return /^H[1-4]$/.test(tagName);
}
