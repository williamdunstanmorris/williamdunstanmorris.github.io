if (!Detector.webgl) Detector.addGetWebGLMessage();
var container, stats;
var camera, scene, renderer;
var mouseX = 0,
    mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight /
    2;
init();
animate();

function init()
{
    container = document.getElementById(
        'container');
    camera = new THREE.PerspectiveCamera(
        20, window.innerWidth /
        window.innerHeight, 1,
        10000);
    camera.position.z = 1800;
    scene = new THREE.Scene();
    scene.background = new THREE.Color(
        0xffffff);
    var light = new THREE.DirectionalLight(
        0xffffff);
    light.position.set(0, 0, 1);
    scene.add(light);
    // shadow
    var canvas = document.createElement(
        'canvas');
    canvas.width = 128;
    canvas.height = 128;
    var context = canvas.getContext(
        '2d');
    var gradient = context.createRadialGradient(
        canvas.width / 2, canvas.height /
        2, 0, canvas.width / 2,
        canvas.height / 2, canvas.width /
        2);
    gradient.addColorStop(0.1,
        'rgba(210,210,210,1)');
    gradient.addColorStop(1,
        'rgba(255,255,255,1)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width,
        canvas.height);
    var shadowTexture = new THREE.CanvasTexture(
        canvas);
    var shadowMaterial = new THREE.MeshBasicMaterial(
    {
        map: shadowTexture
    });
    var shadowGeo = new THREE.PlaneBufferGeometry(
        300, 300, 1, 1);
    var shadowMesh;
    shadowMesh = new THREE.Mesh(
        shadowGeo, shadowMaterial);
    shadowMesh.position.y = -250;
    shadowMesh.rotation.x = -Math.PI /
        2;
    scene.add(shadowMesh);
    shadowMesh = new THREE.Mesh(
        shadowGeo, shadowMaterial);
    shadowMesh.position.y = -250;
    shadowMesh.position.x = -400;
    shadowMesh.rotation.x = -Math.PI /
        2;
    scene.add(shadowMesh);
    shadowMesh = new THREE.Mesh(
        shadowGeo, shadowMaterial);
    shadowMesh.position.y = -250;
    shadowMesh.position.x = 400;
    shadowMesh.rotation.x = -Math.PI /
        2;
    scene.add(shadowMesh);
    var radius = 200;
    var geometry1 = new THREE.IcosahedronBufferGeometry(
        radius, 1);
    var count = geometry1.attributes.position
        .count;
    geometry1.addAttribute('color', new THREE
        .BufferAttribute(new Float32Array(
            count * 3), 3));
    var geometry2 = geometry1.clone();
    var geometry3 = geometry1.clone();
    var color = new THREE.Color();
    var positions1 = geometry1.attributes
        .position;
    var positions2 = geometry2.attributes
        .position;
    var positions3 = geometry3.attributes
        .position;
    var colors1 = geometry1.attributes.color;
    var colors2 = geometry2.attributes.color;
    var colors3 = geometry3.attributes.color;
    for (var i = 0; i < count; i++)
    {
        color.setHSL((positions1.getY(i) /
                radius + 1) / 2,
            1.0, 0.5);
        colors1.setXYZ(i, color.r,
            color.g, color.b);
        color.setHSL(0, (positions2.getY(
                i) / radius + 1) /
            2, 0.5);
        colors2.setXYZ(i, color.r,
            color.g, color.b);
        color.setRGB(1, 0.8 - (
            positions3.getY(i) /
            radius + 1) / 2, 0);
        colors3.setXYZ(i, color.r,
            color.g, color.b);
    }
    var material = new THREE.MeshPhongMaterial(
    {
        color: 0xffffff,
        flatShading: true,
        vertexColors: THREE.VertexColors,
        shininess: 0
    });
    var wireframeMaterial = new THREE.MeshBasicMaterial(
    {
        color: 0x000000,
        wireframe: true,
        transparent: true
    });
    var mesh = new THREE.Mesh(geometry1,
        material);
    var wireframe = new THREE.Mesh(
        geometry1,
        wireframeMaterial);
    mesh.add(wireframe);
    mesh.position.x = -400;
    mesh.rotation.x = -1.87;
    scene.add(mesh);
    var mesh = new THREE.Mesh(geometry2,
        material);
    var wireframe = new THREE.Mesh(
        geometry2,
        wireframeMaterial);
    mesh.add(wireframe);
    mesh.position.x = 400;
    scene.add(mesh);
    var mesh = new THREE.Mesh(geometry3,
        material);
    var wireframe = new THREE.Mesh(
        geometry3,
        wireframeMaterial);
    mesh.add(wireframe);
    scene.add(mesh);
    renderer = new THREE.WebGLRenderer(
    {
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth,
        window.innerHeight);
    container.appendChild(renderer.domElement);
    stats = new Stats();
    container.appendChild(stats.dom);
    document.addEventListener(
        'mousemove',
        onDocumentMouseMove, false);
    //
    window.addEventListener('resize',
        onWindowResize, false);
}

function onWindowResize()
{
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight /
        2;
    camera.aspect = window.innerWidth /
        window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,
        window.innerHeight);
}

function onDocumentMouseMove(event)
{
    mouseX = (event.clientX -
        windowHalfX);
    mouseY = (event.clientY -
        windowHalfY);
}

function animate()
{
    requestAnimationFrame(animate);
    render();
    stats.update();
}

function render()
{
    camera.position.x += (mouseX -
        camera.position.x) * 0.05;
    camera.position.y += (-mouseY -
        camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
}
