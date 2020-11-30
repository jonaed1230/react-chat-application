const path = require('path')
const express = require('express')
const cors = require('cors');
module.exports = (app) => {
  app.use(express.static("./client/build"));

  app.use(cors());

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "..", "client", "build", "index.html"));
  });
  app.use(express.static(path.join(__dirname, '..','client','build')));
}