const express = require('express');
const helmet = require("helmet");

const app = express();
app.use(express.json());
app.use(helmet());

const router = require("./routers/index.js")
const PORT = 3000;



app.use("/", router)

app.listen(PORT, () => console.log(`Gateway server running on port ${PORT}`));

