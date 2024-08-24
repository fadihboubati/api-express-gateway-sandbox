const express = require("express");
const axios = require("axios");
const registry = require("./registry.json");
const fs = require("fs");

const router = express.Router();


router.all("/:apiName/:path", (req, res) => {
    const {apiName, path} = req.params;
    

    if (!apiName || !path) {
        return res.status(400).send("apiName and path are required");
    }

    if (!registry.services[apiName]) {
        return res.status(404).send("api not found");
    }

    const url = new URL(path, registry.services[apiName].url);

    axios({
        method: req.method,
        url: url.toString(),
        headers: req.headers,
        data: req.body
    })
    .then((response) => {
        res.send(response.data);
    })
    .catch((error) => {
        const statueCode = error.response.status || 500;
        res.status(statueCode).send(error);
    })
    
});

router.post("/registry", (req, res) => {
    const {apiName, host, port, protocol} = req.body;
    if (!apiName || !host || !port || ! protocol) {
        return res.status(400).send("apiName, host, port, and  protocol are required");
    };

    registry.services = {
        [apiName]: {
            apiName,
            host,
            protocol,
            port,
            url : new URL(`${protocol}://${host}:${port}`).toString(),
        }
    };

    
    fs.writeFile("./routers/registry.json", JSON.stringify(registry, null, 2), (err) => {
        if (err) {            
            const errorMessage = `Could not register api for ${apiName} \n ${err?.message || err}`;
            return res.status(500).send(errorMessage);
        } else {            
            res.send("api successfully registered for " + apiName);
        }
    });

});




module.exports = router;