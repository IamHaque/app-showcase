import { useRouter } from "next/router";

import { useEffect, useState } from "react";

import { faWhatsapp, faInstagram } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShare,
  faTrashCan,
  faShareAlt,
  faClockFour,
} from "@fortawesome/free-solid-svg-icons";

import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

import { alertService, appService, userService } from "services";

import { Avatar } from "components";

import styles from "../styles/home.module.scss";
import { appType } from "helpers";

export default AnonymessageHome;

function AnonymessageHome() {
  const username = userService.userValue?.username;
  let hasFetched = false;
  let timeAgo;

  const router = useRouter();
  const { appTitle } = router.query;

  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady) return;

    // return to home page if user not logged in
    if (!userService.userValue) {
      router.push({
        pathname: "/login",
        returnUrl: router.asPath,
      });
    }
    // return to 404 page if invalid appTitle
    else if (!appTitle || !appType.isValidApp(appTitle)) {
      router.replace({
        pathname: "/404",
        returnUrl: "/",
      });
    }

    // fetch messages for user
    fetchData();

    return () => (hasFetched = true);
  }, [router.isReady]);

  const fetchData = async () => {
    if (!appTitle || hasFetched) return;

    try {
      if (!timeAgo) {
        TimeAgo.addLocale(en);
        timeAgo = new TimeAgo("en-US");
      }
    } catch (e) {}

    try {
      const data = await appService.getMessages(username);

      if (data && data.status === "success" && data.messages) {
        const userMessages = data.messages.map((message) => {
          return {
            ...message,
            time: timeAgo.format(new Date(message.time)),
          };
        });
        setMessages(userMessages);
      }
    } catch (e) {}

    setIsLoading(false);
  };

  const shareToAll = ({ url, title }) => {
    // Web Share API is supported
    if (navigator.share) {
      navigator
        .share({
          url,
          title,
        })
        .then(() => {
          alertService.info("Sharing dialog opened");
        });
    }
    // Fallback
    else {
      navigator.clipboard
        .writeText(profileUrl)
        .then(() => {
          alertService.info("Link copied to clipboard");
        })
        .catch((_) => {
          alertService.error("Error copying link");
        });
    }
  };

  const shareURL = (to) => {
    const profileUrl = `${appService
      .getBaseUrl()
      .replace("/api", "")}/u/${encodeURIComponent(
      username.replace(" ", "%20")
    )}`;

    if (to === "whatsapp") {
      const whatsappUrl = "https://api.whatsapp.com/send";
      const messageToSend = `${whatsappUrl}?text=Ever wanted to confess something to me but did'nt have the courage to do so? Now you can say anything *anonymously*! Open the link to share your thoughts about me! *${profileUrl}*`;

      try {
        window.open(messageToSend, "_blank");
      } catch (e) {
        alertService.error("Error sharing on Whatsapp");
      }
    }

    if (to === "instagram") {
      const link = document.createElement("a");
      link.download = "AnonymessageInstaStory.png";
      link.href = "/InstaStory.png";
      link.click();

      navigator.clipboard
        .writeText(profileUrl)
        .then(() => {
          alertService.info("Link copied to clipboard", { autoClose: false });
          alertService.info("Share a story with your link", {
            autoClose: false,
          });
        })
        .catch((_) => {
          alertService.error("Error copying link");
        });

      setTimeout(() => {
        try {
          const instagramUrl = "instagram://story-camera";
          window.open(instagramUrl, "_blank");
        } catch (_) {
          alertService.error("Error sharing on Instagram");
        }
      }, 6000);
    }

    if (to === "all") {
      shareToAll({
        url: profileUrl,
        title: "Anonymessage profile url",
      });
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      await appService.deleteMessage(messageId);

      alertService.success("Message deleted!");

      const updatesMessages = messages.filter(
        (message) => message.messageId !== messageId
      );
      setMessages(updatesMessages);
    } catch (e) {
      alertService.error("Failed to delete message");
    }
  };

  const generateMainDiv = () => {
    if (isLoading) {
      return (
        <div className={styles.emptyMessagesContainer}>
          <h3>Loading...</h3>
        </div>
      );
    }

    if (!messages || messages.length <= 0) {
      return (
        <div className={styles.emptyMessagesContainer}>
          <h3>No messages!</h3>
          <p>
            Use the above links to share your profile with your friends.
            <br />
            They can send anything they think about you without disclosing their
            identity.
          </p>
        </div>
      );
    }

    return (
      <>
        <h2>All Messages ({messages.length})</h2>

        <div className={styles.messagesContainer}>
          {messages.map(({ time, from, message, messageId }) => {
            return (
              <div className={styles.message} key={messageId}>
                <p className={styles.messageFrom}>-{from}</p>

                <p className={styles.messageText}>{message}</p>

                <div className={styles.bottom}>
                  <p className={styles.messageTime}>
                    <span className={styles.clockIcon}>
                      <FontAwesomeIcon icon={faClockFour} />
                    </span>
                    <span className={styles.timeAgo}>{time}</span>
                  </p>

                  <div className={styles.actionButtons}>
                    {/* <button
                      className={`${styles.actionButton} ${styles.share}`}
                    >
                      <span>
                        <FontAwesomeIcon icon={faShare} />
                      </span>
                    </button> */}

                    <button
                      className={`${styles.actionButton} ${styles.trash}`}
                      onClick={() => {
                        deleteMessage(messageId);
                      }}
                    >
                      <span>
                        <FontAwesomeIcon icon={faTrashCan} />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  return (
    <div className={`mainContainer ${styles.container}`}>
      <header className={styles.coverWrapper}>
        <div className={styles.coverImage} />
      </header>

      <div className={styles.userWrapper}>
        <div className={styles.left}>
          <Avatar square={false} name={username} />
        </div>

        <div className={styles.right}>
          <button
            className={styles.socialButton}
            onClick={() => shareURL("instagram")}
          >
            <span>
              <FontAwesomeIcon icon={faInstagram} />
            </span>
          </button>

          <button
            className={`${styles.socialButton} ${styles.socialButtonWa}`}
            onClick={() => shareURL("whatsapp")}
          >
            <span>
              <FontAwesomeIcon icon={faWhatsapp} />
            </span>
          </button>

          <button
            className={`${styles.socialButton} ${styles.socialButtonAlt}`}
            onClick={() => shareURL("all")}
          >
            <span>
              <FontAwesomeIcon icon={faShareAlt} />
            </span>
          </button>
        </div>

        <div className={styles.bottom}>
          <p className={styles.name}>{userService.userValue?.name}</p>
          <p className={styles.username}>u/{username}</p>
        </div>
      </div>

      <main className={styles.main}>{generateMainDiv()}</main>
    </div>
  );
}
