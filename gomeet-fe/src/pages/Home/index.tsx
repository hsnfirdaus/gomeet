import React, { useState } from "react";
import Button from "../../components/Button";
import CreateRoomModal from "./CreateRoomModal";
import JoinRoomModal from "./JoinRoomModal";
import Logo from "../../components/Logo";

const Home: React.FC = () => {
  const [isShowJoinRoom, setIsShowJoinRoom] = useState(false);
  const [isShowCreateRoom, setIsShowCreateRoom] = useState(false);
  return (
    <React.Fragment>
      <div className="flex items-center justify-center flex-col h-full px-4 text-center">
        <Logo />
        <p className="my-4">Simple meeting using peer to peer WebRTC.</p>
        <div className="flex gap-2">
          <Button onClick={() => setIsShowJoinRoom(true)}>Join Meet</Button>
          <Button variant="primary" onClick={() => setIsShowCreateRoom(true)}>
            Create Room
          </Button>
        </div>
      </div>
      <CreateRoomModal
        open={isShowCreateRoom}
        onClose={() => setIsShowCreateRoom(false)}
      />
      <JoinRoomModal
        open={isShowJoinRoom}
        onClose={() => setIsShowJoinRoom(false)}
      />
    </React.Fragment>
  );
};
export default Home;
