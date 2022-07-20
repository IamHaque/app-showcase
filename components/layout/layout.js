import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Layout({ children }) {
  const router = useRouter();

  useEffect(() => {
    if (userService.userValue) {
      router.push("/");
    }
  }, []);

  return <div>{children}</div>;
}
