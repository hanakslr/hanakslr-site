import WindowHeightSection from "../../../components/WindowHeightSection";
import { IconBrandGithub, IconBrandLinkedin } from "@tabler/icons-react";

const PROFILES = [
  {
    name: "linkedin",
    icon: IconBrandLinkedin,
    url: "https://www.linkedin.com/in/hanakslr",
  },
  { name: "github", icon: IconBrandGithub, url: "https://github.com/hanakslr" },
];
export const Header = () => {
  return (
    <WindowHeightSection>
      <div className="flex h-full w-full flex-col items-center justify-center rounded-xl border-2 border-blue-200">
        <h1 className="w-full py-2 text-center text-2xl font-bold">
          Hi, I'm Hana
        </h1>
        <p className="text-md font-thin">I'm a software engineer.</p>
        <div className="flex flex-row gap-4 py-3">
          {PROFILES.map((p) => (
            <a
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              id={p.name}
            >
              <p.icon className="h-6 w-6" />
            </a>
          ))}
        </div>
      </div>
    </WindowHeightSection>
  );
};
