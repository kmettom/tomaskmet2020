
import * as THREE from 'three';
import gsap from 'gsap';
import Scroll from './scroll.js';
import imagesLoaded from 'imagesloaded';

// import imageGalleryFragment from './shaders/imageGalleryFragment.glsl';
// import imageGalleryVertex from './shaders/imageGalleryVertex.glsl';
// import galleryFragment from './shaders/galleryFragment.glsl';
// import galleryVertex from './shaders/galleryVertex.glsl';
// import thumbFragment from './shaders/thumbFragment.glsl';
// import thumbVertex from './shaders/thumbVertex.glsl';
import scrollFragment from './shaders/scrollFragment.glsl';
import scrollVertex from './shaders/scrollVertex.glsl';
import fragment from './shaders/fragment.glsl';
import vertex from './shaders/vertex.glsl';


import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

class CanvasClass{
  constructor(options){

  this.scrollInProgress = false;
  this.resizeInProgress = false;
  this.hoverInProgress = true;
  this.container = options.dom;
  // this.container = options.dom;

  this.time = 0;
  this.scene = new THREE.Scene();

  this.materials = [];
  this.imageStore = [];

  this.images = [ ...document.querySelectorAll(".portfolio-img") ];

}
canvasInit(){

  // Preload images
  const preloadImages = new Promise((resolve, reject) => {
    imagesLoaded(document.querySelectorAll(".portfolio-img"), { background: true }, resolve);
  });

  Promise.all([preloadImages]).then(() => {

    // this.addImageMesh(0 , "i_" + 0 , this.images[0] );
    for (var i = 0; i < this.images.length; i++) {
      this.addImageMesh( i, "imageId_" + i , this.images[i] );
    }
  })

  this.width = this.container.offsetWidth;
  this.height = this.container.offsetHeight;

  this.camera = new THREE.PerspectiveCamera( 70, this.width/this.height, 100, 2000 );
  this.camera.position.z = 600; // 600

  this.camera.fov = 2*Math.atan( (this.height/2)/600 )* (180/Math.PI);

  this.renderer = new THREE.WebGLRenderer({
    // antialias: true,
    alpha: true
  });
  this.renderer.setPixelRatio(Math.min(window.devicePixelRatio , 1.5));

  // this.listenersInit();
  // SHADOW
  this.renderer.shadowMap.enabled = true;
  this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  this.container.appendChild( this.renderer.domElement );

  // this.controls = new OrbitControls( this.camera, this.renderer.domElement );

  this.currentScroll = 0;
  this.raycaster = new THREE.Raycaster();

  this.setSize();

  this.scroll = new Scroll({
    dom: document.getElementById('scrollContainer'),
  });

  this.composerPass();

  this.render();
}
setSize(){
  this.width = this.container.offsetWidth;
  this.height = this.container.offsetHeight;
  this.renderer.setSize( this.width,this.height );
  this.camera.aspect = this.width/this.height;
  this.camera.updateProjectionMatrix();
}
meshAniInOut( _index, _mesh, _material ) {
  const oneImgTime = 0.35; // no effect
  const aniTime = 0.75;
  const oneRound = ( aniTime * 2 + oneImgTime) ;
  const fullRoundTime = oneRound * ( this.images.length - 1 ) ;

  let tl = gsap.timeline();

  setTimeout(() => {

    tl.fromTo(_material.uniforms.aniInOut , { value: 0 } , {value: 1 , duration: aniTime }) //start sequencing
    .fromTo(_material.uniforms.aniInOut, { value: 1 } , { value: 0 , duration: aniTime , delay: oneImgTime ,  })
    .fromTo(_material.uniforms.aniInOut, { value: 0 } , { value: 0 , duration: fullRoundTime })
    tl.repeat(-1);

  }, oneRound *_index * 1000 );

}
meshMouseListeners(_mesh, _material) {

  _mesh.img.addEventListener('mouseenter',(event)=>{
    this.hoverInProgress = true;
    gsap.to(_material.uniforms.hoverState, {
      duration: 0.5,
      value:1
    })
  })

  _mesh.img.addEventListener('mouseout',()=>{
    this.hoverInProgress = false;
    gsap.to(_material.uniforms.hoverState,{
      duration: 0.5,
      value:0
    })
  })

}

addImageMesh(_index, _id , _img){

  _img.style.opacity = 0;
    let fragmentShader;
    let vertexShader;
    let geometry;
    let bounds = _img.getBoundingClientRect();
    let position = { top : bounds.top , left: bounds.left};

    geometry = new THREE.PlaneGeometry( bounds.width , bounds.height );
    // position.top += this.currentScroll ;

    let texture = new THREE.Texture(_img);
    texture.needsUpdate = true;

    let material = new THREE.ShaderMaterial({
      uniforms:{
        time: {value:0},
        uImage: {value: texture},
        vectorVNoise: {value: new THREE.Vector2( 1.5 , 1.5 )}, // 1.5
        vectorWave: {value: new THREE.Vector2( 0.5 , 0.5 )}, // 0.5
        hoverState: {value: 0},
        hover: {value: new THREE.Vector2(0.5,0.5)},
        aniInOut: {value: 0},
      },
      side: THREE.DoubleSide,
      fragmentShader: fragment,
      vertexShader: vertex,
      name: _id,
      transparent: true,
      // opacity: 0.1,
      // side: THREE.DoubleSide,
      // wireframe: true
    });

    this.materials.push(material);

    let mesh = new THREE.Mesh( geometry, material );
    mesh.name =  _id;

    mesh.castShadow = true;
    mesh.receiveShadow = true;
    this.scene.add(mesh);

    const newMesh = {
      name:_id,
      img: _img,
      mesh: mesh,
      top: position.top,
      left: position.left,
      width: bounds.width,
      height: bounds.height,
    }

    this.imageStore.push(newMesh);
    this.meshMouseListeners(newMesh, material);
    this.meshAniInOut(_index, newMesh, material);
    this.scroll.setSize();

    let meshIndex = this.imageStore.length -1;

    this.setImageMeshPositions();

  }
  resetImageMeshPosition(){
  for (var i = 0; i < this.imageStore.length; i++) {
    const newBounds = this.imageStore[i].img.getBoundingClientRect()
    this.imageStore[i].left = newBounds.left;
    this.imageStore[i].top = newBounds.top;
    this.imageStore[i].width = newBounds.width;
    this.imageStore[i].height = newBounds.height;

    if(newBounds.width != this.imageStore[i].mesh.geometry.parameters.width){
      console.log("resize image");
    }

    this.imageStore[i].mesh.position.x = this.imageStore[i].left - this.width/2 + this.imageStore[i].width/2;
    this.imageStore[i].mesh.position.y =  - this.imageStore[i].top + this.height/2 - this.imageStore[i].height/2;
  }

}
setImageMeshPositions(){
    if(!this.imageStore) return;

    for (var i = 0; i < this.imageStore.length ; i++) {

      if(
        this.currentScroll < this.imageStore[i].top + this.imageStore[i].height
        && this.imageStore[i].top  < this.currentScroll + this.height
      ){
        this.imageStore[i].mesh.position.x = ( this.imageStore[i].left - this.width/2 + this.imageStore[i].width/2) ;
        this.imageStore[i].mesh.position.y = (this.currentScroll - this.imageStore[i].top + this.height/2 - this.imageStore[i].height/2) ;
      }
      else {
        this.imageStore[i].mesh.position.y = this.height*2;
      }

    }
  }
  composerPass(){
    this.composer = new EffectComposer(this.renderer);
    this.renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(this.renderPass);

    //custom shader pass
    // var counter = 0.0;
    this.myEffect = {
      uniforms: {
        "tDiffuse": { value: null },
        "scrollSpeed": { value: null },
      },
      vertexShader: scrollVertex,
      fragmentShader: scrollFragment,
    }

    this.customPass = new ShaderPass(this.myEffect);
    this.customPass.renderToScreen = true;

    this.composer.addPass(this.customPass);
  }
  render () {

    this.time+=0.05;

    this.scroll.render();
    this.scrollInProgress = this.currentScroll != this.scroll.scrollToRender ;
    this.currentScroll = this.scroll.scrollToRender;

    // update image mesh positions on resize
    if(this.resizeInProgress){
      this.resetImageMeshPosition();
    }
    //animate on scroll
    if(
      this.scrollInProgress
    ){
      this.customPass.uniforms.scrollSpeed.value = this.scroll.speedTarget;
      this.setImageMeshPositions();
    }
    //animate on hover
    // if(this.hoverInProgress){
      for (var i = 0; i < this.materials.length; i++) {
        this.materials[i].uniforms.time.value = this.time;
      }
    // }

    this.composer.render()
    window.requestAnimationFrame(this.render.bind(this));

  }

}

const Canvas = new CanvasClass({
  dom: document.getElementById('tkAnimationContainer')
});

export {Canvas};
