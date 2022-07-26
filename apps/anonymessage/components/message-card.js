import { useRef, useState } from "react";

import html2canvas from "html2canvas";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLock,
  faShare,
  faTrashCan,
  faPaperPlane,
  faPeopleGroup,
  faCommentDots,
} from "@fortawesome/free-solid-svg-icons";

import styles from "./message-card.module.scss";

export default function MessageCard({
  time,
  from,
  reply,
  message,
  isPublic,
  showReply,
  recipient,
  messageId,
  viewOnly = true,
  messageReplyHandler,
  deleteMessageHandler,
  showReplyToggleHandler,
  toggleVisibilityHandler,
}) {
  const elRef = useRef();

  // form validation rules
  const validationSchema = Yup.object().shape({
    messageReply: Yup.string().trim().required("Reply is required"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState, reset } = useForm(formOptions);
  register("messageReply", { value: reply });
  const { errors } = formState;

  const onSubmit = ({ messageReply }) => {
    messageReplyHandler(messageId, messageReply);
  };

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

  const actionButtons = (
    <div className={styles.buttonsWrapper}>
      <button
        className={`${styles.button} ${styles.delete}`}
        onClick={() => deleteMessageHandler(messageId)}
      >
        <span>
          <FontAwesomeIcon icon={faTrashCan} />
        </span>
      </button>

      <button
        className={`${styles.button} ${styles.share}`}
        onClick={() => shareMessage()}
      >
        <span>
          <FontAwesomeIcon icon={faShare} />
        </span>
      </button>

      <button
        className={`${styles.button} ${
          isPublic ? styles.public : styles.private
        }`}
        onClick={() => toggleVisibilityHandler(messageId)}
      >
        <span>
          <FontAwesomeIcon icon={isPublic ? faPeopleGroup : faLock} />
        </span>
      </button>

      <button
        className={`${styles.button} ${styles.reply} ${
          reply ? styles.replied : ""
        }`}
        onClick={() => {
          reset();
          showReplyToggleHandler(messageId);
        }}
      >
        <span>
          <FontAwesomeIcon icon={faCommentDots} />
        </span>
      </button>
    </div>
  );

  const replyWrapper = (
    <form
      className={`${styles.replyWrapper} ${
        errors["messageReply"] ? styles.error : ""
      }`}
      onSubmit={handleSubmit(onSubmit)}
    >
      <input
        type="text"
        autoComplete="off"
        name="messageReply"
        {...register("messageReply")}
        placeholder="Write your reply..."
      />

      <button>
        <span>
          <FontAwesomeIcon icon={faPaperPlane} />
        </span>
      </button>

      {errors["messageReply"] && (
        <small className={styles.errors}>
          {errors["messageReply"]?.message}
        </small>
      )}
    </form>
  );

  if (!viewOnly) {
    return (
      <div className={styles.message} ref={elRef}>
        <div className={styles.senderWrapper}>
          <p className={styles.user}>{from}</p>

          <p className={styles.time}>{time}</p>
        </div>

        <p className={styles.messageText}>{message}</p>

        {actionButtons}

        {showReply && replyWrapper}
      </div>
    );
  }

  if (viewOnly && !reply) {
    return (
      <div className={styles.message} ref={elRef}>
        <div className={styles.senderWrapper}>
          <p className={styles.user}>{from}</p>
          <p className={styles.time}>{time}</p>
        </div>

        <p className={styles.onlyMessageText}>{message}</p>
      </div>
    );
  }

  if (viewOnly && reply) {
    return (
      <div className={styles.message} ref={elRef}>
        <p className={styles.mentionText}>{message}</p>

        <div className={styles.recipientWrapper}>
          <p className={styles.user}>{recipient}</p>
          <p className={styles.time}>{time}</p>
        </div>

        <p className={styles.replyText}>{reply}</p>
      </div>
    );
  }
}
