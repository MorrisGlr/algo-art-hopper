  // The depth of the room, can be adjusted as needed;
// This porject is inspired by the work of Edward Hopper. I want to create a generative art piece where it creates a scene of a room with a window. The viewer is looking from outside the window an into a large room. I want to generate a z stack of the room and then have the window be a portal into the room. The room could possibly be furnished which shapes that are reminiscent of couches or chairs but not quite identifiable by a distinct style.
// I want to make the exterior window frame to be ornate.
// What candidate features controlled with randomization: the room's furniture, the window's frame, the window's view, the room's lighting, the room's color scheme, the room's floor, the room's walls, the room's ceiling, the room's door, the room's window, the room's window's frame, the room's window's curtains, the room's window's blinds, the room's window's jamb, the room's window's sill, the room's window's apron, the room's window's stool, the room's window's casing, the room's window's sash, the room's window lintel, window corner blocks, window pilasters.
// The window opening can have an aspect ratio between 9:16 and 3:4. (window width:window height)
// The window opening can have a thin frame.
// Window stool can have varying thickness. the stool could be vary between 1 - 3 rectangles stacked on top of each other. each rectangle can have a different thickness and depth.
// Window casing can have varying thickness but the head and side casing should be the same thickness. The casing could be composed of 1 - 3 rectangles stacked on top of each other. Each rectangle can have a different thickness and depth.
// Window curtains can vary according to oppacity (always some degree of being translucent), color, and how closed they are. Opacity can vary from 0.4 and 0.9. Color can vary between 0 and 255. The curtains are never fully closed or fully open. They are always in between. The curtains do not have depth.
// The sash can be composted of 1 - 5 rectangles stacked on top of each other. Each rectangle can have a different thickness and depth
// The lintel can be composed of 1 - 5 rectangles stacked on top of each other. Each rectangle can have a different thickness and depth and width. also on the lintrels there are dentrils. 2 - 5 dentrils can be placed on the lintel. All dentrils with have the same height, width, and depth;
// In regards to z - stack orientation of the objects, the casings are on the same z-stack. The window stool, apron, and sill are on the same z-stack. The window sash is on its own z-stack. The window lintel is on its own z-stack. The window corner blocks are on their own z-stack. The window opening is behind the aforementioned objects. The curtains would be behind the window opening.
// In regards to the z-stack orientation of the room, the floor is on its own z-stack. The walls are on their own z-stack. The ceiling is on its own z-stack. The door is on its own z-stack. The window is on its own z-stack; this window will just be an opening and there will be no ornate framing around it.
// I want to give the room depth by having the walls be different colors and the floor and ceiling be different colors. The floor and ceiling will be a lighter color than the walls. The walls will be a darker color. The door will be a darker color than the walls. The window will be a lighter color than the walls.
// In regards to the animation, I want each element to appear on the canvas one at a time randomly. Once I want to rotate the entire 3D space to give a parallax effect.


// **********************;
// Breakdown of the project;
// **********************;
// break down the approach:;

//     Creating the Room:;
//         Decide on the canvas size. This will determine the scale and proportion of everything else.
//         Generate the room's walls, ceiling, and floor with the given color constraints. Since you mentioned a Z-stack, you'd want to render the farthest objects first (like the wall behind the window) and layer objects in front of it subsequently.

//     Window Generation:;
//         Determine the window's position and dimensions based on your aspect ratio constraints.
//         For each ornate feature (casing, stool, apron, sill, sash, lintel, corner blocks, pilasters), randomly determine their presence and details (e.g., thickness, depth, color).
//         Curtains can be generated using a semi-transparent colored rectangle, with its opacity randomly determined between your given bounds.

//     Furniture Generation:;
//         While you mentioned that the furniture will have shapes reminiscent of real-world items, you might need to create a library of potential shapes or configurations that can be randomly selected and positioned within the room.
//         Ensure they don't overlap with the window or each other (unless intended).

//     Animation:;
//         Start with a flat view, where each element is generated one by one in a random sequence.
//         After all elements are present, transition to a 3D view to give the room depth and perspective. This could be done using a 3D graphics library or engine that supports perspective projection and camera manipulation. You'd be "rotating" the camera or viewpoint to give that parallax effect.


const roomWidth = 10;

