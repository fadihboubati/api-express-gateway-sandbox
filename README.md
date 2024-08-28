# API Gateway with Load Balancing

## Overview

This project is a simple API gateway with round-robin load balancing functionality. It routes incoming requests to multiple backend instances of a fakeApi service and evenly distributes the load across these instances. The gateway uses a service registry to dynamically manage and route traffic to the registered APIs.

## Features

* **API Gateway**: Routes requests to different backend instances based on the API name and path.
* **Round-Robin** Load Balancing: Distributes incoming requests evenly across multiple backend instances.
* **Service Registry**: Allows for dynamic registration and unregistration of backend APIs.
* **Enable/Disable API Instances**: Provides routes to enable or disable specific API instances dynamically.
* **Basic Authentication**: Secures the API gateway with basic authentication. User credentials are stored securely using hashed passwords.

### Note

This project is currently under development. Features and functionalities may be added or modified in future updates.