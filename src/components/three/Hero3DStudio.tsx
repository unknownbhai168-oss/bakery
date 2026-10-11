import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  createTieredCake,
  createGlazedDonut,
  createMacaronTrio,
  createChouxPastry,
} from './pastryGeometries.ts';
import { GlazeFinish } from '../../types.ts';
import { RotateCw, Sparkles, Check, Plus, Info } from 'lucide-react';

interface Hero3DStudioProps {
  onAddToCart: (pastryId: string, finish: GlazeFinish) => void;
}

type ModelType = 'cake' | 'donut' | 'macarons' | 'choux';

interface ModelOption {
  id: ModelType;
  pastryId: string;
  name: string;
  frenchName: string;
  price: number;
  baseColor: string;
  flavorKicker: string;
  temperature: string;
  textureNotes: string;
}

const MODEL_OPTIONS: ModelOption[] = [
  {
    id: 'cake',
    pastryId: 'opera-royale',
    name: 'Opéra Impérial Royal',
    frenchName: 'Entremet Royal aux Feuilles d’Or',
    price: 38,
    baseColor: '#24140D',
    flavorKicker: 'Valrhona Guanaja 70% · Espresso Éthiopien · Or 24K',
    temperature: '14°C — 16°C',
    textureNotes: '8 Crisp Joconde Strata / Velvety Ganache',
  },
  {
    id: 'donut',
    pastryId: 'fraises-donut',
    name: 'Haute Brioche Strawberry Donut',
    frenchName: 'Beignet Brioché Mara des Bois',
    price: 9.5,
    baseColor: '#E86B86',
    flavorKicker: 'Fraise Mara des Bois · Beurre Isigny · Perles Sucrées',
    temperature: 'Fresh Room Temp',
    textureNotes: 'Slow-Proofed Honeycomb Brioche / Glossy Glaze',
  },
  {
    id: 'macarons',
    pastryId: 'paris-macaron-collection',
    name: 'Trio Macarons Haute Collection',
    frenchName: 'Pistache Bronte · Framboise · Caramel Salé',
    price: 24,
    baseColor: '#7A966E',
    flavorKicker: 'Pistache DOP · Meringue Française · Fleur de Sel',
    temperature: 'Chilled / 12°C',
    textureNotes: 'Shatteringly Crisp Shells / Silky Whipped Ganache',
  },
  {
    id: 'choux',
    pastryId: 'saint-honore',
    name: 'Saint-Honoré d’Or Tradition',
    frenchName: 'Choux Caramélisés & Crème Diplomate',
    price: 36,
    baseColor: '#C67D32',
    flavorKicker: 'Vanille Bourbon · Caramel Ambré · Pâte Feuilletée',
    temperature: 'Fresh Daily / 10°C',
    textureNotes: 'Crackling Hard Caramel / Billowy Chantilly Swirls',
  },
];

const GLAZE_OPTIONS: { id: GlazeFinish; label: string; desc: string }[] = [
  { id: 'mirror', label: 'Miroir Glacé', desc: 'Ultra-reflective high gloss' },
  { id: 'velours', label: 'Velours Mat', desc: 'Soft powdered matte finish' },
  { id: 'gold_leaf', label: 'Feuille d’Or 24K', desc: 'Precious gold leaf luster' },
  { id: 'satin', label: 'Satin Ganache', desc: 'Rich artisanal semi-gloss' },
];

