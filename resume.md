---
layout: default
title: Resume
permalink: /resume/
---

<style>
body {
  font-family: "Georgia", serif;
  line-height: 1.7;
  margin: 0;
  padding: 0 1rem;
}

main {
  max-width: 900px;
  margin: auto;
}

section {
  margin-bottom: 3rem;
  opacity: 0;
  transform: translateY(40px);
  transition: all 0.6s ease-out;
}

section.visible {
  opacity: 1;
  transform: none;
}

h1, h2 {
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #111;
  padding-bottom: 0.3em;
  margin-bottom: 1em;
}

h1 {
  font-size: 2.2rem;
  margin-top: 0;
}

h2 {
  font-size: 1.3rem;
}

ul {
  list-style: none;
  padding-left: 0;
}

li {
  margin-bottom: 0.6rem;
}

.resume-header {
  text-align: center;
  margin-bottom: 3rem;
}

.cool-title {
  font-size: 2em;
}

.resume-header h1 {
  margin-bottom: 0.5rem;
}

.contact-info a {
  text-decoration: none;
  margin: 0 0.5rem;
  font-style: italic;
}

.job-title {
  font-style: italic;
  font-size: 0.95rem;
}

.job-period {
  float: right;
  font-size: 0.85rem;
  color: #666;
}

.skill-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media screen and (max-width: 600px) {
  .skill-list {
    grid-template-columns: 1fr;
  }

  .job-period {
    float: none;
    display: block;
    margin-top: 0.2rem;
  }
}
</style>

<script>
document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll("section").forEach(section => {
    observer.observe(section);
  });
});
</script>

