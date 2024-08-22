import { use } from "react";
import RoomContext from "../context/Room.Context";

export const useRoom = () => {
  const { ws, username } = use(RoomContext);

  return {
    ws: ws!,
    username: username!,
  };
};
