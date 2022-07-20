import styles from "./card.module.scss";

import { Button } from "components";

export default function Card({ title, img, desc, clickHandler }) {
  return (
    <div className={styles.game}>
      <img src={img} className={styles.gameImage} />

      <div className={styles.gameInfo}>
        <h1 className={styles.gameTitle}>{title}</h1>
        <p className={styles.gameDesc}>{desc}</p>

        <Button value="Play Now" clickHandler={clickHandler} />
      </div>
    </div>
  );
}
