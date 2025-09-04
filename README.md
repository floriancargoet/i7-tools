# i7-tools

My collection of tools to work with Inform 7.

**Note**: for now, it only works on MacOS with Inform 6L38.

## i7-tools release

`i7-tools release [project]`: Releases the project, just like in the IDE.

`i7-tools release --testing [project]`: Releases the project in testing mode.
**Note**: it fixes a bug on MacOS where the IDE doesn't release properly when using testing mode.

## i7-tools add-to-multirelease

When playing an Inform game online, your saves only work with that exact version. If the author published a new version, your saves are dead.

The concept of _multirelease_ is to keep around all the published versions of your game and select the best one for the player based on their saves.

- If the player has no saves, it loads the latest version.
- If the player has a save for the latest version, it loads the latest version.
- If the player only has a save for an older version, it **prompts** the player so they can pick that version or the latest.

`i7-tools add-to-multirelease [project]`: Releases the project in `*.materials/MultiRelease`.

**Note**:
It only works for Quixe. It should works with any website template.
It loads the game files via XHR so it won't work locally, it needs to be served by a web server (`npx serve *.materials/MultiRelease`)
