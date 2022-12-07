import React, { useRef, useEffect } from "react";

export default function MediaPlayer(props) {
  const container = useRef(null);

  let videoTrack = props.videoTrack;
  let audioTrack = props.audioTrack;

  useEffect(() => {
    if (!container.current) return;

    if (videoTrack) {
      videoTrack.play(container.current);
      return () => {
        videoTrack.stop();
      };
    }
  }, [container, videoTrack]);

  useEffect(() => {
    if (audioTrack) {
      audioTrack.play();
      return () => {
        audioTrack.stop();
      };
    }
  }, [audioTrack]);

  return (
    <div
      ref={container}
      className="video-player"
      style={{ width: "640px", height: "400px" }}
    >
      {/* {JSON.stringify(videoTrack.play)} */}
    </div>
  );
}
