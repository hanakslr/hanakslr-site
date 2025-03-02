import { Header, GithubLatest } from "./sections";

export const HomePage = () => {
  return (
    <div className="flex w-full flex-col">
      <Header />
      <GithubLatest />
    </div>
  );
};
