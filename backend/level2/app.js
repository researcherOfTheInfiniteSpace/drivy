var express = require('express');
var main = require('./main.js')
const writeJsonFile = require('write-json-file');
var app = express();

app.get('/', function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    writeJsonFile('outputFromMainJs.json', main.getRentalsList()).then(() => {
        res.end('Rentals List done!');
    });
});
app.listen(8080);
