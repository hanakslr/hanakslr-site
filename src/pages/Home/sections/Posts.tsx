import WindowHeightSection from "../../../components/WindowHeightSection";

export const Posts = () => {
  return (
    <WindowHeightSection>
      <div className="flex h-full w-full flex-col items-center justify-center rounded-xl border-2 border-yellow-400">
        <h1 className="w-full py-2 text-center text-2xl font-bold">
          Eventually I plan to write things
        </h1>
        <p className="text-md font-thin">And when I do they'll go here.</p>
      </div>
    </WindowHeightSection>
  );
};
