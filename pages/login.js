import { useRouter } from "next/router";

import { useState } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import { userService, alertService } from "services";

import { Link, Input, Button, UserLayout } from "components";

import styles from "styles/user.module.scss";

export default function Login() {
  const router = useRouter();

  const [passwordVisible, setPasswordVisible] = useState(false);

  // form validation rules
  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;

  function onSubmit({ username, password }) {
    return userService
      .login(username, password)
      .then(() => {
        // get return url from query parameters or default to '/'
        const returnUrl = router.query.returnUrl || "/";
        router.push(returnUrl);
      })
      .catch(alertService.error);
  }

  function togglePasswordVisibility() {
    setPasswordVisible(!passwordVisible);
  }

  return (
    <UserLayout title={"Login"}>
      <form className={styles.formWrapper} onSubmit={handleSubmit(onSubmit)}>
        <Input
          type="text"
          errors={errors}
          name="username"
          leftIcon={"user"}
          label={"Username"}
          placeholder={"Enter username"}
          value={{ ...register("username") }}
        />

        <Input
          errors={errors}
          name="password"
          leftIcon={"lock"}
          label={"Password"}
          placeholder={"Enter password"}
          value={{ ...register("password") }}
          type={passwordVisible ? "text" : "password"}
          rightIconClickHandler={togglePasswordVisibility}
          rightIcon={passwordVisible ? "eye-open" : "eye-closed"}
        />

        <Button value={"Login"} disabled={formState.isSubmitting} />
      </form>

      <div className={styles.redirect}>
        <span>Don&apos;t have an account?</span>{" "}
        <Link text="Sign Up" href="/signup" />
      </div>
    </UserLayout>
  );
}
