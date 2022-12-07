import React, { useState } from "react";

import AgoraRTC from "agora-rtc-sdk-ng";

import AgoraRTM from "agora-rtm-sdk";

import useAgora from "./hooks/useAgora";
import useAgoraChat from "./hooks/useAgoraChat";
import MediaPlayer from "./components/MediaPlayer";
import "./Call.css";
import "bootstrap/dist/css/bootstrap.min.css";

const client = AgoraRTC.createClient({ codec: "h264", mode: "rtc" });

const chatClient = AgoraRTM.createInstance("2e5346b36d1f40b1bbc62472116d96de");

export default function App() {
  const [channel, setChannel] = useState("default");

  let channelName = channel;

  const [textArea, setTextArea] = useState();

  const { messages, sendChannelMessage, color } = useAgoraChat(
    chatClient,
    channelName
  );

  const {
    localAudioTrack,
    localVideoTrack,
    leave,
    join,
    joinState,
    remoteUsers
  } = useAgora(client);

  function submitMessage(event) {
    console.log(event);
    if (event.keyCode === 13) {
      event.preventDefault();
      if (textArea.trim().length === 0) return;
      sendChannelMessage(event.target.value);
      setTextArea("");
    }
  }

  return (
    <div className="call">
      <form className="call-form">
        {/* <label>
          AppID:
          <input
            type="text"
            name="appid"
            onChange={(event) => {
              setAppid(event.target.value);
            }}
          />
        </label> */}
        {/* <label>
          Token(Optional):
          <input
            type="text"
            name="token"
            onChange={(event) => {
              setToken(event.target.value);
            }}
          />
        </label> */}
        <label>
          <b> Channel: </b>
          <input
            type="text"
            name="channel"
            onChange={(event) => {
              setChannel(event.target.value);
            }}
          />
        </label>

        <div className="button-group">
          <button
            id="join"
            type="button"
            className="btn btn-primary btn-sm"
            disabled={joinState}
            onClick={() => {
              join(channel, null);
            }}
          >
            Join
          </button>
          <button
            id="leave"
            type="button"
            className="btn btn-primary btn-sm"
            disabled={!joinState}
            onClick={() => {
              leave();
            }}
          >
            Leave
          </button>
        </div>
      </form>
      {/* <b> */}
      {/* {JSON.stringify(joinState) === "joined"
          ? "No One is Here"
          : "Welcome to the '" + channel + "' Room"}
      </b>{" "} */}
      <br />
      {/* <b> Local Video: {JSON.stringify(localVideoTrack)}</b> <br />
      <b> Remote Video: {JSON.stringify(remoteUsers)}</b> */}
      <br />
      <div className="player-container">
        {/* <div> {client.uid} </div> */}
        <div className="local-player-wrapper">
          {/* <p className="local-player-text">
            {localVideoTrack && `localTrack`}
            {joinState && localVideoTrack ? `(${client.uid})` : ""}
          </p> */}
          <MediaPlayer
            videoTrack={localVideoTrack}
            audioTrack={localAudioTrack}
          ></MediaPlayer>
        </div>
        <div className="remotePlayers">
          {remoteUsers.map((user) => (
            <div className="remote-player-wrapper" key={user.uid}>
              {/* <p>Remote Player + {user.uid} </p> */}
              {/* //   <p className="remote-player-text">{`remoteVideo(${user.uid})`}</p> */}
              <MediaPlayer
                videoTrack={user.videoTrack}
                audioTrack={user.audioTrack}
              ></MediaPlayer>
            </div>
          ))}
        </div>
      </div>

      <div className="d-flex flex-column py-5 px-3">
        <h2>{channel} </h2>

        {messages.map((data, index) => {
          return (
            <div className="row" key={`chat${index + 1}`}>
              <h5 className="font-size-15" style={{ color: data.user.color }}>
                {`${data.user.name} :`}
              </h5>
              <p className="text-break">{` ${data?.messsage}`}</p>
            </div>
          );
        })}
      </div>
      <div>
        <h2> {JSON.stringify(color)} </h2>
        <input
          placeholder="Type your message here"
          onChange={(e) => setTextArea(e.target.value)}
          value={textArea}
          onKeyDown={submitMessage}
        />
      </div>
    </div>
  );
}
