import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function ChromeCanvas({ className = '', currentShape = 'knot', onShapeChange }) {
  const mountRef = useRef(null);
  const meshRef = useRef(null);
  const sceneRef = useRef(null);
  const [internalShape, setInternalShape] = useState(currentShape);

  // Sync prop changes
  useEffect(() => {
    setInternalShape(currentShape);
  }, [currentShape]);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    let width = currentMount.clientWidth || 400;
    let height = currentMount.clientHeight || 400;

    // Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 4.8;

    // High performance renderer with capped pixel ratio
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    currentMount.appendChild(renderer.domElement);

    // Fast, lightweight procedural studio environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color(0x030305);

    // Softbox light planes for chrome specular reflections
    const brightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const coolMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const emeraldMat = new THREE.MeshBasicMaterial({ color: 0x34d399 });

    const light1 = new THREE.Mesh(new THREE.PlaneGeometry(16, 40), brightMat);
    light1.position.set(-12, 6, 8);
    light1.rotation.y = Math.PI / 4;
    envScene.add(light1);

    const light2 = new THREE.Mesh(new THREE.PlaneGeometry(12, 40), coolMat);
    light2.position.set(14, -4, 6);
    light2.rotation.y = -Math.PI / 3;
    envScene.add(light2);

    const light3 = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), emeraldMat);
    light3.position.set(0, 12, -4);
    light3.rotation.x = Math.PI / 2;
    envScene.add(light3);

    const envMap = pmremGenerator.fromScene(envScene).texture;
    pmremGenerator.dispose();
    scene.environment = envMap;

    // Direct Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.5);
    dirLight.position.set(6, 8, 6);
    scene.add(dirLight);

    const cyanLight = new THREE.PointLight(0x00f0ff, 1.8, 15);
    cyanLight.position.set(-4, -3, 2);
    scene.add(cyanLight);

    // Chrome Material with high gloss and metallic reflections
    const chromeMat = new THREE.MeshPhysicalMaterial({
      color: 0xf8fafc,
      metalness: 0.98,
      roughness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      reflectivity: 1.0,
      envMapIntensity: 2.2,
    });

    // Helper to generate geometry based on selected shape
    const getGeometry = (shape) => {
      switch (shape) {
        case 'shield':
          return new THREE.IcosahedronGeometry(1.45, 1);
        case 'node':
          return new THREE.DodecahedronGeometry(1.4, 0);
        case 'ring':
          return new THREE.TorusGeometry(1.3, 0.38, 28, 70);
        case 'knot':
        default:
          return new THREE.TorusKnotGeometry(1.2, 0.35, 100, 26, 2, 3);
      }
    };

    let geometry = getGeometry(internalShape);
    const mainMesh = new THREE.Mesh(geometry, chromeMat);
    scene.add(mainMesh);
    meshRef.current = mainMesh;

    // Small liquid satellites
    const dropGeom = new THREE.SphereGeometry(0.16, 20, 20);
    const drop1 = new THREE.Mesh(dropGeom, chromeMat);
    drop1.position.set(-1.8, 1.1, 0.3);
    scene.add(drop1);

    const drop2 = new THREE.Mesh(dropGeom, chromeMat);
    drop2.position.set(1.9, -1.0, 0.4);
    drop2.scale.setScalar(1.25);
    scene.add(drop2);

    const drop3 = new THREE.Mesh(dropGeom, chromeMat);
    drop3.position.set(0.2, 1.9, -0.4);
    drop3.scale.setScalar(0.7);
    scene.add(drop3);

    // Mouse interaction with smooth dampening
    let targetRotX = 0;
    let targetRotY = 0;
    let isVisible = true;
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };

    const handlePointerDown = (e) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const handlePointerMove = (e) => {
      if (!currentMount) return;
      const rect = currentMount.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / (rect.width || 1)) * 2 - 1;
      const y = -((e.clientY - rect.top) / (rect.height || 1)) * 2 + 1;
      
      if (isDragging) {
        const deltaX = e.clientX - prevMousePos.x;
        const deltaY = e.clientY - prevMousePos.y;
        mainMesh.rotation.y += deltaX * 0.01;
        mainMesh.rotation.x += deltaY * 0.01;
        prevMousePos = { x: e.clientX, y: e.clientY };
      } else {
        targetRotY = x * 0.45;
        targetRotX = -y * 0.45;
      }
    };

    const mountEl = currentMount;
    mountEl.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    // Stop rendering when scrolled out of view for max performance
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.05 });

    observer.observe(currentMount);

    // Resize listener
    const handleResize = () => {
      if (!currentMount) return;
      width = currentMount.clientWidth;
      height = currentMount.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Animation Loop
    let animId;
    let startTime = performance.now();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const t = (performance.now() - startTime) * 0.001;

      if (!isDragging) {
        mainMesh.rotation.y += (targetRotY + t * 0.25 - mainMesh.rotation.y) * 0.045;
        mainMesh.rotation.x += (targetRotX + Math.sin(t * 0.7) * 0.15 - mainMesh.rotation.x) * 0.045;
      }
      
      mainMesh.position.y = Math.sin(t * 0.95) * 0.08;

      drop1.position.y = 1.1 + Math.sin(t * 1.3) * 0.18;
      drop1.position.x = -1.8 + Math.cos(t * 1.2) * 0.12;

      drop2.position.y = -1.0 + Math.cos(t * 1.1) * 0.18;
      drop2.position.x = 1.9 + Math.sin(t * 1.0) * 0.12;

      drop3.position.y = 1.9 + Math.sin(t * 1.7) * 0.14;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      mountEl.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      geometry.dispose();
      dropGeom.dispose();
      chromeMat.dispose();
      brightMat.dispose();
      coolMat.dispose();
      emeraldMat.dispose();
      envMap.dispose();
      renderer.dispose();
    };
  }, [internalShape]);

  const shapes = [
    { id: 'knot', label: 'Liquid Core' },
    { id: 'shield', label: 'Cyber Shield' },
    { id: 'node', label: 'Network Node' },
    { id: 'ring', label: 'Quantum Torus' }
  ];

  return (
    <div className={`relative w-full h-full select-none ${className}`}>
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      
      {/* 3D Model Switcher Bar */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 p-1 rounded-full border border-white/15 bg-black/70 backdrop-blur-md">
        {shapes.map((s) => (
          <button
            key={s.id}
            onClick={() => {
              setInternalShape(s.id);
              if (onShapeChange) onShapeChange(s.id);
            }}
            className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer ${
              internalShape === s.id
                ? 'bg-white text-black font-bold shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
