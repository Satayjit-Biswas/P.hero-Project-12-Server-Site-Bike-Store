const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require ('dotenv').config();

const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a744t.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        console.log('Connected to database')
        const database = client.db("BikeStore");
        const userCollection  = database.collection("user");
        const productCollection  = database.collection("product");
        const reviewCollection  = database.collection("review");
        const orderCollection = database.collection("order");
        // add user
        app.post('/user', async(req,res) => {
            const user = req.body;
            console.log(req.body);
            const result = await userCollection.insertOne(user);
            console.log(result);
            res.json('post user description')
        })
        // get user
        app.get('/user', async(req,res)=>{
            const cursor = userCollection.find({});
            const getuser = await cursor.toArray();
            res.send(getuser);
        })
        // get Single user 
        app.get('/user/:email', async(req,res)=>{
            const email = req.params.email;
            const query = {email:email}
            const service = await userCollection.findOne(query);
            res.json(service);
        });
        // order Update
        app.put('/user',async(req,res)=>{
            const makeadmin = req.body;
            const find = { email: makeadmin.email}
            const checkemail = await userCollection.findOne(find);
            if(checkemail){
                const updatedoc = {
                    $set:{
                        role:'admin'
                    },
                };
                const result = await userCollection.updateOne(find, updatedoc);
                res.json(result);
            }else{
                res.json({status:404})
            }
            
        })
        // add product
        app.post('/product', async(req,res) => {
            const product = req.body;
            console.log(req.body);
            const result = await productCollection.insertOne(product);
            console.log(result);
            res.json('post user description')
        })
        // get product
        app.get('/product', async(req,res)=>{
            const cursor = productCollection.find({});
            const getproduct = await cursor.toArray();
            res.send(getproduct);
        })
        // get Single product 
        app.get('/product/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)}
            const getSingleproduct = await productCollection.findOne(query);
            res.json(getSingleproduct);
        });
        // order delete
        app.delete('/product/:id',async(req,res)=>{
            const id = req.params.id;
            console.log('product delete id ',id)
            const query = { _id: ObjectId(id)}
            const result = await productCollection.deleteOne(query);
            res.json(result);
        })
        // add user review
        app.post('/review', async(req,res) => {
            const review = req.body;
            console.log(req.body);
            const result = await reviewCollection.insertOne(review);
            console.log(result);
            res.json('post user review description')
        })
        // get user review
        app.get('/review', async(req,res)=>{
            const reviewCursor = reviewCollection.find({});
            const getreview = await reviewCursor.toArray();
            res.send(getreview);
        })
        // add order
        app.post('/order', async(req,res) => {
            const order = req.body;
            console.log(req.body);
            const result = await orderCollection.insertOne(order);
            console.log(result);
            res.json('post user description')
        })
        // get order
        app.get('/order', async(req,res)=>{
            const cursor = orderCollection.find({});
            const getuser = await cursor.toArray();
            res.send(getuser);
        })
        // get Single order 
        app.get('/order/:email', async(req,res)=>{
            const email = req.params.email;
            const query = {email:email}
            const service = await orderCollection.findOne(query);
            res.json(service);
        }); 
        // order delete
        app.delete('/order/:id',async(req,res)=>{
            const id = req.params.id;
            console.log('order delete id ',id)
            const query = { _id: ObjectId(id)}
            const result = await orderCollection.deleteOne(query);
            res.json(result);
        })
         // order Update
        app.put('/order/:id',async(req,res)=>{
            const id = req.params.id;
            const updateOrder = req.body;
            console.log('order Stage Update id ',updateOrder)
            const options = {upsert:true};
            const find = { _id: ObjectId(id)}
            const updatedoc = {
                $set:{
                    status:updateOrder.status
                },
            };
            const result = await orderCollection.updateOne(find, updatedoc,options);
            res.json(result);
        })
    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('Running Bike-Store Server')
});

app.listen(port,()=>{
    console.log('Bike-Store Server port', port);
})