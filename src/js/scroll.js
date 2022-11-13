const lerp = (a, b, n) => (1 - n) * a + n * b

export default class Scroll{
  constructor(_options){

    this.DOM = { main: _options.dom };

    // the scrollable element
    // we translate this element when scrolling (y-axis)
    this.DOM.scrollable = this.DOM.main.querySelector("#scrollableContainer");
    // this.DOM.scrollable = this.DOM.main.querySelector("div[data-scroll]");
    this.docScroll = 0;
    this.scrollToRender = 0;
    this.current = 0;
    this.ease = 0.1;
    this.speed = 0;
    this.speedTarget = 0;
    this.scrollTo = {target: 0 , executed: true}

    this.setSize();
    this.getScroll();
    this.init();
    this.style();
    this.initEvents();

    // requestAnimationFrame(() => this.render());
  }

  init(){
    // sets the initial value (no interpolation) - translate the scroll value
    for (const key in this.renderedStyles) {
      this.current = this.scrollToRender = this.getScroll();
    }
    // translate the scrollable element
    this.setPosition();
    this.shouldRender = true;
  }

  style(){
    this.DOM.main.style.position = "fixed";
    this.DOM.main.style.width = this.DOM.main.style.height = "100%";
    this.DOM.main.style.top = this.DOM.main.style.left = 0;
    this.DOM.main.style.overflow = "hidden";
  }

  getScroll(){
    // this.docScroll = window.pageYOffset || document.documentElement.scrollTop;
    this.docScroll = this.current = window.pageYOffset;
    return this.docScroll;
  }
  initEvents() {

    // on resize reset the body's height
    window.addEventListener("resize", () => this.setSize());
    window.addEventListener("scroll", () => {
      this.getScroll();
    }
  );

  }

  setSize() {
    // set the heigh of the body in order to keep the scrollbar on the page
    // document.body.style.height = this.DOM.scrollable.scrollHeight > window.innerHeight ? `${this.DOM.scrollable.scrollHeight}px` : `${window.innerHeight}px`;
    document.body.style.height = `${this.DOM.scrollable.scrollHeight}px`;
  }

  setPosition() {
    // translate the scrollable container
    if ( Math.round(this.scrollToRender) !==  Math.round(this.current) || this.scrollToRender < 10  || !this.scrollTo.executed ) {
      this.DOM.scrollable.style.transform = `translate3d(0,${-1 * this.scrollToRender}px,0)`;
    }

  }

  render(_scrollTo) {
    this.setSize();

    if( _scrollTo  ){
      this.scrollTo.executed = false;
      this.scrollTo.target = Number(_scrollTo);

    }else if ( !this.scrollTo.executed ) {
      this.scrollToRender = this.scrollTo.target;
      const margin = 10;
      if(this.current <= this.scrollToRender + margin ){
        this.scrollTo.executed = true;
      }
    }
     else {
      this.scrollToRender = Math.round(
        lerp(
          this.scrollToRender,
          this.current,
          this.ease
        )
      );
    }

    // scroll speed for Canvas
    this.speed = Math.min(Math.abs(this.current - this.scrollToRender), 200)/200;
    this.speedTarget +=(this.speed - this.speedTarget)*0.2
    this.setPosition();
  }

}
