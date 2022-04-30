const path = require('path')
const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const srcPath = path.join(__dirname, '..', '')
const port = process.env.PORT || 3001
const cors = require('cors')

app.use(cors())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


app.use(express.static(srcPath));
app.use(express.urlencoded());

app.use("/", require("./routes/musicRoute"))

app.listen(port, () => {
    console.log(`Server is up! ${port}`);
});