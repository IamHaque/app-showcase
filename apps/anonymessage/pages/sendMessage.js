import { useRouter } from "next/router";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import { appService, userService, alertService } from "services";

import { Link, Input, Button } from "components";

import styles from "../styles/sendMessage.module.scss";

export default AnonymessageSendMessage;

function AnonymessageSendMessage({ recipient }) {
  const router = useRouter();

  // form validation rules
  const validationSchema = Yup.object().shape({
    message: Yup.string().trim().required("Message is required"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;

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
          const returnUrl = loggedInUser
            ? "/app?appTitle=Anonymessage&appIndex=0"
            : "/login";
          router.push(returnUrl);
        }, 1000);
      })
      .catch(alertService.error);
  }

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
    </div>
  );
}
