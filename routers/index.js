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

    // for now, will get the first api in the registry for safety
    const url = new URL(path, registry.services[apiName][0].url).toString();    

    axios({
        method: req.method,
        url: url,
        headers: req.headers,
        data: req.body
    })
    .then((response) => {
        res.send(response.data);
    })
    .catch((error) => {
        const statueCode = error?.response?.status || 500;
        res.status(statueCode).send(error);
    })
    
});

router.post("/registry", (req, res) => {
    const {apiName, host, port, protocol} = req.body;
    if (!apiName || !host || !port || ! protocol) {
        return res.status(400).send("apiName, host, port, and  protocol are required");
    };

    const url = new URL(`${protocol}://${host}:${port}`).toString();

    const newApi = {
            apiName,
            host,
            protocol,
            port,
            url,
        }

    if (registry.services[apiName]) {

        // check if the api already exists in the registry
        const existingApi = registry.services[apiName].find((api) => api.url === url);
        if (existingApi) {
            return res.send("api already registered for " + apiName);
        }

        registry.services[apiName].push(newApi)
    } else {
        registry.services = {
            [apiName]: [ newApi ]
        };
    }

    
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