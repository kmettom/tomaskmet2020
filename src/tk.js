import styles from './scss/main.scss';
import {getUserAgent} from './js/useragent.js';
import {Scroll} from './js/scroll.js';
import {cursorDot} from './js/cursor.js';

let scrollInstance = new Scroll;

const init = function () {
  cursorDot.firstDraw();
  setTimeout(()=>{
    pageEnterAnimation();
  }, 1000);
  setTimeout(()=>{ // after first animation over
    scrollInstance.init();
    portfolioImageRotate();
    cursorDot.init();
  }, 1200);
};

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
