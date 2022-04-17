const path = require('path')
const express = require("express")
const router = express.Router()
const crypto = require("crypto")
const mongoose = require("mongoose")
const multer = require("multer")
const {GridFsStorage} = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');

const mongoPass = "nO30J8WXeQokhrec"
const mongoURI = `mongodb+srv://stav:${mongoPass}@cluster0.uj18p.mongodb.net/music_brecelet`



const conn = mongoose.createConnection(process.env.MONGODB_URI || mongoURI)


//init gfs
conn.once('open', () =>{
    const gfs = Grid(conn.db,mongoose.mongo);
    gfs.collection('music')
} )

// Create storage engine
const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'music'
                };
                resolve(fileInfo);
            });
        });
    }
});
const upload = multer({ storage });





router.route("/music").post( upload.single("sound"),(req,res) =>{
    console.log(req.file)
})

router.route("/music").get( (req,res) =>{
    console.log("hello")
})

module.exports = router

