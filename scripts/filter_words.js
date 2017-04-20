#!/usr/bin/node

'use strict';

const fs = require('fs');
const path = require('path');

const reqPathConf = './design/requirements/';

const reqPath = path.resolve(process.cwd(), reqPathConf);
console.log();

const words = [];
let filtered = 0;

fs.readdirSync(reqPath)
  .filter(item => !item.startsWith('.'))
  .forEach((fileName) => {
    console.log(`reading ${fileName}...`);
    fs.readFileSync(path.resolve(reqPath, fileName))
      .toString()
      .split('\n')
      .forEach((line) => {
        line.split(' ').forEach((word) => {
          if (words.indexOf(word) !== -1 || word.length < 3) {
            filtered += 1;
            return;
          }
          words.push(word);
        });
      });
  });

const wordsResult = words.map((word) => {
  if (word.endsWith(',')) return word.slice(0, -1);
  return word;
});

wordsResult.forEach((word, index) => {
  console.log(`${index}: ${word}`);
});
console.log(`filtered: ${filtered}`);
