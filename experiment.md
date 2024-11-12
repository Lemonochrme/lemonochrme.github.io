---
layout: default
title: Experiments
permalink: /experiments/
---

<div id="constellation">
    <canvas id="three-canvas"></canvas>
</div>

<style>
  /* Full screen black background without scrollbars */
  #constellation {
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      position: fixed;
      top: 0;
      left: 0;
      background-color: black;
  }
  #three-canvas {
      width: 100%;
      height: 100%;
      display: block;
  }
</style>

<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script>
document.addEventListener("DOMContentLoaded", function() {
    // Basic scene, camera, and renderer setup
    const scene = new THREE.Scene();
    const aspect = window.innerWidth / window.innerHeight;
    const camera = new THREE.OrthographicCamera(-aspect * 5, aspect * 5, 5, -5, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("three-canvas"), antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 1);  // Black background

    // Canvas resizing to fit viewport
    window.addEventListener("resize", () => {
        const aspect = window.innerWidth / window.innerHeight;
        camera.left = -aspect * 5;
        camera.right = aspect * 5;
        camera.top = 5;
        camera.bottom = -5;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Create the glowing sun in the center
    const sunGeometry = new THREE.SphereGeometry(1, 64, 64);
    const sunMaterial = new THREE.ShaderMaterial({
        uniforms: {
            glowColor: { type: "c", value: new THREE.Color(0xffcc00) },
            viewVector: { type: "v3", value: camera.position }
        },
        vertexShader: `
            varying vec3 vNormal;
            varying vec3 vPositionNormal;
            void main() {
                vNormal = normalize(normalMatrix * normal);
                vPositionNormal = normalize((modelViewMatrix * vec4(position, 1.0)).xyz);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 glowColor;
            varying vec3 vNormal;
            varying vec3 vPositionNormal;
            void main() {
                float intensity = pow(0.8 - dot(vNormal, vPositionNormal), 6.0);
                gl_FragColor = vec4(glowColor, 1.0) * intensity;
            }
        `,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    // Camera position to top view
    camera.position.set(0, 5, 0);
    camera.lookAt(0, 0, 0);

    // Orbiting nodes setup
    const nodes = [];
    const numNodes = 5;
    const orbitRadius = 2.5;
    const orbitSpeeds = [0.01, 0.015, 0.02, 0.025, 0.03];  // Speeds for each node

    // Create nodes and add them to the scene
    for (let i = 0; i < numNodes; i++) {
        const nodeGeometry = new THREE.SphereGeometry(0.1, 32, 32);  // Increased segments for roundness
        const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });  // White color
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
        node.userData = {
            angle: Math.random() * Math.PI * 2,  // Random starting angle
            speed: orbitSpeeds[i],               // Set speed
            radius: orbitRadius + i * 0.5        // Increase orbit radius for each node
        };
        scene.add(node);
        nodes.push(node);
    }

    // Fade effect on the canvas for trace paths
    function drawTrail() {
        renderer.autoClearColor = false;
        renderer.clearColor = new THREE.Color(0, 0, 0);
        renderer.setClearAlpha(0.1);  // Slightly transparent to fade previous trails
    }

    // Animation and rendering loop
    function animate() {
        requestAnimationFrame(animate);

        // Update each node's position in its orbit
        nodes.forEach(node => {
            node.userData.angle += node.userData.speed;  // Increment the angle
            node.position.x = node.userData.radius * Math.cos(node.userData.angle);
            node.position.z = node.userData.radius * Math.sin(node.userData.angle);
        });

        // Rotate the sun slightly for a dynamic effect
        sun.rotation.y += 0.002;

        // Fade effect for trace paths
        drawTrail();

        // Render the scene
        renderer.render(scene, camera);
    }

    animate();
});
</script>

