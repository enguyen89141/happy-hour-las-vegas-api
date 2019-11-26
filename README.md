# Happy Hour API

* This is the backend API for my [Happy Hour Las Vegas App](https://happy-hour-las-vegas-app.enguyen89141.now.sh/)

## Summary

* This tested API communicates with my [client side application](https://github.com/enguyen89141/happy-hour-las-vegas-app) to populate the deals, create user accounts, and allow comments all to be added to the database. 

* The technology used in this API include Express, Node.js, and PostgreSQL and for the testing I utilized Chai and Supertest.

### Endpoints - These are the main endpoints utilized in my application. Other endpoints are for testing and future functionality.

* Deals: /api/deals <br>
Accesses the different happy hour deals in the backend to be viewed on the client side
* Details: /api/:dealid <br>
Accesses the details page of each individual deal
* Users: /api/deals <br>
Accesses the user database that uses JWT authentication and hashing to encrpyt passwords
* Commments /api/:dealid/comments <br>
Accesses the comments specific to each indiivual deal page


# Express Boilerplate!

This is a boilerplate project used for starting new projects!

## Set up

Complete the following steps to start a new project (NEW-PROJECT-NAME):

1. Clone this repository to your local machine `git clone BOILERPLATE-URL NEW-PROJECTS-NAME`
2. `cd` into the cloned repository
3. Make a fresh start of the git history for this project with `rm -rf .git && git init`
4. Install the node dependencies `npm install`
5. Move the example Environment file to `.env` that will be ignored by git and read by the express server `mv example.env .env`
6. Edit the contents of the `package.json` to use NEW-PROJECT-NAME instead of `"name": "express-boilerplate",`

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`

## Deploying

When your new project is ready for deployment, add a new Heroku application with `heroku create`. This will make a new git remote called "heroku" and you can then `npm run deploy` which will push to this remote's master branch.
