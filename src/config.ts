import Conf from 'conf';
import fs from 'fs';

const AUTHKEY = 'oktokitAuth';
const REPOKEY = 'repositories';
const OWNERKEY = 'owner';

const config = new Conf<{
  oktokitAuth: string | null;
  owner: string | null;
  repositories: any | never[];
}>({
  defaults: {
    [AUTHKEY]: null,
    [OWNERKEY]: null,
    [REPOKEY]: [],
  }
});

export const setAuth = (auth: string) => {
  config.set(AUTHKEY, auth);
  return true;
}

export const deleteAuth = () => {
  config.delete(AUTHKEY);
  return true;
}

export const getAuth = () => {
  return config.get(AUTHKEY);
}

export const getOwner = () => {
  return config.get(OWNERKEY);
}

export const getRepoList = () => {
  return config.get(REPOKEY);
}

export const setRepoList = (repoListPath: any) => {
  config.reset(REPOKEY);
  config.reset(OWNERKEY);

  try {
    const rawdata = fs.readFileSync(repoListPath);
    let repoList = JSON.parse(rawdata.toString()); 
    // @TODO: We should verify the schema here before setting config - zod it up
    config.set(REPOKEY, repoList[REPOKEY]);
    config.set(OWNERKEY, repoList[OWNERKEY]);
    return true;
  } catch (error: any) {
    throw new Error(error);
  }
}

export const clearRepoList = () => {
  config.reset(REPOKEY);
  return true;
}
