require('dotenv').config();

const express = require('express');
const helmet = require("helmet");
const bcrypt = require('bcrypt');

const basicAuth = require("./middlewares/basicAuth");

const app = express();
app.use(express.json());
app.use(helmet());

const router = require("./routers/index.js")
const PORT = 3000;

app.use(basicAuth);
app.use("/", router)

app.listen(PORT, () => console.log(`Gateway server running on port ${PORT}`));

