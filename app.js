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

// localhost:1111/books/
app.get("/books/", (req, res) => {
  conn.query("SELECT * FROM books", (err, result) => {
    if (err)
    {
      throw err
    }

    res.render("index", { result: result })
  })
})

app.listen(port, () => console.log(`App running on port ${port}`))
