# WELCOME TO CODING NEWS API! 📰 🗞

<h2>Project Summary:</h2>

This projet is a repesentative of a reddit-styled article platform. This project uses SQL queries to create databases that can be interacted with to store, amend, delete and insert data.
The backend was built using; Node.js, Express.js, PostgreSQL and Test-Driven-Development using Jest & Supertest.

You can access the hosted version on Render here: https://coding-news.onrender.com/api

Here you will find all the available endpoints and queries that can be made against the database.

-------------------------------------------------------------

<h2>Set-up Instructions:</h2>

1. Fork & Clone the repo using
```
git clone https://github.com/Josh-Sharples/Back-End-API.git
```

2. You will need to install all the dependencies listed within the package.json file. This can be done using:
```
npm install
```

3. See Environment Variables Section

4. Set-up these databases using:
```
npm run setup-dbs
```

5. Run the pre seeded test suite to ensure everything is set up correctly - using:
```
npm run test
```

6. If you wish to utilise the development database this would need seeding, prior to running any tests - using:
```
npm run seed
```
-------------------------------------------------------------
<h2>Environmant Variables:</h2>

In order to run this API sucessfully, you would need to set up 2 .env. files & the required PGDATABASE's within the files.
This enables you to successfully connect to the two databases locally:

1. .env.development -------------->  PGDATABASE=nc_news
2. .env.test -------------->  PGDATABASE=nc_news_test

These database names can also be found within db/setup.sql and are named accordingly.

Upon completion add these files to the .gitignore file along with the node_modules.

-------------------------------------------------------------

<h2>Minimum requirements:</h2>

Versions of dependencies:

- node: "v20.10.0"
- husky: "^8.0.2",
- jest: "^27.5.1",
- jest-extended: "^2.0.0",
- jest-sorted: "^1.0.14",
- pg-format: "^1.0.4"
- dotenv: "^16.0.0",
- express: "^4.18.2",
- pg: "^8.7.3",
- supertest: "^6.3.4"
