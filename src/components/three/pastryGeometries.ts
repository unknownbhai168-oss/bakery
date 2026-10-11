import * as THREE from 'three';

/**
 * Creates physically realistic pastry 3D models using Three.js procedural geometries
 * and studio-grade physically based materials (PBR) with clearcoats, subsurface warmth, and specular glazes.
 */

// Helper to create glossy glaze material
export function createGlazeMaterial(
  colorHex: string | number,
  finish: 'mirror' | 'velours' | 'gold_leaf' | 'satin' = 'mirror'
): THREE.Material {
  const color = new THREE.Color(colorHex);

  if (finish === 'gold_leaf') {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#D4AF37'),
      metalness: 0.95,
      roughness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 1.0,
    });
  }

  if (finish === 'velours') {
    return new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.85,
      metalness: 0.02,
    });
  }

  if (finish === 'satin') {
    return new THREE.MeshPhysicalMaterial({
      color: color,
      roughness: 0.28,
      metalness: 0.05,
      clearcoat: 0.5,
      clearcoatRoughness: 0.2,
    });
  }

  // Default: High-gloss mirror glaze
  return new THREE.MeshPhysicalMaterial({
    color: color,
    roughness: 0.1,
    metalness: 0.08,
    clearcoat: 1.0,
    clearcoatRoughness: 0.06,
    reflectivity: 0.95,
    ior: 1.5,
  });
}

// 1. TIERED CELEBRATION CAKE / ROYAL ENTREMET
export function createTieredCake(glazeColor = '#24140D', finish: 'mirror' | 'velours' | 'gold_leaf' | 'satin' = 'mirror'): THREE.Group {
  const group = new THREE.Group();

  // Marble/Gold Base Pedestal
  const pedestalGeo = new THREE.CylinderGeometry(2.3, 2.4, 0.15, 64);
  const pedestalMat = new THREE.MeshStandardMaterial({
    color: 0x1A1816,
    roughness: 0.3,
    metalness: 0.6,
  });
  const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
  pedestal.position.y = -1.5;
  pedestal.receiveShadow = true;
  group.add(pedestal);

  // Gold rim ring on pedestal
  const rimGeo = new THREE.TorusGeometry(2.35, 0.05, 16, 64);
  const rimMat = new THREE.MeshStandardMaterial({
    color: 0xD4AF37,
    metalness: 0.9,
    roughness: 0.2,
  });
  const rim = new THREE.Mesh(rimGeo, rimMat);
  rim.rotation.x = Math.PI / 2;
  rim.position.y = -1.42;
  group.add(rim);

  // Bottom Tier - Dark Cocoa / Almond Biscuit Core
  const bottomTierGeo = new THREE.CylinderGeometry(1.9, 1.9, 1.3, 64);
  const cakeSpongeMat = new THREE.MeshStandardMaterial({
    color: 0x2A1910,
    roughness: 0.65,
  });
  const bottomTier = new THREE.Mesh(bottomTierGeo, cakeSpongeMat);
  bottomTier.position.y = -0.75;
  bottomTier.castShadow = true;
  bottomTier.receiveShadow = true;
  group.add(bottomTier);

  // Bottom Tier Glaze Shell
  const bottomGlazeMat = createGlazeMaterial(glazeColor, finish);
  const bottomGlazeGeo = new THREE.CylinderGeometry(1.92, 1.92, 1.28, 64);
  const bottomGlaze = new THREE.Mesh(bottomGlazeGeo, bottomGlazeMat);
  bottomGlaze.position.y = -0.75;
  bottomGlaze.castShadow = true;
  group.add(bottomGlaze);

  // Piped Cream Pearls around bottom tier base
  const creamMat = new THREE.MeshStandardMaterial({
    color: 0xFDFBF7,
    roughness: 0.35,
    metalness: 0.05,
  });
  const pearlCount = 28;
  for (let i = 0; i < pearlCount; i++) {
    const angle = (i / pearlCount) * Math.PI * 2;
    const pearlGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const pearl = new THREE.Mesh(pearlGeo, creamMat);
    pearl.position.set(Math.cos(angle) * 1.9, -1.35, Math.sin(angle) * 1.9);
    pearl.scale.set(1, 0.8, 1);
    group.add(pearl);
  }

  // Intermediate Gold Leaf Belt
  const beltGeo = new THREE.CylinderGeometry(1.93, 1.93, 0.06, 64);
  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xD4AF37,
    metalness: 0.92,
    roughness: 0.18,
  });
  const belt = new THREE.Mesh(beltGeo, goldMat);
  belt.position.y = -0.15;
  group.add(belt);

  // Top Tier
  const topTierGeo = new THREE.CylinderGeometry(1.3, 1.3, 1.1, 64);
  const topTier = new THREE.Mesh(topTierGeo, bottomGlazeMat);
  topTier.position.y = 0.45;
  topTier.castShadow = true;
  topTier.receiveShadow = true;
  group.add(topTier);

  // Piped Cream Rosettes around top tier rim
  const topPearlCount = 20;
  for (let i = 0; i < topPearlCount; i++) {
    const angle = (i / topPearlCount) * Math.PI * 2;
    const rosetteGeo = new THREE.ConeGeometry(0.12, 0.18, 12);
    const rosette = new THREE.Mesh(rosetteGeo, creamMat);
    rosette.position.set(Math.cos(angle) * 1.25, 1.05, Math.sin(angle) * 1.25);
    rosette.rotation.y = angle;
    group.add(rosette);
  }

  // Fresh Raspberries Crown on Top
  const berryMat = new THREE.MeshPhysicalMaterial({
    color: 0xB81432,
    roughness: 0.25,
    metalness: 0.05,
    clearcoat: 0.8,
    clearcoatRoughness: 0.15,
  });

  const berryPositions = [
    [0, 1.15, 0],
    [0.45, 1.12, 0.3],
    [-0.45, 1.12, -0.2],
    [0.2, 1.12, -0.45],
    [-0.35, 1.12, 0.4],
  ];

  berryPositions.forEach((pos) => {
    const berryGroup = new THREE.Group();
    // Compound cluster of drupelets for realistic raspberry texture
    const centerGeo = new THREE.SphereGeometry(0.18, 12, 12);
    const centerMesh = new THREE.Mesh(centerGeo, berryMat);
    berryGroup.add(centerMesh);

    for (let j = 0; j < 12; j++) {
      const u = Math.random() * Math.PI * 2;
      const v = Math.random() * Math.PI;
      const drupelet = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), berryMat);
      drupelet.position.set(
        Math.sin(v) * Math.cos(u) * 0.18,
        Math.cos(v) * 0.18,
        Math.sin(v) * Math.sin(u) * 0.18
      );
      berryGroup.add(drupelet);
    }
    berryGroup.position.set(pos[0], pos[1], pos[2]);
    group.add(berryGroup);
  });

  // Delicate Chocolate Curls & Gold Leaf Accents
  for (let i = 0; i < 4; i++) {
    const flakeGeo = new THREE.PlaneGeometry(0.18, 0.14);
    const flake = new THREE.Mesh(flakeGeo, goldMat);
    const ang = (i / 4) * Math.PI * 2 + 0.3;
    flake.position.set(Math.cos(ang) * 0.7, 1.16, Math.sin(ang) * 0.7);
    flake.rotation.set(Math.random() * 0.6, Math.random() * Math.PI, Math.random() * 0.4);
    group.add(flake);
  }

  // Dark Chocolate Sail / Arch
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.5, 1.0, 0),
    new THREE.Vector3(-0.2, 1.6, 0.2),
    new THREE.Vector3(0.3, 1.8, -0.1),
    new THREE.Vector3(0.5, 1.3, 0.1),
  ]);
  const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.05, 12, false);
  const chocMat = new THREE.MeshPhysicalMaterial({
    color: 0x1A0D08,
    roughness: 0.15,
    clearcoat: 0.9,
  });
  const chocSail = new THREE.Mesh(tubeGeo, chocMat);
  group.add(chocSail);

  return group;
}

