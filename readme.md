# story-line

## Many lines becomes a story

[![Build Status](https://travis-ci.org/meijin007/story-line.svg?branch=master)](https://travis-ci.org/meijin007/story-line) [![Coverage Status](https://coveralls.io/repos/github/meijin007/story-line/badge.svg?branch=master)](https://coveralls.io/github/meijin007/story-line?branch=master) [![Known Vulnerabilities](https://snyk.io//test/github/meijin007/story-line/badge.svg?targetFile=api/package.json)](https://snyk.io//test/github/meijin007/story-line?targetFile=package.json) [![Last commit](https://img.shields.io/github/last-commit/meijin007/story-line.svg)](https://github.com/meijin007/story-line/commits/master) ![GitHub contributors](https://img.shields.io/github/contributors-anon/meijin007/story-line.svg) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/3c0cbc240e8b405ba0b93113f8aae62f)](https://app.codacy.com/app/meijin007/story-line?utm_source=github.com&utm_medium=referral&utm_content=meijin007/story-line&utm_campaign=Badge_Grade_Dashboard)
<br /> 
![GitHub](https://img.shields.io/github/license/meijin007/story-line.svg?color=blue) ![GitHub top language](https://img.shields.io/github/languages/top/meijin007/story-line.svg) [![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/) ![Assaf Badges](https://img.shields.io/badge/Assaf-Like%20badges-blue.svg) 

## Monorepo Architecture

-   `/api` is for the backend.
-   `/ui` is for the front end
-   > TODO: Create docker / docker compose for running 

## Backend Architecture

-   Heavily use of Dependency Injection (without any framework).
-   Express.js **Controllers**  accepting a
-   **Service** which is in abstract on the
-   **Model** which is defined using [TypeORM]([https://typeorm.io/]) as ORM.
    -   Currently using Sqlite3.

## UI
-   React
-   MaterialUI

## Tests

-   Every testable class under `src/` should have a corresponding test suit file in `test/`.
-   run `npm run test` to run all the tests with coverage information.
-   CI (Travis) should run `npm run test:ci` for sending coverage data to [coveralls.io](https://coveralls.io/github/meijin007/story-line).

## General

### Creating migration

    npm run typeorm migration:generate -- -n NameOfMigration

<br /> 

Ⓒ Created By Assaf Sapir, 2019, Under MIT License
