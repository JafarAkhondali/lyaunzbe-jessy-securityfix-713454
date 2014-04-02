var camera, scene, renderer;
var video, videoTexture,videoMaterial;
var composer;
var shaderTime = 0;
var badTVParams, badTVPass;
var staticParams, staticPass;
var rgbParams, rgbPass;
var filmParams, filmPass;
var renderPass, copyPass;
var pnoise, globalParams;

var jankFactor = 1;

load();
function load(){
  var xhr = new XMLHttpRequest();

  xhr.open('GET', 'kathy.mp4', true);
  xhr.responseType = 'blob';
  xhr.onload = function(e) {
    if (this.status == 200) {
      console.log('GOT IT');
      var vid = (window.webkitURL ? webkitURL : URL).createObjectURL(this.response);
      video = document.createElement('video');
      video.src = vid;
      video.controls = true;
      video.play();
      document.body.appendChild(video);
      begin();
    }
  };
  xhr.send();
  console.log('HII');

}

function begin(){
  camera = new THREE.PerspectiveCamera(55, 1080/ 720, 20, 3000);
	camera.position.z = 1000;
	scene = new THREE.Scene();

  videoTexture = new THREE.Texture( video );
	videoTexture.minFilter = THREE.LinearFilter;
	videoTexture.magFilter = THREE.LinearFilter;

	videoMaterial = new THREE.MeshBasicMaterial( {
		map: videoTexture
	} );

	//Add video plane
	var planeGeometry = new THREE.PlaneGeometry( 1080, 720,1,1 );
	var plane = new THREE.Mesh( planeGeometry, videoMaterial );
	scene.add( plane );
	plane.z = 0;
	plane.scale.x = plane.scale.y = 1.45;

  renderPass = new THREE.RenderPass( scene, camera );
	copyPass = new THREE.ShaderPass( THREE.CopyShader );
  rgbPass = new THREE.ShaderPass( THREE.RGBShiftShader );
  kaleidoPass = new THREE.ShaderPass( THREE.KaleidoShader );
  tsPass = new THREE.ShaderPass( THREE.VerticalTiltShiftShader );



  renderer = new THREE.WebGLRenderer();
	document.body.appendChild( renderer.domElement );

  composer = new THREE.EffectComposer( renderer);

  composer.addPass( renderPass );
  composer.addPass( kaleidoPass );
  composer.addPass( rgbPass );
  composer.addPass( tsPass );
  composer.addPass( copyPass );

  copyPass.renderToScreen = true;

  window.addEventListener('resize', onResize, false);

  window.addEventListener('keypress', capture, false);


  onResize();
  animate();
}


function animate() {
  shaderTime += 0.1;
  rgbPass.uniforms[ "amount" ].value = Math.sin(shaderTime/100) ;
  kaleidoPass.uniforms["sides"].value =.1 + (Math.sin(shaderTime/1000)*.01);//2 + (Math.sin(shaderTime/10) * 1);
  kaleidoPass.uniforms["angle"].value = Math.sin(Math.PI*shaderTime/100)*0.001;

  // tsPass.uniforms["v"].value = (1/window.innerHeight);
  // tsPass.uniforms["r"].value =  Math.sin(shaderTime/100 +100);
  if(Math.round(shaderTime) % 10  && Math.round(shaderTime) < 160){
    kaleidoPass.uniforms["sides"].value = 6 + (Math.sin(shaderTime/1000)*.01);//2 + (Math.sin(shaderTime/10) * 1);
  }

  if(((Math.round(shaderTime) > 320) && (Math.round(shaderTime) < 490))
      || ((Math.round(shaderTime) > 660) && (Math.round(shaderTime) < 820))
      || ((Math.round(shaderTime) > 990) && (Math.round(shaderTime) < 1132))
      || ((Math.round(shaderTime) > 1212) && (Math.round(shaderTime) < 1293))
      || ((Math.round(shaderTime) > 1319) && (Math.round(shaderTime) < 1339))
      || ((Math.round(shaderTime) > 1360) && (Math.round(shaderTime) < 1380)) ){
    if(Math.round(shaderTime) % 10){

      kaleidoPass.uniforms["sides"].value = 6 + (Math.sin(shaderTime/1000)*.01);//2 + (Math.sin(shaderTime/10) * 1);
    }
  }
  if ( video.readyState === video.HAVE_ENOUGH_DATA ) {
  	if ( videoTexture ) videoTexture.needsUpdate = true;
  }

  requestAnimationFrame( animate );
  composer.render(.1);
}

function onResize() {
	renderer.setSize(window.innerWidth, window.innerHeight);
  camera.updateProjectionMatrix();
}

function capture(e){
  console.log(shaderTime);
  console.log(composer);
}
