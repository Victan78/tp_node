import express from 'express';
import mongoose from 'mongoose';
import Cors from 'cors';
import expressFileUpload from 'express-fileupload';
import fs from 'fs';
import path from 'path';
import Messages from './dbMessages.js';
import Pusher from 'pusher';
import Image from './dbImage.js';


//App Config
const app = express()
// const port = process.env.PORT || 9000
const port = process.env.PORT || 10000
// const username = process.env.DB_USERNAME;
// const password = process.env.DB_PASSWORD;
// const cluster = process.env.DB_CLUSTER;
// const dbname = process.env.DB_NAME;
// const connection_url = `mongodb://${username}:${password}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority`;
const connection_url = 'mongodb+srv://admin:eGvxKeD3LJGUC02F@cluster0.ew283.mongodb.net/messagingDB?retryWrites=true&w=majority'

const pusher = new Pusher({
    // appId: process.env.APPID,
    // key: process.env.PUSHER_KEY,
    // secret: process.env.PUSHER_SECRET,
    appId: "1174251",
    key: "9e297c1b3f7413a26cce",
    secret: "b74358159f5ad1c8b976",
    cluster: "ap2",
    useTLS: true
});

//Middleware
app.use(express.json())
app.use(Cors())
app.use(expressFileUpload())
//DB Config
mongoose.connect(connection_url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

//API Endpoints
const db = mongoose.connection
db.once("open", () => {
    console.log("DB Connected")
    const msgCollection = db.collection("messagingmessages")
    const changeStream = msgCollection.watch()

    changeStream.on('change', change => {
        console.log(change)

        if(change.operationType === "insert") {
            const messageDetails = change.fullDocument
            pusher.trigger("messages", "inserted", {
                name: messageDetails.name,
                message: messageDetails.message,
                timestamp: messageDetails.timestamp,
                received: messageDetails.received
            })
        } else {
            console.log('Error trigerring Pusher')
        }
    })
})

app.get("/", (req, res) => res.status(200).send("Hello TheWebDev"))

app.post('/messages/new', (req, res) => {
    const dbMessage = req.body
    Messages.create(dbMessage, (err, data) => {
        if(err)
            res.status(500).send(err)
        else
            res.status(201).send(data)
    })
})

app.get('/messages/sync', (req, res) => {
    Messages.find((err, data) => {
        if(err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(data)
        }
    })
})


app.post('/messages/upload-image', (req, res) => {
    try {
        const { file } = req.files;

        if (!file) {
            return res.status(400).json({ msg: 'Aucun fichier n\'a été téléchargé.' });
        }

        // Code pour enregistrer l'image dans la base de données
        const image = new Image({
            name: file.name,
            data: file.data,
            contentType: file.mimetype
        });

        image.save((err, savedImage) => {
            if (err) {
                return res.status(500).json({ msg: 'Une erreur s\'est produite lors de l\'enregistrement de l\'image.' });
            }

            res.status(201).json({ msg: 'L\'image a été enregistrée avec succès.' });
        });
    } catch (err) {
        res.status(500).json({ msg: 'Une erreur s\'est produite lors de l\'upload de l\'image.' });
    }
});

app.get('/messages/sync/:name', (req, res) => {
    const name = req.params.name
    //enlever les % dans le nom
    const name2 = name.replace(/%20/g, " ")
    Messages.find({name: name2}, (err, data) => {
        if(err){
            res.status(500).send(err)
        }
        else{
            res.status(200).send(data)
        }
    })

}
)



//Listener
app.listen(port, () => console.log(`Listening on localhost: ${port}`))
