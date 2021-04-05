<p align="center">
  <a href="https://api.pickk.dev/graphql/" target="blank"><img src="https://pickk.one/images/icons/logo/logo-clear.png" width="320" alt="PICKK Logo" /></a>
</p>

  <p align="center">PICKK main server application</p>

## Installation

please make sure that [Docker Desktop](https://www.docker.com/products/docker-desktop) is available

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run dev

# development with docker build
$ npm run dev:build

# clear docker containers, volumnes
$ npm run dev:down
```

## Test

```bash
# unit tests
$ npm run jest

# e2e tests
$ npm run jest:e2e

# test coverage
$ npm run jest:cov

# prettier, eslint, tsc
$ npm run format && npm run lint && npm run tsc
```
