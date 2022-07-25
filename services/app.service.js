import getConfig from "next/config";

import { fetchWrapper } from "helpers";

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/app`;

/*
/app
    /[appTitle]
        /[username]
        /updateScore
        /leaderboard
            /[gridSize]
            /index
        /messages
            /[messageId]
            /sendMessage
*/

export const appService = {
  getBaseUrl,
  getMessages,
  sendMessage,
  updateScore,
  getUserScore,
  deleteMessage,
  getLeaderboard,
};

function getBaseUrl() {
  return publicRuntimeConfig.apiUrl;
}

function getUserScore(appTitle, username) {
  return fetchWrapper.get(`${baseUrl}/${appTitle}/${username}`);
}

function getLeaderboard(appTitle, gridSize) {
  if (!gridSize) {
    return fetchWrapper.get(`${baseUrl}/${appTitle}/leaderboard`);
  }

  return fetchWrapper.get(`${baseUrl}/${appTitle}/leaderboard/${gridSize}`);
}

function updateScore(appTitle, params) {
  return fetchWrapper.post(`${baseUrl}/${appTitle}/updateScore`, params);
}

function getMessages(username) {
  return fetchWrapper.get(`${baseUrl}/Anonymessage/${username}`);
}

function sendMessage(params) {
  return fetchWrapper.post(
    `${baseUrl}/Anonymessage/messages/sendMessage`,
    params
  );
}

function deleteMessage(messageId) {
  return fetchWrapper.delete(`${baseUrl}/Anonymessage/messages/${messageId}`);
}
