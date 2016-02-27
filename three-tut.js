var camera;
var scene;
var renderer;
var mesh;
var right = false;
var left = false;
var down = false;
var up = false;
var y = 0; var x = 0; var z = 0;

function init() {
	var canvas = document.getElementById('gameWorld');
	
	this.addEventListener("click", function(e){
//		console.log(e);
		e.preventDefault();
		canvas.focus();
    }, false);
	
	this.addEventListener("contextmenu", function(e){
//		console.log(e);
//		e.preventDefault();
		canvas.focus();
    }, false);
	
	
	
	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 80, 800 / 800, 0.1, 1000);

	
	/** DirectionalLight(hex, intensity)
		hex -- Numeric value of the RGB component of the color. 
		intensity -- Numeric value of the light's strength/intensity. */
	var light = new THREE.DirectionalLight( 0xffd699, 1.5); // white light
//	var light = new THREE.DirectionalLight( 0xF51621, 1.5); // red light

	light.position.set( 0, 0, .1).normalize();

	scene.add(light);

	var geometry = new THREE.SphereGeometry( 5, 39, 39);
	//var material = new THREE.MeshPhongMaterial( { ambient: 0x050505, color: 0x0033ff, specular: 0x555555, shininess: 30 } ); 
	var material = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('http://i1053.photobucket.com/albums/s466/hectord-23/1072_zpstwouxgr1.jpg') } ); //\images http://i1053.photobucket.com/albums/s466/hectord-23/1072_zpstwouxgr1.jpg
	
	mesh = new THREE.Mesh(geometry, material );
	mesh.position.z = -50;
//	mesh.position.set(-2.0, 0, 0);
//	camera.position.z = 5;
	scene.add( mesh );
	

	renderer = new THREE.WebGLRenderer(  );
	renderer.setSize(  window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

}

// Rotate an object around an arbitrary axis in world space       
function rotateAroundWorldAxis( object, axis, radians ) {
    var rotationMatrix = new THREE.Matrix4();

    rotationMatrix.setRotationAxis( axis.normalize(), radians );
    rotationMatrix.multiplySelf( object.matrix );                       // pre-multiply
    object.matrix = rotationMatrix;
    object.rotation.setRotationFromMatrix( object.matrix );
}

function render() {

	//rotateAroundWorldAxis(mesh, new THREE.Vector3(0,1,0), x);
	//rotateAroundWorldAxis(mesh, new THREE.Vector3(0,1,0), y);

	renderer.render( scene, camera );
}