import { usersRepo, apiHandler } from "helpers/api";

import { ALL_GAMES } from "data";

export default apiHandler({
  get: getGameLeaderboard,
});

async function getGameLeaderboard(req, res) {
  // Get game title and grid size from the request
  const { gameTitle, gridSize } = req.query;

  // return if invalid gridSize
  if (!gridSize) throw "Invalid grid size";

  // return if invalid gameTitle
  if (!gameTitle) throw "Invalid game title";

  // return if invalid gameTitle
  if (ALL_GAMES.findIndex((game) => game.title === gameTitle) < 0)
    throw "Game not in repository";

  // get all users for provided game
  const users = await usersRepo.getAllByGame(gameTitle);

  // # Game 2. Tile Match
  if (gameTitle === ALL_GAMES[1].title) {
    return res.status(200).json({
      status: "success",
      leaderboard: createTMLeaderboardDataFromUsers(users, gridSize),
    });
  }

  // called for other games
  throw "Invalid endpoint for the game";
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
