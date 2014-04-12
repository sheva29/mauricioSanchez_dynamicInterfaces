//----------------------------------------------------------//
//---------------------Global Variables--------------------//
//----------------------------------------------------------//
var container,
    scene,
    camera,
    renderer,
    controls,
    time,
    ray;
var objects = [];
time = Date.now();
//----------------------------------------------------------//
//------------------Pointer Lock variables------------------//
//----------------------------------------------------------//
var blocker = document.getElementById('blocker');
var instructions = document.getElementById('instructions');
console.log(instructions);
var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
// Here we check if the browser is compatible with the pointerLockControllers
if (havePointerLock) {
    var element = document.body;
    var pointerlockchange = function (event) {
        if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
            controls.enabled = true;
            blocker.style.display = 'none';
        } else {
            controls.enabled = false;
            blocker.style.display = '-webkit-box';
            blocker.style.display = '-moz-box';
            blocker.style.display = 'box';
            instructions.style.display = '';
        }
    }
    var pointerlockerror = function (event) {
        instructions.style.display = " ";
    }
    // We hook the pointer lock state change events
    document.addEventListener('pointerlockchange', pointerlockchange, false);
    document.addEventListener('mozpointerlockchange', pointerlockchange, false);
    document.addEventListener('webkitpointerlockchange', pointerlockchange, false);
    //
    document.addEventListener('pointerlockerror', pointerlockerror, false);
    document.addEventListener('mozpointerlockerror', pointerlockerror, false);
    document.addEventListener('webkitpointerlockerror', pointerlockerror, false);
    instructions.addEventListener('click', function (event) {
        instructions.style.display = 'none';
        element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
        if (/Firefox/i.test(navigator.userAgent)) {
            var fullscreenchange = function (event) {
                if (document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element) {
                    document.removeEventListener('fullscreenchange', fullscreenchange);
                    document.removeEventListener('mozfullscreenchange', fullscreenchange);
                    element.requestPointerLock();
                }
            }
            document.addEventListener('fullscreenchange', fullscreenchange, false);
            document.addEventListener('mozfullscreenchange', fullscreenchange, false);
            element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;
            element.requestFullscreen();
        } else {
            element.requestPointerLock();
        }
    }, false);
} else {
    instructions.innerHTML = 'Your Browser doesn\'t seem to support Pointer Lock API';
}
//----------------------------------------------------------//
//-----------------------three.js stuff---------------------//
//----------------------------------------------------------//
init();
animate();

function init() {
    var WIDTH = window.innerWidth;
    var HEIGHT = window.innerHeight;
    //Scene
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xffffff, 0, 750);
    //Render
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setClearColor(0x000000);
    renderer.setSize(WIDTH, HEIGHT);
    document.body.appendChild(renderer.domElement);
    //
    window.addEventListener('resize', onWindowResize, false);
    //Camera
    camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 0.1, 20000);
    //Might need this stuff later
    camera.position.z = 0;
    camera.position.y = 0;
    camera.position.x = 20;
    scene.add(camera);
    //Create a light
    var light = new THREE.PointLight(0xffffff);
    light.position.set(-100, 200, 100);
    scene.add(light);
    var light2 = new THREE.PointLight(0xffffff);
    light2.position.set(100, 200, 100);
    scene.add(light2);
    var ambientLight = new THREE.AmbientLight(0xffffff);
    ray = new THREE.Raycaster();
    ray.ray.direction.set(0, -1, 0);
    scene.add(ambientLight);
    //Load custom geometry
    var loader = new THREE.JSONLoader();
    loader.load("threejs_objects/3dworld.js", function (geometry) {
        // var material = new THREE.MeshLambertMaterial({color: 0xff0000});
        var material = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            wireframe: false
        });
        mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        objects.push(mesh);
    });
    //Controls
    controls = new THREE.PointerLockControls(camera);
    scene.add(controls.getObject());
    //For resizing purposes
    window.addEventListener('resize', onWindowResize, false);
}
//For resizing purposes
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
//This is where we draw our scene and camera
function render() {
    renderer.render(scene, camera);
}
//This is where the update 
function animate() {
    requestAnimationFrame(animate);
    controls.isOnObject(false);
    ray.ray.origin.copy(controls.getObject().position);
    ray.ray.origin.y -= 10;
    intersections = ray.intersectObjects(objects);
    if (intersections.length > 0) {
        var distance = intersections[0].distance;
        if (distance > 0 && distance < 10) {
            controls.isOnObject(true);
        }
    }
    controls.update(Date.now() - time);
    render();
    time = Date.now();
}