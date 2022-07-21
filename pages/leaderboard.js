import Image from "next/image";
import { useRouter } from "next/router";

import { useState, useEffect } from "react";

import { gameService, userService } from "services";

import { ALL_GAMES } from "data";

import { Header, LeaderboardItem } from "components";

import styles from "styles/leaderboard.module.scss";

export default Leaderboard;

function Leaderboard() {
  let hasFetched = false;

  const router = useRouter();
  const { gameTitle, gameIndex } = router.query;

  const [isTileMatch, setIsTileMatch] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    // return to home page if no user of invalid game details
    if (!userService.userValue || ALL_GAMES[gameIndex]?.title !== gameTitle) {
      router.push("/");
    }

    // fetch leaderboard data for gameTitle
    fetchData(gameTitle === ALL_GAMES[1].title);

    return () => (hasFetched = true);
  }, [router.isReady]);

  const fetchData = async (isGameTileMatch) => {
    try {
      if (!gameTitle || hasFetched) return;

      if (!isGameTileMatch) {
        const data = await gameService.getLeaderboard(gameTitle);
        if (!data || !data.leaderboard) return;

        setLeaderboardData(data.leaderboard);
      } else {
        let data = {};
        for (let gridSize = 2; gridSize <= 8; gridSize += 2) {
          const lbGridData = await gameService.getLeaderboard(
            gameTitle,
            gridSize
          );
          data[gridSize] =
            lbGridData && lbGridData.leaderboard ? lbGridData.leaderboard : [];
        }
        setLeaderboardData([data]);
        setIsTileMatch(true);
      }
    } catch (e) {}
  };

  const navigateBack = () => {
    router.push("/");
  };

  return (
    <div className={`mainContainer ${styles.appContainer}`}>
      <Header title={gameTitle} backButtonClickHandler={navigateBack} />

      <div className={styles.illustration}>
        <Image width={400} height={300} src={"/winners.svg"} />
      </div>

      {!isTileMatch && (
        <main className={styles.leaderboardContainer}>
          {leaderboardData.map(({ rank, score, username }, index) => (
            <LeaderboardItem
              rank={rank}
              score={score}
              username={username}
              key={`${index}-${username}-${rank}-${score}`}
            />
          ))}
        </main>
      )}

      {isTileMatch && (
        <main className={styles.leaderboardWrapper}>
          {Object.keys(leaderboardData[0]).map((gridSize) => {
            if (leaderboardData[0][gridSize].length <= 0) return <></>;

            return (
              <div key={`${gridSize}-${Math.random()}`}>
                <h2>
                  Grid Size: {gridSize}X{gridSize}
                </h2>

                <div
                  className={`${styles.noScroll} ${styles.leaderboardContainer}`}
                >
                  {leaderboardData[0][gridSize].map(
                    ({ rank, score, username }, index) => (
                      <LeaderboardItem
                        rank={rank}
                        score={score}
                        username={username}
                        key={`${index}-${username}-${rank}-${score}-${gridSize}`}
                      />
                    )
                  )}
                </div>
              </div>
            );
          })}
        </main>
      )}
    </div>
  );
}
