// const canvas = document.getElementById('noiseCanvas');
//     const ctx = canvas.getContext('2d');

//     let scale = 0.1; // 10% resolution for chunkier look

//     function resizeCanvas() {
//       canvas.width = Math.ceil(window.innerWidth * scale);
//       canvas.height = Math.ceil(window.innerHeight * scale);
//     }

//     window.addEventListener('resize', resizeCanvas);
//     resizeCanvas();

//     let frame = 0;

//     function generateNoise() {
//       const imageData = ctx.createImageData(canvas.width, canvas.height);
//       const buffer = new Uint32Array(imageData.data.buffer);

//       for (let i = 0; i < buffer.length; i++) {
//         const gray = Math.random() * 255 | 0;
//         buffer[i] = (255 << 24) | (gray << 16) | (gray << 8) | gray;
//       }

//       ctx.putImageData(imageData, 0, 0);
//     }

//     function loop() {
//       if (frame % 4 === 0) generateNoise();
//       frame++;
//       requestAnimationFrame(loop);
//     }

//     loop();
    
    
    // //   position: fixed;
    //   /* background-color: pink; */
    // //   background-color: blueviolet;
    // //   background-color:beige;
    //   /* background-color:aquamarine; */

    // // Color palettes for the gradient
    // // Each palette has 4 vectors used by the cosine gradient function
    // const PALETTE_1 = [
    //   new THREE.Vector3(0.5, 0.5, 0.5),
    //   new THREE.Vector3(0.9, 0.8, 0.1),
    //   new THREE.Vector3(1.0, 1.0, 1.0),
    //   new THREE.Vector3(0.0, 0.33, 0.67)
    // ];
    
    // // PALETTE_2 - Soft pastels
    // const PALETTE_2 = [
    //   new THREE.Vector3(0.996078431372549, 0.7725490196078432, 0.7725490196078432), // #D8E2DC
    //   new THREE.Vector3(0.9, 0.8, 0.1),
    //   new THREE.Vector3(1.0, 1.0, 1.0),
    //   new THREE.Vector3(0.0, 0.33, 0.67) // #FAE1DD
    // ];
    
    // // PALETTE_3 - Light purples
    // const PALETTE_3 = [
    //   new THREE.Vector3(0.99, 0.98, 0.96), // #FCFBF6
    //   new THREE.Vector3(1.0, 0.98, 0.95),  // #FFFBF1
    //   new THREE.Vector3(0.88, 0.82, 0.98), // #E0D0FA
    //   new THREE.Vector3(0.98, 0.87, 0.94)  // #FBDDF0
    // ];
    
    // // Array of all available palettes
    // const PALETTES = [PALETTE_1, PALETTE_2, PALETTE_3];

    // // Shader code
    // const vertexShader = `
    //   varying vec2 vUv;

    //   void main() {
    //       vUv = position.xy * 0.5 + 0.5; // Map NDC to UV coordinates
    //       gl_Position = vec4(position.xy, 0.0, 1.0); // Use NDC position
    //   }
    // `;

    // const fragmentShader = `
    //   // Fragment Shader
    //   uniform float uTime;
    //   // Config Uniforms
    //   uniform vec3 uColourPalette[4];
    //   uniform float uUvScale; // 1.0
    //   uniform float uUvDistortionIterations; // 4.0
    //   uniform float uUvDistortionIntensity; // 0.2
    //   uniform float uGrainAmount; // 0.35 - Controls the intensity of the RGB grain

    //   varying vec2 vUv;

    //   // Simplex noise function (simplified version of glsl-noise)
    //   vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    //   vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    //   vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    //   vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

    //   float snoise(vec3 v) {
    //     const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    //     const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    //     // First corner
    //     vec3 i  = floor(v + dot(v, C.yyy));
    //     vec3 x0 = v - i + dot(i, C.xxx);

    //     // Other corners
    //     vec3 g = step(x0.yzx, x0.xyz);
    //     vec3 l = 1.0 - g;
    //     vec3 i1 = min(g.xyz, l.zxy);
    //     vec3 i2 = max(g.xyz, l.zxy);

    //     vec3 x1 = x0 - i1 + C.xxx;
    //     vec3 x2 = x0 - i2 + C.yyy;
    //     vec3 x3 = x0 - D.yyy;

    //     // Permutations
    //     i = mod289(i);
    //     vec4 p = permute(permute(permute(
    //             i.z + vec4(0.0, i1.z, i2.z, 1.0))
    //           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    //           + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    //     // Gradients: 7x7 points over a square, mapped onto an octahedron.
    //     // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
    //     float n_ = 0.142857142857; // 1.0/7.0
    //     vec3 ns = n_ * D.wyz - D.xzx;

    //     vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    //     vec4 x_ = floor(j * ns.z);
    //     vec4 y_ = floor(j - 7.0 * x_);

    //     vec4 x = x_ *ns.x + ns.yyyy;
    //     vec4 y = y_ *ns.x + ns.yyyy;
    //     vec4 h = 1.0 - abs(x) - abs(y);

    //     vec4 b0 = vec4(x.xy, y.xy);
    //     vec4 b1 = vec4(x.zw, y.zw);

    //     vec4 s0 = floor(b0)*2.0 + 1.0;
    //     vec4 s1 = floor(b1)*2.0 + 1.0;
    //     vec4 sh = -step(h, vec4(0.0));

    //     vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    //     vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

    //     vec3 p0 = vec3(a0.xy, h.x);
    //     vec3 p1 = vec3(a0.zw, h.y);
    //     vec3 p2 = vec3(a1.xy, h.z);
    //     vec3 p3 = vec3(a1.zw, h.w);

    //     // Normalise gradients
    //     vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    //     p0 *= norm.x;
    //     p1 *= norm.y;
    //     p2 *= norm.z;
    //     p3 *= norm.w;

    //     // Mix final noise value
    //     vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    //     m = m * m;
    //     return 42.0 * dot(m*m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
    //   }

    //   // Color palette function
    //   // http://dev.thi.ng/gradients/
    //   vec3 cosineGradientColour(in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d) {
    //     return clamp(a + b * cos(6.28318 * (c * t + d)), 0.1, 1.0);
    //   }

    //   // Random hash function for grain
    //   float random(vec2 p) {
    //     vec3 p3 = fract(vec3(p.xyx) * vec3(443.897, 441.423, 437.195));
    //     p3 += dot(p3, p3.yzx + 19.19);
    //     return fract((p3.x + p3.y) * p3.z);
    //   }
      
    //   // Generate RGB noise
    //   vec3 rgbNoise(vec2 uv, float time) {
    //     // Offset each channel slightly for RGB effect
    //     float r = random(uv + 0.1 * vec2(cos(time), sin(time)));
    //     float g = random(uv + 0.1 * vec2(cos(time + 1.3), sin(time + 1.9)));
    //     float b = random(uv + 0.1 * vec2(cos(time + 2.7), sin(time + 3.4)));
    //     return vec3(r, g, b);
    //   }
      
    //   // Overlay blending function
    //   vec3 blendOverlay(vec3 base, vec3 blend) {
    //     return mix(
    //       2.0 * base * blend,
    //       1.0 - 2.0 * (1.0 - base) * (1.0 - blend),
    //       step(0.5, base)
    //     );
    //   }

    //   void main() {
    //     vec2 uv = vUv;
    //     // Scale the uv coordinates
    //     uv *= uUvScale;

    //     // Distort the uv coordinates with noise iterations
    //     for (float i = 0.0; i < uUvDistortionIterations; i++) {
    //       uv += snoise(vec3(uv - i * 0.2, uTime + i * 32.)) * uUvDistortionIntensity;
    //     }

    //     float colourInput = snoise(vec3(uv, sin(uTime))) * 0.5 + 0.5;
    //     vec3 colour = cosineGradientColour(colourInput, uColourPalette[0], uColourPalette[1], uColourPalette[2], uColourPalette[3]);
        
    //     // Generate RGB grain/noise 
    //     // Use a higher frequency for UV to create finer grain
    //     vec3 grain = rgbNoise(vUv * 500.0, uTime * 10.0);
        
    //     // Apply overlay blending with controllable intensity
    //     vec3 finalColor = mix(colour, blendOverlay(colour, grain), uGrainAmount);
        
    //     gl_FragColor = vec4(finalColor, 1.0);
    //   }
    // `;

    // // Setup Three.js scene
    // class BackgroundGradient {
    //   constructor(options = {}) {
    //     this.options = Object.assign({
    //       colourPalette: PALETTE_1,
    //       timeMultiplier: 0.04,
    //       scale: 2.3,
    //     // scale: 1.8,
    //       distortionIterations: 3,
    //       distortionIntensity: 0.3
    //     }, options);

    //     this.clock = new THREE.Clock();

    //     this.init();
    //     this.animate();
    //   }

    //   init() {
    //     // Create renderer
    //     this.renderer = new THREE.WebGLRenderer({ antialias: false });
    //     this.renderer.setSize(window.innerWidth, window.innerHeight);
    //     this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    //     document.body.appendChild(this.renderer.domElement);

    //     // Create scene and camera
    //     this.scene = new THREE.Scene();
    //     this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    //     // Create full-screen quad
    //     const geometry = new THREE.PlaneGeometry(2, 2);
        
    //     // Create shader material
    //     this.material = new THREE.ShaderMaterial({
    //       vertexShader,
    //       fragmentShader,
    //       uniforms: {
    //         uTime: { value: 0 },
    //         uColourPalette: { value: this.options.colourPalette },
    //         uUvScale: { value: this.options.scale },
    //         uUvDistortionIterations: { value: this.options.distortionIterations },
    //         uUvDistortionIntensity: { value: this.options.distortionIntensity },
    //         uGrainAmount: { value: 0.35 }
    //       }
    //     });

    //     // Create mesh
    //     this.quad = new THREE.Mesh(geometry, this.material);
    //     this.scene.add(this.quad);

    //     // Handle resize
    //     window.addEventListener('resize', this.onResize.bind(this));
    //   }

    //   onResize() {
    //     this.renderer.setSize(window.innerWidth, window.innerHeight);
    //   }

    //   animate() {
    //     const time = this.clock.getElapsedTime() * this.options.timeMultiplier;
        
    //     // Update uniforms
    //     this.material.uniforms.uTime.value = time;
        
    //     // Render
    //     this.renderer.render(this.scene, this.camera);
        
    //     // Request next frame
    //     requestAnimationFrame(this.animate.bind(this));
    //   }
    // }

    // // Initialize the gradient when DOM is loaded
    // document.addEventListener('DOMContentLoaded', () => {
    //   const gradient = new BackgroundGradient();
    // });