import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ChromeCanvas({ className = '' }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    let width = currentMount.clientWidth || 400;
    let height = currentMount.clientHeight || 400;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 4.8;

    // High performance renderer with capped pixel ratio
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    currentMount.appendChild(renderer.domElement);

    // Fast, lightweight procedural studio environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    const envScene = new THREE.Scene();
    envScene.background = new THREE.Color(0x020203);

    // 2 key softbox light planes for chrome specular reflections
    const brightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const coolMat = new THREE.MeshBasicMaterial({ color: 0xb0c4de });

    const light1 = new THREE.Mesh(new THREE.PlaneGeometry(16, 40), brightMat);
    light1.position.set(-12, 6, 8);
    light1.rotation.y = Math.PI / 4;
    envScene.add(light1);

    const light2 = new THREE.Mesh(new THREE.PlaneGeometry(12, 40), coolMat);
    light2.position.set(14, -4, 6);
    light2.rotation.y = -Math.PI / 3;
    envScene.add(light2);

    const envMap = pmremGenerator.fromScene(envScene).texture;
    pmremGenerator.dispose();
    scene.environment = envMap;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight.position.set(5, 8, 5);
    scene.add(dirLight);

    // Chrome Material with high gloss
    const chromeMat = new THREE.MeshPhysicalMaterial({
      color: 0xf5f7fb,
      metalness: 0.96,
      roughness: 0.08,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      reflectivity: 1.0,
      envMapIntensity: 2.0,
    });

    // Optimized Torus Knot Geometry (90x24 segments instead of 240x48)
    const geometry = new THREE.TorusKnotGeometry(1.25, 0.36, 90, 24, 2, 3);
    const knot = new THREE.Mesh(geometry, chromeMat);
    scene.add(knot);

    // 3 small liquid droplets
    const dropGeom = new THREE.SphereGeometry(0.18, 16, 16);
    const drop1 = new THREE.Mesh(dropGeom, chromeMat);
    drop1.position.set(-1.8, 1.2, 0);
    scene.add(drop1);

    const drop2 = new THREE.Mesh(dropGeom, chromeMat);
    drop2.position.set(1.9, -1.0, 0.3);
    drop2.scale.setScalar(1.2);
    scene.add(drop2);

    // Mouse interaction with smooth dampening
    let targetRotX = 0;
    let targetRotY = 0;
    let isVisible = true;

    const handlePointerMove = (e) => {
      const rect = currentMount.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      targetRotY = x * 0.4;
      targetRotX = -y * 0.4;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    // IntersectionObserver to STOP rendering when scrolled out of view! (ELIMINATES LAG!)
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.05 });

    observer.observe(currentMount);

    // Resize
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
      if (!isVisible) return; // Zero GPU work when scrolled away!

      const t = (performance.now() - startTime) * 0.001;

      knot.rotation.y += (targetRotY + t * 0.22 - knot.rotation.y) * 0.04;
      knot.rotation.x += (targetRotX + Math.sin(t * 0.6) * 0.12 - knot.rotation.x) * 0.04;
      knot.position.y = Math.sin(t * 0.9) * 0.1;

      drop1.position.y = 1.2 + Math.sin(t * 1.3) * 0.15;
      drop2.position.y = -1.0 + Math.cos(t * 1.1) * 0.15;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      geometry.dispose();
      dropGeom.dispose();
      chromeMat.dispose();
      envMap.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className={`relative w-full h-full select-none ${className}`}>
      <div ref={mountRef} className="w-full h-full" />
    </div>
  );
}
