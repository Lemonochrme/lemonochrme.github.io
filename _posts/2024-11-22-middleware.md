---
layout: post
title: Lab Middleware
date: 2024-10-14
categories: [INSA]
image: /assets/covers/energy.png
---

https://moodle.insa-toulouse.fr/course/view.php?id=785


### 2. MQTT

- **Architecture IoT MQTT**: Devices (publish/subscribe), broker (manages topics), topics (channels for communication).
- **IP Protocol**: MQTT uses TCP/IP, low bandwidth, reliable communication.
- **Versions**: MQTT 3.1, 3.1.1, 5.0.
- **Security**: Authentication (username/password), encryption (TLS/SSL), access control (topics).
- **Smart System Topics**:
  - `light/control`: Button publishes, light subscribes.
  - `sensor/luminosity`: Sensor publishes.
  - `light/status`: Light publishes status.
  - Logic subscribes to luminosity, commands light.

---

### 3. Mosquitto Broker

1. Install Mosquitto ([mosquitto.org](https://mosquitto.org)).
2. Run broker on your machine.
3. Test:
   - Publish: `mosquitto_pub`
   - Subscribe: `mosquitto_sub`.

---

### 4. NodeMCU and MQTT

- **NodeMCU Features**: Built-in WiFi, GPIO pins, low power.
- **Arduino IDE**: Install and add ESP8266 board.
- **ArduinoMqtt Library**: Install library for MQTT communication.
- **Code Example**:
  - WiFi setup, connect to broker, publish/subscribe, maintain connection in the loop.

--- 
