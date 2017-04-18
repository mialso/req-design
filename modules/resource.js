'use strict'

const 
  path = require('path'),
  fs = require('fs')

function Resource(resPath, defaultData, syncRead) {
  let _stringData = ''
  this.path = path.resolve(resPath)
  this.watcher = null
  this.readFunc = syncRead ? fs.readFileSync : fs.readFile
  Object.defineProperty(this, 'stringData', {
    enumerable: false,
    configurable: false,
    get: function () {
      return _stringData ? _stringData : defaultData
    },
    set: function (newData) {
      _stringData = newData
      if (this.watcher) this.watcher.close()
      this.watcher = fs.watch(this.path, this.watchChangeHandler.bind(this))
    }
  })
  // init
  this.stringData = this.readFunc(this.path, this.changeHandler.bind(this))
}

Resource.prototype.changeHandler = function (err, data) {
  this.stringData = data.toString()
}
Resource.prototype.watchChangeHandler = function (eventType, fileName) {
  if ('change' === eventType) {
    this.stringData = this.readFunc(this.path, this.changeHandler.bind(this))
  }
}

module.exports.Resource = Resource
