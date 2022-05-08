const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.artl0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
        try{
            await client.connect();
            const productCollection = client.db('appleProduct').collection("productList");
            const eventCollection = client.db("appleProduct").collection("events");
            const productListCollection = client.db("appleProduct").collection("productList");

            app.get('/inventorypage', async(req, res) =>{
                const query ={};
                const cursor = productCollection.find(query);
                const products = await cursor.toArray();
                res.send(products);
            })

            app.get('/inventorypage', async (req, res) =>{
                const query = req.query;
                const cursor = productCollection.find(query);
                const products = await cursor.toArray();
                res.send(products);
            })

            app.get('/inventorypage/:id', async(req, res) =>{
                const id = req.params.id;
                const query = {_id: ObjectId(id)};
                const product = await productCollection.findOne(query);
                res.send(product);
            })

            app.post('/inventorypage', async (req, res) =>{
                const newItem = req.body;
                const result = await productCollection.insertOne(newItem);
                res.send(result);
            })

            app.delete('/inventorypage/:id', async (req, res) =>{
                const id  = req.params.id;
                const query = {_id: ObjectId(id)};
                const result = productCollection.deleteOne(query);
                res.send(result);
            })

            app.put('/inventorypage/:id', async (req, res) =>{
                const id = req.params.id;
                const updateInventory = req.body;
                const filter = {_id: ObjectId(id)};
                const options = {upsert: true};
                const updateQty = {
                    $set: {
                        "quantity": updateInventory.quantity
                    }
                };
                const result = await productCollection.updateOne(filter, updateQty, options);
                // console.log(result);
                res.json(result);
            })


        }
        finally{}
}
run().catch(console.dir);


app.get('/', (req, res) =>{
    res.send('laptop house is running')
});

app.listen(port, () =>{
    console.log('laptop is running', port)
})