// 2. GLAZED BRIOCHE DONUT
export function createGlazedDonut(
  glazeColor = '#E86B86',
  finish: 'mirror' | 'velours' | 'gold_leaf' | 'satin' = 'mirror'
): THREE.Group {
  const group = new THREE.Group();

  // Fluffy Brioche Ring
  const doughGeo = new THREE.TorusGeometry(1.4, 0.68, 36, 64);
  const doughMat = new THREE.MeshStandardMaterial({
    color: 0xDE9B52, // Warm toasted golden brioche
    roughness: 0.78,
    metalness: 0.02,
  });
  const dough = new THREE.Mesh(doughGeo, doughMat);
  dough.rotation.x = Math.PI / 2;
  dough.castShadow = true;
  dough.receiveShadow = true;
  group.add(dough);

  // Glossy Mirror Glaze (Upper Half of Ring with undulating drips)
  const glazeGeo = new THREE.TorusGeometry(1.4, 0.71, 36, 64, Math.PI * 1.6);
  const glazeMat = createGlazeMaterial(glazeColor, finish);
  const glaze = new THREE.Mesh(glazeGeo, glazeMat);
  glaze.rotation.x = Math.PI / 2;
  glaze.rotation.z = -Math.PI * 0.2;
  glaze.position.y = 0.03;
  glaze.castShadow = true;
  group.add(glaze);

  // Organic Drip Droplets on the outer rim
  const dripMat = glazeMat;
  const dripAngles = [0.4, 1.2, 2.1, 3.0, 4.2, 5.1];
  dripAngles.forEach((angle, idx) => {
    const dripLength = 0.25 + (idx % 3) * 0.12;
    const dripGeo = new THREE.ConeGeometry(0.12, dripLength, 16);
    const drip = new THREE.Mesh(dripGeo, dripMat);
    const radius = 1.95;
    drip.position.set(Math.cos(angle) * radius, -0.15 - dripLength / 2, Math.sin(angle) * radius);
    drip.rotation.x = Math.PI; // point down
    drip.rotation.z = Math.cos(angle) * 0.3;
    group.add(drip);
  });

  // Artisanal Sugar Sprinkles & Edible Gold Pearls
  const sprinkleColors = [0xFFFFFF, 0xD4AF37, 0x4A2016, 0xFCEADE, 0x889C82];
  const sprinkleCount = 55;

  for (let i = 0; i < sprinkleCount; i++) {
    const angle = (i / sprinkleCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
    const tubeOffset = (Math.random() - 0.5) * 0.6;
    const r = 1.4 + tubeOffset;
    const h = Math.sqrt(Math.max(0, 0.7 * 0.7 - tubeOffset * tubeOffset)) * 0.95 + 0.05;

    const color = sprinkleColors[i % sprinkleColors.length];
    const sprinkleMat = new THREE.MeshStandardMaterial({
      color: color,
      roughness: color === 0xD4AF37 ? 0.2 : 0.4,
      metalness: color === 0xD4AF37 ? 0.9 : 0.05,
    });

    if (i % 4 === 0) {
      // Round pearl
      const pearlGeo = new THREE.SphereGeometry(0.065, 12, 12);
      const pearl = new THREE.Mesh(pearlGeo, sprinkleMat);
      pearl.position.set(Math.cos(angle) * r, h, Math.sin(angle) * r);
      group.add(pearl);
    } else {
      // Cylinder rod sprinkle
      const rodGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.18, 8);
      const rod = new THREE.Mesh(rodGeo, sprinkleMat);
      rod.position.set(Math.cos(angle) * r, h, Math.sin(angle) * r);
      rod.rotation.set(Math.PI / 2 + Math.random() * 0.4, Math.random() * Math.PI, Math.random() * 0.5);
      group.add(rod);
    }
  }

  return group;
}

