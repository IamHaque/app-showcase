import { useRef } from "react";

import html2canvas from "html2canvas";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLock,
  faShare,
  faTrashCan,
  faClockFour,
  faPeopleGroup,
} from "@fortawesome/free-solid-svg-icons";

import styles from "./message-card.module.scss";

export default function MessageCard({
  time,
  from,
  reply,
  message,
  isPublic,
  messageId,
  viewOnly = true,
  deleteMessageHandler,
  toggleVisibilityHandler,
}) {
  const elRef = useRef();

  const shareMessage = async () => {
    if (elRef.current === null) return;

    html2canvas(elRef.current)
      .then((canvas) => {
        const data = canvas.toDataURL("image/jpg");
        const link = document.createElement("a");

        if (typeof link.download === "string") {
          link.href = data;
          link.download = "AnonymessageMessage";

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          alertService.error("Error sharing the message!");
        }
      })
      .catch((_) => alertService.error("Error sharing the message!"));
  };

  return (
    <div className={styles.message} ref={elRef}>
      <p className={styles.messageFrom}>-{from}</p>

      <p className={styles.messageText}>{message}</p>

      <div className={styles.bottom}>
        <p className={styles.messageTime}>
          <span className={styles.clockIcon}>
            <FontAwesomeIcon icon={faClockFour} />
          </span>
          <span className={styles.timeAgo}>{time}</span>
        </p>

        {!viewOnly && (
          <div className={styles.actionButtons}>
            <button
              className={`${styles.actionButton} ${styles.visibility} ${
                isPublic ? styles.public : styles.private
              } `}
              onClick={() => {
                toggleVisibilityHandler(messageId, !isPublic);
              }}
            >
              <span>
                <FontAwesomeIcon icon={isPublic ? faPeopleGroup : faLock} />
              </span>
            </button>

            <button
              className={`${styles.actionButton} ${styles.share}`}
              onClick={() => {
                shareMessage();
              }}
            >
              <span>
                <FontAwesomeIcon icon={faShare} />
              </span>
            </button>

            <button
              className={`${styles.actionButton} ${styles.trash}`}
              onClick={() => {
                deleteMessageHandler(messageId);
              }}
            >
              <span>
                <FontAwesomeIcon icon={faTrashCan} />
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
