---
layout: post
title: Middleware for Internet of Things
date: 2024-11-18
categories: [INSA]
image: /assets/covers/energy.png
---

https://moodle.insa-toulouse.fr/course/view.php?id=785


```ino
#include <ESP8266WiFi.h>
#include <ArduinoMqttClient.h>

// WiFi credentials
const char* ssid = "asni";             
const char* password = "asniasni"; 

// MQTT Broker details
const char* mqtt_server = "10.0.1.254"; 
const int mqtt_port = 1883;

// MQTT Topics
const char* lightTopic = "ry/light";   // Topic pour contrôler la LED
const char* buttonTopic = "ry/button"; // Topic pour publier l'état du bouton
const char* lightSensorTopic = "ry/luminosity"; // Topic pour publier la luminosité
const char* lightOtherTopic = "PaCy/ledState";

// Pins
const int buttonPin = D5;        
const int lightSensorPin = A0;   
const int ledPin = D4;        

// WiFi and MQTT clients
WiFiClient wifiClient;
MqttClient mqttClient(wifiClient);

// Variables
bool manualControl = false;       
int luminosityThreshold = 500;
int luminosityMemory = 0;
#define LUM_MSG 20
int sendLuminosity = 0;
int payloadValue = 0;

void connectToWiFi() {
    Serial.print("[Wi-Fi] Connecting...");
    Serial.println(ssid);
    WiFi.begin(ssid, password);

    while (WiFi.status() != WL_CONNECTED)
      delay(1000);

    Serial.print("[Wi-Fi] Connected! IP Address: ");
    Serial.println(WiFi.localIP());
}

void connectToMQTT() {
    while (!mqttClient.connect(mqtt_server, mqtt_port))
      delay(1000);

    Serial.println("\n[MQTT] Connected.");

    // Subscribe to the light control topic
    mqttClient.subscribe("ry/#");
    Serial.println("[MQTT] Subscribed to topic: ry/light");
}

void handleLight(int messageSize) {   
    // Get the topic of the received message
    String topic = mqttClient.messageTopic();

    Serial.print("[MQTT] Received topic: ");
    Serial.println(topic);
    Serial.print("[MQTT] Message size: ");
    Serial.println(messageSize);

    // Get the payload
    String payload;
    while (mqttClient.available()) {
      payload += (char)mqttClient.read();
    }
    Serial.print("[Payload] ");
    Serial.println(payload);
    int value = payload.toInt();

    // Control the LED based on the payload
    if (value == 1) {
      digitalWrite(ledPin, LOW);  // Turn on LED
    } else if (value == 0) {
      digitalWrite(ledPin, HIGH);   // Turn off LED
    }
}

void setup() {
    // Initialize Serial Monitor
    Serial.begin(115200);

    // Initialize pins
    pinMode(buttonPin, INPUT_PULLUP);
    pinMode(ledPin, OUTPUT);

    // Connect to WiFi
    connectToWiFi();

    // Set MQTT callback
    mqttClient.onMessage(handleLight);

    // Connect to MQTT broker
    connectToMQTT();
}

void loop() {
    // Ensure the connection to MQTT broker is active
    if (!mqttClient.connected()) {
        connectToMQTT();
    }
    mqttClient.poll();

    // On button press: change control and send message
    if (digitalRead(buttonPin) == HIGH) {
        manualControl = !manualControl;
        mqttClient.beginMessage(buttonTopic);
        mqttClient.print(manualControl);
        mqttClient.endMessage();
        delay(300);
    }


    if(!manualControl) {
     // Read luminosity
      int luminosity = analogRead(lightSensorPin);
      
      // Test if we send
      sendLuminosity++;
      if((sendLuminosity >= LUM_MSG) && (luminosity != luminosityMemory))
      {
        sendLuminosity = 0;
        mqttClient.beginMessage(lightSensorTopic);
        mqttClient.print(luminosity);
        mqttClient.endMessage();
        Serial.print("[Light] Value: ");
        Serial.println(luminosity);
        luminosityMemory = luminosity;
      }
  
      // Control LED based on luminosity if not manually controlled
       if (luminosity < luminosityThreshold) {
            digitalWrite(ledPin, LOW);
            Serial.println("[Auto] LED ON");
        } else {
            digitalWrite(ledPin, HIGH);
            Serial.println("[Auto] LED OFF");
        }
    }
    delay(100); // Simple debounce
}
```
