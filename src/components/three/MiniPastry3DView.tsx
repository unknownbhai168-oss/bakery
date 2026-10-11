import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  createTieredCake,
  createGlazedDonut,
  createMacaron,
  createCroissant,
  createChouxPastry,
} from './pastryGeometries.ts';

interface MiniPastry3DViewProps {
  modelType: 'cake' | 'donut' | 'macaron' | 'croissant' | 'choux';
  glazeColor?: string;
  accentColor?: string;
  isHovered?: boolean;
}

export const MiniPastry3DView: React.FC<MiniPastry3DViewProps> = ({
  modelType,
  glazeColor = '#24140D',
  isHovered = false,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const isHoveredRef = useRef(isHovered);

  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 300;
    const height = container.clientHeight || 240;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 50);
    camera.position.set(0, 1.4, 5.2);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // Warm Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xFFF6EA, 1.0);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xFFE8CF, 2.0);
    keyLight.position.set(5, 7, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xD4AF37, 1.8);
    rimLight.position.set(-5, 3, -4);
    scene.add(rimLight);

    // Contact shadow disc
    const shadowGeo = new THREE.CircleGeometry(1.6, 32);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x0A0908,
      transparent: true,
      opacity: 0.35,
    });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -1.1;
    scene.add(shadow);

    // Pastry Group
    const group = new THREE.Group();
    scene.add(group);
    modelGroupRef.current = group;

    // Generate model based on type
    let pastryMesh: THREE.Group;
    if (modelType === 'cake') {
      pastryMesh = createTieredCake(glazeColor);
      pastryMesh.scale.set(0.68, 0.68, 0.68);
      pastryMesh.position.y = -0.15;
    } else if (modelType === 'donut') {
      pastryMesh = createGlazedDonut(glazeColor);
      pastryMesh.scale.set(0.72, 0.72, 0.72);
      pastryMesh.position.y = -0.2;
    } else if (modelType === 'macaron') {
      pastryMesh = createMacaron(glazeColor, '#3A2016', 0.85);
      pastryMesh.position.y = -0.1;
    } else if (modelType === 'croissant') {
      pastryMesh = createCroissant();
      pastryMesh.scale.set(0.8, 0.8, 0.8);
      pastryMesh.position.y = -0.2;
    } else {
      pastryMesh = createChouxPastry();
      pastryMesh.scale.set(0.75, 0.75, 0.75);
      pastryMesh.position.y = -0.05;
    }

    group.add(pastryMesh);

    // Interaction on mouse move over the card
    let targetRotY = 0.2;
    let targetRotX = 0.15;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      targetRotY = x * 0.8;
      targetRotX = 0.15 - y * 0.4;
    };

    const onMouseLeave = () => {
      targetRotY = 0.2;
      targetRotX = 0.15;
    };

    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseleave', onMouseLeave);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Continuous gentle rotation if hovered, or idle sway
      if (isHoveredRef.current) {
        group.rotation.y += delta * 1.5;
        group.rotation.x += (targetRotX - group.rotation.x) * 0.1;
      } else {
        group.rotation.y += delta * 0.4;
        group.rotation.x += (0.15 - group.rotation.x) * 0.05;
      }

      // Delicate floating
      group.position.y = Math.sin(clock.getElapsedTime() * 2) * 0.04;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('resize', handleResize);

      scene.clear();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [modelType, glazeColor]);

  return (
    <div
      ref={mountRef}
      className="w-full h-full relative cursor-pointer select-none flex items-center justify-center"
      aria-hidden="true"
    />
  );
};
