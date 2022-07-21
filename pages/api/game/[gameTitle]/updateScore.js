import { usersRepo, apiHandler } from "helpers/api";

import { ALL_GAMES } from "data";

export default apiHandler({
  post: updateScore,
});

async function updateScore(req, res) {
  // Get data from the request
  const { gameTitle } = req.query;
  const { username, gridSize, score } = req.body;

  // return if invalid gameTitle
  if (ALL_GAMES.findIndex((game) => game.title === gameTitle) < 0)
    throw "Game not in repository";

  // Return if user not found
  const user = await usersRepo.getByUsernameAndGame(username, gameTitle);
  if (!user) throw "Unknown user";

  // stores the score to be updated
  let scoreToUpdate = score;

  // # Game 1. Jumpy Dino
  if (gameTitle === ALL_GAMES[0].title) {
    // return if invalid params passed
    if (score === undefined) throw "Invalid params";
    // Return if current score is not highscore
    if (user.highscore >= score) throw "Score less than current highscore";
  }

  // # Game 2. Tile Match
  if (gameTitle === ALL_GAMES[1].title) {
    // return if invalid params passed
    if (!gridSize || score === undefined) throw "Invalid params";
    // map score to correct grid
    if (gridSize === 2) scoreToUpdate = { score2x2: score };
    if (gridSize === 4) scoreToUpdate = { score4x4: score };
    if (gridSize === 6) scoreToUpdate = { score6x6: score };
    if (gridSize === 8) scoreToUpdate = { score8x8: score };
  }

  // Update game scores
  await usersRepo.updateScore(username, gameTitle, scoreToUpdate);
  return res.status(200).json({});
}
