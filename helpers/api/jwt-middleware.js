import getConfig from "next/config";

import util from "util";
import { expressjwt } from "express-jwt";

const { serverRuntimeConfig } = getConfig();

export { jwtMiddleware };

function jwtMiddleware(req, res) {
  const middleware = expressjwt({
    secret: serverRuntimeConfig.secret,
    algorithms: ["HS256"],
  }).unless({
    path: [
      // public routes that don't require authentication
      "/api/users/register",
      "/api/users/authenticate",
      "/api/app/Anonymessage/messages/sendMessage",
      "/api/app/Anonymessage/messages/publicMessages",
    ],
  });

  return util.promisify(middleware)(req, res);
}
