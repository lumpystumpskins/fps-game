// Initialize the scene
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("game-container").appendChild(renderer.domElement);

// Add lighting
var light = new THREE.PointLight(0xFFFFFF);
light.position.set(10, 10, 10);
scene.add(light);

// Create a basic ground
var groundGeometry = new THREE.PlaneGeometry(1000, 1000);
var groundMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
var ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Create the player (camera)
camera.position.set(0, 2, 0);
scene.add(camera);

// FPS controls (mouse look and movement)
var controls = new THREE.FirstPersonControls(camera);
controls.movementSpeed = 100;
controls.lookSpeed = 0.1;
controls.lookVertical = false;

// Create simple walls (obstacles)
function createWall(x, y, z, width, height, depth) {
    var geometry = new THREE.BoxGeometry(width, height, depth);
    var material = new THREE.MeshLambertMaterial({ color: 0xFF0000 });
    var wall = new THREE.Mesh(geometry, material);
    wall.position.set(x, y, z);
    scene.add(wall);
}

// Create some walls
createWall(10, 2, 10, 10, 4, 1);
createWall(-10, 2, 10, 10, 4, 1);
createWall(0, 2, -10, 10, 4, 1);

// Shooting functionality
var bullets = [];
var bulletSpeed = 5;
function shootBullet() {
    var bulletGeometry = new THREE.SphereGeometry(0.2);
    var bulletMaterial = new THREE.MeshBasicMaterial({ color: 0x00FF00 });
    var bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);

    // Set initial position and velocity
    bullet.position.set(camera.position.x, camera.position.y, camera.position.z);
    var direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    bullet.velocity = direction.multiplyScalar(bulletSpeed);

    scene.add(bullet);
    bullets.push(bullet);
}

// Handle mouse click to shoot
document.addEventListener("mousedown", function() {
    shootBullet();
});

// Game loop
function animate() {
    requestAnimationFrame(animate);
    controls.update(0.1); // Update FPS controls
    moveBullets();
    renderer.render(scene, camera);
}
animate();

// Move bullets
function moveBullets() {
    for (var i = 0; i < bullets.length; i++) {
        bullets[i].position.add(bullets[i].velocity);
    }
}

// Resize the window
window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
