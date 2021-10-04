const { MongoClient } = require('mongodb')

const uri = process.env.DBWEBB_DSN || "mongodb://localhost:27017/editor";

const client = new MongoClient(uri);

async function readDoc(db, col, title) {

    const client = new MongoClient(uri);

    try {

        await client.connect();

        const database = client.db(db);

        const docs = database.collection(col);

        const query = { title: title };
        const options = {
            projection: { _id: 0, title: 1, text: 1 },
        };

        const doc = await docs.findOne(query, options);

        return doc

    } finally {
        await client.close()
    }

}

async function readTitles(db, col) {

    const client = new MongoClient(uri);

    try {
        await client.connect();

        const database = client.db(db);
        const editor = database.collection(col);

        const query = {}

        const options = {
            sort: {title: 1},
            projection: { _id: 0, title: 1}
        }

        const cursor = editor.find(query, options);

        if ((await cursor.count()) === 0) {
            return []
        }

        const res = await cursor.toArray();

        return res

    } finally {
        await client.close()
    }
}


readTitles("editor", "editor")
    .then(res => {
        console.log("readTitles:")
        console.log(res)
    })
    .catch(console.dir);


readDoc("editor", "editor", "Min dagbok")
    .then(res => {
        console.log("readDoc:")
        console.log(res)
    })
    .catch(console.dir)
