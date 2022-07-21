import Image from "next/image";

import styles from "./header.module.scss";

export default function Header({ title, backButtonClickHandler }) {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <div
          className={styles.backButton}
          onClick={() => {
            backButtonClickHandler();
          }}
        >
          <Image width={16} height={16} src={"/back.svg"} />
        </div>
      </div>

      <div className={styles.center}>
        <h1>{title}</h1>
      </div>

      <div className={styles.right}></div>
    </header>
  );
}
