import { useRouter } from "next/router";

import { useEffect, useState } from "react";

import AnonymessageHome from "apps/anonymessage/pages";
import JumpyDinoHome from "apps/jumpy-dino/pages";
import PeskyBirdHome from "apps/peskyBird/pages";

import TileMatchHome from "apps/tile-match/pages";
import TileMatchGame from "apps/tile-match/pages/game";
import TileMatchLeaderboard from "apps/tile-match/pages/leaderboard";

import { userService } from "services";

import { appType } from "helpers";

import { Layout } from "components";

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
    if (!appTitle || !appType.isValidApp(appTitle)) {
      router.replace({
        pathname: "/404",
        returnUrl: "/",
      });
    }
    // return to 404 page if invalid appTitle
    else if (!userService.userValue) {
      router.push({
        pathname: "/login",
        returnUrl: router.asPath,
      });
    }
  }, [router.isReady]);

  if (appType.isAnonymessage(appTitle)) {
    return (
      <Layout
        title="Anonymessage"
        description="Get anonymous messages from your friends and family. They can say anything without disclosing their identity!"
      >
        <AnonymessageHome />
      </Layout>
    );
  }

  if (appType.isJumpyDino(appTitle)) {
    return (
      <Layout
        title="Jumpy Dino"
        description="A jumping dino which changes it's color after each successful jump. Match the next tree color, the tree being jumped upon, with the dino's color to keep him alive."
      >
        <JumpyDinoHome username={userService.userValue?.username} />
      </Layout>
    );
  }

  if (appType.isPeskyBird(appTitle)) {
    return (
      <Layout title="Pesky Bird" description="Flappy bird clone.">
        <PeskyBirdHome username={userService.userValue?.username} />
      </Layout>
    );
  }

  if (appType.isTileMatch(appTitle)) {
    return (
      <Layout
        title="Tile Match"
        description="A memory game with a range of difficulty levels. Flip the tiles in the selected grid and match all the same tiles."
      >
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
      </Layout>
    );
  }
}
