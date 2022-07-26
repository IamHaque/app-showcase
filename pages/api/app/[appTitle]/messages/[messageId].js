import { usersRepo, apiHandler } from "helpers/api";

import { appType } from "helpers";
import { ALL_APPS } from "data";

export default apiHandler({
  put: updateByMessageId,
  delete: deleteByMessageId,
});

async function updateByMessageId(req, res) {
  // Get data from the request
  const params = req.body;
  const { appTitle, messageId } = req.query;

  // return if invalid appTitle
  if (ALL_APPS.findIndex((app) => app.title === appTitle) < 0)
    throw "App not in repository";

  // return if invalid params passed
  if (!messageId) throw "Unknown message";

  // return if invalid params passed
  if (!params) throw "Invalid params";

  // # Anonymessage
  if (appType.isAnonymessage(appTitle)) {
    // delete message for user with message id
    await usersRepo.updateMessage(messageId, appTitle, params);
    return res.status(200).json({});
  }

  // called for other apps
  throw "Invalid endpoint for the app";
}

async function deleteByMessageId(req, res) {
  // Get data from the request
  const { appTitle, messageId } = req.query;

  // return if invalid appTitle
  if (ALL_APPS.findIndex((app) => app.title === appTitle) < 0)
    throw "App not in repository";

  // return if invalid params passed
  if (!messageId) throw "Unknown message";

  // # Anonymessage
  if (appType.isAnonymessage(appTitle)) {
    // delete message for user with message id
    await usersRepo.deleteMessage(messageId, appTitle);
    return res.status(200).json({});
  }

  // called for other apps
  throw "Invalid endpoint for the app";
}
