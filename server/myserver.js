//Set all required NPM package for server
const express = require('express');
const router = express.Router();
const app = express();
const mongo = require('mongodb').MongoClient;
const assert = require('assert');
const bodyParser = require('body-parser');
const cors = require('cors');

//Define database and collection in mongodb
const dbName = '';
const collectionName = '';

//URL to connect mongodb
const url = "";

//Allow Cross Origin RESOURCE SHARING
app.use(cors());

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Create PORT for server to receive request from frontend
app.listen(3000,()=>console.log(`listening on port 3000`));

//GET request from client side
app.get(`/get-data`,(req,res)=>{
    const result =[];
    try{
        //Connect mongodb to retrieve all data from collection 'toiletRollLogs'
        mongo.connect(url,{useNewUrlParser:true,useUnifiedTopology:true},(err,client)=>{
            const cursor = client.db(dbName).collection(collectionName).find();
            cursor.each((err,doc)=>{
                assert.equal(null,err);
                if(doc!=null){
                    result.push(doc);
                    console.log(doc);
                }
                if (doc==null) {
                    res.send(JSON.stringify(result));
                    client.close();
                }
            });
            console.log('Connected to MongoDB...');
        });
    } catch(error){console.log(error);}
});

//POST request from client side
app.post(`/send`,(req,res)=>{
    const obj = JSON.parse(req.body.data);

    console.log("Data..."+JSON.stringify(obj));
    console.log("Collection..."+collectionName);

    //Create collection if not exist and write data into the collection
    mongo.connect(url,{useNewUrlParser:true,useUnifiedTopology:true},(err,client)=>{
        assert.equal(null,err);
        const col = client.db(dbName).collection(collectionName);
        col.insertMany(obj,(err,result)=>{
            assert.equal(null,err);
            console.log('Success');
            res.send('success');
            client.close();
        });
    });
});
