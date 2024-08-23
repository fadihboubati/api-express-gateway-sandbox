const express = require('express');

const app = express();


app.use(express.json());

const PORT = 3001;

app.get("/fakeApi", (_, res) => {
    res.send("Hello from the FAKE API server!");
})

app.post("/bogus", (_, res) => {
    res.send("bogus response!");
})

app.listen(PORT, () => console.log(`Listening to the FAKE API on port ${PORT}`));