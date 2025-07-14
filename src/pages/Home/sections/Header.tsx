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
        <div className="w-full max-w-lg gap-4 px-4">
          <div className="flex w-full flex-row justify-between">
            <h1 className="w-full py-2 text-2xl font-bold">Hi, I'm Hana</h1>
            <div className="mr-8 flex flex-row gap-4 py-3">
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
          <div className="md:text-md flex flex-col gap-2 text-sm font-thin">
            <p>
              I'm a software engineer. I specialize in backend systems that work
              because they’re grounded in how people really use them.
            </p>
            <p>
              When I'm not coding you can find me mountain biking, skate skiing,
              or thinking about public transit.
            </p>
          </div>
        </div>
      </div>
    </WindowHeightSection>
  );
};
