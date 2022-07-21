import { useRouter } from "next/router";

import { useEffect, useState } from "react";

import * as API from "games/jumpy-dino/utils/API";

import JumpyDinoHome from "games/jumpy-dino/pages";

import TileMatchHome from "games/tile-match/pages";
import TileMatchGame from "games/tile-match/pages/game";
import TileMatchLeaderboard from "games/tile-match/pages/leaderboard";

import { userService } from "services";

import { ALL_GAMES } from "/data";

const tileMatchGameScreens = Object.freeze({
  HOME: "home",
  GAME: "game",
  LEADERBOARD: "leaderboard",
});

export default Game;

function Game() {
  const router = useRouter();
  const { gameTitle, gameIndex } = router.query;

  const [leaderboardData, setLeaderboardData] = useState([]);
  const [tileMatchGameScreen, setTileMatchGameScreen] = useState(
    tileMatchGameScreens.HOME
  );

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const data = await API.getLeaderboardData();
      setLeaderboardData(data);
    };

    fetchLeaderboard().catch(console.error);
  }, []);

  useEffect(() => {
    // return to home page if no user of invalid game details
    if (!userService.userValue || ALL_GAMES[gameIndex]?.title !== gameTitle) {
      router.push("/");
    }
  }, [router.isReady]);

  if (gameTitle === "Jumpy Dino") {
    return (
      <JumpyDinoHome
        leaderboardData={leaderboardData}
        username={userService.userValue?.username}
      />
    );
  }

  if (gameTitle === "Tile Match") {
    return (
      <>
        {tileMatchGameScreen === tileMatchGameScreens.HOME && (
          <TileMatchHome
            startGameClickHandler={() => {
              setTileMatchGameScreen(tileMatchGameScreens.GAME);
            }}
            leaderboardClickHandler={() => {
              setTileMatchGameScreen(tileMatchGameScreens.LEADERBOARD);
            }}
            username={userService.userValue?.username}
          />
        )}

        {tileMatchGameScreen === tileMatchGameScreens.GAME && (
          <TileMatchGame
            username={userService.userValue?.username}
            homeClickHandler={() => {
              setTileMatchGameScreen(tileMatchGameScreens.HOME);
            }}
          />
        )}

        {tileMatchGameScreen === tileMatchGameScreens.LEADERBOARD && (
          <TileMatchLeaderboard
            homeClickHandler={() => {
              setTileMatchGameScreen(tileMatchGameScreens.HOME);
            }}
            username={userService.userValue?.username}
          />
        )}
      </>
    );
  }
}
