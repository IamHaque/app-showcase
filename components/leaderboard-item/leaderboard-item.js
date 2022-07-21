import Avatar from "boring-avatars";

import styles from "./leaderboard-item.module.scss";

const AVATAR_COLOR_PALETTE = [
  "#E9A6A6",
  "#864879",
  "#A7D0CD",
  "#B85252",
  "#3C415C",
];

export default function LeaderboardItem({ rank, score, username }) {
  const getAddonClass = (rank) => {
    if (rank === 1) return styles["winner"];
    if (rank === 2) return styles["runnerUp"];
    if (rank === 3) return styles["thirdPlace"];
  };

  return (
    <div className={`${getAddonClass(rank)} ${styles.leaderboardItem}`}>
      <div className={styles.avatar}>
        <Avatar
          variant={"beam"}
          name={username}
          colors={AVATAR_COLOR_PALETTE}
        />
      </div>

      <div className={styles.user}>
        <h4 className={styles.name}>{username}</h4>
        <p className={styles.score}>score: {score}</p>
      </div>

      <p className={styles.rank}>&#35;{rank}</p>
    </div>
  );
}
