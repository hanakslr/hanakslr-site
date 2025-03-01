import React from "react";
import WindowHeightSection from "../../../components/WindowHeightSection";

export const GithubLatest = () => {
  return (
    <WindowHeightSection>
      <div className="flex h-full w-full flex-col items-center justify-center rounded-xl border-2 border-red-500">
        <h1 className="w-full text-center text-2xl font-bold">
          This is what I have been working on lately
        </h1>
        <p className="text-md font-thin">Github projects here</p>
      </div>
    </WindowHeightSection>
  );
};
