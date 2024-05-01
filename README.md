# README

- This REST API use for online store mobile phone.
- Create by Riefqi Alviansyah

## How to use

- `git clone https://github.com/riefqialviansyah/online-store-api.git`
- `cd online-store-api` enter project folder
- `npm i` will install package
- create file .env and copy data from .env-example
- setup your username, password, database name, and dialect for postgresSQL in file `/config/config.json`
- `npm run db` will create db in postgres
- `npm run setup` will migrate table and seeding dummy data to database
- `npm run start` api will running at port 3000
- for any endpoint in this API you can see in the API Docs file

## How to run test

- make sure you already clone the repository and install dependency
- `npx sequelize db:create --env=test` for create database
- `npx sequelize db:migrate --env=test` migrate table to database
- run test using command `npm run test`

## Testing result

![alt text](testing%20result%20-%20api%20-%20new.jpg)

## ERD

![alt text](api-10xers%20Labs%20new.jpg)
