import getConfig from "next/config";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { usersRepo, apiHandler } from "helpers/api";

const { serverRuntimeConfig } = getConfig();

export default apiHandler({
  post: authenticate,
});

async function authenticate(req, res) {
  const { username, password } = req.body;
  const user = await usersRepo.getByUsername(username);

  // validate
  if (!user || !bcrypt.compareSync(password, user.password)) {
    throw "Username or password is incorrect";
  }

  //   create a JWT that is valid for 7 days
  const token = jwt.sign(
    {
      sub: user.id,
    },
    serverRuntimeConfig.secret,
    { expiresIn: "7d" }
  );

  // return basic user details and token
  return res.status(200).json({
    token,
    id: user.id,
    name: user.name,
    username: user.username,
  });
}
