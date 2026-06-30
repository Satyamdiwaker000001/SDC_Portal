import * as THREE from 'three';

const vertexShader = `
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uMorphFactor;
  
  float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(
        mix(dot(i + vec3(0,0,0), vec3(127.1,311.7,74.7)), 
            dot(i + vec3(1,0,0), vec3(127.1,311.7,74.7)), f.x),
        mix(dot(i + vec3(0,1,0), vec3(127.1,311.7,74.7)), 
            dot(i + vec3(1,1,0), vec3(127.1,311.7,74.7)), f.x), f.y),
      mix(
        mix(dot(i + vec3(0,0,1), vec3(127.1,311.7,74.7)), 
            dot(i + vec3(1,0,1), vec3(127.1,311.7,74.7)), f.x),
        mix(dot(i + vec3(0,1,1), vec3(127.1,311.7,74.7)), 
            dot(i + vec3(1,1,1), vec3(127.1,311.7,74.7)), f.x), f.y), f.z) * 0.01;
  }

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    
    vec3 pos = position;
    float n = noise(pos * 0.5 + uTime * 0.1);
    pos += normal * n * uMorphFactor * 0.3;
    pos += normal * sin(pos.x * 2.0 + uTime) * 0.02 * uMorphFactor;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uFresnelColor;
  uniform float uIntensity;
  
  float fresnel(vec3 viewDir, vec3 normal, float power) {
    return pow(1.0 - abs(dot(viewDir, normal)), power);
  }

  void main() {
    vec3 viewDir = normalize(-vPosition);
    float f = fresnel(viewDir, vNormal, 2.5);
    
    float pattern = sin(vPosition.y * 3.0 + uTime * 0.5) * 0.5 + 0.5;
    pattern += sin(vPosition.z * 2.0 - uTime * 0.3) * 0.25;
    
    vec3 baseColor = mix(uColorA, uColorB, pattern);
    vec3 color = baseColor + uFresnelColor * f * 0.8;
    
    float glow = sin(vUv.x * 20.0 + uTime * 2.0) * 0.05 + 0.1;
    color += uFresnelColor * glow * f;
    
    float scanline = sin(vUv.y * 100.0 + uTime * 5.0) * 0.02;
    color += scanline;
    
    float alpha = 0.7 + f * 0.3;
    gl_FragColor = vec4(color * uIntensity, alpha);
  }
`;

const wireframeVertexShader = `
  varying vec3 vPosition;
  varying vec3 vNormal;
  uniform float uTime;
  
  void main() {
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const wireframeFragmentShader = `
  varying vec3 vPosition;
  varying vec3 vNormal;
  uniform float uTime;
  uniform vec3 uWireColor;
  
  void main() {
    vec3 viewDir = normalize(-vPosition);
    float f = pow(1.0 - abs(dot(viewDir, vNormal)), 1.5);
    
    float pulse = sin(uTime * 3.0) * 0.3 + 0.7;
    float grid = step(0.95, fract(vPosition.x * 5.0)) + step(0.95, fract(vPosition.z * 5.0));
    grid = min(grid, 1.0);
    
    vec3 color = uWireColor * (f * 0.8 + grid * 0.5) * pulse;
    float alpha = (f * 0.4 + grid * 0.3) * pulse;
    
    gl_FragColor = vec4(color, alpha);
  }
`;

const particleVertexShader = `
  attribute float aSize;
  attribute float aSpeed;
  attribute vec3 aOffset;
  varying float vAlpha;
  uniform float uTime;
  uniform float uPixelRatio;
  
  void main() {
    vec3 pos = position + aOffset;
    pos.y += sin(uTime * aSpeed + position.x * 0.5) * 0.5;
    pos.x += cos(uTime * aSpeed * 0.7 + position.z * 0.3) * 0.3;
    pos.z += sin(uTime * aSpeed * 0.5 + position.y * 0.2) * 0.2;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = aSize * uPixelRatio * (300.0 / -mvPosition.z);
    vAlpha = 1.0 - length(pos) * 0.1;
  }
`;

const particleFragmentShader = `
  varying float vAlpha;
  uniform vec3 uColor;
  uniform float uTime;
  
  void main() {
    float dist = length(gl_PointCoord - 0.5);
    float alpha = smoothstep(0.5, 0.1, dist) * vAlpha;
    alpha *= sin(uTime * 2.0) * 0.2 + 0.8;
    
    vec3 color = uColor * (1.0 + sin(uTime + gl_PointCoord.x * 10.0) * 0.2);
    gl_FragColor = vec4(color, alpha);
  }
