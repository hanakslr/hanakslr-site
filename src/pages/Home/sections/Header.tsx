import WindowHeightSection from "../../../components/WindowHeightSection";
import linkedin from "../../../assets/icons/linkedin.svg";
import github from "../../../assets/icons/github.svg";

const PROFILES = [
  {
    name: "linkedin",
    icon: linkedin,
    url: "https://www.linkedin.com/in/hanakslr",
  },
  { name: "github", icon: github, url: "https://github.com/hanakslr" },
];
export const Header = () => {
  return (
    <WindowHeightSection>
      <div className="flex h-full w-full flex-col items-center justify-center rounded-xl border-2 border-blue-500">
        <h1 className="w-full py-2 text-center text-2xl font-bold">
          Hi, I'm Hana
        </h1>
        <p className="text-md font-thin">I'm a software engineer.</p>
        <div className="flex flex-row gap-4 py-3">
          {PROFILES.map((p) => (
            <a href={p.url} target="_blank" rel="noopener noreferrer">
              <img src={p.icon} alt={p.name} className="h-5 w-5" />
            </a>
          ))}
        </div>
      </div>
    </WindowHeightSection>
  );
};
