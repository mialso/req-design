'use strict'

const 
  http = require('http'),
  fs = require('fs'),
  path = require('path'),
  PORT = 5999

let indexHTML = {
  dataString: '<div>no data available at the moment</div>',
  path: path.resolve('public/index.html'),
  watcher: null
  /*
  changeHandler: () => {
    console.log(JSON.stringify(this))
  }
  */
}
let jsScript = {
  dataString: '',
  path: path.resolve('public/js/app.js'),
  watcher: null
}
function newJScallback (err, data) {
  console.log(`data read: ${data.toString()}`)
  jsScript.dataString = data.toString()
  jsScript.watcher.close()
  jsScript.watcher = fs.watch(jsScript.path, (eventType, fileName) => {
    if ('change' === eventType) {
      console.log(`change: ${fileName}`)
      fs.readFile(jsScript.path, newJScallback)
    } else {
      console.log(`not change: ${fileName}`)
    }
  })
}
function handleRequest (req, res) {
  console.log(`handleRequest: ${req.url}`)
  if (req.url.endsWith('app.js')) {
    res.end(jsScript.dataString)
  } else {
    res.end(indexHTML.dataString)
  }
}

const server = http.createServer(handleRequest)

server.on('request', (req, res) => {
  console.log(`request: ${req.url}`)
})

server.listen(PORT, () => {
  indexHTML.dataString = fs.readFileSync(indexHTML.path).toString()
  indexHTML.watcher = fs.watch(indexHTML.path)
  indexHTML.watcher.on('change', (eventType, fileName) => {
    if ('change' === eventType) {
      fs.readFile(indexHTML.path, (err, data) => {
        indexHTML.dataString = data.toString()
      })
    } else {
      console.log('not change')
    }
  })
  indexHTML.watcher.on('rename', (eventType, fileName) => {
    if ('rename' === eventType) {
      fs.readFile(indexHTML.path, (err, data) => {
        indexHTML.dataString = data.toString()
      })
    } else {
      console.log('not rename')
    }
  })
  jsScript.dataString = fs.readFileSync(jsScript.path).toString()
  //jsScript.watcher = fs.watch(jsScript.path)
  jsScript.watcher = fs.watch(jsScript.path, (eventType, fileName) => {
  //jsScript.watcher.on('change', (eventType, fileName) => {
    if ('change' === eventType) {
      console.log(`change: ${fileName}`)
      fs.readFile(jsScript.path, newJScallback)
    } else {
      console.log(`not change: ${fileName}`)
    }
  })
  console.log(`server listening at: http://localhost:${PORT}`)
})
