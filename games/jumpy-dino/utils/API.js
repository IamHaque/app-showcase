import { gameService } from "services";

const GAME_TITLE = "Jumpy Dino";

export const getLeaderboardData = async () => {
  try {
    const data = await gameService.getLeaderboard(GAME_TITLE);

    if (data && data.status && data.status === "success") {
      return [...data.leaderboard];
    }

    return [];
  } catch (_) {
    return [];
  }
};

export const updateLeaderboard = async (username, score) => {
  try {
    await gameService.updateScore(GAME_TITLE, {
      username,
      score,
    });
  } catch (_) {
    return;
  }
};
