# story-line
## Many lines becomes a story
[![Build Status](https://travis-ci.org/meijin007/story-line.svg?branch=master)](https://travis-ci.org/meijin007/story-line) [![Coverage Status](https://coveralls.io/repos/github/meijin007/story-line/badge.svg?branch=master)](https://coveralls.io/github/meijin007/story-line?branch=master)
<br />
## Backend Architecture
* Heavily use of Dependency Injection (without any framework)
* Express.js __Controllers__  accepting a
* __Service__ which is in abstract on the
* __Model__ which is defined using [TypeORM]([https://typeorm.io/]) as ORM
  * Currently using Sqlite3

### Creating migration

``` 
npm run typeorm migration:generate -- -n NameOfMigration
```
<br /> 
<br /> 
Ⓒ Created By Assaf Sapir, 2019, Under MIT License
