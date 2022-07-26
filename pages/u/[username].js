import { useRouter } from "next/router";

import { useEffect } from "react";

import { userService } from "services";

import { Layout } from "components";

import AnonymessageSendMessage from "apps/anonymessage/pages/sendMessage";

export default SendMessage;

function SendMessage() {
  const router = useRouter();
  const { username } = router.query;

  useEffect(() => {
    // redirect to user profile if opened by owner
    if (userService.userValue && userService.userValue?.username === username) {
      router.push("/Anonymessage");
    }
  }, [router.isReady]);

  return (
    <Layout
      title="Anonymessage"
      description="Get anonymous messages from your friends and family. They can say anything without disclosing their identity!"
    >
      <AnonymessageSendMessage recipient={username} />
    </Layout>
  );
}
