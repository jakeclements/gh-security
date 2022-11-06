# Contributing

Contributions are welcome to this project! Please submit a PR on the dev branch for any changes.

## Running semantic release locally

If you want to run Semantic Release in a dry run locally to review your changes you'll need to create a `.env` file and include both a Github access token and NPM token.
Base this on the `.env.example` file.

Once you've set up your `.env` run `npx dotenv-run-script dry:semantic-release`.
