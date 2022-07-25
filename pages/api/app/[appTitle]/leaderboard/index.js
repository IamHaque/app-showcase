import { usersRepo, apiHandler } from "helpers/api";

import { appType } from "helpers";
import { ALL_APPS } from "data";

export default apiHandler({
  get: getAppLeaderboard,
});

async function getAppLeaderboard(req, res) {
  // Get app title from the request
  const { appTitle } = req.query;

  // return if invalid appTitle
  if (!appTitle) throw "Invalid app title";

  // return if invalid appTitle
  if (ALL_APPS.findIndex((app) => app.title === appTitle) < 0)
    throw "App not in repository";

  // get all users for provided app
  const users = await usersRepo.getAllByApp(appTitle);

  // # App 1. Jumpy Dino
  if (appType.isJumpyDino(appTitle)) {
    return res.status(200).json({
      status: "success",
      leaderboard: createJDLeaderboardDataFromUsers(users),
    });
  }

  // # App 2. Tile Match
  if (appType.isTileMatch(appTitle))
    throw "Invalid endpoint for Tile Match leaderboard";

  // Server error
  throw "Server error";
}

const createJDLeaderboardDataFromUsers = (users) => {
  // Get leaderboard data
  let leaderboard = users
    .reduce((acc, user) => {
      return user.highscore > 0
        ? [
            ...acc,
            {
              rank: 0,
              score: user.highscore,
              username: user.username,
            },
          ]
        : acc;
    }, [])
    .sort((a, b) => b.score - a.score);

  // Rank the leaderboard appropriately
  let currentRank = 1;
  while (currentRank <= leaderboard.length) {
    const currentUserHighscore = leaderboard[currentRank - 1].score;
    leaderboard = leaderboard.map((user) => {
      return user.score === currentUserHighscore
        ? { ...user, rank: currentRank }
        : user;
    });

    const usersWithCurrentUserScore = leaderboard.filter(
      (user) => user.score === currentUserHighscore
    ).length;
    currentRank += usersWithCurrentUserScore;
  }

  return leaderboard;
};
