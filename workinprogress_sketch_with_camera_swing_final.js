// Seed: read from URL hash or generate a 5-digit seed and write it back
const hashMatch = window.location.hash.match(/#?seed=(\d+)/);
const SEED = hashMatch ? parseInt(hashMatch[1], 10) : Math.floor(Math.random() * 99999) + 1;
if (!hashMatch) window.location.hash = 'seed=' + SEED;
const rand = mulberry32(SEED);

// ─── Palette presets ────────────────────────────────────────────────────────
// tones[0..4]: light → dark room surfaces
// sky[0]: horizon color, sky[1]: zenith color
// curtain: dedicated curtain color
const PALETTES = [
  {
    name: 'nighthawks',
    tones: [0xba725e, 0xae6055, 0x985656, 0x7c4f53, 0x60484f],
    sky:   [0x4d5999, 0xd9f3fa],
    curtain: 0x6b4a3e
  },
  {
    name: 'morning_sun',
    tones: [0xf2c9b0, 0xe8b496, 0xd4977a, 0xb07868, 0x8a5c52],
    sky:   [0xc4d4e8, 0xfaead8],
    curtain: 0xf0e0cc
  },
  {
    name: 'room_brooklyn',
    tones: [0xd4dbc8, 0xb5c2a8, 0x8fa08a, 0x6e7d6a, 0x4d5a50],
    sky:   [0x5c7fa6, 0xd6e8f2],
    curtain: 0xe8ebe0
  },
  {
    name: 'sun_empty_room',
    tones: [0xf5e6b8, 0xe8cd87, 0xd4a85a, 0xb08040, 0x7a5c2a],
    sky:   [0x8fa8c8, 0xf5f0e0],
    curtain: 0xf0e8c0
  }
];

// ─── Composition choices (consume rand in fixed order) ────────────────────
const palette       = PALETTES[Math.floor(rand() * PALETTES.length)];
const curtainOpacity = rand() * 0.6 + 0.2;   // 0.2 – 0.8
const curtainGapSeed = rand() * 4.0 + 1.0;   // 1.0 – 5.0
const numPanes      = rand() < 0.5 ? 2 : 1;  // 4d: single or double pane

const roomWidth = 20;// revert back to  10

const scaleFactor = 2;
const chosenAspectRatio = { width: 4*2.3 * scaleFactor, height: 3 *4* scaleFactor }; // revery back to 9:16 without the additional scale factor
const casingThickness = 0.5 * scaleFactor; // Adjusting casing thickness proportionally
const casingTopGeometry = new THREE.BoxGeometry(chosenAspectRatio.width + 1 * casingThickness, casingThickness*1, 1);
const casingColor = new THREE.Color(palette.tones[0]);
const casingMaterials = new THREE.MeshBasicMaterial({ color: casingColor });

const casingTopMesh = new THREE.Mesh(casingTopGeometry, casingMaterials);
casingTopMesh.position.z = -10;
const casingBottomGeometry = new THREE.BoxGeometry(chosenAspectRatio.width + 1 * casingThickness, casingThickness *1, 1);
const casingBottomMesh = new THREE.Mesh(casingBottomGeometry, casingMaterials);
casingBottomMesh.position.z = -10;
const casingLeftGeometry = new THREE.BoxGeometry(casingThickness, chosenAspectRatio.height, 1);
const casingLeftMesh = new THREE.Mesh(casingLeftGeometry, casingMaterials);
casingLeftMesh.position.z = -10.5;
const casingRightGeometry = new THREE.BoxGeometry(casingThickness, chosenAspectRatio.height, 1);
const casingRightMesh = new THREE.Mesh(casingRightGeometry, casingMaterials);
casingRightMesh.position.z = -10.5;
const sillHeight = casingThickness * 0.9;
const sillDepth = 2.5;
const sillGeometry = new THREE.BoxGeometry(chosenAspectRatio.width + 5 * casingThickness, sillHeight, sillDepth);
const sillMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color(palette.tones[1]) });
const sillMesh = new THREE.Mesh(sillGeometry, sillMaterial);
sillMesh.position.z = -10;
const lintelHeight = casingThickness * 2.7;
const lintelWidth = chosenAspectRatio.width *1.3;
const lintelGeometry = new THREE.BoxGeometry(lintelWidth, lintelHeight, 1.5);
const lintelMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color(palette.tones[2]) });
const lintelMesh = new THREE.Mesh(lintelGeometry, lintelMaterial);
lintelMesh.position.z = -10;
lintelMesh.rotation.x = Math.PI / 4.9;

