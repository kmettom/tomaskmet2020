
import * as THREE from 'three';
import gsap from 'gsap';


class Canvas{
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

  this.options = {
    gallery: {
      fragmentShader: galleryFragment,
      vertexShader: galleryVertex,
    },
    thumb: {
      fragmentShader: thumbFragment,
      vertexShader: thumbVertex,
    },
    imagegallery: {
      fragmentShader: imageGalleryFragment,
      vertexShader: imageGalleryVertex,
    },

  }

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

  this.listenersInit();
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
  render () {

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

export {Canvas};
