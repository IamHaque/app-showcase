import styles from "./input.module.scss";

export default function Input({
  type,
  name,
  value,
  label,
  errors,
  leftIcon,
  rightIcon,
  placeholder,
  rightIconClickHandler,
}) {
  const inputInvalid = errors[name] ? true : false;

  return (
    <div className={styles.inputWrapper}>
      <label className={styles.label} htmlFor={name}>
        {label}
      </label>

      <div
        className={`${styles.inputWithIcons} ${
          inputInvalid ? styles.invalid : ""
        }`}
      >
        {leftIcon && (
          <span
            className={`${styles.icon} ${styles.leftIcon}  ${leftIcon}`}
          ></span>
        )}

        <input
          id={name}
          {...value}
          name={name}
          type={type}
          autoComplete="off"
          className={`${styles.input} ${
            !leftIcon && !rightIcon ? styles.noIcons : ""
          }`}
          placeholder={placeholder}
        />

        {rightIcon && (
          <span
            className={`${styles.icon} ${styles.rightIcon}  ${rightIcon}`}
            onClick={rightIconClickHandler}
          ></span>
        )}
      </div>

      {inputInvalid && (
        <div className={styles.errors}>{errors[name]?.message}</div>
      )}
    </div>
  );
}
