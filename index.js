'use strict'

const 
  http = require('http'),
  fs = require('fs'),
  path = require('path'),
  Resource = require('./modules/resource.js').Resource,
  PORT = 5999

const html = new Resource('public/index.html', '<div>no data availablet</div>')
const js = new Resource('public/app.js')
const css = new Resource('public/app.css')

const reqList = fs.readdirSync(path.resolve('design/requirements/')).filter(name => !name.startsWith('.') && name.endsWith('.json'))
console.log(`reqList: ${reqList}`)
console.log(`reqList JSON: ${JSON.stringify(reqList)}`)

function handleHTML (res) {
  res.setHeader('Content-Type', 'text/html');
  res.end(html.stringData);
}

function handleResourceRequest (route, res) {
  switch(route[0]) {
    case 'app.js': {
      res.setHeader('Content-Type', 'application/javascript');
      res.end(js.stringData);
      break;
    }
    case 'app.css': {
      res.setHeader('Content-Type', 'text/css');
      res.end(css.stringData);
      break;
    }
    default: handleHTML(res)
  }
}

function handleAPIRequest (route, res) {
  switch (route[0]) {
    case 'requirements': handleRequirements(route.slice(1), res); break
    default: handleHTML(res)
  }
}

function handleRequirement (route, res) {
  const filePath = path.resolve('design/requirements', route[1])
  fs.stat(filePath, function (err, stat) {
    if (err) {
      console.log('[ERROR]: '+err.toString())
      res.writeHead(500, {'Content-Type': 'text/html'})
      res.end(err)
    } else {
      res.writeHead(
        200, 
        {
          'Content-Type': 'application/json',
          'Content-Length': stat.size
        }
      )
      fs.createReadStream(filePath).pipe(res)
    }
  })
}

function handleRequirements (route, res) {
  switch (route[0]) {
    case 'list': 
      res.writeHead(200, {'Content-Type': 'application/json'})
      res.write(JSON.stringify({reqList}))
      res.end()
      break
    case 'byName':
      handleRequirement (route, res); break
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
