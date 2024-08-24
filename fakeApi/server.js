const express = require('express');
const axios = require("axios");

const app = express();

app.use(express.json());

const PORT = 3030;
const HOST = "localhost";
const PROTOCOL = "http";

const apiGatewayUrl = `http://localhost:3000`

app.get("/fakeRoute1", (_, res) => {
    res.send("fakeRoute1 called from the FAKE API!");
})

app.get("/fakeRoute2", (_, res) => {
    res.send("fakeRoute2 called from the FAKE API!");
})

app.listen(PORT, () => {
    // register api in the gateway server for the first time the server starts
    axios(
        {
            method: "POST",
            url: apiGatewayUrl + "/registry",
            headers: {
                "Content-Type": "application/json"
            },
            data: {
                apiName: "fakeApi",
                protocol: PROTOCOL,
                host: HOST,
                port: PORT,
            }
        }
    ).then((response) => {
        console.log("====> api registered in the gateway");
        console.log("====> " + response.data);
        
    }).catch((error) => {
        console.log(" ERROR ====> " + error);
    });
    console.log(`Listening to the FAKE API on port ${PORT}`)
});