<main>
  <header class="resume-header">
    <p class="cool-title">Robin Marin–Muller</p>
    <div class="contact-info">
      <a class="hover-link" href="mailto:marin-muller@insa-toulouse.fr">Email</a>|
      <a class="hover-link" href="https://lemonochrome.fr">Portfolio</a>|
      <a class="hover-link" href="https://github.com/Lemonochrme">GitHub</a>|
      <a class="hover-link" href="/download/resume.pdf">PDF</a>
    </div>
  </header>

  <section>
    <h2>✦ Education</h2>
    <ul>
      <li><strong>INSA Toulouse</strong> – Automation, Electronics, CS <span class="job-period">2022–Present</span>
        <div class="job-title">Specialization in Automation, Electronics, and Computer Science</div>
      </li>
      <li><strong>DUT GEII</strong> – Embedded Systems Option <span class="job-period">2020–2022</span>
        <div class="job-title">University Diploma in Electrical Engineering and Industrial Computing</div>
      </li>
      <li><strong>Baccalauréat</strong> – Scientific (Eng. Sciences & NSI) <span class="job-period">2017–2020</span>
        <div class="job-title">General Scientific with Engineering Sciences and Digital Sciences</div>
      </li>
      <li><strong>BIA</strong> – Flight principles, Meteorology, Instruments <span class="job-period">2017–2018</span>
        <div class="job-title">Aviation Introduction Certificate: flight mechanics, navigation, flight safety, flight principles, and cockpit instruments</div>
      </li>
    </ul>
  </section>

  <section>
    <h2>✦ Professional Experience</h2>
    <ul>
      <li><strong>CNES</strong>, Embedded Software Engineer <span class="job-period">2022–Present</span>
        <div class="job-title">Developed and tested embedded software for space applications. Automated the embedded software development pipeline for satellite systems.</div>
      </li>
      <li><strong>FentISS</strong>, Software Engineer Intern <span class="job-period">2024</span>
        <div class="job-title">Worked on XtratuM hypervisor and SKE simulator. Optimized simulator execution by tuning Linux kernel parameters.</div>
      </li>
      <li><strong>Ikalogic</strong>, C++ Intern <span class="job-period">2022</span>
        <div class="job-title">Developed embedded NXP LP55S69 C++ software for a logic analyzer tool.</div>
      </li>
      <li><strong>Thales</strong>, Observation Intern <span class="job-period">2017</span>
        <div class="job-title">Observed production chain and business engineering processes.</div>
      </li>
    </ul>
  </section>

  <section>
    <h2>✦ Academic Projects</h2>
    <ul>
      <li><strong>Thrust Vectoring Module</strong> – Model rocketry
        <div class="job-title">Developed a module to control thrust direction for model rockets.</div>
      </li>
      <li><strong>RISC V Microprocessor (VHDL)</strong> – 5-stage pipeline, 68→168 MHz
        <div class="job-title">Design a 5-stage pipelined RISC-V microprocessor in VHDL using  using Vivado. Implemented ALU, dual-port register file, and memory subsystems. Optimized clock frequency and managed data hazards.</div>
      </li>
      <li><strong>WO3 Gas Sensor</strong> – WO3 Nanoparticles sensor + LoRa + PCB + ESP32
        <div class="job-title">Synthesized WO3 nanoparticles using basic chemistry techniques. Coated a polysilicon substrate with photosensitive resin to protect the functional circuit, followed by acid etching to remove unwanted conductive parts. Cleaned the substrate and applied nanoparticle powder using electrophoresis, ensuring even coating on the conductive combs. Cut individual silicon dies from the wafer and wire-bonded them to the package using ultrasonic bonding. Characterized the gas sensor's resistance and integrated it with an ESP32 and LoRaWAN communication. Designed a full PCB for low-power IoT applications.</div>    </li>
      <li><strong>Water Leak Detection</strong> – FFT + SVM + LoRa, full PCB + ML
        <div class="job-title">Designed PCB and embedded C software for leak detection system using acoustic/vibrational signals, FFT analysis, and SVM classification, combined with LoRa communication for remote monitoring.</div>
      </li>
    </ul>
  </section>

  <section>
    <h2>✦ Personal Projects</h2>
    <ul>
      <li><strong>DIY Drone</strong> <span class="job-period">2016</span>
        <div class="job-title">Built and programmed a custom drone for hobby purposes.</div>
      </li>
      <li><strong>Autonomous Flying Wing</strong> <span class="job-period">2024–Present</span> – Real-time mapping
        <div class="job-title">Currently developing an autonomous flying wing system for real-time terrain mapping and reconnaissance. Utilizing the RV1103 platform, powered by a single-core ARM Cortex-A7 32-bit processor associated with 0.5 TOPS NPU. Integrating embedded AI for onboard data processing. </div>
      </li>
      <li><strong>Habit Tracking App</strong> <span class="job-period">2025–Present</span> – Flutter
        <div class="job-title">Developed a habits tracking Android app using Flutter.</div>
      </li>
      <li><strong>C Simple Graphic Engine</strong> <span class="job-period">2025</span> – X11, Xlib only
        <div class="job-title">Developed a basic graphic engine in C using only Xlib to deepen understanding of graphics programming.</div>
      </li>
    </ul>
  </section>

  <section>
    <h2>✦ Technical Skills</h2>
    <div class="skill-list">
      <div><strong>Software Engineering</strong><br>C/C++, Java, Python, Git, GitLab CI/CD, Docker, Jenkins, TensorFlow, Scikit-learn, NumPy</div>
      <div><strong>Electrical Engineering</strong><br>PCB Design (Altium, KiCAD), LTSpice, VHDL, STM32, ESP32, ATmega328p, NXP LPC55, Zynq 7000</div>
      <div><strong>Automatic Control</strong><br>MATLAB, Simulink, PID Control, Non-linear Systems, Kalman Filters</div>
      <div><strong>Miscellaneous</strong><br>LaTeX, Blender, Adobe Suite, Figma, Manim, OpenStack, IoT Networks, Fusion360, 3D Printing, Raspberry Pi, LoRa, React Native, Jekyll, Vanilla HTML/CSS/JS, I use arch BTW</div>
    </div>
  </section>

  <section>
    <h2>✦ Personal Profile</h2>
    <ul>
      <li><strong>Sports:</strong> Calisthenics, Climbing, Mountaineering, Ski/Snowboard</li>
      <li><strong>Music:</strong> Academical clarinet (10 years), self-taught piano</li>
      <li><strong>Languages:</strong> French (Native), English (Expert), Spanish (B1), Italian (A2), Latin</li>
      <li><strong>Nationality:</strong> French and Swiss</li>
      <li><strong>Interests:</strong> History, Paleohistory, Climatology, Bioevolution, Opensource and Everything that flies</li>
    </ul>
  </section>
</main>

