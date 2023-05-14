const express=require('express');
const route=express.Router();

route.get('/', function(req, res) {
    res.statusCode=200;
    res.send("hello Classy"); 
  });

module.exports = route;