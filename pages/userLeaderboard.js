import Image from "next/image";
import { useRouter } from "next/router";

import { useState, useEffect } from "react";

import { gameService, userService } from "services";

import { ALL_GAMES } from "data";

import { Header, LeaderboardItem } from "components";

import styles from "styles/leaderboard.module.scss";

export default UserLeaderboard;

function UserLeaderboard() {
  let hasFetched = false;

  const router = useRouter();
  const { username } = router.query;

  const [isLoading, setIsLoading] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    // return to home page if not logged in
    if (!userService.userValue) {
      router.push("/");
    }

    // fetch leaderboard data for username
    fetchData();

    return () => (hasFetched = true);
  }, [router.isReady]);

  const fetchData = async () => {
    try {
      if (!username || hasFetched) return;

      const userLBData = [];

      for (let GAME of ALL_GAMES) {
        const gameTitle = GAME.title;

        if (gameTitle !== ALL_GAMES[1].title) {
          const data = await gameService.getLeaderboard(gameTitle);
          if (!data || !data.leaderboard) continue;

          const leaderboardInfo = data.leaderboard.filter(
            (item) => item.username === username
          )[0];
          if (!leaderboardInfo) continue;

          userLBData.push({
            gameTitle,
            leaderboardInfo,
          });

          continue;
        }

        for (let gridSize = 2; gridSize <= 8; gridSize += 2) {
          const lbGridData = await gameService.getLeaderboard(
            gameTitle,
            gridSize
          );
          if (!lbGridData || !lbGridData.leaderboard) continue;

          const leaderboardInfo = lbGridData.leaderboard.filter(
            (item) => item.username === username
          )[0];
          if (!leaderboardInfo) continue;

          userLBData.push({
            leaderboardInfo,
            gameTitle: `${gameTitle} | Grid: ${gridSize}X${gridSize}`,
          });
        }
      }

      setLeaderboardData(userLBData);
      setIsLoading(false);
    } catch (e) {}
  };

  const navigateBack = () => {
    router.push("/");
  };

  const generateMainDiv = () => {
    // Show loading if data is being fetched
    if (isLoading) {
      return (
        <div className={styles.loading}>
          <p>Loading...</p>
        </div>
      );
    }

    // Show no data if leaderboard empty
    if (!leaderboardData || leaderboardData.length <= 0) {
      return (
        <div className={styles.loading}>
          <p>No leaderboard data!</p>
        </div>
      );
    }

    // Tile Match leaderboard
    return (
      <main className={styles.leaderboardWrapper}>
        {leaderboardData.map((gameLeaderboard, index) => {
          return (
            <div key={`${index}-${Math.random()}`}>
              <h2>{gameLeaderboard.gameTitle}</h2>

              <div
                className={`${styles.noScroll} ${styles.leaderboardContainer}`}
              >
                {
                  <LeaderboardItem
                    rank={gameLeaderboard.leaderboardInfo.rank}
                    score={gameLeaderboard.leaderboardInfo.score}
                    username={gameLeaderboard.leaderboardInfo.username}
                  />
                }
              </div>
            </div>
          );
        })}
      </main>
    );
  };

  return (
    <div className={`mainContainer ${styles.appContainer}`}>
      <Header title={username} backButtonClickHandler={navigateBack} />

      <div className={styles.illustration}>
        <Image width={400} height={300} src={"/badge.svg"} />
      </div>

      {generateMainDiv()}
    </div>
  );
}
