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

