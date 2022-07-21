import { usersRepo, apiHandler } from "helpers/api";

import { ALL_GAMES } from "data";

export default apiHandler({
  get: getByUsernameAndGame,
});

async function getByUsernameAndGame(req, res) {
  // Get data from the request
  const { username, gameTitle } = req.query;

  // return if invalid gameTitle
  if (ALL_GAMES.findIndex((game) => game.title === gameTitle) < 0)
    throw "Game not in repository";

  // Return if user not found
  const user = await usersRepo.getByUsernameAndGame(username, gameTitle);
  if (!user) throw "Unknown user";

  // # Game 2. Tile Match
  if (gameTitle === ALL_GAMES[1].title) {
    // Return the scores for the user
    const scores = {
      2: user["score2x2"],
      4: user["score4x4"],
      6: user["score6x6"],
      8: user["score8x8"],
    };
    return res.status(200).json({ status: "success", scores });
  }

  // called for other games
  throw "Invalid endpoint for the game";
}
