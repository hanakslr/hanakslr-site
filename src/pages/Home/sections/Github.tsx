import { useQuery } from "@tanstack/react-query";
import WindowHeightSection from "../../../components/WindowHeightSection";
import { request } from "@octokit/request";
import { components } from "@octokit/openapi-types";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

type PullRequest = components["schemas"]["issue-search-result-item"];

const GITHUB_USERNAME = "hanakslr";

const fetchPublicPRs = async () => {
  const since = new Date();
  since.setMonth(since.getMonth() - 1);
  const sinceString = since.toISOString().split("T")[0]; // Format as YYYY-MM-DD

  const response = await request("GET /search/issues", {
    q: `is:pr is:public involves:${GITHUB_USERNAME} updated:>${sinceString}`,
    per_page: 100, // Max results per page
  });

  return response.data.items;
};

const PrCard = ({ data }: { data: PullRequest }) => {
  const projectName = data.repository_url.split("/").pop();
  return (
    <div className="flex w-full max-w-4xl flex-col gap-1 rounded-xl border p-4">
      <div className="border-bottom flex flex-row justify-between">
        <div>{projectName}</div>
        <div>#{data.number}</div>
      </div>
      <div className="font-bold">{data.title}</div>

      {data.body && (
        <div className="text-xs">
          <Markdown remarkPlugins={[remarkGfm]}>{data.body}</Markdown>
        </div>
      )}
    </div>
  );
};

export const Github = () => {
  const { data } = useQuery({
    queryKey: ["public_prs"],
    queryFn: fetchPublicPRs,
  });

  console.log(data);

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-4 md:p-8">
      <div className="flex h-full w-full flex-col items-center gap-4 rounded-xl border-2 border-red-500 p-2 py-4 md:gap-8 md:p-6 md:py-8">
        <h1 className="w-full text-center text-2xl font-bold">
          What I've been working on this month
        </h1>
        <div className="flex flex-col items-center gap-2 md:gap-4">
          {data?.map((pr) => <PrCard data={pr} key={pr.id} />)}
        </div>
        <div className="text-sm">
          {"+ super secret stuff (private contributions not shown)"}
        </div>
      </div>
    </div>
  );
};
