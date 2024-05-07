
## Description
<h1>RSForms Backend</h1>
Welcome to the RSForms Backend repository! This project is a robust and feature-rich backend service built with NestJS, a progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
`

<h2>Real-Time Communication</h2>
At the heart of this application is real-time communication, powered by Socket.IO. This enables instantaneous, bidirectional communication between the server and the Flutter RSForms app, ensuring a seamless and interactive user experience.

<h2>Security</h2>
Security is a top priority in this project. We leverage Firebase middleware to secure our websockets. This ensures that every connection established is authenticated and authorized, providing a secure environment for data transmission.

<h2>Database Management</h2>
For managing and interacting with our PostgreSQL database, we use TypeORM. TypeORM is a powerful Object-Relational Mapping (ORM) tool that provides a simple and efficient way to manage data in our PostgreSQL database. It allows us to work with database entities as if they were JavaScript objects, making it easier to create, retrieve, update, and delete records.

<h2>Conclusion</h2>
This NestJS application serves as a solid foundation for the Flutter RSForms app, providing real-time communication, robust security, and efficient database management. We hope you find this repository useful and informative as you explore the codebase and its features.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