// Size of the dentil block, adjust as needed;
const dentilWidth = 1.2;
const dentilHeight = dentilWidth * 2;
const dentilDepth = 0.7;
const dentilGeometry = new THREE.BoxGeometry(dentilWidth, dentilHeight, dentilDepth);
const dentilMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color(palette.tones[3]) });
const dentilMesh = new THREE.Mesh(dentilGeometry, dentilMaterial);
dentilMesh.position.z = -9;
dentilMesh.rotation.x = Math.PI / 8;
const apronHeight = 3.5;
const apronGeometry = new THREE.BoxGeometry(chosenAspectRatio.width + 1.5 * casingThickness, apronHeight, 0.7);
const apronMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color(palette.tones[4]) });
const apronMesh = new THREE.Mesh(apronGeometry, apronMaterial);
apronMesh.position.z = -10;
apronMesh.rotation.x = Math.PI / 8;
const blockThickness = casingThickness * 2;
const blockGeometry = new THREE.BoxGeometry(blockThickness, blockThickness/1.2, 0.80); // Making it slightly thicker;

const blockMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color(palette.tones[0]) });
const topLeftBlock = new THREE.Mesh(blockGeometry, blockMaterial, );
const topRightBlock = new THREE.Mesh(blockGeometry, blockMaterial);
const bottomLeftBlock = new THREE.Mesh(blockGeometry, blockMaterial);
const bottomRightBlock = new THREE.Mesh(blockGeometry, blockMaterial);

// Curtains
const curtainGap = curtainGapSeed;
const curtainWidth = (chosenAspectRatio.width - curtainGap) / 2;
const curtainHeight = chosenAspectRatio.height;
const curtainDepth = 0;
const curtainGeometry = new THREE.BoxGeometry(curtainWidth, curtainHeight, curtainDepth);
const curtainMaterial = new THREE.MeshBasicMaterial({
  color: new THREE.Color(palette.curtain),
  transparent: true,
  opacity: curtainOpacity
});
const leftCurtainMesh = new THREE.Mesh(curtainGeometry, curtainMaterial);
leftCurtainMesh.position.z = -10.9;
const rightCurtainMesh = new THREE.Mesh(curtainGeometry, curtainMaterial);
rightCurtainMesh.position.z = -10.9;
// The width of the room, can be adjusted as needed;
const roomHeight = 25;

  // The height of the room, can be adjusted as needed;
const roomDepth = 40;

// **********************;
// Creation of the window;
// **********************;

// Initialization;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(90, 1080 / 1920, 0.01, 2000);
const renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true });
// false: set pixel buffer only — CSS controls display size
renderer.setSize(1080, 1920, false);
const canvasContainer = document.getElementById('canvas-container');
canvasContainer.appendChild(renderer.domElement);
canvasContainer.classList.add('canvas-ready');

renderer.setClearColor(0xeeeeee);
document.getElementById('seed-overlay').textContent = 'seed: ' + SEED;

// Window object: defines the shape and size of the window object.
//const windowGeometry = new THREE.BoxGeometry(chosenAspectRatio.width, chosenAspectRatio.height, 0.1);
//const windowMaterial = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 });
//const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
//scene.add(windowMesh);
//windowMesh.position.z = 0;

// Convert window and wall geometries to CSG (Constructive Solid Geometry);
//let windowCSG = THREE.CSG.fromMesh(windowMesh);


