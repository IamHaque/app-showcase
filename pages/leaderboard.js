import Image from "next/image";
import { useRouter } from "next/router";

import { useState, useEffect } from "react";

import { appService, userService } from "services";

import { appType } from "helpers";
import { ALL_APPS } from "data";

import { Header, LeaderboardItem } from "components";

import styles from "styles/leaderboard.module.scss";

export default Leaderboard;

function Leaderboard() {
  let hasFetched = false;

  const router = useRouter();
  const { appTitle, appIndex } = router.query;

  const [isLoading, setIsLoading] = useState(true);
  const [isTileMatch, setIsTileMatch] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    // return to home page if no user of invalid app details
    if (
      !userService.userValue ||
      !appTitle ||
      ALL_APPS[appIndex]?.title !== appTitle
    ) {
      router.push("/");
    }

    // fetch leaderboard data for appTitle
    fetchData(appType.isTileMatch(appTitle));

    return () => (hasFetched = true);
  }, [router.isReady]);

  const fetchData = async (isAppTileMatch) => {
    if (!appTitle || hasFetched) return;

    if (!isAppTileMatch) {
      try {
        const data = await appService.getLeaderboard(appTitle);
        if (!data || !data.leaderboard) return;

        setLeaderboardData(data.leaderboard);
      } catch (e) {}
    } else {
      let data = {};
      for (let gridSize = 2; gridSize <= 8; gridSize += 2) {
        try {
          const lbGridData = await appService.getLeaderboard(
            appTitle,
            gridSize
          );
          data[gridSize] =
            lbGridData && lbGridData.leaderboard ? lbGridData.leaderboard : [];
        } catch (e) {}
      }
      setLeaderboardData([data]);
      setIsTileMatch(true);
    }

    setIsLoading(false);
  };

  const navigateToUserLeaderboard = (username) => {
    router.push({
      pathname: "/userLeaderboard",
      query: {
        username,
      },
    });
  };

  const navigateBack = () => {
    router.push("/");
  };

  const generateLeaderboardItemCards = (data) => {
    return data.map(({ rank, score, username }, index) => (
      <LeaderboardItem
        rank={rank}
        score={score}
        username={username}
        clickHandler={navigateToUserLeaderboard}
        key={`${index}-${username}-${rank}-${score}`}
      />
    ));
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

    // Other apps leaderboard except Tile Match
    if (!isTileMatch) {
      return (
        <main className={styles.leaderboardContainer}>
          {generateLeaderboardItemCards(leaderboardData)}
        </main>
      );
    }

    // Tile Match leaderboard
    return (
      <main className={styles.leaderboardWrapper}>
        {Object.keys(leaderboardData[0]).map((gridSize) => {
          if (leaderboardData[0][gridSize].length <= 0) return;

          return (
            <div key={`${gridSize}-${Math.random()}`}>
              <h2>
                Grid Size: {gridSize}X{gridSize}
              </h2>

              <div
                className={`${styles.noScroll} ${styles.leaderboardContainer}`}
              >
                {generateLeaderboardItemCards(leaderboardData[0][gridSize])}
              </div>
            </div>
          );
        })}
      </main>
    );
  };

  return (
    <div className={`mainContainer ${styles.appContainer}`}>
      <Header title={appTitle} backButtonClickHandler={navigateBack} />

      <div className={styles.illustration}>
        <Image width={400} height={300} src={"/winners.svg"} />
      </div>

      {generateMainDiv()}
    </div>
  );
}
