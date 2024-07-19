const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
 return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body;
  if(!username || !password) {
    return res.status(400).json({message: "Username and password are required" });
  }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({username }, "access", {expiresIn:'1h'});
    req.session.authorization = {
      accessToken,
      username
    }
    return res.status(200).json({message: "Login successful", token: accessToken });
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.session.authorization ? jwt.verify(req.session.authorization['accessToken'], "access").username : null;
  if (!username) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  books[isbn].reviews[username] - review;
  return res.status(200).json({message: "Review added/updated", book: books[isbn] });
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization ? jwt.verify(req.session.authorized['accessToken'], "access").username : null;
  if (!username) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (!books[isbn]) {
    return res.status(404).json({message: "Book not found"});
  }
  if (books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    return res.status(200).json({message: "Review delete", book: books[isbn] });
  } else {
    return res.status(404).json({message: "Review not found" });
  }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