// Here we define the components of the window frame.
// Note: the window frame is defined by right curtain, left curtain, corner blocks, window apron, dentils, window header (lintel), window sill, right casing, left casing, bottom casing, top casing.

// Top Casing
casingTopMesh.position.y = chosenAspectRatio.height / 2.13;
scene.add(casingTopMesh);

// Bottom Casing
casingBottomMesh.position.y = -chosenAspectRatio.height / 2.13;
scene.add(casingBottomMesh);

// Left Casing;
casingLeftMesh.position.x = -chosenAspectRatio.width / 2 - casingThickness / 1;
scene.add(casingLeftMesh);

// Right Casing;
casingRightMesh.position.x = chosenAspectRatio.width / 2 + casingThickness / 1;
scene.add(casingRightMesh);

// Window Sill;
sillMesh.position.y = -chosenAspectRatio.height / 2 - sillHeight / 2;
scene.add(sillMesh);

// Window Header or Lintel;
lintelMesh.position.y = chosenAspectRatio.height / 2 + lintelHeight / 2;
scene.add(lintelMesh);

// Dentils;
// Depth of dentil, aligning it with other elements;
const dentilSpacing = dentilWidth * 2.15;
// Spacing between dentils, can be adjusted;
const totalDentils = Math.floor(chosenAspectRatio.width / dentilSpacing); // Calculate how many dentils we can fit;

for (let i = 0; i < totalDentils; i++) {
    // Create a clone of the dentilMesh for each iteration.
    const clonedDentilMesh = dentilMesh.clone();
    
    // Position the cloned dentil. Starting from the leftmost position and placing each one by its width + spacing.
    clonedDentilMesh.position.x = -chosenAspectRatio.width / 2 + (i * dentilSpacing) + dentilWidth / 2;
    clonedDentilMesh.position.y = chosenAspectRatio.height / 1.9; // Position it just below the lintel;
    
    // Add the cloned mesh to the scene.
    scene.add(clonedDentilMesh);
}

// Window Apron;
apronMesh.position.y = -chosenAspectRatio.height / 2 - sillHeight - apronHeight / 2;
apronMesh.position.y = -chosenAspectRatio.height / 2 - sillHeight - apronHeight / 2;
scene.add(apronMesh);

// Corner Blocks;
// z positions for the blocks is the third arguement
topLeftBlock.position.set(-chosenAspectRatio.width / 2 - blockThickness / 2, chosenAspectRatio.height / 2 + blockThickness / 1.7, -9);
scene.add(topLeftBlock);

topRightBlock.position.set(chosenAspectRatio.width / 2 + blockThickness / 2, chosenAspectRatio.height / 2 + blockThickness / 1.7, -9);
scene.add(topRightBlock);

bottomLeftBlock.position.set(-chosenAspectRatio.width / 2 - blockThickness / 2, -chosenAspectRatio.height / 2 - blockThickness / 1.7, -9);
scene.add(bottomLeftBlock);

bottomRightBlock.position.set(chosenAspectRatio.width / 2 + blockThickness / 2, -chosenAspectRatio.height / 2 - blockThickness / 1.7, -9);
scene.add(bottomRightBlock);


// Curtain;
// Small depth to ensure the curtain doesn't intersect with the window;
// Defines a gap between the two curtains. Adjust as per your requirements;
// Adjusting the curtain width to account for the gap;
// Left curtain (as we are looking at the window);
// Left curtain position: We position it such that its right edge aligns with the center of the window, minus half the gap;
leftCurtainMesh.position.x = -chosenAspectRatio.width / 4 - curtainGap / 2;
// Slightly in front of the window to avoid overlap;
scene.add(leftCurtainMesh);
// Right curtain (optional, if you want one curtain on each side);
// Right curtain position: We position it such that its left edge aligns with the center of the window, plus half the gap;
rightCurtainMesh.position.x = chosenAspectRatio.width / 4 + curtainGap / 2;

 // Slightly in front of the window to avoid overlap;
