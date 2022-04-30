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

let gfs;
//init gfs
conn.once('open', () =>{
    gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'music'
    })
    gfs = Grid(conn.db,mongoose.mongo);
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
const upload = multer({ storage, limits: {fileSize: "50mb"} });





router.route("/music").post( upload.single("sound"),(req,res) =>{
    res.json({ file: req.file });
})

router.route("/music").get( (req,res) =>{
    gfs.files.find().sort({"uploadDate" :-1}).limit(50).toArray((err,files)=>{
        if(!files || files.length===0){
            return res.status(404).json({err:"no files"})
        }
        return res.json({files})
    })

router.route('/music/:filename').get((req, res) => {
        gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
            // Check if file exist
            if (!file || file.length === 0) {
                return res.status(404).json({
                    err: 'No file exists'
                });
            }

            // Check if a music file
            console.log(file.contentType)
            if (file.contentType === 'audio/mpeg' || file.contentType === 'audio/wave') {
                const readStream =  gridfsBucket.openDownloadStream(file._id);
                readStream.pipe(res);
            } else {
                res.status(404).json({
                    err: 'Not an image'
                });
            }
        });
    });
})

module.exports = router

