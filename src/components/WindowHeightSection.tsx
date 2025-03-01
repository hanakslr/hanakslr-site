import React from "react";

const WindowHeightSection = ({
  children,
}: {
  children: React.ReactElement;
}) => {
  return (
    <div className="flex h-svh w-full items-center justify-center p-4 md:p-8">
      {children}
    </div>
  );
};

export default WindowHeightSection;
