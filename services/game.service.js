import getConfig from "next/config";

import { fetchWrapper } from "helpers";

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/game`;

/*
/game
    /[gameTitle]
        /[username]
        /updateScore
        /leaderboard
            /[gridSize]
            /index
*/

export const gameService = {
  updateScore,
  getUserScore,
  getLeaderboard,
};

function getUserScore(gameTitle, username) {
  return fetchWrapper.get(`${baseUrl}/${gameTitle}/${username}`);
}

function getLeaderboard(gameTitle, gridSize) {
  if (!gridSize) {
    return fetchWrapper.get(`${baseUrl}/${gameTitle}/leaderboard`);
  }

  return fetchWrapper.get(`${baseUrl}/${gameTitle}/leaderboard/${gridSize}`);
}

function updateScore(gameTitle, params) {
  return fetchWrapper.post(`${baseUrl}/${gameTitle}/updateScore`, params);
}
