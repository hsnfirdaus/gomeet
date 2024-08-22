import React, { useState, useTransition } from "react";
import Modal from "../../../components/Modal";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import { EWSType, WSReceive } from "../../../types/websocket.type";

interface Props {
  roomId: string;
  onInit: (username: string, ws: WebSocket) => void;
}

const InitWSModal: React.FC<Props> = ({ onInit, roomId }) => {
  const [username, setUsername] = useState("");
  const [isLoading, startLoading] = useTransition();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startLoading(async () => {
      const ws = new WebSocket(
        import.meta.env.VITE_WS_URL +
          "/rooms/" +
          roomId +
          "/ws?username=" +
          username
      );
      const handleResponse = (e: MessageEvent<string>) => {
        const data = JSON.parse(e.data) as WSReceive<string>;
        if (data.type === EWSType.CONNECTED) {
          ws.removeEventListener("message", handleResponse);
          onInit(username, ws);
        } else {
          alert(data.content);
          ws.close();
        }
      };

      ws.addEventListener("message", handleResponse);
    });
  };

  return (
    <Modal title="Enter Room" open={true}>
      <form onSubmit={onSubmit}>
        <label htmlFor="username" className="mb-1 block">
          Username
        </label>
        <Input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          name="username"
          placeholder="Enter Username..."
          disabled={isLoading}
        />
        <div className="text-center mt-4">
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Enter Room
          </Button>
        </div>
      </form>
    </Modal>
  );
};
export default InitWSModal;
