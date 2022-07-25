import { useRouter } from "next/router";

import { userService } from "services";

import { Avatar, Button, AppCard } from "components";

import { ALL_APPS } from "/data";

import styles from "styles/home.module.scss";

export default Home;

function Home() {
  const router = useRouter();

  function startApp(appIndex) {
    if (appIndex < 0 || appIndex >= ALL_APPS.length) return;

    const appTitle = ALL_APPS[appIndex].title;

    router.push({
      pathname: "/app",
      query: {
        appTitle,
        appIndex,
      },
    });
  }

  function openLeaderboard(appIndex) {
    if (appIndex < 0 || appIndex >= ALL_APPS.length) return;

    const appTitle = ALL_APPS[appIndex].title;

    router.push({
      pathname: "/leaderboard",
      query: {
        appTitle,
        appIndex,
      },
    });
  }

  return (
    <div className={`mainContainer ${styles.homeContainer}`}>
      <header className={styles.header}>
        <div className={styles.left}>
          <Avatar
            square={false}
            name={userService.userValue?.username}
            style={{ maxHeight: "100%", maxWidth: "100%" }}
          />

          <div className={styles.userInfo}>
            <span>Welcome,</span>
            <span className={styles.username}>
              {userService.userValue?.name}
            </span>
          </div>
        </div>

        <div className={styles.right}>
          <Button
            size="small"
            value="Logout"
            type="outlined"
            clickHandler={() => {
              userService.logout();
            }}
          />
        </div>
      </header>

      <main className={styles.appsContainer}>
        {ALL_APPS.map(({ title, img, type, desc }, index) => (
          <AppCard
            img={img}
            key={index}
            desc={desc}
            type={type}
            title={title}
            buttonOneClickHandler={() => {
              startApp(index);
            }}
            buttonTwoClickHandler={() => {
              openLeaderboard(index);
            }}
          />
        ))}
      </main>
    </div>
  );
}
