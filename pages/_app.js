import Head from "next/head";
import { useRouter } from "next/router";

import { useEffect, useState } from "react";

import { userService } from "services";

import { Alert } from "components";

import "styles/globals.scss";

export default MyApp;

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;

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
  }, [router.isReady]);

  function authCheck(url) {
    // redirect to login page if accessing a private page and not logged in
    const publicPaths = {
      static: ["/404", "/login", "/signup"],
      dynamic: ["/u/"],
    };
    const path = url.split("?")[0];

    if (
      userService.userValue ||
      publicPaths.static.includes(path) ||
      publicPaths.dynamic.findIndex((p) => path.startsWith(p)) >= 0
    ) {
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

        {/* Favicons */}
        <link rel="shortcut icon" href="/Favicons/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/Favicons/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/Favicons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/Favicons/favicon-16x16.png"
        />
        <link rel="manifest" href="/Favicons/site.webmanifest"></link>

        {/* font-family: 'Poppins', sans-serif; */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
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
