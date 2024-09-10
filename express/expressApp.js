require("dotenv").config();
const express = require("express");
const kafka = require("./routes/kafka.js");
const app = express();

const cors = require('cors');
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use("/api", kafka);

module.exports = app;
