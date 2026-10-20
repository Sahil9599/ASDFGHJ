import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function ChromeCanvas({ shape = 'knot', interactive = true, className = '' }) {
  const mountRef = useRef(null);
  const [currentShape, setCurrentShape] = useState(shape);
  const meshRef = useRef(null);
  const dropletsRef = useRef([]);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Dimensions
    let width = currentMount.clientWidth || window.innerWidth;
    let height = currentMount.clientHeight || window.innerHeight;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 5.2;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    currentMount.appendChild(renderer.domElement);

    // Procedural Studio Environment for hyper-realistic liquid chrome reflections
    const createStudioEnvironment = () => {
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      pmremGenerator.compileEquirectangularShader();

      const envScene = new THREE.Scene();
      envScene.background = new THREE.Color(0x020203);

      // Create high-contrast softbox light strips
      const lightGeom = new THREE.PlaneGeometry(12, 35);
      const brightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const coolMat = new THREE.MeshBasicMaterial({ color: 0x99bbff });
      const warmMat = new THREE.MeshBasicMaterial({ color: 0xffeedd });

      // Left vertical softbox
      const light1 = new THREE.Mesh(lightGeom, brightMat);
      light1.position.set(-15, 0, 10);
      light1.rotation.y = Math.PI / 4;
      envScene.add(light1);

      // Right specular edge strip
      const light2 = new THREE.Mesh(new THREE.PlaneGeometry(8, 40), coolMat);
      light2.position.set(16, 5, 8);
      light2.rotation.y = -Math.PI / 3.5;
      envScene.add(light2);

      // Top softbox
      const light3 = new THREE.Mesh(new THREE.PlaneGeometry(35, 12), brightMat);
      light3.position.set(0, 20, 5);
      light3.rotation.x = Math.PI / 2.5;
      envScene.add(light3);

      // Bottom rim bounce
      const light4 = new THREE.Mesh(new THREE.PlaneGeometry(25, 8), warmMat);
      light4.position.set(0, -18, 5);
      light4.rotation.x = -Math.PI / 2.5;
      envScene.add(light4);

      // Distant pin lights for sparkle
      for (let i = 0; i < 6; i++) {
        const pin = new THREE.Mesh(new THREE.SphereGeometry(1.5, 8, 8), brightMat);
        const angle = (i / 6) * Math.PI * 2;
        pin.position.set(Math.cos(angle) * 20, Math.sin(angle) * 15, -10);
        envScene.add(pin);
      }

      const envMap = pmremGenerator.fromScene(envScene).texture;
      pmremGenerator.dispose();
      return envMap;
    };

    const envMap = createStudioEnvironment();
    scene.environment = envMap;

    // Direct lighting setup
    const ambientLight = new THREE.AmbientLight(0x222226, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.5);
    dirLight1.position.set(5, 10, 7);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xaaccff, 1.8);
    dirLight2.position.set(-8, -5, -4);
    scene.add(dirLight2);

    const rimLight = new THREE.DirectionalLight(0xffffff, 3.0);
    rimLight.position.set(0, -10, -5);
    scene.add(rimLight);

    // Chrome Material
    const chromeMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xe6e9ef,
      metalness: 0.98,
      roughness: 0.04,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      reflectivity: 1.0,
      envMapIntensity: 2.2,
    });

    // Geometry Generator
    const getGeometry = (type) => {
      switch (type) {
        case 'mobius':
          return new THREE.TorusKnotGeometry(1.3, 0.42, 220, 48, 2, 5);
        case 'mercury':
          return new THREE.IcosahedronGeometry(1.4, 24);
        case 'ring':
          return new THREE.TorusGeometry(1.4, 0.45, 48, 160);
        case 'knot':
        default:
          return new THREE.TorusKnotGeometry(1.3, 0.38, 240, 40, 2, 3);
      }
    };

    // Main Mesh
    const mainGeometry = getGeometry(currentShape);
    const mainMesh = new THREE.Mesh(mainGeometry, chromeMaterial);
    scene.add(mainMesh);
    meshRef.current = mainMesh;

    // Liquid droplets floating in proximity
    const dropletsGroup = new THREE.Group();
    const dropletGeom = new THREE.SphereGeometry(1, 32, 32);
    const droplets = [];

    const dropletPositions = [
      { x: -2.3, y: 1.4, z: -0.5, scale: 0.22, speed: 1.2 },
      { x: 2.4, y: -1.2, z: 0.4, scale: 0.28, speed: 0.9 },
      { x: -1.9, y: -1.7, z: 0.8, scale: 0.16, speed: 1.5 },
      { x: 2.1, y: 1.6, z: -0.8, scale: 0.19, speed: 1.1 },
      { x: 0.2, y: 2.4, z: -0.3, scale: 0.14, speed: 1.3 },
      { x: -0.8, y: -2.2, z: 0.2, scale: 0.24, speed: 0.8 },
    ];

    dropletPositions.forEach((dp, i) => {
      const drop = new THREE.Mesh(dropletGeom, chromeMaterial);
      drop.position.set(dp.x, dp.y, dp.z);
      drop.scale.setScalar(dp.scale);
      dropletsGroup.add(drop);
      droplets.push({ mesh: drop, base: dp, offset: i * 1.3 });
    });

    scene.add(dropletsGroup);
    dropletsRef.current = droplets;

    // Interaction state
    let targetRotationX = 0;
    let targetRotationY = 0;
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let mouse = { x: 0, y: 0 };

    const onPointerMove = (e) => {
      const rect = currentMount.getBoundingClientRect();
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging) {
        const deltaX = clientX - previousMousePosition.x;
        const deltaY = clientY - previousMousePosition.y;
        targetRotationY += deltaX * 0.008;
        targetRotationX += deltaY * 0.008;
        previousMousePosition = { x: clientX, y: clientY };
      } else {
        targetRotationY = mouse.x * 0.45;
        targetRotationX = -mouse.y * 0.45;
      }
    };

    const onPointerDown = (e) => {
      isDragging = true;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
      previousMousePosition = { x: clientX, y: clientY };
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    if (interactive) {
      window.addEventListener('pointermove', onPointerMove);
      currentMount.addEventListener('pointerdown', onPointerDown);
      window.addEventListener('pointerup', onPointerUp);
    }

    // Resize Handler
    const handleResize = () => {
      if (!currentMount) return;
      width = currentMount.clientWidth;
      height = currentMount.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    const startTime = performance.now();
    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) * 0.001;

      // Fluid deformation if mercury
      if (currentShape === 'mercury' && mainMesh.geometry.attributes.position) {
        const pos = mainMesh.geometry.attributes.position;
        // Subtle organic breathing
        const scale = 1 + Math.sin(elapsedTime * 1.5) * 0.03;
        mainMesh.scale.set(scale, scale, scale);
      }

      // Smooth dampening rotation
      mainMesh.rotation.y += (targetRotationY + elapsedTime * 0.25 - mainMesh.rotation.y) * 0.05;
      mainMesh.rotation.x += (targetRotationX + Math.sin(elapsedTime * 0.5) * 0.15 - mainMesh.rotation.x) * 0.05;
      mainMesh.rotation.z = Math.sin(elapsedTime * 0.3) * 0.08;

      // Subtle vertical bobbing
      mainMesh.position.y = Math.sin(elapsedTime * 0.8) * 0.12;

      // Animate droplets
      droplets.forEach((d) => {
        d.mesh.position.y = d.base.y + Math.sin(elapsedTime * d.base.speed + d.offset) * 0.25;
        d.mesh.position.x = d.base.x + Math.cos(elapsedTime * 0.7 + d.offset) * 0.15;
        d.mesh.rotation.y += 0.01;
      });

      dropletsGroup.rotation.y = elapsedTime * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (interactive) {
        window.removeEventListener('pointermove', onPointerMove);
        currentMount.removeEventListener('pointerdown', onPointerDown);
        window.removeEventListener('pointerup', onPointerUp);
      }
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      mainGeometry.dispose();
      dropletGeom.dispose();
      chromeMaterial.dispose();
      renderer.dispose();
    };
  }, [currentShape, interactive]);

  return (
    <div className={`relative w-full h-full select-none ${className}`}>
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      
      {/* Morph Shape Controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 p-1 rounded-full bg-black/60 border border-white/10 backdrop-blur-md z-10">
        {[
          { id: 'knot', label: 'TORUS KNOT' },
          { id: 'mobius', label: 'MÖBIUS' },
          { id: 'mercury', label: 'MERCURY' },
          { id: 'ring', label: 'CHROME RING' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentShape(item.id)}
            className={`px-3 py-1 text-[10px] font-mono tracking-widest uppercase rounded-full transition-all duration-300 ${
              currentShape === item.id
                ? 'bg-white text-black font-semibold shadow-[0_0_15px_rgba(255,255,255,0.4)]'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
