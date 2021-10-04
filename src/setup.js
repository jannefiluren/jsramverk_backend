const mongo = require("mongodb").MongoClient;

const config = require("../config.json");

let dsn = `mongodb+srv://${config.username}:${config.password}@cluster0.bjqhb.mongodb.net/editor?retryWrites=true&w=majority`;

const fs = require("fs");
const path = require("path");
const docs = JSON.parse(fs.readFileSync(
    path.resolve(__dirname, "setup.json"),
    "utf8")
)

resetCollection(dsn, "editor", docs)
    .catch(err => console.log(err));

async function resetCollection(dsn, colName, doc) {
    const client = await mongo.connect(dsn);
    const db = await client.db();
    const col = await db.collection(colName);

    await col.deleteMany();
    await col.insertMany(doc);

    await client.close();

    console.log(`Inserted the following content into collection ${colName}`)
    console.log(docs)
}
