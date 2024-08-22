import React, { useEffect, useRef } from "react";

interface Props {
  title: string;
  media: MediaStream;
  isMuted: boolean;
}
const MediaVideo: React.FC<Props> = ({ media, title, isMuted }) => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    ref.current!.srcObject = media;
  }, [media, ref]);

  return (
    <div className="rounded-xl bg-gray-900 text-white flex flex-col gap-4 items-center justify-center w-full h-full relative overflow-hidden">
      <video
        ref={ref}
        autoPlay
        muted={isMuted}
        className="w-full h-full object-contain"
      />
      <span className="absolute bottom-2 left-2 text-rose-600 bg-rose-950/50 px-2 py-1 rounded-md">
        {title}
      </span>
    </div>
  );
};
export default MediaVideo;
