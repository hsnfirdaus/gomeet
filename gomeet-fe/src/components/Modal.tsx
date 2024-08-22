import React from "react";
import { XIcon } from "lucide-react";
import { BaseModalProps } from "../types/modal.type";
import Button from "./Button";

interface Props extends BaseModalProps {
  title?: string;
  children?: React.ReactNode;
}
const Modal: React.FC<Props> = ({ open, onClose, title, children }) => {
  return (
    <div
      className={`fixed inset-0 px-2 flex items-center justify-center transition-all ${
        open ? "visible opacity-100" : "invisible opacity-0"
      }`}
    >
      <div className="bg-black/80 inset-0 absolute" onClick={onClose}></div>
      <div className="max-w-xl w-full bg-gray-900 p-4 rounded-xl z-10">
        <header className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-white text-lg">{title}</h2>
          {onClose && (
            <Button icon={<XIcon />} onClick={onClose} isCircle={true} />
          )}
        </header>
        {children}
      </div>
    </div>
  );
};
export default Modal;
