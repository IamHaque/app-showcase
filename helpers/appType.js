import { ALL_APPS } from "data";

export const appType = {
  isApp,
  isGame,
  isValidApp,
  isTileMatch,
  isJumpyDino,
  isPeskyBird,
  isAnonymessage,
};

function isApp(appTitle) {
  const appIndex = ALL_APPS.findIndex((app) => app.title === appTitle);
  if (appIndex < 0 || appIndex >= ALL_APPS.length) return false;
  return ALL_APPS[appIndex].type === "app";
}

function isGame(appTitle) {
  const appIndex = ALL_APPS.findIndex((app) => app.title === appTitle);
  if (appIndex < 0 || appIndex >= ALL_APPS.length) return false;
  return ALL_APPS[appIndex].type === "game";
}

function isValidApp(appTitle) {
  const app = ALL_APPS.find((app) => app.title === appTitle);
  return app !== undefined;
}

function isAnonymessage(appTitle) {
  return appTitle === ALL_APPS[0]?.title;
}

function isPeskyBird(appTitle) {
  return appTitle === ALL_APPS[1]?.title;
}

function isJumpyDino(appTitle) {
  return appTitle === ALL_APPS[2]?.title;
}

function isTileMatch(appTitle) {
  return appTitle === ALL_APPS[3]?.title;
}
