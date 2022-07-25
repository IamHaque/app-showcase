import styles from "./app-card.module.scss";

import { Button } from "components";

export default function AppCard({
  img,
  type,
  desc,
  title,
  buttonOneClickHandler,
  buttonTwoClickHandler,
}) {
  return (
    <div className={styles.app}>
      <img src={img} alt={title} className={styles.appImage} />

      <div className={styles.appInfo}>
        <h1 className={styles.appTitle}>{title}</h1>
        <p className={styles.appDesc}>{desc}</p>

        <div className={styles.buttons}>
          <Button
            clickHandler={buttonOneClickHandler}
            value={type === "game" ? "Play Game" : "Open App"}
          />
          {type === "game" && (
            <Button
              type="secondary"
              value="Leaderboard"
              clickHandler={buttonTwoClickHandler}
            />
          )}
        </div>
      </div>
    </div>
  );
}