// 3. FRENCH MACARON
export function createMacaron(
  shellColorHex = '#889C82',
  ganacheColorHex = '#382316',
  scale = 1.0
): THREE.Group {
  const group = new THREE.Group();

  const shellMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(shellColorHex),
    roughness: 0.38,
    metalness: 0.02,
  });

  const ganacheMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(ganacheColorHex),
    roughness: 0.18,
    clearcoat: 0.8,
    clearcoatRoughness: 0.1,
  });

  // Top Shell Dome
  const topDomeGeo = new THREE.SphereGeometry(1.4, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.35);
  const topDome = new THREE.Mesh(topDomeGeo, shellMat);
  topDome.scale.set(1, 0.55, 1);
  topDome.position.y = 0.22;
  topDome.castShadow = true;
  group.add(topDome);

  // Top Ruffled Foot
  const topFootGeo = new THREE.TorusGeometry(1.28, 0.14, 16, 48);
  const topFoot = new THREE.Mesh(topFootGeo, shellMat);
  topFoot.rotation.x = Math.PI / 2;
  topFoot.scale.set(1, 1, 0.5);
  topFoot.position.y = 0.22;
  group.add(topFoot);

  // Rich Ganache Center
  const ganacheGeo = new THREE.CylinderGeometry(1.22, 1.22, 0.32, 48);
  const ganache = new THREE.Mesh(ganacheGeo, ganacheMat);
  ganache.position.y = 0;
  group.add(ganache);

  // Bottom Ruffled Foot
  const bottomFoot = topFoot.clone();
  bottomFoot.position.y = -0.22;
  group.add(bottomFoot);

  // Bottom Shell Dome
  const bottomDome = topDome.clone();
  bottomDome.rotation.z = Math.PI;
  bottomDome.position.y = -0.22;
  group.add(bottomDome);

  // Gold dust fleck on top
  const goldFleckGeo = new THREE.PlaneGeometry(0.14, 0.1);
  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xD4AF37,
    metalness: 0.9,
    roughness: 0.2,
  });
  const goldFleck = new THREE.Mesh(goldFleckGeo, goldMat);
  goldFleck.position.set(0.2, 0.62, 0.1);
  goldFleck.rotation.set(-0.3, 0.2, 0.5);
  group.add(goldFleck);

  group.scale.set(scale, scale, scale);
  return group;
}

