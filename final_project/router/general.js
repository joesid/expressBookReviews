const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;
  if(!username || !password) {
    return res.status(400).json({ message: "Username and password are required"});
  }
  if (isValid(username)) {
    return res.status(400).json({message: "Username already exists" });
  }
  users.push({ username, password});
 return res.status(200).json({ message: "User registered successfully"});
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop using async-await and Axios
public_users.get('/', async function (req, res) {
  //Write your code here
   try {
    const response = await axios.get('http://localhost:5000/internal/books');
    return res.status(200).json(response.data);
   } catch(error) {
    return res.status(500).json({ message: "Error fetching books", error: error.message})
   }
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`http://localhost:5000/internal/books/${isbn}`);
    if (response.data) {
      return res.status(200).json(response.data);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book details", error: error.message });
  }
});

/* public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
  //return res.status(300).json({message: "Yet to be implemented"});
 }); */
  
// Get book details based on author (using Async-await and Axios task12)
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author.toLowerCase();
  try {
    const response = await axios.get(`http://localhost:5000/internal/authors/${author}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by author", error: error.message });
  }
});

// Get all books based on title (using Async-await and Axios task13)
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title.toLowerCase();
  try {
    const response = await axios.get(`http://localhost:5000/internal/titles/${title}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by title", error: error.message });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
