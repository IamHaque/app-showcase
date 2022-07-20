import styles from "./button.module.scss";

export default function Button({ size, type, value, disabled, clickHandler }) {
  return (
    <button
      className={`${styles.button} ${styles[size]} ${styles[type]}`}
      onClick={clickHandler}
      disabled={disabled}
    >
      {disabled ? "Loading..." : value}
    </button>
  );
}
