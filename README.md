# Northcoders News API

Set up instructions for environment variables:

In order to run this API sucessfully, you would need to locally clone this repo and set up the required PGDATABASE's within .env. files. This enables you to successfully connect to the two databases locally.

In order to create these files you would create 2 fiiles:
1. .env.development
2. .env.test

Within both of these set your PGDATABASE=<databaseNames>

These database names can be found within db/setup.sql and are named accordingly.

Upon completion add these files to the .gitignore file along with the node_modules.
