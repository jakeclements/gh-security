import { Command } from "commander";
import { getAuth, getRepoList, getOwner } from './config';
import { Octokit } from "@octokit/core";
import { sendMessage } from './logging';
import { renderTable } from "./table";
import { NO_TOKEN } from './messaging';

const checkToken = () => {
  const auth = getAuth();

  if (!auth) {
    sendMessage(NO_TOKEN, 'error');
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
        owner: getOwner(),
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
  const repoFetches = repoList.map((entry: any) => fetchIssuesForRepo(entry));
  const repoData = await Promise.all(repoFetches);

  return repoData;
}

const viewRepoListTable = async () => {
  const repos = await fetchRepoList();

  if (repos) {
    return renderTable(repos);
  }

  // @TODO: Better error
  console.log('Error fetching data');
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