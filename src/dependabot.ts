import { Command } from "commander";
import { getAuth, setAuth, deleteAuth } from "./config";
import { sendMessage } from "./messaging";

export const authCommands = () => {
  const program = new Command();

  const authProgram = program
    .command("auth")
    .description("A set of tools for managing Oktokit auth keys");

  authProgram
    .command("view")
    .description("View the stored Oktokit auth token")
    .action(() => {
      const oktoKitAuth = getAuth();

      if (oktoKitAuth) {
        sendMessage(oktoKitAuth);
      } else {
        sendMessage(
          "Error: No Oktokit auth found, check the README to learn how to generate this",
          "error"
        );
      }
    });

  authProgram
    .command("set")
    .description("Set the Oktokit auth token required to query dependabot")
    .argument("<string>", "Oktokit token")
    .action((str) => {
      setAuth(str);
      sendMessage("Token stored");
    });

  authProgram
    .command("delete")
    .description("Delete the stored Oktokit auth token")
    .action(() => {
      deleteAuth();
      sendMessage("Token deleted");
    });

  return authProgram;
};
