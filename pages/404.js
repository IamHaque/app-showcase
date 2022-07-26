import Image from "next/image";

import { Layout, Button } from "components";

import styles from "styles/404.module.scss";
import { useRouter } from "next/router";

export default Error404;

function Error404() {
  const router = useRouter();

  return (
    <Layout
      title="Error 404"
      description="The page your were looking for does not exist."
    >
      <div className={styles.errorContainer}>
        <div className={styles.image}>
          <Image src="/404.svg" width="500" height="500" />
        </div>

        <div className={styles.main}>
          <h1>Page Not Found</h1>

          <p>
            The page your were looking for does not exist.
            <br />
            Click the button below to go back to Home page.
          </p>

          <Button
            value="Home"
            clickHandler={() => {
              router.push("/");
            }}
          />
        </div>
      </div>
    </Layout>
  );
}