`;

function createGeometry() {
  const geo = new THREE.IcosahedronGeometry(2, 8);
  
  const posAttr = geo.getAttribute('position');
  const count = posAttr.count;
  
  const speeds = new Float32Array(count);
  const offsets = new Float32Array(count * 3);
  
  for (let i = 0; i < count; i++) {
    speeds[i] = 0.5 + Math.random() * 1.5;
    offsets[i * 3] = (Math.random() - 0.5) * 0.2;
    offsets[i * 3 + 1] = (Math.random() - 0.5) * 0.2;
    offsets[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
  }
  
  geo.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1));
  geo.setAttribute('aOffset', new THREE.BufferAttribute(offsets, 3));
  
  return geo;
}

function createWireGeometry() {
  const geo = new THREE.IcosahedronGeometry(2.05, 6);
  const edges = new THREE.EdgesGeometry(geo);
  return edges;
}

function createParticles(count = 500) {
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const speeds = new Float32Array(count);
  const offsets = new Float32Array(count * 3);
  
  for (let i = 0; i < count; i++) {
    const radius = 3 + Math.random() * 5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);
    
    sizes[i] = 0.5 + Math.random() * 1.5;
    speeds[i] = 0.3 + Math.random() * 1.2;
    
    offsets[i * 3] = (Math.random() - 0.5) * 0.5;
    offsets[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
    offsets[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
  }
  
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
  geo.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1));
  geo.setAttribute('aOffset', new THREE.BufferAttribute(offsets, 3));
  
  return geo;
}

function createModel() {
  const group = new THREE.Group();
  
  const mainGeo = createGeometry();
  
  const mainMaterial = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uMorphFactor: { value: 0 },
      uColorA: { value: new THREE.Color(0x0a1a2e) },
      uColorB: { value: new THREE.Color(0x162a4a) },
      uFresnelColor: { value: new THREE.Color(0x00ff88) },
      uIntensity: { value: 1 },
    },
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  
  const mainMesh = new THREE.Mesh(mainGeo, mainMaterial);
  mainMesh.castShadow = true;
  mainMesh.receiveShadow = true;
  group.add(mainMesh);
  
  const wireGeo = createWireGeometry();
  const wireMaterial = new THREE.ShaderMaterial({
    vertexShader: wireframeVertexShader,
    fragmentShader: wireframeFragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uWireColor: { value: new THREE.Color(0x00ff88) },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  
  const wireMesh = new THREE.Mesh(wireGeo, wireMaterial);
  group.add(wireMesh);
  
  const particleGeo = createParticles(800);
  const particleMaterial = new THREE.ShaderMaterial({
    vertexShader: particleVertexShader,
    fragmentShader: particleFragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(0x00ff88) },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: false,
  });
  
  const particles = new THREE.Points(particleGeo, particleMaterial);
  group.add(particles);
  
  const coreGeo = new THREE.OctahedronGeometry(0.6, 0);
  const coreMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x00ff88,
    metalness: 0.9,
    roughness: 0.1,
    transmission: 0.3,
    thickness: 0.5,
    ior: 1.5,
    clearcoat: 1,
    clearcoatRoughness: 0,
    emissive: new THREE.Color(0x00ff88),
    emissiveIntensity: 0.5,
  });
  const core = new THREE.Mesh(coreGeo, coreMaterial);
  group.add(core);
  
  const ringGeo = new THREE.RingGeometry(1.2, 1.5, 64);
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ff88,
    transparent: true,
    opacity: 0.15,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  });
  const ring = new THREE.Mesh(ringGeo, ringMaterial);
  ring.rotation.x = -Math.PI / 2;
  group.add(ring);
  
  const ring2 = ring.clone();
  ring2.rotation.x = Math.PI / 2;
  ring2.scale.setScalar(1.3);
  ring2.material = ringMaterial.clone();
  ring2.material.opacity = 0.08;
  group.add(ring2);
  
  return {
    group,
    mainMesh,
    mainMaterial,
    wireMesh,
    wireMaterial,
    particles,
    particleMaterial,
    core,
    ring,
    ring2,
    morphFactor: 0,
    targetMorph: 0,
  };
}

function animateModel(model, time) {
  if (!model) return;
  
  const { group, mainMaterial, wireMaterial, particleMaterial, core, ring, ring2, mainMesh } = model;
  
  group.rotation.y += 0.0003;
  group.rotation.x = Math.sin(time * 0.2) * 0.05;
  
  if (mainMaterial.uniforms) {
    mainMaterial.uniforms.uTime.value = time;
    model.morphFactor += (model.targetMorph - model.morphFactor) * 0.02;
    mainMaterial.uniforms.uMorphFactor.value = model.morphFactor;
  }
  
  if (wireMaterial.uniforms) {
    wireMaterial.uniforms.uTime.value = time;
  }
  
  if (particleMaterial.uniforms) {
    particleMaterial.uniforms.uTime.value = time;
  }
  
  core.rotation.x += 0.005;
  core.rotation.y += 0.003;
  core.rotation.z += 0.002;
  
  ring.rotation.z += 0.001;
  ring2.rotation.z -= 0.0015;
  
  mainMesh.scale.setScalar(1 + Math.sin(time * 0.5) * 0.02);
}

export { createModel, animateModel };