scene.add(rightCurtainMesh);

// 4d: Muntin bar for 2-pane window
if (numPanes === 2) {
    const muntinGeo = new THREE.BoxGeometry(casingThickness * 0.5, chosenAspectRatio.height, 1);
    const muntinMesh = new THREE.Mesh(muntinGeo, casingMaterials);
    muntinMesh.position.z = -10;
    scene.add(muntinMesh);
}
// This is the end of the window frame creation.

// Exterior Wall (wall that window is attached to)
// Here is my latest code. What I want to accomplish is adding an "exterior wall" the surrounds the window frame. I want this "exterior wall" to be on the same z position as the left casing, top casing, bottom casing, and right casing. I think that perhaps an easy way to accomplish this is if flat flank the outer edges of the casings, e.g., a rectangle can be placed to the left of the left casing, another reactangle on the top of the top casing, another on the right of the right casing, and another at the bottom of the bottom casing.


// Room. Here we create the room behind the window. We will create a floor, ceiling, and walls (left wall, right wall, and back wall); these are components of what we will refer to a the "room.";
// Materials;
const floorMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color(palette.tones[2]) });
const wallMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color(palette.tones[3]) });
const ceilingMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color(palette.tones[4]) });
const leftWallDecorationMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color(palette.tones[0]) });
const leftWallDecorationMaterial2 = new THREE.MeshBasicMaterial({ color: new THREE.Color(palette.tones[1]) });
const rightWallDecorationMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color(palette.tones[2]) });
const rightWallDecorationMaterial2 = new THREE.MeshBasicMaterial({ color: new THREE.Color(palette.tones[3]) });


// Geometries
const floorGeometry = new THREE.BoxGeometry(roomWidth, 0.1, roomDepth);
// first arguement: the width of the shape, second arguement: the height of the shape, third arguement is the thickness.
const wallGeometry = new THREE.BoxGeometry(roomWidth + 11.5, roomHeight, 0.1);
// for the ceiling, the second arguement is the shape height but remember that it is not rotated in 3D space like the left and right walls. So, for this case, what would ususally be the thickness arguement, here it it could be visually interpreted as the length of the ceiling.
const ceilingGeometry = new THREE.BoxGeometry(roomWidth, 0.1, roomDepth + 2);
// Left wall decoration
const leftWallDecorationGeometry = new THREE.BoxGeometry(3, 13, 0.5);
const leftWallDecorationGeometry2 = new THREE.BoxGeometry(2, 2, 0.6);
const rightWallDecorationGeometry = new THREE.BoxGeometry(14, 6, 0.5);
const rightWallDecorationGeometry2 = new THREE.BoxGeometry(9, 2, 0.6);
const backWallSkyGeometry = new THREE.BoxGeometry(20, 18, 0.2);

// Floor
const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
floorMesh.position.y = -roomHeight+13;
floorMesh.position.z = -roomDepth + 10; // Adjusted to be right behind the window
scene.add(floorMesh);

// Ceiling
const ceilingMesh = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
ceilingMesh.position.y = roomHeight-12.5;
ceilingMesh.position.z = -roomDepth + 8; // Adjusted to be right behind the window;
scene.add(ceilingMesh)


