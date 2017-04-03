'use strict'

const 
  http = require('http'),
  fs = require('fs'),
  path = require('path'),
  Resource = require('./modules/resource.js').Resource,
  PORT = 5999

const html = new Resource('public/index.html', '<div>no data availablet</div>')
const js = new Resource('public/js/app.js')

const reqList = fs.readdirSync(path.resolve('design/requirements/'))
console.log(`reqList: ${reqList}`)
console.log(`reqList JSON: ${JSON.stringify(reqList)}`)

function handleHTML (res) {
  res.end(html.stringData)
}

function handleResourceRequest (route, res) {
  switch(route[0]) {
    case 'app.js': res.end(js.stringData); break
    default: handleHTML(res)
  }
}

function handleAPIRequest (route, res) {
  switch (route[0]) {
    case 'requirements': handleRequirements(route.slice(1), res); break
    default: handleHTML(res)
  }
}

function handleRequirements (route, res) {
  switch (route[0]) {
    case 'list': 
      res.writeHead(200, {'Content-Type': 'application/json'})
      res.write(JSON.stringify({reqList}))
      res.end()
      break;
    default: handleHTML(res)
  }
}

function handleRequest (req, res) {
  console.log(`handleRequest: ${req.url}`)
  const route = req.url.split('/').slice(1)
  if (2 > route.length) {
    handleResourceRequest(route, res)
  } else {
    handleAPIRequest(route, res)
  }

}

const server = http.createServer(handleRequest)

server.listen(PORT, () => {
  console.log(`server listening at: http://localhost:${PORT}`)
})
