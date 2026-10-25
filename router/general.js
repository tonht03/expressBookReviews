const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({"username":username, "password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify({books: books}, null, 4));
});

public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});
  
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let booksByAuthor = [];
  for (let key in books) {
    if (books[key].author.toLowerCase() === author.toLowerCase()) {
      booksByAuthor.push({"isbn": key, ...books[key]});
    }
  }
  if (booksByAuthor.length > 0) {
    return res.status(200).json({booksbyauthor: booksByAuthor});
  }
  return res.status(404).json({message: "Author not found"});
});

public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let booksByTitle = [];
  for (let key in books) {
    if (books[key].title.toLowerCase() === title.toLowerCase()) {
      booksByTitle.push({"isbn": key, ...books[key]});
    }
  }
  if (booksByTitle.length > 0) {
    return res.status(200).json({booksbytitle: booksByTitle});
  }
  return res.status(404).json({message: "Title not found"});
});

public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }
  return res.status(404).json({message: "Book not found"});
});

// PROMISE / ASYNC-AWAIT TASKS (Task 10-13)
public_users.get('/async/books', function (req, res) {
    let getBooks = new Promise((resolve, reject) => {
        resolve(books);
    });
    getBooks.then((bks) => {
        res.status(200).json(bks);
    }).catch((err) => {
        res.status(500).json({message: "Error fetching books"});
    });
});

public_users.get('/async/isbn/:isbn', function (req, res) {
    let getBookByISBN = new Promise((resolve, reject) => {
        let isbn = req.params.isbn;
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject("Book not found");
        }
    });
    getBookByISBN.then((bk) => {
        res.status(200).json(bk);
    }).catch((err) => {
        res.status(404).json({message: err});
    });
});

public_users.get('/async/author/:author', async function (req, res) {
    try {
        let author = req.params.author;
        let booksByAuthor = [];
        for (let key in books) {
            if (books[key].author.toLowerCase() === author.toLowerCase()) {
                booksByAuthor.push(books[key]);
            }
        }
        if (booksByAuthor.length > 0) {
            res.status(200).json(booksByAuthor);
        } else {
            res.status(404).json({message: "Author not found"});
        }
    } catch (error) {
        res.status(500).json({message: "Error fetching by author"});
    }
});

public_users.get('/async/title/:title', async function (req, res) {
    try {
        let title = req.params.title;
        let booksByTitle = [];
        for (let key in books) {
            if (books[key].title.toLowerCase() === title.toLowerCase()) {
                booksByTitle.push(books[key]);
            }
        }
        if (booksByTitle.length > 0) {
            res.status(200).json(booksByTitle);
        } else {
            res.status(404).json({message: "Title not found"});
        }
    } catch (error) {
        res.status(500).json({message: "Error fetching by title"});
    }
});

module.exports.general = public_users;
