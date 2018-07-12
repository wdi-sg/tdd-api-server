# An Introduction to Test-Driven Web Development

This exercise contains 10 tests. Your goal is to get each test to pass, _1 by 1_.
You will need your fibonacci-number calculating function from a previous morning exercise at https://github.com/wdi-sg/fibonacci-numbers.

## Instructions
1. Fork and clone this repository.
2. Run `npm install` to install all required dependencies.
3. Run `psql -f tables.sql` to initialize the database.
4. Edit `db.js` and update the database settings for the server.
5. Run `npm test` to start the tests. Observe the description of the test that failed. It will describe your next goal.
6. Edit `index.js`, adding the necessary route(s) or function(s) to make the last failing test pass.
7. Once you're satisfied that your code will pass the test, run `npm test` again to verify that the test does indeed pass.
8. Inspect your code after the test passes and see if any refactoring can be done.
9. Run `npm test` once more to get the next test.

## Further
1. Inspect `__tests__/index.test.js` and study how the test functions are written.
2. Write a test case for getting the nth fibonacci number via `/api/v1/fibonacci/:n`, and get it to pass.

## Furtherer
1. Write test cases for a POST request to `/api/v1/fibonacci` that...
    a. stores a number in the fibonacci database (check that it's really in the database, then delete it after the test!)
    b. rejects the number if it is not a fibonacci number (e.g. 4 is not a fibonacci number)

## Furtherest
1. Write a test case for a PUT request to `/api/v1/fibonacci/:n` that changes the nth fibonacci number, and get it to pass. Make sure to change the number back after each test!
2. Write a test case for a DELETE request to `/api/v1/fibonacci/:n` that deletes the nth fibonacci number, and get it to pass. You will have to reinitialize the database after each test.