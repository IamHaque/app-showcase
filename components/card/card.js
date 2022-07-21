import styles from "./card.module.scss";

import { Button } from "components";

export default function Card({
  title,
  img,
  desc,
  buttonOneClickHandler,
  buttonTwoClickHandler,
}) {
  return (
    <div className={styles.game}>
      <img src={img} alt={title} className={styles.gameImage} />

      <div className={styles.gameInfo}>
        <h1 className={styles.gameTitle}>{title}</h1>
        <p className={styles.gameDesc}>{desc}</p>

        <div className={styles.buttons}>
          <Button value="Play Now" clickHandler={buttonOneClickHandler} />
          <Button
            type="secondary"
            value="Leaderboard"
            clickHandler={buttonTwoClickHandler}
          />
        </div>
      </div>
    </div>
  );
}
