import { useEffect } from "react";
import { useRouter } from "next/router";

import { userService } from "services";

import styles from "./user-layout.module.scss";

export default function UserLayout({ title, children }) {
  const router = useRouter();

  useEffect(() => {
    if (userService.userValue) {
      router.push("/");
    }
  }, []);

  return (
    <div className={`mainContainer ${styles.userContainer} `}>
      <h1 className={styles.headline}>{title}</h1>

      <div className={styles.main}>{children}</div>
    </div>
  );
}
