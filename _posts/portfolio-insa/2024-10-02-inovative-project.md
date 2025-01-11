---
layout: post
title: "💧 Smart Water Monitoring and Leak Detection System Using ESP32 and Fusion Sensors (IMU and Sound)"
date: 2024-10-02
categories: [INSA]
image: /assets/covers/pipe.png
---

## Overview of the project

This project is conducted as part of a multidisciplinary initiative within the ISS curriculum. The goal is to develop a system that accurately detects water leaks in networks using a non-intrusive method. Starting from scratch, we had to conceptualize the entire project, from hardware to software, while addressing protocols and other specifications. As a result, this project effectively illustrates the various notions covered in our courses.

Initially, the idea was to develop a method to detect household water leaks. However, as we delved deeper into the project, we gradually shifted our focus from a domestic solution to a distributed approach for public water network infrastructures. This is due to the fact that public water infrastructures are significantly more subject to water losses due to undetected leaks, representing a major economic and environmental issue. On the other hand, monitoring household water leaks is a well known and already addressed problem, hence irrelevant for us.

## My role in the project

Our team consists of five members. With the exception of one member specializing in computer science and networking, the rest of us come from an automatic control and electronics background. At first, this might seem suboptimal for a multidisciplinary project. However, as we progressed, we realized that each team member could contribute significantly, even outside their primary area of expertise. Personally, although my academic background is in automatic control and electronics, I have led many personal projects and gained experience in various engineering fields. This experience naturally positioned me to oversee the technical aspects of the project.

My role in this project is twofold, in one hand I'm responsible of the general technical direction of the project and on the other hand, as I'm fairly confortable with hardware electronic design, microcontroller programming, signal processing, harmonic analysis and machine learning, I take care of these aspects.

For other aspects, such as the design of the MAC Communication Protocol, the development of the web application, and the database implementation, we delegated these tasks to team members that were more competent or more willing to work on these subjects. This decision was made to optimize the global efficiency of the team and to ensure that every individual in the team had a fair share of work.






---

Format du Portfolio : Description -> Technique -> Analyse

## Introduction

Water consumption is one of the critical utilities in a household, yet it is often difficult to monitor effectively. With the rising concerns over water conservation and the financial impact of undetected leaks, having a smart system that can both monitor water usage and detect potential leaks becomes essential. This project presents a smart water monitoring and leak detection system using an **ESP32** microcontroller and fusion sensors to detect water leaks in a household or apartment. The system is designed to help users track their water consumption, detect leaks in real-time, and receive alerts, all through a web or mobile application.

## Litterature Review


## References

