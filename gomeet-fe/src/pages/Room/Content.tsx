import React, { useState } from "react";
import ChatBox from "./components/ChatBox";
import ShareScreenButton from "./components/ShareScreenButton";
import MediaGrid from "./components/MediaGrid";
import CaptureVideoButton from "./components/CaptureVideoButton";
import Button from "../../components/Button";
import { MessageSquareTextIcon } from "lucide-react";

const RoomContent: React.FC = () => {
  const [isShowChatBox, setIsShowChatBox] = useState(false);
  return (
    <div className="flex gap-4 h-full lg:p-4">
      <div className="flex-1 flex flex-col gap-4">
        <MediaGrid />
        <div className="p-4 gap-2 flex-wrap flex items-center justify-center">
          <ShareScreenButton />
          <CaptureVideoButton />
          <Button
            className="lg:hidden"
            onClick={() => setIsShowChatBox(true)}
            icon={<MessageSquareTextIcon />}
          >
            Messages
          </Button>
        </div>
      </div>
      <ChatBox
        isShowChatBox={isShowChatBox}
        onClose={() => setIsShowChatBox(false)}
      />
    </div>
  );
};
export default RoomContent;
