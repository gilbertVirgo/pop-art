require("dotenv").config();

const express = require('express');
const app = express();

const fileUpload = require("express-fileupload");
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
}));


app.use(express.json()); 

// Middleware
const path = require('path');
app.use(express.static(path.join(__dirname, 'build')));

// Routes
app.use("/filter", require("./router"));

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(process.env.PORT, () => console.log(`Hosting React App on ${process.env.PORT}`));