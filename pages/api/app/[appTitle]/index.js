import { usersRepo, apiHandler } from "helpers/api";

import { ALL_APPS } from "data";

export default apiHandler({
  get: getUsers,
});

async function getUsers(req, res) {
  // Get data from the request
  const { appTitle } = req.query;

  // return if invalid appTitle
  if (ALL_APPS.findIndex((app) => app.title === appTitle) < 0)
    throw "App not in repository";

  const users = await usersRepo.getAllByApp(appTitle);
  return res.status(200).json(users);
}
