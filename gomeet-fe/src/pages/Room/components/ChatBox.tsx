import React, { useEffect, useState } from "react";
import Input from "../../../components/Input";
import { useRoom } from "../hooks/useRoom";
import { EWSType, WSReceive, WSSend } from "../../../types/websocket.type";
import Button from "../../../components/Button";
import { XIcon } from "lucide-react";

interface Props {
  isShowChatBox?: boolean;
  onClose?: () => void;
}

const ChatBox: React.FC<Props> = ({ isShowChatBox, onClose }) => {
  const { ws, username } = useRoom();
  const [message, setMessage] = useState("");
  const [listMessage, setListMessage] = useState<WSReceive<string>[]>([]);

  useEffect(() => {
    ws.addEventListener("message", onMessage);

    return () => {
      ws.removeEventListener("message", onMessage);
    };
  }, [ws]);

  const onMessage = (e: MessageEvent<string>) => {
    const content = JSON.parse(e.data) as WSReceive<string>;

    if (
      content.type === EWSType.CHAT ||
      content.type === EWSType.NEW_USER ||
      content.type === EWSType.LEAVE
    ) {
      setListMessage((prev) => [...prev, content]);
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data: WSSend<string> = {
      type: EWSType.CHAT,
      content: message,
    };
    ws.send(JSON.stringify(data));
    setListMessage((prev) => [
      ...prev,
      {
        ...data,
        from: username,
      },
    ]);
    setMessage("");
  };

  return (
    <aside
      className={`fixed top-0 ${
        isShowChatBox ? "right-0" : "-right-full"
      } transition-all bottom-0 lg:static bg-gray-900 rounded-xl w-full lg:w-80 flex flex-col`}
    >
      <header className="p-4 text-xl font-bold border-b border-b-gray-800 flex items-center justify-between">
        <h2 className="text-white">Messages</h2>
        <Button
          onClick={onClose}
          className="lg:hidden"
          isCircle={true}
          icon={<XIcon />}
        />
      </header>
      <div className="flex-1 overflow-y-auto">
        {listMessage.map((it, idx) =>
          it.type === EWSType.CHAT ? (
            <div key={idx} className="p-2 bg-gray-800 rounded-xl m-2">
              <h4 className="font-bold text-rose-600 text-sm">{it.from}:</h4>
              <p>{it.content}</p>
            </div>
          ) : it.type === EWSType.NEW_USER ? (
            <div key={idx} className="py-2 px-4">
              <span className="font-bold text-rose-600">{it.from}</span> Joined!
            </div>
          ) : it.type === EWSType.LEAVE ? (
            <div key={idx} className="py-2 px-4">
              <span className="font-bold text-rose-600">{it.from}</span> Leave!
            </div>
          ) : (
            <React.Fragment key={idx} />
          )
        )}
      </div>
      <div className="border-t border-t-gray-800 p-4">
        <form onSubmit={onSubmit}>
          <label htmlFor="message" className="font-bold block mb-2">
            {username}:
          </label>
          <Input
            name="message"
            isDarker
            placeholder="Type Message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </form>
      </div>
    </aside>
  );
};
export default ChatBox;
