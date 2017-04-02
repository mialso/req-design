'use strict'

const
  spawn = require('child_process').spawnSync,
  userName = spawn('git', [ 'config', 'user.name' ]).stdout.toString(),
  userEmail = spawn('git', [ 'config', 'user.email' ]).stdout.toString()

console.log(`name: ${userName}`)
console.log(`email: ${userEmail}`)
