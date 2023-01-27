const CursorDot = {
    delay: 6,
    _x: 0,
    _y: 0,
    endX: (window.innerWidth / 2),
    endY: (window.innerHeight / 2),
    cursorVisible: true,
    cursorEnlarged: false,
    $dot: document.querySelector('#cursorDot'),
    $outline: document.querySelector('#cursorDotOutline'),

    firstDraw: function (){
      this.dotSize = this.$dot.offsetWidth;
      this.outlineSize = this.$outline.offsetWidth;
      this.animateDotOutline();
    },
    init: function() {
        this.dotSize = this.$dot.offsetWidth;
        this.outlineSize = this.$outline.offsetWidth;
        this.animateDotOutline();
        this.setupEventListeners();
    },

    setupEventListeners: function() {

        var self = this;

        document.querySelectorAll('.cursor-hover').forEach(function(el) {
            el.addEventListener('mouseover', function() {
                self.cursorEnlarged = true;
                self.toggleCursorSize();
            });
            el.addEventListener('mouseout', function() {
                self.cursorEnlarged = false;
                self.toggleCursorSize();
            });
        });

        document.addEventListener('mousedown', function() {
            self.cursorEnlarged = true;
            self.toggleCursorSize();
        });
        document.addEventListener('mouseup', function() {
            self.cursorEnlarged = false;
            self.toggleCursorSize();
        });


        document.addEventListener('mousemove', function(e) {
            self.cursorVisible = true;
            self.toggleCursorVisibility();

            self.endX = e.clientX;
            self.endY = e.clientY;
            self.$dot.style.top = self.endY + 'px';
            self.$dot.style.left = self.endX + 'px';

        });

        document.addEventListener('mouseenter', function(e) {
            self.cursorVisible = true;
            self.toggleCursorVisibility();
            self.$dot.style.opacity = 1;
            self.$outline.style.opacity = 1;
        });

        document.addEventListener('mouseleave', function(e) {
            self.cursorVisible = true;
            self.toggleCursorVisibility();
            self.$dot.style.opacity = 0;
            self.$outline.style.opacity = 0;
        });
    },

    animateDotOutline: function() {
        var self = this;
        self._x += (self.endX - self._x) / self.delay;
        self._y += (self.endY - self._y) / self.delay;
        self.$outline.style.top = self._y + 'px';
        self.$outline.style.left = self._x + 'px';
    },

    toggleCursorSize: function() {
        var self = this;
        if (self.cursorEnlarged) {
            self.$dot.style.transform = 'translate(-50%, -50%) scale(6.0)';
            self.$outline.style.transform = 'translate(-50%, -50%) scale(0.65)';
            self.$outline.style.border = '0px solid #eeeeee';
            self.$outline.style.borderTop = '5px solid #eeeeee';
            self.$outline.style.borderRight = '5px solid #eeeeee';
            self.$outline.style.borderRadius = '0%';
        } else {
            self.$outline.style.borderRadius = '50%';
            self.$outline.style.borderTop = '1px solid #333333';
            self.$outline.style.borderRight = '1px solid #333333';
            self.$outline.style.border = '1px solid #333333';
            self.$dot.style.transform = 'translate(-50%, -50%) scale(1)';
            self.$outline.style.transform = 'translate(-50%, -50%) scale(1)';
        }
    },

    toggleCursorVisibility: function() {
        var self = this;
        if (self.cursorVisible) {
            self.$dot.style.opacity = 1;
            self.$outline.style.opacity = 1;
        } else {
            self.$dot.style.opacity = 0;
            self.$outline.style.opacity = 0;
        }
    }
}

export {CursorDot};