// Back wall with a hole in the center (for the window)
const outerShape = new THREE.Shape();
outerShape.moveTo(-(roomWidth/2), -(roomHeight/2)); // Defining the outer shape of the object. The roomWidth and roomHeight variables are helved because all shapes are generated relative to the (0,0,0).
outerShape.lineTo(roomWidth/2, -roomHeight/2);
outerShape.lineTo(roomWidth/2, roomHeight/2);
outerShape.lineTo(-roomWidth/2, roomHeight/2);
outerShape.lineTo(-roomWidth/2, -roomHeight/2);
const holePath = new THREE.Path(); // Defining the hole in the center of the object
holePath.moveTo(0, -roomHeight/2.7); 
holePath.lineTo((roomWidth)/2.3, -(roomHeight)/2.7); // Bottom right corner of the hole
holePath.lineTo((roomWidth)/2.3, (roomHeight)/2.7); // Top right corner of the hole
holePath.lineTo(-(roomWidth)/2.3, (roomHeight)/2.7); 
holePath.lineTo(-(roomWidth)/2.3, -(roomHeight)/2.7);
outerShape.holes.push(holePath); // Add the smaller rectangle (the hole) to the holes array of the larger rectangle (the shape). This effectively "subtracts" the smaller rectangle from the larger one, creating a hole.
const backWallWithWindowGeometry = new THREE.ShapeGeometry(outerShape); // Create a geometry from the shape. The ShapeBufferGeometry constructor takes our shape and turns it into a flat 2D geometry.
const backWallWithWindowmaterial = new THREE.MeshBasicMaterial({ color: wallColor, side: THREE.DoubleSide });
const backWallWithWindowMesh = new THREE.Mesh(backWallWithWindowGeometry, backWallWithWindowmaterial);
backWallWithWindowMesh.position.z = -roomDepth -1;
scene.add(backWallWithWindowMesh);


// Blue sky behind the back wall
// const backWallSkyMesh = new THREE.Mesh(backWallSkyGeometry, backWallSkyMaterial);
// backWallSkyMesh.position.z = -roomDepth -10;
//scene.add(backWallSkyMesh);
const skyGeometry = new THREE.PlaneGeometry(20, 20);

const skycolor1 = hexToNormalizedRGB(palette.sky[0]);
const skycolor2 = hexToNormalizedRGB(palette.sky[1]);

const skyUniforms = {
  colorA: { value: new THREE.Vector3(skycolor1.r, skycolor1.g, skycolor1.b) },
  colorB: { value: new THREE.Vector3(skycolor2.r, skycolor2.g, skycolor2.b) }
};


// Create a shader
const skyVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const skyFragmentShader = `
  uniform vec3 colorA;
  uniform vec3 colorB;
  varying vec2 vUv;
  void main() {
    vec3 color = mix(colorA, colorB, vUv.x);
    gl_FragColor = vec4(color, 1.0);
  }
`;

const skyMaterial = new THREE.ShaderMaterial({
  vertexShader: skyVertexShader,
  fragmentShader: skyFragmentShader,
  uniforms: skyUniforms,
  side: THREE.FrontSide
});

const skyMesh = new THREE.Mesh(skyGeometry, skyMaterial);
skyMesh.position.set(0, 0, -40);
scene.add(skyMesh);

// City scape Mesh
// Create a group to hold all the building meshes
const cityScape = new THREE.Group();

// Create buildings of varying heights and widths
const buildingLayout = computeBuildingLayout(15, rand);
for (const b of buildingLayout) {
    const geometry = new THREE.BoxGeometry(b.width, b.height, 1);
    const material = new THREE.MeshBasicMaterial({color: 0x475165}); // Dark color for distant appearance
    const building = new THREE.Mesh(geometry, material);

    building.position.x = b.x;
    building.position.y = -b.height - 2.2;
    building.position.z = -71;
    cityScape.add(building);
}
scene.add(cityScape);

