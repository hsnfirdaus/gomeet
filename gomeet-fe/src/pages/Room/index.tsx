import React from "react";
import RoomProvider from "./context/Room.Provider";
import RoomContent from "./Content";

const Room: React.FC = () => {
  return (
    <RoomProvider>
      <RoomContent />
    </RoomProvider>
  );
};
export default Room;
