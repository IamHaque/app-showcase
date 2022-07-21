import { PrismaClient } from "@prisma/client";

import { ALL_GAMES } from "data";

const prisma = new PrismaClient();

export const usersRepo = {
  create,
  update,
  getAll,
  updateScore,
  getAllByGame,
  getByUsername,
  delete: _delete,
  getByUsernameAndGame,
};

async function create({ name, username, password }) {
  await prisma.user.create({
    data: {
      name,
      username,
      password,
    },
  });

  await prisma.jumpyDinoUser.create({
    data: {
      username,
      highscore: 0,
    },
  });

  await prisma.tileMatchUser.create({
    data: {
      username,
      score2x2: 0,
      score4x4: 0,
      score6x6: 0,
      score8x8: 0,
    },
  });
}

async function getAll() {
  return await prisma.user.findMany();
}

async function getByUsername(username) {
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });

  return user;
}

async function getByUsernameAndGame(username, gameTitle) {
  // Jumpy Dino
  if (gameTitle === ALL_GAMES[0].title) {
    return await prisma.jumpyDinoUser.findUnique({
      where: {
        username: username,
      },
    });
  }

  // Tile Match
  if (gameTitle === ALL_GAMES[1].title) {
    return await prisma.tileMatchUser.findUnique({
      where: {
        username: username,
      },
    });
  }
}

async function getAllByGame(gameTitle) {
  // Jumpy Dino
  if (gameTitle === ALL_GAMES[0].title) {
    return await prisma.jumpyDinoUser.findMany();
  }

  // Tile Match
  if (gameTitle === ALL_GAMES[1].title) {
    return await prisma.tileMatchUser.findMany();
  }
}

async function update(username, params) {
  await prisma.user.update({
    where: {
      username: username,
    },
    data: params,
  });
}

async function updateScore(username, gameTitle, score) {
  // Jumpy Dino
  if (gameTitle === ALL_GAMES[0].title) {
    await prisma.jumpyDinoUser.update({
      where: {
        username: username,
      },
      data: { highscore: score },
    });
  }

  // Tile Match
  else if (gameTitle === ALL_GAMES[1].title) {
    await prisma.tileMatchUser.update({
      where: {
        username: username,
      },
      data: score,
    });
  }
}

async function _delete(username) {
  await prisma.user.delete({
    where: {
      username: username,
    },
  });
}
