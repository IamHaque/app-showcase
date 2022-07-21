import { usersRepo, apiHandler } from "helpers/api";

import { ALL_GAMES } from "data";

export default apiHandler({
  get: getGameLeaderboard,
});

async function getGameLeaderboard(req, res) {
  // Get game title from the request
  const { gameTitle } = req.query;

  // return if invalid gameTitle
  if (!gameTitle) throw "Invalid game title";

  // return if invalid gameTitle
  if (ALL_GAMES.findIndex((game) => game.title === gameTitle) < 0)
    throw "Game not in repository";

  // get all users for provided game
  const users = await usersRepo.getAllByGame(gameTitle);

  // # Game 1. Jumpy Dino
  if (gameTitle === ALL_GAMES[0].title) {
    return res.status(200).json({
      status: "success",
      leaderboard: createJDLeaderboardDataFromUsers(users),
    });
  }

  // # Game 2. Tile Match
  if (gameTitle === ALL_GAMES[1].title)
    throw "Invalid endpoint for Tile Match leaderboard";
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
