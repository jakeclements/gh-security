import { Command } from "commander";
import { getAuth, getRepoList } from './config';
import { Octokit } from "@octokit/core";
import { sendMessage } from './messaging';
import { renderTable } from "./table";

const checkToken = () => {
  const auth = getAuth();

  if (!auth) {
    sendMessage('Error: No Oktokit token set, read the README to learn how to generate and add one', 'error');
    return null;
  }

  return auth;
}

export const fetchIssuesForRepo = async ({ repo }: { repo: string }) => {
  const auth = checkToken();
  if (auth === null) {
    return false;
  }

  const octokit = new Octokit({
    auth
  });
  
  const template = {
    repo,
    status: 200,
    low: 0,
    medium: 0,
    high: 0,
    critical: 0,
  };

  try {
    const req = await octokit.request(
      "GET /repos/{owner}/{repo}/dependabot/alerts",
      {
        owner: "opentable", //@TODO: Should come from config
        repo,
      }
    );
  
    if (req && req.data) {
      const unFixedIssues = req.data.filter((f: any) => !f.fixed_at);
      return unFixedIssues.reduce((acc: any, data: any) => {
        const severity = data?.security_vulnerability?.severity;
  
        if (severity) {
          return {
            ...acc,
            [severity]: acc[severity] + 1,
          };
        }
  
        return {
          ...acc,
          noMatch: acc.noMatch + 1,
        };
      }, template);
    } else {
      throw new Error(`Couldn't fetch data for ${repo}`);
    }

  } catch({ status }) {
    return {
      ...template,
      status,
      low: '-',
      medium: '-',
      high: '-',
      critical: '-',
    };
  }

};

export const fetchRepoList = async () => {
  if (checkToken() === null) {
    return false;
  }
  const repoList = getRepoList();
  const repoFetches = repoList.map((entry) => fetchIssuesForRepo(entry));
  const repoData = await Promise.all(repoFetches);

  console.log(repoData);
}

const viewRepoListTable = () => {
  const repos = fetchRepoList();
}

export const oktokitCommands = () => {
  const program = new Command();
  const scanProgram = program
    .command("scan")
    .description("Scan for vulnerabilities")
    .action(viewRepoListTable);

  scanProgram
    .command("view-list")
    .description("Scan stored repos for security vulnerabilities")
    .argument('<repo>', 'Repo name')
    .action(async (repo: string) => {
      const issues = await fetchIssuesForRepo({ repo });
      renderTable([issues]);
    });

  return scanProgram;
}