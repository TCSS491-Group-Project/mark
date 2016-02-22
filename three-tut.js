var camera;
var scene;
var renderer;
var mesh;
var right = false;
var left = false;
var down = false;
var up = false;
var y = 0; var x = 0; var z = 0;

/*init();
animate();
startInput();*/

//var canvas = document.getElementById('gameWorld');
////var canvas = document.documentElement;
//var ctx = canvas.getContext('2d');
 function startInput () {
	console.log('Input started');
    var that = this;

    this.addEventListener("keydown", function (e) {
        if(e.code === "ArrowUp") { //Up arrow
        	up = true;
        } if(e.code === "ArrowRight") { // Right arrow
        	right = true;
        } if(e.code === "ArrowDown") { // Down arrow
        	down = true;
        } if(e.code === "ArrowLeft") { // Left arrow
        	left = true;
        } 
//        console.log(e);
        e.preventDefault();
    }, false);
    
    // For moving stoping the movement left or right.
    this.addEventListener("keyup", function (e) { 
    	if(e.code === "ArrowUp") { //Up arrow
        	up = false;
        } if(e.code === "ArrowRight") { // Right arrow
        	right = false;
        } if(e.code === "ArrowDown") { // Down arrow
        	down = false;
        } if(e.code === "ArrowLeft") { // Left arrow
        	left = false;
        } 
    	e.preventDefault();
    }, false);
}

function init() {
	
	

	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 75, 800 / 800, 0.1, 1000);
	
	/** DirectionalLight(hex, intensity)
		hex -- Numeric value of the RGB component of the color. 
		intensity -- Numeric value of the light's strength/intensity. */
	var light = new THREE.DirectionalLight( 0xFFFFFF, 1.5); // white light
//	var light = new THREE.DirectionalLight( 0xF51621, 1.5); // red light
	light.position.set( 0, 0, 5).normalize();
	scene.add(light);

	var geometry = new THREE.SphereGeometry( 10, 50, 50);
	//var material = new THREE.MeshPhongMaterial( { ambient: 0x050505, color: 0x0033ff, specular: 0x555555, shininess: 30 } ); 
	var material = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('http://i237.photobucket.com/albums/ff228/maricarmen_94/Bricks_by_funeralStock2.jpg') } ); //\images http://i1053.photobucket.com/albums/s466/hectord-23/1072_zpstwouxgr1.jpg
	
	mesh = new THREE.Mesh(geometry, material );
	mesh.position.z = -200;
//	mesh.position.set(-2.0, 0, 0);
//	camera.position.z = 5;
	scene.add( mesh );
	

	renderer = new THREE.WebGLRenderer(  );
	renderer.setSize(  800, 800 );
	document.body.appendChild( renderer.domElement );

	
	render();
}

var rotSpeed = 0;

function animate() {
	
	if(right) { // down
		var xAxis = new THREE.Vector3(0,1,0);
		rotateAroundWorldAxis(mesh, xAxis, x);
		x = 0.09;
		//console.log(y);

		if(x > 1){
			x = 1;
		}
	}
	if(left) { // up
		var xAxis = new THREE.Vector3(0,1,0);
		rotateAroundWorldAxis(mesh, xAxis, x);
		x = -0.025;
		//console.log(y);

		if(x < -0.1){
			x = -0.1;
		}
	} 
	if(up) { // left
		var xAxis = new THREE.Vector3(1,0,0);
		rotateAroundWorldAxis(mesh, xAxis, y);
		y = -0.025;
	} 
	if(down) { // right
		var xAxis = new THREE.Vector3(1,0,0);
		rotateAroundWorldAxis(mesh, xAxis, y);
		y = 0.025;
	} 
	/*if(right && up){
		var xAxis = new THREE.Vector3(1,1,0);
		rotateAroundWorldAxis(mesh, xAxis, y);
		y = -0.025;
	}*/
	//camera.position.set(x,y,z);
	
	render();
	//requestAnimationFrame( animate );
}

var rotWorldMatrix;
// Rotate an object around an arbitrary axis in world space       
function rotateAroundWorldAxis( object, axis, radians ) {

    var rotationMatrix = new THREE.Matrix4();

    rotationMatrix.setRotationAxis( axis.normalize(), radians );
    rotationMatrix.multiplySelf( object.matrix );                       // pre-multiply
    object.matrix = rotationMatrix;
    object.rotation.setRotationFromMatrix( object.matrix );
}

function render() {

	renderer.render( scene, camera );
}