let WebMonitor = function () {
  this.init()
}

WebMonitor.prototype.init = function () {
  this.addEventListener('ajax')
  this.addEventListener('error')
  this.addEventListener('unhandledrejection')
  // window.performance.getEntriesByType('resource')
  this.send(window.performance)
}
WebMonitor.prototype.addEventListener = function (type) {
  if (type === 'ajax') this.initAjax()
  if (type === 'error') window.addEventListener('error', this.send)
  if (type === 'unhandledrejection') window.addEventListener('unhandledrejection', this.send)
}
WebMonitor.prototype.initAjax = function () {
  let self = this
  let XMLHttpRequestSend = XMLHttpRequest.prototype.send;
  let XMLHttpRequestOpen = XMLHttpRequest.prototype.open;
  
  
  XMLHttpRequest.prototype.open = function () {
    console.log(arguments)
    XMLHttpRequestOpen.apply(this, arguments);
  }
  
  XMLHttpRequest.prototype.send = function () {
    
    XMLHttpRequestSend.apply(this, arguments);
    
    this.onloadend = function () {
      //console.log(this)
      self.send(this)
    }
  }
}

WebMonitor.prototype.send = function (message) {
  // 何时上报？
  // 可以在浏览器空闲的时候上报 window.requestIdleCallback
  console.log(message)
  
}

window.addEventListener('load', function () {
  new WebMonitor().init()
})

