import { usersRepo, apiHandler } from "helpers/api";

import { appType } from "helpers";
import { ALL_APPS } from "data";

export default apiHandler({
  get: getByUsernameAndApp,
});

async function getByUsernameAndApp(req, res) {
  // Get data from the request
  const { username, appTitle } = req.query;

  // return if invalid appTitle
  if (ALL_APPS.findIndex((app) => app.title === appTitle) < 0)
    throw "App not in repository";

  // Return if user not found
  const user = await usersRepo.getByUsernameAndApp(username, appTitle);
  if (!user) throw "Unknown user";

  // # Tile Match
  if (appType.isTileMatch(appTitle)) {
    // Return the scores for the user
    const scores = {
      2: user["score2x2"],
      4: user["score4x4"],
      6: user["score6x6"],
      8: user["score8x8"],
    };
    return res.status(200).json({ status: "success", scores });
  }

  // # Anonymessage
  if (appType.isAnonymessage(appTitle)) {
    // Return the messages for the user
    const messages = user.messages.map(
      ({ id, reply, message, isPublic, repliedAt, createdAt }) => {
        return {
          reply,
          message,
          isPublic,
          repliedAt,
          messageId: id,
          time: createdAt,
          from: "Anonymous",
        };
      }
    );
    return res.status(200).json({ status: "success", messages });
  }

  // called for other apps
  throw "Invalid endpoint for the app";
}
