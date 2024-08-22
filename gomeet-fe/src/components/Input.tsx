import React from "react";

interface Props
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  isDarker?: boolean;
}
const Input: React.FC<Props> = ({ isDarker, ...rest }) => (
  <input
    {...rest}
    className={
      "block w-full bg-gray-800/80 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-600"
    }
  />
);
export default Input;
