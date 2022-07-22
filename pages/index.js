import { useRouter } from "next/router";

import { userService } from "services";

import { Avatar, Button, Card } from "components";

import { ALL_GAMES } from "/data";

import styles from "styles/home.module.scss";

export default Home;

function Home() {
  const router = useRouter();

  function playGame(gameIndex) {
    if (gameIndex < 0 || gameIndex >= ALL_GAMES.length) return;

    const gameTitle = ALL_GAMES[gameIndex].title;

    router.push({
      pathname: "/game",
      query: {
        gameTitle,
        gameIndex,
      },
    });
  }

  function openLeaderboard(gameIndex) {
    if (gameIndex < 0 || gameIndex >= ALL_GAMES.length) return;

    const gameTitle = ALL_GAMES[gameIndex].title;

    router.push({
      pathname: "/leaderboard",
      query: {
        gameTitle,
        gameIndex,
      },
    });
  }

  return (
    <div className={`mainContainer ${styles.homeContainer}`}>
      <header className={styles.header}>
        <div className={styles.left}>
          <Avatar square={false} name={userService.userValue?.username} />

          <div className={styles.userInfo}>
            <span>Welcome,</span>
            <span className={styles.username}>
              {userService.userValue?.name}
            </span>
          </div>
        </div>

        <div className={styles.right}>
          <Button
            size="small"
            value="Logout"
            type="outlined"
            clickHandler={() => {
              userService.logout();
            }}
          />
        </div>
      </header>

      <main className={styles.gamesContainer}>
        {ALL_GAMES.map(({ title, img, desc }, index) => (
          <Card
            img={img}
            key={index}
            desc={desc}
            title={title}
            buttonOneClickHandler={() => {
              playGame(index);
            }}
            buttonTwoClickHandler={() => {
              openLeaderboard(index);
            }}
          />
        ))}
      </main>
    </div>
  );
}
