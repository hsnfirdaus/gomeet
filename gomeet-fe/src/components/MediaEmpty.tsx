import { CameraOffIcon, MicOffIcon } from "lucide-react";
import React from "react";

interface Props {
  title: string;
}
const MediaEmpty: React.FC<Props> = ({ title }) => {
  return (
    <div className="rounded-xl bg-gray-900 text-white flex flex-col gap-4 items-center justify-center w-full h-full p-4">
      <div className="text-lg lg:text-2xl xl:text-4xl font-bold text-rose-600 break-words min-w-0 w-full text-center">
        {title}
      </div>
      <div className="flex gap-4">
        <span className="bg-gray-800 p-2 rounded-full h-12 w-12 flex items-center justify-center">
          <CameraOffIcon />
        </span>
        <span className="bg-gray-800 p-2 rounded-full h-12 w-12 flex items-center justify-center">
          <MicOffIcon />
        </span>
      </div>
    </div>
  );
};
export default MediaEmpty;
