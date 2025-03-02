import { useQuery } from "@tanstack/react-query";
import { request } from "@octokit/request";
import { components } from "@octokit/openapi-types";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import clsx from "clsx";
import {
  IconGitPullRequest,
  IconGitMerge,
  IconGitPullRequestDraft,
  IconGitPullRequestClosed,
} from "@tabler/icons-react";

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

type GitStatus = "Merged" | "Closed" | "Draft" | "Open";

const getStatus = (pr: PullRequest) => {
  if (pr.pull_request?.merged_at) return "Merged";
  if (pr.state === "closed") return "Closed";
  if (pr.draft) return "Draft";
  if (pr.state === "open") return "Open";

  return null;
};

const GitStatusBadge = ({ status }: { status: GitStatus }) => {
  const iconProps = { size: 14 };
  return (
    <div
      className={clsx(
        "flex items-center rounded-full p-1 text-xs text-white",
        status === "Draft" && "bg-slate-600",
        status === "Closed" && "bg-red-600",
        status === "Merged" && "bg-purple-800",
        status === "Open" && "bg-green-600",
      )}
    >
      {status == "Draft" && <IconGitPullRequestDraft {...iconProps} />}
      {status == "Closed" && <IconGitPullRequestClosed {...iconProps} />}
      {status == "Open" && <IconGitPullRequest {...iconProps} />}
      {status == "Merged" && <IconGitMerge {...iconProps} />}
    </div>
  );
};

const PrCard = ({ data }: { data: PullRequest }) => {
  const repo = data.repository_url.split("/");
  const projectName = repo.pop();
  // const owner = repo.pop();

  const status = getStatus(data);

  return (
    <a href={data.html_url} target="_blank" rel="noopener noreferrer">
      <div className="flex w-full max-w-4xl flex-col rounded-xl border">
        <div className="flex flex-row items-center justify-between gap-2 rounded-t-xl bg-gray-100 p-4 py-2 font-mono text-xs text-slate-700">
          <div className="mr-auto">
            {projectName}#{data.number}
          </div>
          {status && <GitStatusBadge status={status} />}
        </div>
        <div className="p-4">
          <div className="font-bold">{data.title}</div>
          {data.body && (
            <article className="prose prose-p:my-1">
              <div className="text-xs">
                <Markdown remarkPlugins={[remarkGfm]}>{data.body}</Markdown>
              </div>
            </article>
          )}
        </div>
      </div>
    </a>
  );
};

const DateLabel = ({ date }: { date: string }) => {
  return (
    <div className="px-4 py-1 text-center text-xs font-thin text-slate-400">
      {date}
    </div>
  );
};

export const Github = () => {
  const { data } = useQuery({
    queryKey: ["public_prs"],
    queryFn: fetchPublicPRs,
    staleTime: 60 * 1000 * 4,
  });

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-2 sm:p-4 md:p-8">
      <div className="flex h-full w-full flex-col items-center gap-4 rounded-xl border-purple-600 p-2 py-4 sm:border-2 md:gap-8 md:p-6 md:py-8">
        <h1 className="w-full text-center text-2xl font-bold">
          What I've been working on this month
        </h1>
        <div className="flex flex-col items-center gap-2 md:gap-4">
          {data &&
            Object.entries(
              data.reduce<Record<string, PullRequest[]>>((groups, pr) => {
                const date = new Date(pr.created_at).toLocaleDateString(
                  "en-US",
                  {
                    month: "2-digit",
                    day: "2-digit",
                    year: "numeric",
                  },
                );
                if (!groups[date]) {
                  groups[date] = [];
                }
                groups[date].push(pr);
                return groups;
              }, {}),
            )
              .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
              .map(([date, prs]) => (
                <div key={date} className="w-full">
                  <DateLabel date={date} />
                  <div className="flex flex-col gap-3">
                    {prs.map((pr) => (
                      <PrCard data={pr} key={pr.id} />
                    ))}
                  </div>
                </div>
              ))}
        </div>
        <div className="text-sm">
          {"+ super secret stuff (private contributions not shown)"}
        </div>
      </div>
    </div>
  );
};
