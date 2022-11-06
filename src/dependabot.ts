import { Command } from "commander";
import { getAuth, setAuth, deleteAuth } from "./config";
import { sendMessage } from "./logging";
import { NO_TOKEN, TOKEN_STORED, TOKEN_REMOVED } from './messaging';

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
          NO_TOKEN,
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
      sendMessage(TOKEN_STORED);
    });

  authProgram
    .command("delete")
    .description("Delete the stored Oktokit auth token")
    .action(() => {
      const oktoKitAuth = getAuth();

      if (oktoKitAuth) {
        deleteAuth();
        sendMessage(TOKEN_REMOVED);
      } else {
        sendMessage(
          NO_TOKEN,
          "error"
        );
      }
    });

  return authProgram;
};
