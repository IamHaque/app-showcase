import { useRouter } from "next/router";

import { useEffect } from "react";

import { appService, userService } from "services";

import { Layout } from "components";

import AnonymessageSendMessage from "apps/anonymessage/pages/sendMessage";

export default SendMessage;

function SendMessage({ username, messages }) {
  const router = useRouter();

  useEffect(() => {
    // redirect to user profile if opened by owner
    if (userService.userValue?.username === username) {
      router.push("/Anonymessage");
    }
  }, [router.isReady]);

  return (
    <Layout
      title="Anonymessage"
      description="Get anonymous messages from your friends and family. They can say anything without disclosing their identity!"
    >
      <AnonymessageSendMessage
        recipient={username}
        fetchedMessages={messages}
      />
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { username } = context.query;

  try {
    const data = await appService.getPublicMessages({
      username,
      isPublic: true,
    });

    if (data && data.status === "success" && data.messages) {
      return {
        props: { username, messages: data.messages },
      };
    }
  } catch (err) {
    return {
      props: { username, messages: [] },
    };
  }
}
