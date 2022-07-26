import { omit, usersRepo, apiHandler } from "helpers/api";

export default apiHandler({
  get: getUsers,
});

async function getUsers(req, res) {
  const response = await usersRepo.getAll();
  const users = response.map((x) => omit(x, "password"));
  return res.status(200).json(users);
}