const scaleFactor = 1;
const chosenAspectRatio = { width: 9 * scaleFactor, height: 16 * scaleFactor };
const casingThickness = 0.5 * scaleFactor; // Adjusting casing thickness proportionally
const casingTopGeometry = new THREE.BoxGeometry(chosenAspectRatio.width + 1 * casingThickness, casingThickness*3, 0.8);
const casingMaterials = [
    new THREE.MeshBasicMaterial({ color: 0xd8dfe5 }),
    new THREE.MeshBasicMaterial({ color: 0xd8dfe5 }),
    new THREE.MeshBasicMaterial({ color: 0xd8dfe5 }),
    new THREE.MeshBasicMaterial({ color: 0xd8dfe5 })];

const casingTopMesh = new THREE.Mesh(casingTopGeometry, casingMaterials);
casingTopMesh.position.z = -10;
const casingBottomGeometry = new THREE.BoxGeometry(chosenAspectRatio.width + 1 * casingThickness, casingThickness *3, 0.8);
const casingBottomMesh = new THREE.Mesh(casingBottomGeometry, casingMaterials);
casingBottomMesh.position.z = -10;
const casingLeftGeometry = new THREE.BoxGeometry(casingThickness, chosenAspectRatio.height, 0.5);
const casingLeftMesh = new THREE.Mesh(casingLeftGeometry, casingMaterials);
casingLeftMesh.position.z = -10;
const casingRightGeometry = new THREE.BoxGeometry(casingThickness, chosenAspectRatio.height, 0.5);
const casingRightMesh = new THREE.Mesh(casingRightGeometry, casingMaterials);
casingRightMesh.position.z = -10;
const sillHeight = casingThickness * 0.9;
const sillDepth = 2;
const sillGeometry = new THREE.BoxGeometry(chosenAspectRatio.width + 2.5 * casingThickness, sillHeight, sillDepth);
const sillMaterial = new THREE.MeshBasicMaterial({ color: 0xf2d9de });
const sillMesh = new THREE.Mesh(sillGeometry, sillMaterial);
sillMesh.position.z = -10;
const lintelHeight = casingThickness * 2;
const lintelGeometry = new THREE.BoxGeometry(chosenAspectRatio.width + 2.5 * casingThickness, lintelHeight, 0.2);
const lintelMaterial = new THREE.MeshBasicMaterial({ color: 0xf2d9de });
const lintelMesh = new THREE.Mesh(lintelGeometry, lintelMaterial);
lintelMesh.position.z = -8;
const dentilWidth = casingThickness; // Size of the dentil block, you can adjust as needed;
const dentilHeight = casingThickness * 1;
const dentilDepth = 0;
const dentilGeometry = new THREE.BoxGeometry(dentilWidth, dentilHeight, dentilDepth);
const dentilMaterial = new THREE.MeshBasicMaterial({ color: 0xf2d9de }); // Same color as the other decorative elements;
const dentilMesh = new THREE.Mesh(dentilGeometry, dentilMaterial);
dentilMesh.position.z = -10;
const apronHeight = casingThickness;
const apronGeometry = new THREE.BoxGeometry(chosenAspectRatio.width + 2.5 * casingThickness, apronHeight, 0.5);
const apronMaterial = new THREE.MeshBasicMaterial({ color: 0xf2d9de });
const apronMesh = new THREE.Mesh(apronGeometry, apronMaterial);
apronMesh.position.z = -10;
const blockThickness = casingThickness * 1.4;
const blockGeometry = new THREE.BoxGeometry(blockThickness, blockThickness, 0.1); // Making it slightly thicker;
const blockMaterial = new THREE.MeshBasicMaterial({ color: 0x56beba }); // Same color as the apron and lintel;
const topLeftBlock = new THREE.Mesh(blockGeometry, blockMaterial);
topLeftBlock.position.z = -10;
const topRightBlock = topLeftBlock.clone();
topRightBlock.position.z = -10;
const bottomLeftBlock = topLeftBlock.clone();
bottomLeftBlock.position.z = -9;
const bottomRightBlock = topLeftBlock.clone();
bottomRightBlock.position.z = -9;

