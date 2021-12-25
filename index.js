const express = require('express')
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const cors = require('cors');
const port = 5000

//Middleware
app.use(cors());
app.use(express.json());

//database connect 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.w2qch.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


//node mongodb connections
async function run() {
    try {
        await client.connect();
        // console.log("connected to database");
        const database = client.db("eShop");
        const productsCollection = database.collection("products");
        // create a document to insert
        //   const doc = {
        //     title: "Record of a Shriveled Datum",
        //     content: "No bytes, no problem. Just insert a document, in MongoDB",
        //   }

        //Post Api Methods
        app.post("/products",async(req,res)=>{
            const product = req.body;
            console.log("hit the post api",product);

            const result = await productsCollection.insertOne(product);
            console.log(result);
            res.json(result);
        
        })

        //Get api load all products
        app.get("/products",async(req,res)=>{
            const cursor = productsCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        })

        //Get api load single data
        app.get("/products/:id",async(req,res)=>{
            const id = req.params.id;
            const query = {_id : ObjectId(id)};
            const result = await productsCollection.findOne(query);
            res.send(result);
        })

      
    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello eShop server!')
})

app.listen(port, () => {
    console.log(`eShop-redux server listening at http://localhost:${port}`)
})