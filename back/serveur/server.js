const express=require('express');
const route=require('./routes/back')
const app=express();
app.use(express.json())
app.use('/',route)
app.listen(5000,()=>
console.log('connection is set up on Port 5000'));