const mongo = require("mongodb").MongoClient;

const dsn = process.env.DBWEBB_DSN || "mongodb://localhost:27017/editor";

(async () => {
    let res = await findInCollection(dsn, "editor");

    console.log(res)
})();

async function findInCollection(dsn, colName) {
    const client  = await mongo.connect(dsn);
    const db = await client.db();
    const col = await db.collection(colName);
    const res = await col.find().toArray();

    await client.close();

    return res;
}
