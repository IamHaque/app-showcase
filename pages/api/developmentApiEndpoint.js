import { apiHandler, usersRepo } from "helpers/api";

export default apiHandler({
  get: register,
});

async function register(req, res) {
  const users = await usersRepo.getAll();
  console.log("Total users: " + users.length);

  const createdFor = [];
  for (let { username } of users) {
    console.log("Created for: " + username);
    try {
      await usersRepo.createAllForApp(username);
      createdFor.push(username);
    } catch (e) {}
  }

  return res.status(200).json({ createdFor });
}
