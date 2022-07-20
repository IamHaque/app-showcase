import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const usersRepo = {
  create,
  update,
  getAll,
  getByUsername,
  delete: _delete,
};

async function create({ name, username, password }) {
  await prisma.user.create({
    data: {
      name,
      username,
      password,
    },
  });
}

async function getAll() {
  const users = await prisma.user.findMany();
  const usernames = users.map((user) => user.username);
  return usernames;
}

async function getByUsername(username) {
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });

  return user;
}

async function update(username, params) {
  await prisma.user.update({
    where: {
      username: username,
    },
    data: params,
  });
}

async function _delete(username) {
  await prisma.user.delete({
    where: {
      username: username,
    },
  });
}
