import { useQuery } from "@tanstack/react-query";
import { request } from "@octokit/request";
import { components } from "@octokit/openapi-types";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { truncateMarkdown } from "../../../utils/markdown";
import React from "react";
import {
  IconGitPullRequest,
  IconGitMerge,
  IconGitPullRequestDraft,
  IconGitPullRequestClosed,
  IconCircleDot,
  IconCircleCheck,
} from "@tabler/icons-react";

type ActivityItem = components["schemas"]["issue-search-result-item"];

const GITHUB_USERNAME = "hanakslr";

const fetchRecentActivity = async () => {
  const since = new Date();
  since.setMonth(since.getMonth() - 18);
  const sinceString = since.toISOString().split("T")[0];

  const response = await request("GET /search/issues", {
    q: `is:public author:${GITHUB_USERNAME} updated:>${sinceString} -label:skip-blog`,
    sort: "updated",
    order: "desc",
    per_page: 10,
  });

  return response.data.items;
};

const GitStatusBadge = ({ item }: { item: ActivityItem }) => {
  const isPR = item.pull_request !== undefined;
  let bg = "bg-green-600";
  let Icon: React.ComponentType<{ size: number }> = isPR
    ? IconGitPullRequest
    : IconCircleDot;

  if (isPR) {
    if (item.pull_request?.merged_at) { bg = "bg-purple-800"; Icon = IconGitMerge; }
    else if (item.state === "closed") { bg = "bg-red-600"; Icon = IconGitPullRequestClosed; }
    else if (item.draft) { bg = "bg-slate-600"; Icon = IconGitPullRequestDraft; }
  } else if (item.state === "closed") {
    bg = "bg-slate-500";
    Icon = IconCircleCheck;
  }

  return (
    <div className={`flex items-center rounded-full p-1 text-xs text-white ${bg}`}>
      <Icon size={14} />
    </div>
  );
};


const ActivityCard = ({ data }: { data: ActivityItem }) => {
  const parts = data.repository_url.split("/");
  const projectName = parts.pop();
  const owner = parts.pop();
  const isPR = data.pull_request !== undefined;

  const repoLabel = isPR ? `${projectName}` : `${owner}/${projectName}`;
  const body = data.body ? truncateMarkdown(data.body) : data.body;

  return (
    <div className="flex w-full max-w-4xl flex-col rounded-xl border">
      <a href={data.html_url} target="_blank" rel="noopener noreferrer">
        <div className="flex flex-row items-center justify-between gap-2 rounded-t-xl bg-slate-50 p-4 py-2 font-mono text-xs text-slate-700">
          <div className="mr-auto">
            {repoLabel}#{data.number}
          </div>
          <GitStatusBadge item={data} />
        </div>
        <div className="px-4 pt-4 font-medium">{data.title}</div>
      </a>
      {body && (
        <div className="px-4 pb-4">
          <article className="prose prose-sm prose-headings:my-1 prose-headings:text-xs prose-headings:font-semibold prose-p:my-1">
            <div className="text-xs">
              <Markdown remarkPlugins={[remarkGfm]}>{body}</Markdown>
            </div>
          </article>
        </div>
      )}
    </div>
  );
};

const DateLabel = ({ date }: { date: string }) => {
  return (
    <div className="px-4 py-1 text-center text-xs font-thin text-slate-500">
      {date}
    </div>
  );
};

export const Github = () => {
  const { data: combined = [] } = useQuery({
    queryKey: ["recent_activity"],
    queryFn: fetchRecentActivity,
    staleTime: 60 * 1000 * 4,
  });

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-2 sm:p-4 md:p-8">
      <div className="flex h-full w-full flex-col items-center gap-4 rounded-xl border-purple-200 p-2 py-4 sm:border-2 md:gap-8 md:p-6 md:py-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="w-full text-center text-2xl font-bold">
            What I've been working on lately
          </h1>
          <h3 className="font-mono text-xs text-slate-700">
            Last 10 public PRs & issues
          </h3>
        </div>
        <div className="flex flex-col items-center gap-2 md:gap-4">
          {combined.length > 0 &&
            Object.entries(
              combined.reduce<Record<string, ActivityItem[]>>((groups, item) => {
                const date = new Date(item.updated_at).toLocaleDateString(
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
                groups[date].push(item);
                return groups;
              }, {}),
            )
              .sort(
                ([dateA], [dateB]) =>
                  new Date(dateB).getTime() - new Date(dateA).getTime(),
              )
              .map(([date, items]) => (
                <div key={date} className="w-full">
                  <DateLabel date={date} />
                  <div className="flex flex-col gap-3">
                    {items.map((item) => (
                      <ActivityCard data={item} key={item.id} />
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
