import { useRouter } from "next/router";
import Image from "next/image";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faTrophy } from "@fortawesome/free-solid-svg-icons";

import styles from "./gameOver.module.scss";

export default function GameOver({ score, highscore, resetGame }) {
  const router = useRouter();

  let medal;
  if (score >= 45) medal = "/PeskyBirds/medal_4.png";
  else if (score >= 30) medal = "/PeskyBirds/medal_3.png";
  else if (score >= 15) medal = "/PeskyBirds/medal_2.png";
  else medal = "/PeskyBirds/medal_1.png";

  return (
    <div className={styles.container} onClick={resetGame}>
      <div className={styles.bg}>
        <div className={styles.bg1}></div>
        <div className={styles.bg2}></div>
      </div>

      <div className={styles.header}>
        <Image
          alt={"GameOver"}
          width={"192"}
          height={"42"}
          src={"/PeskyBirds/gameover.png"}
        />
      </div>

      <div className={styles.main}>
        <div className={styles.left}>
          <p className={styles.heading}>Medal</p>
          <div className={styles.medal}>
            <Image alt={"Medal"} width={"48"} height={"48"} src={medal} />
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.score}>
            <p className={styles.heading}>Score</p>
            <p className={styles.scoreText}>{score || 0}</p>
          </div>

          <div className={styles.highscore}>
            <p className={styles.heading}>Best</p>
            <p className={styles.highscoreText}>{highscore || 0}</p>
          </div>
        </div>
      </div>

      <div className={styles.buttons}>
        <button
          className={styles.button}
          onClick={() => {
            router.push("/");
          }}
        >
          <span>
            <FontAwesomeIcon icon={faHome} />
          </span>
        </button>

        <button
          className={styles.button}
          onClick={() => {
            router.push("/leaderboard/Pesky Bird");
          }}
        >
          <span>
            <FontAwesomeIcon icon={faTrophy} />
          </span>
        </button>
      </div>

      <h3 className={styles.footer}>Tap to Start</h3>
    </div>
  );
}
