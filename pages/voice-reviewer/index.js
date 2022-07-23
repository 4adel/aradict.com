import { useQuery } from "@tanstack/react-query";
import { verify } from "jsonwebtoken";
import Head from "next/head";
import React from "react";
import styles from "../../styles/voice-reviewer.module.scss";
import { SecondLayer } from "../../utils/AuthLayers";

async function fetcher() {
  return new Promise((res, rej) => {
    res({ ar: "AHMAD", id: "أنا" });
  });
}

const VoiceReviewer = () => {
  const { data, isRefetching, isLoading, error } = useQuery(
    ["get-word-with-no-pronounsiation"],
    fetcher
  );

  const Classes = {
    pageWrapper: styles.pageWrapper,
    word: styles.word,
  };

  React.useEffect(() => {
    function handle(e) {
      switch (e.code) {
        case "KeyS":
          console.log("play");
          break;
        case "KeyA":
          console.log("Approve");
          break;
        default:
          return false;
          break;
      }
    }
    document.addEventListener("keyup", handle);
    return () => document.removeEventListener("keyup", handle);
  });
  return (
    <div className={Classes.pageWrapper}>
      <Head>
        <title>Review Sound</title>
      </Head>
      {isLoading ||
        (isRefetching && (
          <div className={Classes.loading}>يجري جلب الكلمه</div>
        ))}
      {error && <div className={Classes.error}>{error}</div>}
      {data && <div className={Classes.word}>{data.ar}</div>}
    </div>
  );
};

export default VoiceReviewer;

export const getServerSideProps = async (ctx) => {
  return verify(ctx.req.cookies.token, process.env.JWT_SECRET, (err, data) => {
    if (err || !SecondLayer.includes(data.role))
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    return {
      props: {
        userType: data.role,
      },
    };
  });
};
