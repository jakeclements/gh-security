#! /usr/bin/env node

import { Command } from 'commander';
import pckge from './package.json';
import { authCommands } from './src/dependabot';
import { repoListCommands } from './src/repo-list';
import { oktokitCommands } from './src/scan';

const program = new Command();

program.version(pckge.version, '-v, --vers', 'output the current version');

program.addCommand(authCommands());
program.addCommand(repoListCommands());
program.addCommand(oktokitCommands());

program.parse();