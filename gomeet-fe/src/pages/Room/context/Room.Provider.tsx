import React, { useEffect, useState } from "react";
import RoomContext from "./Room.Context";
import InitWSModal from "../components/InitWSModal";
import { useParams } from "react-router-dom";
import { ListMediaItem, Rooms } from "../../../lib/Rooms.Class";

interface Props {
  children?: React.ReactNode;
}
const RoomProvider: React.FC<Props> = ({ children }) => {
  const { roomId } = useParams();
  const [rooms, setRooms] = useState<Rooms>();
  const [ws, setWs] = useState<WebSocket>();
  const [username, setUsername] = useState<string>();
  const [listMedia, setListMedia] = useState<ListMediaItem[]>([]);

  const onInit = (u: string, w: WebSocket) => {
    setUsername(u);
    setWs(w);
    const r = new Rooms({
      ws: w,
      username: u,
      onMediaChange: setListMedia,
    });
    setRooms(r);
  };

  useEffect(() => {
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  return !rooms || !ws ? (
    <InitWSModal onInit={onInit} roomId={roomId!} />
  ) : (
    <RoomContext.Provider
      value={{
        ws,
        username,
        listMedia,
        rooms,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};
export default RoomProvider;
