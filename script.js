import WebGL from 'three/addons/capabilities/WebGL.js';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {ARButton} from 'three/addons/webxr/ARButton.js'
// import { KHRMaterialsPbrSpecularGlossinessExtension } from 'three/addons/loaders/extensions/KHRMaterialsPbrSpecularGlossinessExtension.js';

if ( WebGL.isWebGL2Available() ) {

	const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.z =7;
  
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor(0x87ceeb);
    renderer.xr.enabled = true;
    document.getElementById("container").appendChild(renderer.domElement);
    const controls = new OrbitControls( camera, renderer.domElement );
    // Add lights to the scene
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const loader = new GLTFLoader();
    // loader.register(parser => new KHRMaterialsPbrSpecularGlossinessExtension(parser));
    let model;
    loader.load("./house.glb",function(gltf){
        model = gltf.scene;
        model.scale.set(0.25, 0.25, 0.25);
        model.position.set(0, -1, -2);
        scene.add(model);
        camera.position.z =1;
        controls.update();
    },undefined,function(error){
        console.log(error);
    })

    // Add this after scene creation to test AR visibility
    // const geometry = new THREE.BoxGeometry(1, 1, 1);
    // const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    // const cube = new THREE.Mesh(geometry, material);
    // cube.position.set(0, 0, -3);
    // scene.add(cube);

    function onSelect(){
      if(model){
        const randomOffset = 0.5 - Math.random();
  
        model.position.set(randomOffset,-0.5,-3);
        // camera.position.z = 5;
      }
    }


    function animate(){
        // requestAnimationFrame(animate);
        // controls.update();
        // renderer.render(scene,camera);
        renderer.setAnimationLoop(function(){
          if(model){

          }
          controls.update();
          renderer.render(scene,camera);
        })
    }
    // create ar button 
    const arButton = ARButton.createButton(renderer,{
        optionalFeatures:['dom-overlay'],
        domOverlay:{root:document.body},
        onSessionStart:()=>{
          renderer.xr.addEventListener("select",onSelect);
        },
        onSessionEnd:()=>{
          renderer.xr.removeEventListener("select",onSelect);
        }
    })

    document.body.appendChild(arButton);
    
    
   
	animate();


  window.addEventListener('resize',()=>{
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
  })

} else {

	const warning = WebGL.getWebGL2ErrorMessage();
	document.getElementById( 'errorcontainer' ).appendChild( warning );

}
