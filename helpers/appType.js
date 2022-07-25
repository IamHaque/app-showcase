import { ALL_APPS } from "data";

export const appType = { isTileMatch, isJumpyDino, isAnonymessage };

function isAnonymessage(appTitle) {
  return appTitle === ALL_APPS[0].title;
}

function isJumpyDino(appTitle) {
  return appTitle === ALL_APPS[1].title;
}

function isTileMatch(appTitle) {
  return appTitle === ALL_APPS[2].title;
}
