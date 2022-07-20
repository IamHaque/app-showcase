import Link from "next/link";

import styles from "/games/tile-match/styles/home.module.scss";

export default function TileMatchHome({
  username,
  startGameClickHandler,
  leaderboardClickHandler,
}) {
  let MainContent = (
    <div className={styles.greetUser}>
      <p>
        Welcome <span className={styles.username}>{username}</span>
      </p>
      <p className={styles.small}>
        be prepared to get your memory retention skills tested...
      </p>
    </div>
  );

  let BottomButtons = (
    <>
      <div className={styles.startGameButton}>
        <a onClick={startGameClickHandler}>Start Game</a>
      </div>

      <div className={styles.showLeaderboardButton}>
        <a onClick={leaderboardClickHandler}>Show Leaderboard</a>
      </div>

      <div className={styles.goBackButton}>
        <Link href="/">Go back</Link>
      </div>
    </>
  );

  return (
    <div className="container">
      <header className={`${styles.header} center`}>
        <p className="title">Tile Match</p>
      </header>

      <main className={`${styles.main} center`}>
        {MainContent}

        <div className={styles.bottomButtons}>{BottomButtons}</div>
      </main>
    </div>
  );
}