// Left wall of room.
const leftWallMesh = new THREE.Mesh(wallGeometry, wallMaterial);
leftWallMesh.rotation.y = Math.PI / 2;
// Rotate to align as a side wall;
leftWallMesh.position.x = -roomWidth /2;  // The wider the wall, the further back the wall appears to be.
leftWallMesh.position.z = -roomDepth /1.5; // Adjusted to be right behind the window;
scene.add(leftWallMesh);
const leftWallDecorationMesh = new THREE.Mesh(leftWallDecorationGeometry, leftWallDecorationMaterial);
leftWallDecorationMesh.rotation.y = Math.PI / 2;
// Rotate to align as a side wall;
leftWallDecorationMesh.position.x = -roomWidth /2;  // The wider the wall, the further back the wall appears to be.
leftWallDecorationMesh.position.z = -roomDepth /2; // Adjusted to be right behind the window;
scene.add(leftWallDecorationMesh);
const leftWallDecorationMesh2 = new THREE.Mesh(leftWallDecorationGeometry2, leftWallDecorationMaterial2);
leftWallDecorationMesh2.rotation.y = Math.PI / 2;
// Rotate to align as a side wall;
leftWallDecorationMesh2.position.x = -roomWidth /2;  // The wider the wall, the further back the wall appears to be.
leftWallDecorationMesh2.position.z = -roomDepth /2; // Adjusted to be right behind the window;
leftWallDecorationMesh2.rotation.x = Math.PI / 2.5;
scene.add(leftWallDecorationMesh2);

// Right wall of room.
const rightWallMesh = new THREE.Mesh(wallGeometry, wallMaterial);
rightWallMesh.rotation.y = Math.PI / 2;
// Rotate to align as a side wall;
rightWallMesh.position.x = roomWidth / 2; // The wider the wall, the further back the wall appears to be.
rightWallMesh.position.z = -roomDepth /1.5; // Adjusted to be right behind the window;
scene.add(rightWallMesh);
const rightWallDecorationMesh = new THREE.Mesh(rightWallDecorationGeometry, rightWallDecorationMaterial);
rightWallDecorationMesh.rotation.y = Math.PI / 2;
// Rotate to align as a side wall;
rightWallDecorationMesh.position.x = roomWidth / 2; // The wider the wall, the further back the wall appears to be.
rightWallDecorationMesh.position.z = -roomDepth /1.75; // Adjusted to be right behind the window;
scene.add(rightWallDecorationMesh);
const rightWallDecorationMesh2 = new THREE.Mesh(rightWallDecorationGeometry2, rightWallDecorationMaterial2);
rightWallDecorationMesh2.rotation.y = Math.PI / 2;
// Rotate to align as a side wall;
rightWallDecorationMesh2.position.x = roomWidth / 2; // The wider the wall, the further back the wall appears to be.
rightWallDecorationMesh2.position.z = -roomDepth / 1.75; // Adjusted to be right behind the window;
rightWallDecorationMesh2.rotation.x = Math.PI / 1.18;
scene.add(rightWallDecorationMesh2);

// Furniture
const furnitureColor = new THREE.Color(palette.tones[4]);
const furnitureShape = new THREE.Shape();
furnitureShape.moveTo(0, -(roomHeight/2.5));
furnitureShape.lineTo((roomWidth)/8, -(roomHeight/2)); // Bottom rightmost corner of the furniture
furnitureShape.lineTo((roomWidth)/11, -(roomHeight/2.5)); // Backrest of the furniture
furnitureShape.lineTo((roomWidth)/8, -(roomHeight/3.5)); // Top rightmost corner of the furniture but anchor point for the lower back.
furnitureShape.lineTo((roomWidth)/30, -(roomHeight/2.5)); // Top leftmost corner of the furniture
furnitureShape.lineTo(-(roomWidth)/11, -(roomHeight/2.5)); // front of the furniture
furnitureShape.lineTo(-(roomWidth)/8, -(roomHeight/2)); // Bottom leftmost corner of the furniture
const extrudeSettings = {
  depth: 4, // the thickness of the shape
  bevelEnabled: false // disable bevels, but you can enable and customize if needed
};
const furnitureGeometry = new THREE.ExtrudeGeometry(furnitureShape, extrudeSettings);
const furnitureMaterial = new THREE.MeshBasicMaterial({ color: furnitureColor, side: THREE.DoubleSide });
const furnitureMesh = new THREE.Mesh(furnitureGeometry, furnitureMaterial);
furnitureMesh.position.z = -roomDepth + 10;
furnitureMesh.rotation.y = Math.PI / 4;
scene.add(furnitureMesh);

