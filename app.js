const express = require("express")
const mysql = require("mysql")
const bodyParser = require("body-parser")
const path = require("path")
const port = process.env.port || 1112
const app = express()

//  Add middleware
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//  Set up database info
const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "books_db",
})

//  Attempt to connect to MySQL
conn.connect((err) => {
  if (!err) {
    console.log("Connected to books_db database!")
  } else {
    console.log("Error connecting to books_db database")
  }
})

//  Define routes
app.get("/", (req, res) => res.send("Hello World"))

// localhost:1112/books/
app.get("/books/", (req, res) => {
  conn.query("SELECT * FROM books", (err, result) => {
    if (err) {
      throw err
    }

    res.render("index", { result: result })
  })
})

// localhost:1112/books/delete
app.post("/books/delete", (req, res) => {
  const id = req.body.id
  const query = "DELETE FROM books WHERE _id=?"
  conn.query(query, [id], (err, result) => {
    console.log(`Record with id ${id} removed`)
    conn.query("SELECT * FROM books", (err, result) => {
      res.render("index", { result: result })
    })
  })
})

app.get("/books/create", (req, res) => res.render("create"))

app.post("/books/insert", (req, res) => {
  //  Auto-generated id
  const id = req.body._id

  //  Form fields
  const title = req.body.title
  const author = req.body.author
  const publisher = req.body.publisher
  const edition = req.body.edition
  const year = req.body.year
  const category = req.body.category
  const isbn = req.body.isbn
  const rating = req.body.rating

  //  Set up string for query
  const query =
    "INSERT INTO books (title, author, publisher, edition, year, category, isbn, rating) VALUES ?"

  //  Set up values array
  const values = [
    [title, author, publisher, edition, year, category, isbn, rating],
  ]

  //  Run query
  conn.query(query, [values], (err, result) => {
    conn.query("SELECT * FROM books", (err, result) => {
      res.render("index", { result: result })
    })
  })
})

app.post("/books/edit_employee", (req, res) => {
  const id = req.body.id

  console.log(`In edit_employee routine. The id is: ${id}`)

  const title = req.body.title
  const author = req.body.author
  const publisher = req.body.publisher
  const edition = req.body.edition
  const year = req.body.year
  const category = req.body.category
  const isbn = req.body.isbn
  const rating = req.body.rating

  const query =
    "UPDATE books SET title = ?, author = ?, publisher = ?, edition = ?, year = ?, category = ?, isbn = ?, rating = ? WHERE _id = ?"
  conn.query(
    query,
    [title, author, publisher, edition, year, category, isbn, rating, id],
    (err, result) => {
      console.log(`Record with id ${id} updated!`)
      conn.query("SELECT * FROM books", (err, result) => {
        res.render("index", { result: result })
      })
    }
  )
})

app.listen(port, () => console.log(`App running on port ${port}`))
