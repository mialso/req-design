#!/usr/bin/node
'use strict'

const fs = require('fs')
const path = require('path')

const reqPathConf = './design/requirements/'

const reqPath = path.resolve(process.cwd(), reqPathConf)
console.log()

const words = []
let filtered = 0

fs.readdirSync(reqPath)
  .filter((item) => { return !item.startsWith('.') })
  .forEach((fileName) => {
    console.log(`reading ${fileName}...`)
    fs.readFileSync(path.resolve(reqPath, fileName))
      .toString()
      .split('\n')
      .forEach((line) => {
         line.split(' ').forEach((word) => {
           if (-1 !== words.indexOf(word)) {
             ++filtered
             return
           }
           words.push(word)
         })
      })
  })

console.log('i am node')
words.forEach((word, index) => {
  console.log(`${index}: ${word}`)
})
console.log(`filtered: ${filtered}`)