// Curtains
const curtainGap = 2.5;
const curtainWidth = (chosenAspectRatio.width - curtainGap) / 2;
const curtainHeight = chosenAspectRatio.height;
const curtainDepth = 0;
const curtainGeometry = new THREE.BoxGeometry(curtainWidth, curtainHeight, curtainDepth);
const curtainMaterial = new THREE.MeshBasicMaterial({
  color: 0xffdfba,   // Light Blue for now, you can change to any color you want;
  transparent: true,
  opacity: 0.4       // Making the curtain translucent. Adjust opacity to your liking;
});
const leftCurtainMesh = new THREE.Mesh(curtainGeometry, curtainMaterial);
leftCurtainMesh.position.z = -10.1;
const rightCurtainMesh = new THREE.Mesh(curtainGeometry, curtainMaterial);
rightCurtainMesh.position.z = -10.1;
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
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(1080, 1920);
document.body.appendChild(renderer.domElement);

renderer.setClearColor(0xeeeeee);

window.addEventListener('resize', function() {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
});


// Window object: defines the shape and size of the window object.
const windowGeometry = new THREE.BoxGeometry(chosenAspectRatio.width, chosenAspectRatio.height, 0.1);
const windowMaterial = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 });
const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
scene.add(windowMesh);
windowMesh.position.z = 0;


// Create a large box geometry that represents the front wall, covering the entire view
const wallWidth = window.innerWidth;
const wallHeight = window.innerHeight;
const frontWallGeometry = new THREE.BoxGeometry(wallWidth, wallHeight, 0.1);

// Convert window and wall geometries to CSG (Constructive Solid Geometry);
let windowCSG = THREE.CSG.fromMesh(windowMesh);


// Here we define the components of the window frame.
// Note: the window frame is defined by right curtain, left curtain, corner blocks, window apron, dentils, window header (lintel), window sill, right casing, left casing, bottom casing, top casing.

// Top Casing
casingTopMesh.position.y = chosenAspectRatio.height / 2 + casingThickness / 2;
scene.add(casingTopMesh);

// Bottom Casing
casingBottomMesh.position.y = -chosenAspectRatio.height / 2 - casingThickness / 2;
scene.add(casingBottomMesh);

// Left Casing;
casingLeftMesh.position.x = -chosenAspectRatio.width / 2 - casingThickness / 2;
scene.add(casingLeftMesh);

// Right Casing;
casingRightMesh.position.x = chosenAspectRatio.width / 2 + casingThickness / 2;
scene.add(casingRightMesh);

// Window Sill;
sillMesh.position.y = -chosenAspectRatio.height / 2 - sillHeight / 2;
sillMesh.position.z = 0;
scene.add(sillMesh);

// Window Header or Lintel;
lintelMesh.position.y = chosenAspectRatio.height / 2 + lintelHeight / 2;
scene.add(lintelMesh);

// Dentils;
// Depth of dentil, aligning it with other elements;
const dentilSpacing = dentilWidth * 1;
// Spacing between dentils, can be adjusted;
const totalDentils = Math.floor(chosenAspectRatio.width / dentilSpacing); // Calculate how many dentils we can fit;
    for (let i = 0; i < totalDentils; i++) {
    // Position the dentil. Starting from the leftmost position and placing each one by its width + spacing.
    dentilMesh.position.x = -chosenAspectRatio.width / 2 + (i * dentilSpacing) + dentilWidth / 2;
    dentilMesh.position.y = chosenAspectRatio.height / 2 + lintelHeight; // Position it just below the lintel;
    scene.add(dentilMesh);
}

// Window Apron;
apronMesh.position.y = -chosenAspectRatio.height / 2 - sillHeight - apronHeight / 2;
apronMesh.position.y = -chosenAspectRatio.height / 2 - sillHeight - apronHeight / 2;
scene.add(apronMesh);

// Corner Blocks;
topLeftBlock.position.set(-chosenAspectRatio.width / 2 - blockThickness / 2, chosenAspectRatio.height / 2 + blockThickness / 2, 0);
scene.add(topLeftBlock);

topRightBlock.position.set(chosenAspectRatio.width / 2 + blockThickness / 2, chosenAspectRatio.height / 2 + blockThickness / 2, 0);
scene.add(topRightBlock);

bottomLeftBlock.position.set(-chosenAspectRatio.width / 2 - blockThickness / 2, -chosenAspectRatio.height / 2 - blockThickness / 2, 0);
scene.add(bottomLeftBlock);