1. [Leak Detection Using Flow-Induced Vibrations in Pressurized Wall-Mounted Water Pipelines](https://ieeexplore.ieee.org/stamp/stamp.jsp?arnumber=9229405)


## Frequency Anaylis : Fast Fourrier Transform (FFT) Implementation on ESP32

Water flowing in pipelines create low frequency accoustic vibrations, our goal is to detect these vibrations and process them to retrieve the frequency component, for that matter we will use a FFT algorithm.

Hardware :
- ESP32C3
- GY-MAX4466 Electret Microphone


ESP32 Code :
```
#include "arduinoFFT.h"

const uint16_t samples = 64;              // Must be a power of 2
const double samplingFrequency = 1000;    // Sampling frequency in Hz (increase if possible)
double vReal[samples];                    // Real part
double vImag[samples];                    // Imaginary part

ArduinoFFT<double> FFT = ArduinoFFT<double>(vReal, vImag, samples, samplingFrequency);

const int micPin = 0; // Microphone pin (e.g., GPIO0 on ESP32)

void setup() {
  Serial.begin(115200); // Initialize serial communication
  pinMode(micPin, INPUT); // Configure micPin as input
  Serial.println("FFT Example: Microphone Input");
}

void loop() {
  // Step 1: Sample the microphone signal
  for (uint16_t i = 0; i < samples; i++) {
    unsigned long startMicros = micros(); // Record the start time

    vReal[i] = analogRead(micPin); // Read microphone value
    vImag[i] = 0.0;                // Set imaginary part to 0

    // Wait for the next sample
    while (micros() - startMicros < (1000000 / samplingFrequency));
  }

  // Step 2: Remove DC Offset
  double mean = 0;
  for (uint16_t i = 0; i < samples; i++) {
    mean += vReal[i];
  }
  mean /= samples;
  for (uint16_t i = 0; i < samples; i++) {
    vReal[i] -= mean; // Center signal around 0
  }

  // Step 3: Apply FFT Windowing
  FFT.windowing(FFTWindow::Hamming, FFTDirection::Forward);

  // Step 4: Compute the FFT
  FFT.compute(FFTDirection::Forward);

  // Step 5: Compute Magnitudes
  FFT.complexToMagnitude();

  // Step 6: Send Results Over Serial
  Serial.println("Frequency (Hz) : Magnitude");
  for (uint16_t i = 0; i < samples / 2; i++) {
    double frequency = i * ((double)samplingFrequency / samples); // Calculate frequency bin
    Serial.print(frequency, 2);
    Serial.print(" Hz: ");
    Serial.println(vReal[i], 4); // Magnitude
  }

  // Optional: Find the Peak Frequency
  double peakFrequency = FFT.majorPeak();
  Serial.print("Peak Frequency: ");
  Serial.print(peakFrequency, 2);
  Serial.println(" Hz");

  delay(100); // Repeat every 500ms
}
```

Matlab Visualisation Code :
```
% Parameters
serialPort = 'COM4';
baudRate = 115200;   % Must match the baud rate of Arduino Code
numBins = 32;        % Number of frequency bins (samples / 2 in Arduino code)

% Open the serial connection
serialObj = serialport(serialPort, baudRate);
configureTerminator(serialObj, "LF"); % Ensure line-feed terminator
pause(2);

% Initialize figure
figure;
freqPlot = plot(nan, nan, '-o'); % Create a blank plot
xlabel('Frequency (Hz)');
ylabel('Magnitude');
title('Real-Time FFT Visualization');
grid on;

% Infinite loop to read and display data
try
    while true
        % Read data from serial
        dataBuffer = "";
        while ~contains(dataBuffer, "Peak Frequency")
            line = readline(serialObj); % Read one line
            dataBuffer = strcat(dataBuffer, line, "\n"); % Append line to buffer
        end

        % Parse the frequency and magnitude data
        freqData = [];
        magData = [];
        lines = splitlines(dataBuffer);
        for i = 1:length(lines)
            line = lines{i};
            if contains(line, " Hz:")
                tokens = regexp(line, '([\d\.]+) Hz: ([\d\.]+)', 'tokens');
                if ~isempty(tokens)
                    freqData(end+1) = str2double(tokens{1}{1}); % Frequency
                    magData(end+1) = str2double(tokens{1}{2});  % Magnitude
                end
            end
        end

        % Update the plot
        if ~isempty(freqData) && ~isempty(magData)
            set(freqPlot, 'XData', freqData, 'YData', magData);
            ylim([0, max(magData) * 1.1]); % Adjust Y-axis dynamically
            drawnow;
        end
    end
catch ME
    % Close serial port on error or termination
    disp('Terminating...');
    delete(serialObj);
    rethrow(ME);
end
```

### Preliminary Results

![image](https://github.com/user-attachments/assets/43c49127-2088-4145-83b0-3a143bbd5622)


![image](https://github.com/user-attachments/assets/8f96b1d8-f70f-419a-aa60-7afc668a8a1c)


![image](https://github.com/user-attachments/assets/38e36f30-e23f-4ef3-b017-653cd53c94ed)



### IMU FFT

```
#include "SparkFunLSM6DS3.h"
#include "arduinoFFT.h"
#include "Wire.h"
#include "SPI.h"

// IMU Initialization
LSM6DS3Core myIMU(I2C_MODE, 0x6B);

// FFT Parameters
const uint16_t samples = 1024;            // Increased samples for better frequency resolution
const double samplingFrequency = 6660.0; // Original IMU sampling frequency
double vReal[samples];                    // Real part
double vImag[samples];                    // Imaginary part

ArduinoFFT<double> FFT = ArduinoFFT<double>(vReal, vImag, samples, samplingFrequency);

uint16_t errorsAndWarnings = 0;

void setup() {
  Serial.begin(115200);
  delay(1000); // Relax...
  Serial.println("Processor came out of reset.\n");

  // Initialize the IMU
  if (myIMU.beginCore() != 0) {
    Serial.println("Error at beginCore().");
  } else {
    Serial.println("beginCore() passed.");
  }

  // Configure Accelerometer for Maximum ODR
  uint8_t dataToWrite = 0;
  dataToWrite |= LSM6DS3_ACC_GYRO_BW_XL_400Hz; // Anti-aliasing filter at 400 Hz
  dataToWrite |= LSM6DS3_ACC_GYRO_FS_XL_8g;    // Full scale ±8g
  dataToWrite |= LSM6DS3_ACC_GYRO_ODR_XL_6660Hz; // Max ODR of 6.66 kHz
  errorsAndWarnings += myIMU.writeRegister(LSM6DS3_ACC_GYRO_CTRL1_XL, dataToWrite);

  Serial.println("IMU Configuration Complete.");
}

void loop() {
  // Step 1: Sample Accelerometer Data
  for (uint16_t i = 0; i < samples; i++) {
    unsigned long startMicros = micros(); // Record the start time

    int16_t accelX;
    if (myIMU.readRegisterInt16(&accelX, LSM6DS3_ACC_GYRO_OUTX_L_XL) != 0) {
      errorsAndWarnings++;
    }

    vReal[i] = accelX; // Use X-axis accelerometer data
    vImag[i] = 0.0;    // Set imaginary part to 0

    // Wait for the next sample
    while (micros() - startMicros < (1000000 / samplingFrequency));
  }

  // Step 2: Remove DC Offset
  double mean = 0;
  for (uint16_t i = 0; i < samples; i++) {
    mean += vReal[i];
  }
  mean /= samples;
  for (uint16_t i = 0; i < samples; i++) {
    vReal[i] -= mean; // Center signal around 0
  }

  // Step 3: Apply FFT Windowing
  FFT.windowing(FFTWindow::Hamming, FFTDirection::Forward);

  // Step 4: Compute the FFT
  FFT.compute(FFTDirection::Forward);

  // Step 5: Compute Magnitudes
  FFT.complexToMagnitude();

  // Step 6: Send Results Over Serial
  Serial.println("Frequency (Hz) : Magnitude");
  for (uint16_t i = 0; i < samples / 2; i++) {
    double frequency = i * (samplingFrequency / samples); // Calculate frequency bin
    if (frequency > 1000) break; // Stop output at 1000 Hz
    Serial.print(frequency, 2);
    Serial.print(" Hz: ");
    Serial.println(vReal[i], 4); // Magnitude
  }

  // Optional: Find the Peak Frequency within 0–1000 Hz
  double peakFrequency = FFT.majorPeak();
  if (peakFrequency <= 1000.0) {
    Serial.print("Peak Frequency: ");
    Serial.print(peakFrequency, 2);
    Serial.println(" Hz");
  } else {
    Serial.println("Peak Frequency above 1000 Hz, ignored.");
  }

  // delay(100); // Repeat every 100ms
}
```
