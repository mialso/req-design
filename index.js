'use strict'

const 
  http = require('http'),
  fs = require('fs'),
  path = require('path'),
  Resource = require('./modules/resource.js').Resource,
  PORT = 5999

const html = new Resource('public/index.html', '<div>no data availablet</div>')
const js = new Resource('public/js/app.js')

function handleRequest (req, res) {
  console.log(`handleRequest: ${req.url}`)
  if (req.url.endsWith('app.js')) {
    res.end(js.stringData)
  } else {
    res.end(html.stringData)
  }
}

const server = http.createServer(handleRequest)

server.on('request', (req, res) => {
  console.log(`request: ${req.url}`)
})

server.listen(PORT, () => {
  console.log(`server listening at: http://localhost:${PORT}`)
})
