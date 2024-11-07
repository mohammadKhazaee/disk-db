<h1 align="center"> SDD (Simple dumb database) </h1>
<h4 align="left"> By: Mohammad Khazaee</h4>

# Project setup:

## Install dipendencies

```bash
$ npm install
```

## Set environment variables

- create an ".env" file right next to ".env.sample"
- assign values that are listed in .env.sample
- project can support 3 types of files, which are json, yaml and bin (binary)

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

## Run tests

```bash
# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Important points

- Api docs can be found in the root dir: **Sdd_2024-11-07.json**

- by changing db type you have to restart the server.

- stored data is separated from other data types. meaning the data you have saved in yaml for is not available in json mode of application.

- though if you switch back to previous types the data is still there.
