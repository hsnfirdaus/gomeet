import React, { useState, useTransition } from "react";
import { BaseModalProps } from "../../types/modal.type";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { api } from "../../lib/api";
import { BaseResponse } from "../../types/response.type";
import { useNavigate } from "react-router-dom";

const CreateRoomModal: React.FC<BaseModalProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const [name, setName] = useState("My Room");
  const [isLoading, startLoading] = useTransition();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startLoading(async () => {
      try {
        const { data } = await api.post<BaseResponse<string>>("/rooms", {
          name,
        });
        if (data.isError) {
          alert(data.message);
        } else {
          navigate(`/room/${data.response}`);
        }
      } catch (error) {
        alert(error);
      }
    });
  };
  return (
    <Modal title="Create New Room" open={open} onClose={onClose}>
      <form onSubmit={onSubmit}>
        <label htmlFor="name" className="mb-1 block">
          Room Name
        </label>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          name="name"
          placeholder="Enter Room Name..."
        />
        <div className="text-center mt-4">
          <Button type="submit" variant="primary" isLoading={isLoading}>
            Create Room
          </Button>
        </div>
      </form>
    </Modal>
  );
};
export default CreateRoomModal;
