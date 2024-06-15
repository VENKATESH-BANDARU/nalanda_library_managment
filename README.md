# Nalanda Library Management System

Nalanda is a library management system backend designed and implemented using Node.js, Express, and MongoDB. It provides RESTful and GraphQL APIs for managing users, books, and borrowing records.

## Features

### User Management:

* User Registration: Register with name, email, and password.
* User Login: Log in using email and password.
* User Roles: Admin and Member roles with different access levels.

### Book Management:

* Add Book: Admins can add new books with details like title, author, ISBN, publication date, genre, and number of copies.
* Update Book: Admins can update book details.
* Delete Book: Admins can delete a book from the library.
* List Books: All users can view the list of books with pagination and filtering options (e.g., by genre, author).


### Borrowing System:

* Borrow Book: Members can borrow a book if it's available.
* Return Book: Members can return a borrowed book.
* Borrow History: Members can view their borrowing history.

### Reports and Aggregations:

* Most Borrowed Books: Generate a report of the most borrowed books.
* Active Members: List the most active members based on borrowing history.
* Book Availability: Provide a summary report of book availability (total books, borrowed books, available books).

## Installation and Setup

1.Clone the repository:

git clone [https://github.com/VENKATESH-BANDARU/nalanda_project.git](https://github.com/VENKATESH-BANDARU/nalanda_project.git) to clone the code from git repository.

2.Install dependencies:

`cd nalanda_project`

`npm install`

3.Start the server:

`npm start`

## Technologies Used
* Node.js
* Express
* MongoDB
* GraphQL

## Github reporistory

https://github.com/VENKATESH-BANDARU/nalanda_project