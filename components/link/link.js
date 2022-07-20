import { default as NextLink } from "next/link";

import styles from "./link.module.scss";

export default function Link({ text, href }) {
  return (
    <NextLink href={href}>
      <a className={styles.link}>{text}</a>
    </NextLink>
  );
}
