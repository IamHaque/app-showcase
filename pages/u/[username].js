import { useRouter } from "next/router";

import { useEffect } from "react";

import { userService } from "services";

import AnonymessageSendMessage from "apps/anonymessage/pages/sendMessage";

export default SendMessage;

function SendMessage() {
  const router = useRouter();
  const { username } = router.query;

  useEffect(() => {
    // redirect to user profile if opened by owner
    if (userService.userValue && userService.userValue?.username === username) {
      router.push("/app?appTitle=Anonymessage&appIndex=0");
    }
  }, [router.isReady]);

  return <AnonymessageSendMessage recipient={username} />;
}
