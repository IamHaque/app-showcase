import { usersRepo, apiHandler } from "helpers/api";

import { appType } from "helpers";
import { ALL_APPS } from "data";

export default apiHandler({
  post: updateScore,
});

async function updateScore(req, res) {
  // Get data from the request
  const { appTitle } = req.query;
  const { username, gridSize, score } = req.body;

  // return if invalid appTitle
  if (ALL_APPS.findIndex((app) => app.title === appTitle) < 0)
    throw "App not in repository";

  // Return if user not found
  const user = await usersRepo.getByUsernameAndApp(username, appTitle);
  if (!user) throw "Unknown user";

  // stores the score to be updated
  let scoreToUpdate = score;

  // # App 1. Jumpy Dino
  if (appType.isJumpyDino(appTitle)) {
    // return if invalid params passed
    if (score === undefined) throw "Invalid params";
    // Return if current score is not highscore
    if (user.highscore >= score) throw "Score less than current highscore";
  }

  // # App 2. Tile Match
  if (appType.isTileMatch(appTitle)) {
    // return if invalid params passed
    if (!gridSize || score === undefined) throw "Invalid params";
    // map score to correct grid
    if (gridSize === 2) scoreToUpdate = { score2x2: score };
    if (gridSize === 4) scoreToUpdate = { score4x4: score };
    if (gridSize === 6) scoreToUpdate = { score6x6: score };
    if (gridSize === 8) scoreToUpdate = { score8x8: score };
  }

  // Update app scores
  await usersRepo.updateScore(username, appTitle, scoreToUpdate);
  return res.status(200).json({});
}
