import { PrismaClient } from "@prisma/client";

import { appType } from "helpers";

const prisma = new PrismaClient();

export const usersRepo = {
  create,
  update,
  getAll,
  updateScore,
  getAllByApp,
  deleteMessage,
  updateMessage,
  getByUsername,
  delete: _delete,
  sendMessageToUser,
  getByUsernameAndApp,
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

  await prisma.anonymessageUser.create({
    data: {
      username,
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

async function getByUsernameAndApp(username, appTitle) {
  // Jumpy Dino
  if (appType.isJumpyDino(appTitle)) {
    return await prisma.jumpyDinoUser.findUnique({
      where: {
        username: username,
      },
    });
  }

  // Tile Match
  if (appType.isTileMatch(appTitle)) {
    return await prisma.tileMatchUser.findUnique({
      where: {
        username: username,
      },
    });
  }

  // Anonymessage
  if (appType.isAnonymessage(appTitle)) {
    return await prisma.anonymessageUser.findUnique({
      where: {
        username: username,
      },
      include: {
        messages: true, // All messages for current user
      },
    });
  }

  // Invalid appTitle
  return;
}

async function getAllByApp(appTitle) {
  // Jumpy Dino
  if (appType.isJumpyDino(appTitle)) {
    return await prisma.jumpyDinoUser.findMany();
  }

  // Tile Match
  if (appType.isTileMatch(appTitle)) {
    return await prisma.tileMatchUser.findMany();
  }

  // Invalid appTitle
  return;
}

async function update(username, params) {
  await prisma.user.update({
    where: {
      username: username,
    },
    data: params,
  });
}

async function updateScore(username, appTitle, score) {
  // Jumpy Dino
  if (appType.isJumpyDino(appTitle)) {
    await prisma.jumpyDinoUser.update({
      where: {
        username: username,
      },
      data: { highscore: score },
    });
  }

  // Tile Match
  else if (appType.isTileMatch(appTitle)) {
    await prisma.tileMatchUser.update({
      where: {
        username: username,
      },
      data: score,
    });
  }

  // Invalid appTitle
  return;
}

async function updateMessage(messageId, appTitle, params) {
  // Invalid appTitle
  if (!appType.isAnonymessage(appTitle)) return;

  // Anonymessage
  await prisma.anonymessageMessage.update({
    where: {
      id: messageId,
    },
    data: params,
  });
}

async function sendMessageToUser(appTitle, recipient, message, sender) {
  // Invalid appTitle
  if (!appType.isAnonymessage(appTitle)) return;

  // Anonymessage
  await prisma.anonymessageUser.update({
    where: {
      username: recipient,
    },
    data: {
      messages: {
        create: [
          {
            sender: sender,
            message: message,
          },
        ],
      },
    },
  });
}

async function _delete(username) {
  await prisma.user.delete({
    where: {
      username: username,
    },
  });
}

async function deleteMessage(messageId, appTitle) {
  // Invalid appTitle
  if (!appType.isAnonymessage(appTitle)) return;

  // Anonymessage
  await prisma.anonymessageMessage.delete({
    where: {
      id: messageId,
    },
  });
}
