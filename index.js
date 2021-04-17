const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = 5000 || process.env.PORT;
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.54hym.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Phone Repair App server!')
})



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const servicesCollection = client.db("phoneRepairApp").collection("services");
  const adminCollection = client.db("phoneRepairApp").collection("admin");

  app.post('/addService', (req, res) => {
      const service = req.body;
      servicesCollection.insertOne(service)
      .then(result => res.send(result.insertedCount > 0))
  })
  app.post('/makeAdmin', (req, res) => {
      const admin = req.body;
      adminCollection.insertOne(admin)
      .then(result => res.send(result.insertedCount > 0))
  })

  app.get('/services', (req, res) => {
      servicesCollection.find({})
      .toArray((err, services) => res.send(services))
  })

});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})