import * as THREE from 'three';

const synthwaveVertexShader = `
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec2 vUv;
  uniform float uTime;

  void main() {
    vPosition = position;
    vNormal = normal;
    vUv = uv;

    vec3 pos = position;
    pos += normal * sin(pos.x * 3.0 + uTime * 0.8) * 0.08;
    pos += normal * cos(pos.y * 2.5 + uTime * 0.6) * 0.06;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const synthwaveFragmentShader = `
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;

  void main() {
    float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);

    float stripe = sin(vPosition.y * 10.0 + uTime * 1.5) * 0.5 + 0.5;
    vec3 baseColor = mix(uColor1, uColor2, stripe);

    float glow = sin(vPosition.x * 8.0 - uTime * 2.0) * 0.5 + 0.5;
    baseColor = mix(baseColor, uColor3, glow * 0.4);

    baseColor += fresnel * uColor3 * 0.8;

    float scanline = sin(vUv.y * 80.0 + uTime * 0.5) * 0.03;
    baseColor += scanline;

    float alpha = 0.85 + fresnel * 0.15;
    gl_FragColor = vec4(baseColor, alpha);
  }
`;

const wireframeVertexShader = `
  varying vec3 vPosition;
  varying vec3 vNormal;

  void main() {
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const wireframeFragmentShader = `
  varying vec3 vPosition;
  varying vec3 vNormal;
  uniform vec3 uWireColor;
  uniform float uTime;

  void main() {
    float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 1.5);
    float pulse = sin(uTime * 2.0) * 0.15 + 0.85;
    vec3 color = uWireColor * fresnel * pulse * 1.5;
    float alpha = (0.3 + fresnel * 0.7) * pulse;
    gl_FragColor = vec4(color, alpha);
  }
`;

export function createHeroModel() {
  const group = new THREE.Group();

  const cyan = new THREE.Color(0xC5F6FF);
  const magenta = new THREE.Color(0xFF00FF);
  const yellow = new THREE.Color(0xF2D027);

  const mainGeo = new THREE.TorusKnotGeometry(1.2, 0.35, 200, 32, 2, 3);

  const mainMat = new THREE.ShaderMaterial({
    vertexShader: synthwaveVertexShader,
    fragmentShader: synthwaveFragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uColor1: { value: magenta },
      uColor2: { value: cyan },
      uColor3: { value: yellow },
    },
    transparent: true,
    side: THREE.DoubleSide,
  });

  const mainMesh = new THREE.Mesh(mainGeo, mainMat);
  group.add(mainMesh);

  const wireGeo = new THREE.TorusKnotGeometry(1.25, 0.37, 80, 16, 2, 3);
  const wireMat = new THREE.ShaderMaterial({
    vertexShader: wireframeVertexShader,
    fragmentShader: wireframeFragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uWireColor: { value: cyan },
    },
    transparent: true,
    wireframe: true,
  });

  const wireMesh = new THREE.Mesh(wireGeo, wireMat);
  group.add(wireMesh);

  const innerGeo = new THREE.IcosahedronGeometry(0.5, 1);
  const innerMat = new THREE.MeshStandardMaterial({
    color: yellow,
    emissive: yellow,
    emissiveIntensity: 0.5,
    metalness: 0.8,
    roughness: 0.2,
    wireframe: true,
  });
  const innerMesh = new THREE.Mesh(innerGeo, innerMat);
  group.add(innerMesh);

  const particles = createParticles();
  group.add(particles);

  group.scale.set(0.01, 0.01, 0.01);

  return { group, mainMat, wireMat, innerMesh, particles };
}

function createParticles() {
  const count = 300;
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const radius = 2.5 + Math.random() * 3;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);

    sizes[i] = Math.random() * 3 + 1;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const mat = new THREE.PointsMaterial({
    color: 0xC5F6FF,
    size: 0.03,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });

  return new THREE.Points(geo, mat);
}

export function updateModelUniforms(mainMat, wireMat, time) {
  if (mainMat.uniforms) {
    mainMat.uniforms.uTime.value = time;
  }
  if (wireMat.uniforms) {
    wireMat.uniforms.uTime.value = time;
  }
}
