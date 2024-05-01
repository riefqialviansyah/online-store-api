# README

- This REST API use for online store mobile phone.

## How to use

- `git clone https://github.com/riefqialviansyah/online-store-api.git`
- `cd online-store-api`
- `npm i` will install package
- setup your username and password for postgresSQL in file /config/config.json

- `npm run db` will create db in postgres
- `npm run setup` will migrate table and seeding data to database
- `npm run start` api will running at port 3000
- for any endpoint in this API you can see in the API Docs file

## How to run test

- make sure you already clone the repository and install dependency
- `npx sequelize db:create --version=test` for create database
- `npx sequelize db:migrate -- version=test` migrate table to database
- run test using command `npm run test`
