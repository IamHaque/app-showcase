import { usersRepo, apiHandler } from "helpers/api";

import { appType } from "helpers";
import { ALL_APPS } from "data";

export default apiHandler({
  get: getAppLeaderboard,
});

async function getAppLeaderboard(req, res) {
  // Get app title and grid size from the request
  const { appTitle, gridSize } = req.query;

  // return if invalid gridSize
  if (!gridSize) throw "Invalid grid size";

  // return if invalid appTitle
  if (!appTitle) throw "Invalid app title";

  // return if invalid appTitle
  if (ALL_APPS.findIndex((app) => app.title === appTitle) < 0)
    throw "App not in repository";

  // get all users for provided app
  const users = await usersRepo.getAllByApp(appTitle);

  // # App 2. Tile Match
  if (appType.isTileMatch(appTitle)) {
    return res.status(200).json({
      status: "success",
      leaderboard: createTMLeaderboardDataFromUsers(users, gridSize),
    });
  }

  // called for other apps
  throw "Invalid endpoint for the app";
}

const createTMLeaderboardDataFromUsers = (users, gridSize) => {
  // Get leaderboard data for grid size
  let leaderboard = users
    .reduce((acc, user) => {
      const score = getGridScoreForUser(user, gridSize);
      return score > 0
        ? [
            ...acc,
            {
              rank: 0,
              score,
              username: user.username,
            },
          ]
        : acc;
    }, [])
    .sort((a, b) => b.score - a.score);

  // Rank the leaderboard appropriately
  let currentRank = 1;
  while (currentRank <= leaderboard.length) {
    const currentUserScore = leaderboard[currentRank - 1].score;
    leaderboard = leaderboard.map((user) => {
      return user.score === currentUserScore
        ? { ...user, rank: currentRank }
        : user;
    });

    const usersWithCurrentUserScore = leaderboard.filter(
      (user) => user.score === currentUserScore
    ).length;
    currentRank += usersWithCurrentUserScore;
  }

  return leaderboard;
};

const getGridScoreForUser = (user, gridSize) => {
  if (gridSize === "2") return user["score2x2"];
  if (gridSize === "4") return user["score4x4"];
  if (gridSize === "6") return user["score6x6"];
  if (gridSize === "8") return user["score8x8"];
  return null;
};
