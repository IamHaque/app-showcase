import { useRouter } from "next/router";

import { useEffect, useState } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

import { appService, userService, alertService } from "services";

import { appType } from "helpers";

import MessageCard from "../components/message-card";
import { Link, Input, Button } from "components";

import styles from "../styles/sendMessage.module.scss";

export default AnonymessageSendMessage;

function AnonymessageSendMessage({ recipient }) {
  let hasFetched = false;
  let timeAgo;

  const router = useRouter();

  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // form validation rules
  const validationSchema = Yup.object().shape({
    message: Yup.string().trim().required("Message is required"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;

  useEffect(() => {
    if (!router.isReady) return;

    // fetch messages for user
    fetchData();

    return () => (hasFetched = true);
  }, [router.isReady]);

  function onSubmit({ message }) {
    const loggedInUser = userService.userValue?.username;

    return appService
      .sendMessage({
        recipient,
        message,
        sender: loggedInUser ? loggedInUser : "Anonymous",
      })
      .then(() => {
        alertService.success("Message sent!");

        setTimeout(() => {
          // return to app home if logged in else to login page
          if (loggedInUser) {
            router.push("/Anonymessage");
          } else {
            router.push({
              pathname: "/login",
              returnUrl: "/Anonymessage",
            });
          }
        }, 1000);
      })
      .catch(alertService.error);
  }

  const fetchData = async () => {
    if (hasFetched) return;

    try {
      if (!timeAgo) {
        TimeAgo.addLocale(en);
        timeAgo = new TimeAgo("en-US");
      }
    } catch (e) {}

    try {
      const data = await appService.getPublicMessages({
        username: recipient,
        isPublic: true,
      });

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

  const generateMainDiv = () => {
    if (isLoading) {
      return (
        <div className={styles.emptyMessagesContainer}>
          <h3>Loading public messages...</h3>
        </div>
      );
    }

    if (!messages || messages.length <= 0) {
      return <></>;
    }

    return (
      <>
        <h2>
          Public Messages <strong>{recipient}</strong> has received
        </h2>

        <div className={styles.messagesContainer}>
          {messages.map(({ time, from, reply, message }, index) => {
            return (
              <MessageCard
                time={time}
                from={from}
                reply={reply}
                key={index}
                message={message}
              />
            );
          })}
        </div>
      </>
    );
  };

  return (
    <div className={`mainContainer ${styles.messageContainer} `}>
      <h1 className={styles.headline}>
        <small>Say hi to,</small>
        {recipient}
      </h1>

      <div className={styles.main}>
        <form className={styles.formWrapper} onSubmit={handleSubmit(onSubmit)}>
          <Input
            type="text"
            name="message"
            errors={errors}
            textarea={true}
            leftIcon={"user"}
            label={"Type your message"}
            value={{ ...register("message") }}
            placeholder={`Say something about ${recipient}, they won't know its you who sent the message!`}
          />

          <Button value={"Send Message"} disabled={formState.isSubmitting} />
        </form>

        <div className={styles.redirect}>
          <span>Want to create you own link?</span>{" "}
          <Link text="Sign Up" href="/signup" />
        </div>
      </div>

      <div className={styles.publicMessagesContainer}>{generateMainDiv()}</div>
    </div>
  );
}
