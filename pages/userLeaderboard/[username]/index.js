import Image from "next/image";
import { useRouter } from "next/router";

import { useState, useEffect } from "react";

import { appService, userService } from "services";

import { appType } from "helpers";
import { ALL_APPS } from "data";

import { Layout, Header, LeaderboardItem } from "components";

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
    if (!userService.userValue || !username) {
      router.push("/");
    }

    // fetch leaderboard data for username
    fetchData();

    return () => (hasFetched = true);
  }, [router.isReady]);

  const fetchData = async () => {
    if (!username || hasFetched) return;

    const userLBData = [];

    for (let APP of ALL_APPS) {
      const appTitle = APP.title;

      // continue if app is not game
      if (appType.isApp(appTitle)) continue;

      if (!appType.isTileMatch(appTitle)) {
        try {
          const data = await appService.getLeaderboard(appTitle);
          if (!data || !data.leaderboard) continue;

          const leaderboardInfo = data.leaderboard.filter(
            (item) => item.username === username
          )[0];
          if (!leaderboardInfo) continue;

          userLBData.push({
            appTitle,
            leaderboardInfo,
          });
        } catch (e) {}

        continue;
      }

      for (let gridSize = 2; gridSize <= 8; gridSize += 2) {
        try {
          const lbGridData = await appService.getLeaderboard(
            appTitle,
            gridSize
          );
          if (!lbGridData || !lbGridData.leaderboard) continue;

          const leaderboardInfo = lbGridData.leaderboard.filter(
            (item) => item.username === username
          )[0];
          if (!leaderboardInfo) continue;

          userLBData.push({
            leaderboardInfo,
            appTitle: `${appTitle} | Grid: ${gridSize}X${gridSize}`,
          });
        } catch (e) {}
      }
    }

    setLeaderboardData(userLBData);
    setIsLoading(false);
  };

  const navigateBack = () => {
    router.push("/");
  };

  const sendMessage = () => {
    router.push("/u/" + username);
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
              <h2>{gameLeaderboard.appTitle}</h2>

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
    <Layout
      title={`User Leaderboard | ${username}`}
      description={`Leaderboard of all the games for the player ${username}!`}
    >
      <div className={`mainContainer ${styles.appContainer}`}>
        <Header
          title={username}
          backButtonClickHandler={navigateBack}
          rightButtonClickHandler={
            userService.userValue?.username !== username
              ? sendMessage
              : undefined
          }
        />

        <div className={styles.illustration}>
          <Image width={400} height={300} src={"/badge.svg"} />
        </div>

        {generateMainDiv()}
      </div>
    </Layout>
  );
}
