import { verify } from "jsonwebtoken";
import Head from "next/head";
import Image from "next/image";
import React from "react";
import Content from "../components/Content";
import Footer from "../components/Footer";
import styles from "../styles/Home.module.scss";
const isArabic =
  /^([\u0600-\u06ff]|[\u0750-\u077f]|[\ufb50-\ufbc1]|[\ufbd3-\ufd3f]|[\ufd50-\ufd8f]|[\ufd92-\ufdc7]|[\ufe70-\ufefc]|[\ufdf0-\ufdfd])*$/g;

export default function Home() {
  const [q, setQ] = React.useState("");
  const Classes = {
    pageContainer: styles.pageContainer,
    primarySection: styles.primarySection,
    logoContainer: styles.logoContainer,
    searchWrapper: styles.searchWrapper,
    searchIcon: styles.searchIcon,
    searchFeild: styles.searchFeild,
    topBar: styles.topBar,
    content: styles.content,
    goDown: styles.goDown,
  };
  return (
    <>
      <span className={Classes.topBar}></span>
      <Head>
        <title>Aradict.com | أرادكت</title>
      </Head>
      <div className={Classes.pageContainer}>
        <section className={Classes.primarySection}>
          <div className={Classes.content}>
            <div className={Classes.logoContainer}>
              <Image
                src="https://abadis.ir/images/abadis.svg"
                width={400}
                height={150}
              />
            </div>
            <div className={Classes.searchWrapper}>
              <span className={Classes.searchIcon}>Search</span>
              <input
                className={Classes.searchFeild}
                value={q}
                onChange={(e) => {
                  const lastCharachter =
                    e.target.value[e.target.value.length - 1];
                  const ss = lastCharachter.match(isArabic);
                  if (!ss && !lastCharachter.match(/\s/)) {
                    alert("Only Arabic charachters are allowed");
                    setQ(q);
                  } else {
                    setQ(e.target.value);
                  }
                }}
                onKeyUp={(e) => {
                  if (e.key === "Enter") {
                    Submit();
                  }
                }}
              />
            </div>
          </div>
          <span className={Classes.goDown}>
            <img
              src="https://www.svgrepo.com/show/80156/down-arrow.svg"
              style={{
                width: "100%",
                height: "auto",
                maxWidth: "60px",
              }}
            />
          </span>
        </section>
        <Content />
      </div>
      <Footer />
    </>
  );

  function Submit() {}
}

export const getServerSideProps = async (ctx) => {
  return verify(
    ctx.req.cookies.token || "",
    process.env.JWT_SECRET,
    (err, data) => {
      if (err) return { props: { usetType: "visitor" } };
      return {
        props: {
          userType: data.role,
        },
      };
    }
  );
};
