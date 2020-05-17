
import {getUserAgent} from './useragent.js';

class Scroll{
  constructor() {
    this.scrl_element = null;
    this.Y_pos = 0;
    this.Y_dest = 0;
    // this.slow = getUserAgent.isFirefox ? 1 : 1.65;
    this.slow = getUserAgent.isFirefox ? 1.6 : 2;
    this.moz_balancing = getUserAgent.isFirefox ? 20 : 1;
    this.key_scroll_size = 80;
    this.touchScrollSize = 20;
    this.is_disable = false;
  }
  init (_onRenderCall) {
    // this.importedOnRenderCall = _onRenderCall;
    this.refresh();
    this.init_events_handlers();
    this.render();
  }
  scroll_top_slow () {
    return (this.scroll_top_speed = 50,  0 > this.Y_dest - this.scroll_top_speed) ? void(this.Y_dest = 0) : void(this.Y_dest -= this.scroll_top_speed, requestAnimationFrame(this.scroll_top_slow.bind(this)))
  };
  set scrollToTopSlow (_scrollTo){
    // this.Y_dest = _scrollTo;
    this.scroll_top_slow()
  }
  set Y_dest_update (_scrollTo){
    this.Y_dest = _scrollTo;
    // this.scroll_top_slow()
  }
  set max_scroll_update (_newWinHeight){
    this.max_scroll = this.scrl_element.offsetHeight - _newWinHeight;
    if(this.Y_dest > this.max_scroll) this.Y_dest = this.max_scroll;
  }
  refresh () {
    this.init_elements()
    this.get_doc_height()
  };
  init_elements () {
    this.scrl_element = document.getElementById("scrollContainer");
    this.Y_dest = 0, this.Y_pos = 0;
  };
  get_doc_height () {
    this.max_scroll = this.scrl_element.offsetHeight - window.innerHeight;
  };
  wheel_handler (_event) {
    if (!this.is_disable) {
      getUserAgent.isSafari && _event.preventDefault();
      var scrollSpeed = _event.deltaY * this.moz_balancing;

      if( 0 <= this.Y_dest + scrollSpeed && this.Y_dest + scrollSpeed <= this.max_scroll ){
        this.Y_dest += scrollSpeed / this.slow
      }else {
        if( 0 > this.Y_dest + scrollSpeed){
          this.Y_dest = 0
        }else {
          if( this.Y_dest + scrollSpeed > this.max_scroll){
          this.Y_dest = this.max_scroll
          this.reachEnd = true
          }
        }
      }
    }
  };
  keyboard_handler (_event) {
    if(!this.disable){
      if ("ArrowDown" == _event.key && this.Y_dest + this.key_scroll_size <= this.max_scroll) {
        this.Y_dest += this.key_scroll_size
      }else {
        if ( "ArrowDown" == _event.key && this.Y_dest + this.key_scroll_size > this.max_scroll) {
          this.Y_dest = this.max_scroll
          this.reachEnd = true
        }
        else {
          if("ArrowUp" == _event.key && 0 <= this.Y_dest - this.key_scroll_size){
            this.Y_dest -= this.key_scroll_size
          }else {
            if("ArrowUp" == _event.key && 0 > this.Y_dest - this.key_scroll_size ){
              this.Y_dest = 0
            }else {
              if ("Space" == _event.code && this.Y_dest + 300 <= this.max_scroll) {
                this.Y_dest += 300
              }else {
                if ("Space" == _event.code && this.Y_dest + 300 > this.max_scroll ) {
                  this.Y_dest = this.max_scroll
                  this.reachEnd = true
                }
              }
            }

          }
        }
      }
    }
  };
  touch_start_handler (_event) {
    if(!this.disable){
      this.touchStartPos = _event.touches[0].clientY
      this.scrollPosition = this.Y_dest
    }
  };
  touch_move_handler (_event) {
    this.touchMovePos = _event.changedTouches[0].clientY;

    if(0 < this.touchStartPos - this.touchMovePos){
      if(this.scrollPosition <= this.max_scroll){
        this.scrollPosition += 2.2 * (this.touchStartPos - this.touchMovePos)
        this.touchStartPos = this.touchMovePos + 0
        this.Y_dest = this.scrollPosition
      }else {
        if(  this.Y_dest + this.touchScrollSize > this.max_scroll){
            this.Y_dest = this.max_scroll
            this.reachEnd = true
        }
      }
    }else {
      if(  0 > this.touchStartPos - this.touchMovePos){
        if(0 <= this.Y_dest - this.touchScrollSize){
        this.scrollPosition += 2.2 * (this.touchStartPos - this.touchMovePos)
         this.touchStartPos = this.touchMovePos - 0
         this.Y_dest = this.scrollPosition
       }else {
          0 > this.Y_dest - this.touchScrollSize && (this.Y_dest = 0)
       }
      }
    }

  };
  resize_handler () {
    this.get_doc_height()
  };
  init_events_handlers () {
    window.addEventListener("scroll", function(_event) {
      _event.preventDefault()
    }),
    window.addEventListener("wheel", this.wheel_handler.bind(this), false),
    window.addEventListener("keydown", this.keyboard_handler.bind(this)),
    window.addEventListener("touchstart", this.touch_start_handler.bind(this)),
    window.addEventListener("touchmove", this.touch_move_handler.bind(this))
  }
  positionNumConvert (_yPos,_yDest, _coef) {
    return (1 - _coef) * _yPos + _coef * _yDest
  }
  transform_elements () {
    if (!this.is_disable) {
      this.Y_pos = this.positionNumConvert(this.Y_pos, this.Y_dest, .08);
      this.Y_pos = Math.floor(100 * this.Y_pos) / 100;
      this.scrl_element.style.transform = "translate3d(0, -" + this.Y_pos + "px, 0)";
    }
    // requestAnimationFrame();
    // this.importedOnRenderCall();
  }
  render () {
    this.transform_elements();
    try {
      requestAnimationFrame(this.render.bind(this));
    } catch (_) {
      setImmediate(this.render.bind(this));
    }

  }

}

export {Scroll};
