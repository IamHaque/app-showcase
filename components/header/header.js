import { useRef, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";

import styles from "./header.module.scss";

export default function Header({
  title,
  backButtonClickHandler,
  rightButtonClickHandler,
}) {
  const timeout = useRef();
  const [visible, setVisible] = useState(false);

  const toggleVisible = (visibility) => {
    if (!timeout.current) {
      timeout.current = setTimeout(() => {
        setVisible(false);
        clearTimeout(timeout.current);
        timeout.current = undefined;
      }, 5000);
    }

    if (visible) {
      clearTimeout(timeout.current);
      timeout.current = undefined;
    }

    setVisible(!visible);
  };

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        {backButtonClickHandler && (
          <button
            className={styles.iconButton}
            onClick={() => {
              backButtonClickHandler();
            }}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
        )}
      </div>

      <div className={styles.center}>
        <h1>{title}</h1>
      </div>

      {rightButtonClickHandler && (
        <div className={styles.right}>
          <button className={styles.iconButton} onClick={() => toggleVisible()}>
            <FontAwesomeIcon icon={faEllipsisVertical} />
          </button>

          <ul
            className={`${styles.popupContainer} ${
              visible ? styles.active : ""
            }`}
          >
            <li
              onClick={() => {
                toggleVisible(false);
                rightButtonClickHandler();
              }}
            >
              Send message
            </li>

            <li
              onClick={() => {
                toggleVisible(false);
                backButtonClickHandler();
              }}
            >
              Home
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