bottomRightBlock.position.set(chosenAspectRatio.width / 2 + blockThickness / 2, -chosenAspectRatio.height / 2 - blockThickness / 2, 0);
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
// This is the end of the window frame creation.

// Exterior Wall (wall that window is attached to)
// Left reactangle



// Room. Here we create the room behind the window. We will create a floor, ceiling, and walls (left wall, right wall, and back wall); these are components of what we will refer to a the "room.";
// Materials;
const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x99cccc });   // Grey for the floor;
const wallMaterial = new THREE.MeshBasicMaterial({ color: 0xbbe7d4 });   // Lighter grey for the walls;
const ceilingMaterial = new THREE.MeshBasicMaterial({ color: 0xb2d8d8  }); // Even lighter grey for the ceiling;

// Geometries
const floorGeometry = new THREE.BoxGeometry(roomWidth + 10, 0.1, roomDepth);
const wallGeometry = new THREE.BoxGeometry(roomWidth +10, roomHeight, 0.1);
const ceilingGeometry = new THREE.BoxGeometry(roomWidth + 10, 0.1, roomDepth);

// Floor
const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
floorMesh.position.y = -roomHeight;
floorMesh.position.z = -roomDepth; // Adjusted to be right behind the window
scene.add(floorMesh);

// Ceiling
const ceilingMesh = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
ceilingMesh.position.y = roomHeight;
ceilingMesh.position.z = -roomDepth; // Adjusted to be right behind the window;
scene.add(ceilingMesh)

// Back Wall (Viewable through the window);
const backWallMesh = new THREE.Mesh(wallGeometry, wallMaterial);
backWallMesh.position.z = -roomDepth + 14;
scene.add(backWallMesh);

// Left wall of room.
const leftWallMesh = new THREE.Mesh(wallGeometry, wallMaterial);
leftWallMesh.rotation.y = Math.PI / 2;
// Rotate to align as a side wall;
leftWallMesh.position.x = -roomWidth /2;  // The wider the wall, the further back the wall appears to be.
leftWallMesh.position.z = -roomDepth /3; // Adjusted to be right behind the window;
scene.add(leftWallMesh);
scene.add(leftWallMesh);

// Right wall of room.
const rightWallMesh = new THREE.Mesh(wallGeometry, wallMaterial);
rightWallMesh.rotation.y = Math.PI / 2;
// Rotate to align as a side wall;
rightWallMesh.position.x = roomWidth / 2; // The wider the wall, the further back the wall appears to be.
rightWallMesh.position.z = -roomDepth /3; // Adjusted to be right behind the window;
scene.add(rightWallMesh);
scene.add(rightWallMesh);
// This is the end of the room creation

// Lighting;
const ambientLight = new THREE.AmbientLight(0x404040, 2);
scene.add(ambientLight);

// Camera;
camera.position.z = 0;
camera.lookAt(new THREE.Vector3(0, 0, windowMesh.position.z));

// Animation;
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

// Console logs;
console.log("Aspect Ratio:", chosenAspectRatio);
console.log("Casing Thickness:", casingThickness);
console.log("Window Z position:", windowMesh.position.z);
console.log("Camera Z position:", camera.position.z);
console.log("rightCurtainMesh Z position:", rightCurtainMesh.position.z);
console.log("leftCurtainMesh Z position:", leftCurtainMesh.position.z);
console.log("apronMesh Z position:", apronMesh.position.z);
console.log("dentilMesh Z position:", dentilMesh.position.z);
console.log("sillMesh Z position:", sillMesh.position.z);
console.log("casingRightMesh Z position:", casingRightMesh.position.z);
console.log("casingLeftMesh Z position:", casingLeftMesh.position.z);
console.log("casingBottomMesh Z position:", casingBottomMesh.position.z);
console.log("casingTopMesh Z position:", casingTopMesh.position.z);
console.log("floorMesh position:", floorMesh.position.z);
console.log("ceiling Z position:", ceilingMesh.position.z);
console.log("leftWall Z position:", leftWallMesh.position.z);
console.log("rightWall Z position:", rightWallMesh.position.z);
console.log("backWall Z position:", backWallMesh.position.z);
