let WebMonitor = function () {
  this.init()
}

WebMonitor.prototype.init = function () {
  this.tasks = [];
  this.addEventListener('ajax')
  this.addEventListener('error')
  this.addEventListener('unhandledrejection')
  // window.performance.getEntriesByType('resource')
  this.send(window.performance)
}
WebMonitor.prototype.addEventListener = function (type) {
  if (type === 'ajax') this.initAjax()
  if (type === 'error') window.addEventListener('error', (err) => this.send(err))
  if (type === 'unhandledrejection') window.addEventListener('unhandledrejection', (err) => this.send(err))
}
WebMonitor.prototype.initAjax = function () {
  let self = this
  let XMLHttpRequestSend = XMLHttpRequest.prototype.send;
  let XMLHttpRequestOpen = XMLHttpRequest.prototype.open;
  
  
  XMLHttpRequest.prototype.open = function () {
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
  this.tasks.push(message)
  // 何时上报？
  // 可以在浏览器空闲的时候上报 window.requestIdleCallback
  requestIdleCallback((deadline) => this.report(deadline))
  
}

WebMonitor.prototype.report = function(deadline) {
  while ((deadline.timeRemaining() > 0 || deadline.didTimeout) && this.tasks.length > 0) {
    let task = this.tasks.shift()
    console.log(task)
  }
  if (this.tasks.length > 0) requestIdleCallback((deadline) => this.report(deadline))
}

window.addEventListener('load', function () {
  new WebMonitor().init()
})

