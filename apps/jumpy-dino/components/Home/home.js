import Image from "next/image";

import FG_IMG from "/public/home_fg.png";

import styles from "./home.module.scss";

export default function HomeScreen({
  username,
  goBackClickHandler,
  startGameClickHandler,
}) {
  return (
    <div className={styles.container}>
      <div className={styles.overlay}>
        <div className={styles.top}>
          <h1>Jumpy Dino</h1>
          <p>
            {username && (
              <>
                Welcome <span>{username}</span>!
              </>
            )}
            <br />
            Match the next Tree&apos;s color with the Dino&apos;s color.
            <br />
            Press SPACE, CLICK or TOUCH to change Tree color.
          </p>

          <div className={styles.buttons}>
            <button className={styles.button} onClick={goBackClickHandler}>
              Go Back
            </button>

            <button className={styles.button} onClick={startGameClickHandler}>
              Start Game
            </button>
          </div>
        </div>

        <div className={styles.bottom}>
          <Image
            src={FG_IMG}
            width="689px"
            height="468px"
            alt="Foreground"
            className={styles.foreground}
          />
        </div>
      </div>
    </div>
  );
}
