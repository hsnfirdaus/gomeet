import { createContext } from "react";
import { ListMediaItem, Rooms } from "../../../lib/Rooms.Class";

interface IRoomContext {
  ws?: WebSocket;
  username?: string;
  listMedia: ListMediaItem[];
  rooms?: Rooms;
}
const RoomContext = createContext<IRoomContext>({
  listMedia: [],
});
export default RoomContext;
