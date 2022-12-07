import { useState, useEffect } from "react";
import AgoraRTC, {
  MicrophoneAudioTrackInitConfig,
  CameraVideoTrackInitConfig
} from "agora-rtc-sdk-ng";

export default function useAgora(client) {
  const appid = "2e5346b36d1f40b1bbc62472116d96de";

  const [localVideoTrack, setLocalVideoTrack] = useState("");
  const [localAudioTrack, setLocalAudioTrack] = useState("");

  const [joinState, setJoinState] = useState(false);

  const [remoteUsers, setRemoteUsers] = useState([]);

  async function createLocalTracks() {
    const [
      microphoneTrack,
      cameraTrack
    ] = await AgoraRTC.createMicrophoneAndCameraTracks(
      MicrophoneAudioTrackInitConfig,
      CameraVideoTrackInitConfig
    );
    console.log(cameraTrack);

    setLocalAudioTrack(microphoneTrack);
    setLocalVideoTrack(cameraTrack);

    return [microphoneTrack, cameraTrack];
  }

  async function join(channel, token, uid) {
    if (!client) return;
    const [microphoneTrack, cameraTrack] = await createLocalTracks();

    await client.join(appid, channel, token);
    await client.publish([microphoneTrack, cameraTrack]);

    setJoinState(true);
  }

  async function leave() {
    if (localAudioTrack) {
      localAudioTrack.stop();
      localAudioTrack.close();
    }
    if (localVideoTrack) {
      localVideoTrack.stop();
      localVideoTrack.close();
    }
    setRemoteUsers([]);
    setJoinState(false);
    await client.leave();
  }

  useEffect(() => {
    if (!client) return;
    setRemoteUsers(client.remoteUsers);

    const handleUserPublished = async (user, mediaType) => {
      await client.subscribe(user, mediaType);
      // toggle rerender while state of remoteUsers changed.
      setRemoteUsers((remoteUsers) => Array.from(client.remoteUsers));
    };

    const handleUserUnpublished = (user) => {
      setRemoteUsers((remoteUsers) => Array.from(client.remoteUsers));
    };

    const handleUserJoined = (user) => {
      setRemoteUsers((remoteUsers) => Array.from(client.remoteUsers));
    };

    const handleUserLeft = (user) => {
      setRemoteUsers((remoteUsers) => Array.from(client.remoteUsers));
    };

    client.on("user-published", handleUserPublished);
    client.on("user-unpublished", handleUserUnpublished);
    client.on("user-joined", handleUserJoined);
    client.on("user-left", handleUserLeft);

    return () => {
      client.off("user-published", handleUserPublished);
      client.off("user-unpublished", handleUserUnpublished);
      client.off("user-joined", handleUserJoined);
      client.off("user-left", handleUserLeft);
    };
  }, [client]);

  return {
    localAudioTrack,
    localVideoTrack,
    joinState,
    leave,
    join,
    remoteUsers
  };
}