// 4. TRIO OF MACARONS (Pistachio, Raspberry, Gold Salted Caramel)
export function createMacaronTrio(): THREE.Group {
  const trio = new THREE.Group();

  const m1 = createMacaron('#7A966E', '#422416', 0.9); // Pistachio
  m1.position.set(-0.9, -0.4, 0.3);
  m1.rotation.set(0.15, 0.2, -0.25);
  trio.add(m1);

  const m2 = createMacaron('#E0607E', '#3D1B24', 0.95); // Raspberry
  m2.position.set(0.85, -0.3, -0.2);
  m2.rotation.set(-0.2, 0.4, 0.3);
  trio.add(m2);

  const m3 = createMacaron('#D4AF37', '#683F1A', 1.05); // Gold Caramel
  m3.position.set(0, 0.55, 0);
  m3.rotation.set(0.1, -0.3, 0.1);
  trio.add(m3);

  return trio;
}

// 5. ARTISANAL CROISSANT
export function createCroissant(): THREE.Group {
  const group = new THREE.Group();

  const pastryMat = new THREE.MeshStandardMaterial({
    color: 0xD18B47,
    roughness: 0.55,
    metalness: 0.05,
  });

  const flakeMat = new THREE.MeshPhysicalMaterial({
    color: 0xE8A965,
    roughness: 0.4,
    clearcoat: 0.3,
  });

  // Curved Crescent Body using segmented nested rings
  const segments = 12;
  for (let i = 0; i <= segments; i++) {
    const t = i / segments; // 0 to 1
    const angle = (t - 0.5) * Math.PI * 0.8;
    const r = 1.3;
    const x = Math.sin(angle) * r;
    const z = Math.cos(angle) * r - 1.2;

    // Radius tapers at ends and bulges in center
    const thickness = Math.sin(t * Math.PI) * 0.58 + 0.12;
    const ringGeo = new THREE.SphereGeometry(thickness, 16, 16);
    const mesh = new THREE.Mesh(ringGeo, i % 2 === 0 ? pastryMat : flakeMat);
    mesh.position.set(x, 0, z);
    mesh.scale.set(1.2, 0.9, 1);
    group.add(mesh);
  }

  // Butter shine tips
  group.rotation.x = 0.3;
  return group;
}

// 6. SAINT-HONORÉ CHOUX CREATION
export function createChouxPastry(): THREE.Group {
  const group = new THREE.Group();

  // Puff Pastry Flaky Base
  const baseGeo = new THREE.CylinderGeometry(1.7, 1.8, 0.3, 48);
  const baseMat = new THREE.MeshStandardMaterial({
    color: 0xC98342,
    roughness: 0.65,
  });
  const base = new THREE.Mesh(baseGeo, baseMat);
  base.position.y = -0.9;
  group.add(base);

  // 4 Golden Choux Puffs ringed around
  const chouxMat = new THREE.MeshStandardMaterial({
    color: 0xDE9954,
    roughness: 0.5,
  });
  const caramelMat = new THREE.MeshPhysicalMaterial({
    color: 0x94420A,
    roughness: 0.08,
    clearcoat: 1.0,
    reflectivity: 0.9,
  });

  const puffCount = 5;
  for (let i = 0; i < puffCount; i++) {
    const angle = (i / puffCount) * Math.PI * 2;
    const puff = new THREE.Mesh(new THREE.SphereGeometry(0.42, 20, 20), chouxMat);
    puff.position.set(Math.cos(angle) * 1.2, -0.5, Math.sin(angle) * 1.2);
    group.add(puff);

    // Crackling amber caramel disc on top of each puff
    const caramelTop = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.05, 20), caramelMat);
    caramelTop.position.set(Math.cos(angle) * 1.2, -0.15, Math.sin(angle) * 1.2);
    group.add(caramelTop);
  }

  // Central Mountain of Vanilla Bean Chantilly Cream
  const creamMat = new THREE.MeshStandardMaterial({
    color: 0xFDFBF7,
    roughness: 0.3,
  });

  for (let layer = 0; layer < 4; layer++) {
    const layerRadius = 0.9 - layer * 0.22;
    const layerY = -0.5 + layer * 0.38;
    const count = 8 - layer;
    for (let j = 0; j < count; j++) {
      const ang = (j / count) * Math.PI * 2 + layer * 0.3;
      const swirl = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.35, 12), creamMat);
      swirl.position.set(Math.cos(ang) * layerRadius, layerY, Math.sin(ang) * layerRadius);
      swirl.rotation.y = ang;
      group.add(swirl);
    }
  }

  // Gold Leaf crowning peak
  const goldCrown = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 12, 12),
    new THREE.MeshStandardMaterial({ color: 0xD4AF37, metalness: 0.95, roughness: 0.15 })
  );
  goldCrown.position.y = 1.05;
  group.add(goldCrown);

  return group;
}
