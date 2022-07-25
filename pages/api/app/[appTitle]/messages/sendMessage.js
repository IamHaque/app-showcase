import { usersRepo, apiHandler } from "helpers/api";

import { appType } from "helpers";
import { ALL_APPS } from "data";

export default apiHandler({
  post: sendMessageToUser,
});

async function sendMessageToUser(req, res) {
  // Get data from the request
  const { appTitle } = req.query;
  const { recipient, message, sender } = req.body;

  // return if invalid appTitle
  if (ALL_APPS.findIndex((app) => app.title === appTitle) < 0)
    throw "App not in repository";

  // return if invalid message sent
  if (!message) throw "No message entered";

  // return if not Anonymessage app
  if (!appType.isAnonymessage(appTitle)) throw "Invalid endpoint for the app";

  // return if invalid message sent
  if (!recipient) throw "Invalid user";

  // return if user not found
  const user = await usersRepo.getByUsernameAndApp(recipient, appTitle);
  if (!user) throw "Unknown user";

  // send message
  await usersRepo.sendMessageToUser(appTitle, recipient, message, sender);
  return res.status(200).json({});
}
