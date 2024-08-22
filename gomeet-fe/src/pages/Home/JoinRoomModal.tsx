import React, { useState } from "react";
import { BaseModalProps } from "../../types/modal.type";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { useNavigate } from "react-router-dom";

const JoinRoomModal: React.FC<BaseModalProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate(`/room/${roomId}`);
  };
  return (
    <Modal title="Join Existing Room" open={open} onClose={onClose}>
      <form onSubmit={onSubmit}>
        <label htmlFor="name" className="mb-1 block">
          Room ID
        </label>
        <Input
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          required
          name="name"
          placeholder="Enter RoomID..."
        />
        <div className="text-center mt-4">
          <Button type="submit" variant="primary">
            Join Room
          </Button>
        </div>
      </form>
    </Modal>
  );
};
export default JoinRoomModal;
