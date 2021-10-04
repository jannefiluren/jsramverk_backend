const express = require("express")
const bodyParser = require("body-parser")
const morgan = require("morgan")
const cors = require("cors")
const database = require("./db/database")

const app = express()
const port = process.env.PORT || 1337;

app.use(cors())
app.use(bodyParser.json())

if (process.env.NODE_ENV !== "test") {
    app.use(morgan("combined"));
}

app.get("/", (req, res) => {
    res.send("Editor backend...")
})

app.get("/all_titles", (req, res) => {

    database.readTitles("editor", "editor")
        .then(data => {
            res.json(data)
        })
        .catch(() => {
            res.json({
                msg: "Could not retrieve titles"
            })
        });

})

app.get("/read_doc/:title", (req, res) => {

    database.readDoc("editor", "editor", req.params.title)
        .then(data => {
            res.json(data)
        })
        .catch(() => [
            res.json({
                msg: "Could not read the requested doc"
            })
        ])

})


app.post("/update_doc", (req, res) => {

    const body = req.body;

    database.updateDoc("editor", "editor", {
        docId: body["docId"],
        docTitle: body["docTitle"],
        docText: body["docText"]
    })
        .then(() => {
            console.log("Success")
        })
        .catch(() => {
            console.error("Failure")
        })

})


app.post("/insert_doc", (req, res) => {

    const body = req.body;

    database.insertDoc("editor", "editor", body["title"])
        .then(() => {
            console.log("Success")
        })
        .catch(() => {
            console.error("Failure")
        })

})


app.use((req, res, next) => {
    let err = new Error("Not found");
    err.status = 404;
    next(err);
})

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})
