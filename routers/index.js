const express = require("express");
const axios = require("axios");
const registry = require("./registry.json");
const fs = require("fs");
const loadBalancer = require("../util/loadBalancer");

const router = express.Router();

router.post("/services/:apiName/toggle", (req, res) => {
    const { apiName } = req.params;
    const { url, enabled } = req.body;

    const service = registry.services[apiName];

    if (!service) {
        return res.status(404).send("API not found");
    }

    const instance = service.instances.find(inst => inst.url === url);

    if (!instance) {
        return res.status(404).send("Instance not found");
    }

    // Update the enabled status of the instance
    instance.enabled = enabled;

    // Write the updated registry to the registry.json file
    fs.writeFile("./routers/registry.json", JSON.stringify(registry, null, 2), (err) => {
        if (err) {            
            return res.status(500).send("Error updating registry file.");
        }
        
        res.send(`Instance at ${url} is now ${enabled ? "enabled" : "disabled"}.`);
    });

});

router.all("/:apiName/:path", (req, res) => {
    const {apiName, path} = req.params;
    

    if (!apiName || !path) {
        return res.status(400).send("apiName and path are required");
    }

    // Get the services from the registry
    const service = registry.services[apiName];

    if (!service) {
        return res.status(404).send("API not found");
    }

    if (!service.loadBalancerStrategy)
    {

    }
    // Select the current instance using round-robin strategy
    const instanceIndex = loadBalancer[service.loadBalancerStrategy](service);
    const instance = service.instances[instanceIndex];

    const url = new URL(path, instance.url).toString();

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
    const {apiName, host, port, protocol, loadBalancerStrategy = "ROUND_ROBIN"} = req.body;
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
        const existingApi = registry.services[apiName].instances.find((api) => api.url === url);
        if (existingApi) {
            return res.send("API already registered for " + apiName);
        }

        registry.services[apiName].instances.push(newApi)
    } else {
        registry.services = {
            loadBalancerStrategy,
            index: 0,
            instances: [newApi]
        };
    }

    
    fs.writeFile("./routers/registry.json", JSON.stringify(registry, null, 2), (err) => {
        if (err) {            
            const errorMessage = `Could not register API for ${apiName} \n ${err?.message || err}`;
            return res.status(500).send(errorMessage);
        } else {            
            res.send("API successfully registered for " + apiName);
        }
    });

});

router.post("/unregister", (req, res) => {
    const {apiName, host, port, protocol} = req.body;
    if (!apiName || !host || !port || ! protocol) {
        return res.status(400).send("apiName, host, port, and  protocol are required");
    };

    const url = new URL(`${protocol}://${host}:${port}`).toString();

    if (!registry.services[apiName]) {
        return res.send("API not registered for " + apiName);
    }

    const service = registry.services[apiName];
    const instanceIndex = service.instances.findIndex((instance) => instance.url === url);

    if (instanceIndex === -1) {
        return res.status(404).send("API instance not found for " + apiName);
    }


    // Remove the instance
    service.instances.splice(instanceIndex, 1);

    // If no instances are left, remove the service
    if (service.instances.length === 0) {
        delete registry.services[apiName];
    } else {
        // Update the index for load balancing
        if (service.index >= service.instances.length) {
            service.index = 0; // Reset index if it points to a non-existing instance
        }
    }
    
    fs.writeFile("./routers/registry.json", JSON.stringify(registry, null, 2), (err) => {
        if (err) {            
            const errorMessage = `Could not unregister API for ${apiName} \n ${err?.message || err}`;
            return res.status(500).send(errorMessage);
        } else {            
            res.send("API successfully unregistered for " + apiName);
        }
    });

});



module.exports = router;