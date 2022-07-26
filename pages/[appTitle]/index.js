import { useRouter } from "next/router";

import { useEffect, useState } from "react";

import AnonymessageHome from "apps/anonymessage/pages";

import JumpyDinoHome from "apps/jumpy-dino/pages";

import TileMatchHome from "apps/tile-match/pages";
import TileMatchGame from "apps/tile-match/pages/game";
import TileMatchLeaderboard from "apps/tile-match/pages/leaderboard";

import { userService } from "services";

import { appType } from "helpers";

const tileMatchGameScreens = Object.freeze({
  HOME: "home",
  GAME: "game",
  LEADERBOARD: "leaderboard",
});

export default App;

function App() {
  const router = useRouter();
  const { appTitle } = router.query;

  const [tileMatchGameScreen, setTileMatchGameScreen] = useState(
    tileMatchGameScreens.HOME
  );

  useEffect(() => {
    if (!router.isReady) return;

    // return to home page if user not logged in
    if (!userService.userValue) {
      router.push({
        pathname: "/login",
        returnUrl: router.asPath,
      });
    }
    // return to 404 page if invalid appTitle
    else if (!appTitle || !appType.isValidApp(appTitle)) {
      router.replace({
        pathname: "/404",
        returnUrl: "/",
      });
    }
  }, [router.isReady]);

  if (appType.isAnonymessage(appTitle)) {
    return <AnonymessageHome />;
  }

  if (appType.isJumpyDino(appTitle)) {
    return <JumpyDinoHome username={userService.userValue?.username} />;
  }

  if (appType.isTileMatch(appTitle)) {
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
