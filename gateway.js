const express = require('express');
const app = express();

const router = require("./routers/index.js")
const PORT = 3000;

app.use(express.json());


app.use("/", router)

app.listen(PORT, () => console.log(`Gateway server running on port ${PORT}`));

