const loadBalancer = {}

loadBalancer.ROUND_ROBIN = (service) => {
    const newIndex = (service.index + 1) % service.instances.length;
    service.index = newIndex; // update the reference
    return newIndex;
}

module.exports = loadBalancer