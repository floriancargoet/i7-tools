const map = {};

$(function () {
  // Identify releases with a save
  const saves = [];
  for (const key in localStorage) {
    for (const release of map.releases) {
      if (key.startsWith(`content:save:${release.signature}`)) {
        const saveName = key.split(":").pop();
        saves.push({
          name: saveName,
          release,
        });
      } else if (key === `autosave:${release.signature}`) {
        saves.push({
          name: "Auto Save",
          release,
        });
      }
    }
  }
  const lastRelease = map.releases[map.releases.length - 1];
  let selectedRelease = lastRelease;
  if (saves.length > 0) {
    if (saves.find((s) => s.release === lastRelease)) {
      console.log("Save found for latest version: loading latest version");
    } else {
      // We found a save for an older version (and not the latest)
      let latestOldSaveVersion = 0;
      let latestOldSave;
      for (const save of saves) {
        if (latestOldSaveVersion < save.release.version) {
          latestOldSaveVersion = save.release.version;
          latestOldSave = save;
        }
      }

      if (
        confirm(
          `Une sauvegarde pour une ancienne version (${latestOldSave.release.name}) a été trouvée, voulez vous charger cette version ? (puis commande CHARGER pour choisir la sauvegarde)`
        )
      ) {
        console.log("Old save found: loading old version");
        selectedRelease = latestOldSave.release;
      } else {
        console.log("Old version found but rejected: loading latest version");
      }
    }
  } else {
    console.log("No save found: loading latest version");
  }

  game_options.default_story = selectedRelease.game;
  GiLoad.load_run();
});
