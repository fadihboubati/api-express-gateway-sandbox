const loadBalancer = {}

loadBalancer.ROUND_ROBIN = (service) => {
    let newIndex = (service.index + 1) % service.instances.length;
    
    // Check if the selected instance is enabled, loop through to find the next enabled one
    newIndex = loadBalancer.findEnabledInstance(service, newIndex);

    service.index = newIndex; // update the reference
    return newIndex;
};

loadBalancer.findEnabledInstance = (service, index) => {
    const totalInstances = service.instances.length;

    // Loop through the instances starting from the current index to find an enabled one
    for (let i = 0; i < totalInstances; i++) {
        const currentIndex = (index + i) % totalInstances;
        if (service.instances[currentIndex].enabled) {
            return currentIndex; // Return the index of the enabled instance
        }
    }

    // If no instance is enabled, handle accordingly (e.g., throw an error or return a fallback index)
    throw new Error("No enabled instances available");
};

module.exports = loadBalancer;
