import { Command } from "commander";
import { getRepoList, setRepoList, clearRepoList } from "./config";
import { sendMessage } from "./logging";

export const repoListCommands = () => {
  const program = new Command();

  const repoProgram = program
    .command("repo-list")
    .description("A set of tools for managing a list of repositories to scan for vulnerabilities");

  repoProgram
    .command("view")
    .description("View the stored repo list")
    .action(() => console.log(getRepoList()));

  repoProgram
    .command("set")
    .description(
      "Set the stored repo lists - note, this deletes the existing list"
    )
    .argument("<string>", "Path to repo list json")
    .action((str) => {
      setRepoList(str);
      sendMessage('Repo stored', 'success');
    });

  repoProgram
    .command("clear")
    .description("Delete the stored repo list")
    .action(() => {
      clearRepoList();
      sendMessage("Repo list deleted", "success");
    });

  return repoProgram;
};
