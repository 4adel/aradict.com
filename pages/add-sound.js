import { useQuery } from "@tanstack/react-query";
import React, { useContext, useState } from "react";
import styles from "../styles/add-sound.module.scss";
let chunks = [];
import { useAlert } from "react-alert";

const MSGsArray = Object.freeze({
  NOT_RECORDING_YET: {
    type: "error",
    des: "NOT_RECORDING_YET",
    msg: "نحن لم نبدأ التسجيل حتي الان",
  },
  ALREADY_RECORDING: {
    type: "error",
    msg: "يجري التسجيل بالفعل.",
    des: "ALREADY_RECORDING",
  },
  START_RECORDING: {
    type: "msg",
    msg: "جاري التسجيل.",
    des: "START_RECORDING",
  },
  STOP_RECORDING: {
    type: "msg",
    msg: "تم ٌإيقاف التسجيل",
    des: "STOP_RECORDING",
  },
});
export default function AddSound(props) {
  let mediaStream = React.useRef(null);
  const alert = useAlert();

  const [isRecordeing, setIsRecording] = React.useState(false);
  const { data, isLoading, isRefetching, error, refetch } = useQuery(
    ["getRandomWord"],
    () =>
      fetch(`/api/hello`).then(async (e) => {
        const data = await e.json();
        return data;
      })
  );

  const Classes = {
    addSoundWrapper: styles.addSoundWrapper,
    alerts: styles.alerts,
    centerd: styles.centerd,
    alert: styles.alert,
    msg: styles.message,
    shortcuts: styles.shortcuts,
    recording: isRecordeing ? styles.recording : "",
    buttons: styles.buttons,
  };

  function Recorde() {
    if (isRecordeing) {
      return Stop();
    }
    alert.show(MSGsArray.START_RECORDING.msg);
    chunks = [];
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((e) => {
        chunks = [];

        mediaStream.current = new MediaRecorder(e, {
          mimeType: "audio/webm;codecs=opus",
        });

        mediaStream.current.ondataavailable = (newData) => {
          chunks = [...chunks, newData.data];
        };
        mediaStream.current.start();

        mediaStream.current.onstop = () => {
          e.getTracks().forEach((track) => {
            if (track.readyState != "inactive") {
              track.stop();
            }
          });
          setIsRecording(false);
        };
      })

      .catch((e) => {
        console.error(e);
      });
    setIsRecording(true);
  }
  function Stop() {
    if (!isRecordeing) {
      return alert.show(MSGsArray.NOT_RECORDING_YET.msg);
    }

    mediaStream.current.stop();
    return alert.show(MSGsArray.STOP_RECORDING.msg);
  }
  function Play() {
    if (chunks.length < 1) {
      return alert.show("No thing to play !");
    }
    const AudioBlob = new Blob(chunks, { type: "audio/ogg" });
    const AudioBlobURL = URL.createObjectURL(AudioBlob);
    let mySound = new Audio(AudioBlobURL);
    mySound.play();
  }
  function Submit() {
    if (chunks.length < 1) {
      return alert.show("No thing to Submit !");
    }
    const blob = new Blob(chunks, { type: "ogg/audio" });
    const blob_url = URL.createObjectURL(blob);
    console.log(blob_url);
  }

  React.useEffect(() => {
    function handler(e) {
      switch (e.code) {
        case "KeyR":
          Recorde();
          break;
        case "KeyS":
          console.log("SUBMIT");
          break;
        case "KeyP":
          Play();
          break;

        default:
          break;
      }
    }

    document.addEventListener("keyup", handler);
    return () => document.removeEventListener("keyup", handler);
  });

  return (
    <div className={Classes.addSoundWrapper}>
      <div className={Classes.shortcuts}>
        <span>
          \r\ {isRecordeing ? "Recording ...." : "Record"}
          <span className={Classes.recording}></span>
        </span>
        <span>\p\ Play</span>
        <span>\s\ Submit</span>
      </div>
      <div className={Classes.centerd}>
        {isLoading || isRefetching ? error : ""}
        {data ? data?.ar : ""}
        {error ? alert.show("خطأ أثناء جلب الكلمة :(") : ""}
      </div>
      <div className={Classes.buttons}>
        <button onClick={Recorde}>
          {isRecordeing ? "stop" : "Record"}
          <span className={Classes.recording}></span>
        </button>

        <button onClick={Play}>Play</button>
        <button>Submit</button>
      </div>
    </div>
  );
}
