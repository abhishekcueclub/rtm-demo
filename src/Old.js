import React, { useEffect } from "react";
import "./styles.css";
import AgoraRTC from "agora-rtc-sdk-ng";

export default function App() {
  const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

  const rtc = {
    client: null,
    localAudioTrack: null,
    localVideoTrack: null
  };

  const options = {
    appId: "741e61921b284f4dbbcfebc196bcd338",
    channel: "demo_channel",
    token:
      "007eJxTYOjlvNrquUUsjFk5KfMA76KUNUGHjz61Ds9bU9354szFHEsFBnMTw1QzQ0sjwyQjC5M0k5SkpOS01KRkQ0uzpOQUY2OLWa8nJDcEMjLkBxoyMTJAIIjPw5CSmpsfn5yRmJeXmsPAAABCECK/"
  };

  async function startBasicCall() {
    rtc.client = AgoraRTC.createClient({ mode: "rtc", codec: "h264" });

    const uid = await rtc.client.join(
      options.appId,
      options.channel,
      options.token,
      null
    );

    // Create an audio track from the audio sampled by a microphone.
    rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    // Create a video track from the video captured by a camera.
    rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
    // Publish the local audio and video tracks to the channel.
    await rtc.client.publish([rtc.localAudioTrack, rtc.localVideoTrack]);

    console.log("publish success!");

    rtc.client.on("user-published", async function A(user, mediaType) {
      // Subscribe to a remote user.
      await rtc.client.subscribe(user, mediaType);
      console.log("subscribe success");

      // If the subscribed track is video.
      if (mediaType === "video") {
        // Get `RemoteVideoTrack` in the `user` object.
        const remoteVideoTrack = user.videoTrack;
        // Dynamically create a container in the form of a DIV element for playing the remote video track.
        const playerContainer = document.createElement("div");
        // Specify the ID of the DIV container. You can use the `uid` of the remote user.
        playerContainer.id = user.uid.toString();
        playerContainer.style.width = "640px";
        playerContainer.style.height = "480px";

        document.body.append(playerContainer);

        // Play the remote video track.
        // Pass the DIV container and the SDK dynamically creates a player in the container for playing the remote video track.
        remoteVideoTrack.play(playerContainer);

        // Or just pass the ID of the DIV container.
        // remoteVideoTrack.play(playerContainer.id);
      }

      // If the subscribed track is audio.
      if (mediaType === "audio") {
        // Get `RemoteAudioTrack` in the `user` object.
        const remoteAudioTrack = user.audioTrack;
        // Play the audio track. No need to pass any DOM element.
        remoteAudioTrack.play();
      }
    });

    rtc.client.on("user-unpublished", (user) => {
      // Get the dynamically created DIV container.
      const playerContainer = document.getElementById(user.uid);
      // Destroy the container.

      playerContainer.remove();
    });
  }

  async function leaveCall() {
    // Destroy the local audio and video tracks.
    rtc.localAudioTrack.close();
    rtc.localVideoTrack.close();

    // Traverse all remote users.
    rtc.client.remoteUsers.forEach((user) => {
      // Destroy the dynamically created DIV container.
      const playerContainer = document.getElementById(user.uid);
      playerContainer && playerContainer.remove();
    });

    // Leave the channel.
    await rtc.client.leave();
  }

  useEffect(() => {
    startBasicCall();
  }, []);
  // startBasicCall();

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}
