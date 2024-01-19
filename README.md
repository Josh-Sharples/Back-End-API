# Northcoders News API

Project Summary:

This projet is a repesentative of a reddit-styled article platform. This project uses SQL queries to create databases that can be interacted with to store, amend, delete and insert data.
As you will find from the below link to the hosted application, there are various endpoints that can be input to retreive the data required.
These endpoints additionally have queries that can be made against them to either re-order or filter data within the database.

This project can be reached via the following link: https://coding-news.onrender.com/api

-------------------------------------------------------------

Depending on your requirements:
A fork creates a completely independent copy of Git repository.
A Git clone creates a linked copy that will continue to synchronize with the target repository.

Instructions on how to cloning/forking the repo:

Forking the repo:
1. Locate the fork button within the header.
2. You can change the repo name or add a description to the repo (both are optional).
3. Copy the main branch - this is seleted by default.
4. Then select 'Create fork' - This will redirct you to your own forked repo
5. Here there will be a green button labelled - '<> Code' - this will provide you a URL.
6. This URL can be coppied into the following statement in your code editor - 'git clone <forked_URL>

Cloning the repo:
1. Select the green button labelled - '<> Code' - this will provide you a URL.
2. This URL can be coppied into the following statement in your code editor - 'git clone <clone_URL>

-------------------------------------------------------------

Instructions on dependencies/seeding/running tests:

Required dependencies:

Installation of Jest:
Jest is a JavaScript Testing Framework with a focus on simplicity.
Installation instructions/documentation on usage can be found here: https://jestjs.io/docs/getting-started

Installation of Jest-Sorted:
Jest-Sorted is a packages that extends jest.expect with 2 custom matchers, toBeSorted and toBeSortedBy.
Installation instructions/documentation on usage can be found here: https://www.npmjs.com/package/jest-sorted

Installation of express:
Express is a Fast, unopinionated, minimalist web framework for Node.js.
Installation instructions/documentation on usage can be found here: https://www.npmjs.com/package/express

Installation of pg:
pg is a non-blocking PostgreSQL client for Node.js. Pure JavaScript and optional native libpq bindings.
Installation instructions/documentation on usage can be found here: https://www.npmjs.com/package/pg

Installation of pg-format:
Node.js implementation of PostgreSQL format() to safely create dynamic SQL queries. SQL identifiers and literals are escaped to help prevent SQL injection.
Installation instructions/documentation on usage can be found here: https://www.npmjs.com/package/pg-format?activeTab=readme

Instalation of supertest:
supertest provides a high-level abstraction for testing HTTP, while still allowing you to drop down to the lower-level API provided by superagent.
Installation instructions/documentation on usage can be found here: https://www.npmjs.com/package/supertest

Instalation of dotenv:
Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env.
Installation instructions/documentation on usage can be found here: https://www.npmjs.com/package/dotenv

Seeding:


-------------------------------------------------------------

Set up instructions for environment variables:

In order to run this API sucessfully, you would need to locally clone this repo and set up the required PGDATABASE's within .env. files. This enables you to successfully connect to the two databases locally.

In order to create these files you would create 2 fiiles:
1. .env.development
2. .env.test

Within both of these set your PGDATABASE=<databaseNames>

These database names can be found within db/setup.sql and are named accordingly.

Upon completion add these files to the .gitignore file along with the node_modules.

-------------------------------------------------------------

Minimum requirements to run this project:

Versions of dependencies:

node: "v20.10.0"
husky: "^8.0.2",
jest: "^27.5.1",
jest-extended: "^2.0.0",
jest-sorted: "^1.0.14",
pg-format: "^1.0.4"
dotenv: "^16.0.0",
express: "^4.18.2",
pg: "^8.7.3",
supertest: "^6.3.4"
