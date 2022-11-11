
import * as THREE from 'three';
import gsap from 'gsap';
import Scroll from './scroll.js';


// import imageGalleryFragment from './shaders/imageGalleryFragment.glsl';
// import imageGalleryVertex from './shaders/imageGalleryVertex.glsl';
// import galleryFragment from './shaders/galleryFragment.glsl';
// import galleryVertex from './shaders/galleryVertex.glsl';
// import thumbFragment from './shaders/thumbFragment.glsl';
// import thumbVertex from './shaders/thumbVertex.glsl';
// import scrollFragment from './shaders/scrollFragment.glsl';
// import scrollVertex from './shaders/scrollVertex.glsl';


import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

class CanvasClass{
  constructor(options){

  this.scrollInProgress = false;
  this.galleryActive = {value:0}; // false
  this.thumbToArticleAnimation = false;
  this.resizeInProgress = false;
  this.hoverInProgress = true;
  this.container = options.dom;
  this.pointer = {cursor: null , intersects: null };
  // this.container = options.dom;

  this.time = 0;
  this.scene = new THREE.Scene();

  this.materials = [];
  this.imageStore = [];

  // this.options = {
  //   gallery: {
  //     fragmentShader: galleryFragment,
  //     vertexShader: galleryVertex,
  //   },
  //   thumb: {
  //     fragmentShader: thumbFragment,
  //     vertexShader: thumbVertex,
  //   },
  //   imagegallery: {
  //     fragmentShader: imageGalleryFragment,
  //     vertexShader: imageGalleryVertex,
  //   },
  //
  // }

}
canvasInit(){

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
  this.pointer.cursor = new THREE.Vector2();

  this.setSize();

  this.scroll = new Scroll({
    dom: document.getElementById('scrollContainer'),
  });

  this.setLight()

  this.composerPass()

  this.render();

  window.addEventListener('pointermove', (event) => {
    this.pointer.cursor.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    this.pointer.cursor.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  });
}
setSize(){
  this.width = this.container.offsetWidth;
  this.height = this.container.offsetHeight;
  this.renderer.setSize( this.width,this.height );
  this.camera.aspect = this.width/this.height;
  this.camera.updateProjectionMatrix();
}
meshAniIn(_mesh, _material, _type) {
  const min = 1;
  const max = _type == "gallery" ? 1000:500;
  const randomize = Math.floor(Math.random() * (max - min + 1) + min);
  setTimeout( () => {
    gsap.to(_material.uniforms.aniIn , {
      duration: _type == "gallery" ? 2 : 1.25,
      value: 1
    })
  } , randomize)

}
addImageMesh( _type , _id , _img){
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
        cursorPositionX: {value: 0},
        cursorPositionY: {value: 0},
        aniIn: {value: 0},
        aniOut: {value: 0},
        aniOutToArticle: {value: 0},
        aniInImageGallery: {value: 0},
        aniOutImageGallery: {value: 0},
        galleryActive: {value: 0},
      },
      // fragmentShader: this.options[_type].fragmentShader,
      // vertexShader: this.options[_type].vertexShader,
      transparent: true,
      name: _id,
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
      thumbOutAction: {value: 0},
    }

    this.imageStore.push(newMesh);
    this.meshMouseListeners(newMesh, material);
    this.meshAniIn(newMesh, material, _type);
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

      if(this.imageStore[i].mesh.name.includes("imagegallery") ){
        this.imageStore[i].mesh.position.x = this.imageStore[i].left - this.width/2 + this.imageStore[i].width/2 ;
      }else {

        if(
          this.currentScroll < this.imageStore[i].top + this.imageStore[i].height
          && this.imageStore[i].top  < this.currentScroll + this.height
          || this.galleryActive.value !== 0
        ){

          this.imageStore[i].mesh.position.x = ( this.imageStore[i].left * ( 1 - this.galleryActive.value ) - this.width/2 + this.imageStore[i].width/2) * ( 1 - this.imageStore[i].thumbOutAction.value/1.5) ;

          let galAni = this.galleryActive.value === 0 ? 0 : (  + this.imageStore[i].top - this.imageStore[i].height * i ) * this.galleryActive.value ;
          this.imageStore[i].mesh.position.y = (this.currentScroll + galAni - this.imageStore[i].top + this.height/2 - this.imageStore[i].height/2) * ( 1 - this.imageStore[i].thumbOutAction.value/1.5);

        }
        else {
          this.imageStore[i].mesh.position.y = this.height*2;
        }

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

    console.log("render");

  // this.time+=0.05;
  //
  // this.scroll.render();
  // this.scrollInProgress = this.currentScroll != this.scroll.scrollToRender ;
  // this.currentScroll = this.scroll.scrollToRender;
  //
  // // update image mesh positions on resize
  // if(this.resizeInProgress){
  //   this.resetImageMeshPosition();
  // }
  // //animate on scroll
  // if(
  //   this.scrollInProgress
  //   || ( 0 < this.galleryActive.value && this.galleryActive.value < 1)
  //   || this.thumbToArticleAnimation
  // ){
  //   this.customPass.uniforms.scrollSpeed.value = this.scroll.speedTarget;
  //   this.setImageMeshPositions();
  // }
  //
  // //animate on hover
  // if(this.hoverInProgress){
  //   for (var i = 0; i < this.materials.length; i++) {
  //     this.materials[i].uniforms.time.value = this.time;
  //   }
  // }
  //
  // this.checkGalleryImageHovers()
  //
  // this.composer.render()

  }

}

const Canvas = new CanvasClass({
  dom: document.getElementById('tkAnimationContainer')
});

export {Canvas};
