import styles from './scss/main.scss';
import {getUserAgent} from './js/useragent.js';
import {CursorDot} from './js/cursor.js';
// import gsap from 'gsap';
import { gsap } from "gsap"

import { SplitText } from "gsap/SplitText"

gsap.registerPlugin(SplitText);

// import {Scroll} from './js/scroll.js';
// let scrollInstance = new Scroll;

import {Canvas} from './js/canvas.js'

const init = function () {
  setYear();
  projectHoversInit();
  CursorDot.firstDraw();
  setTimeout(()=>{
    pageEnterAnimation();
  }, 1000);
  setTimeout(()=>{ // after first animation over
    // if(window.innerWidth > 550){
      Canvas.canvasInit();
      Canvas.cursorDotInit();
    // } else {
      // portfolioImageRotate();
    // }
  }, 1200);
};

const projectHoversInit = () => {

  const $projectTitles = document.getElementsByClassName("project-title");

  for (var i = 0; i < $projectTitles.length; i++) {

    $projectTitles[i].addEventListener("mouseenter" , (_el) => {

      const $aniText = _el.target.getElementsByClassName("project-name")[0];

      // let tl = gsap.timeline();
      let mySplitText = new SplitText($aniText, { type: "words,chars" });
      let chars = mySplitText.chars;

      gsap.set($aniText, { perspective: 400 });

      let duration  = 0.15;

      for (var i = 0; i < chars.length; i++) {

        let tl = gsap.timeline();

        tl.to(  chars[i] , {
          delay: i*0.035,
          duration: duration,
          opacity: 0,
          y: 10,
          ease: "power3.out",
          // stagger: {
          //   each:stagger,
          // }
        }).to(  chars[i] , {
          duration: 0,
          opacity: 0,
          y: -10,
        }).to(  chars[i] , {
          duration: duration,
          opacity: 1,
          y: 0,
          ease: "power3.out",
          // stagger: {
          //   each: stagger,
          // },
        });

      }



    })
  }


}

const setYear = () => {
  const date =  new Date().getFullYear();
}

const pageEnterAnimation = () => {
  document.getElementById('firstAnimationOverlay').classList.add('hide');
  // document.getElementById('menuElements').classList.add('animate-in');
  // document.getElementById('headerText').classList.add('animate-in');
};

const portfolioImageRotate = () => {
  let imgs = document.getElementsByClassName('portfolio-img');
  let activeImgIndex = 0;

  const fps = 2.5;
  const imageChange = () => {
    setTimeout(function() {
      if(activeImgIndex > imgs.length - 1) activeImgIndex = 0;
      for (var i = 0; i < imgs.length; i++) {
        if(i == activeImgIndex){
          imgs[i].style.zIndex = '1';
        }else {
          imgs[i].style.zIndex = '0';
        }
      }
      activeImgIndex++
      requestAnimationFrame(imageChange);
    }, 1000 / fps);
  };
  imageChange();

}


/*************************** */
// Cursor
/*************************** */
// class Cursor {
//   constructor() {
//     this.cursor = cursorDot({
//       easing: 4,
//       diameter: 50,
//       borderWidth: 1,
//       borderColor: "#e2e2e2",
//       background: "transparent",
//     });
//   }
//
// };

// var cursorInstance;
// var cursorInit = function () {
//   cursorInstance = new Cursor();
//
// };

/*************************** */
// DOCUMENT LOADED -> INIT
/*************************** */

document.addEventListener("DOMContentLoaded", function (event) {
  init();
});
