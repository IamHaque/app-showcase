import { usersRepo, apiHandler } from "helpers/api";

import { ALL_GAMES } from "data";

export default apiHandler({
  get: getUsers,
});

async function getUsers(req, res) {
  // Get data from the request
  const { gameTitle } = req.query;

  // return if invalid gameTitle
  if (ALL_GAMES.findIndex((game) => game.title === gameTitle) < 0)
    throw "Game not in repository";

  const users = await usersRepo.getAllByGame(gameTitle);
  return res.status(200).json(users);
}
