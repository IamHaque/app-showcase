import { usersRepo, apiHandler } from "helpers/api";

import { appType } from "helpers";
import { ALL_APPS } from "data";

export default apiHandler({
  post: getPublicMessages,
});

async function getPublicMessages(req, res) {
  // Get data from the request
  const { isPublic, username } = req.body;
  const { appTitle } = req.query;

  // return if invalid appTitle
  if (ALL_APPS.findIndex((app) => app.title === appTitle) < 0)
    throw "App not in repository";

  // return if invalid params passed
  if (!username || isPublic === undefined) throw "Invalid params";

  // Return if user not found
  const user = await usersRepo.getByUsernameAndApp(username, appTitle);
  if (!user) throw "Unknown user";

  // # Anonymessage
  if (appType.isAnonymessage(appTitle)) {
    // Return the messages for the user
    const messages = user.messages
      .filter((message) => message.isPublic === isPublic)
      .map(({ reply, message, createdAt }) => {
        return {
          reply,
          message,
          time: createdAt,
          from: "Anonymous",
        };
      })
      .reverse();
    return res.status(200).json({ status: "success", messages });
  }

  // called for other apps
  throw "Invalid endpoint for the app";
}
