import bcrypt from "bcryptjs";

import { omit, usersRepo, apiHandler } from "helpers/api";

export default apiHandler({
  put: update,
  delete: _delete,
  get: getByUsername,
});

async function getByUsername(req, res) {
  const user = await usersRepo.getByUsername(req.query.username);

  if (!user) throw "User not found";

  return res.status(200).json(omit(user, "password"));
}

async function update(req, res) {
  const user = await usersRepo.getByUsername(req.query.username);

  if (!user) throw "User not found";

  const { password, ...params } = req.body;

  // validate
  if (
    user.username !== params.username &&
    (await usersRepo.getByUsername(params.username))
  ) {
    throw `"${params.username} is already taken`;
  }

  // only update hashed password if entered
  if (password) {
    user.password = bcrypt.hashSync(password, 10);
  }

  await usersRepo.update(req.query.username, params);
  return res.status(200).json({});
}

async function _delete(req, res) {
  await usersRepo.delete(req.query.username);
  return res.status(200).json({});
}
