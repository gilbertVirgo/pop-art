require("dotenv").config();

const express = require('express');
const app = express();

const fileUpload = require("express-fileupload");
app.use(fileUpload({
  limits: { fileSize: +process.env.MAX_UPLOAD_SIZE * 1024 * 1024 },
  useTempFiles : true,
  tempFileDir : './tmp/'
}));


app.use(express.json()); 

// Middleware
const path = require('path');
app.use(express.static(path.join(__dirname, 'build')));

// Routes
app.use("/api/v1/filter", require("./backend/v1/router"));
app.use("/api/v2/filter", require("./backend/v2/router"));

app.get("/images/:id/:index", async ({params: {id, index}}, res) => {
  //const check = str => !!str.match(/^[a-z0-9]+$/i);
  const check = str => !str.includes("..");

  if(check(id) && check(index)) res.sendFile(path.join(__dirname, "tmp", id, index));
  else res.status(400).json({success: false, error: "Invalid file path"});
})

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(process.env.PORT, () => console.log(`Hosting React App on ${process.env.PORT}`));