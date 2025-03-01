import React from "react";
import WindowHeightSection from "../../../components/WindowHeightSection";

export const Header = () => {
  return (
    <WindowHeightSection>
      <div className="flex h-full w-full flex-col items-center justify-center rounded-xl border-2 border-blue-500">
        <h1 className="w-full text-center text-2xl font-bold">Hi I'm Hana</h1>
        <p className="text-md font-thin">I'm a software engineer.</p>
      </div>
    </WindowHeightSection>
  );
};
