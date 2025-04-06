import { ReactNode } from "react";

const Label = ({ children }: { children: ReactNode }) => {
  return (
    <label className="text-sm font-medium text-gray-700">{children}</label>
  );
};

export default Label;
