import { useRouter } from "next/router";

import { useState } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import { userService, alertService } from "services";

import { Link, Input, Button, UserLayout } from "components";

import styles from "styles/user.module.scss";

export default function Register() {
  const router = useRouter();

  const [passwordVisible, setPasswordVisible] = useState(false);

  // form validation rules
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    username: Yup.string().required("Username is required"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must contain at least 6 characters"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;

  function onSubmit(user) {
    return userService
      .register(user)
      .then(() => {
        alertService.success("Registration successful", {
          keepAfterRouteChange: true,
        });

        router.push("login");
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
          name="name"
          errors={errors}
          label={"Full name"}
          placeholder={"Enter your name"}
          value={{ ...register("name") }}
        />

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

        <Button value={"Sign Up"} disabled={formState.isSubmitting} />
      </form>

      <div className={styles.redirect}>
        <span>Already signed up?</span> <Link text="Login" href="/login" />
      </div>
    </UserLayout>
  );
}
