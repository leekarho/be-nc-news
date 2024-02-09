# Northcoders News API

Northcoders News is a RESTful API, with a number of endpoints which cover CRUD operations. The endpoints include `users`, `topics`, `articles`, and `comments`. It is a back-end service which provides information to front-end architecture. This api is hosted here:

https://nc-news-u31g.onrender.com/api

**Tech stack**:

- node.js v20.5.0
- express
- PostgreSQL database
- jest and supertest for testing

**Getting started:**

- git clone

  ```
  $ git clone https://github.com/leekarho/be-nc-news.git
  ```

- install dependencies

  ```
  $ npm install
  ```

- to setup the database

  ```
  $ npm run setup-dbs
  ```

- to seed the database

  ```
  $ npm run seed
  ```

- to run tests
  ```
  $ npm test
  ```

**To connect to the databases locally**

- create .env.test file and insert:

  `PGDATABASE=nc_news_test`

- create .env.development file and insert:

  `PGDATABASE=nc_news`

- add these .env files to .gitignore
