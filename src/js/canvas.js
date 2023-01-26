
import * as THREE from 'three';
import gsap from 'gsap';
import Scroll from './scroll.js';
import imagesLoaded from 'imagesloaded';
import {CursorDot} from './cursor.js';
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
  this.hoverInProgress = true;
  this.container = options.dom;
  this.cursorDotInitiated = false;
  // this.container = options.dom;

  this.time = 0;
  this.scene = new THREE.Scene();

  this.materials = [];
  this.imageStore = [];

  this.images = [ ...document.querySelectorAll(".portfolio-img") ];

}
cursorDotInit(){
  CursorDot.init();
  this.cursorDotInitiated = true;
}
canvasInit(){

  // const $images = document.querySelectorAll(".portfolio-img");
  //
  // for (var i = 0; i < $images.length; i++) {
  //   let imageBox = $images[i].getBoundingClientRect()
  //   if(imageBox.width > 0){
  //     this.addImageMesh( i, "imageId_" + i , $images[i] );
  //   }
  //   // $images[i].addEventListener()
  // }

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

  this.listenersInit();
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
listenersInit(){
  window.addEventListener('resize', () => {
    this.setSize();

    this.imageStore = [];
    this.materials = [];

    for (var i = 0; i < this.images.length; i++) {
      const _id = "imageId_" + i;
      const selectedObject = this.scene.getObjectByName(_id);
      this.scene.remove( selectedObject );

      this.addImageMesh( i, _id , this.images[i] );
    }

  });

}
setSize(){
  this.width = this.container.offsetWidth;
  this.height = this.container.offsetHeight;
  this.renderer.setSize( this.width,this.height );
  this.camera.aspect = this.width/this.height;
  this.camera.updateProjectionMatrix();
}
meshAniInOut( _index, _mesh, _material ) {
  const oneImgTime = 0.4; // no effect
  const aniTime = 1;
  const aniOverlap = aniTime; //aniTime
  const oneRound = ( ( aniTime * 2 ) + oneImgTime - aniOverlap );
  const fullRoundTime = ( oneRound ) * ( this.images.length - 1 );

  let tl = gsap.timeline().delay(oneRound * _index);

    tl.fromTo(_material.uniforms.aniIn , { value: 0 } , {value: 1 , duration: aniTime }) //start sequencing
    .fromTo(_material.uniforms.aniIn, { value: 1 } , { value: 0 , duration: aniTime , delay: oneImgTime ,  })
    .fromTo(_material.uniforms.aniIn, { value: 0 } , { value: 0 , duration: fullRoundTime - oneRound })
    tl.repeat(-1);

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
getImageSize (_img){
  let bounds = _img.getBoundingClientRect();
  const newWidth = this.width - (bounds.left * 2);
  const sizeCoef =  newWidth / bounds.width;
  const newHeight = bounds.height * sizeCoef;
  return {width:newWidth , height: newHeight}
}
addImageMesh(_index, _id , _img){
  _img.style.opacity = 0;
  let fragmentShader;
  let vertexShader;
  let geometry;
  let bounds = _img.getBoundingClientRect();
  const imgSize = this.getImageSize(_img);
  let position = {top: bounds.top + this.currentScroll , left: bounds.left };

  geometry = new THREE.PlaneGeometry( imgSize.width , imgSize.height );

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
      aniIn: {value: 0},
      aniOut: {value: 0},
    },
    side: THREE.DoubleSide,
    fragmentShader: fragment,
    vertexShader: vertex,
    name: _id,
    transparent: true,
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
    width: imgSize.width,
    height: imgSize.height,
  }

  this.imageStore.push(newMesh);
  this.meshMouseListeners(newMesh, material);
  this.meshAniInOut(_index, newMesh, material);

  let meshIndex = this.imageStore.length -1;

  this.setImageMeshPositions();

}
  resetImageMeshPosition(){
  for (var i = 0; i < this.imageStore.length; i++) {
    const newBounds = this.imageStore[i].img.getBoundingClientRect();
    const newSize = this.getImageSize(this.imageStore[i].img);

    this.imageStore[i].left = newBounds.left;
    this.imageStore[i].top = newBounds.top;
    this.imageStore[i].width = newSize.width;
    this.imageStore[i].height = newSize.height;

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

    //animate on scroll
    if(
      this.scrollInProgress
    ){
      this.customPass.uniforms.scrollSpeed.value = this.scroll.speedTarget;
      this.setImageMeshPositions();
    }
    //animate time
    for (var i = 0; i < this.materials.length; i++) {
      this.materials[i].uniforms.time.value = this.time;
    }

    this.composer.render();

    if(this.cursorDotInitiated){
      CursorDot.animateDotOutline();
    }

    window.requestAnimationFrame(this.render.bind(this));

  }

}

const Canvas = new CanvasClass({
  dom: document.getElementById('tkAnimationContainer')
});

export {Canvas};