export const Hero3DStudio: React.FC<Hero3DStudioProps> = ({ onAddToCart }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeModel, setActiveModel] = useState<ModelType>('cake');
  const [activeFinish, setActiveFinish] = useState<GlazeFinish>('mirror');
  const [isAdded, setIsAdded] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);

  // References to keep Three.js state
  const sceneRef = useRef<THREE.Scene | null>(null);
  const currentModelGroup = useRef<THREE.Group | null>(null);
  const rotationGroup = useRef<THREE.Group | null>(null);

  const selectedOption = MODEL_OPTIONS.find((m) => m.id === activeModel) || MODEL_OPTIONS[0];

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
    camera.position.set(0, 1.8, 7.5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // Parent group for rotatable model
    const rotGroup = new THREE.Group();
    scene.add(rotGroup);
    rotationGroup.current = rotGroup;

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xFFF7EC, 0.9);
    scene.add(ambientLight);

    // Warm Key Light (casts shadow)
    const keyLight = new THREE.DirectionalLight(0xFFE8C8, 2.2);
    keyLight.position.set(6, 9, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 25;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    // Soft Rim Light (Gold accent from behind)
    const rimLight = new THREE.DirectionalLight(0xD4AF37, 2.4);
    rimLight.position.set(-6, 4, -5);
    scene.add(rimLight);

    // Subtle Cool Fill Light from bottom left
    const fillLight = new THREE.PointLight(0xF8D2B0, 1.2, 20);
    fillLight.position.set(-5, -2, 4);
    scene.add(fillLight);

    // Soft Contact Shadow Plane underneath
    const shadowGeo = new THREE.PlaneGeometry(10, 10);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.35 });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -1.55;
    shadowMesh.receiveShadow = true;
    scene.add(shadowMesh);

    // Marble Floor Circle Ring
    const floorCircleGeo = new THREE.RingGeometry(0, 3.2, 64);
    const floorCircleMat = new THREE.MeshBasicMaterial({
      color: 0x1A1816,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4,
    });
    const floorCircle = new THREE.Mesh(floorCircleGeo, floorCircleMat);
    floorCircle.rotation.x = -Math.PI / 2;
    floorCircle.position.y = -1.56;
    scene.add(floorCircle);

    // Function to load the active model
    const loadModel = (model: ModelType, finish: GlazeFinish) => {
      if (currentModelGroup.current) {
        rotGroup.remove(currentModelGroup.current);
      }

      let newMesh: THREE.Group;
      if (model === 'cake') {
        newMesh = createTieredCake('#24140D', finish);
        newMesh.position.y = 0.15;
      } else if (model === 'donut') {
        newMesh = createGlazedDonut('#E86B86', finish);
        newMesh.position.y = 0;
        newMesh.scale.set(1.15, 1.15, 1.15);
      } else if (model === 'macarons') {
        newMesh = createMacaronTrio();
        newMesh.position.y = 0.1;
        newMesh.scale.set(1.3, 1.3, 1.3);
      } else {
        newMesh = createChouxPastry();
        newMesh.position.y = 0.25;
        newMesh.scale.set(1.1, 1.1, 1.1);
      }

      currentModelGroup.current = newMesh;
      rotGroup.add(newMesh);
    };

    loadModel(activeModel, activeFinish);

    // Interactive Drag / Orbit Tracking
    let isDragging = false;
    let previousMouseX = 0;
    let previousMouseY = 0;
    let targetRotationY = 0;
    let targetRotationX = 0.15;
    let autoRotate = true;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      setIsInteracting(true);
      autoRotate = false;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      previousMouseX = clientX;
      previousMouseY = clientY;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - previousMouseX;
      const deltaY = clientY - previousMouseY;

      targetRotationY += deltaX * 0.008;
      targetRotationX = Math.max(-0.4, Math.min(0.6, targetRotationX + deltaY * 0.008));

      previousMouseX = clientX;
      previousMouseY = clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
      setIsInteracting(false);
      // resume gentle auto-rotate after 2.5s of idle
      setTimeout(() => {
        if (!isDragging) autoRotate = true;
      }, 2500);
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    dom.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // Resize Handler
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
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (autoRotate) {
        targetRotationY += delta * 0.35;
      }

      // Smooth damping
      rotGroup.rotation.y += (targetRotationY - rotGroup.rotation.y) * 0.08;
      rotGroup.rotation.x += (targetRotationX - rotGroup.rotation.x) * 0.08;

      // Subtle breathing float
      if (currentModelGroup.current) {
        currentModelGroup.current.position.y += Math.sin(clock.getElapsedTime() * 1.5) * 0.001;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      dom.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      dom.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      window.removeEventListener('resize', handleResize);

      scene.clear();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update model when tab or finish changes
  useEffect(() => {
    if (!rotationGroup.current) return;
    const rotGroup = rotationGroup.current;

    if (currentModelGroup.current) {
      rotGroup.remove(currentModelGroup.current);
    }

    let newMesh: THREE.Group;
    if (activeModel === 'cake') {
      newMesh = createTieredCake(selectedOption.baseColor, activeFinish);
      newMesh.position.y = 0.15;
    } else if (activeModel === 'donut') {
      newMesh = createGlazedDonut(selectedOption.baseColor, activeFinish);
      newMesh.position.y = 0;
      newMesh.scale.set(1.15, 1.15, 1.15);
    } else if (activeModel === 'macarons') {
      newMesh = createMacaronTrio();
      newMesh.position.y = 0.1;
      newMesh.scale.set(1.3, 1.3, 1.3);
    } else {
      newMesh = createChouxPastry();
      newMesh.position.y = 0.25;
      newMesh.scale.set(1.1, 1.1, 1.1);
    }

    currentModelGroup.current = newMesh;
    rotGroup.add(newMesh);
  }, [activeModel, activeFinish, selectedOption]);

  const handleAdd = () => {
    onAddToCart(selectedOption.pastryId, activeFinish);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2200);
  };

  const handleResetView = () => {
    if (rotationGroup.current) {
      rotationGroup.current.rotation.set(0.15, 0, 0);
    }
  };

  return (
    <div className="relative w-full h-[520px] md:h-[620px] lg:h-[660px] flex flex-col justify-between rounded-2xl bg-[#161413]/80 border border-[#2B2620] backdrop-blur-md overflow-hidden shadow-2xl">
      {/* Top Controls: 3D Pastry Switcher Tabs */}
      <div className="relative z-10 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 border-b border-[#2B2620]/80">
        <div className="flex items-center gap-1.5 p-1 bg-[#1A1816]/90 rounded-xl border border-[#2B2620]">
          {MODEL_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setActiveModel(opt.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 whitespace-nowrap shrink-0 ${
                activeModel === opt.id
                  ? 'bg-[#C5A059] text-[#121110] font-semibold shadow-md'
                  : 'text-[#A89F91] hover:text-[#F3EFE6] hover:bg-[#25221F]'
              }`}
            >
              {opt.name.split(' ')[0]} {opt.name.split(' ')[1] || ''}
            </button>
          ))}
        </div>

        {/* 360° Drag Indicator & Reset */}
        <div className="flex items-center gap-2 text-xs text-[#A89F91]">
          <span className="hidden sm:inline-flex items-center gap-1">
            <RotateCw className={`w-3.5 h-3.5 text-[#C5A059] ${isInteracting ? 'animate-spin' : ''}`} />
            <span>Interactive 360° Drag</span>
          </span>
          <button
            onClick={handleResetView}
            aria-label="Reset 3D camera angle"
            className="p-1.5 rounded-lg bg-[#1E1B18] text-[#A89F91] hover:text-[#F3EFE6] hover:bg-[#2A2622] transition-colors"
            title="Reset Angle"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main 3D Canvas Viewport */}
      <div
        ref={mountRef}
        className="relative flex-1 w-full h-full cursor-grab active:cursor-grabbing select-none"
        title="Click and drag to rotate the 3D pastry in 360°"
      />

      {/* Atmospheric Glaze Finisher & Culinary Spec HUD (Bottom Bar) */}
      <div className="relative z-10 p-4 sm:p-6 bg-[#161413]/90 border-t border-[#2B2620]/80 backdrop-blur-md">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Left: Pastry Title & Culinary Notes */}
          <div className="md:col-span-7">
            <div className="flex items-center gap-2 text-xs text-[#C5A059] mb-1">
              <span>{selectedOption.frenchName}</span>
              <span aria-hidden="true">·</span>
              <span>{selectedOption.temperature}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-medium text-[#FDFBF7] tracking-tight">
              {selectedOption.name}
            </h3>
            <p className="text-xs sm:text-sm text-[#A89F91] mt-1 line-clamp-1">
              {selectedOption.flavorKicker}
            </p>

            {/* Glaze Finish Switcher Buttons */}
            <div className="mt-3 flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-[#8C8375] mr-1 uppercase tracking-wider font-medium">Finition:</span>
              {GLAZE_OPTIONS.map((finish) => (
                <button
                  key={finish.id}
                  onClick={() => setActiveFinish(finish.id)}
                  className={`px-2.5 py-1 text-[11px] rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    activeFinish === finish.id
                      ? 'bg-[#2A251E] text-[#D4AF37] border border-[#C5A059]/40'
                      : 'bg-[#1C1A18] text-[#8C8375] hover:text-[#DDD5C7] border border-transparent'
                  }`}
                  title={finish.desc}
                >
                  {finish.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Price & Direct Add Action */}
          <div className="md:col-span-5 flex items-center justify-between md:justify-end gap-4 pt-2 md:pt-0 border-t md:border-t-0 border-[#2B2620]">
            <div className="text-left md:text-right">
              <div className="text-[11px] uppercase tracking-wider text-[#8C8375]">Prix Atelier</div>
              <div className="text-2xl font-serif font-medium text-[#FDFBF7] tabular-nums">
                ${selectedOption.price.toFixed(2)}
              </div>
            </div>

            <button
              onClick={handleAdd}
              disabled={isAdded}
              className={`px-5 py-2.5 rounded-xl font-medium text-xs sm:text-sm flex items-center gap-2 transition-all duration-200 whitespace-nowrap shrink-0 ${
                isAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#C5A059] hover:bg-[#D4AF37] text-[#121110] active:scale-[0.98] shadow-lg shadow-[#C5A059]/20'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Box</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add To Tasting Box</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
