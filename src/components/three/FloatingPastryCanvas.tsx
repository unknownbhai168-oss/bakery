import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  createGlazedDonut,
  createMacaron,
  createTieredCake,
  createChouxPastry,
} from './pastryGeometries.ts';

interface PastryNode {
  mesh: THREE.Group;
  initialPos: THREE.Vector3;
  baseRotSpeed: THREE.Vector3;
  floatSpeed: number;
  floatOffset: number;
  scrollFactor: number;
}

export const FloatingPastryCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL availability
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x121110, 0.04);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 16);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.shadowMap.enabled = false; // Background lightweight
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // Lighting (Warm Studio Patisserie)
    const ambientLight = new THREE.AmbientLight(0xFFEEDD, 0.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xFFF2DC, 1.4);
    keyLight.position.set(10, 15, 10);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xD4AF37, 1.2);
    rimLight.position.set(-10, -5, -8);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0xE87A90, 0.9, 30);
    fillLight.position.set(0, -6, 5);
    scene.add(fillLight);

    // Pastry Instances in 3D Space
    const pastryNodes: PastryNode[] = [];

    // 1. Strawberry Donut (Right upper)
    const donut1 = createGlazedDonut('#E85D75');
    donut1.scale.set(0.65, 0.65, 0.65);
    scene.add(donut1);
    pastryNodes.push({
      mesh: donut1,
      initialPos: new THREE.Vector3(7.2, 3.5, -4),
      baseRotSpeed: new THREE.Vector3(0.005, 0.008, 0.003),
      floatSpeed: 0.9,
      floatOffset: 0,
      scrollFactor: 0.004,
    });

    // 2. Dark Chocolate Piedmont Donut (Left lower)
    const donut2 = createGlazedDonut('#341B12');
    donut2.scale.set(0.55, 0.55, 0.55);
    scene.add(donut2);
    pastryNodes.push({
      mesh: donut2,
      initialPos: new THREE.Vector3(-6.8, -3.2, -3),
      baseRotSpeed: new THREE.Vector3(0.004, -0.007, 0.002),
      floatSpeed: 1.1,
      floatOffset: 2.1,
      scrollFactor: -0.0035,
    });

    // 3. Pistachio Macaron (Left upper)
    const macaronPistache = createMacaron('#7A966E', '#3D2619', 0.65);
    scene.add(macaronPistache);
    pastryNodes.push({
      mesh: macaronPistache,
      initialPos: new THREE.Vector3(-7.5, 4.2, -5),
      baseRotSpeed: new THREE.Vector3(0.006, 0.009, -0.004),
      floatSpeed: 1.2,
      floatOffset: 1.2,
      scrollFactor: 0.003,
    });

    // 4. Raspberry Macaron (Right mid-lower)
    const macaronFramboise = createMacaron('#C73B5B', '#FAD4DE', 0.7);
    scene.add(macaronFramboise);
    pastryNodes.push({
      mesh: macaronFramboise,
      initialPos: new THREE.Vector3(6.5, -4.5, -3.5),
      baseRotSpeed: new THREE.Vector3(-0.005, 0.008, 0.005),
      floatSpeed: 0.8,
      floatOffset: 3.5,
      scrollFactor: -0.004,
    });

    // 5. Tiered Mini Royal Entremet Cake (Distant center-right)
    const miniCake = createTieredCake('#26130B');
    miniCake.scale.set(0.38, 0.38, 0.38);
    scene.add(miniCake);
    pastryNodes.push({
      mesh: miniCake,
      initialPos: new THREE.Vector3(8.5, -0.5, -7),
      baseRotSpeed: new THREE.Vector3(0.002, 0.006, 0.001),
      floatSpeed: 0.7,
      floatOffset: 4.2,
      scrollFactor: 0.0025,
    });

    // 6. Gold Honeycomb Caramel Macaron (Deep background)
    const macaronGold = createMacaron('#D4AF37', '#6A411B', 0.55);
    scene.add(macaronGold);
    pastryNodes.push({
      mesh: macaronGold,
      initialPos: new THREE.Vector3(-3.5, -6.5, -6),
      baseRotSpeed: new THREE.Vector3(0.007, 0.005, 0.004),
      floatSpeed: 1.0,
      floatOffset: 5.1,
      scrollFactor: 0.003,
    });

    // 7. Saint-Honoré Choux Puff (Far upper corner)
    const chouxPuff = createChouxPastry();
    chouxPuff.scale.set(0.42, 0.42, 0.42);
    scene.add(chouxPuff);
    pastryNodes.push({
      mesh: chouxPuff,
      initialPos: new THREE.Vector3(-8.8, 1.2, -8),
      baseRotSpeed: new THREE.Vector3(0.003, 0.005, -0.003),
      floatSpeed: 0.95,
      floatOffset: 0.7,
      scrollFactor: -0.002,
    });

    // Initial position setup
    pastryNodes.forEach((node) => {
      node.mesh.position.copy(node.initialPos);
      node.mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
    });

    // Scroll & Mouse Tracking
    let targetScroll = window.scrollY;
    let currentScroll = window.scrollY;
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleScroll = () => {
      targetScroll = window.scrollY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth lerp for scroll and mouse
      currentScroll += (targetScroll - currentScroll) * 0.08;
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Camera subtle parallax
      camera.position.x = mouseX * 0.8;
      camera.position.y = -mouseY * 0.5;
      camera.lookAt(0, 0, 0);

      // Animate each pastry
      pastryNodes.forEach((node) => {
        // Continuous gentle rotation + scroll rotation boost
        node.mesh.rotation.x += node.baseRotSpeed.x + (currentScroll * 0.0001);
        node.mesh.rotation.y += node.baseRotSpeed.y + (currentScroll * 0.00015);
        node.mesh.rotation.z += node.baseRotSpeed.z;

        // Floating sine wave bobbing
        const floatY = Math.sin(elapsedTime * node.floatSpeed + node.floatOffset) * 0.35;
        const scrollOffsetY = currentScroll * node.scrollFactor;

        node.mesh.position.y = node.initialPos.y + floatY - scrollOffsetY;
        node.mesh.position.x = node.initialPos.x + Math.cos(elapsedTime * 0.5 + node.floatOffset) * 0.15 + (mouseX * 0.3);
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      // Cleanup
      scene.clear();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-90 transition-opacity duration-1000"
    />
  );
};
