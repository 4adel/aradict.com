import Head from "next/head";
import React from "react";
import styles from "./Header.module.scss";

const Header = ({ userType }) => {
  const [active, setActive] = React.useState(false);
  const Classes = {
    header: `${styles.header} ${active ? styles.activeHeader : ""}`,
    activeHeaderBtn: styles.activeHeaderBtn,
    list: styles.list,
  };
  return (
    <div className={Classes.header}>
      <span
        onClick={() => setActive(!active)}
        className={Classes.activeHeaderBtn}
      >
        Menu
      </span>
      <div className={Classes.list}>
        {userType === "admin" && (
          <>
            <div>VoiceReviewer</div>
            <div>VoiceReviewer</div>
          </>
        )}
        {userType === "voice-contributer" && (
          <>
            <div>Voice Contributer</div>
          </>
        )}
        {userType === "voice-reviewer" && (
          <>
            <div>VoiceReviewer</div>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
