// import chalk from 'chalk';

const messagingTypes = {
  default: 'default',
  success: 'success',
  error: 'error',
 } as const;

type MessageTypes = (typeof messagingTypes)[keyof typeof messagingTypes]

export const sendMessage = (message: string | any, type: MessageTypes = 'default') => {
  // @TODO: Setup Chalk and debugging
  console.log(message);
}