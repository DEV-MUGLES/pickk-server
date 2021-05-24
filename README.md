<p align="center">
  <a href="https://api.pickk.dev/graphql/" target="blank"><img src="https://pickk.one/images/icons/logo/logo-clear.png" width="320" alt="PICKK Logo" /></a>
</p>

  <p align="center">PICKK main server application</p>

## Installation

please make sure that [Docker Desktop](https://www.docker.com/products/docker-desktop) is available

```bash
$ npm install
```

## Set Providers

```bash
# Start mysql, redis
# please make sure that [Docker Desktop](https://www.docker.com/products/docker-desktop) is available
$ npm run set

# clear docker containers, volumnes
$ npm run set:down
```

## Running the app

```bash
$ npm run start

# watch mode
$ npm run start:dev

# debug mode
$ npm run start:debug

# with build files (/dist)
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run jest

# e2e tests
$ npm run jest:e2e

# test coverage
$ npm run jest:cov

# prettier, eslint, tsc, jest
$ npm run test
```