// This is the end of the room creation

// Lighting;
const ambientLight = new THREE.AmbientLight(0x404040, 2);
scene.add(ambientLight);

// Camera;
//camera.position.z = 6;
//camera.lookAt(new THREE.Vector3(0, 0, windowMesh.position.z));

// CCapture — press C to start/stop WebM recording
let capturer = null;
let isRecording = false;
const recordingIndicator = document.getElementById('recording-indicator');
document.addEventListener('keydown', function(e) {
    if (e.key === 'r' || e.key === 'R') {
        window.location.hash = 'seed=' + (Math.floor(Math.random() * 99999) + 1);
        window.location.reload();
        return;
    }
    if (e.key !== 'c' && e.key !== 'C') return;
    if (!isRecording) {
        capturer = new CCapture({ format: 'webm', framerate: 60 });
        capturer.start();
        isRecording = true;
        recordingIndicator.style.display = 'block';
        console.log('CCapture: recording started');
    } else {
        capturer.stop();
        capturer.save();
        isRecording = false;
        recordingIndicator.style.display = 'none';
        console.log('CCapture: recording stopped, saving…');
    }
});

// Animation;
// Variables for camera swinging motion
let angle = 0;
let maxSwingAngle = Math.PI / 9.5; // 45 degrees in radians
let cameraDistance = 25; // distance from the center
let cameraSwingDirection = 1; // Initialize the variable outside the animate function

// Mouse/touch influence on camera
let mouseInfluence = 0;
let mouseInfluenceTarget = 0;
const mouseInfluenceMagnitude = 5 * (Math.PI / 180); // ±5 degrees in radians

document.addEventListener('mousemove', (e) => {
    mouseInfluenceTarget = (e.clientX / window.innerWidth) * 2 - 1;
});
document.addEventListener('touchmove', (e) => {
    mouseInfluenceTarget = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
}, { passive: true });

function animate() {
    // Lerp mouse influence toward target for smooth response
    mouseInfluence += (mouseInfluenceTarget - mouseInfluence) * 0.05;

    // Swing the camera
    angle += 0.0025 * cameraSwingDirection;
    if (angle >= maxSwingAngle || angle <= -maxSwingAngle) {
        cameraSwingDirection *= -1;
    }
    camera.position.x = cameraDistance * Math.sin(angle) + mouseInfluence * mouseInfluenceMagnitude;
    camera.position.z = cameraDistance * Math.cos(angle);
    camera.lookAt(scene.position);
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
  if (isRecording && capturer) capturer.capture(renderer.domElement);
}

animate();

// Console logs;
console.log("Aspect Ratio:", chosenAspectRatio);
console.log("Casing Thickness:", casingThickness);
//console.log("Window Z position:", windowMesh.position.z);
console.log("Camera Z position:", camera.position.z);
console.log("rightCurtainMesh Z position:", rightCurtainMesh.position.z);
console.log("leftCurtainMesh Z position:", leftCurtainMesh.position.z);
console.log("apronMesh Z position:", apronMesh.position.z);
console.log("dentilMesh Z position:", dentilMesh.position.z);
console.log("totalDentils:", totalDentils);
console.log("sillMesh Z position:", sillMesh.position.z);
console.log("casingRightMesh Z position:", casingRightMesh.position.z);
console.log("casingLeftMesh Z position:", casingLeftMesh.position.z);
console.log("casingBottomMesh Z position:", casingBottomMesh.position.z);
console.log("casingTopMesh Z position:", casingTopMesh.position.z);
console.log("floorMesh position:", floorMesh.position.z);
console.log("ceiling Z position:", ceilingMesh.position.z);
console.log("leftWall Z position:", leftWallMesh.position.z);
console.log("rightWall Z position:", rightWallMesh.position.z);
// console.log("backWall Z position:", backWallMesh.position.z);
console.log("skyColor1 normalized RGB:", skycolor1);
console.log("skyColor2 normalized RGB:", skycolor2);