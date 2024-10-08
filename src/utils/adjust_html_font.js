export function flexible (window, document) {
    var docEl = document.documentElement
    var dpr = window.devicePixelRatio || 1
  
    // adjust body font size
    function setBodyFontSize () {
      if (document.body) {
        document.body.style.fontSize = (12 * dpr) + 'px'
      }
      else {
        document.addEventListener('DOMContentLoaded', setBodyFontSize)
      }
    }
    setBodyFontSize();
  
    // set 1rem = viewWidth / 10
    function setRemUnit () {
        switch (true) {
            case (docEl.clientWidth<=500):
                var rem = docEl.clientWidth / 10
                docEl.style.fontSize = rem + 'px'
                break;
            case (docEl.clientWidth>=500&&1720>=docEl.clientWidth):
                docEl.style.fontSize = '35px'
                break;
            case (docEl.clientWidth >= 1720):
                docEl.style.fontSize = '53px'
                break;
            default:
                docEl.style.fontSize = '33px'
        }
        // if(docEl.clientWidth<500){
        //     var rem = docEl.clientWidth / 10
        //     docEl.style.fontSize = rem + 'px'
        // }else{
        //      docEl.style.fontSize = '50px'
        // }
      
    }
  
    setRemUnit()
  
    // reset rem unit on page resize
    window.addEventListener('resize', setRemUnit)
    window.addEventListener('pageshow', function (e) {
      if (e.persisted) {
        setRemUnit()
      }
    })
  
    // detect 0.5px supports
    if (dpr >= 2) {
      var fakeBody = document.createElement('body')
      var testElement = document.createElement('div')
      testElement.style.border = '.5px solid transparent'
      fakeBody.appendChild(testElement)
      docEl.appendChild(fakeBody)
      if (testElement.offsetHeight === 1) {
        docEl.classList.add('hairlines')
      }
      docEl.removeChild(fakeBody)
    }
  }