# SmartFarm Integrated Control System Architecture

## 1. System Topology
- **Edge Layer**: IoT Sensors (DHT22, Soil Moisture) & Actuators (Pumps, LED) connected via ESP32/Raspberry Pi.
- **Communication**: MQTT (EMQX) for low-latency device messaging; gRPC for internal microservices.
- **Backend**: NestJS (Node.js) handling business logic, device authentication, and event triggers.
- **Data Layer**:
    - **PostgreSQL**: Metadata, user accounts, and device configurations.
    - **InfluxDB**: Time-series storage for high-frequency sensor data.
    - **Redis**: Real-time state caching.

## 2. Technical Feasibility Check
- **Bottleneck Prevention**: Implementation of MQTT QoS 1 for reliable delivery and Load Balancing via AWS NLB.
- **Scalability**: K8s horizontal pod autoscaling based on message queue depth.