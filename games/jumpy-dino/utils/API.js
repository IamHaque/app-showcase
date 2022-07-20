export const getLeaderboardData = async (hostname) => {
  try {
    const URL = hostname
      ? hostname + "/api/games/jumpy-dino/leaderboard"
      : "/api/games/jumpy-dino/leaderboard";

    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    const response = await fetch(URL, requestOptions);
    const data = await response.json();

    if (data && data.status && data.status === "success") {
      return [...data.leaderboard];
    }

    return [];
  } catch (e) {
    return [];
  }
};

export const updateLeaderboard = async (username, score) => {
  try {
    const requestOptions = {
      method: "POST",
      body: JSON.stringify({ username, score }),
      headers: { "Content-Type": "application/json" },
    };

    await fetch("/api/games/jumpy-dino/updateHighscore", requestOptions);
  } catch (e) {
    return;
  }
};

export const createNewUser = async (username) => {
  try {
    const requestOptions = {
      method: "POST",
      body: JSON.stringify({ username }),
      headers: { "Content-Type": "application/json" },
    };

    const response = await fetch(
      "/api/games/jumpy-dino/createUser",
      requestOptions
    );
    return await response.json();
  } catch (e) {
    return { status: "failed", message: "Unknown error occurred" };
  }
};
