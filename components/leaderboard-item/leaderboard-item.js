import Avatar from "components/avatar/avatar";

import styles from "./leaderboard-item.module.scss";

export default function LeaderboardItem({ rank, score, username }) {
  const getAddonClass = (rank) => {
    if (rank === 1) return styles["winner"];
    if (rank === 2) return styles["runnerUp"];
    if (rank === 3) return styles["thirdPlace"];
  };

  return (
    <div className={`${getAddonClass(rank)} ${styles.leaderboardItem}`}>
      <Avatar name={username} />

      <div className={styles.user}>
        <h4 className={styles.name}>{username}</h4>
        <p className={styles.score}>score: {score}</p>
      </div>

      <p className={styles.rank}>&#35;{rank}</p>
    </div>
  );
}
