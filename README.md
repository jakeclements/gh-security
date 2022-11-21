# Github Security

Build a better understanding of security warnings across multiple repositories in your organisation.

## Getting Started

### Installation

Install globally with your favourite package manager;

**npm**

```
npm install -g gh-security
```

**Yarn**

```
yarn global add gh-security
```

**OR**

Run with **npx**;

```
npx gh-security
```

### Getting an Oktokit authentication token

You'll need to provide an Oktokit auth token before you can scan repos. This requires a couple of simple steps;

**Creating the token**
Goto https://github.com/settings/tokens/new?scopes=repo, gh-security requires "all repo" scopes to pull package security data. Token expiration is up to you, if a token expires you can regenerate and add a new one by repeating these steps.

**Adding the token to gh-security**
Run `npx auth set [your-token]` replacing `[your-token]` with the token you generated above to set the token. This token persists across installs of the app.

Run `npx auth view` to verify your authorisation token has been added, if successful you should see your token.

### Adding repositories to scan

Repositories to scan are based on an imported file with the following shape;

```json
{
  "owner": "repo-owner",
  "repositories": [
    {
      "repo": "my-favourite-repo"
    },
    {
      "repo": "my-almost-favourite-repo"
    },
    {
      "repo": "not-even-close-to-my-favourite-repo"
    }
  ]
}
```

All repos to be scanned should belong to a single owner, represented by the `owner` key.
Order doesn't matter, repos in the table will be sorted based on their security issues.

Once you've added a couple of repositories to your json, save it and run `npx gh-security auth set ./path-to-file.json` to import your repo list.

Run `npx gh-security repo-list view` to verify the repo list has been uploaded, if successful you should see the list you uploaded.

### Running and understanding a security scan

If you've successfully added an auth token and uploaded your repo list, all that is left to do is to run `npx run gh-security scan` to scan your repos for security vulnerabilities.

## Commands

WIP

### Auth

WIP

### Repo-List

WIP

### Scan

WIP

### Help

WIP

## Contributing

Contributions are encouraged, please read the [Contributing.md](/CONTRIBUTING.md) to get set up for local dev.
