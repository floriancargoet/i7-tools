# i7-tools

My collection of tools to work with Inform 7.

## i7-tools release

:warning: **Note**: for now, it only works on MacOS with Inform 6L38.

`i7-tools release [project]`: Releases the project, just like in the IDE.

`i7-tools release --testing [project]`: Releases the project in testing mode.

:information_source: **Note**: it fixes a bug on MacOS where the IDE doesn't release properly when using testing mode.

## i7-tools add-to-multirelease

:warning: **Note**: for now, it only works on MacOS with Inform 6L38.

When playing an Inform game online, your saves only work with that exact version. If the author publishes a new version, your saves are dead.

The concept of _multirelease_ is to keep around all the published versions of your game and select the best one for the player based on their saves.

- If the player has no saves, it loads the latest version.
- If the player has a save for the latest version, it loads the latest version.
- If the player only has a save for an older version, it **prompts** the player so they can pick that version or the latest.

`i7-tools add-to-multirelease [project]`: Releases the project in `*.materials/MultiRelease`.

:warning: **Note**:
It only works for Quixe. It should works with any website template.
It loads the game files via XHR so it won't work locally, it needs to be served by a web server (`npx serve *.materials/MultiRelease`)

## i7-tools pull-texts

`i7-tools pull-texts --google-doc <URL>`: Extract texts from a Google Doc, identified by their heading (H2 by default), and inject them in texts marked by `[id]` comments in your source file.

It detects bold and italics and convert them to `[b][/b]` and `[i][/i]` so you'll need them defined in your source. That's available in `Supplemental by Jeff Nyman`, `Typographical Conveniences by Daniel Stelzer` or just copy:

```
To say i -- beginning say_i -- running on: (- style underline; -).
To say /i -- ending say_i -- running on: (- style roman; -).

To say b -- beginning say_b -- running on: (- style bold; -).
To say /b -- ending say_b -- running on: (- style roman; -).
```
