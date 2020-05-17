
    export const getUserAgent =  {
      uA: navigator.userAgent.toLowerCase(),
      get isMobileIE() {
        return /iemobile/i.test(this.uA)
      },
      get isMobileOpera() {
        return /opera mini/i.test(this.uA)
      },
      get isIOS() {
        return /iphone|ipad|ipod/i.test(this.uA)
      },
      get isBlackberry() {
        return /blackberry/i.test(this.uA)
      },
      get isMobileAndroid() {
        return /android.*mobile/.test(this.uA)
      },
      get isAndroid() {
        return this.isMobileAndroid || !this.isMobileAndroid && /android/i.test(this.uA)
      },
      get isFirefox() {
        return -1 < this.uA.indexOf("firefox")
      },
      get safari() {
        return this.uA.match(/version\/[\d\.]+.*safari/)
      },
      get isSafari() {
        return !!this.safari && !this.isAndroid
      },
      get isSafariOlderThan8() {
        var a = 8;
        if (this.isSafari) {
          var b = this.safari[0].match(/version\/\d{1,2}/);
          a = +b[0].split("/")[1]
        }
        return a < 8
      },
      get isIEolderThan11() {
        return -1 < this.uA.indexOf("msie")
      },
      get isIE11() {
        return 0 < navigator.appVersion.indexOf("Trident/")
      },
      get isIE() {
        return this.isIEolderThan11 || this.isIE11
      },
      get isEdge() {
        return /Edge\/\d./i.test(this.uA)
      },
      get isMac() {
        return -1 < navigator.platform.toLowerCase().indexOf("mac")
      },
      get isMobile() {
        return this.isMobileAndroid || this.isBlackberry || this.isIOS || this.isMobileOpera || this.isMobileIE
      },
      get isTouch() {
        return "ontouchstart" in window
      }
    };
