import React, { use, useEffect, useState } from "react";
import Button from "../../../components/Button";
import { CameraIcon, CameraOffIcon } from "lucide-react";
import RoomContext from "../context/Room.Context";

const CaptureVideoButton: React.FC = () => {
  const { listMedia, rooms, username } = use(RoomContext);
  const [shareMediaId, setShareMediaId] = useState<string>();

  useEffect(() => {
    if (shareMediaId && username) {
      const isExist = listMedia.find(
        (it) => it.username === username && it.stream?.id === shareMediaId
      );
      if (!isExist) {
        setShareMediaId(undefined);
      }
    }
  }, [listMedia, username]);

  const doShareVideo = async () => {
    try {
      const video = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setShareMediaId(video.id);
      rooms!.addMyMedia(video);
    } catch (error) {
      alert("Failed to get video! " + error);
    }
  };

  const doStopShareVideo = async () => {
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

  return (
    <Button
      onClick={shareMediaId ? doStopShareVideo : doShareVideo}
      icon={shareMediaId ? <CameraOffIcon /> : <CameraIcon />}
      variant={shareMediaId ? "primary" : "default"}
    >
      {shareMediaId ? "Stop" : "Camera"}
    </Button>
  );
};
export default CaptureVideoButton;
