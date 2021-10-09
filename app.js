const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const bodyParser = require('body-parser');
const database = require("./db/database")

const app = express()
const port = process.env.PORT || 1337;

app.use(cors())
app.use(bodyParser.json())

if (process.env.NODE_ENV !== "test") {
    app.use(morgan("combined"));
}

app.get("/", (req, res) => res.send("Editor backend..."))

app.get("/all_titles", 
    (req, res) => database.readTitles(req, res)
)

app.get("/read_doc/:title",
    (req, res) => database.readDoc(req, res)
)

app.post("/update_doc", (req, res) =>
    database.updateDoc(req, res)
)

app.post("/insert_doc", (req, res) =>
    database.insertDoc(req, res)
)

app.use((req, res, next) => {
    let err = new Error("Not found");
    err.status = 404;
    next(err);
})

const server = app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})

module.exports = server;
