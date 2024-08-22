import React, { use, useEffect, useState } from "react";
import Button from "../../../components/Button";
import { MonitorUpIcon, MonitorXIcon } from "lucide-react";
import RoomContext from "../context/Room.Context";

const ShareScreenButton: React.FC = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const { listMedia, rooms, username } = use(RoomContext);
  const [shareMediaId, setShareMediaId] = useState<string>();

  useEffect(() => {
    if (navigator.mediaDevices && "getDisplayMedia" in navigator.mediaDevices) {
      setIsAvailable(true);
    }
  }, []);

  useEffect(() => {
    if (shareMediaId) {
      const isExist = listMedia.find(
        (it) => it.username === username && it.stream?.id === shareMediaId
      );
      if (!isExist) {
        setShareMediaId(undefined);
      }
    }
  }, [listMedia]);

  const doShareScreen = async () => {
    try {
      const screen = await navigator.mediaDevices.getDisplayMedia();
      setShareMediaId(screen.id);
      rooms!.addMyMedia(screen);
    } catch (error) {
      alert("Failed to caputre!" + error);
    }
  };

  const doStopShareScreen = async () => {
    if (shareMediaId) {
      const stream = listMedia.find(
        (str) => str.username === username && str.stream?.id === shareMediaId
      );
      for (const track of stream!.stream!.getTracks()) {
        track.stop();
      }
      rooms!.removeMyMedia(shareMediaId);
    }
  };

  return isAvailable ? (
    <Button
      onClick={shareMediaId ? doStopShareScreen : doShareScreen}
      icon={shareMediaId ? <MonitorXIcon /> : <MonitorUpIcon />}
      variant={shareMediaId ? "primary" : "default"}
    >
      {shareMediaId ? "Stop" : "Screen"}
    </Button>
  ) : (
    <React.Fragment />
  );
};
export default ShareScreenButton;
