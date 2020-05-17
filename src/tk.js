import styles from './scss/main.scss';
import {getUserAgent} from './js/useragent.js';
import {Scroll} from './js/scroll.js';
import cursorDot from './js/cursor.js';


let scrollInstance = new Scroll;


const init = function () {

  setTimeout(()=>{
    pageEnterAnimation();
    // updateSectionPositions();
    // portfolioImageRotate();
  }, 500);
  // cursorInit();
  // projectsHoverInstance.init();
  // footerGoToTopBtnListen();

  setTimeout(()=>{
  scrollInstance.init();
}, 1500);

};

const pageEnterAnimation = () => {



}

const portfolioImageRotate = () => {
  let imgs = document.getElementsByClassName('portfolio-img');
  let activeImgIndex = 0;
  setInterval(() => {
    for (var i = 0; i < imgs.length; i++) {
      if(activeImgIndex == i){
        imgs[i].classList.add('active');
      }else {
        imgs[i].classList.remove('active');
      }
    }
    activeImgIndex++
    if(activeImgIndex > imgs.length - 1){
      activeImgIndex = 0;
    }
  }, 350);


}


/*************************** */
// Cursor
/*************************** */
class Cursor {
  constructor() {
    this.cursor = cursorDot({
      easing: 4,
      diameter: 50,
      borderWidth: 1,
      borderColor: "#e2e2e2",
      background: "transparent",
    });
  }
  setHoversOnLoad(){

    this.cursor.over("#footerParallax", {
      borderColor: "#e2e2e2",
    });
    this.cursor.over("#scrollToTopTrigger", {
      borderColor: "#e2e2e2",
      background: "#e2e2e2",
      mixBlendMode: "difference",
      scale: 1.6,
    });
    this.cursor.over(".vi-link", {
      borderColor: "#282f40",
      background: "#e2e2e2",
      mixBlendMode:  getUserAgent.isFirefox ? "difference" : "screen",
      scale: 1.6,
    });
    this.cursor.over(".howerki", {
      borderColor: getUserAgent.isFirefox ? '#e2e2e2' : '#282f40',
      mixBlendMode: getUserAgent.isFirefox ? "difference" : "screen",
      background: getUserAgent.isFirefox ? '#e2e2e2' : '#282f40',
      scale: 1.6,
    });
    this.cursor.over(".tomas-link", {
      borderColor: getUserAgent.isFirefox ? '#e2e2e2' : '#282f40',
      mixBlendMode: getUserAgent.isFirefox ? "difference" : "screen",
      background: getUserAgent.isFirefox ? '#e2e2e2' : '#282f40' ,
    });

    this.setBGColor('blue');

  }
  setBGColor(_color){ // options -> blue #282f40, white #e2e2e2
    let newBgColor = _color == 'white' ? '#e2e2e2' : '#282f40';
    this.cursor.updateBgColor(newBgColor);
    this.cursor.over(".vi-link", {
      borderColor: newBgColor,
      background: _color != 'white' ? '#282f40' : '#e2e2e2',
      mixBlendMode:  _color == 'white' ? "difference" : getUserAgent.isFirefox ? "difference" : "screen",
      scale: 1.6,
    });
  }
};



var cursorInstance;
var cursorInit = function () {
  cursorInstance = new Cursor();
  cursorInstance.setHoversOnLoad();
};

/*************************** */
// DOCUMENT LOADED -> INIT
/*************************** */

document.addEventListener("DOMContentLoaded", function (event) {

  init();

});
