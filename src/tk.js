import styles from './scss/main.scss';
import {CursorDot} from './js/cursor.js';
import { gsap } from "gsap"
import { SplitText } from "gsap/SplitText"
import {Canvas} from './js/canvas.js'
gsap.registerPlugin(SplitText);

const init = function () {
  setYearAndAvailability();
  projectHoversInit();
  CursorDot.firstDraw();
  setTimeout(()=>{
    pageEnterAnimation();
  }, 1000);
  setTimeout(()=>{ // after first animation over
      Canvas.canvasInit();
      Canvas.cursorDotInit();
  }, 1200);
};

const projectHoversInit = () => {

  const $projectTitles = document.getElementsByClassName("project-title");

  for (var i = 0; i < $projectTitles.length; i++) {

    $projectTitles[i].addEventListener("mouseenter" , (_el) => {

      const $aniText = _el.target.getElementsByClassName("project-name")[0];

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
        }).to(  chars[i] , {
          duration: 0,
          opacity: 0,
          y: -10,
        }).to(  chars[i] , {
          duration: duration,
          opacity: 1,
          y: 0,
          ease: "power3.out",
        });

      }

    })
  }
}

const setYearAndAvailability = () => {
  const date =  new Date();
  const $setYear = document.getElementById('setYear');
  const $setYear2 = document.getElementById('setYear2');
  $setYear.innerHTML = date.getFullYear();
  $setYear2.innerHTML = date.getFullYear();

  const $setAvailability = document.getElementById('setAvailability');
  const months = [ "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December" ];
  let availableMonth = Number(date.getMonth() ) + 1;
  if(availableMonth > 12){
    availableMonth = 1;
  }
  $setAvailability.innerHTML =  months[ availableMonth ] + ' ' + date.getFullYear();
}

const pageEnterAnimation = () => {
    animateHeaderText();
    document.getElementById('firstAnimationOverlay').classList.add('hide');
};

const animateHeaderText = () => {
    const $headerText = document.getElementById('headerText');
    let mySplitText = new SplitText($headerText, { type: "words,chars" });
    let chars = mySplitText.chars;

    gsap.set($headerText, { perspective: 400 });

    let duration  = 0.75;

    for (let i = 0; i < chars.length; i++) {

        let tl = gsap.timeline();

        tl.to(chars[i] , {
            duration: 0,
            opacity: 0,
            y: 10,
        }).to(  chars[i] , {
            delay: 0.5 + (i*0.035),
            duration: duration,
            opacity: 1,
            y: 0,
            ease: "power3.out",
        });

    }
}

/*************************** */
// DOCUMENT LOADED -> INIT
/*************************** */

document.addEventListener("DOMContentLoaded", function (event) {
  init();
});
