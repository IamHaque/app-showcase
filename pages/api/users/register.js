import bcrypt from "bcryptjs";

import { apiHandler, usersRepo } from "helpers/api";

export default apiHandler({
  post: register,
});

async function register(req, res) {
  // split out password from user details
  const { name, username, password } = req.body;
  const user = await usersRepo.getByUsername(username);

  // validate
  if (user) {
    throw `${user.username} is already taken`;
  }

  await usersRepo.create({
    name,
    username,
    // hash password
    password: bcrypt.hashSync(password, 10),
  });
  return res.status(200).json({});
}
