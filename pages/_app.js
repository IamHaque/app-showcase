import Head from "next/head";
import { useRouter } from "next/router";

import { useEffect, useState } from "react";

import { userService } from "services";

import { Alert } from "components";

import "styles/globals.scss";

export default MyApp;

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // on initial load - run auth check
    authCheck(router.asPath);

    // on route change start - hide page content by setting authorized to false
    const hideContent = () => setAuthorized(false);

    router.events.on("routeChangeStart", hideContent);

    // on route change complete - run auth check
    router.events.on("routeChangeComplete", authCheck);

    // Mobile screen viewport height fix
    const setWindowHeight = () => {
      document.documentElement.style.setProperty(
        "--vh",
        `${window.innerHeight - 0.4}px`
      );
    };
    setWindowHeight();
    window.addEventListener("resize", setWindowHeight);

    // unsubscribe from events
    return () => {
      router.events.off("routeChangeStart", hideContent);
      router.events.off("routeChangeComplete", authCheck);
      window.removeEventListener("resize", setWindowHeight);
    };
  }, []);

  function authCheck(url) {
    // redirect to login page if accessing a private page and not logged in
    setUser(userService.userValue);

    const publicPaths = ["/login", "/signup"];
    const path = url.split("?")[0];

    if (userService.userValue || publicPaths.includes(path)) {
      setAuthorized(true);
      return;
    }

    setAuthorized(false);
    router.push("/login");
  }

  return (
    <>
      <Head>
        <title>Apps Showcase</title>
        <meta
          name="description"
          content="A website showcasing all the projects worked by https://github.com/IamHaque"
        />

        {/* font-family: 'Poppins', sans-serif; */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <Alert />

      {authorized && <Component {...pageProps} />}
    </>
  );
}
