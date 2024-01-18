# Northcoders News API

Northcoders News is a RESTful API. It is a back-end service which provides information to front-end architecture.

`https://nc-news-u31g.onrender.com/api`

**Tech stack**:

- node.js
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

- setup the database

  ```
  $ npm run setup-dbs
  ```

- seed the database

  ```
  $ npm run seed
  ```

**To set the database**

- create .env.test file and insert:

  `PGDATABASE=nc_news_test`

- create .env.development file and insert:

  `PGDATABASE=nc_news`

- add these .env files to .gitignore
